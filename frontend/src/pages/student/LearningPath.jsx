import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, CheckCircle, Lock, Play, Star, Trophy, ArrowRight } from 'lucide-react';

export default function LearningPath() {
  const { setActiveTab } = useAuth();

  const levels = [
    {
      code: 'A1',
      title: 'Foundation & Everyday Conversation',
      description: 'Master daily greetings, introductions, ordering food, and spatial directions.',
      status: 'unlocked',
      progress: 75,
      lessons: [
        { id: 1, title: 'Self Introduction & Icebreakers', completed: true, score: '95/100' },
        { id: 2, title: 'Ordering Food & Coffee at a Cafe', completed: true, score: '90/100' },
        { id: 3, title: 'Asking for Directions in a New City', completed: false, active: true },
        { id: 4, title: 'Expressing Personal Opinions & Preferences', completed: false, locked: false }
      ]
    },
    {
      code: 'B1',
      title: 'Business English & Workplace Pitching',
      description: 'Professional communication, meetings, elevator pitches, and job interviews.',
      status: 'unlocked',
      progress: 30,
      lessons: [
        { id: 5, title: 'Professional Meeting Contributions', completed: false, active: true },
        { id: 6, title: 'Job Interview Question Strategies', completed: false, locked: false },
        { id: 7, title: 'Elevator Pitch & Product Presentation', completed: false, locked: false }
      ]
    },
    {
      code: 'B2',
      title: 'IELTS Speaking 7.0+ Intensive',
      description: 'Part 1, 2, and 3 cue card breakdown with examiner evaluation criteria.',
      status: 'locked',
      progress: 0,
      lessons: [
        { id: 8, title: 'IELTS Speaking Part 1 Warm-up', completed: false, locked: true },
        { id: 9, title: 'Part 2 Cue Card 2-Minute Monologue', completed: false, locked: true },
        { id: 10, title: 'Part 3 Abstract Discussion & Opinion', completed: false, locked: true }
      ]
    },
    {
      code: 'C1',
      title: 'Confident Public Speaking & Debating',
      description: 'Advanced rhetorical structures, spontaneous debate, and voice modulation.',
      status: 'locked',
      progress: 0,
      lessons: [
        { id: 11, title: 'Persuasive Speech & Rhetoric', completed: false, locked: true },
        { id: 12, title: 'Spontaneous Debate Formulations', completed: false, locked: true }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full uppercase">
          <Sparkles className="w-4 h-4 text-amberIcon" /> CEFR Standardized Roadmap
        </div>
        <h1 className="font-stinger text-4xl font-black text-brand">Your English Learning Path</h1>
        <p className="text-slate-700 text-sm font-medium">
          Follow the structured node map to advance your speaking fluency step by step.
        </p>
      </div>

      {/* Levels Tree */}
      <div className="space-y-12 relative before:absolute before:left-6 md:before:left-1/2 before:top-8 before:bottom-8 before:w-1 before:bg-brand/20 before:-ml-0.5">
        
        {levels.map((level, idx) => (
          <div key={idx} className="relative z-10 space-y-6">
            
            {/* Level Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3.5 py-1.5 rounded-xl font-black text-sm text-white ${
                    level.code === 'A1' ? 'bg-brand' : level.code === 'B1' ? 'bg-amberIcon' : level.code === 'B2' ? 'bg-purple-600' : 'bg-slate-800'
                  }`}>
                    Level {level.code}
                  </span>
                  <div>
                    <h2 className="font-stinger font-black text-xl text-slate-900">{level.title}</h2>
                    <p className="text-xs text-slate-500 font-medium">{level.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span>{level.progress}% Completed</span>
                  <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand h-full rounded-full transition-all" style={{ width: `${level.progress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Lessons Node List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {level.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    onClick={() => !lesson.locked && setActiveTab('lesson-view')}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      lesson.completed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 cursor-pointer hover:shadow-md'
                        : lesson.active
                        ? 'bg-white border-brand border-2 shadow-md cursor-pointer scale-[1.02]'
                        : lesson.locked
                        ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-slate-200 text-slate-800 cursor-pointer hover:border-brand'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lesson.completed ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      ) : lesson.active ? (
                        <div className="w-8 h-8 rounded-full bg-brand text-electric flex items-center justify-center font-bold shadow-glow">
                          <Play className="w-4 h-4 fill-electric" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">
                          {lesson.id}
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-xs sm:text-sm">{lesson.title}</h4>
                        {lesson.score && <span className="text-[10px] font-semibold text-emerald-700">Score: {lesson.score}</span>}
                        {lesson.active && <span className="text-[10px] font-bold text-brand">Current Active Lesson</span>}
                      </div>
                    </div>

                    {lesson.locked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-brand" />
                    )}
                  </div>
                ))}
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
