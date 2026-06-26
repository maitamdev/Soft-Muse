import os
import shutil
import glob

brain_dir = r"C:\Users\ٍSalahKhaled\.gemini\antigravity-ide\brain\5412d76c-5e53-47e3-9724-7421d79f4e51"
public_dir = r"d:\Aura-Brand\public\images"

# Target structure
folders = ["campaign", "products", "flatlay", "detail", "lifestyle"]
for folder in folders:
    os.makedirs(os.path.join(public_dir, folder), exist_ok=True)

# Mapping of file search patterns to target files
asset_mappings = {
    "campaign_1*.png": ("campaign", "campaign_1.png"),
    "campaign_2*.png": ("campaign", "campaign_2.png"),
    "campaign_3*.png": ("campaign", "campaign_3.png"),
    "campaign_4*.png": ("campaign", "campaign_4.png"),
    "campaign_5*.png": ("campaign", "campaign_5.png"),
    "campaign_6*.png": ("campaign", "campaign_6.png"),
    "flatlay_1*.png": ("flatlay", "flatlay_1.png"),
    "flatlay_2*.png": ("flatlay", "flatlay_2.png"),
    "detail_fabric*.png": ("detail", "detail_fabric.png"),
    "lifestyle_interior*.png": ("lifestyle", "lifestyle_interior.png"),
    "product_evening_gown*.png": ("products", "product_evening_gown.png"),
    "product_linen_set*.png": ("products", "product_linen_set.png"),
    "product_silk_blouse*.png": ("products", "product_silk_blouse.png"),
    "product_winter_coat*.png": ("products", "product_winter_coat.png"),
    "product_leather_bag*.png": ("products", "product_leather_bag.png"),
    "product_stiletto*.png": ("products", "product_stiletto.png"),
    "product_necklace*.png": ("products", "product_necklace.png")
}

print("Starting asset organization...")
for pattern, (folder, dest_name) in asset_mappings.items():
    search_path = os.path.join(brain_dir, pattern)
    found_files = glob.glob(search_path)
    if found_files:
        # Use the most recent file if multiple exist
        src_file = max(found_files, key=os.path.getmtime)
        dest_path = os.path.join(public_dir, folder, dest_name)
        shutil.copy(src_file, dest_path)
        print(f"Copied {os.path.basename(src_file)} -> {dest_path}")
    else:
        print(f"No file found matching pattern: {pattern}")

print("Asset organization completed.")
