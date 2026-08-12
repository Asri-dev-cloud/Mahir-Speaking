// Halaman TutorDashboard: Dasbor utama untuk guru/tutor asisten dalam meninjau daftar kursus yang diampu.
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/api';
import { BookOpen, Upload, Users, Award, Plus, CheckCircle } from 'lucide-react';

export default function TutorDashboard() {
  const { user, setActiveTab } = useAuth();
  const [courses, setCourses] = useState([]);

  // Memuat data daftar materi kursus yang terdaftar di database.
  useEffect(() => {
    courseService.getCourses()
      .then(data => {
        if (data.success) setCourses(data.courses);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Tutor Header */}
      <div className="glass-panel p-8 rounded-3xl border border-white bg-gradient-to-r from-brand to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="bg-amberIcon text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">
            Tutor Control Portal
          </span>
          <h1 className="font-stinger text-3xl font-black text-white mt-2">
            Welcome, {user?.full_name || 'Coach'}! 👨‍🏫
          </h1>
          <p className="text-xs text-slate-300">Manage speaking courses, create quizzes, and review student progress.</p>
        </div>

        <button
          onClick={() => setActiveTab('upload-lesson')}
          className="px-6 py-3 rounded-xl bg-electric text-slate-950 font-black text-xs shadow-goldGlow hover:scale-105 transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Upload New Lesson
        </button>
      </div>

      {/* Course Management Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-4">
        <h2 className="font-stinger font-extrabold text-xl text-brand">Assigned Speaking Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <img src={course.thumbnail} alt={course.title} className="w-full h-36 rounded-xl object-cover" />
              <div className="flex items-center justify-between">
                <span className="bg-brand/10 text-brand font-bold text-[10px] px-2.5 py-0.5 rounded uppercase">
                  {course.level}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{course.total_lessons} Lessons</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{course.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
