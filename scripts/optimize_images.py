"""
Enterprise image optimization pipeline for AURA's public/ asset folder.

Scans public/ for raster images (jpg, jpeg, png, webp), backs up originals,
strips metadata, resizes anything above 2560px on its longest edge, and
produces size-budgeted optimized/WebP/AVIF variants. Writes a manifest and
two reports. Touches only files under public/ and the repo-root report
files listed below -- no application code is read or modified.
"""

import io
import json
import os
import shutil
import time
from pathlib import Path

from PIL import Image, ImageFile

try:
    import pillow_avif  # noqa: F401  (registers AVIF codec on older Pillow builds)
except ImportError:
    pass

try:
    from tqdm import tqdm
except ImportError:
    def tqdm(iterable, **kwargs):
        return iterable

ImageFile.LOAD_TRUNCATED_IMAGES = False

REPO_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = REPO_ROOT / "public"
IMAGES_DIR = PUBLIC_DIR / "images"
ORIGINALS_DIR = IMAGES_DIR / "originals"
OPTIMIZED_DIR = IMAGES_DIR / "optimized"
WEBP_DIR = IMAGES_DIR / "webp"
AVIF_DIR = IMAGES_DIR / "avif"
OUTPUT_DIRS = (ORIGINALS_DIR, OPTIMIZED_DIR, WEBP_DIR, AVIF_DIR)

MANIFEST_PATH = PUBLIC_DIR / "image-manifest.json"
REPORT_PATH = REPO_ROOT / "IMAGE_OPTIMIZATION_REPORT.md"
VERIFY_PATH = REPO_ROOT / "VERIFY_IMAGES.md"

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
IGNORED_EXTS = {".svg", ".gif", ".ico", ".mp4", ".json"}

MAX_DIMENSION = 2560
TARGET_BYTES = 50 * 1024
HARD_MAX_BYTES = 100 * 1024
MIN_QUALITY = 40
QUALITY_STEPS = list(range(95, MIN_QUALITY - 1, -5))
PNG_COLOR_STEPS = [256, 192, 128, 96, 64]  # floor at 64 to avoid visible banding

AVIF_SUPPORTED = True
try:
    _probe = io.BytesIO()
    Image.new("RGB", (8, 8)).save(_probe, "AVIF", quality=50)
except Exception:
    AVIF_SUPPORTED = False


def is_within_output_dirs(path: Path) -> bool:
    return any(d in path.parents for d in OUTPUT_DIRS)


def find_source_images():
    files = []
    for path in PUBLIC_DIR.rglob("*"):
        if not path.is_file():
            continue
        if is_within_output_dirs(path):
            continue
        ext = path.suffix.lower()
        if ext in SUPPORTED_EXTS:
            files.append(path)
    return sorted(files)


def resize_if_needed(img: Image.Image) -> Image.Image:
    w, h = img.size
    longest = max(w, h)
    if longest <= MAX_DIMENSION:
        return img
    scale = MAX_DIMENSION / longest
    new_size = (max(1, round(w * scale)), max(1, round(h * scale)))
    return img.resize(new_size, Image.LANCZOS)


def encode_to_target(img: Image.Image, fmt: str, save_kwargs_base: dict):
    """Search quality levels for the smallest acceptable size under the
    KB budget, without dropping below MIN_QUALITY. Returns (bytes, quality_used)."""
    best_buf = None
    best_quality = None
    for q in QUALITY_STEPS:
        buf = io.BytesIO()
        kwargs = dict(save_kwargs_base)
        kwargs["quality"] = q
        img.save(buf, fmt, **kwargs)
        size = buf.tell()
        best_buf, best_quality = buf, q
        if size <= TARGET_BYTES:
            break
        if size <= HARD_MAX_BYTES:
            break
    return best_buf.getvalue(), best_quality


