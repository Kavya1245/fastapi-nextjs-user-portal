"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", confirm_password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.first_name) e.first_name = "Required *";
    else if (!/^[A-Za-z]{1,20}$/.test(form.first_name)) e.first_name = "1-20 Alphabets only *";
    if (!form.last_name) e.last_name = "Required *";
    else if (!/^[A-Za-z]{1,15}$/.test(form.last_name)) e.last_name = "1-15 Alphabets only *";
    if (!form.email) e.email = "Required *";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email *";
    if (!form.password) e.password = "Required *";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(form.password))
      e.password = "Min 6 chars, 1 Upper, 1 Lower, 1 Digit, 1 Symbol (@$!%*?&) *";
    if (!form.confirm_password) e.confirm_password = "Required *";
    else if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match *";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError("");
    setSuccessMsg("");
    if (!validate()) return;
    try {
      await api.post("/signup", form);
      setSuccessMsg("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setApiError(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-[500px]">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Sign Up</h1>
        {apiError && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{apiError}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-sm font-semibold">{successMsg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
              <input type="text" onChange={(e) => setForm({...form, first_name: e.target.value})}
                className={`w-full p-2 border rounded ${errors.first_name ? 'border-red-500' : 'border-slate-300'}`} />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name <span className="text-red-500">*</span></label>
              <input type="text" onChange={(e) => setForm({...form, last_name: e.target.value})}
                className={`w-full p-2 border rounded ${errors.last_name ? 'border-red-500' : 'border-slate-300'}`} />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" onChange={(e) => setForm({...form, email: e.target.value})}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-slate-300'}`} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                onChange={(e) => setForm({...form, password: e.target.value})}
                className={`w-full p-2 border rounded pr-10 ${errors.password ? 'border-red-500' : 'border-slate-300'}`} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 focus:outline-none"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                onChange={(e) => setForm({...form, confirm_password: e.target.value})}
                className={`w-full p-2 border rounded pr-10 ${errors.confirm_password ? 'border-red-500' : 'border-slate-300'}`} 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 focus:outline-none"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 font-semibold">Sign Up</button>
          <p className="text-center text-sm text-slate-600">Already have an account? <Link href="/" className="text-purple-600 hover:underline">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
