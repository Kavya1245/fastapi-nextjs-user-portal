"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/forgot-password", { email });
      setMsg(res.data.message);
    } catch {
      setMsg("If an account with that email exists, a password reset link has been sent.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Forgot Password</h1>
        {msg && <div className="bg-blue-100 text-blue-700 p-2 mb-4 rounded text-sm">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded" required />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 font-semibold">Send Reset Link</button>
          <p className="text-center text-sm text-slate-600"><Link href="/" className="text-orange-600 hover:underline">Back to Login</Link></p>
        </form>
      </div>
    </div>
  );
}
