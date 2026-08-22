// Halaman AuthPage: Mengelola proses otentikasi pengguna termasuk masuk (login), daftar akun baru (register), dan tautan lupa kata sandi.
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import {
  ArrowRight, CheckCircle2, AlertCircle, User, Lock, Mail, Phone,
  Eye, EyeOff, ShieldCheck, KeyRound, Sparkles, ChevronLeft, ChevronRight,
  Globe
} from 'lucide-react';

export default function AuthPage() {
  const { login, register, googleLogin, setActiveTab } = useAuth();

  // Modes: 'login', 'register'
  const [authMode, setAuthMode] = useState('login');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [pendingTargetTab, setPendingTargetTab] = useState('lms');
  const timerRef = React.useRef(null);
  const intervalRef = React.useRef(null);

  const handleProceed = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSuccessModal(false);
    setActiveTab(pendingTargetTab || 'lms');
  }, [pendingTargetTab, setActiveTab]);

  React.useEffect(() => {
    if (successModal) {
      setCountdown(5);

      intervalRef.current = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);

      timerRef.current = setTimeout(() => {
        handleProceed();
      }, 5000);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [successModal, handleProceed]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleGoogleLoginSuccess = async (data) => {
    // data is { success: true, token, user, message } returned by backend
    setLoading(true);
    setErrorMsg('');
    try {
      const { token: jwtToken, user: loggedInUser } = data;
      const targetTab = loggedInUser.role === 'admin' ? 'admin-portal' : loggedInUser.role === 'tutor' ? 'tutor-dashboard' : 'lms';
      
      localStorage.setItem('mahir_token', jwtToken);
      localStorage.setItem('mahir_user', JSON.stringify(loggedInUser));
      localStorage.setItem('mahir_active_tab', targetTab);

      // Daftarkan ke registered_users agar fallback local tetap punya user ini
      const savedReg = JSON.parse(localStorage.getItem('mahir_registered_users') || '[]');
      if (!savedReg.some(u => u.email.toLowerCase() === loggedInUser.email.toLowerCase())) {
        savedReg.push(loggedInUser);
        localStorage.setItem('mahir_registered_users', JSON.stringify(savedReg));
      }

      await googleLogin(loggedInUser, jwtToken);
      setLoggedInUserName(loggedInUser.full_name || 'Teman Mahir');
      setPendingTargetTab(targetTab);
      setSuccessModal(true);
    } catch (e) {
      setErrorMsg('Gagal menyinkronkan sesi masuk Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'login') {
      if (!formData.email || !formData.password) {
        setErrorMsg('Email dan kata sandi wajib diisi!');
        return;
      }

      setLoading(true);
      try {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          const targetTab = res.user?.role === 'admin' ? 'admin-portal' : res.user?.role === 'tutor' ? 'tutor-dashboard' : 'lms';
          setLoggedInUserName(res.user?.full_name || 'Teman Mahir');
          setPendingTargetTab(targetTab);
          setSuccessModal(true);
        } else {
          setErrorMsg(res.error || 'Email atau kata sandi tidak cocok.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Terjadi kesalahan sistem saat mencoba masuk.');
      } finally {
        setLoading(false);
      }
    } else if (authMode === 'register') {
      if (!formData.full_name || !formData.email || !formData.whatsapp || !formData.password || !formData.confirmPassword) {
        setErrorMsg('Semua kolom pendaftaran (Nama, WA, Email, Kata Sandi, Konfirmasi) wajib diisi!');
        return;
      }

      if (!formData.email.includes('@') || !formData.email.includes('.')) {
        setErrorMsg('Format email tidak valid! Contoh format yang benar: nama@gmail.com');
        return;
      }

      const cleanWa = formData.whatsapp.replace(/\D/g, '');
      if (cleanWa.length < 10) {
        setErrorMsg('Nomor WhatsApp tidak valid! Harus berisi minimal 10 digit angka (contoh: 08123456789).');
        return;
      }

      if (formData.password.length < 6) {
        setErrorMsg('Kata sandi terlalu pendek! Minimal harus 6 karakter (contoh: 123456).');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok dengan kata sandi yang Anda masukkan!');
        return;
      }

      setLoading(true);
      try {
        const res = await register({
          full_name: formData.full_name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          password: formData.password
        });

        if (res.success) {
          const targetTab = res.user?.role === 'admin' ? 'admin-portal' : res.user?.role === 'tutor' ? 'tutor-dashboard' : 'lms';
          setLoggedInUserName(formData.full_name);
          setPendingTargetTab(targetTab);
          setSuccessModal(true);
        } else {
          setErrorMsg(res.error || 'Pendaftaran gagal karena masalah validasi data.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Terjadi kesalahan jaringan saat melakukan pendaftaran.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative bg-slate-100 font-sans">

      {/* 🟢 SUCCESS NOTIFICATION MODAL WITH WAVING HAND 👋 (5 SECONDS) */}
      {successModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 text-white rounded-4xl p-8 sm:p-10 text-center max-w-md w-full border-2 border-lime shadow-2xl space-y-6 relative overflow-hidden">

            {/* Ambient Glows */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-lime/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-brand/30 rounded-full blur-3xl pointer-events-none" />

            {/* Waving Hand Animated Badge */}
            <div className="flex justify-center py-2 relative z-10">
              <div className="w-24 h-24 rounded-full bg-lime/20 border-2 border-lime flex items-center justify-center shadow-limeGlow text-5xl relative">
                <span className="animate-wave-hand inline-block origin-bottom-right">👋</span>
              </div>
            </div>

            {/* Header Content */}
            <div className="space-y-3 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-lime bg-lime/10 px-4 py-1.5 rounded-full border border-lime/30 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
                Autentikasi Berhasil
              </span>
              <h2 className="font-stinger font-black text-2xl sm:text-3xl text-white pt-1">
                Halo, {loggedInUserName}! 👋
              </h2>
              <p className="text-slate-300 font-semibold text-xs sm:text-sm leading-relaxed">
                Selamat datang di <span className="text-lime font-black">Mahir Speaking</span>. Akses dashboard Anda telah disiapkan.
              </p>
            </div>

            {/* 5-second Progress & Countdown */}
            <div className="space-y-2 relative z-10 pt-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                <span>Mengalihkan otomatis dalam 5 detik...</span>
                <span className="text-lime font-black">{countdown}s</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-gradient-to-r from-lime via-emerald-400 to-lime h-full animate-progress-5s"></div>
              </div>
            </div>

            {/* Direct Proceed Button */}
            <div className="pt-2 relative z-10">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-3.5 rounded-2xl bg-lime text-slate-950 font-black text-xs hover:bg-lime-400 transition-all cursor-pointer shadow-limeGlow flex items-center justify-center gap-2"
              >
                <span>Masuk Ke Dashboard Sekarang</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* 👑 MAIN SPLIT AUTH CONTAINER (DESAIN MOCKUP SANGAT MODERN) */}
      <div className="max-w-5xl w-full bg-white rounded-4xl sm:rounded-5xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

        {/* 🎨 LEFT ARTWORK PANEL (DESAIN COSMIC CARDS - SHOWCASE SIDE) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-[#08203C] text-white relative overflow-hidden">

          {/* Subtle Glow Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Artwork Bar */}
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-black tracking-widest uppercase text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-lime" />
              <span>Mahir Speaking LMS</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Join Us</span>
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            </div>
          </div>

          {/* Middle Graphic Content */}
          <div className="space-y-4 z-10 my-auto py-6">
            <span className="bg-lime/20 text-lime text-[10px] font-black px-3 py-1 rounded-full uppercase border border-lime/30 inline-block">
              Platform Bahasa Inggris #1
            </span>
            <h2 className="font-stinger font-black text-3xl xl:text-4xl text-white leading-tight">
              Latihan Bicara Percakapan Tanpa Rasa Canggung.
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Bergabung bersama 2,400+ siswa aktif. Kuasai pronunciation, grammar for speaking, dan wawancara kerja dalam sesi interaktif.
            </p>
          </div>

          {/* Bottom Card Testifier Showcase (Official Mahir Speaking Member) */}
          <div className="z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-black text-lime text-base border border-white/20">
                MS
              </div>
              <div>
                <div className="font-extrabold text-white text-xs">Mahir Speaking Student</div>
                <div className="text-[10px] text-slate-400">Active Learning Community</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-extrabold text-lime bg-lime/10 px-2.5 py-1 rounded-full border border-lime/30">
                4.9 ★★★★★
              </span>
            </div>
          </div>

        </div>

        {/* 📝 RIGHT FORM PANEL (SLOPE/CLEAN FORM SIDE) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6 bg-white">

          {/* Header Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <img src="/MP.png" alt="Mahir Speaking" className="h-9 w-auto object-contain" />
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> IDN
              </span>
            </div>

            <h1 className="font-stinger font-black text-2xl sm:text-3xl text-slate-900 pt-3">
              {authMode === 'login' && 'Hi Mahirians 👋'}
              {authMode === 'register' && 'Buat Akun Baru ✨'}
              {authMode === 'forgot' && 'Riset Kata Sandi 🔑'}
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              {authMode === 'login' && 'Selamat datang di Mahir Speaking LMS Platform'}
              {authMode === 'register' && 'Daftar sekarang untuk memulai latihan percakapan'}
              {authMode === 'forgot' && 'Masukkan email Anda dan buat kata sandi baru'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Only for Login & Register) */}
          {authMode !== 'forgot' && (
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${authMode === 'login' ? 'bg-brand text-lime shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${authMode === 'register' ? 'bg-brand text-lime shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Daftar Baru
              </button>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs font-bold animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORM INPUTS */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* 1. REGISTER SPECIFIC FIELDS */}
            {authMode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Nama Lengkap *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="full_name"
                      required
                      placeholder="Contoh: Asri Hartini"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Nomor WhatsApp Active *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      placeholder="Contoh: 085156916211"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </>
            )}

            {/* 2. EMAIL FIELD (ALL MODES) */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Contoh: hartiniasri32@gmai.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* 3. LOGIN KATA SANDI */}
            {authMode === 'login' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* 4. REGISTER 2X KATA SANDI */}
            {authMode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="Buat kata sandi baru"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Konfirmasi Kata Sandi *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      placeholder="Ketik ulang kata sandi Anda"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </>
            )}



            {authMode === 'login' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 w-full items-center">
                {/* GOOGLE LOGIN (REAL GOOGLE SIGN-IN BUTTON) */}
                <div className="flex items-center justify-center w-full min-h-[40px]">
                  <GoogleSignInButton
                    onSuccess={handleGoogleLoginSuccess}
                    onFailure={(err) => setErrorMsg(err.message || 'Gagal masuk dengan Google.')}
                    theme="outline"
                    size="large"
                  />
                </div>

                {/* MAIN SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-[40px] rounded-2xl bg-brand text-lime font-black text-xs shadow-glow hover:bg-royal transition-all flex items-center justify-center gap-2 border border-brand/20 cursor-pointer w-full"
                >
                  {loading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* MAIN SUBMIT BUTTON (For Register mode) */
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-brand text-lime font-black text-xs shadow-glow hover:bg-royal transition-all flex items-center justify-center gap-2 border border-brand/20 cursor-pointer"
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Daftar Akun Baru</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            )}
          </form>

          {/* BOTTOM TOGGLE MODES */}
          <div className="text-center text-xs font-semibold text-slate-500 pt-2">
            {authMode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-extrabold text-brand hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            )}

            {authMode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-extrabold text-brand hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            )}


          </div>

        </div>

      </div>
    </div>
  );
}
