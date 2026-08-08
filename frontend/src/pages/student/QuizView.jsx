import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/api';
import { HelpCircle, CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export default function QuizView() {
  const { setActiveTab, addXpAndPoints, updateUserProfile, user } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: "Which is the most polite way to introduce yourself to a new colleague at work?",
      options: [
        "Hey you, what's up?",
        "Pleased to meet you, my name is Alex.",
        "I am Alex, talk later.",
        "Who are you?"
      ],
      correctAnswer: 1,
      explanation: "'Pleased to meet you' is standard professional etiquette for workplace introductions."
    },
    {
      id: 2,
      question: "What does the term 'Hometown' specifically refer to in English?",
      options: [
        "The city where you currently work",
        "The town where you were born or grew up",
        "Your favourite holiday destination",
        "The university you attended"
      ],
      correctAnswer: 1,
      explanation: "Hometown refers to your place of birth or childhood upbringing."
    },
    {
      id: 3,
      question: "Which phrase best uses the PREP method when sharing an opinion?",
      options: [
        "I like coffee. Bye.",
        "In my opinion, active speaking practice builds fluency because it trains muscle memory.",
        "Grammar rules are everything.",
        "I don't know."
      ],
      correctAnswer: 1,
      explanation: "Stating your Point followed by a clear Reason is the essence of the PREP structure."
    }
  ];

  const handleSelectOption = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = async () => {
    const currentQ = quizQuestions[currentQuestionIndex];
    let newScore = score;
    if (selectedOption === currentQ.correctAnswer) {
      newScore += 1;
      setScore(newScore);
    }

    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Quiz Complete
      setIsCompleted(true);
      
      // Calculate totalXp earned based on score (matching results screen formula)
      const totalXp = 25;
      
      // Optimistic update to match LMSView logic
      if (user) {
        const isAlreadyCompleted = user.completed_units && user.completed_units.includes(1);
        const nextCompleted = Array.from(new Set([...(user.completed_units || []), 1]));
        const updatedUser = {
          ...user,
          xp: isAlreadyCompleted
            ? (user.xp || 0)
            : (user.xp || 0) + totalXp,
          points: isAlreadyCompleted
            ? (user.points || 0)
            : (user.points || 0) + Math.floor(totalXp / 2),
          streak: isAlreadyCompleted
            ? (user.streak || 0)
            : (user.streak || 0) + 1,
          completed_units: nextCompleted
        };
        updateUserProfile(updatedUser);
      }

      // Trigger Confetti
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) { }

      // Save to backend
      try {
        const res = await courseService.completeLesson({
          lesson_id: 1,
          score: Math.round((newScore / quizQuestions.length) * 100),
          xp_earned: totalXp
        });
        if (res.success && res.xp !== undefined && user) {
          // Sinkronisasi dengan XP dan poin terbaru dari database cloud
          const isAlreadyCompleted = user.completed_units && user.completed_units.includes(1);
          const nextCompleted = Array.from(new Set([...(user.completed_units || []), 1]));
          updateUserProfile({
            ...user,
            xp: res.xp,
            points: res.points,
            streak: res.streak !== undefined ? res.streak : (user.streak || 0) + (isAlreadyCompleted ? 0 : 1),
            completed_units: nextCompleted
          });
        }
      } catch (err) {
        console.error('Quiz save backend error:', err);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

      {!isCompleted ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-6">

          {/* Header Progress */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase">
              <HelpCircle className="w-4 h-4 text-amberIcon" /> Lesson Quiz Assessment
            </div>
            <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="font-stinger font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
            {quizQuestions[currentQuestionIndex].question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between ${selectedOption === idx
                    ? 'bg-brand/10 border-brand text-brand ring-2 ring-brand/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-brand'
                  }`}
              >
                <span>{option}</span>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${selectedOption === idx ? 'border-brand bg-brand text-white' : 'border-slate-300'
                  }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${selectedOption !== null
                ? 'bg-brand text-electric shadow-glow hover:bg-brand-600 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            <span>{currentQuestionIndex + 1 === quizQuestions.length ? 'Submit Quiz & Calculate Score' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      ) : (
        /* Quiz Complete Results */
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white text-center space-y-6 bg-white shadow-glass">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amberIcon flex items-center justify-center mx-auto shadow-goldGlow">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-stinger font-black text-3xl text-brand">Quiz Completed!</h2>
            <p className="text-sm text-slate-600">Great job testing your English comprehension.</p>
          </div>

          {/* Score Badge */}
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl max-w-sm mx-auto space-y-2">
            <div className="text-xs text-slate-500 font-bold uppercase">Final Accuracy</div>
            <div className="font-stinger font-black text-4xl text-emerald-700">
              {Math.round((score / quizQuestions.length) * 100)}%
            </div>
            <div className="text-xs font-bold text-amber-800 pt-1">
              ⚡ Earned +25 XP Points!
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('student-dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand text-electric font-bold text-xs shadow-glow hover:bg-brand-600"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentQuestionIndex(0);
                setScore(0);
                setSelectedOption(null);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-700 hover:border-brand"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
