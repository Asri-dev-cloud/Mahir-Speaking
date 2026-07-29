import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function Register() {
  const { register, setActiveTab } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        full_name: fullName,
        username,
        email,
        whatsapp,
        password,
        role
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 px-4">
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-glass space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amberIcon" /> Start Free Speaking Account
          </div>
          <h1 className="font-stinger text-3xl font-black text-brand">Create Your Account</h1>
          <p className="text-xs text-slate-600 font-medium">Join 50,000+ learners mastering English speaking</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Amalia"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Username & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="sarah_speak"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">I want to join as:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  role === 'student' ? 'border-brand bg-brand/10 text-brand' : 'border-slate-300 text-slate-600'
                }`}
              >
                {role === 'student' && <Check className="w-4 h-4 text-brand" />}
                <span>🎓 Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('tutor')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  role === 'tutor' ? 'border-brand bg-brand/10 text-brand' : 'border-slate-300 text-slate-600'
                }`}
              >
                {role === 'tutor' && <Check className="w-4 h-4 text-brand" />}
                <span>👨‍🏫 Tutor</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand text-electric font-black text-sm shadow-glow hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register & Start Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center pt-2 text-xs text-slate-600">
          Already have an account?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="font-bold text-brand hover:underline"
          >
            Log In
          </button>
        </div>

      </div>
    </div>
  );
}
