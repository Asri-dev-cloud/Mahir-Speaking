// Modal Placement Test Mahir Speaking: Menilai tingkat kemampuan bahasa Inggris siswa secara akurat untuk rekomendasi level kurikulum.
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { userService } from '../../services/api';
import {
  X,
  CheckCircle2,
  MessageCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  BookOpenCheck,
  Clock3,
  ShieldCheck,
  Target,
  Volume2,
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'q1',
    category: 'Komunikasi Dasar',
    question: 'Ungkapan yang paling tepat untuk memperkenalkan diri dalam situasi formal adalah ...',
    options: [
      ['a', 'Hi, I am Dika. Nice to meet you.'],
      ['b', 'Hey bro, what’s up?'],
      ['c', 'Me Dika, meet you.'],
      ['d', 'I is Dika.'],
    ],
    answer: 'a',
  },
  {
    id: 'q2',
    category: 'Tata Bahasa',
    question: 'She ___ English every Monday and Wednesday.',
    options: [['a', 'study'], ['b', 'studies'], ['c', 'studying'], ['d', 'studied']],
    answer: 'b',
  },
  {
    id: 'q3',
    category: 'Kosakata',
    question: 'Kata yang paling dekat artinya dengan “difficult” adalah ...',
    options: [['a', 'easy'], ['b', 'simple'], ['c', 'challenging'], ['d', 'quiet']],
    answer: 'c',
  },
  {
    id: 'q4',
    category: 'Pemahaman Teks',
    passage: 'Rina missed the bus, so she arrived at the office thirty minutes late.',
    question: 'Mengapa Rina terlambat tiba di kantor?',
    options: [['a', 'She woke up late.'], ['b', 'She missed the bus.'], ['c', 'The office was closed.'], ['d', 'She worked from home.']],
    answer: 'b',
  },
  {
    id: 'q5',
    category: 'Tata Bahasa',
    question: 'I ___ in this company since 2023.',
    options: [['a', 'work'], ['b', 'worked'], ['c', 'have worked'], ['d', 'am work']],
    answer: 'c',
  },
  {
    id: 'q6',
    category: 'Komunikasi Fungsional',
    question: 'Respons paling profesional ketika belum memahami instruksi adalah ...',
    options: [
      ['a', 'I don’t know.'],
      ['b', 'Could you please clarify the last point?'],
      ['c', 'Repeat it!'],
      ['d', 'Whatever you say.'],
    ],
    answer: 'b',
  },
  {
    id: 'q7',
    category: 'Tata Bahasa',
    question: 'If I ___ more time, I would join the speaking club.',
    options: [['a', 'have'], ['b', 'had'], ['c', 'will have'], ['d', 'am having']],
    answer: 'b',
  },
  {
    id: 'q8',
    category: 'Pemahaman Teks',
    passage: 'Although the proposal was well researched, the manager asked the team to simplify its recommendations before presenting it to the client.',
    question: 'Apa yang diminta manajer kepada tim?',
    options: [
      ['a', 'Cancel the client meeting.'],
      ['b', 'Conduct new research.'],
      ['c', 'Simplify the recommendations.'],
      ['d', 'Replace the manager.'],
    ],
    answer: 'c',
  },
  {
    id: 'q9',
    category: 'Kosakata Kontekstual',
    question: 'Dalam rapat, “to address an issue” berarti ...',
    options: [['a', 'mengabaikan masalah'], ['b', 'membahas atau menangani masalah'], ['c', 'mencatat alamat'], ['d', 'menunda rapat']],
    answer: 'b',
  },
  {
    id: 'q10',
    category: 'Komunikasi Lanjutan',
    question: 'Kalimat yang paling tepat untuk menyampaikan ketidaksetujuan secara diplomatis adalah ...',
    options: [
      ['a', 'You are completely wrong.'],
      ['b', 'That makes no sense.'],
      ['c', 'I understand your point; however, the data suggests another conclusion.'],
      ['d', 'No, I disagree.'],
    ],
    answer: 'c',
  },
  {
    id: 'q11',
    category: 'Listening Dasar',
    listeningText: 'Attention, passengers. The train to Jakarta will depart from platform three at nine fifteen.',
    question: 'Dari pernyataan yang kamu dengar, kereta menuju Jakarta berangkat dari ...',
    options: [['a', 'Platform two'], ['b', 'Platform three'], ['c', 'Platform five'], ['d', 'Platform nine']],
    answer: 'b',
  },
  {
    id: 'q12',
    category: 'Listening Kontekstual',
    listeningText: 'Maya cannot attend the meeting this morning because she has a client presentation. She will join the follow-up meeting this afternoon.',
    question: 'Mengapa Maya tidak dapat menghadiri rapat pagi ini?',
    options: [['a', 'She is sick.'], ['b', 'She is on leave.'], ['c', 'She has a client presentation.'], ['d', 'She missed the bus.']],
    answer: 'c',
  },
];

