"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { rules } from "@/utils/validationRules";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import { EyeIcon, EyeOffIcon } from "@/components/icons/EyeIcon";

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
    else if (!new RegExp(rules.firstName.regex).test(form.first_name)) e.first_name = rules.firstName.message + " *";
    
    if (!form.last_name) e.last_name = "Required *";
    else if (!new RegExp(rules.lastName.regex).test(form.last_name)) e.last_name = rules.lastName.message + " *";
    
    if (!form.email) e.email = "Required *";
    else if (!new RegExp(rules.email.regex).test(form.email)) e.email = rules.email.message + " *";
    
    if (!form.password) e.password = "Required *";
    else if (!new RegExp(rules.password.regex).test(form.password)) e.password = rules.password.message + " *";
    
    if (!form.confirm_password) e.confirm_password = "Required *";
    else if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match *";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    let val = e.target.value;
    val = val.replace(/[^A-Za-z ]/g, "");
    if (field === "first_name" || field === "last_name") {
      if (val.startsWith(" ")) val = val.trimStart();
    }
    setForm({ ...form, [field]: val });
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
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={form.first_name} 
                onChange={(e) => handleNameChange(e, "first_name")}
                maxLength={rules.firstName.maxLength}
                className={`w-full p-2 border rounded ${errors.first_name ? 'border-red-500' : 'border-slate-300'}`} 
              />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={form.last_name} 
                onChange={(e) => handleNameChange(e, "last_name")}
                maxLength={rules.lastName.maxLength}
                className={`w-full p-2 border rounded ${errors.last_name ? 'border-red-500' : 'border-slate-300'}`} 
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-slate-300'}`} 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className={`w-full p-2 border rounded pr-10 ${errors.password ? 'border-red-500' : 'border-slate-300'}`} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <PasswordStrengthMeter password={form.password} />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={form.confirm_password}
                onChange={(e) => setForm({...form, confirm_password: e.target.value})}
                className={`w-full p-2 border rounded pr-10 ${errors.confirm_password ? 'border-red-500' : 'border-slate-300'}`} 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
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
