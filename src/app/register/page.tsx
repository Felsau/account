"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-18 h-18 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl mb-5 shadow-2xl shadow-emerald-600/25">
            <span className="text-4xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">สมัครสมาชิก</h1>
          <p className="text-slate-400 text-sm mt-2">สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/7 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-300 text-sm flex items-center gap-2 font-medium">
                <span className="text-rose-400">⚠️</span>
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                ชื่อ
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อของคุณ"
                required
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  required
                  minLength={6}
                  className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  required
                  minLength={6}
                  className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-emerald-500/50 disabled:to-teal-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 hover:shadow-2xl hover:shadow-emerald-600/30"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  กำลังสมัครสมาชิก...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  สมัครสมาชิก
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-8">
          © 2026 ระบบบัญชี — Felsau
        </p>
      </div>
    </div>
  );
}
