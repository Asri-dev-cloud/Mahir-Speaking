import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AIChatProvider } from './context/AIChatContext';

import Navbar from './components/common/Navbar';
import MobileNav from './components/common/MobileNav';
import Footer from './components/common/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import { FloatingAssistant } from './components/FloatingAssistant';
import { MashiraAssistant } from './components/MashiraAssistant';

// Halaman Publik yang menyediakan informasi umum bagi pengunjung.
import Home from './pages/public/Home';
import LMSView from './pages/public/LMSView';
import Portfolio from './pages/public/Portfolio';
import PricingPage from './pages/public/PricingPage';
import Branding from './pages/public/Branding';
import AuthPage from './pages/public/AuthPage';
import ForgotPassword from './pages/public/ForgotPassword';
import BlogView from './pages/public/BlogView';

// Halaman Siswa (Student) untuk mengakses materi pelajaran, kuis, latihan percakapan, dan status keanggotaan.
import LessonView from './pages/student/LessonView';
import QuizView from './pages/student/QuizView';
import AIChatView from './pages/student/AIChatView';
import LeaderboardView from './pages/student/LeaderboardView';
import MyPackage from './pages/student/MyPackage';
import Profile from './pages/student/Profile';

// Halaman Tutor untuk guru atau pengajar mengunggah pelajaran baru dan mengelola materi.
import TutorDashboard from './pages/tutor/TutorDashboard';
import UploadLesson from './pages/tutor/UploadLesson';

// Portal khusus administrator sistem.
import AdminPortal from './pages/admin/AdminPortal';

import WelcomeModal from './components/common/WelcomeModal';

// Komponen Utama untuk merender antarmuka aplikasi.
function MainContent() {
  const { activeTab } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);
  const floatingButtonRef = React.useRef(null);

  // Efek samping untuk memastikan halaman digulirkan ke atas setiap kali terjadi perubahan tab aktif.
  React.useEffect(() => {
    const scrollToTop = () => {
      const topAnchor = document.getElementById('top-of-page');
      if (topAnchor) {
        topAnchor.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' });
      }
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const root = document.getElementById('root');
      if (root) root.scrollTop = 0;
      const main = document.querySelector('main');
      if (main) main.scrollTop = 0;
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
    const t1 = setTimeout(scrollToTop, 10);
    const t2 = setTimeout(scrollToTop, 50);
    const t3 = setTimeout(scrollToTop, 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeTab]);

  // Fungsi pengarah halaman (router manual) untuk menampilkan halaman yang sesuai dengan tab aktif.
  const renderCurrentPage = () => {
    switch (activeTab) {
      // Halaman Publik
      case 'home': return <Home />;
      case 'lms': return <LMSView />;
      case 'branding': return <Branding />;
      case 'blog': return <BlogView />;
      case 'portfolio': return <Portfolio />;
      case 'pricing': return <PricingPage />;
      case 'leaderboard-public': return <LeaderboardView />;
      case 'auth': return <AuthPage />;
      case 'login': return <AuthPage />;
      case 'register': return <AuthPage />;
      case 'forgot-password': return <ForgotPassword />;

      // Halaman Siswa (Student)
      case 'student-dashboard': return <LMSView />;
      case 'learning-path': return <LMSView />;
      case 'lesson-view': return <LessonView />;
      case 'quiz-view': return <QuizView />;
      case 'ai-chat': return <AIChatView />;
      case 'leaderboard': return <LeaderboardView />;
      case 'my-package': return <MyPackage />;
      case 'profile': return <Profile />;

      // Halaman Tutor
      case 'tutor-dashboard': return <TutorDashboard />;
      case 'manage-courses': return <TutorDashboard />;
      case 'upload-lesson': return <UploadLesson />;

      // Portal Khusus Admin
      case 'admin-portal': return <AdminPortal />;
      case 'admin': return <AdminPortal />;

      default: return <Home />;
    }
  };

  const publicTabs = ['home', 'branding', 'blog', 'portfolio', 'pricing', 'auth', 'login', 'register', 'forgot-password'];
  const isPublicPage = publicTabs.includes(activeTab);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full max-w-full">
      <WelcomeModal />
      {/* Titik jangkar (anchor) untuk proses gulir ke atas halaman */}
      <div id="top-of-page" className="absolute top-0 left-0 w-0 h-0 pointer-events-none" />
      <Navbar />
      <main key={activeTab} className="flex-1 overflow-x-hidden w-full">
        {renderCurrentPage()}
      </main>
      <Footer />
      {isPublicPage && <FloatingWhatsApp />}
      <FloatingAssistant
        isOpen={isAssistantOpen}
        onToggle={() => setIsAssistantOpen(prev => !prev)}
        buttonRef={floatingButtonRef}
        hasWhatsAppBelow={isPublicPage}
      />
      <MashiraAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        floatingButtonRef={floatingButtonRef}
      />
      <MobileNav />
    </div>
  );
}

// Provider Pembungkus utama untuk menyalurkan context autentikasi dan percakapan AI ke seluruh aplikasi.
export default function App() {
  return (
    <AuthProvider>
      <AIChatProvider>
        <MainContent />
      </AIChatProvider>
    </AuthProvider>
  );
}
