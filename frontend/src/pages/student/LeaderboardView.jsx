import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../../services/api';
import { Trophy, Award, Flame, Star, Crown, Sparkles, Medal, ShieldCheck } from 'lucide-react';

export default function LeaderboardView() {
  const [top3, setTop3] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exact custom learners requested by user
  const customLearners = [
    { rank: 1, full_name: 'Aci', username: 'aci_master', xp: 3450, points: 950, streak: 18, avatar: '/ma.png', package_badge: 'VIP Master' },
    { rank: 2, full_name: 'Fariha', username: 'fariha_speaking', xp: 2890, points: 850, streak: 14, avatar: '/mi.png', package_badge: 'Pro Speaker' },
    { rank: 3, full_name: 'Ira', username: 'ira_fluent', xp: 2450, points: 720, streak: 11, avatar: '/mo.png', package_badge: 'Pro Speaker' },
    { rank: 4, full_name: 'Pipit', username: 'pipit_voice', xp: 1980, points: 560, streak: 9, avatar: '/ma.png', package_badge: 'Starter' },
  ];

  useEffect(() => {
    leaderboardService.getLeaderboard()
      .then(data => {
        if (data.success && data.rankings && data.rankings.length > 0) {
          setTop3(data.top3 || data.rankings.slice(0, 3));
          setRankings(data.rankings);
        } else {
          setTop3(customLearners.slice(0, 3));
          setRankings(customLearners);
        }
      })
      .catch(() => {
        setTop3(customLearners.slice(0, 3));
        setRankings(customLearners);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayTop3 = top3.length >= 3 ? top3 : customLearners.slice(0, 3);
  const displayRankings = rankings.length > 0 ? rankings : customLearners;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-12">
      
      {/* MOBILE & DESKTOP HEADER */}
      <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-lime text-dark font-black text-[10px] sm:text-xs px-3.5 py-1 rounded-full uppercase border-2 border-dark shadow-sm">
          <Trophy className="w-3.5 h-3.5 fill-dark" /> Global Hall of Fame
        </div>
        <h1 className="font-helios text-2xl sm:text-5xl font-black text-brand uppercase tracking-tight">
          Leaderboard Siswa
        </h1>
        <p className="text-slate-700 text-xs sm:text-sm font-bold">
          Siswa teraktif dengan skor XP kelancaran tertinggi minggu ini.
        </p>
      </div>

      {/* FEATURED CHAMPION CARD (#1 ACI) - MOBILE OPTIMIZED */}
      <div className="bento-card-lime p-4 sm:p-8 rounded-3xl sm:rounded-4xl border-3 sm:border-4 border-dark shadow-limeGlow flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="flex items-center gap-3.5 sm:gap-5 w-full sm:w-auto relative z-10">
          <div className="relative flex-shrink-0">
            <img 
              src={displayTop3[0]?.avatar || '/ma.png'} 
              alt={displayTop3[0]?.full_name || 'Aci'} 
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover border-3 sm:border-4 border-dark shadow-xl bg-white" 
            />
            <div className="absolute -top-2.5 -right-2.5 bg-amberIcon text-dark p-1 sm:p-1.5 rounded-full border-2 border-dark shadow-md animate-bounce">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 fill-dark" />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1 flex-1">
            <span className="bg-dark text-lime font-black text-[9px] sm:text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider inline-block">
              ✦ Juara #1 Minggu Ini
            </span>
            <h2 className="font-stinger font-black text-xl sm:text-3xl text-dark">
              {displayTop3[0]?.full_name || 'Aci'}
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-dark/90 leading-tight">
              18 Hari Streak Belajar Non-stop!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-dark shadow-md">
          <span className="text-[10px] font-black text-slate-500 uppercase sm:hidden">Perolehan Skor</span>
          <div className="text-right sm:text-right w-full sm:w-auto">
            <div className="text-[9px] font-black text-slate-400 uppercase hidden sm:block">Total Perolehan XP</div>
            <div className="font-stinger font-black text-lg sm:text-2xl text-brand">
              ⚡ {displayTop3[0]?.xp || 3450} XP
            </div>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM - MOBILE & DESKTOP ULTRA RESPONSIVE */}
      <div className="pt-4 pb-2 max-w-4xl mx-auto">
        
        {/* MOBILE COMPACT PODIUM CARD ROW (sm:hidden) */}
        <div className="grid grid-cols-3 gap-2 sm:hidden items-end">
          
          {/* #2 Fariha (Silver - Left) */}
          <div className="bento-card p-3 rounded-2xl text-center space-y-1.5 border border-slate-300 bg-slate-100/90 shadow-sm flex flex-col items-center">
            <div className="relative">
              <img src={displayTop3[1]?.avatar || '/mi.png'} alt={displayTop3[1]?.full_name || 'Fariha'} className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 shadow-md" />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-100 text-[8px] font-black px-1.5 rounded-full">#2</span>
            </div>
            <div className="font-stinger font-black text-xs text-slate-900 truncate w-full">{displayTop3[1]?.full_name || 'Fariha'}</div>
            <div className="text-[10px] font-black text-brand bg-white px-1.5 py-0.5 rounded-full border text-center w-full">⚡ {displayTop3[1]?.xp || 2890}</div>
          </div>

          {/* #1 Aci (Gold - Center Tallest) */}
          <div className="bento-card-lime p-3.5 rounded-2xl text-center space-y-1.5 border-2 border-dark shadow-limeGlow flex flex-col items-center -translate-y-2">
            <Crown className="w-5 h-5 text-amberIcon animate-bounce -mb-1" />
            <div className="relative">
              <img src={displayTop3[0]?.avatar || '/ma.png'} alt={displayTop3[0]?.full_name || 'Aci'} className="w-14 h-14 rounded-full object-cover border-2 border-dark shadow-md" />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amberIcon text-dark text-[8px] font-black px-1.5 rounded-full border border-dark">#1</span>
            </div>
            <div className="font-stinger font-black text-sm text-dark truncate w-full">{displayTop3[0]?.full_name || 'Aci'}</div>
            <div className="text-[10px] font-black text-dark bg-white px-1.5 py-0.5 rounded-full border border-dark text-center w-full">⚡ {displayTop3[0]?.xp || 3450}</div>
          </div>

          {/* #3 Ira (Bronze - Right) */}
          <div className="bento-card p-3 rounded-2xl text-center space-y-1.5 border border-amber-300 bg-amber-50/90 shadow-sm flex flex-col items-center">
            <div className="relative">
              <img src={displayTop3[2]?.avatar || '/mo.png'} alt={displayTop3[2]?.full_name || 'Ira'} className="w-12 h-12 rounded-full object-cover border-2 border-amber-600 shadow-md" />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-[8px] font-black px-1.5 rounded-full">#3</span>
            </div>
            <div className="font-stinger font-black text-xs text-slate-900 truncate w-full">{displayTop3[2]?.full_name || 'Ira'}</div>
            <div className="text-[10px] font-black text-brand bg-white px-1.5 py-0.5 rounded-full border text-center w-full">⚡ {displayTop3[2]?.xp || 2450}</div>
          </div>

        </div>

        {/* DESKTOP 3D PODIUM (hidden on mobile, visible on sm and up) */}
        <div className="hidden sm:flex items-end justify-center gap-6">
          
          {/* RANK 2: FARIHA */}
          <div className="w-1/3 flex flex-col items-center">
            <div className="relative mb-3 group">
              <div className="w-28 h-28 rounded-full border-4 border-slate-300 overflow-hidden shadow-xl bg-white p-1">
                <img src={displayTop3[1]?.avatar || '/mi.png'} alt={displayTop3[1]?.full_name || 'Fariha'} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-slate-800 text-slate-100 text-xs font-black px-3 py-0.5 rounded-full border border-slate-300 shadow">
                #2 Fariha
              </span>
            </div>
            <div className="bento-card w-full p-5 rounded-t-4xl border-2 border-slate-300 text-center space-y-2 shadow-popout bg-slate-100/90">
              <h3 className="font-stinger font-black text-lg text-slate-900 truncate">{displayTop3[1]?.full_name || 'Fariha'}</h3>
              <div className="text-xs font-black text-brand bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm inline-block">
                ⚡ {displayTop3[1]?.xp || 2890} XP
              </div>
              <div>
                <span className="text-[10px] bg-slate-300 text-slate-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase inline-block">
                  {displayTop3[1]?.package_badge || 'Pro Speaker'}
                </span>
              </div>
            </div>
          </div>

          {/* RANK 1: ACI */}
          <div className="w-1/3 flex flex-col items-center">
            <Crown className="w-10 h-10 text-amberIcon animate-bounce mb-1 stroke-[2.5]" />
            <div className="relative mb-3 group">
              <div className="w-36 h-36 rounded-full border-4 border-amberIcon overflow-hidden shadow-goldGlow bg-white p-1">
                <img src={displayTop3[0]?.avatar || '/ma.png'} alt={displayTop3[0]?.full_name || 'Aci'} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -bottom-3 right-1/2 translate-x-1/2 bg-amberIcon text-dark text-xs font-black px-4 py-1 rounded-full border-2 border-dark shadow-md">
                #1 Aci (Champion)
              </span>
            </div>
            <div className="bento-card-lime w-full p-7 rounded-t-4xl border-4 border-dark text-center space-y-2 shadow-limeGlow">
              <h3 className="font-stinger font-black text-2xl text-dark truncate">{displayTop3[0]?.full_name || 'Aci'}</h3>
              <div className="text-sm font-black text-dark bg-white px-4 py-1 rounded-full border-2 border-dark shadow-sm inline-block">
                ⚡ {displayTop3[0]?.xp || 3450} XP
              </div>
              <div>
                <span className="text-[10px] bg-dark text-lime font-black px-3 py-1 rounded-full uppercase inline-block">
                  {displayTop3[0]?.package_badge || 'VIP Master'}
                </span>
              </div>
            </div>
          </div>

          {/* RANK 3: IRA */}
          <div className="w-1/3 flex flex-col items-center">
            <div className="relative mb-3 group">
              <div className="w-28 h-28 rounded-full border-4 border-amber-700 overflow-hidden shadow-xl bg-white p-1">
                <img src={displayTop3[2]?.avatar || '/mo.png'} alt={displayTop3[2]?.full_name || 'Ira'} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-amber-800 text-white text-xs font-black px-3 py-0.5 rounded-full border border-amber-600 shadow">
                #3 Ira
              </span>
            </div>
            <div className="bento-card w-full p-5 rounded-t-4xl border-2 border-amber-300 text-center space-y-2 shadow-popout bg-amber-50/90">
              <h3 className="font-stinger font-black text-lg text-slate-900 truncate">{displayTop3[2]?.full_name || 'Ira'}</h3>
              <div className="text-xs font-black text-brand bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm inline-block">
                ⚡ {displayTop3[2]?.xp || 2450} XP
              </div>
              <div>
                <span className="text-[10px] bg-amber-700 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase inline-block">
                  {displayTop3[2]?.package_badge || 'Pro Speaker'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FULL RANKINGS LIST - MOBILE OPTIMIZED CARDS + DESKTOP TABLE */}
      <div className="bento-card p-4 sm:p-8 rounded-3xl sm:rounded-4xl bg-white/95 border-2 border-white shadow-popout space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-stinger font-black text-base sm:text-xl text-slate-900">Daftar Peringkat Siswa</h2>
          <span className="text-[10px] sm:text-xs font-black text-brand uppercase tracking-wider">Aci • Fariha • Ira • Pipit</span>
        </div>

        {/* MOBILE CARD LIST (sm:hidden) */}
        <div className="space-y-3 sm:hidden">
          {displayRankings.map((user, idx) => {
            const rankNum = user.rank || idx + 1;
            return (
              <div 
                key={user.id || idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black border flex-shrink-0 ${
                    rankNum === 1 
                      ? 'bg-amberIcon text-dark border-dark' 
                      : rankNum === 2 
                      ? 'bg-slate-200 text-slate-900 border-slate-300' 
                      : rankNum === 3 
                      ? 'bg-amber-700 text-white border-amber-800' 
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    #{rankNum}
                  </span>

                  <img 
                    src={user.avatar || (rankNum === 1 ? '/ma.png' : rankNum === 2 ? '/mi.png' : rankNum === 3 ? '/mo.png' : '/ma.png')} 
                    alt={user.full_name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand flex-shrink-0" 
                  />

                  <div className="space-y-0.5">
                    <div className="font-stinger font-black text-slate-900 text-xs">{user.full_name}</div>
                    <div className="flex items-center gap-1.5 text-[9px]">
                      <span className="bg-brand text-lime px-1.5 rounded font-bold">{user.package_badge || 'Pro'}</span>
                      <span className="text-orange-600 font-bold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500" /> {user.streak || 10}d
                      </span>
                    </div>
                  </div>
                </div>

                <div className="font-stinger font-black text-brand text-xs bg-white px-2.5 py-1 rounded-xl border border-slate-200 flex-shrink-0">
                  ⚡ {user.xp}
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP TABLE VIEW (hidden on mobile, visible on sm and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Peringkat</th>
                <th className="py-3 px-4">Siswa</th>
                <th className="py-3 px-4">Badge Akun</th>
                <th className="py-3 px-4">Daily Streak</th>
                <th className="py-3 px-4 text-right">Total Poin XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-bold">
              {displayRankings.map((user, idx) => {
                const rankNum = user.rank || idx + 1;
                return (
                  <tr key={user.id || idx} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="py-4 px-4">
                      <span className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black border ${
                        rankNum === 1 
                          ? 'bg-amberIcon text-dark border-dark shadow-sm' 
                          : rankNum === 2 
                          ? 'bg-slate-200 text-slate-900 border-slate-300' 
                          : rankNum === 3 
                          ? 'bg-amber-700 text-white border-amber-800' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        #{rankNum}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || (rankNum === 1 ? '/ma.png' : rankNum === 2 ? '/mi.png' : rankNum === 3 ? '/mo.png' : '/ma.png')} 
                          alt={user.full_name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-brand shadow-sm" 
                        />
                        <div>
                          <div className="font-stinger font-black text-slate-900 text-sm sm:text-base">{user.full_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">@{user.username}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="bg-brand text-lime text-[10px] font-black px-3 py-1 rounded-full uppercase border border-brand/20">
                        {user.package_badge || 'Starter'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-orange-700 text-xs font-black">
                        <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span>{user.streak || 10} Hari</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-stinger font-black text-brand text-base sm:text-lg bg-slate-100 px-3 py-1 rounded-2xl border border-slate-200 inline-block">
                        ⚡ {user.xp} XP
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
