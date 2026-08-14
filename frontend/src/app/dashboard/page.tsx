"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import { rules, sanitizeName } from "@/utils/validationRules";

interface User { id: string; first_name: string; last_name: string; email: string; created_at?: string; }

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }
    fetchMyDetails();
  }, [router]);

  const fetchMyDetails = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("access_token");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    if (user) {
      setForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
      setFormErrors({});
      setShowModal(true);
    }
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.first_name) e.first_name = "Required *";
    else if (!new RegExp(rules.firstName.regex).test(form.first_name)) e.first_name = rules.firstName.message + " *";
    
    if (!form.last_name) e.last_name = "Required *";
    else if (!new RegExp(rules.lastName.regex).test(form.last_name)) e.last_name = rules.lastName.message + " *";
    
    if (!form.email) e.email = "Required *";
    else if (!new RegExp(rules.email.regex).test(form.email)) e.email = rules.email.message + " *";
    
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;
    
    try {
      await api.put(`/users/${user.id}`, { 
        first_name: form.first_name, 
        last_name: form.last_name, 
        email: form.email 
      });
      setShowModal(false);
      fetchMyDetails();
    } catch (err: any) { 
      setFormErrors({ email: err.response?.data?.detail || "Update failed." });
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!user) return;
    try {
      await api.delete(`/users/${user.id}`);
      localStorage.removeItem("access_token");
      router.push("/");
    } catch (err) { alert("Failed to delete account."); }
    setShowDeleteConfirm(false);
  };

  const handleLogoutConfirmed = () => {
    localStorage.removeItem("access_token");
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="font-bold text-slate-800 text-lg">UserPortal</span>
            </div>
            <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 mt-1">Manage your profile details and account preferences.</p>
          </div>

          {user && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="text-white">
                  <h2 className="text-2xl font-bold capitalize">{user.first_name} {user.last_name}</h2>
                  <p className="text-indigo-100 text-sm font-medium mt-1">{user.email}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                  <button onClick={openEditModal} className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white border border-white/30 px-5 py-2.5 rounded-lg hover:bg-white/20 font-semibold transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 14.25v4.875a2.625 2.625 0 01-2.625 2.625H5.625a2.625 2.625 0 01-2.625-2.625V8.625A2.625 2.625 0 015.625 6H10.5" />
                    </svg>
                    Edit Profile
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center justify-center bg-red-500/90 text-white border border-red-400 px-5 py-2.5 rounded-lg hover:bg-red-500 font-semibold transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>

              <div className="px-8 py-8">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">First Name</span>
                    <span className="text-slate-800 font-medium text-lg capitalize">{user.first_name}</span>
                  </div>
                  <div className="flex flex-col bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Last Name</span>
                    <span className="text-slate-800 font-medium text-lg capitalize">{user.last_name}</span>
                  </div>
                  <div className="flex flex-col bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Email Address</span>
                    <span className="text-slate-800 font-medium text-lg break-all">{user.email}</span>
                  </div>
                  <div className="flex flex-col bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Member Since</span>
                    <span className="text-slate-800 font-medium text-lg">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && user && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">First Name <span className="text-red-500">*</span></label>
                  <input 
                    placeholder="John" 
                    value={form.first_name} 
                    onChange={(e) => setForm({...form, first_name: sanitizeName(e.target.value)})} 
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition-all ${formErrors.first_name ? 'border-red-500' : 'border-slate-200'}`} 
                  />
                  {formErrors.first_name && <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input 
                    placeholder="Doe" 
                    value={form.last_name} 
                    onChange={(e) => setForm({...form, last_name: sanitizeName(e.target.value)})} 
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition-all ${formErrors.last_name ? 'border-red-500' : 'border-slate-200'}`} 
                  />
                  {formErrors.last_name && <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={form.email} 
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition-all ${formErrors.email ? 'border-red-500' : 'border-slate-200'}`} 
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-sm">
                  Save Changes
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg hover:bg-slate-200 font-semibold transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={showLogoutConfirm} title="Confirm Logout" message="Are you sure you want to log out of your account?" onConfirm={handleLogoutConfirmed} onCancel={() => setShowLogoutConfirm(false)} />
      <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Account" message="Are you sure you want to delete your account permanently? This action cannot be undone." onConfirm={handleDeleteConfirmed} onCancel={() => setShowDeleteConfirm(false)} />
    </div>
  );
}
