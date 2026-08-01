import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { leaderboardService } from "../../services/api";
import {
  Award,
  Crown,
  Flame,
  Medal,
  Search,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

const fallbackLearners = [
  {
    rank: 1,
    full_name: 'Fariha Salsabila',
    username: 'fariha_salsa',
    xp: 3450,
    points: 345,
    streak: 15,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    package_badge: 'Pro Member'
  },
  {
    rank: 2,
    full_name: 'Ira Kusuma',
    username: 'ira_kusuma',
    xp: 2890,
    points: 289,
    streak: 12,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    package_badge: 'Active Member'
  },
  {
    rank: 3,
    full_name: 'Pipit Andriani',
    username: 'pipit_andri',
    xp: 2450,
    points: 245,
    streak: 9,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    package_badge: 'Active Member'
  },
  {
    rank: 4,
    full_name: 'Aci Student',
    username: 'aci_student',
    xp: 1980,
    points: 198,
    streak: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    package_badge: 'Free Trial'
  }
];

const podiumStyles = {
  1: {
    order: "order-1 sm:order-2",
    card: "bg-[#0362C0] text-white sm:-translate-y-6",
    ring: "border-[#FFFF00]",
    badge: "bg-[#FFFF00] text-[#08203C]",
    height: "sm:min-h-[310px]",
  },
  2: {
    order: "order-2 sm:order-1",
    card: "bg-white text-[#08203C]",
    ring: "border-[#AFC2D6]",
    badge: "bg-[#DDE8F2] text-[#34516D]",
    height: "sm:min-h-[270px]",
  },
  3: {
    order: "order-3",
    card: "bg-white text-[#08203C]",
    ring: "border-[#FFA715]",
    badge: "bg-[#FFF0D2] text-[#9A5700]",
    height: "sm:min-h-[250px]",
  },
};

function formatXp(value = 0) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function getAvatar(user, rank) {
  if (user?.avatar) return user.avatar;
  return null;
}

export default function LeaderboardView() {
  const { setActiveTab } = useAuth();
  const [top3, setTop3] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    // Panggil API Backend /api/leaderboard resmi terlebih dahulu
    leaderboardService.getLeaderboard()
      .then(res => {
        if (!isMounted) return;
        if (res && res.success && res.rankings) {
          setTop3(res.top3 || res.rankings.slice(0, 3));
          setRankings(res.rankings);
          setLoading(false);
          return;
        }
        fallbackToLocalData();
      })
      .catch(() => {
        if (isMounted) fallbackToLocalData();
      });

    function fallbackToLocalData() {
      // Ambil pengguna terdaftar dari localStorage DAN current logged-in user
      const savedReg = JSON.parse(localStorage.getItem('mahir_registered_users') || '[]');
      let currentUser = null;
      try {
        currentUser = JSON.parse(localStorage.getItem('mahir_user'));
      } catch (e) {}

      let allUsers = [...savedReg];
      if (currentUser) {
        const idx = allUsers.findIndex(u => (currentUser.email && u.email?.toLowerCase() === currentUser.email?.toLowerCase()) || (currentUser.id && u.id === currentUser.id));
        if (idx !== -1) {
          allUsers[idx] = { ...allUsers[idx], ...currentUser };
        } else {
          allUsers.push(currentUser);
        }
      }

      // Bersihkan user dummy palsu
      allUsers = allUsers.filter(u => u && u.full_name !== 'Aci Student' && u.full_name !== 'Siswa Google Active' && u.full_name !== 'Fariha Salsabila' && u.full_name !== 'Ira Kusuma' && u.full_name !== 'Pipit Andriani');

      const sorted = [...allUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
      const formatted = sorted.map((u, idx) => ({
        rank: idx + 1,
        full_name: u.full_name,
        username: u.username || u.email?.split('@')[0] || `user_${u.id}`,
        xp: u.xp || 0,
        points: u.points || 0,
        streak: u.streak || 0,
        avatar: u.avatar || null,
        package_badge: u.role === 'admin' ? 'Admin Senior' : (u.package_name || "Active Member")
      }));

      setTop3(formatted.slice(0, 3));
      setRankings(formatted);
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, []);

  const displayTop3 = top3;
  const allRankings = rankings;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const displayRankings = allRankings.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(normalizedSearch) ||
      user.username?.toLowerCase().includes(normalizedSearch),
  );
  const champion = displayTop3[0] || null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4FBFF] px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-5">
          <div className="h-52 rounded-[30px] bg-[#87CEFA]/60" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-[26px] bg-white shadow-sm"
              />
            ))}
          </div>
          <div className="h-80 rounded-[26px] bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4FBFF] pb-20 text-[#08203C]">
      <section className="relative overflow-hidden bg-[#87CEFA] px-4 pb-28 pt-8 sm:px-8 sm:pb-32 sm:pt-12">
        <div className="absolute -left-24 -top-16 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#FFFF00]/20 blur-3xl" />
        <div className="absolute left-[15%] top-16 h-3 w-3 rounded-full bg-[#FFFF00]" />
        <div className="absolute right-[18%] top-24 h-4 w-4 rotate-12 bg-white/70" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#0362C0] shadow-sm backdrop-blur">
              <Trophy size={15} fill="currentColor" />
              Weekly Hall of Fame
            </div>
            <h1 className="mt-5 text-3xl font-black leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Setiap latihan
              <span className="block text-[#FFFF00]">membawamu naik.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-[#083F78] sm:text-base">
              Kumpulkan XP dari materi, speaking mission, dan konsistensi
              belajar. Siapa yang akan menjadi juara berikutnya?
            </p>
          </div>

          <div className="relative w-full max-w-sm rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_55px_rgba(3,98,192,0.18)] backdrop-blur lg:w-[340px]">
            {champion ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0362C0]">
                      Champion this week
                    </p>
                    <h2 className="mt-1 text-2xl font-black">
                      {champion.full_name}
                    </h2>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFFF00] text-[#0362C0]">
                    <Crown size={25} fill="currentColor" />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#0362C0] p-3 text-white">
                  <img
                    src={getAvatar(champion, 1) || '/ma.png'}
                    alt={champion.full_name}
                    className="h-14 w-14 rounded-2xl border-2 border-[#FFFF00] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white/65">
                      @{champion.username}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-lg font-black text-[#FFFF00]">
                      <Zap size={17} fill="currentColor" />
                      {formatXp(champion.xp)} XP
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 text-xs font-black">
                    <Flame
                      size={14}
                      className="text-[#FFA715]"
                      fill="currentColor"
                    />
                    {champion.streak || 0}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-3 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFF00] text-[#0362C0] flex items-center justify-center mx-auto shadow-md">
                  <Crown size={26} fill="currentColor" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Belum Ada Juara</h2>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  Selesaikan quiz pertama Anda di LMS untuk menduduki Champion Minggu Ini! 🏆
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {allRankings.length === 0 ? (
        <section className="relative z-10 -mt-14 px-4 sm:px-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-[36px] p-8 sm:p-14 text-center border-2 border-dashed border-[#87CEFA] shadow-xl space-y-5 my-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto text-4xl shadow-inner">
              🏆
            </div>
            <div className="space-y-2">
              <h2 className="font-stinger font-black text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight">
                Leaderboard Minggu Ini Masih Kosong
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-md mx-auto leading-relaxed">
                Belum ada siswa yang mengerjakan & mengirimkan quiz minggu ini. Selesaikan unit quiz di LMS untuk langsung tampil di peringkat #1!
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('lms')}
                className="px-8 py-4 rounded-2xl bg-[#0362C0] text-[#FFFF00] font-black text-xs sm:text-sm hover:bg-blue-800 transition-all cursor-pointer shadow-xl inline-flex items-center gap-2 transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-[#FFFF00] animate-spin" />
                <span>Kerjakan Quiz LMS Sekarang</span> ➔
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="relative z-10 -mt-20 px-4 sm:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-7 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0362C0]">
                  Top performers
                </p>
                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  Podium Minggu Ini
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
                {displayTop3.map((user, index) => {
                  const rank = index + 1;
                  const style = podiumStyles[rank];

                  return (
                    <article
                      key={user.id || user.username || rank}
                      className={`${style.order} ${style.card} ${style.height} relative flex overflow-hidden rounded-[28px] p-5 shadow-[0_18px_45px_rgba(8,32,60,0.12)] transition hover:-translate-y-2 sm:flex-col sm:justify-between sm:p-6`}
                    >
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-[#87CEFA]/15" />
                      <div className="relative flex w-full items-center gap-4 sm:flex-col sm:text-center">
                        <div className="relative shrink-0">
                          {rank === 1 && (
                            <Crown
                              size={29}
                              className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 text-[#FFFF00]"
                              fill="currentColor"
                            />
                          )}
                          <img
                            src={getAvatar(user, rank) || '/ma.png'}
                            alt={user.full_name}
                            className={`h-20 w-20 rounded-[22px] border-4 ${style.ring} object-cover shadow-md sm:h-28 sm:w-28 sm:rounded-full`}
                          />
                          <span
                            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-black ${style.badge}`}
                          >
                            #{rank}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 sm:mt-3">
                          <h3 className="truncate text-xl font-black">
                            {user.full_name}
                          </h3>
                          <p
                            className={`truncate text-xs font-semibold ${rank === 1 ? "text-white/60" : "text-slate-400"
                              }`}
                          >
                            @{user.username}
                          </p>
                          <span
                            className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${rank === 1
                                ? "bg-white/10 text-[#FFFF00]"
                                : "bg-[#EAF6FF] text-[#0362C0]"
                              }`}
                          >
                            {user.package_badge || "Starter"}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`relative ml-auto flex shrink-0 flex-col items-end sm:ml-0 sm:mt-5 sm:w-full sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:p-3 ${rank === 1 ? "sm:bg-white/10" : "sm:bg-[#F4FBFF]"
                          }`}
                      >
                        <p className="flex items-center gap-1 text-lg font-black">
                          <Zap
                            size={17}
                            className={
                              rank === 1 ? "text-[#FFFF00]" : "text-[#0362C0]"
                            }
                            fill="currentColor"
                          />
                          {formatXp(user.xp)}
                        </p>
                        <p
                          className={`mt-2 flex items-center gap-1 text-[11px] font-black sm:mt-0 ${rank === 1 ? "text-white/70" : "text-[#D46A00]"
                            }`}
                        >
                          <Flame
                            size={14}
                            className="text-[#FFA715]"
                            fill="currentColor"
                          />
                          {user.streak || 0} hari
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-4 pt-14 sm:px-8 sm:pt-20">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0362C0]">
                    <Sparkles size={15} className="text-[#FFA715]" />
                    Keep climbing
                  </p>
                  <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                    Peringkat Semua Siswa
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Ranking diperbarui mengikuti progres belajar terbaru.
                  </p>
                </div>

                <label className="relative block w-full sm:w-72">
                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0362C0]"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari nama siswa..."
                    className="w-full rounded-2xl border border-[#0362C0]/15 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none shadow-sm transition placeholder:text-slate-400 focus:border-[#0362C0] focus:ring-4 focus:ring-[#87CEFA]/30"
                  />
                </label>
              </div>

              <div className="mt-7 overflow-hidden rounded-[28px] border border-[#0362C0]/10 bg-white shadow-[0_16px_45px_rgba(8,32,60,0.08)]">
                <div className="hidden grid-cols-[80px_1.5fr_1fr_1fr_1fr] border-b border-slate-100 bg-[#EAF6FF] px-6 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-[#42617F] md:grid">
                  <span>Rank</span>
                  <span>Siswa</span>
                  <span>Level</span>
                  <span>Streak</span>
                  <span className="text-right">Total XP</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {displayRankings.map((user, index) => {
                    const rank = user.rank || index + 1;
                    const isTopThree = rank <= 3;

                    return (
                      <article
                        key={user.id || user.username || index}
                        className="group flex items-center gap-3 p-4 transition hover:bg-[#F4FBFF] md:grid md:grid-cols-[80px_1.5fr_1fr_1fr_1fr] md:px-6 md:py-4"
                      >
                        <div
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black ${rank === 1
                              ? "bg-[#FFFF00] text-[#0362C0]"
                              : rank === 2
                                ? "bg-[#DDE8F2] text-[#34516D]"
                                : rank === 3
                                  ? "bg-[#FFF0D2] text-[#9A5700]"
                                  : "bg-[#EAF6FF] text-[#0362C0]"
                            }`}
                        >
                          {isTopThree ? <Medal size={17} /> : `#${rank}`}
                        </div>

                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <img
                            src={getAvatar(user, rank) || '/ma.png'}
                            alt={user.full_name}
                            className="h-11 w-11 shrink-0 rounded-2xl border-2 border-[#87CEFA] object-cover"
                          />
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-black">
                              {user.full_name}
                            </h3>
                            <p className="truncate text-[10px] font-semibold text-slate-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>

                        <div className="hidden md:block">
                          <span className="rounded-full bg-[#EAF6FF] px-3 py-1.5 text-[10px] font-black uppercase text-[#0362C0]">
                            {user.package_badge || "Starter"}
                          </span>
                        </div>

                        <div className="hidden items-center gap-1.5 text-xs font-black text-[#D46A00] md:flex">
                          <Flame
                            size={16}
                            className="text-[#FFA715]"
                            fill="currentColor"
                          />
                          {user.streak || 0} hari
                        </div>

                        <div className="ml-auto text-right">
                          <p className="flex items-center justify-end gap-1 text-sm font-black text-[#0362C0] sm:text-base">
                            <Zap size={15} fill="currentColor" />
                            {formatXp(user.xp)}
                          </p>
                          <p className="mt-1 flex items-center justify-end gap-1 text-[9px] font-bold text-[#D46A00] md:hidden">
                            <Flame size={11} fill="currentColor" />
                            {user.streak || 0} hari
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="px-4 pt-12 sm:px-8 sm:pt-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 overflow-hidden rounded-[28px] bg-[#0362C0] p-6 text-white shadow-[0_20px_50px_rgba(3,98,192,0.2)] sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FFFF00] text-[#0362C0]">
              <Star size={23} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FFFF00]">
                Your turn to shine
              </p>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                Bukan soal langsung jadi nomor satu.
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-white/70">
                Naik satu langkah dari dirimu kemarin juga merupakan kemenangan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-2xl bg-white/10 px-4 py-3 text-xs font-black text-[#FFFF00] sm:self-center">
            <Award size={18} />
            Learn • Practise • Speak
          </div>
        </div>
      </section>
    </main>
  );
}