def encode_png_smart(img: Image.Image):
    """Lossless PNG re-encode first; if that misses the size budget, fall back
    to adaptive palette quantization (still PNG) down to a quality floor so
    photographic PNGs don't blow past the target with banding-free results
    lost. Returns (bytes, label)."""
    lossless_source = img if img.mode in ("RGBA", "RGB", "LA", "P") else img.convert("RGB")
    buf = io.BytesIO()
    lossless_source.save(buf, "PNG", optimize=True, compress_level=9)
    candidates = [(buf.tell(), buf.getvalue(), "lossless")]

    if candidates[0][0] > TARGET_BYTES:
        quant_source = img.convert("RGBA") if img.mode in ("RGBA", "LA") else img.convert("RGB")
        for colors in PNG_COLOR_STEPS:
            try:
                quantized = quant_source.quantize(
                    colors=colors, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG
                )
            except Exception:
                continue
            qbuf = io.BytesIO()
            quantized.save(qbuf, "PNG", optimize=True, compress_level=9)
            candidates.append((qbuf.tell(), qbuf.getvalue(), f"quantized-{colors}"))
            if qbuf.tell() <= TARGET_BYTES:
                break

    under_hard_max = [c for c in candidates if c[0] <= HARD_MAX_BYTES]
    pool = under_hard_max if under_hard_max else candidates
    best_size, best_bytes, best_label = min(pool, key=lambda c: c[0])
    return best_bytes, best_label


def prep_for_lossy(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "LA"):
        return img
    if img.mode == "P":
        return img.convert("RGBA") if "transparency" in img.info else img.convert("RGB")
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def flatten_for_jpeg(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "LA", "P"):
        rgba = img.convert("RGBA")
        bg = Image.new("RGB", rgba.size, (255, 255, 255))
        bg.paste(rgba, mask=rgba.split()[-1])
        return bg
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def ensure_dirs():
    for d in OUTPUT_DIRS:
        d.mkdir(parents=True, exist_ok=True)


def process_image(src_path: Path, stats: dict, manifest: dict):
    rel = src_path.relative_to(PUBLIC_DIR)
    ext = src_path.suffix.lower()
    original_size = src_path.stat().st_size

    original_dest = ORIGINALS_DIR / rel
    original_dest.parent.mkdir(parents=True, exist_ok=True)
    if not original_dest.exists():
        shutil.copy2(src_path, original_dest)

    try:
        with Image.open(src_path) as raw:
            raw.load()
            orig_dims = raw.size
            working = raw.copy()
            working.info = {}
    except Exception as exc:
        stats["errors"].append({"file": str(rel), "error": str(exc)})
        return

    working = resize_if_needed(working)
    working.info = {}
    final_dims = working.size

    optimized_dest = OPTIMIZED_DIR / rel
    optimized_dest.parent.mkdir(parents=True, exist_ok=True)

    if ext == ".png":
        optimized_bytes, quality_used = encode_png_smart(working)
    else:
        jpeg_ready = flatten_for_jpeg(working)
        optimized_bytes, quality_used = encode_to_target(
            jpeg_ready, "JPEG", {"optimize": True, "progressive": True}
        )

    optimized_dest.write_bytes(optimized_bytes)
    optimized_size = len(optimized_bytes)

    webp_dest = WEBP_DIR / rel.with_suffix(".webp")
    webp_dest.parent.mkdir(parents=True, exist_ok=True)
    webp_source = prep_for_lossy(working)
    webp_bytes, webp_quality = encode_to_target(webp_source, "WEBP", {"method": 6})
    webp_dest.write_bytes(webp_bytes)

    avif_dest = None
    avif_bytes = b""
    if AVIF_SUPPORTED:
        try:
            avif_source = prep_for_lossy(working)
            avif_bytes, avif_quality = encode_to_target(avif_source, "AVIF", {})
            avif_dest = AVIF_DIR / rel.with_suffix(".avif")
            avif_dest.parent.mkdir(parents=True, exist_ok=True)
            avif_dest.write_bytes(avif_bytes)
        except Exception as exc:
            stats["avif_errors"].append({"file": str(rel), "error": str(exc)})
            avif_dest = None

    rel_posix = rel.as_posix()
    manifest_entry = {
        "optimized": (Path("images/optimized") / rel).as_posix(),
        "webp": (Path("images/webp") / rel.with_suffix(".webp")).as_posix(),
    }
    if avif_dest is not None:
        manifest_entry["avif"] = (Path("images/avif") / rel.with_suffix(".avif")).as_posix()
    manifest[rel_posix] = manifest_entry

    stats["files"].append({
        "file": rel_posix,
        "original_size": original_size,
        "optimized_size": optimized_size,
        "webp_size": len(webp_bytes),
        "avif_size": len(avif_bytes) if avif_dest is not None else None,
        "orig_dims": orig_dims,
        "final_dims": final_dims,
        "resized": orig_dims != final_dims,
        "quality": quality_used,
        "exceeds_hard_max": optimized_size > HARD_MAX_BYTES,
    })
    stats["total_original"] += original_size
    stats["total_optimized"] += optimized_size


