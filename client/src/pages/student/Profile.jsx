import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { User, Phone, Mail, Award, Flame, Save, Mic, CheckCircle, Volume2 } from 'lucide-react';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await userService.updateProfile({
        full_name: fullName,
        whatsapp,
        avatar
      });
      if (data.success) {
        updateUserProfile(data.user);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const playPortfolioSample = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-glass flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
          alt={user?.full_name}
          className="w-24 h-24 rounded-full object-cover border-4 border-brand shadow-md"
        />
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="font-stinger font-black text-2xl text-slate-900">{user?.full_name}</h1>
            <span className="bg-brand/10 text-brand text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">@{user?.username} • {user?.email}</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              ⚡ {user?.xp || 1450} XP
            </span>
            <span className="text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
              🔥 {user?.streak || 7} Days Streak
            </span>
          </div>
        </div>
      </div>

      {/* Edit Personal Info */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-stinger font-extrabold text-xl text-brand">Edit Profile Details</h2>
          {savedSuccess && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Saved!</span>}
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">WhatsApp Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand text-electric font-bold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

      {/* Voice Portfolio Samples */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-4">
        <h2 className="font-stinger font-extrabold text-xl text-brand">My Recorded Voice Portfolio</h2>

        <div className="space-y-3">
          {[
            { title: "Self Introduction Drill", date: "2026-07-28", text: "Hello! My name is Sarah and I am excited to practice my English speaking today.", score: "95/100" },
            { title: "Cafe Ordering Practice", date: "2026-07-25", text: "Hi, could I please get an iced oat milk latte with extra shot of espresso?", score: "90/100" }
          ].map((sample, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{sample.title}</h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">{sample.score}</span>
                </div>
                <p className="text-xs text-slate-500 italic">"{sample.text}"</p>
              </div>

              <button
                onClick={() => playPortfolioSample(sample.text)}
                className="px-3 py-2 rounded-xl bg-brand/10 text-brand font-bold text-xs hover:bg-brand hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <Volume2 className="w-4 h-4" /> Play Audio
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
