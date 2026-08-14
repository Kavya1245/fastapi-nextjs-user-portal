"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { rules } from "@/utils/validationRules";
import { EyeIcon, EyeOffIcon } from "@/components/icons/EyeIcon";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required *";
    else if (!new RegExp(rules.email.regex).test(email)) e.email = rules.email.message + " *";
    if (!password) e.password = "Password is required *";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError("");
    setSuccessMsg("");
    if (!validate()) return;
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err: any) {
      setApiError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Login</h1>
        {apiError && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{apiError}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-sm font-semibold">{successMsg}</div>}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-slate-300'}`} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 border rounded pr-10 ${errors.password ? 'border-red-500' : 'border-slate-300'}`} />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 focus:outline-none">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">Login</button>
          {/* L-002 Fixed: Escaped apostrophe */}
          <p className="text-center text-sm text-slate-600">Don&apos;t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign Up</Link></p>
        </form>
      </div>
    </div>
  );
}
