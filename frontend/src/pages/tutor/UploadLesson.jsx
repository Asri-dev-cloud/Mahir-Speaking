// Halaman UploadLesson: Formulir khusus asisten pengajar/tutor untuk mengunggah materi pelajaran baru, video pembelajaran, bahan bacaan, kosakata target, serta kuis pilihan ganda.
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/api';
import { Upload, Plus, CheckCircle, ArrowLeft } from 'lucide-react';

export default function UploadLesson() {
  const { setActiveTab } = useAuth();
  const [courseId, setCourseId] = useState(1);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [readingContent, setReadingContent] = useState('');
  const [targetVocab, setTargetVocab] = useState('["Fluency", "Articulation", "Intonation"]');
  const [speakingPrompt, setSpeakingPrompt] = useState('');

  // Mengelola pembuatan soal kuis pilihan ganda yang melekat pada pelajaran ini.
  const [quizQuestion, setQuizQuestion] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(1);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Menangani pengiriman data pelajaran baru beserta kuis ke server database.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await courseService.uploadLesson({
        course_id: Number(courseId),
        title,
        video_url: videoUrl,
        reading_content: readingContent,
        target_vocabulary: targetVocab,
        speaking_prompt: speakingPrompt,
        quiz: quizQuestion ? {
          question: quizQuestion,
          options: [opt0, opt1, opt2, opt3],
          correct_answer: Number(correctAnswer),
          xp_reward: 25
        } : null
      });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setActiveTab('tutor-dashboard');
        }, 2000);
      }
    } catch (err) {
      alert(err.message || 'Failed to upload lesson.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-glass space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-stinger font-black text-3xl text-brand">Upload New Speaking Lesson</h1>
            <p className="text-xs text-slate-600">Add original video lessons, reading materials, and interactive quizzes.</p>
          </div>
          {success && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Lesson Published!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Target Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
              >
                <option value={1}>Daily Conversation Mastery (A1)</option>
                <option value={2}>Business English Speaking (B1)</option>
                <option value={3}>IELTS Speaking 7.0+ (B2)</option>
                <option value={4}>Confident Public Speaking (C1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Lesson Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Job Interview Elevator Pitches"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Video Embed URL</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Reading Content & Grammar Explanation</label>
            <textarea
              rows={4}
              value={readingContent}
              onChange={(e) => setReadingContent(e.target.value)}
              placeholder="Detailed explanation of phrases and rules..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Oral Speaking Practice Prompt</label>
            <input
              type="text"
              value={speakingPrompt}
              onChange={(e) => setSpeakingPrompt(e.target.value)}
              placeholder="Prompt for user voice recorder..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand outline-none text-xs font-medium"
            />
          </div>

          {/* Quiz Builder Sub-form */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-stinger font-bold text-base text-slate-900">Attach Lesson Quiz (Optional)</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quiz Question</label>
              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                placeholder="Question text..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Option A" value={opt0} onChange={(e) => setOpt0(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <input type="text" placeholder="Option B" value={opt1} onChange={(e) => setOpt1(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <input type="text" placeholder="Option C" value={opt2} onChange={(e) => setOpt2(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <input type="text" placeholder="Option D" value={opt3} onChange={(e) => setOpt3(e.target.value)} className="p-2 border rounded-lg text-xs" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand text-electric font-black text-sm shadow-glow hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{loading ? 'Publishing Lesson...' : 'Publish Lesson to Course'}</span>
          </button>

        </form>

      </div>

    </div>
  );
}
