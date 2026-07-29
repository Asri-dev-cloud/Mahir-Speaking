import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Bot } from 'lucide-react';

export default function Login() {
  const { login, setActiveTab } = useAuth();
  const [email, setEmail] = useState('student@mahirspeaking.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Account Selector Helper for Demo
  const quickSelect = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-glass space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="font-stinger text-3xl font-black text-brand">Welcome Back</h1>
          <p className="text-xs text-slate-600 font-medium">Log in to resume your English speaking journey</p>
        </div>

        {/* Demo Quick Login Helper */}
        <div className="bg-brand/5 border border-brand/20 p-3 rounded-2xl space-y-2 text-xs">
          <span className="font-bold text-brand block">⚡ Quick Demo Credentials:</span>
          <div className="flex flex-wrap gap-1.5">
            <button 
              type="button" 
              onClick={() => quickSelect('student@mahirspeaking.com')}
              className="px-2.5 py-1 bg-white border rounded-lg hover:border-brand font-semibold text-slate-700"
            >
              🎓 Student
            </button>
            <button 
              type="button" 
              onClick={() => quickSelect('tutor@mahirspeaking.com')}
              className="px-2.5 py-1 bg-white border rounded-lg hover:border-brand font-semibold text-slate-700"
            >
              👨‍🏫 Tutor
            </button>
            <button 
              type="button" 
              onClick={() => quickSelect('admin@mahirspeaking.com')}
              className="px-2.5 py-1 bg-white border rounded-lg hover:border-brand font-semibold text-slate-700"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Password</label>
              <button
                type="button"
                onClick={() => setActiveTab('forgot-password')}
                className="text-xs text-brand font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand text-electric font-black text-sm shadow-glow hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Log In Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center pt-2 text-xs text-slate-600">
          Don't have an account?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="font-bold text-brand hover:underline"
          >
            Register Now
          </button>
        </div>

      </div>
    </div>
  );
}
