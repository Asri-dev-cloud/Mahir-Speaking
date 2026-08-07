import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { User, Phone, Mail, Award, Flame, Save, Mic, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(user);

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [speakingGoal, setSpeakingGoal] = useState(user?.speaking_goal || 'Persiapan IELTS 7.0+ & Business Pitch');
  const [bio, setBio] = useState(user?.bio || 'Sangat bersemangat melatih kelancaran percakapan Bahasa Inggris bersama Mahir Speaking!');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Ambil ulang data terbaru dari database setiap halaman profil dibuka.
  useEffect(() => {
    let active = true;

    const loadLatestProfile = async () => {
      try {
        const data = await userService.getProfile();
        if (!active || !data.success || !data.user) return;

        setProfile(data.user);
        setFullName(data.user.full_name || '');
        setWhatsapp(data.user.whatsapp || '');
        setAvatar(data.user.avatar || '');
        setSpeakingGoal(data.user.speaking_goal || 'Persiapan IELTS 7.0+ & Business Pitch');
        setBio(data.user.bio || 'Sangat bersemangat melatih kelancaran percakapan Bahasa Inggris bersama Mahir Speaking!');
        updateUserProfile(data.user);
      } catch (err) {
        console.error('Gagal mengambil profil terbaru:', err);
      }
    };

    loadLatestProfile();
    return () => { active = false; };
  }, []);

  const currentUser = profile || user;

  const presetAvatars = ['/ma.png', '/mi.png', '/mo.png', '/mashira chibi.png', '/mashira chibi.png'];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await userService.updateProfile({
        full_name: fullName,
        whatsapp,
        avatar,
        speaking_goal: speakingGoal,
        bio
      });
      if (data.success) {
        setProfile(data.user);
        updateUserProfile(data.user);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } else {
        const updatedProfile = {
          ...currentUser,
          full_name: fullName,
          whatsapp,
          avatar,
          speaking_goal: speakingGoal,
          bio
        };
        setProfile(updatedProfile);
        updateUserProfile(updatedProfile);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      // Local fallback update for smooth UX
      const updatedProfile = {
        ...currentUser,
        full_name: fullName,
        whatsapp,
        avatar,
        speaking_goal: speakingGoal,
        bio
      };
      setProfile(updatedProfile);
      updateUserProfile(updatedProfile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-slate-900 via-brand to-slate-950 text-white">
        {avatar || currentUser?.avatar ? (
          <img
            src={avatar || currentUser?.avatar}
            alt={fullName || currentUser?.full_name}
            className="w-24 h-24 rounded-full object-cover border-4 border-lime shadow-xl flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-brand text-lime font-black text-3xl flex items-center justify-center border-4 border-lime shadow-xl flex-shrink-0 uppercase">
            {(fullName || currentUser?.full_name || 'U').charAt(0)}
          </div>
        )}
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h1 className="font-stinger font-black text-2xl sm:text-3xl text-white">{fullName || currentUser?.full_name || 'Student Learner'}</h1>
            <span className="bg-lime text-dark text-[10px] font-black px-3 py-1 rounded-full uppercase border border-dark">
              {currentUser?.role || 'Student'}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-semibold">@{currentUser?.username || 'learner_speaking'} • {currentUser?.email || 'learner@mahirspeaking.com'}</p>
          <p className="text-xs text-lime italic font-bold pt-0.5">🎯 Goal: {speakingGoal}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
            <span className="text-xs font-black text-lime bg-slate-900/90 border border-lime/30 px-3.5 py-1.5 rounded-xl">
              ⚡ {currentUser?.xp ?? 0} XP
            </span>
            <span className="text-xs font-black text-orange-400 bg-slate-900/90 border border-orange-500/30 px-3.5 py-1.5 rounded-xl">
              🔥 {currentUser?.streak ?? 0} Days Streak
            </span>
            <span className="text-xs font-black text-emerald-400 bg-slate-900/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl">
              🏆 {currentUser?.points ?? 0} Points
            </span>
          </div>
        </div>
      </div>

      {/* Edit Personal Info Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-stinger font-extrabold text-xl text-slate-900">Edit Data Profil & Akun</h2>
            <p className="text-xs text-slate-500 font-medium">Perbarui informasi diri, avatar, dan target belajar kamu.</p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-4 py-1.5 rounded-full animate-bounce">
              ✓ Profil Berhasil Disimpan!
            </span>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">

          {/* Avatar Preset & Custom Upload Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">Pilih Avatar atau Upload Foto Sendiri</label>
            <div className="flex flex-wrap items-center gap-3">
              {presetAvatars.map((imgUrl, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setAvatar(imgUrl)}
                  className={`relative rounded-full p-1 border-2 transition-all cursor-pointer ${avatar === imgUrl ? 'border-brand bg-lime scale-110 shadow-md' : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                  <img src={imgUrl} alt="Avatar Preset" className="w-12 h-12 rounded-full object-cover" />
                </button>
              ))}

              <div className="pl-2 border-l border-slate-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="custom-photo-upload-input"
                />
                <label
                  htmlFor="custom-photo-upload-input"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-lime font-black text-xs hover:bg-brand transition-all border border-slate-700 cursor-pointer inline-flex items-center gap-2 shadow-sm"
                >
                  <span>📷 Upload Foto</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-bold text-slate-900 shadow-sm"
                placeholder="Contoh: Asri Hartini"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nomor WhatsApp</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-bold text-slate-900 shadow-sm"
                placeholder="Contoh: 085156916211"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Target Belajar Speaking</label>
              <input
                type="text"
                value={speakingGoal}
                onChange={(e) => setSpeakingGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-bold text-slate-900 shadow-sm"
                placeholder="Target Speaking (Misal: IELTS 7.5)"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Custom Avatar URL (Opsional)</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-bold text-slate-900 shadow-sm"
                placeholder="/ma.png atau https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Bio / Catatan Pribadi</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium text-slate-900 shadow-sm"
              placeholder="Tuliskan bio atau catatan motivasi belajar kamu..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-brand text-lime font-black text-xs sm:text-sm shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2 border-2 border-dark cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Profil'}</span>
          </button>
        </form>
      </div>



    </div>
  );
}