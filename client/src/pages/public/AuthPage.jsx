import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, CheckCircle2, AlertCircle, User, Lock, Mail } from 'lucide-react';

export default function AuthPage() {
  const { login, register, setActiveTab } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginView) {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          setLoggedInUserName(res.user?.full_name || 'Teman Mahir');
          setSuccessModal(true);
          setTimeout(() => {
            setSuccessModal(false);
            setActiveTab(res.user?.role === 'admin' ? 'admin-dashboard' : res.user?.role === 'tutor' ? 'tutor-dashboard' : 'student-dashboard');
          }, 2000);
        } else {
          setErrorMsg(res.error || res.message || 'Email atau kata sandi tidak cocok.');
        }
      } else {
        const res = await register(formData);
        if (res.success) {
          setLoggedInUserName(formData.full_name || 'Teman Mahir');
          setSuccessModal(true);
          setTimeout(() => {
            setSuccessModal(false);
            setActiveTab('student-dashboard');
          }, 2000);
        } else {
          setErrorMsg(res.error || res.message || 'Pendaftaran gagal. Coba lagi.');
        }
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 relative">
      
      {/* ULTRA PRO SUCCESS MODAL (NO EMOJIS) */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 text-white rounded-4xl p-8 sm:p-12 text-center max-w-md w-full border-2 border-lime shadow-popout space-y-6 relative overflow-hidden">
            
            {/* Glowing Pro Check Icon */}
            <div className="flex justify-center py-2">
              <div className="w-20 h-20 rounded-full bg-lime/20 border-2 border-lime flex items-center justify-center shadow-limeGlow">
                <CheckCircle2 className="w-10 h-10 text-lime stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-lime bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
                Authentication Success
              </span>
              <h2 className="font-verandah text-3xl sm:text-4xl text-white pt-2">
                Selamat Datang, {loggedInUserName}
              </h2>
              <p className="text-slate-300 font-semibold text-xs sm:text-sm">
                Akses dashboard Mahir Speaking Anda telah disiapkan.
              </p>
            </div>

            <div className="pt-2">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-lime h-full w-full animate-pulse"></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MAIN AUTH CARD */}
      <div className="max-w-md w-full bento-card p-6 sm:p-10 rounded-4xl sm:rounded-5xl space-y-6 border-2 border-white shadow-popout relative bg-white/95">
        
        {/* Top Header Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img src="/MP.png" alt="Mahir Speaking Logo" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="font-verandah text-3xl text-brand">
            {isLoginView ? 'Masuk Akun' : 'Daftar Akun'}
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            {isLoginView ? 'Lanjutkan latihan percakapan bahasa Inggris Anda' : 'Mulai perjalanan kelancaran berbicara hari ini'}
          </p>
        </div>

        {/* Toggle Login / Register Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setIsLoginView(true); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
              isLoginView ? 'bg-brand text-lime shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginView(false); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
              !isLoginView ? 'bg-brand text-lime shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLoginView && (
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Kata Sandi</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand text-lime font-black text-xs shadow-glow hover:bg-royal transition-all flex items-center justify-center gap-2 border border-brand/20"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>{isLoginView ? 'Masuk Sekarang' : 'Daftar Sekarang'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
