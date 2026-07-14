"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { IconAlertCircle, IconEye, IconEyeOff, IconLoader2, IconLock, IconMail, IconShieldCheck } from "@tabler/icons-react";
import { toast, Toaster } from "sonner";
import { AuthError, AuthService } from "@/lib/services/auth.service";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import "@/styles/admin-theme.css";

function messageFor(error: unknown) {
  if (!(error instanceof AuthError)) return "Đã có lỗi xảy ra. Vui lòng thử lại.";
  if (error.code === "invalid_credentials") return "Email hoặc mật khẩu không chính xác.";
  if (error.code === "account_inactive") return "Tài khoản này chưa được cấp quyền quản trị.";
  if (error.code === "network") return "Không có kết nối mạng. Vui lòng kiểm tra lại.";
  return error.message;
}

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
    if (searchParams.get("reason") === "session_expired") setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (searchParams.get("reason") === "not_configured") setError("Dự án chưa được cấu hình Supabase.");
  }, [searchParams]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.signInWithPassword({ identifier: email, password });
      toast.success("Đăng nhập thành công");
      router.replace("/admin");
      router.refresh();
    } catch (signInError) {
      setError(messageFor(signInError));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email.trim()) {
      setError("Nhập email quản trị để nhận liên kết đặt lại mật khẩu.");
      emailRef.current?.focus();
      return;
    }
    if (!isSupabaseConfigured) return setError("Dự án chưa được cấu hình Supabase.");
    const redirectTo = `${window.location.origin}/admin/login`;
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (resetError) return setError(resetError.message);
    toast.success("Đã gửi liên kết đặt lại mật khẩu đến email của bạn.");
  };

  return (
    <div className="admin-theme grid min-h-screen bg-[#F7F5F2] lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <Image src="/images/campaign/campaign_4.png" alt="Soft Muse officewear" fill priority sizes="55vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em]">Soft Muse Officewear</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight xl:text-5xl">Vận hành cửa hàng nhẹ nhàng, chính xác mỗi ngày.</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/80">Quản lý sản phẩm, đơn hàng, khách hàng và tồn kho trong một không gian bảo mật.</p>
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9">
            <div className="inline-flex items-baseline gap-2 text-[#171717]">
              <span className="text-2xl font-semibold tracking-[0.14em]">SOFT MUSE</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A77958]">Admin</span>
            </div>
            <h2 className="mt-9 text-3xl font-semibold text-[#1D1D1B]">Đăng nhập quản trị</h2>
            <p className="mt-2 text-sm text-[#746F69]">Sử dụng tài khoản nhân viên đã được cấp quyền.</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-5 flex gap-3 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <IconAlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>Thiếu biến môi trường Supabase. Xem tệp <strong>.env.example</strong> để cấu hình.</span>
            </div>
          )}
          {error && (
            <div role="alert" className="mb-5 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <IconAlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#383532]">Email quản trị</span>
              <span className="relative block">
                <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A938C]" size={18} />
                <input ref={emailRef} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@softmuse.vn" className="h-12 w-full border border-[#D9D3CC] bg-white pl-11 pr-4 text-sm text-[#1D1D1B] outline-none transition focus:border-[#A77958] focus:ring-2 focus:ring-[#A77958]/15" />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#383532]">Mật khẩu</span>
              <span className="relative block">
                <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A938C]" size={18} />
                <input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full border border-[#D9D3CC] bg-white pl-11 pr-12 text-sm text-[#1D1D1B] outline-none transition focus:border-[#A77958] focus:ring-2 focus:ring-[#A77958]/15" />
                <button type="button" title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-[#746F69] hover:text-[#1D1D1B]">
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </span>
            </label>
            <div className="flex justify-end">
              <button type="button" onClick={() => void resetPassword()} className="text-xs font-semibold text-[#8D6448] hover:underline">Quên mật khẩu?</button>
            </div>
            <button type="submit" disabled={loading || !isSupabaseConfigured} className="flex h-12 w-full items-center justify-center gap-2 bg-[#1D1D1B] text-sm font-semibold text-white transition hover:bg-[#A77958] disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? <><IconLoader2 className="animate-spin" size={18} /> Đang đăng nhập</> : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-7 flex items-center gap-2 text-xs text-[#746F69]">
            <IconShieldCheck size={17} className="text-[#8D6448]" />
            Phiên đăng nhập được bảo vệ bởi Supabase Auth.
          </div>
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
