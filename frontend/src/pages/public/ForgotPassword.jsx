// Halaman ForgotPassword: Menyediakan formulir pengiriman tautan pemulihan kata sandi bagi pengguna yang lupa sandinya.
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const { setActiveTab } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Menangani pengiriman formulir reset kata sandi ke server backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-14 px-4">
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-glass space-y-6">
        
        <button
          onClick={() => setActiveTab('login')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="text-center space-y-2">
          <h1 className="font-stinger text-3xl font-black text-brand">Reset Password</h1>
          <p className="text-xs text-slate-600 font-medium">Enter your registered email address to receive password reset instructions.</p>
        </div>

        {/* Tampilan pesan sukses jika tautan pemulihan kata sandi berhasil dikirim */}
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm">Reset Instructions Sent!</h3>
            <p className="text-xs text-emerald-800">
              We have sent a verification code and reset link to <strong>{email}</strong>. Please check your inbox and WhatsApp message.
            </p>
            <button
              onClick={() => setActiveTab('login')}
              className="mt-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow"
            >
              Return to Login
            </button>
          </div>
        ) : (
          /* Tampilan formulir input email pendaftaran jika belum melakukan pengiriman */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Registered Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: hartiniasri32@gmai.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand text-electric font-black text-sm shadow-glow hover:bg-brand-600 transition-all"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
