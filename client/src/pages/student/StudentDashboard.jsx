import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/api';
import { 
  Sparkles, Flame, Trophy, BookOpen, Play, Bot, ArrowRight, CheckCircle2, Star, Award, Zap
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, setActiveTab } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getCourses()
      .then(data => {
        if (data.success) setCourses(data.courses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Welcome & Stats */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass bg-gradient-to-r from-brand/90 via-brand to-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-2 bg-amberIcon text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Active Package: {user?.package_name || 'Standard Pro'} Plan
          </div>
          <h1 className="font-stinger text-3xl sm:text-4xl font-black text-white">
            Welcome back, {user?.full_name || 'Learner'}! 👋
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm font-medium">
            You are currently on a <strong className="text-electric">{user?.streak || 7}-Day Speaking Streak</strong>. Keep up the daily practice!
          </p>
        </div>

        {/* Gamified Stat Pills */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="bg-white/10 backdrop-blur border border-white/20 p-3.5 rounded-2xl flex items-center gap-3 min-w-[130px]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amberIcon flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Total XP</div>
              <div className="font-stinger font-black text-xl text-electric">{user?.xp || 1450}</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-3.5 rounded-2xl flex items-center gap-3 min-w-[130px]">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Streak</div>
              <div className="font-stinger font-black text-xl text-white">{user?.streak || 7} Days</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-3.5 rounded-2xl flex items-center gap-3 min-w-[130px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-300 font-bold uppercase">Points</div>
              <div className="font-stinger font-black text-xl text-emerald-400">{user?.points || 420}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 cols: Resume Current Course & Path */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Resume Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-brand fill-brand" />
                <h2 className="font-stinger font-bold text-xl text-brand">Current Speaking Lesson</h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Level A1 - Lesson 1</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-slate-900 text-base">Self Introduction & Icebreakers</h3>
                <p className="text-xs text-slate-500">Target Vocabulary: Delighted, Profession, Enthusiastic, Casual</p>
                <div className="w-48 bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand h-full w-3/4 rounded-full"></div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('lesson-view')}
                className="px-6 py-3 rounded-xl bg-brand text-electric font-bold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-2"
              >
                <span>Resume Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Available Speaking Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-stinger font-extrabold text-2xl text-brand">Your Learning Path Courses</h2>
              <button onClick={() => setActiveTab('learning-path')} className="text-xs font-bold text-brand hover:underline">
                View Full Path Map ➜
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="glass-panel p-5 rounded-2xl border border-white space-y-3 flex flex-col justify-between hover:shadow-glow transition-all">
                  <div className="space-y-2">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-36 rounded-xl object-cover" />
                    <span className="inline-block bg-brand/10 text-brand font-bold text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                      {course.level}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{course.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">{course.total_lessons} Lessons</span>
                    <button
                      onClick={() => setActiveTab('lesson-view')}
                      className="px-4 py-2 rounded-lg bg-brand text-white font-bold text-xs hover:bg-brand-600 transition-colors"
                    >
                      Start Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 cols: AI Assistant Quick Action & Leaderboard Teaser */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Coach Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white space-y-4 bg-gradient-to-b from-white to-amber-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amberIcon text-white flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-stinger font-bold text-lg text-slate-900">24/7 AI Speaking Coach</h3>
                <p className="text-[11px] text-slate-500 font-medium">Practice grammar, speech, & vocab</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-amber-200">
              "Need feedback on your job interview speech or grammar? Ask AI Coach right now!"
            </p>

            <button
              onClick={() => setActiveTab('ai-chat')}
              className="w-full py-3 rounded-xl bg-amberIcon text-slate-950 font-black text-xs shadow-goldGlow hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Speaking Chat</span>
            </button>
          </div>

          {/* Quick Package Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">My Subscription</span>
              <button onClick={() => setActiveTab('my-package')} className="text-xs font-bold text-brand hover:underline">Manage</button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{user?.package_name || 'Standard'} Plan</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
              </div>
              <div className="text-xs text-slate-500">
                Daily AI Messages: <strong>{user?.ai_daily_limit === -1 ? 'Unlimited' : `${user?.ai_daily_limit || 50} / day`}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
