import React, { useState } from "react";
import { ArrowLeft, ChevronRight, CheckCircle2, Award, X } from "lucide-react";

// Bank 20 Soal Kuis untuk Unit Free (Unit 1 & Unit 2)
export const freeQuestionsByUnit = {
  1: [
    { id: 1, q: "Complete the sentence: 'Good morning! My name ___ Sarah.'", opts: ["is", "am", "are", "be"], ans: 0, exp: "Gunakan 'is' untuk subjek 'My name'." },
    { id: 2, q: "Choose the correct greeting for 9:00 AM:", opts: ["Good evening", "Good afternoon", "Good morning", "Good night"], ans: 2, exp: "'Good morning' digunakan untuk pagi hari." },
    { id: 3, q: "How do you politely respond to 'Nice to meet you'?", opts: ["Nice to meet you too!", "I am fine.", "Goodbye!", "No problem."], ans: 0, exp: "'Nice to meet you too!' adalah respon sopan." },
    { id: 4, q: "Complete the sentence: 'I ___ from Jakarta, Indonesia.'", opts: ["is", "are", "am", "be"], ans: 2, exp: "Gunakan 'am' setelah subjek 'I'." },
    { id: 5, q: "What is the polite way to ask someone's name?", opts: ["Who are you?", "What is your name?", "Tell me your name!", "Hey you!"], ans: 1, exp: "'What is your name?' adalah cara umum yang sopan." },
    { id: 6, q: "Complete the sentence: 'She ___ a dedicated student.'", opts: ["are", "am", "is", "were"], ans: 2, exp: "Subjek 'She' berpasangan dengan 'is'." },
    { id: 7, q: "How do you say goodbye in a professional meeting?", opts: ["Goodbye, have a great day!", "Whatever", "Bye bye kid", "Catch ya later"], ans: 0, exp: "'Goodbye, have a great day!' adalah penutup formal." },
    { id: 8, q: "Complete the sentence: 'They ___ my new classmates.'", opts: ["is", "are", "am", "was"], ans: 1, exp: "Subjek jamak 'They' menggunakan 'are'." },
    { id: 9, q: "Which contraction stands for 'I am'?", opts: ["I's", "I'm", "I're", "I've"], ans: 1, exp: "I am disingkat menjadi I'm." },
    { id: 10, q: "Choose the correct question: 'Where ___ you work?'", opts: ["does", "do", "is", "are"], ans: 1, exp: "Gunakan kata bantu 'do' untuk subjek 'you'." },
    { id: 11, q: "Complete: 'Nice to meet you, Mr. Alex. I ___ Budi.'", opts: ["is", "are", "am", "be"], ans: 2, exp: "Gunakan 'am' setelah subjek 'I'." },
    { id: 12, q: "What does 'What do you do?' mean?", opts: ["Apa pekerjaanmu/kesibukanmu?", "Apa yang sedang kamu makan?", "Ke mana kamu pergi?", "Siapa nama temanmu?"], ans: 0, exp: "'What do you do?' menanyakan pekerjaan atau profesi." },
    { id: 13, q: "Complete: 'He ___ an engineer at a software firm.'", opts: ["am", "are", "is", "be"], ans: 2, exp: "Subjek 'He' berpasangan dengan 'is'." },
    { id: 14, q: "Which response is polite when introduced to a colleague?", opts: ["Pleased to meet you", "Get away", "No thanks", "Who cares"], ans: 0, exp: "'Pleased to meet you' sangat sopan." },
    { id: 15, q: "Complete: 'We ___ excited to join the speaking class.'", opts: ["is", "are", "am", "was"], ans: 1, exp: "Subjek 'We' menggunakan to-be 'are'." },
    { id: 16, q: "Choose the correct short answer to 'Are you ready?'", opts: ["Yes, I am.", "Yes, I is.", "Yes, I be.", "Yes, I are."], ans: 0, exp: "Jawaban singkat positif untuk 'Are you...?' adalah 'Yes, I am.'" },
    { id: 17, q: "Complete: 'This ___ my friend, Amanda.'", opts: ["are", "am", "is", "be"], ans: 2, exp: "'This' sebagai kata ganti menggunakan 'is'." },
    { id: 18, q: "Choose the correct spelling:", opts: ["Introdution", "Introduction", "Introducshon", "Introsuction"], ans: 1, exp: "Ejaan yang tepat adalah 'Introduction'." },
    { id: 19, q: "Complete: 'How ___ you today?'", opts: ["is", "am", "are", "be"], ans: 2, exp: "Gunakan 'are' untuk menanyakan kabar 'you'." },
    { id: 20, q: "Choose the best closing phrase for an introduction:", opts: ["Thank you for your time.", "Shut up.", "I don't care.", "Bye bye."], ans: 0, exp: "'Thank you for your time' adalah ucapan penutup yang sangat baik." }
  ],
  2: [
    { id: 1, q: "Complete: 'I usually ___ up at 6 AM.'", opts: ["wake", "wakes", "waking", "woke"], ans: 0, exp: "Gunakan 'wake' untuk subjek jamak/I dalam simple present." },
    { id: 2, q: "Choose the correct daily activity verb: 'He ___ his teeth twice a day.'", opts: ["brush", "brushes", "brushing", "brushed"], ans: 1, exp: "Subjek tunggal 'He' membutuhkan akhiran -es pada kata kerja 'brush'." },
    { id: 3, q: "Complete the sentence: 'She ___ to school by bus.'", opts: ["go", "going", "goes", "gone"], ans: 2, exp: "Subjek tunggal 'She' menggunakan 'goes' dalam simple present tense." },
    { id: 4, q: "What is the opposite of 'wake up'?", opts: ["go to sleep", "get up", "eat breakfast", "take a shower"], ans: 0, exp: "Lawan kata dari 'wake up' (bangun) adalah 'go to sleep' (tidur)." },
    { id: 5, q: "Complete: 'They ___ have lunch at the canteen.'", opts: ["always", "is always", "are always", "always is"], ans: 0, exp: "Adverb of frequency 'always' diletakkan sebelum main verb 'have'." },
    { id: 6, q: "Complete: 'What time ___ you have breakfast?'", opts: ["do", "does", "is", "are"], ans: 0, exp: "Gunakan kata bantu 'do' untuk subjek 'you'." },
    { id: 7, q: "Complete: 'He ___ have dinner at 8 PM.'", opts: ["doesn't", "don't", "isn't", "not"], ans: 0, exp: "Bentuk negatif simple present untuk subjek 'He' adalah 'doesn't'." },
    { id: 8, q: "Choose the correct phrase: 'I ___ a shower every morning.'", opts: ["make", "do", "take", "clean"], ans: 2, exp: "Frasa standar dalam bahasa Inggris adalah 'take a shower' atau 'have a shower'." },
    { id: 9, q: "Complete: 'My father goes ___ work at 7 AM.'", opts: ["to", "at", "on", "in"], ans: 0, exp: "Gunakan preposisi 'to' setelah 'goes' untuk menyatakan arah tujuan kerja." },
    { id: 10, q: "Complete: 'Do you study English ___ the afternoon?'", opts: ["on", "at", "in", "for"], ans: 2, exp: "Gunakan preposisi 'in' untuk 'the afternoon'." },
    { id: 11, q: "Complete: 'He washes the dishes ___ night.'", opts: ["in", "at", "on", "to"], ans: 1, exp: "Gunakan preposisi 'at' untuk waktu 'night' (at night)." },
    { id: 12, q: "Choose the correct order: 'usually / goes / he / bed / to / early'", opts: ["He usually goes to bed early.", "Usually he goes bed to early.", "He goes usually to bed early.", "He goes to bed early usually."], ans: 0, exp: "Adverb of frequency 'usually' diletakkan di antara subjek dan kata kerja." },
    { id: 13, q: "Complete: 'Does she ___ her house every Saturday?'", opts: ["clean", "cleans", "cleaning", "cleaned"], ans: 0, exp: "Setelah kata bantu 'does' dalam kalimat tanya, kata kerja kembali ke bentuk dasar 'clean'." },
    { id: 14, q: "What does 'take a nap' mean?", opts: ["Tidur siang sebentar", "Mandi air hangat", "Makan siang bersama", "Berangkat kerja"], ans: 0, exp: "'Take a nap' berarti tidur siang atau istirahat sejenak." },
    { id: 15, q: "Complete: 'We watch TV ___ Sundays.'", opts: ["in", "on", "at", "by"], ans: 1, exp: "Gunakan preposisi 'on' sebelum nama hari jamak (Sundays)." },
    { id: 16, q: "Complete: 'How often ___ your mother go to the market?'", opts: ["do", "does", "is", "are"], ans: 1, exp: "Subjek tunggal 'your mother' menggunakan kata bantu 'does'." },
    { id: 17, q: "Choose the correct question to ask about routine:", opts: ["What do you usually do on weekends?", "What are you doing now?", "Where did you go yesterday?", "Have you eaten?"], ans: 0, exp: "'What do you usually do...' digunakan untuk menanyakan rutinitas kebiasaan." },
    { id: 18, q: "Complete: 'I never ___ coffee at night.'", opts: ["drink", "drinks", "drinking", "drank"], ans: 0, exp: "Subjek 'I' menggunakan kata kerja dasar 'drink'." },
    { id: 19, q: "Complete: 'My sister ___ her homework in her bedroom.'", opts: ["do", "does", "doing", "did"], ans: 1, exp: "Subjek 'My sister' (tunggal) menggunakan 'does' sebagai kata kerja." },
    { id: 20, q: "Which word indicates that an action happens every day?", opts: ["Daily", "Weekly", "Hourly", "Monthly"], ans: 0, exp: "'Daily' berarti harian atau terjadi setiap hari." }
  ]
};