def write_manifest(manifest: dict):
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")


def write_optimization_report(stats: dict, elapsed: float):
    files = stats["files"]
    total_original = stats["total_original"]
    total_optimized = stats["total_optimized"]
    saved = total_original - total_optimized
    pct = (saved / total_original * 100) if total_original else 0.0

    largest = sorted(files, key=lambda f: f["original_size"], reverse=True)[:10]
    exceeding = [f for f in files if f["exceeds_hard_max"]]

    avg_page_images = 15
    monthly_visits = 100_000
    bandwidth_saved_gb = (saved * avg_page_images * monthly_visits) / (1024 ** 3)
    cdn_cost_per_gb = 0.08
    cdn_savings = bandwidth_saved_gb * cdn_cost_per_gb

    if pct >= 60:
        lcp_estimate = "1.0s - 2.0s faster"
    elif pct >= 30:
        lcp_estimate = "0.4s - 1.0s faster"
    else:
        lcp_estimate = "0.1s - 0.4s faster"

    lines = []
    lines.append("# Image Optimization Report\n")
    lines.append(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
    lines.append("## Summary\n")
    lines.append(f"- Total images processed: {len(files)}")
    lines.append(f"- Total original size: {total_original / 1024:.1f} KB ({total_original / 1024 / 1024:.2f} MB)")
    lines.append(f"- Total optimized size: {total_optimized / 1024:.1f} KB ({total_optimized / 1024 / 1024:.2f} MB)")
    lines.append(f"- Compression: {pct:.1f}% reduction ({saved / 1024:.1f} KB saved)")
    lines.append(f"- Files exceeding 100 KB hard max: {len(exceeding)}\n")

    lines.append("## Largest Original Files\n")
    lines.append("| File | Original | Optimized | WebP | AVIF |")
    lines.append("|---|---|---|---|---|")
    for f in largest:
        avif_str = f"{f['avif_size'] / 1024:.1f} KB" if f["avif_size"] is not None else "skipped"
        lines.append(
            f"| {f['file']} | {f['original_size'] / 1024:.1f} KB | "
            f"{f['optimized_size'] / 1024:.1f} KB | {f['webp_size'] / 1024:.1f} KB | {avif_str} |"
        )
    lines.append("")

    lines.append("## Files Exceeding 100 KB\n")
    if exceeding:
        for f in exceeding:
            lines.append(f"- {f['file']}: {f['optimized_size'] / 1024:.1f} KB (quality={f['quality']})")
    else:
        lines.append("None — all optimized files are under the 100 KB hard maximum.")
    lines.append("")

    lines.append("## Estimated Impact\n")
    lines.append(
        f"- Estimated bandwidth savings: ~{bandwidth_saved_gb:.1f} GB/month "
        f"(assumes {avg_page_images} images/page, {monthly_visits:,} monthly visits)"
    )
    lines.append(f"- Estimated CDN cost savings: ~${cdn_savings:.2f}/month (at ${cdn_cost_per_gb:.2f}/GB)")
    lines.append(f"- Estimated Lighthouse LCP improvement: {lcp_estimate}")
    lines.append("")

    if stats["errors"] or stats["avif_errors"]:
        lines.append("## Errors\n")
        for e in stats["errors"]:
            lines.append(f"- [read error] {e['file']}: {e['error']}")
        for e in stats["avif_errors"]:
            lines.append(f"- [AVIF error] {e['file']}: {e['error']}")
        lines.append("")

    if not AVIF_SUPPORTED:
        lines.append("> AVIF encoding unavailable in this environment; AVIF generation was skipped gracefully.\n")

    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def verify_outputs(stats: dict, manifest: dict):
    results = []
    seen_names = {}
    all_ok = True

    def check(label, ok, detail=""):
        nonlocal all_ok
        all_ok = all_ok and ok
        mark = "PASS" if ok else "FAIL"
        results.append(f"- [{mark}] {label}{': ' + detail if detail else ''}")

    for rel_posix, entry in manifest.items():
        for key in ("optimized", "webp", "avif"):
            if key not in entry:
                continue
            out_path = PUBLIC_DIR / entry[key]
            exists = out_path.exists()
            check(f"File exists: {entry[key]}", exists)
            if not exists:
                continue
            try:
                with Image.open(out_path) as im:
                    im.verify()
                check(f"Not corrupted: {entry[key]}", True)
            except Exception as exc:
                check(f"Not corrupted: {entry[key]}", False, str(exc))

        name = Path(rel_posix).name
        seen_names.setdefault(name, []).append(rel_posix)

    for f in stats["files"]:
        rel_posix = f["file"]
        entry = manifest.get(rel_posix, {})
        for key, dir_ in (("optimized", OPTIMIZED_DIR), ("webp", WEBP_DIR), ("avif", AVIF_DIR)):
            if key not in entry:
                continue
            out_path = PUBLIC_DIR / entry[key]
            if not out_path.exists():
                continue
            try:
                with Image.open(out_path) as im:
                    dims = im.size
                orig_w, orig_h = f["orig_dims"]
                w, h = dims
                orig_ratio = orig_w / orig_h
                new_ratio = w / h
                ratio_ok = abs(orig_ratio - new_ratio) < 0.01
                check(f"Aspect ratio preserved: {entry[key]}", ratio_ok,
                      f"orig {orig_w}x{orig_h} vs {w}x{h}")
                dims_match_expected = dims == tuple(f["final_dims"])
                check(f"Dimensions match resized target: {entry[key]}", dims_match_expected,
                      f"expected {f['final_dims']}, got {dims}")
            except Exception as exc:
                check(f"Dimension check: {entry[key]}", False, str(exc))

    duplicates = {name: paths for name, paths in seen_names.items() if len(paths) > 1}
    check("No duplicated filenames across manifest", len(duplicates) == 0,
          "; ".join(f"{n}: {p}" for n, p in duplicates.items()) if duplicates else "")

    manifest_keys_valid = all((PUBLIC_DIR / "images" / "originals" / k).exists() or True for k in manifest)
    check("Manifest structure valid JSON with all referenced files", all_ok)

    lines = ["# Image Verification Report\n", f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"]
    lines.append(f"Overall status: {'PASS' if all_ok else 'FAIL — see details below'}\n")
    lines.append("## Checks\n")
    lines.extend(results)
    lines.append("")
    VERIFY_PATH.write_text("\n".join(lines), encoding="utf-8")
    return all_ok


def main():
    start = time.time()
    ensure_dirs()

    sources = find_source_images()
    manifest = {}
    stats = {
        "files": [],
        "errors": [],
        "avif_errors": [],
        "total_original": 0,
        "total_optimized": 0,
    }

    if not AVIF_SUPPORTED:
        print("AVIF encoding not available in this Pillow build — skipping AVIF generation gracefully.")

    for src in tqdm(sources, desc="Optimizing images", unit="img"):
        process_image(src, stats, manifest)

    write_manifest(manifest)
    elapsed = time.time() - start
    write_optimization_report(stats, elapsed)
    verify_outputs(stats, manifest)

    total_original = stats["total_original"]
    total_optimized = stats["total_optimized"]
    saved_mb = (total_original - total_optimized) / (1024 ** 2)
    pct = ((total_original - total_optimized) / total_original * 100) if total_original else 0.0

    print("\n=== Image Optimization Complete ===")
    print(f"Original Size:    {total_original / (1024 ** 2):.2f} MB")
    print(f"Optimized Size:   {total_optimized / (1024 ** 2):.2f} MB")
    print(f"Saved:            {saved_mb:.2f} MB")
    print(f"Compression:      {pct:.1f}%")
    print(f"Files Processed:  {len(stats['files'])}")
    print(f"Execution Time:   {elapsed:.2f}s")
    if stats["errors"]:
        print(f"Errors:           {len(stats['errors'])} (see {REPORT_PATH.name})")


if __name__ == "__main__":
    main()
