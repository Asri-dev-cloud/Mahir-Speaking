import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService, exerciseService } from '../../services/api';
import {
  ShieldCheck, Lock, Unlock, Users, Clock, Calendar, MessageSquare,
  UserPlus, Search, RefreshCw, AlertCircle, CheckCircle2, ChevronRight,
  TrendingUp, Zap, Sparkles, Award, Edit3, Trash2, ExternalLink, Activity,
  FileText, CheckCircle, Upload, Download, Video, FileSpreadsheet, Plus, Play, Film, BookOpen, Link, Eye,
  LayoutDashboard, ClipboardList, CircleDot, BellRing, ArrowRight, HelpCircle
} from 'lucide-react';

export default function AdminPortal() {
  const { user, setActiveTab, logout } = useAuth();

  const SENIOR_ADMIN_EMAIL = 'hartiniasri32@gmail.com';

  // 📊 State Data Portal
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [portalTab, setPortalTab] = useState('overview'); // 'overview', 'users', 'leads', 'quizzes', 'modules', 'recordings', 'assistants', 'analytics'
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    activeTrials: 0,
    totalLeads: 0,
    expiringSoon: 0,
    totalRevenue: 0
  });

  // 📝 State Kuis (CSV/XLSX Upload)
  const [quizzesList, setQuizzesList] = useState([]);
  const [quizCSVText, setQuizCSVText] = useState('');
  const [manualQuiz, setManualQuiz] = useState({
    lesson_id: 1,
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 0,
    xp_reward: 20
  });

  // 📦 State Modul (PDF, DOC, PPT)
  const [modulesList, setModulesList] = useState([]);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    type: 'PDF Document',
    size: '5.0 MB',
    badge: 'Official Modul',
    desc: '',
    fileUrl: '#'
  });

  // 📹 State Rekaman Sesi Kelas & Video (YouTube / GDrive)
  const [recordingsList, setRecordingsList] = useState([]);
  const [videoForm, setVideoForm] = useState({
    title: '',
    tutor: 'Mentor Senior (Mr. James)',
    duration: '60 Menit',
    level: 'All Levels',
    videoUrl: '',
    thumbnail: ''
  });

  // 🤖 State Latihan Bot Mashira AI
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExerciseForEdit, setSelectedExerciseForEdit] = useState(null);
  const [exerciseForm, setExerciseForm] = useState({
    level: 'A1',
    title: '',
    instruction: 'Dengarkan lalu ulangi kalimat berikut.',
    referenceText: '',
    translation: ''
  });

  // 🪟 State Modals
  const [selectedUserForExtend, setSelectedUserForExtend] = useState(null);
  const [extendDays, setExtendDays] = useState(30);
  const [selectedPackageId, setSelectedPackageId] = useState(2);
  const [isTrialToggle, setIsTrialToggle] = useState(false);

  const [selectedUserActivity, setSelectedUserActivity] = useState(null);

  const [showAddAssistantModal, setShowAddAssistantModal] = useState(false);
  const [newAssistantForm, setNewAssistantForm] = useState({
    full_name: '',
    email: '',
    whatsapp: ''
  });

  const [toastMsg, setToastMsg] = useState('');

  // 🛡️ Cek Peran Admin berdasarkan Email / Role
  const isAdmin = user && (user.role === 'admin' || user.email?.toLowerCase() === SENIOR_ADMIN_EMAIL.toLowerCase() || user.admin_type);
  const isSeniorAdmin = user?.email?.toLowerCase() === SENIOR_ADMIN_EMAIL.toLowerCase() || user?.admin_type === 'Senior Admin';

  // 🔄 Fetch Data Pengguna, Leads, Kuis, Modul & Video
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        adminService.getUsers(),
        adminService.getAnalytics(),
        adminService.getLeads(),
        adminService.getQuizzes(),
        adminService.getModules(),
        adminService.getRecordedVideos(),
        exerciseService.getExercises()
      ]);
      const valueOf = (result, fallback = {}) =>
        result.status === 'fulfilled' ? result.value : fallback;
      const [uRes, aRes, lRes, qRes, mRes, vRes, exRes] = [
        valueOf(results[0]), valueOf(results[1]), valueOf(results[2]),
        valueOf(results[3]), valueOf(results[4]), valueOf(results[5]),
        valueOf(results[6])
      ];
      if (uRes.success && Array.isArray(uRes.users)) {
        setUsers(uRes.users);
      } else {
        setUsers([]);
      }
      if (aRes.success && aRes.stats) {
        setStats(aRes.stats);
      }
      if (lRes.success && Array.isArray(lRes.leads)) {
        setLeads(lRes.leads);
      } else {
        setLeads([]);
      }
      if (qRes?.success) setQuizzesList(qRes.quizzes || []);
      if (mRes?.success) setModulesList(mRes.modules || []);
      if (vRes?.success) setRecordingsList(vRes.videos || []);
      if (exRes?.success) setExercisesList(exRes.exercises || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setUsers([]);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // 📝 Function Parser CSV untuk Upload Kuis
  const parseCSVQuizzes = (text) => {
    if (!text || !text.trim()) return [];
    const lines = text.split(/\r\n|\n/);
    const parsed = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (i === 0 && (line.toLowerCase().includes('question') || line.toLowerCase().includes('lesson_id'))) continue;

      const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 6) {
        parsed.push({
          id: Date.now() + i,
          lesson_id: parseInt(cols[0]) || 1,
          question: cols[1],
          options: [cols[2] || '', cols[3] || '', cols[4] || '', cols[5] || ''],
          correct_answer: parseInt(cols[6]) || 0,
          xp_reward: parseInt(cols[7]) || 20
        });
      }
    }
    return parsed;
  };

  const handleFileUploadQuiz = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result;
      if (typeof content === 'string') {
        const parsed = parseCSVQuizzes(content);
        if (parsed.length === 0) {
          alert('Format file tidak valid atau kosong. Silakan gunakan format CSV: lesson_id, question, option_a, option_b, option_c, option_d, correct_answer_index, xp_reward');
          return;
        }
        const res = await adminService.saveQuizzes(parsed);
        if (res.success) {
          showToast(`Berhasil mengimpor ${parsed.length} kuis dari file ${file.name}!`);
          loadAdminData();
        }
      }
    };
    reader.readAsText(file);
  };

  const handleTextImportQuiz = async () => {
    const parsed = parseCSVQuizzes(quizCSVText);
    if (parsed.length === 0) {
      alert('Format CSV teks tidak valid. Pastikan per baris berisi: lesson_id, question, option_a, option_b, option_c, option_d, correct_answer_index, xp_reward');
      return;
    }
    const res = await adminService.saveQuizzes(parsed);
    if (res.success) {
      showToast(`Berhasil menambahkan ${parsed.length} kuis!`);
      setQuizCSVText('');
      loadAdminData();
    }
  };

  const handleSaveManualQuiz = async (e) => {
    e.preventDefault();
    if (!manualQuiz.question || !manualQuiz.option_a || !manualQuiz.option_b) {
      alert('Judul pertanyaan dan Opsi A & B wajib diisi!');
      return;
    }
    const newQuizItem = {
      id: Date.now(),
      lesson_id: parseInt(manualQuiz.lesson_id) || 1,
      question: manualQuiz.question,
      options: [manualQuiz.option_a, manualQuiz.option_b, manualQuiz.option_c, manualQuiz.option_d].filter(Boolean),
      correct_answer: parseInt(manualQuiz.correct_answer) || 0,
      xp_reward: parseInt(manualQuiz.xp_reward) || 20
    };
    const res = await adminService.saveQuizzes([newQuizItem]);
    if (res.success) {
      showToast('Soal kuis baru berhasil ditambahkan!');
      setManualQuiz({
        lesson_id: 1,
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 0,
        xp_reward: 20
      });
      loadAdminData();
    }
  };

  const handleDeleteQuizItem = async (id) => {
    if (confirm('Hapus soal kuis ini?')) {
      await adminService.deleteQuiz(id);
      showToast('Kuis berhasil dihapus.');
      loadAdminData();
    }
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.title) {
      alert('Judul modul wajib diisi!');
      return;
    }
    const res = await adminService.saveModule(moduleForm);
    if (res.success) {
      showToast(`Modul "${moduleForm.title}" berhasil disimpan!`);
      setModuleForm({
        title: '',
        type: 'PDF Document',
        size: '5.0 MB',
        badge: 'Official Modul',
        desc: '',
        fileUrl: '#'
      });
      loadAdminData();
    }
  };

  const handleDeleteModuleItem = async (id) => {
    if (confirm('Yakin ingin menghapus modul ini?')) {
      await adminService.deleteModule(id);
      showToast('Modul berhasil dihapus.');
      loadAdminData();
    }
  };

  const handleModuleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size (warn if > 2MB because of localStorage limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file melebihi 2 MB! Disarankan menggunakan file yang lebih kecil atau menggunakan link luar agar tidak melebihi kapasitas memori browser.');
    }

    const sizeInMB = file.size / (1024 * 1024);
    const sizeText = sizeInMB < 0.1
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${sizeInMB.toFixed(1)} MB`;

    let formatType = 'PDF Document';
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') formatType = 'PDF Document';
    else if (['doc', 'docx'].includes(ext)) formatType = 'Word Document';
    else if (['ppt', 'pptx'].includes(ext)) formatType = 'PowerPoint Presentation';
    else if (['zip', 'rar', 'mp3'].includes(ext)) formatType = 'PDF & Audio Pack';

    setModuleForm((prev) => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      size: sizeText,
      type: formatType
    }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setModuleForm((prev) => ({
        ...prev,
        fileUrl: event.target.result
      }));
      showToast(`File "${file.name}" siap dilampirkan! 💾`);
    };
    reader.onerror = () => {
      alert('Gagal membaca file!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveRecordedVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.videoUrl) {
      alert('Judul rekaman dan Link Video wajib diisi!');
      return;
    }
    const res = await adminService.saveRecordedVideo(videoForm);
    if (res.success) {
      showToast(`Video rekaman "${videoForm.title}" berhasil ditambahkan!`);
      setVideoForm({
        title: '',
        tutor: 'Mentor Senior (Mr. James)',
        duration: '60 Menit',
        level: 'All Levels',
        videoUrl: '',
        thumbnail: ''
      });
      loadAdminData();
    }
  };

  const handleDeleteVideoItem = async (id) => {
    if (confirm('Yakin ingin menghapus video rekaman ini?')) {
      await adminService.deleteRecordedVideo(id);
      showToast('Video rekaman berhasil dihapus.');
      loadAdminData();
    }
  };

  // 🤖 Exercise Handlers
  const handleSaveExercise = async (e) => {
    e.preventDefault();
    if (!exerciseForm.title || !exerciseForm.referenceText || !exerciseForm.translation) {
      alert('Semua field (Judul, Teks Bahasa Inggris, Terjemahan) wajib diisi ya bestie!');
      return;
    }

    if (selectedExerciseForEdit) {
      // Update
      const res = await exerciseService.updateExercise(selectedExerciseForEdit.id, exerciseForm);
      if (res.success) {
        showToast(`Latihan "${exerciseForm.title}" berhasil diperbarui!`);
        setSelectedExerciseForEdit(null);
        setExerciseForm({
          level: 'A1',
          title: '',
          instruction: 'Dengarkan lalu ulangi kalimat berikut.',
          referenceText: '',
          translation: ''
        });
        loadAdminData();
      }
    } else {
      // Create
      const res = await exerciseService.createExercise(exerciseForm);
      if (res.success) {
        showToast(`Latihan "${exerciseForm.title}" berhasil ditambahkan!`);
        setExerciseForm({
          level: 'A1',
          title: '',
          instruction: 'Dengarkan lalu ulangi kalimat berikut.',
          referenceText: '',
          translation: ''
        });
        loadAdminData();
      }
    }
  };

  const handleEditExerciseClick = (ex) => {
    setSelectedExerciseForEdit(ex);
    setExerciseForm({
      level: ex.level,
      title: ex.title,
      instruction: ex.instruction,
      referenceText: ex.referenceText,
      translation: ex.translation
    });
    // Scroll smoothly to form
    const formElement = document.getElementById('exercise-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelExerciseEdit = () => {
    setSelectedExerciseForEdit(null);
    setExerciseForm({
      level: 'A1',
      title: '',
      instruction: 'Dengarkan lalu ulangi kalimat berikut.',
      referenceText: '',
      translation: ''
    });
  };

  const handleDeleteExerciseItem = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus latihan ini?')) {
      const res = await exerciseService.deleteExercise(id);
      if (res.success) {
        showToast('Latihan berhasil dihapus.');
        loadAdminData();
      }
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // 💬 Kirim Pesan WA Otomatis
  const handleOpenWhatsApp = (userTarget) => {
    const waNumber = userTarget.whatsapp ? userTarget.whatsapp.replace(/[^0-9]/g, '') : '';
    if (!waNumber) {
      alert('Nomor WhatsApp pengguna belum terdaftar!');
      return;
    }
    const text = encodeURIComponent(
      `Halo Kak ${userTarget.full_name},\n\nKami dari Tim Mahir Speaking ingin menginformasikan status langganan Anda:\n• Paket: ${userTarget.package_name || 'Standard'}\n• Status Free Trial: ${userTarget.is_trial ? 'Aktif' : 'Non-Aktif'}\n• Tanggal Berakhir Paket: ${userTarget.package_expires || 'Tidak terbatas'}\n\nApakah ada kendala atau bantuan yang Anda butuhkan dalam belajar bahasa Inggris hari ini? 😊`
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  // 📅 Perpanjang Paket / Free Trial
  const handleSavePackageExtension = async () => {
    if (!selectedUserForExtend) return;

    // Hitung tanggal kadaluarsa baru
    const curDate = new Date();
    curDate.setDate(curDate.getDate() + parseInt(extendDays));
    const newExpDate = curDate.toISOString().split('T')[0];

    const pkgNames = { 1: 'Standard Pro', 2: 'Premium VIP', 3: 'Enterprise VIP' };

    const updateData = {
      package_id: selectedPackageId,
      package_name: pkgNames[selectedPackageId] || 'Custom Pro',
      package_expires: newExpDate,
      is_trial: isTrialToggle,
      trial_expires: isTrialToggle ? newExpDate : null
    };

    const res = await adminService.updateUser(selectedUserForExtend.id, updateData);
    if (res.success) {
      showToast(`Paket ${selectedUserForExtend.full_name} berhasil diperpanjang hingga ${newExpDate}!`);
      setSelectedUserForExtend(null);
      loadAdminData();
    }
  };

  // ➕ Tambah Admin Asisten Baru
  const handleAddAssistant = async (e) => {
    e.preventDefault();
    if (!newAssistantForm.full_name || !newAssistantForm.email) {
      alert('Nama dan Email wajib diisi!');
      return;
    }

    const res = await adminService.addAssistantAdmin(newAssistantForm);
    if (res.success) {
      showToast(`Admin Asisten ${newAssistantForm.full_name} berhasil ditambahkan!`);
      setShowAddAssistantModal(false);
      setNewAssistantForm({ full_name: '', email: '', whatsapp: '' });
      loadAdminData();
    }
  };

  // 💬 Kirim Pesan WhatsApp ke Lead Placement Test
  const handleOpenLeadWhatsApp = (lead) => {
    const waNumber = lead.noWa ? lead.noWa.replace(/[^0-9]/g, '') : '';
    if (!waNumber) {
      alert('Nomor WhatsApp lead tidak valid!');
      return;
    }
    const text = encodeURIComponent(
      `Halo Kak ${lead.nama}! 😊\n\nKami dari Tim Mahir Speaking ingin mengonfirmasi pendaftaran Placement Test & Trial Class Anda:\n• Target Level: ${lead.levelTarget}\n• Hasil Diagnosis: ${lead.recommendedLevel}\n• Pilihan Jadwal Trial: ${lead.jadwalTrial}\n• Catatan: ${lead.catatan || '-'}\n\nKapan bisa kami bantu untuk penguncian slot Trial Class-nya Kak? 🚀`
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  // 🔄 Update Status Lead
  const handleUpdateLeadStatus = async (id, newStatus) => {
    const res = await adminService.updateLeadStatus(id, newStatus);
    if (res.success) {
      showToast(`Status lead diperbarui ke: ${newStatus}`);
      loadAdminData();
    }
  };

  // 🗑️ Hapus Data Lead
  const handleDeleteLead = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus data lead ${nama}?`)) {
      const res = await adminService.deleteLead(id);
      if (res.success) {
        showToast(`Data lead ${nama} berhasil dihapus.`);
        loadAdminData();
      }
    }
  };

  // 🔍 Filter List Pengguna (Dengan fallback array aman)
  const userList = Array.isArray(users) ? users : [];
  const filteredUsers = userList.filter((u) => {
    if (!u) return false;
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.whatsapp?.includes(searchQuery);

    if (roleFilter === 'all') return matchesSearch;
    if (roleFilter === 'trial') return matchesSearch && u.is_trial;
    if (roleFilter === 'expiring') {
      if (!u.package_expires) return false;
      const diff = (new Date(u.package_expires) - new Date()) / (1000 * 3600 * 24);
      return matchesSearch && diff >= 0 && diff <= 7;
    }
    if (roleFilter === 'assistant') return matchesSearch && u.admin_type === 'Admin Asisten';
    return matchesSearch && u.role === roleFilter;
  });

  // 🔍 Filter List Placement Leads
  const leadsList = Array.isArray(leads) ? leads : [];
  const filteredLeads = leadsList.filter((l) => {
    if (!l) return false;
    const matchesSearch =
      l.nama?.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      l.noWa?.includes(leadSearchQuery) ||
      l.catatan?.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      l.recommendedLevel?.toLowerCase().includes(leadSearchQuery.toLowerCase());

    if (leadStatusFilter === 'all') return matchesSearch;
    return matchesSearch && l.status === leadStatusFilter;
  });

  // Ringkasan kerja agar Admin Asisten langsung memahami prioritas hari ini.
  const uncontactedLeads = leadsList.filter((lead) => !lead?.status || lead.status === 'Belum Dihubungi');
  const readyTrialLeads = leadsList.filter((lead) => lead?.status === 'Siap Trial Class');
  const expiringUsers = userList.filter((account) => {
    if (!account?.package_expires) return false;
    const remainingDays = (new Date(account.package_expires) - new Date()) / (1000 * 60 * 60 * 24);
    return remainingDays >= 0 && remainingDays <= 7;
  });
  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const openAdminTask = (tab, filter = null) => {
    setPortalTab(tab);
    if (tab === 'leads' && filter) setLeadStatusFilter(filter);
    if (tab === 'users' && filter) setRoleFilter(filter);
  };

  // -------------------------------------------------------------
  // 🔒 SCREEN 1: LAYAR AKSES DITOLAK JIKA BUKAN AKUN ADMIN
  // -------------------------------------------------------------
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-slate-950 to-slate-950" />

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border-2 border-rose-500/30 rounded-4xl p-8 shadow-2xl space-y-6 relative z-10 text-white text-center">

          <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center shadow-glow">
            <Lock className="w-8 h-8 text-rose-400 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
              Restricted Admin Area
            </span>
            <h1 className="font-stinger font-black text-2xl sm:text-3xl text-white pt-1">
              Akses Portal Ditolak
            </h1>
            <p className="text-slate-400 font-semibold text-xs leading-relaxed">
              Portal ini khusus untuk akun yang terdaftar sebagai <strong>Admin Senior</strong> (hartiniasri32@gmail.com) atau <strong>Admin Asisten</strong>.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('auth')}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-glow flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Login dengan Email Admin</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Security Status</span>
            <span className="text-rose-400 font-mono">Protected by Email Auth</span>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 🟢 SCREEN 2: MAIN DASHBOARD PORTAL ADMIN MASTER
  // -------------------------------------------------------------
  return (
    <div className="admin-portal-wrapper min-h-screen bg-slate-950 text-slate-100 p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-24 lg:pb-8 font-sans">

      {/* 🔔 TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 👑 TOP HEADER BAR */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Dashboard Operasional Mahir Speaking
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Live
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Lihat prioritas kerja, tindak lanjuti pengguna, dan kelola materi dari satu tempat.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-200">{user?.full_name || 'Admin Master'}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {isSeniorAdmin ? 'Admin Senior (Hartini Asri)' : 'Admin Asisten'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-3.5 py-2.5 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Keluar dari Sesi Admin"
          >
            <Lock className="w-4 h-4" />
            <span className="inline">Keluar Sesi</span>
          </button>
        </div>
      </div>

      {/* 📈 KPI STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-3.5 sm:p-4.5 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Total Pengguna</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-3xl font-black text-white">{stats.totalUsers}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            <span className="text-emerald-400 font-bold">{stats.totalStudents}</span> Siswa • <span className="text-emerald-400 font-bold">{stats.totalTutors}</span> Tutor
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-3.5 sm:p-4.5 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Free Trial Aktif</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-3xl font-black text-amber-400">{stats.activeTrials}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            Pengguna masa uji coba
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-3.5 sm:p-4.5 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Leads Placement Test</span>
            <FileText className="w-4 h-4 text-lime" />
          </div>
          <div className="text-xl sm:text-3xl font-black text-lime">{stats.totalLeads || leads.length}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            Target: <span className="text-lime font-bold">50 leads/bulan</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-3.5 sm:p-4.5 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Kadaluarsa (&lt; 7 Hari)</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-3xl font-black text-rose-400">{stats.expiringSoon}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            Perlu di-follow up
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-3.5 sm:p-4.5 space-y-2 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Total Pendapatan</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-400">
            Rp {(stats.totalRevenue || 0).toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400">
            Estimasi omzet paket
          </div>
        </div>

      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto flex-nowrap">
          <button
            onClick={() => setPortalTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'overview'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan Tugas</span>
          </button>

          <button
            onClick={() => setPortalTab('users')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'users'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Pengguna ({users.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('leads')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'leads'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span>Leads Placement Test ({leads.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('quizzes')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'quizzes'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Manajemen Kuis ({quizzesList.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('modules')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'modules'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manajemen Modul ({modulesList.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('recordings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'recordings'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Video className="w-4 h-4" />
            <span>Video & Rekaman ({recordingsList.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('exercises')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'exercises'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Latihan Bot Mashira ({exercisesList.length})</span>
          </button>

          {isSeniorAdmin && (
            <button
              onClick={() => setPortalTab('assistants')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'assistants'
                ? 'bg-emerald-500 text-slate-950 shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Admin Asisten</span>
            </button>
          )}

          <button
            onClick={() => setPortalTab('analytics')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'analytics'
              ? 'bg-emerald-500 text-slate-950 shadow-glow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
          >
            <Activity className="w-4 h-4" />
            <span>Aktivitas Sistem</span>
          </button>
        </div>

        {portalTab === 'assistants' && isSeniorAdmin && (
          <button
            onClick={() => setShowAddAssistantModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" />
            <span>+ Tambah Admin Asisten</span>
          </button>
        )}
      </div>

      {/* -------------------------------------------------------------
          RINGKASAN TUGAS HARI INI
      ------------------------------------------------------------- */}
      {portalTab === 'overview' && (
        <div className="space-y-5">
          <section className="relative overflow-hidden rounded-3xl border border-blue-500/25 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-900 p-5 sm:p-7">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{todayLabel}</span>
                </div>
                <h2 className="text-xl font-black text-white sm:text-3xl">
                  Selamat bekerja, {user?.full_name?.split(' ')[0] || 'Admin'}!
                </h2>
                <p className="text-xs font-medium leading-relaxed text-slate-300 sm:text-sm">
                  Mulai dari tugas berlabel <strong className="text-rose-300">Mendesak</strong>, lalu lanjutkan follow-up trial dan pengecekan konten. Klik tugas untuk langsung membuka data terkait.
                </p>
              </div>
              <div className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total perlu tindakan</p>
                  <p className="text-2xl font-black text-white">{uncontactedLeads.length + readyTrialLeads.length + expiringUsers.length}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
            <section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-black text-white">
                    <BellRing className="h-5 w-5 text-amber-400" /> Prioritas Tugas
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">Kerjakan dari urutan paling atas.</p>
                </div>
                <button onClick={loadAdminData} className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 transition hover:text-white" title="Perbarui data">
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-3">
                <button onClick={() => openAdminTask('leads', 'Belum Dihubungi')} className="group flex w-full items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/[0.07] p-4 text-left transition hover:border-rose-400/50 hover:bg-rose-500/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400"><MessageSquare className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-black text-white">Hubungi lead baru</p>
                      {uncontactedLeads.length > 0 && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white">MENDESAK</span>}
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Kirim WhatsApp, konfirmasi kebutuhan, lalu ubah status lead.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-rose-400">{uncontactedLeads.length}</p>
                    <p className="text-[9px] font-bold text-slate-500">belum dihubungi</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                </button>

                <button onClick={() => openAdminTask('leads', 'Siap Trial Class')} className="group flex w-full items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-4 text-left transition hover:border-amber-400/50 hover:bg-amber-500/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400"><Calendar className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-white">Pastikan jadwal Trial Class</p>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Cek jadwal pilihan peserta dan pastikan slot kelas sudah dikunci.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-amber-400">{readyTrialLeads.length}</p>
                    <p className="text-[9px] font-bold text-slate-500">siap trial</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                </button>

                <button onClick={() => openAdminTask('users', 'expiring')} className="group flex w-full items-center gap-3 rounded-2xl border border-violet-500/25 bg-violet-500/[0.07] p-4 text-left transition hover:border-violet-400/50 hover:bg-violet-500/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400"><Clock className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-white">Follow-up paket hampir berakhir</p>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Ingatkan pengguna maksimal 7 hari sebelum paket berakhir.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-violet-400">{expiringUsers.length}</p>
                    <p className="text-[9px] font-bold text-slate-500">perlu follow-up</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                </button>

                <button onClick={() => openAdminTask('modules')} className="group flex w-full items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/[0.05] p-4 text-left transition hover:border-sky-400/50 hover:bg-sky-500/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400"><BookOpen className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-white">Cek materi belajar</p>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">Pastikan modul, kuis, dan rekaman terbaru sudah tersedia untuk siswa.</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-black text-sky-400">{modulesList.length} modul</p>
                    <p className="text-[9px] font-bold text-slate-500">{quizzesList.length} kuis · {recordingsList.length} video</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                </button>
              </div>
            </section>

            <div className="space-y-5">
              <section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-5">
                <h3 className="flex items-center gap-2 text-sm font-black text-white"><HelpCircle className="h-4 w-4 text-sky-400" /> Alur Kerja Admin Asisten</h3>
                <div className="mt-5 space-y-4">
                  {[
                    ['1', 'Cek Ringkasan', 'Lihat angka merah dan tugas mendesak.'],
                    ['2', 'Hubungi Lead', 'Gunakan tombol WhatsApp lalu ubah status.'],
                    ['3', 'Cek Pengguna', 'Pantau trial dan paket hampir berakhir.'],
                    ['4', 'Lapor Admin Senior', 'Laporkan kendala data atau pembayaran.'],
                  ].map(([number, title, description], index) => (
                    <div key={number} className="relative flex gap-3">
                      {index < 3 && <div className="absolute left-3.5 top-7 h-8 w-px bg-slate-700" />}
                      <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[10px] font-black text-emerald-400 ring-1 ring-slate-700">{number}</span>
                      <div><p className="text-xs font-black text-slate-200">{title}</p><p className="mt-0.5 text-[10px] font-medium leading-relaxed text-slate-500">{description}</p></div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400"><ShieldCheck className="h-5 w-5" /></div>
                  <div>
                    <h3 className="text-xs font-black text-white">Batas Wewenang</h3>
                    <p className="mt-1 text-[10px] font-medium leading-relaxed text-slate-400">
                      Admin Asisten boleh menghubungi lead, memperbarui status, dan membantu pengguna. Penghapusan data penting, perubahan hak admin, serta keputusan pembayaran harus dikonfirmasi ke Admin Senior.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 1: TABEL MANAJEMEN PENGGUNA & LANGGANAN
      ------------------------------------------------------------- */}
      {portalTab === 'users' && (
        <div className="space-y-4">

          {/* SEARCH & FILTER TOOLBAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Cari nama, email, atau no WhatsApp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400">Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Semua Pengguna</option>
                <option value="trial">Free Trial Aktif</option>
                <option value="expiring">Segera Kadaluarsa (&lt; 7 Hari)</option>
                <option value="student">Siswa (Student)</option>
                <option value="tutor">Tutor</option>
                <option value="assistant">Admin Asisten</option>
              </select>

              <button
                onClick={loadAdminData}
                title="Refresh Data"
                className="p-2 bg-slate-950 border border-slate-800 rounded-xl hover:text-emerald-400 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* TABLE MAIN (DESKTOP VIEW) */}
          <div className="hidden md:block bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Pengguna</th>
                    <th className="py-3.5 px-4">No. WhatsApp</th>
                    <th className="py-3.5 px-4">Status Free Trial</th>
                    <th className="py-3.5 px-4">Paket & Berakhir</th>
                    <th className="py-3.5 px-4">Aktivitas (XP/Streak)</th>
                    <th className="py-3.5 px-4 text-center">Aksi / Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                        Memuat data pengguna...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isExpired = u.package_expires && new Date(u.package_expires) < new Date();

                      return (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">

                          {/* 👤 User Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-emerald-400 text-sm flex-shrink-0">
                                {u.full_name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                                  <span>{u.full_name}</span>
                                  {u.email?.toLowerCase() === SENIOR_ADMIN_EMAIL.toLowerCase() && (
                                    <span className="px-2 py-0.2 text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                                      Admin Senior
                                    </span>
                                  )}
                                  {u.admin_type === 'Admin Asisten' && (
                                    <span className="px-2 py-0.2 text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                                      Asisten
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* 💬 No WhatsApp */}
                          <td className="py-3.5 px-4">
                            {u.whatsapp ? (
                              <button
                                onClick={() => handleOpenWhatsApp(u)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl transition-all font-mono font-bold cursor-pointer"
                                title="Klik untuk kirim pesan WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>+{u.whatsapp}</span>
                              </button>
                            ) : (
                              <span className="text-slate-600 italic">Tidak ada WA</span>
                            )}
                          </td>

                          {/* ⚡ Free Trial Status */}
                          <td className="py-3.5 px-4">
                            {u.is_trial ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                                <Zap className="w-3 h-3" />
                                <span>Trial Aktif</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400">
                                <span>Reguler / Paid</span>
                              </span>
                            )}
                          </td>

                          {/* 📅 Package & Expire Date */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 font-extrabold text-[11px]">
                                {u.package_name || 'Standard Pro'}
                              </span>
                              <div className={`text-[11px] font-mono flex items-center gap-1 pt-1 ${isExpired ? 'text-rose-400 font-bold' : 'text-slate-400'
                                }`}>
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span>{u.package_expires ? `Kadaluarsa: ${u.package_expires}` : 'Unlimited'}</span>
                              </div>
                            </div>
                          </td>

                          {/* 📊 Activity */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5 text-[11px]">
                              <div className="text-emerald-400 font-extrabold">
                                ⚡ {u.xp || 0} XP • 🔥 {u.streak || 0} Hari
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                Terakhir: {u.last_active || 'Baru saja'}
                              </div>
                            </div>
                          </td>

                          {/* 🛠️ Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">

                              <button
                                onClick={() => {
                                  setSelectedUserForExtend(u);
                                  setSelectedPackageId(u.package_id || 1);
                                  setIsTrialToggle(u.is_trial || false);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 font-black text-[11px] transition-all border border-emerald-500/30 hover:text-slate-950 cursor-pointer flex items-center gap-1"
                                title="Perpanjang atau Ubah Paket"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Paket</span>
                              </button>

                              <button
                                onClick={() => setSelectedUserActivity(u)}
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 cursor-pointer"
                                title="Lihat Detail Log Aktivitas"
                              >
                                <Activity className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (SHOW ON MOBILE ONLY) */}
          <div className="block md:hidden space-y-3">
            {loading ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs font-bold">
                Memuat data pengguna...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs font-bold">
                Tidak ada pengguna yang cocok dengan pencarian.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isExpired = u.package_expires && new Date(u.package_expires) < new Date();
                return (
                  <div key={u.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-emerald-400 text-base flex-shrink-0">
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-xs sm:text-sm flex flex-wrap items-center gap-1.5">
                            <span>{u.full_name}</span>
                            {u.email?.toLowerCase() === SENIOR_ADMIN_EMAIL.toLowerCase() && (
                              <span className="px-2 py-0.2 text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                                Senior Admin
                              </span>
                            )}
                            {u.admin_type === 'Admin Asisten' && (
                              <span className="px-2 py-0.2 text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                                Asisten
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Status */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Status Trial:</span>
                        {u.is_trial ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Zap className="w-2.5 h-2.5" /> Trial Aktif
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">Reguler / Paid</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Paket:</span>
                        <span className="text-[11px] font-extrabold text-slate-200">
                          {u.package_name || 'Standard Pro'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span className={isExpired ? 'text-rose-400 font-bold' : ''}>
                          {u.package_expires ? `Exp: ${u.package_expires}` : 'Unlimited'}
                        </span>
                      </div>
                      <div className="text-emerald-400 font-extrabold">
                        ⚡ {u.xp || 0} XP • 🔥 {u.streak || 0} Hari
                      </div>
                    </div>

                    {/* WhatsApp & Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      {u.whatsapp ? (
                        <button
                          onClick={() => handleOpenWhatsApp(u)}
                          className="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      ) : (
                        <div className="flex-1 text-slate-600 italic text-[11px] text-center">No WA</div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedUserForExtend(u);
                          setSelectedPackageId(u.package_id || 1);
                          setIsTrialToggle(u.is_trial || false);
                        }}
                        className="py-2 px-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-glow"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Paket</span>
                      </button>

                      <button
                        onClick={() => setSelectedUserActivity(u)}
                        className="p-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 cursor-pointer"
                        title="Log Aktivitas"
                      >
                        <Activity className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: LEADS PLACEMENT TEST & TRIAL CLASS
      ------------------------------------------------------------- */}
      {portalTab === 'leads' && (
        <div className="space-y-4">

          {/* SEARCH & FILTER TOOLBAR LEADS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Cari nama, WA, atau catatan lead..."
                value={leadSearchQuery}
                onChange={(e) => setLeadSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400">Filter Status:</span>
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Semua Status Leads</option>
                <option value="Belum Dihubungi">Belum Dihubungi</option>
                <option value="Sudah Dihubungi">Sudah Dihubungi</option>
                <option value="Siap Trial Class">Siap Trial Class</option>
                <option value="Joined Member">Joined Member</option>
              </select>

              <button
                onClick={loadAdminData}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                title="Refresh Data Leads"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DESKTOP TABLE VIEW LEADS */}
          <div className="hidden md:block bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Nama Lead & Waktu</th>
                    <th className="py-3.5 px-4">WhatsApp (1-Click)</th>
                    <th className="py-3.5 px-4">Target & Diagnosis Level</th>
                    <th className="py-3.5 px-4">Jadwal Trial Class</th>
                    <th className="py-3.5 px-4">Catatan Belajar</th>
                    <th className="py-3.5 px-4">Status Lead</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        Memuat data placement test leads...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        Belum ada lead placement test yang sesuai pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">

                        {/* Nama Lead */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                              <span>{l.nama}</span>
                              <span className="px-2 py-0.2 text-[9px] font-black bg-lime/20 text-lime border border-lime/30 rounded-full">
                                Lead
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>{l.date}</span>
                            </div>
                          </div>
                        </td>

                        {/* WhatsApp Button */}
                        <td className="py-3.5 px-4">
                          {l.noWa ? (
                            <button
                              onClick={() => handleOpenLeadWhatsApp(l)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl transition-all font-mono font-bold cursor-pointer"
                              title="Klik untuk follow up WhatsApp dengan pesan otomatis"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>+{l.noWa}</span>
                            </button>
                          ) : (
                            <span className="text-slate-600 italic">No WA tidak ada</span>
                          )}
                        </td>

                        {/* Level Target & Diagnosis */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="text-[11px]">
                              Target: <span className="font-extrabold text-slate-200">{l.levelTarget}</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              <Award className="w-3 h-3 text-blue-400" />
                              <span>Diagnosis: {l.recommendedLevel}</span>
                            </span>
                          </div>
                        </td>

                        {/* Jadwal Trial Class */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-amber-300 border border-slate-700 font-bold text-[11px]">
                            📅 {l.jadwalTrial || 'Sabtu (10.00 WIB)'}
                          </span>
                        </td>

                        {/* Catatan Belajar */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <p className="text-[11px] text-slate-300 italic truncate" title={l.catatan}>
                            "{l.catatan || 'Tidak ada catatan'}"
                          </p>
                        </td>

                        {/* Status Lead Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={l.status || 'Belum Dihubungi'}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border cursor-pointer focus:outline-none ${l.status === 'Joined Member'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : l.status === 'Siap Trial Class'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : l.status === 'Sudah Dihubungi'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                          >
                            <option value="Belum Dihubungi">Belum Dihubungi</option>
                            <option value="Sudah Dihubungi">Sudah Dihubungi</option>
                            <option value="Siap Trial Class">Siap Trial Class</option>
                            <option value="Joined Member">Joined Member</option>
                          </select>
                        </td>

                        {/* Aksi Hapus */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleDeleteLead(l.id, l.nama)}
                            className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                            title="Hapus Data Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW LEADS */}
          <div className="block md:hidden space-y-3">
            {loading ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs font-bold">
                Memuat data leads...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs font-bold">
                Belum ada data placement test lead.
              </div>
            ) : (
              filteredLeads.map((l) => (
                <div key={l.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                        <span>{l.nama}</span>
                        <span className="px-2 py-0.2 text-[9px] font-black bg-lime/20 text-lime border border-lime/30 rounded-full">
                          Lead
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono pt-0.5">{l.date}</div>
                    </div>

                    <select
                      value={l.status || 'Belum Dihubungi'}
                      onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                      className="px-2 py-1 rounded-xl text-[10px] font-extrabold bg-slate-800 text-slate-200 border border-slate-700"
                    >
                      <option value="Belum Dihubungi">⏳ Belum Dihubungi</option>
                      <option value="Sudah Dihubungi">💬 Sudah Dihubungi</option>
                      <option value="Siap Trial Class">🎯 Siap Trial</option>
                      <option value="Joined Member">👑 Member</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">Target Level:</span>
                      <span className="text-slate-200 font-bold">{l.levelTarget}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">Hasil Diagnosis:</span>
                      <span className="text-blue-400 font-extrabold">{l.recommendedLevel}</span>
                    </div>
                  </div>

                  <div className="text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-bold block">Jadwal Trial Class:</span>
                    <span className="text-amber-300 font-bold">📅 {l.jadwalTrial}</span>
                  </div>

                  {l.catatan && (
                    <div className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                      "{l.catatan}"
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    {l.noWa ? (
                      <button
                        onClick={() => handleOpenLeadWhatsApp(l)}
                        className="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp (+{l.noWa})</span>
                      </button>
                    ) : (
                      <div className="flex-1 text-slate-600 italic text-[11px] text-center">No WA</div>
                    )}

                    <button
                      onClick={() => handleDeleteLead(l.id, l.nama)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 cursor-pointer"
                      title="Hapus Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB: MANAJEMEN KUIS (CSV / XLSX UPLOAD & FORM MANUAL)
      ------------------------------------------------------------- */}
      {portalTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Upload & Tambah Soal Kuis (CSV / XLSX)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Impor soal kuis secara massal menggunakan file Excel (.xlsx / .csv) atau tambahkan soal secara manual.
                </p>
              </div>
            </div>

            {/* BOX UPLOAD FILE CSV / XLSX */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* OPSI A: UPLOAD FILE EXCEL / CSV */}
              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-dashed border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Upload File CSV / Excel (.xlsx)</h3>
                    <p className="text-[11px] text-slate-400">Pilih file berformat .csv atau .xlsx dari komputer Anda</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400">Pilih File Soal Kuis:</label>
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls, .txt"
                    onChange={handleFileUploadQuiz}
                    className="w-full text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-emerald-500 file:text-slate-950 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="font-black text-amber-400 block">💡 Format Kolom CSV/Excel:</span>
                  <code className="text-[10px] text-emerald-400 font-mono block bg-slate-950 p-1.5 rounded border border-slate-800 overflow-x-auto">
                    lesson_id, question, option_a, option_b, option_c, option_d, correct_answer_index, xp_reward
                  </code>
                </div>
              </div>

              {/* OPSI B: PASTE TEKS CSV DIRECT */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-lime" />
                    <span>Paste Teks CSV Langsung</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">Quick Import</span>
                </div>

                <textarea
                  rows={4}
                  placeholder={`1,What is the synonym of Happy?,Glad,Sad,Angry,Fear,0,20\n1,Choose correct phrase,How are you?,How is you?,How you are?,Where are you?,0,20`}
                  value={quizCSVText}
                  onChange={(e) => setQuizCSVText(e.target.value)}
                  className="w-full bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={handleTextImportQuiz}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-glow"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Impor Baris CSV Teks</span>
                </button>
              </div>
            </div>

            {/* FORM TAMBAH KUIS MANUAL */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Form Input Soal Kuis Single / Manual</span>
              </h3>

              <form onSubmit={handleSaveManualQuiz} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 mb-1">Target Lesson ID / Unit</label>
                  <input
                    type="number"
                    value={manualQuiz.lesson_id}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, lesson_id: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Reward XP</label>
                  <input
                    type="number"
                    value={manualQuiz.xp_reward}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, xp_reward: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Pertanyaan / Question Text *</label>
                  <input
                    type="text"
                    placeholder="Misal: What is the past tense of 'Go'?"
                    value={manualQuiz.question}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, question: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pilihan A *</label>
                  <input
                    type="text"
                    value={manualQuiz.option_a}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, option_a: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pilihan B *</label>
                  <input
                    type="text"
                    value={manualQuiz.option_b}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, option_b: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pilihan C</label>
                  <input
                    type="text"
                    value={manualQuiz.option_c}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, option_c: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pilihan D</label>
                  <input
                    type="text"
                    value={manualQuiz.option_d}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, option_d: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Kunci Jawaban Benar (Index 0 = A, 1 = B, 2 = C, 3 = D)</label>
                  <select
                    value={manualQuiz.correct_answer}
                    onChange={(e) => setManualQuiz({ ...manualQuiz, correct_answer: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    <option value={2}>Pilihan C</option>
                    <option value={3}>Pilihan D</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-glow"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Simpan Soal Kuis</span>
                  </button>
                </div>
              </form>
            </div>

            {/* LIST DAFTAR KUIS TERDAPAT */}
            <div className="space-y-3 pt-2">
              <h3 className="font-extrabold text-sm text-white flex items-center justify-between">
                <span>Daftar Kuis Kustom Ditambahkan ({quizzesList.length})</span>
              </h3>

              {quizzesList.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs font-semibold">
                  Belum ada kuis kustom yang diunggah. Silakan upload file CSV/Excel atau tambahkan via form di atas.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {quizzesList.map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/30">
                            Unit #{q.lesson_id}
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30">
                            +{q.xp_reward} XP
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-white">{q.question}</h4>
                        <div className="text-xs text-slate-400 flex flex-wrap gap-2">
                          {Array.isArray(q.options) && q.options.map((opt, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded text-[11px] font-mono ${i === q.correct_answer ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'bg-slate-900 text-slate-400'}`}>
                              {String.fromCharCode(65 + i)}. {opt}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteQuizItem(q.id)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 cursor-pointer"
                        title="Hapus Kuis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB: MANAJEMEN MODUL (PDF, DOC, PPT UPLOAD)
      ------------------------------------------------------------- */}
      {portalTab === 'modules' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Tambah Modul & E-Book Pembelajaran</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload modul pembelajaran berformat PDF, DOC/DOCX, atau PPT/PPTX untuk diunduh siswa.
                </p>
              </div>
            </div>

            {/* FORM INPUT MODUL */}
            <form onSubmit={handleSaveModule} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Detail Modul Baru</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 mb-1">Judul Modul / E-Book *</label>
                  <input
                    type="text"
                    placeholder="Misal: Modul Grammar & Daily Expression Pack"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Format Tipe File *</label>
                  <select
                    value={moduleForm.type}
                    onChange={(e) => setModuleForm({ ...moduleForm, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="PDF Document">PDF Document (.pdf)</option>
                    <option value="Word Document">Word Document (.doc / .docx)</option>
                    <option value="PowerPoint Presentation">PowerPoint (.ppt / .pptx)</option>
                    <option value="PDF & Audio Pack">PDF & Audio Bundle (.zip / .mp3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Estimasi Ukuran File (Size)</label>
                  <input
                    type="text"
                    placeholder="Misal: 12.5 MB"
                    value={moduleForm.size}
                    onChange={(e) => setModuleForm({ ...moduleForm, size: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Badge / Kategori Modul</label>
                  <input
                    type="text"
                    placeholder="Misal: Official Modul / Career Prep / CEFR Level"
                    value={moduleForm.badge}
                    onChange={(e) => setModuleForm({ ...moduleForm, badge: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Deskripsi Singkat Modul</label>
                  <textarea
                    rows={2}
                    placeholder="Penjelasan ringkas isi materi di dalam modul ini..."
                    value={moduleForm.desc}
                    onChange={(e) => setModuleForm({ ...moduleForm, desc: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-400 mb-1">Link File / URL Lampiran Modul</label>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Atau Upload File Lokal</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={moduleForm.fileUrl?.startsWith('data:') ? '✓ File Lokal Terpilih (Base64)' : 'https://drive.google.com/file/... atau isi link luar'}
                      value={moduleForm.fileUrl?.startsWith('data:') ? '' : moduleForm.fileUrl}
                      onChange={(e) => setModuleForm({ ...moduleForm, fileUrl: e.target.value })}
                      disabled={moduleForm.fileUrl?.startsWith('data:')}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                    />

                    <div className="relative flex items-center">
                      <input
                        type="file"
                        id="module-file-upload"
                        onChange={handleModuleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.mp3"
                      />
                      <label
                        htmlFor="module-file-upload"
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-800 hover:border-emerald-500 hover:text-emerald-400 bg-slate-900 text-slate-400 cursor-pointer font-bold transition-all text-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>
                          {moduleForm.fileUrl?.startsWith('data:')
                            ? '✓ File Lokal Terpilih'
                            : 'Pilih File Lokal (PDF/DOC/PPT)'}
                        </span>
                      </label>

                      {moduleForm.fileUrl?.startsWith('data:') && (
                        <button
                          type="button"
                          onClick={() => setModuleForm({ ...moduleForm, fileUrl: '#' })}
                          className="absolute right-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] px-2 py-1 rounded-md cursor-pointer transition-colors shadow-sm"
                          title="Hapus File Lokal"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-glow"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Simpan & Publikasikan Modul</span>
                  </button>
                </div>
              </div>
            </form>

            {/* DAFTAR MODUL TERUNGGAH */}
            <div className="space-y-3 pt-2">
              <h3 className="font-extrabold text-sm text-white">Daftar Modul Ditambahkan ({modulesList.length})</h3>

              {modulesList.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs font-semibold">
                  Belum ada modul kustom yang ditambahkan. Gunakan form di atas untuk mempublikasikan modul PDF, DOC, atau PPT.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modulesList.map((m) => (
                    <div key={m.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded border border-emerald-500/30">
                            {m.badge}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">{m.size}</span>
                        </div>
                        <h4 className="font-black text-base text-white">{m.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{m.desc || 'Tidak ada deskripsi'}</p>
                        <div className="text-[11px] text-lime font-mono">Format: {m.type}</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        {m.fileUrl && m.fileUrl.startsWith('data:') ? (
                          <a
                            href={m.fileUrl}
                            download={`${m.title}.${m.type?.includes('Word') ? 'docx' : m.type?.includes('PowerPoint') ? 'pptx' : m.type?.includes('Audio') || m.type?.includes('Pack') ? 'zip' : 'pdf'}`}
                            className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download File</span>
                          </a>
                        ) : (
                          <a
                            href={m.fileUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka Link File</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteModuleItem(m.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 cursor-pointer"
                          title="Hapus Modul"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB: MANAJEMEN VIDEO REKAMAN KELAS (YOUTUBE & GDRIVE)
      ------------------------------------------------------------- */}
      {portalTab === 'recordings' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-400" />
                  <span>Tambah Link Video Rekaman Kelas (YouTube & GDrive)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan link video YouTube atau Google Drive. Thumbnail video akan secara otomatis dibuat dan tampil di website!
                </p>
              </div>
            </div>

            {/* FORM INPUT VIDEO LINK */}
            <form onSubmit={handleSaveRecordedVideo} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Detail Video Rekaman Sesi Kelas</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">Judul Sesi Rekaman Kelas *</label>
                  <input
                    type="text"
                    placeholder="Misal: Live Practice: Job Interview & Business Negotiation Strategy"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1">URL Link Video (YouTube / Google Drive) *</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... atau https://drive.google.com/file/d/..."
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    ✨ Otomatis mendeteksi YouTube ID untuk thumbnail HQ & Google Drive preview.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Nama Tutor / Mentor</label>
                  <input
                    type="text"
                    placeholder="Misal: Native Speaker (Mr. James)"
                    value={videoForm.tutor}
                    onChange={(e) => setVideoForm({ ...videoForm, tutor: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Durasi Video</label>
                  <input
                    type="text"
                    placeholder="Misal: 90 Menit"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tingkat / Level Kelas</label>
                  <input
                    type="text"
                    placeholder="Misal: All Levels / Level B1-B2"
                    value={videoForm.level}
                    onChange={(e) => setVideoForm({ ...videoForm, level: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">URL Gambar Thumbnail Kustom (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Kosongkan jika ingin auto-generate dari YouTube/GDrive"
                    value={videoForm.thumbnail}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-glow"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Tambah Video Rekaman Kelas</span>
                  </button>
                </div>
              </div>
            </form>

            {/* DAFTAR VIDEO TERDAPAT */}
            <div className="space-y-3 pt-2">
              <h3 className="font-extrabold text-sm text-white">Daftar Rekaman Video Ditambahkan ({recordingsList.length})</h3>

              {recordingsList.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs font-semibold">
                  Belum ada video rekaman kustom. Gunakan form di atas untuk menambahkan link YouTube atau Google Drive.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recordingsList.map((v) => (
                    <div key={v.id} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                      <div className="relative aspect-video bg-slate-900 group">
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 fill-slate-950 ml-1" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-black text-amber-400 uppercase border border-slate-700">
                          {v.provider === 'youtube' ? 'YouTube' : v.provider === 'gdrive' ? 'Google Drive' : 'Video Link'}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-sm text-white line-clamp-2">{v.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1">👨‍🏫 {v.tutor} • ⏱️ {v.duration}</p>
                          <div className="text-[10px] text-slate-500 font-mono mt-1">📅 {v.date}</div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-900">
                          <a
                            href={v.rawUrl || v.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview Video</span>
                          </a>

                          <button
                            onClick={() => handleDeleteVideoItem(v.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 cursor-pointer"
                            title="Hapus Video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB: MANAJEMEN LATIHAN BOT MASHIRA
      ------------------------------------------------------------- */}
      {portalTab === 'exercises' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>Manajemen Latihan Bot Mashira AI</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tambah, edit, dan hapus latihan speaking di chatbot Mashira untuk dipraktikkan oleh siswa.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* KOLOM KIRI: FORM TAMBAH / UPDATE LATIHAN */}
              <div id="exercise-form-section" className="lg:col-span-1 space-y-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{selectedExerciseForEdit ? 'Edit Latihan' : 'Tambah Latihan Baru'}</span>
                  </h3>

                  <form onSubmit={handleSaveExercise} className="space-y-4">
                    {/* Level Select */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400">Level Kemampuan:</label>
                      <select
                        value={exerciseForm.level}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, level: e.target.value })}
                        className="w-full text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-bold"
                      >
                        <option value="A1">A1 - Beginner (Pemula)</option>
                        <option value="A2">A2 - Elementary (Dasar)</option>
                        <option value="B1">B1 - Intermediate (Menengah)</option>
                        <option value="B2">B2 - Upper Intermediate (Menengah Atas)</option>
                        <option value="C1">C1 - Advanced (Mahir)</option>
                      </select>
                    </div>

                    {/* Judul Latihan */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400">Judul / Topik Latihan:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Introduce Yourself"
                        value={exerciseForm.title}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, title: e.target.value })}
                        className="w-full text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {/* Instruksi Latihan */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400">Instruksi Latihan:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Dengarkan lalu ulangi kalimat berikut."
                        value={exerciseForm.instruction}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, instruction: e.target.value })}
                        className="w-full text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {/* Teks Bahasa Inggris */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400">Teks Bahasa Inggris (Reference Text):</label>
                      <textarea
                        rows={3}
                        placeholder="Contoh: Hello, my name is Dhalfa and I am learning English."
                        value={exerciseForm.referenceText}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, referenceText: e.target.value })}
                        className="w-full text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-mono"
                        required
                      />
                    </div>

                    {/* Terjemahan Indonesia */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400">Terjemahan Bahasa Indonesia:</label>
                      <textarea
                        rows={3}
                        placeholder="Contoh: Halo, nama saya Dhalfa dan saya sedang belajar bahasa Inggris."
                        value={exerciseForm.translation}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, translation: e.target.value })}
                        className="w-full text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 rounded-xl text-slate-950 bg-emerald-500 hover:bg-emerald-400 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{selectedExerciseForEdit ? 'Simpan Perubahan' : 'Tambah Latihan'}</span>
                      </button>

                      {selectedExerciseForEdit && (
                        <button
                          type="button"
                          onClick={handleCancelExerciseEdit}
                          className="py-2 px-3 rounded-xl text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-850 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* KOLOM KANAN: DAFTAR LATIHAN YANG ADA */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-extrabold text-sm text-white">
                      Daftar Latihan Aktif ({exercisesList.length})
                    </h3>
                  </div>

                  {loading ? (
                    <div className="text-center py-8 text-slate-500 text-xs font-bold animate-pulse">
                      Memuat data latihan...
                    </div>
                  ) : exercisesList.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs font-bold border border-dashed border-slate-900 rounded-xl">
                      Belum ada latihan terdaftar. Silakan tambahkan lewat form di samping.
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                      {exercisesList.map((ex) => (
                        <div
                          key={ex.id}
                          className={`p-4 rounded-xl border transition-all ${selectedExerciseForEdit && selectedExerciseForEdit.id === ex.id
                              ? 'bg-emerald-500/5 border-emerald-500/40 shadow-sm'
                              : 'bg-slate-900/60 border-slate-900 hover:border-slate-800'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${ex.level === 'A1' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    ex.level === 'A2' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                      ex.level === 'B1' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                        ex.level === 'B2' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  }`}>
                                  {ex.level}
                                </span>
                                <h4 className="font-extrabold text-sm text-white">{ex.title}</h4>
                              </div>
                              <p className="text-[11px] text-slate-400 italic font-medium">{ex.instruction}</p>

                              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 space-y-1">
                                <div className="text-xs text-emerald-400 font-mono font-medium">{ex.referenceText}</div>
                                <div className="text-[11px] text-slate-500 italic font-medium">{ex.translation}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleEditExerciseClick(ex)}
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer transition-colors"
                                title="Edit Latihan"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExerciseItem(ex.id)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg border border-red-500/20 cursor-pointer transition-colors"
                                title="Hapus Latihan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: MANAJEMEN ADMIN ASISTEN (KHUSUS SENIOR ADMIN)
      ------------------------------------------------------------- */}
      {portalTab === 'assistants' && isSeniorAdmin && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <span>Daftar Tim Admin Asisten</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Admin Asisten bertugas membantu memantau pengguna dan merespon bantuan tanpa memiliki hak menghapus data master.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {userList.filter(u => u && (u.admin_type === 'Admin Asisten' || u.role === 'admin')).map((adminItem) => (
                <div key={adminItem.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-black text-purple-400">
                      {adminItem.full_name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-white">{adminItem.full_name}</div>
                      <div className="text-xs text-slate-400 font-mono">{adminItem.email}</div>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                        {adminItem.admin_type || 'Admin Asisten'}
                      </span>
                    </div>
                  </div>

                  {adminItem.email?.toLowerCase() !== SENIOR_ADMIN_EMAIL.toLowerCase() && (
                    <button
                      onClick={async () => {
                        if (confirm(`Yakin ingin menurunkan peran ${adminItem.full_name} menjadi Student?`)) {
                          await adminService.updateUser(adminItem.id, { role: 'student', admin_type: null });
                          showToast(`Peran ${adminItem.full_name} diperbarui!`);
                          loadAdminData();
                        }
                      }}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all text-xs font-bold cursor-pointer"
                      title="Hapus Hak Asisten Admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: ANALYTICS & LOG SISTEM
      ------------------------------------------------------------- */}
      {portalTab === 'analytics' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Kesehatan Platform & Log Realtime</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold">Status Server AI</div>
              <div className="text-emerald-400 font-black text-base flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Online (Low Latency)</span>
              </div>
              <p className="text-[11px] text-slate-500">Koneksi API AI Voice/Text berjalan optimal.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold">Database Sync</div>
              <div className="text-emerald-400 font-black text-base">Synced (0 Errors)</div>
              <p className="text-[11px] text-slate-500">Terakhir disinkronkan 1 menit yang lalu.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold">Master Security Lock</div>
              <div className="text-emerald-400 font-black text-base">PIN Active (20424014)</div>
              <p className="text-[11px] text-slate-500">Proteksi PIN aktif 24/7.</p>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 1: PERPANJANG PAKET & FREE TRIAL
      ------------------------------------------------------------- */}
      {selectedUserForExtend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-4xl p-6 max-w-md w-full text-white space-y-5 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2 text-emerald-400">
                <Edit3 className="w-5 h-5" />
                <span>Perpanjang / Setting Paket</span>
              </h3>
              <button
                onClick={() => setSelectedUserForExtend(null)}
                className="text-slate-400 hover:text-white font-black text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Pengguna Target:</span>
                <div className="font-black text-sm text-white">{selectedUserForExtend.full_name}</div>
                <div className="text-slate-400 text-[11px]">{selectedUserForExtend.email}</div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Pilih Jenis Paket:</label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={1}>Standard Pro</option>
                  <option value={2}>Premium VIP</option>
                  <option value={3}>Enterprise VIP</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Tambah Masa Aktif (Hari):</label>
                <input
                  type="number"
                  value={extendDays}
                  onChange={(e) => setExtendDays(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-bold">Set Sebagai Free Trial:</span>
                <input
                  type="checkbox"
                  checked={isTrialToggle}
                  onChange={(e) => setIsTrialToggle(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForExtend(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSavePackageExtension}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-glow"
              >
                Simpan Perubahan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 2: TAMBAH ADMIN ASISTEN (KHUSUS SENIOR ADMIN)
      ------------------------------------------------------------- */}
      {showAddAssistantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleAddAssistant} className="bg-slate-900 border-2 border-emerald-500/40 rounded-4xl p-6 max-w-md w-full text-white space-y-5 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2 text-emerald-400">
                <UserPlus className="w-5 h-5" />
                <span>Tambah Admin Asisten Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAssistantModal(false)}
                className="text-slate-400 hover:text-white font-black text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Nama Lengkap Admin Asisten:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Andi Asisten"
                  value={newAssistantForm.full_name}
                  onChange={(e) => setNewAssistantForm({ ...newAssistantForm, full_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="andi@mahirspeaking.com"
                  value={newAssistantForm.email}
                  onChange={(e) => setNewAssistantForm({ ...newAssistantForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">No. WhatsApp:</label>
                <input
                  type="text"
                  placeholder="6281234567890"
                  value={newAssistantForm.whatsapp}
                  onChange={(e) => setNewAssistantForm({ ...newAssistantForm, whatsapp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddAssistantModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-glow"
              >
                Tambah Asisten
              </button>
            </div>

          </form>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 3: DETAIL LOG AKTIVITAS PENGGUNA
      ------------------------------------------------------------- */}
      {selectedUserActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-4xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2 text-emerald-400">
                <Activity className="w-5 h-5" />
                <span>Log Aktivitas Pengguna</span>
              </h3>
              <button
                onClick={() => setSelectedUserActivity(null)}
                className="text-slate-400 hover:text-white font-black text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-black text-white">{selectedUserActivity.full_name}</div>
                  <div className="text-slate-500 text-[11px]">{selectedUserActivity.email}</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-extrabold text-sm">{selectedUserActivity.xp || 0} XP</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-400 font-bold text-[11px]">Riwayat Aktivitas Terakhir:</div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedUserActivity.activities?.length > 0 ? (
                    selectedUserActivity.activities.map((act, i) => (
                      <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-200">{act.action}</span>
                        <span className="text-slate-500 text-[10px]">{act.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-slate-500 text-xs italic">
                      Belum ada log aktivitas tercatat.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserActivity(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Tutup
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