export default function FreeQuizModal({ selectedLesson, closeLesson, finishLesson, setActiveTab }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Ambil list pertanyaan berdasarkan ID unit, default ke unit 1 jika tidak ada
  const questionsList = freeQuestionsByUnit[selectedLesson.id] || freeQuestionsByUnit[1];

  const currentQ = questionsList[quizIndex];
  const answeredCount = Object.keys(quizAnswers).length;

  let correctCount = 0;
  questionsList.forEach((q, idx) => {
    if (quizAnswers[idx] === q.ans) correctCount++;
  });
  const calculatedScore = Math.round((correctCount / questionsList.length) * 100);
  const earnedXp = 5; // Setiap kuis bernilai 5 XP secara mutlak

  const handleSelectAnswer = (optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [quizIndex]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    finishLesson(earnedXp, calculatedScore);
  };

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] overflow-y-auto bg-slate-950/85 p-2 sm:p-6 backdrop-blur-md flex items-center justify-center custom-scrollbar animate-fadeIn">
      <div className="mx-auto w-full max-w-4xl max-h-[92vh] flex flex-col justify-between overflow-y-auto rounded-[24px] sm:rounded-[32px] bg-white shadow-2xl border-2 sm:border-4 border-blue-600 custom-scrollbar">
        
        {/* Header Modal Kuis */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-800 p-3.5 sm:px-8 text-white gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={closeLesson}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-yellow-300 bg-black/30 px-2 py-0.5 rounded-full border border-yellow-300/30 inline-block truncate max-w-full">
                FREE QUIZ • UNIT {selectedLesson.id}
              </span>
              <h2 className="text-xs sm:text-lg font-black text-white mt-0.5 truncate">
                {selectedLesson.title}
              </h2>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] sm:text-xs font-black bg-yellow-300 text-blue-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-md whitespace-nowrap">
              {answeredCount}/20 Terjawab
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          {/* 🔢 NAVIGATOR 20 NOMOR SOAL */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>NOMOR SOAL (1 - 20):</span>
              <span className="text-blue-600">Soal {quizIndex + 1} dari 20</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10 sm:gap-2">
              {questionsList.map((q, idx) => {
                const userAns = quizAnswers[idx];
                const isAnswered = userAns !== undefined;
                const isCorrect = isAnswered && userAns === q.ans;
                const isCurrent = idx === quizIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setQuizIndex(idx)}
                    className={`h-8 sm:h-9 rounded-xl font-black text-xs transition-all cursor-pointer border flex items-center justify-center ${
                      isCurrent
                        ? "ring-4 ring-blue-500 scale-105 shadow-md border-slate-900 bg-white text-slate-900"
                        : isAnswered
                        ? isCorrect
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                          : "bg-rose-500 text-white border-rose-600 shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-200 border-slate-300"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🏆 JIKA SUDAH SUBMIT: TAMPILKAN RINGKASAN SKOR */}
          {quizSubmitted ? (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 p-5 sm:p-8 rounded-3xl text-center space-y-4 shadow-lg animate-scaleUp">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-stinger font-black text-xl sm:text-3xl text-slate-900 uppercase">
                  Kuis Free Selesai! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-md mx-auto">
                  Anda menjawab <span className="text-emerald-600 font-black">{correctCount} dari 20 soal benar</span> ({calculatedScore}%) dan memperoleh <span className="text-blue-600 font-black">+{earnedXp} XP</span>!
                </p>
              </div>

              <div className="inline-flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                <span className="text-xs sm:text-sm font-black text-emerald-700">
                  Skor: {calculatedScore}/100 ({correctCount}/20 Benar)
                </span>
                <span className="text-xs font-black bg-yellow-300 text-blue-900 px-3 py-1 rounded-xl">
                  +{earnedXp} XP Diberikan
                </span>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    closeLesson();
                    setActiveTab("leaderboard");
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-xs sm:text-sm hover:bg-blue-800 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <span>Lihat Peringkat Leaderboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ❓ TAMPILAN PERTANYAAN KUIS */
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                  PERTANYAAN NO. {quizIndex + 1}
                </span>
                <h3 className="text-sm sm:text-lg font-black text-slate-900 leading-snug">
                  {currentQ.q}
                </h3>
              </div>

              {/* 4 PILIHAN JAWABAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {currentQ.opts.map((opt, optIdx) => {
                  const selectedAns = quizAnswers[quizIndex];
                  const hasAnswered = selectedAns !== undefined;
                  const isChosen = selectedAns === optIdx;
                  const isRightAnswer = optIdx === currentQ.ans;
                  const label = ["A", "B", "C", "D"][optIdx];

                  let btnStyle = "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400";
                  let badgeStyle = "bg-slate-100 text-slate-700";

                  if (hasAnswered) {
                    if (isChosen && isRightAnswer) {
                      btnStyle = "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300";
                      badgeStyle = "bg-yellow-300 text-blue-900";
                    } else if (isChosen && !isRightAnswer) {
                      btnStyle = "bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300";
                      badgeStyle = "bg-white text-rose-700";
                    } else if (!isChosen && isRightAnswer) {
                      btnStyle = "bg-emerald-100 text-emerald-950 border-emerald-400 font-bold";
                      badgeStyle = "bg-emerald-500 text-white";
                    } else {
                      btnStyle = "bg-slate-50 text-slate-400 border-slate-200 opacity-50";
                      badgeStyle = "bg-slate-200 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left font-bold text-xs sm:text-sm transition-all border-2 flex items-center justify-between gap-2.5 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${badgeStyle}`}>
                          {label}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>

                      {hasAnswered && isChosen && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shrink-0 border border-white/20">
                          {isRightAnswer ? "BENAR" : "SALAH"}
                        </span>
                      )}
                      {hasAnswered && !isChosen && isRightAnswer && (
                        <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase shrink-0">
                          Kunci
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* PENJELASAN JAWABAN */}
              {quizAnswers[quizIndex] !== undefined && (
                <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
                  quizAnswers[quizIndex] === currentQ.ans
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}>
                  {quizAnswers[quizIndex] === currentQ.ans ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-black text-xs sm:text-sm">
                      {quizAnswers[quizIndex] === currentQ.ans
                        ? "Jawaban Anda Benar!"
                        : `Jawaban Anda Belum Tepat! (Kunci: Pilihan ${["A", "B", "C", "D"][currentQ.ans]})`}
                    </p>
                    <p className="mt-1 leading-relaxed"><strong>Penjelasan:</strong> {currentQ.exp}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TOMBOL NAVIGASI SOAL STICKY */}
        {!quizSubmitted && (
          <div className="sticky bottom-0 bg-white pt-3 pb-3 border-t-2 border-slate-200 flex items-center justify-between gap-3 z-30 px-4 sm:px-8 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] rounded-b-[24px] sm:rounded-b-[32px] shrink-0">
            <button
              disabled={quizIndex === 0}
              onClick={() => setQuizIndex((prev) => Math.max(0, prev - 1))}
              className="px-3.5 sm:px-5 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs text-slate-800 disabled:opacity-30 cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 shrink-0 bg-white shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Sebelumnya</span>
            </button>

            {quizIndex < 19 ? (
              <button
                onClick={() => setQuizIndex((prev) => Math.min(19, prev + 1))}
                className="px-5 sm:px-7 py-3 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm hover:bg-blue-700 cursor-pointer shadow-lg flex items-center gap-1.5 shrink-0 border border-blue-800"
              >
                <span>Soal Selanjutnya</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-5 sm:px-7 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs sm:text-sm hover:bg-emerald-700 cursor-pointer shadow-xl flex items-center gap-1.5 shrink-0 border border-emerald-800"
              >
                <span>Selesaikan & Kirim Kuis</span>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
