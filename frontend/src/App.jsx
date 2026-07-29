import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AIChatProvider } from './context/AIChatContext';

import Navbar from './components/common/Navbar';
import MobileNav from './components/common/MobileNav';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import LMSView from './pages/public/LMSView';
import Portfolio from './pages/public/Portfolio';
import PricingPage from './pages/public/PricingPage';
import Branding from './pages/public/Branding';
import AuthPage from './pages/public/AuthPage';
import ForgotPassword from './pages/public/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import LearningPath from './pages/student/LearningPath';
import LessonView from './pages/student/LessonView';
import QuizView from './pages/student/QuizView';
import AIChatView from './pages/student/AIChatView';
import LeaderboardView from './pages/student/LeaderboardView';
import MyPackage from './pages/student/MyPackage';
import Profile from './pages/student/Profile';

// Tutor Pages
import TutorDashboard from './pages/tutor/TutorDashboard';
import UploadLesson from './pages/tutor/UploadLesson';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePackages from './pages/admin/ManagePackages';

function MainContent() {
  const { activeTab } = useAuth();

  const renderCurrentPage = () => {
    switch (activeTab) {
      // Public
      case 'home': return <Home />;
      case 'lms': return <LMSView />;
      case 'branding': return <Branding />;
      case 'portfolio': return <Portfolio />;
      case 'pricing': return <PricingPage />;
      case 'leaderboard-public': return <LeaderboardView />;
      case 'auth': return <AuthPage />;
      case 'login': return <AuthPage />;
      case 'register': return <AuthPage />;
      case 'forgot-password': return <ForgotPassword />;

      // Student
      case 'student-dashboard': return <StudentDashboard />;
      case 'learning-path': return <LearningPath />;
      case 'lesson-view': return <LessonView />;
      case 'quiz-view': return <QuizView />;
      case 'ai-chat': return <AIChatView />;
      case 'leaderboard': return <LeaderboardView />;
      case 'my-package': return <MyPackage />;
      case 'profile': return <Profile />;

      // Tutor
      case 'tutor-dashboard': return <TutorDashboard />;
      case 'manage-courses': return <TutorDashboard />;
      case 'upload-lesson': return <UploadLesson />;

      // Admin
      case 'admin-dashboard': return <AdminDashboard />;
      case 'manage-users': return <ManageUsers />;
      case 'manage-packages': return <ManagePackages />;

      default: return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        {renderCurrentPage()}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AIChatProvider>
        <MainContent />
      </AIChatProvider>
    </AuthProvider>
  );
}