const INITIAL_FORM = {
  nama: '',
  noWa: '',
  levelTarget: 'basic',
  jadwalTrial: 'Sabtu (10.00 WIB)',
  catatan: '',
};

function getPlacementResult(score) {
  if (score >= 80) return { level: 'Advanced', cefr: 'B2–C1', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' };
  if (score >= 50) return { level: 'Intermediate', cefr: 'A2–B1', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' };
  return { level: 'Basic', cefr: 'A1–A2', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
}

export default function PlacementTestModal({ isOpen, onClose }) {
  const [placementStep, setPlacementStep] = useState(1);
  const [leadFormData, setLeadFormData] = useState(INITIAL_FORM);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(getPlacementResult(0));
  const [score, setScore] = useState(0);

  const answeredCount = useMemo(() => Object.keys(quizAnswers).length, [quizAnswers]);
  const question = QUESTIONS[currentQuestion];

  if (!isOpen) return null;

  const handleLeadSubmit = (event) => {
    event.preventDefault();
    if (!leadFormData.nama.trim() || !leadFormData.noWa.trim()) {
      alert('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }
    setPlacementStep(2);
  };

  const handleFinishPlacement = () => {
    if (answeredCount !== QUESTIONS.length) {
      alert('Mohon jawab semua soal sebelum melihat hasil.');
      return;
    }

    const correctAnswers = QUESTIONS.filter((item) => quizAnswers[item.id] === item.answer).length;
    const finalScore = Math.round((correctAnswers / QUESTIONS.length) * 100);
    const finalResult = getPlacementResult(finalScore);
    const recommendedLevel = `${finalResult.level} (${finalResult.cefr})`;

    setScore(finalScore);
    setResult(finalResult);

    const newLead = {
      id: Date.now(),
      nama: leadFormData.nama.trim(),
      noWa: leadFormData.noWa.replace(/[^0-9]/g, ''),
      levelTarget: leadFormData.levelTarget,
      recommendedLevel,
      placementScore: finalScore,
      testStandard: 'Placement Test Mahir Speaking – pemetaan CEFR',
      jadwalTrial: leadFormData.jadwalTrial,
      catatan: leadFormData.catatan,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Belum Dihubungi',
    };

    try {
      const savedLeads = JSON.parse(localStorage.getItem('mahir_leads') || '[]');
      savedLeads.unshift(newLead);
      localStorage.setItem('mahir_leads', JSON.stringify(savedLeads));
    } catch (error) {
      console.warn('Data placement test tidak dapat disimpan di perangkat ini.', error);
    }

    // Save to backend database
    userService.submitPlacementLead({
      nama: leadFormData.nama.trim(),
      noWa: leadFormData.noWa.replace(/[^0-9]/g, ''),
      levelTarget: leadFormData.levelTarget,
      recommendedLevel,
      jadwalTrial: leadFormData.jadwalTrial,
      catatan: leadFormData.catatan
    }).catch(err => {
      console.error('Error submitting placement lead to server:', err);
    });

    setPlacementStep(3);
  };

  const handleResetAndClose = () => {
    setPlacementStep(1);
    setLeadFormData(INITIAL_FORM);
    setQuizAnswers({});
    setCurrentQuestion(0);
    setScore(0);
    setResult(getPlacementResult(0));
    onClose();
  };

  const selectAnswer = (value) => {
    setQuizAnswers((previous) => ({ ...previous, [question.id]: value }));
  };

  const playListeningAudio = () => {
    if (!question.listeningText) return;
    if (!('speechSynthesis' in window)) {
      alert('Fitur audio tidak didukung oleh browser ini. Silakan gunakan Chrome atau Edge terbaru.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.listeningText);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const inputClass = 'w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0362c0] focus:ring-4 focus:ring-blue-100';

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex min-h-screen w-screen items-center justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-md sm:p-6"
      onClick={handleResetAndClose}
    >
      <div
        className="relative m-auto w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/30 bg-white shadow-[0_30px_100px_rgba(2,20,50,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0362c0] via-sky-400 to-[#ffa715]" />
        <button
          type="button"
          onClick={handleResetAndClose}
          aria-label="Tutup placement test"
          className="absolute right-4 top-4 z-20 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          <header className="bg-gradient-to-br from-[#0362c0] via-[#0756a5] to-slate-900 px-6 py-7 text-white sm:px-9">
            <div className="flex max-w-[85%] items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/25">
                <BookOpenCheck className="h-6 w-6 text-[#ffff00]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-200">Mahir Speaking Assessment</p>
                <h2 className="font-stinger text-xl font-black sm:text-2xl">English Placement Test</h2>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] font-bold sm:max-w-md sm:text-xs">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-2.5 py-2 ring-1 ring-white/15"><ShieldCheck className="h-4 w-4 text-[#ffff00]" /> 12 soal</span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-2.5 py-2 ring-1 ring-white/15"><Clock3 className="h-4 w-4 text-[#ffff00]" /> ±12 menit</span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-2.5 py-2 ring-1 ring-white/15"><Target className="h-4 w-4 text-[#ffff00]" /> Skor 0–100</span>
            </div>
          </header>

          <main className="p-5 sm:p-8">
            {placementStep === 1 && (
              <form onSubmit={handleLeadSubmit} className="space-y-5">
                <div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0362c0]">Langkah 1 dari 2</span>
                  <h3 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">Kenali level bahasa Inggrismu</h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">Tes ini mengukur grammar, vocabulary, reading, communication, dan listening, lalu memetakan hasil ke level CEFR sebagai acuan program belajar.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-black text-slate-700">Nama Lengkap *
                    <input type="text" required placeholder="Contoh: Asri Hartini" value={leadFormData.nama} onChange={(e) => setLeadFormData({ ...leadFormData, nama: e.target.value })} className={`${inputClass} mt-1.5`} />
                  </label>
                  <label className="text-xs font-black text-slate-700">Nomor WhatsApp Aktif *
                    <input type="tel" required inputMode="numeric" placeholder="Contoh: 085156916211" value={leadFormData.noWa} onChange={(e) => setLeadFormData({ ...leadFormData, noWa: e.target.value })} className={`${inputClass} mt-1.5`} />
                  </label>
                  <label className="text-xs font-black text-slate-700">Target Level Belajar
                    <select value={leadFormData.levelTarget} onChange={(e) => setLeadFormData({ ...leadFormData, levelTarget: e.target.value })} className={`${inputClass} mt-1.5 cursor-pointer`}>
                      <option value="basic">Basic</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </label>
                  <label className="text-xs font-black text-slate-700">Jadwal Trial Class
                    <select value={leadFormData.jadwalTrial} onChange={(e) => setLeadFormData({ ...leadFormData, jadwalTrial: e.target.value })} className={`${inputClass} mt-1.5 cursor-pointer`}>
                      <option>Sabtu (10.00 WIB)</option>
                      <option>Minggu (14.00 WIB)</option>
                      <option>Weekday (19.00 WIB)</option>
                    </select>
                  </label>
                </div>

                <label className="block text-xs font-black text-slate-700">Target Belajar (Opsional)
                  <textarea rows={2} placeholder="Contoh: Lancar wawancara kerja dan presentasi" value={leadFormData.catatan} onChange={(e) => setLeadFormData({ ...leadFormData, catatan: e.target.value })} className={`${inputClass} mt-1.5 resize-none`} />
                </label>

                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0362c0] py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#024f9c]">
                  Mulai Placement Test <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-center text-[10px] font-medium text-slate-400">Hasil bersifat diagnostik awal dan bukan sertifikat kompetensi resmi.</p>
              </form>
            )}

            {placementStep === 2 && (
              <section className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#0362c0]">{question.category}</p>
                    <h3 className="mt-1 text-lg font-black text-slate-900">Soal {currentQuestion + 1} dari {QUESTIONS.length}</h3>
                  </div>
                  <p className="text-xs font-bold text-slate-500">{answeredCount}/{QUESTIONS.length} dijawab</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#0362c0] to-sky-400 transition-all duration-300" style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }} />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  {question.passage && <div className="mb-4 rounded-2xl border-l-4 border-[#ffa715] bg-white p-4 text-sm font-semibold italic leading-relaxed text-slate-600">“{question.passage}”</div>}
                  {question.listeningText && (
                    <div className="mb-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0362c0] text-white shadow-sm">
                          <Volume2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-900">Listening Audio</p>
                          <p className="mt-0.5 text-[10px] font-medium text-slate-500">Dengarkan dengan saksama sebelum menjawab.</p>
                        </div>
                        <button type="button" onClick={playListeningAudio} className="rounded-xl bg-[#0362c0] px-3 py-2 text-[10px] font-black text-white transition hover:bg-[#024f9c] sm:text-xs">
                          Putar Audio
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-sm font-black leading-relaxed text-slate-900 sm:text-base">{question.question}</p>
                  <div className="mt-5 grid gap-2.5">
                    {question.options.map(([value, label], index) => {
                      const selected = quizAnswers[question.id] === value;
                      return (
                        <button key={value} type="button" onClick={() => selectAnswer(value)} className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left text-xs font-bold transition sm:text-sm ${selected ? 'border-[#0362c0] bg-blue-50 text-[#0362c0] shadow-sm' : 'border-white bg-white text-slate-700 hover:border-sky-200'}`}>
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${selected ? 'bg-[#0362c0] text-white' : 'bg-slate-100 text-slate-500'}`}>{String.fromCharCode(65 + index)}</span>
                          {label}
                          {selected && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion((value) => value - 1)} className="flex items-center justify-center gap-1 rounded-2xl border-2 border-slate-200 px-4 py-3 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Kembali</button>
                  {currentQuestion < QUESTIONS.length - 1 ? (
                    <button type="button" disabled={!quizAnswers[question.id]} onClick={() => setCurrentQuestion((value) => value + 1)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0362c0] py-3 text-xs font-black text-white transition hover:bg-[#024f9c] disabled:cursor-not-allowed disabled:opacity-50">Soal Berikutnya <ArrowRight className="h-4 w-4" /></button>
                  ) : (
                    <button type="button" disabled={answeredCount !== QUESTIONS.length} onClick={handleFinishPlacement} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#ffa715] py-3 text-xs font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"><Award className="h-4 w-4" /> Lihat Hasil</button>
                  )}
                </div>
              </section>
            )}

            {placementStep === 3 && (
              <section className="space-y-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50"><Award className="h-9 w-9" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Tes berhasil diselesaikan</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">Hasil Placement Test</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">Halo, <strong>{leadFormData.nama}</strong>. Berikut rekomendasi awal untuk program belajarmu.</p>
                </div>

                <div className={`rounded-3xl border-2 p-5 ${result.bg}`}>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Skor Kompetensi</p>
                  <p className={`mt-1 text-5xl font-black ${result.color}`}>{score}<span className="text-xl text-slate-400">/100</span></p>
                  <div className="mx-auto my-4 h-px max-w-xs bg-slate-200" />
                  <p className="text-xs font-bold text-slate-500">Rekomendasi Level</p>
                  <p className={`mt-1 text-2xl font-black ${result.color}`}>{result.level}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Pemetaan CEFR: {result.cefr}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs font-medium leading-relaxed text-slate-600">
                  <strong className="text-slate-900">Langkah selanjutnya:</strong> Tutor akan memvalidasi kemampuan speaking saat Trial Class <strong>{leadFormData.jadwalTrial}</strong> agar program belajar lebih tepat.
                </div>

                <a href={`https://wa.me/6281572120190?text=${encodeURIComponent(`Halo Mahir Speaking! Saya ${leadFormData.nama} telah menyelesaikan English Placement Test dengan skor ${score}/100 dan rekomendasi ${result.level} (${result.cefr}). Saya ingin konfirmasi Trial Class ${leadFormData.jadwalTrial}.`)}`} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 bg-emerald-500 py-4 text-xs font-black text-white shadow-lg transition hover:bg-emerald-600 sm:text-sm">
                  <MessageCircle className="h-5 w-5" /> Konfirmasi Hasil via WhatsApp
                </a>
                <button type="button" onClick={handleResetAndClose} className="w-full rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-200">Selesai & Tutup</button>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>,
    document.body,
  );
}