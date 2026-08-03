import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService, exerciseService } from '../../services/api';
import {
  ShieldCheck, Lock, Unlock, Users, Clock, Calendar, MessageSquare,
  UserPlus, Search, RefreshCw, AlertCircle, CheckCircle2, ChevronRight,
  TrendingUp, Zap, Sparkles, Award, Edit3, Trash2, ExternalLink, Activity,
  FileText, CheckCircle, Upload, Download, Video, FileSpreadsheet, Plus, Play, Film, BookOpen, Link, Eye,
  LayoutDashboard, ClipboardList, CircleDot, BellRing, ArrowRight, HelpCircle
} from 'lucide-react';

function getCalendarData() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const monthName = monthNames[month] + ' ' + year;
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  return {
    monthName,
    daysOfWeek,
    calendarDays,
    todayDate: date.getDate()
  };
}

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
    xp_reward: 20,
    access_type: 'free'
  });

  // 📦 State Modul (PDF, DOC, PPT)
  const [modulesList, setModulesList] = useState([]);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    type: 'PDF Document',
    size: '5.0 MB',
    badge: 'Official Modul',
    desc: '',
    fileUrl: '#',
    access_type: 'subscription'
  });

  // 📹 State Rekaman Sesi Kelas & Video (YouTube / GDrive)
  const [recordingsList, setRecordingsList] = useState([]);
  const [videoForm, setVideoForm] = useState({
    title: '',
    tutor: 'Mentor Senior (Mr. James)',
    duration: '60 Menit',
    level: 'All Levels',
    videoUrl: '',
    thumbnail: '',
    access_type: 'free'
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
  const [assistantSaving, setAssistantSaving] = useState(false);
  const [newAssistantForm, setNewAssistantForm] = useState({
    full_name: '',
    email: '',
    whatsapp: ''
  });

  const [toastMsg, setToastMsg] = useState('');
  const [showContentForm, setShowContentForm] = useState({
    quizzes: false,
    modules: false,
    recordings: false
  });

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
          xp_reward: parseInt(cols[7]) || 20,
          access_type: String(cols[8] || 'free').toLowerCase() === 'subscription' ? 'subscription' : 'free'
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
      xp_reward: parseInt(manualQuiz.xp_reward) || 20,
      access_type: manualQuiz.access_type,
      is_premium: manualQuiz.access_type === 'subscription',
      is_free: manualQuiz.access_type === 'free'
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
        xp_reward: 20,
        access_type: 'free'
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
        fileUrl: '#',
        access_type: 'subscription'
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
      alert('Judul dan link video cloud wajib diisi!');
      return;
    }
    const cloudVideoPattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|drive\.google\.com|instagram\.com|tiktok\.com|vimeo\.com|facebook\.com)\//i;
    if (!cloudVideoPattern.test(videoForm.videoUrl.trim())) {
      alert('Gunakan link cloud dari YouTube, Google Drive, Instagram, TikTok, Vimeo, atau Facebook. Upload video lokal tidak didukung.');
      return;
    }
    const videoPayload = {
      ...videoForm,
      videoUrl: videoForm.videoUrl.trim(),
      access_type: videoForm.access_type,
      is_premium: videoForm.access_type === 'subscription',
      is_free: videoForm.access_type === 'free'
    };
    const res = await adminService.saveRecordedVideo(videoPayload);
    if (res.success) {
      showToast(`Video rekaman "${videoForm.title}" berhasil ditambahkan!`);
      setVideoForm({
        title: '',
        tutor: 'Mentor Senior (Mr. James)',
        duration: '60 Menit',
        level: 'All Levels',
        videoUrl: '',
        thumbnail: '',
        access_type: 'free'
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

  // Format nomor Indonesia untuk WhatsApp: 08... / 8... menjadi 628...
  const normalizeWhatsAppNumber = (rawNumber) => {
    let number = String(rawNumber || '').replace(/\D/g, '');

    if (number.startsWith('0')) number = `62${number.slice(1)}`;
    else if (number.startsWith('8')) number = `62${number}`;

    return number;
  };

  const openWhatsAppChat = (rawNumber, message) => {
    const waNumber = normalizeWhatsAppNumber(rawNumber);

    if (!/^62\d{8,13}$/.test(waNumber)) {
      alert('Nomor WhatsApp tidak valid. Gunakan contoh: 0895420633222.');
      return;
    }

    const text = encodeURIComponent(message);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Di HP, buka aplikasi WhatsApp seperti sebelumnya.
      window.location.href = `https://api.whatsapp.com/send?phone=${waNumber}&text=${text}`;
      return;
    }

    // Di desktop, selalu buka WhatsApp Web di tab baru.
    // Jangan alihkan tab website utama jika popup diblokir browser.
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${waNumber}&text=${text}`;
    const whatsappTab = window.open(whatsappUrl, '_blank');

    if (whatsappTab) {
      whatsappTab.opener = null;
    } else {
      alert('Tab WhatsApp diblokir browser. Izinkan pop-up untuk website ini, lalu coba lagi.');
    }
  };

  // 💬 Kirim Pesan WA Otomatis
  const handleOpenWhatsApp = (userTarget) => {
    if (!userTarget.whatsapp) {
      alert('Nomor WhatsApp pengguna belum terdaftar!');
      return;
    }
    openWhatsAppChat(
      userTarget.whatsapp,
      `Halo Kak ${userTarget.full_name},\n\nKami dari Tim Mahir Speaking ingin menginformasikan status langganan Anda:\n• Paket: ${userTarget.package_name || 'Standard'}\n• Status Free Trial: ${userTarget.is_trial ? 'Aktif' : 'Non-Aktif'}\n• Tanggal Berakhir Paket: ${userTarget.package_expires || 'Tidak terbatas'}\n\nApakah ada kendala atau bantuan yang Anda butuhkan dalam belajar bahasa Inggris hari ini? 😊`
    );
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

    setAssistantSaving(true);
    try {
      const assistantPayload = {
        ...newAssistantForm,
        email: newAssistantForm.email.trim().toLowerCase(),
        role: 'admin',
        admin_type: 'Admin Asisten'
      };
      const res = await adminService.addAssistantAdmin(assistantPayload);
      if (res.success) {
        showToast(`Admin Asisten ${newAssistantForm.full_name} berhasil ditambahkan!`);
        setShowAddAssistantModal(false);
        setNewAssistantForm({ full_name: '', email: '', whatsapp: '' });
        await loadAdminData();
      } else {
        alert(res.message || 'Gagal menambahkan Admin Asisten.');
      }
    } catch (error) {
      console.error('Gagal menambahkan Admin Asisten:', error);
      alert('Data Admin Asisten gagal disimpan ke database.');
    } finally {
      setAssistantSaving(false);
    }
  };

  // 💬 Kirim Pesan WhatsApp ke Lead Placement Test
  const handleOpenLeadWhatsApp = (lead) => {
    if (!lead.noWa) {
      alert('Nomor WhatsApp lead tidak valid!');
      return;
    }
    openWhatsAppChat(
      lead.noWa,
      `Halo Kak ${lead.nama}! 😊\n\nKami dari Tim Mahir Speaking ingin mengonfirmasi pendaftaran Placement Test & Trial Class Anda:\n• Target Level: ${lead.levelTarget}\n• Hasil Diagnosis: ${lead.recommendedLevel}\n• Pilihan Jadwal Trial: ${lead.jadwalTrial}\n• Catatan: ${lead.catatan || '-'}\n\nKapan bisa kami bantu untuk penguncian slot Trial Class-nya Kak? 🚀`
    );
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
    <div className="admin-portal-wrapper min-h-screen bg-gradient-to-br from-[#87CEFA] via-[#dff4ff] to-[#f5fbff] text-slate-900 font-sans">
      <style>{`
        .admin-portal-main .bg-slate-900\/60,
        .admin-portal-main .bg-slate-900\/80 { background: #ffffff !important; }
        .admin-portal-main .bg-slate-950 { background: #f8fafc !important; }
        .admin-portal-main .bg-slate-900 { background: #eef2f7 !important; }
        .admin-portal-main .border-slate-800 { border-color: #e2e8f0 !important; }
        .admin-portal-main .border-slate-700 { border-color: #cbd5e1 !important; }
        .admin-portal-main .bg-slate-900\/60 .text-white,
        .admin-portal-main .bg-slate-900\/60 .text-slate-100,
        .admin-portal-main .bg-slate-900\/60 .text-slate-200,
        .admin-portal-main .bg-slate-900\/80 .text-white,
        .admin-portal-main .bg-slate-950 .text-white { color: #10233f !important; }
        .admin-portal-main .text-slate-300 { color: #475569 !important; }
        .admin-portal-main .text-slate-400 { color: #64748b !important; }
        .admin-portal-main .text-slate-500 { color: #64748b !important; }
        .admin-portal-main button.bg-\[\#0362C0\],
        .admin-portal-main a.bg-\[\#0362C0\] { color: #ffffff !important; }
  // 🟢 SCREEN 2: MAIN DASHBOARD
        .admin-portal-main input,
        .admin-portal-main select,
        .admin-portal-main textarea { background: #ffffff !important; color: #10233f !important; }
      `}</style>

      <div className="flex bg-transparent admin-portal-main p-4 sm:p-6 lg:p-8 gap-6 min-h-screen">

        {/* 1. LEFT SIDEBAR */}
        <aside className="sticky top-8 hidden h-[calc(100vh-64px)] w-[260px] shrink-0 flex-col bg-[#0D52CD] p-6 lg:flex text-slate-100 rounded-[2.5rem] shadow-2xl z-20 border border-blue-700">

          {/* Logo Box - Yellow background card to align perfectly and pop! */}
          <div className="mb-8 flex items-center gap-3 bg-[#FFDE00] text-slate-950 py-5 px-5 rounded-[2rem] shadow-sm border border-yellow-500/20">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#0D52CD] text-white shadow-md">
              <ShieldCheck className="h-5.5 w-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-stinger font-black text-slate-950 text-xs sm:text-sm tracking-wide leading-tight">Mahir Admin</div>
              <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none mt-0.5">Control Center</div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {[
              ['overview', 'Dashboard', LayoutDashboard],
              ['users', 'Pengguna', Users],
              ['leads', 'Leads', FileText],
              ['quizzes', 'Kuis', FileSpreadsheet],
              ['modules', 'Modul & E-Book', BookOpen],
              ['recordings', 'Video', Video],
              ['exercises', 'Latihan Bot', MessageSquare],
              ['analytics', 'Status Sistem', Activity]
            ].map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPortalTab(key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-xs font-black transition-all duration-200 ${portalTab === key ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)] scale-[1.02]' : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
            {isSeniorAdmin && (
              <button
                type="button"
                onClick={() => setPortalTab('assistants')}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-xs font-black transition-all duration-200 ${portalTab === 'assistants' ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)] scale-[1.02]' : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'}`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Admin Asisten</span>
              </button>
            )}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-3xl bg-blue-900/60 p-4 border border-blue-500/20 text-white relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-blue-500/10 blur-xl" />
              <div className="flex items-center gap-2 text-xs font-black text-blue-300">
                <CircleDot className="h-4 w-4 text-yellow-400 animate-pulse" />
                <span>Sistem Online</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-blue-200">Database & Voice AI Services active.</p>
            </div>
          </div>
        </aside>

        {/* 2. MAIN CONTAINER AREA */}
        <main className="flex-1 min-w-0 space-y-4 sm:space-y-6 pb-28 lg:pb-24 overflow-hidden">

          {/* toast alert */}
          {toastMsg && (
            <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* 👑 TOP HEADER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-stinger">
                Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}! 👋
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Manage work, students, leads, and study materials here.
              </p>
            </div>

            <div className="flex items-center gap-3 justify-end flex-wrap">
              <span className="px-3.5 py-1.5 text-[11px] font-black bg-blue-50 text-[#2563EB] rounded-full border border-blue-100/50">
                Today, {todayLabel}
              </span>

              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-100 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[11px]">{user?.full_name || 'Admin Master'}</span>
                  <span className="text-[9px] text-[#2563EB] font-black">
                    {isSeniorAdmin ? 'Admin Senior' : 'Admin Asisten'}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="px-3.5 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-red-100"
                title="Keluar Sesi"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>

          {/* 📈 KPI STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">

            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <span>Total Pengguna</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{stats.totalUsers}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-1">
                  <span className="text-emerald-500 font-bold">{stats.totalStudents}</span> Siswa • <span className="text-blue-500 font-bold">{stats.totalTutors}</span> Tutor
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <span>Free Trial Aktif</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-amber-500">{stats.activeTrials}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-1">Uji coba belajar</div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <span>Leads Placement</span>
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-emerald-500">{stats.totalLeads || leads.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-1">Target: 50 / bulan</div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <span>Kadaluarsa Soon</span>
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-rose-500">{stats.expiringSoon}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-1">Perlu follow-up</div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <span>Total Omzet</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-[#2563EB]">Rp {(stats.totalRevenue || 0).toLocaleString('id-ID')}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-1">Estimasi omzet</div>
              </div>
            </div>
          </div>

          {/* 3. MAIN DASHBOARD CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

            {/* LEFT COLUMN: MAIN WORK AREA */}
            <div className="space-y-6">

              {/* FEATURED PROGRESS CARDS (ONLY FOR OVERVIEW/DASHBOARD TAB) */}
              {portalTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Card 1: Active Trials */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                    <div className="space-y-3">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold bg-blue-50 text-[#2563EB] rounded-full border border-blue-100/50">
                        Active Trials
                      </span>
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">Masa Uji Coba</h3>
                        <p className="text-xs text-slate-500 mt-1">{stats.activeTrials} Siswa sedang trial</p>
                      </div>

                      {/* Overlapping Avatars */}
                      <div className="flex -space-x-2 overflow-hidden pt-1">
                        {users.filter(u => u.is_trial).slice(0, 4).map((u, idx) => (
                          <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#2563EB] text-white flex items-center justify-center text-[11px] font-black uppercase">
                            {u.full_name?.charAt(0) || 'U'}
                          </div>
                        ))}
                        {stats.activeTrials > 4 && (
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-extrabold">
                            +{stats.activeTrials - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SVG Progress Circle */}
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                        <circle cx="40" cy="40" r="32" className="stroke-[#2563EB]" strokeWidth="6" fill="transparent"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - Math.min(stats.activeTrials / 20, 1))}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#2563EB]">
                        {Math.round(Math.min((stats.activeTrials / 20) * 100, 100))}%
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Placement Leads Target */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                    <div className="space-y-3">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50">
                        Monthly Conversion
                      </span>
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">Diagnostic Leads</h3>
                        <p className="text-xs text-slate-500 mt-1">{leads.length} / 50 Leads Bulan Ini</p>
                      </div>

                      {/* Overlapping Avatars */}
                      <div className="flex -space-x-2 overflow-hidden pt-1">
                        {leads.slice(0, 4).map((l, idx) => (
                          <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-500 text-white flex items-center justify-center text-[11px] font-black uppercase">
                            {l.nama?.charAt(0) || 'L'}
                          </div>
                        ))}
                        {leads.length > 4 && (
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-extrabold">
                            +{leads.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SVG Progress Circle */}
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                        <circle cx="40" cy="40" r="32" className="stroke-emerald-500" strokeWidth="6" fill="transparent"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - Math.min(leads.length / 50, 1))}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-emerald-600">
                        {Math.round(Math.min((leads.length / 50) * 100, 100))}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="sticky top-2 z-30 -mx-1 rounded-2xl border border-blue-100 bg-white/95 p-2 shadow-xl backdrop-blur-lg lg:hidden">
                <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setPortalTab('overview')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'overview'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Ringkasan Tugas</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('users')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'users'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Manajemen Pengguna ({users.length})</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('leads')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'leads'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Leads Placement Test ({leads.length})</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('quizzes')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'quizzes'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Manajemen Kuis ({quizzesList.length})</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('modules')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'modules'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Manajemen Modul ({modulesList.length})</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('recordings')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'recordings'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Pembelajaran ({recordingsList.length})</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('exercises')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'exercises'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Latihan Bot Mashira ({exercisesList.length})</span>
                  </button>

                  {isSeniorAdmin && (
                    <button
                      onClick={() => setPortalTab('assistants')}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'assistants'
                        ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                        : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                        }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Admin Asisten</span>
                    </button>
                  )}

                  <button
                    onClick={() => setPortalTab('analytics')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${portalTab === 'analytics'
                      ? 'bg-[#FFDE00] text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.3)]'
                      : 'bg-white text-slate-500 hover:text-[#0D52CD] border border-blue-100'
                      }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Status Sistem</span>
                  </button>
                </div>

                {portalTab === 'assistants' && isSeniorAdmin && (
                  <button
                    onClick={() => setShowAddAssistantModal(true)}
                    className="px-4 py-2.5 rounded-2xl bg-[#FFDE00] hover:bg-[#E6C800] text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
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
                <div className="space-y-6">

                  {/* 🌟 GREETING BANNER CARD */}
                  <section className="relative overflow-hidden rounded-[2rem] border border-blue-100/50 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-6 sm:p-8 shadow-sm">
                    <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="max-w-2xl space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-100">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{todayLabel}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white sm:text-3xl font-stinger">
                          Selamat bekerja, {user?.full_name?.split(' ')[0] || 'Admin'}! 👋
                        </h2>
                        <p className="text-xs font-semibold leading-relaxed text-blue-100/90 max-w-xl">
                          Mulai dari tugas berlabel <strong className="text-white underline">Mendesak</strong>, lalu lanjutkan follow-up trial dan pengecekan materi. Klik tugas untuk membuka data.
                        </p>
                      </div>

                      <div className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white">
                          <ClipboardList className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-blue-100">Perlu Tindakan</p>
                          <p className="text-2xl font-black text-white">{uncontactedLeads.length + readyTrialLeads.length + expiringUsers.length} Tugas</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* GRID: MAIN PRIORITIES & ALUR KERJA */}
                  <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">

                    {/* 📋 TASK LIST (Styled like Course taking list in CourseCo) */}
                    <section className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                      <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider">
                            <BellRing className="h-4 w-4 text-amber-500" /> Prioritas Tugas Utama
                          </h3>
                          <p className="mt-1 text-[11px] font-semibold text-slate-500">Kerjakan dari urutan paling atas.</p>
                        </div>
                        <button onClick={loadAdminData} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-500 hover:text-slate-950 transition hover:bg-slate-100 cursor-pointer" title="Perbarui data">
                          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>

                      <div className="space-y-3.5">

                        {/* TASK 1: Lead Baru */}
                        <button onClick={() => openAdminTask('leads', 'Belum Dihubungi')} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left transition hover:border-[#2563EB]/30 hover:bg-blue-50/20 cursor-pointer">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 font-black text-xs">LD</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-black text-slate-900">Hubungi Lead Diagnostic Baru</p>
                              {uncontactedLeads.length > 0 && (
                                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[8px] font-black text-white">MENDESAK</span>
                              )}
                            </div>
                            <p className="mt-1 text-[10px] font-semibold text-slate-500">Kirim WhatsApp, konfirmasi kelas trial, lalu update status lead.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-rose-600">{uncontactedLeads.length}</p>
                            <p className="text-[9px] font-bold text-slate-400">leads baru</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]" />
                        </button>

                        {/* TASK 2: Trial Class */}
                        <button onClick={() => openAdminTask('leads', 'Siap Trial Class')} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left transition hover:border-[#2563EB]/30 hover:bg-blue-50/20 cursor-pointer">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 font-black text-xs">TR</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-900">Konfirmasi Slot Trial Class</p>
                            <p className="mt-1 text-[10px] font-semibold text-slate-500">Pastikan jadwal pilihan peserta dan tutor sudah terhubung.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-amber-600">{readyTrialLeads.length}</p>
                            <p className="text-[9px] font-bold text-slate-400">siap kelas</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]" />
                        </button>

                        {/* TASK 3: Expiring Users */}
                        <button onClick={() => openAdminTask('users', 'expiring')} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left transition hover:border-[#2563EB]/30 hover:bg-blue-50/20 cursor-pointer">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 font-black text-xs">PK</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-900">Follow-Up Paket Segera Berakhir</p>
                            <p className="mt-1 text-[10px] font-semibold text-slate-500">Kirim pengingat perpanjangan paket maksimal 7 hari sebelum expiry.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-sky-600">{expiringUsers.length}</p>
                            <p className="text-[9px] font-bold text-slate-400">users</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]" />
                        </button>

                        {/* TASK 4: Check Content */}
                        <button onClick={() => openAdminTask('modules')} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left transition hover:border-[#2563EB]/30 hover:bg-blue-50/20 cursor-pointer">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 font-black text-xs">MT</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-900">Kebutuhan Materi Belajar & Kuis</p>
                            <p className="mt-1 text-[10px] font-semibold text-slate-500">Periksa modul baru, kuis pelajaran, dan rekaman kelas ter-update.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-sky-600">{modulesList.length} Modul</p>
                            <p className="text-[9px] font-bold text-slate-400">{quizzesList.length} Kuis • {recordingsList.length} Video</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]" />
                        </button>
                      </div>
                    </section>

                    {/* ℹ️ INFOBAR SIDE */}
                    <div className="space-y-6">

                      {/* Workflow Card */}
                      <section className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider"><HelpCircle className="h-4 w-4 text-blue-500" /> Alur Kerja Asisten</h3>
                        <div className="mt-5 space-y-4">
                          {[
                            ['1', 'Cek Prioritas', 'Perhatikan tugas mendesak di dashboard.'],
                            ['2', 'Follow-Up WhatsApp', 'Gunakan direct chat WA & tempel template.'],
                            ['3', 'Perbarui Status', 'Segera ganti status setelah menghubungi.'],
                            ['4', 'Koordinasi Pembayaran', 'Konfirmasi slip transfer ke Admin Senior.'],
                          ].map(([number, title, description], index) => (
                            <div key={number} className="relative flex gap-3">
                              {index < 3 && <div className="absolute left-3.5 top-7 h-8 w-px bg-slate-150" />}
                              <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-black text-[#2563EB] border border-blue-100">{number}</span>
                              <div>
                                <p className="text-xs font-black text-slate-800 leading-none">{title}</p>
                                <p className="mt-1 text-[10px] font-semibold leading-relaxed text-slate-500">{description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Authority warning card */}
                      <section className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-emerald-100 text-emerald-600 p-2"><ShieldCheck className="h-5 w-5" /></div>
                          <div>
                            <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Batas Wewenang</h3>
                            <p className="mt-1.5 text-[10px] font-semibold leading-relaxed text-emerald-700">
                              Asisten Admin diperbolehkan merespon leads, mengupdate status, dan membantu siswa. Penghapusan data siswa, edit admin, dan persetujuan bayar harus divalidasi Admin Senior.
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="Cari nama, email, atau no WhatsApp..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-slate-400">Filter:</span>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
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
                        className="p-2 bg-slate-50 border border-slate-200 rounded-2xl hover:text-[#2563EB] transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* TABLE MAIN (DESKTOP VIEW) */}
                  <div className="hidden md:block bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-extrabold uppercase tracking-wider text-[10px]">
                            <th className="py-3.5 px-4 font-black">Pengguna</th>
                            <th className="py-3.5 px-4 font-black">No. WhatsApp</th>
                            <th className="py-3.5 px-4 font-black">Status Free Trial</th>
                            <th className="py-3.5 px-4 font-black">Paket & Berakhir</th>
                            <th className="py-3.5 px-4 font-black">Aktivitas (XP/Streak)</th>
                            <th className="py-3.5 px-4 text-center font-black">Aksi / Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
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
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">

                                  {/* 👤 User Info */}
                                  <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#2563EB] text-sm flex-shrink-0">
                                        {u.full_name?.charAt(0) || 'U'}
                                      </div>
                                      <div>
                                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                          <span>{u.full_name}</span>
                                          {u.email?.toLowerCase() === SENIOR_ADMIN_EMAIL.toLowerCase() && (
                                            <span className="px-2 py-0.2 text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                                              Admin Senior
                                            </span>
                                          )}
                                          {u.admin_type === 'Admin Asisten' && (
                                            <span className="px-2 py-0.2 text-[9px] font-black bg-sky-100 text-sky-800 border border-sky-200 rounded-full">
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
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 rounded-xl transition-all font-mono font-bold cursor-pointer"
                                        title="Klik untuk kirim pesan WhatsApp"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>+{u.whatsapp}</span>
                                      </button>
                                    ) : (
                                      <span className="text-slate-400 italic">Tidak ada WA</span>
                                    )}
                                  </td>

                                  {/* ⚡ Free Trial Status */}
                                  <td className="py-3.5 px-4">
                                    {u.is_trial ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 border border-amber-100 text-amber-600">
                                        <Zap className="w-3 h-3" />
                                        <span>Trial Aktif</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
                                        <span>Reguler / Paid</span>
                                      </span>
                                    )}
                                  </td>

                                  {/* 📅 Package & Expire Date */}
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-0.5">
                                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[11px]">
                                        {u.package_name || 'Standard Pro'}
                                      </span>
                                      <div className={`text-[11px] font-mono flex items-center gap-1 pt-1 ${isExpired ? 'text-rose-600 font-bold' : 'text-slate-400'
                                        }`}>
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <span>{u.package_expires ? `Kadaluarsa: ${u.package_expires}` : 'Unlimited'}</span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* 📊 Activity */}
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-0.5 text-[11px]">
                                      <div className="text-emerald-600 font-extrabold">
                                        ⚡ {u.xp || 0} XP • 🔥 {u.streak || 0} Hari
                                      </div>
                                      <div className="text-slate-400 text-[10px]">
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
                                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-[#2563EB] text-[#2563EB] font-black text-[11px] transition-all border border-blue-100 hover:text-white cursor-pointer flex items-center gap-1"
                                        title="Perpanjang atau Ubah Paket"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Paket</span>
                                      </button>

                                      <button
                                        onClick={() => setSelectedUserActivity(u)}
                                        className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all border border-slate-200 cursor-pointer"
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
                      <div className="bg-white border border-slate-150 rounded-2xl p-6 text-center text-slate-400 text-xs font-bold shadow-sm">
                        Memuat data pengguna...
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="bg-white border border-slate-150 rounded-2xl p-6 text-center text-slate-400 text-xs font-bold shadow-sm">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </div>
                    ) : (
                      filteredUsers.map((u) => {
                        const isExpired = u.package_expires && new Date(u.package_expires) < new Date();
                        return (
                          <div key={u.id} className="bg-white border border-slate-150 rounded-2xl p-4 space-y-3 shadow-sm">
                            {/* Header Card */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#2563EB] text-base flex-shrink-0">
                                  {u.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex flex-wrap items-center gap-1.5">
                                    <span>{u.full_name}</span>
                                    {u.email?.toLowerCase() === SENIOR_ADMIN_EMAIL.toLowerCase() && (
                                      <span className="px-2 py-0.2 text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                                        Senior Admin
                                      </span>
                                    )}
                                    {u.admin_type === 'Admin Asisten' && (
                                      <span className="px-2 py-0.2 text-[9px] font-black bg-sky-100 text-sky-800 border border-sky-200 rounded-full">
                                        Asisten
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                                </div>
                              </div>
                            </div>

                            {/* Metadata & Status */}
                            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">Status Trial:</span>
                                {u.is_trial ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-600 border border-amber-100">
                                    <Zap className="w-2.5 h-2.5" /> Trial Aktif
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold">Reguler / Paid</span>
                                )}
                              </div>

                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">Paket:</span>
                                <span className="text-[11px] font-extrabold text-slate-700">
                                  {u.package_name || 'Standard Pro'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                              <div className="flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span className={isExpired ? 'text-rose-600 font-bold' : ''}>
                                  {u.package_expires ? `Exp: ${u.package_expires}` : 'Unlimited'}
                                </span>
                              </div>
                              <div className="text-emerald-600 font-extrabold">
                                ⚡ {u.xp || 0} XP • 🔥 {u.streak || 0} Hari
                              </div>
                            </div>

                            {/* WhatsApp & Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                              {u.whatsapp ? (
                                <button
                                  onClick={() => handleOpenWhatsApp(u)}
                                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </button>
                              ) : (
                                <div className="flex-1 text-slate-400 italic text-[11px] text-center">No WA</div>
                              )}

                              <button
                                onClick={() => {
                                  setSelectedUserForExtend(u);
                                  setSelectedPackageId(u.package_id || 1);
                                  setIsTrialToggle(u.is_trial || false);
                                }}
                                className="py-2 px-3 bg-[#2563EB] text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm hover:bg-[#1D4ED8]"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Paket</span>
                              </button>

                              <button
                                onClick={() => setSelectedUserActivity(u)}
                                className="p-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100"
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="Cari nama, WA, atau catatan lead..."
                        value={leadSearchQuery}
                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-slate-400">Filter Status:</span>
                      <select
                        value={leadStatusFilter}
                        onChange={(e) => setLeadStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                      >
                        <option value="all">Semua Status Leads</option>
                        <option value="Belum Dihubungi">Belum Dihubungi</option>
                        <option value="Sudah Dihubungi">Sudah Dihubungi</option>
                        <option value="Siap Trial Class">Siap Trial Class</option>
                        <option value="Joined Member">Joined Member</option>
                      </select>

                      <button
                        onClick={loadAdminData}
                        className="p-2 rounded-2xl bg-slate-50 border border-slate-200 hover:text-[#2563EB] transition-all cursor-pointer text-slate-500 hover:bg-slate-100"
                        title="Refresh Data Leads"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* DESKTOP TABLE VIEW LEADS */}
                  <div className="hidden md:block bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-extrabold uppercase tracking-wider text-[10px]">
                            <th className="py-3.5 px-4 font-black">Nama Lead & Waktu</th>
                            <th className="py-3.5 px-4 font-black">WhatsApp (1-Click)</th>
                            <th className="py-3.5 px-4 font-black">Target & Diagnosis Level</th>
                            <th className="py-3.5 px-4 font-black">Jadwal Trial Class</th>
                            <th className="py-3.5 px-4 font-black">Catatan Belajar</th>
                            <th className="py-3.5 px-4 font-black">Status Lead</th>
                            <th className="py-3.5 px-4 text-center font-black">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
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
                              <tr key={l.id} className="hover:bg-slate-50 transition-colors">

                                {/* Nama Lead */}
                                <td className="py-3.5 px-4">
                                  <div className="space-y-0.5">
                                    <div className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                                      <span>{l.nama}</span>
                                      <span className="px-2 py-0.2 text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                                        Lead
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-slate-400" />
                                      <span>{l.date}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* WhatsApp Button */}
                                <td className="py-3.5 px-4">
                                  {l.noWa ? (
                                    <button
                                      onClick={() => handleOpenLeadWhatsApp(l)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 rounded-xl transition-all font-mono font-bold cursor-pointer"
                                      title="Klik untuk follow up WhatsApp dengan pesan otomatis"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>+{l.noWa}</span>
                                    </button>
                                  ) : (
                                    <span className="text-slate-500 italic">No WA tidak ada</span>
                                  )}
                                </td>

                                {/* Level Target & Diagnosis */}
                                <td className="py-3.5 px-4">
                                  <div className="space-y-1">
                                    <div className="text-[11px]">
                                      Target: <span className="font-extrabold text-slate-700">{l.levelTarget}</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
                                      <Award className="w-3 h-3 text-blue-600" />
                                      <span>Diagnosis: {l.recommendedLevel}</span>
                                    </span>
                                  </div>
                                </td>

                                {/* Jadwal Trial Class */}
                                <td className="py-3.5 px-4">
                                  <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-amber-600 border border-slate-100 font-bold text-[11px]">
                                    📅 {l.jadwalTrial || 'Sabtu (10.00 WIB)'}
                                  </span>
                                </td>

                                {/* Catatan Belajar */}
                                <td className="py-3.5 px-4 max-w-[200px]">
                                  <p className="text-[11px] text-slate-600 italic truncate" title={l.catatan}>
                                    "{l.catatan || 'Tidak ada catatan'}"
                                  </p>
                                </td>

                                {/* Status Lead Dropdown */}
                                <td className="py-3.5 px-4">
                                  <select
                                    value={l.status || 'Belum Dihubungi'}
                                    onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                                    className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border cursor-pointer focus:outline-none ${l.status === 'Joined Member'
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                      : l.status === 'Siap Trial Class'
                                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                                        : l.status === 'Sudah Dihubungi'
                                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                                          : 'bg-slate-50 text-slate-600 border-slate-200'
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
                                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-all cursor-pointer"
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
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center text-slate-400 text-xs font-bold">
                        Memuat data leads...
                      </div>
                    ) : filteredLeads.length === 0 ? (
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center text-slate-400 text-xs font-bold">
                        Belum ada data placement test lead.
                      </div>
                    ) : (
                      filteredLeads.map((l) => (
                        <div key={l.id} className="bg-white border border-slate-100 rounded-3xl p-4 space-y-3 shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
                                <span>{l.nama}</span>
                                <span className="px-2 py-0.2 text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                                  Lead
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono pt-0.5">{l.date}</div>
                            </div>

                            <select
                              value={l.status || 'Belum Dihubungi'}
                              onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                              className="px-2 py-1 rounded-xl text-[10px] font-extrabold bg-slate-50 text-slate-700 border border-slate-200"
                            >
                              <option value="Belum Dihubungi">⏳ Belum Dihubungi</option>
                              <option value="Sudah Dihubungi">💬 Sudah Dihubungi</option>
                              <option value="Siap Trial Class">🎯 Siap Trial</option>
                              <option value="Joined Member">👑 Member</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Target Level:</span>
                              <span className="text-slate-700 font-bold">{l.levelTarget}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Hasil Diagnosis:</span>
                              <span className="text-blue-600 font-extrabold">{l.recommendedLevel}</span>
                            </div>
                          </div>

                          <div className="text-xs pt-1 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold block">Jadwal Trial Class:</span>
                            <span className="text-amber-600 font-bold">📅 {l.jadwalTrial}</span>
                          </div>

                          {l.catatan && (
                            <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                              "{l.catatan}"
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            {l.noWa ? (
                              <button
                                onClick={() => handleOpenLeadWhatsApp(l)}
                                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp (+{l.noWa})</span>
                              </button>
                            ) : (
                              <div className="flex-1 text-slate-400 italic text-[11px] text-center">No WA</div>
                            )}

                            <button
                              onClick={() => handleDeleteLead(l.id, l.nama)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl cursor-pointer"
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
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 font-stinger">
                          <FileSpreadsheet className="w-5 h-5 text-[#2563EB]" />
                          <span>Upload & Tambah Soal Kuis (CSV / XLSX)</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Impor soal kuis secara massal menggunakan file Excel (.xlsx / .csv) atau tambahkan soal secara manual.
                        </p>
                      </div>
                      <button type="button" onClick={() => setShowContentForm((prev) => ({ ...prev, quizzes: !prev.quizzes }))} className="rounded-2xl bg-[#FFDE00] px-4 py-2.5 text-xs font-black text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.25)] hover:bg-[#E6C800] transition-colors cursor-pointer">
                        {showContentForm.quizzes ? 'Tutup Form' : '+ Tambah Kuis'}
                      </button>
                    </div>

                    {showContentForm.quizzes && <>
                      {/* BOX UPLOAD FILE CSV / XLSX */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* OPSI A: UPLOAD FILE EXCEL / CSV */}
                        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-slate-200 space-y-4 hover:border-[#2563EB]/50 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 rounded-xl text-[#2563EB] border border-blue-100">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-sm text-slate-900">Upload File CSV / Excel (.xlsx)</h3>
                              <p className="text-[11px] text-slate-500">Pilih file berformat .csv atau .xlsx dari komputer Anda</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-slate-500">Pilih File Soal Kuis:</label>
                            <input
                              type="file"
                              accept=".csv, .xlsx, .xls, .txt"
                              onChange={handleFileUploadQuiz}
                              className="w-full text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-[#FFDE00] file:text-slate-950 cursor-pointer"
                            />
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                            <span className="font-black text-amber-600 block">💡 Format Kolom CSV/Excel:</span>
                            <code className="text-[10px] text-emerald-700 font-mono block bg-slate-50 p-1.5 rounded border border-slate-100 overflow-x-auto">
                              lesson_id, question, option_a, option_b, option_c, option_d, correct_answer_index, xp_reward, access_type
                            </code>
                          </div>
                        </div>

                        {/* OPSI B: PASTE TEKS CSV DIRECT */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-500" />
                              <span>Paste Teks CSV Langsung</span>
                            </h3>
                            <span className="text-[10px] text-slate-400">Quick Import</span>
                          </div>

                          <textarea
                            rows={4}
                            placeholder={`1,What is the synonym of Happy?,Glad,Sad,Angry,Fear,0,20\n1,Choose correct phrase,How are you?,How is you?,How you are?,Where are you?,0,20`}
                            value={quizCSVText}
                            onChange={(e) => setQuizCSVText(e.target.value)}
                            className="w-full bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#2563EB]"
                          />

                          <button
                            onClick={handleTextImportQuiz}
                            className="w-full py-2.5 rounded-xl bg-[#FFDE00] hover:bg-[#E6C800] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_12px_rgba(255,222,0,0.2)]"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Impor Baris CSV Teks</span>
                          </button>
                        </div>
                      </div>

                      {/* FORM TAMBAH KUIS MANUAL */}
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <Plus className="w-4 h-4 text-[#2563EB]" />
                          <span>Form Input Soal Kuis Single / Manual</span>
                        </h3>

                        <form onSubmit={handleSaveManualQuiz} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                          <div>
                            <label className="block text-slate-500 mb-1">Target Lesson ID / Unit</label>
                            <input
                              type="number"
                              value={manualQuiz.lesson_id}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, lesson_id: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Reward XP</label>
                            <input
                              type="number"
                              value={manualQuiz.xp_reward}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, xp_reward: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div className="md:col-span-2 rounded-2xl border-2 border-yellow-250 bg-yellow-50/50 p-4">
                            <label className="mb-2 block font-black text-slate-900">Akses Kuis *</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button type="button" onClick={() => setManualQuiz({ ...manualQuiz, access_type: 'free' })} className={`rounded-xl px-3 py-3 text-xs font-black transition ${manualQuiz.access_type === 'free' ? 'bg-[#FFDE00] text-slate-950 shadow-md' : 'bg-white text-slate-500 border border-blue-100'}`}>
                                Gratis
                              </button>
                              <button type="button" onClick={() => setManualQuiz({ ...manualQuiz, access_type: 'subscription' })} className={`rounded-xl px-3 py-3 text-xs font-black transition ${manualQuiz.access_type === 'subscription' ? 'bg-[#FFDE00] text-slate-950 shadow-md' : 'bg-white text-slate-500 border border-blue-100'}`}>
                                Berlangganan
                              </button>
                            </div>
                            <p className="mt-2 text-[10px] font-semibold text-slate-500">Gratis dapat dibuka semua akun. Berlangganan hanya untuk paket aktif.</p>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-slate-500 mb-1">Pertanyaan / Question Text *</label>
                            <input
                              type="text"
                              placeholder="Misal: What is the past tense of 'Go'?"
                              value={manualQuiz.question}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, question: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Pilihan A *</label>
                            <input
                              type="text"
                              value={manualQuiz.option_a}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, option_a: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Pilihan B *</label>
                            <input
                              type="text"
                              value={manualQuiz.option_b}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, option_b: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Pilihan C</label>
                            <input
                              type="text"
                              value={manualQuiz.option_c}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, option_c: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Pilihan D</label>
                            <input
                              type="text"
                              value={manualQuiz.option_d}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, option_d: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-slate-500 mb-1">Kunci Jawaban Benar (Index 0 = A, 1 = B, 2 = C, 3 = D)</label>
                            <select
                              value={manualQuiz.correct_answer}
                              onChange={(e) => setManualQuiz({ ...manualQuiz, correct_answer: parseInt(e.target.value) })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:border-[#2563EB] font-bold cursor-pointer"
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
                              className="py-3 px-6 rounded-2xl bg-[#FFDE00] hover:bg-[#E6C800] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_12px_rgba(255,222,0,0.25)]"
                            >
                              <Plus className="w-4 h-4 stroke-[3]" />
                              <span>Simpan Soal Kuis</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </>}

                    {/* LIST DAFTAR KUIS TERDAPAT */}
                    <div className="space-y-3 pt-2">
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                        <span>Daftar Kuis Kustom Ditambahkan ({quizzesList.length})</span>
                      </h3>

                      {quizzesList.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
                          Belum ada kuis kustom yang diunggah. Silakan upload file CSV/Excel atau tambahkan via form di atas.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {quizzesList.map((q, idx) => (
                            <div key={q.id || idx} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-0.5 rounded border border-blue-100">
                                    Unit #{q.lesson_id}
                                  </span>
                                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded border border-emerald-100">
                                    +{q.xp_reward} XP
                                  </span>
                                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border ${q.access_type === 'subscription'
                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                    : 'bg-sky-50 text-sky-600 border-sky-100'
                                    }`}>
                                    {q.access_type === 'subscription' ? 'BERLANGGANAN' : 'GRATIS'}
                                  </span>
                                </div>
                                <h4 className="font-extrabold text-sm text-slate-800">{q.question}</h4>
                                <div className="text-xs text-slate-500 flex flex-wrap gap-2 pt-1">
                                  {Array.isArray(q.options) && q.options.map((opt, i) => (
                                    <span key={i} className={`px-2.5 py-1 rounded text-[11px] font-mono border ${i === q.correct_answer
                                      ? 'bg-emerald-50 text-emerald-700 font-extrabold border-emerald-100'
                                      : 'bg-slate-50 text-slate-400 border-slate-100'
                                      }`}>
                                      {String.fromCharCode(65 + i)}. {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteQuizItem(q.id)}
                                className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl cursor-pointer transition-colors"
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
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 font-stinger">
                          <BookOpen className="w-5 h-5 text-[#2563EB]" />
                          <span>Tambah Modul & E-Book Pembelajaran</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Upload PDF, DOC/DOCX, atau PPT/PPTX. Semua modul dan E-Book khusus akun langganan.
                        </p>
                      </div>
                      <button type="button" onClick={() => setShowContentForm((prev) => ({ ...prev, modules: !prev.modules }))} className="rounded-2xl bg-[#FFDE00] px-4 py-2.5 text-xs font-black text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.25)] hover:bg-[#E6C800] transition-colors cursor-pointer">
                        {showContentForm.modules ? 'Tutup Form' : '+ Tambah Modul'}
                      </button>
                    </div>

                    {/* FORM INPUT MODUL */}
                    {showContentForm.modules && (
                      <form onSubmit={handleSaveModule} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <Plus className="w-4 h-4 text-[#2563EB]" />
                          <span>Detail Modul Baru</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                          <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50/50 p-3 text-slate-900">
                            <Lock className="h-4 w-4" />
                            <span className="font-black">Akses otomatis: BERLANGGANAN</span>
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-1">Judul Modul / E-Book *</label>
                            <input
                              type="text"
                              placeholder="Misal: Modul Grammar & Daily Expression Pack"
                              value={moduleForm.title}
                              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Format Tipe File *</label>
                            <select
                              value={moduleForm.type}
                              onChange={(e) => setModuleForm({ ...moduleForm, type: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:border-[#2563EB] font-bold cursor-pointer"
                            >
                              <option value="PDF Document">PDF Document (.pdf)</option>
                              <option value="Word Document">Word Document (.doc / .docx)</option>
                              <option value="PowerPoint Presentation">PowerPoint (.ppt / .pptx)</option>
                              <option value="PDF & Audio Pack">PDF & Audio Bundle (.zip / .mp3)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Estimasi Ukuran File (Size)</label>
                            <input
                              type="text"
                              placeholder="Misal: 12.5 MB"
                              value={moduleForm.size}
                              onChange={(e) => setModuleForm({ ...moduleForm, size: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Badge / Kategori Modul</label>
                            <input
                              type="text"
                              placeholder="Misal: Official Modul / Career Prep / CEFR Level"
                              value={moduleForm.badge}
                              onChange={(e) => setModuleForm({ ...moduleForm, badge: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-850 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-slate-500 mb-1">Deskripsi Singkat Modul</label>
                            <textarea
                              rows={2}
                              placeholder="Penjelasan ringkas isi materi di dalam modul ini..."
                              value={moduleForm.desc}
                              onChange={(e) => setModuleForm({ ...moduleForm, desc: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-850 focus:outline-none focus:border-[#2563EB] font-semibold"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-slate-500 mb-1">Link File / URL Lampiran Modul</label>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atau Upload File Lokal</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder={moduleForm.fileUrl?.startsWith('data:') ? '✓ File Lokal Terpilih (Base64)' : 'https://drive.google.com/file/... atau isi link luar'}
                                value={moduleForm.fileUrl?.startsWith('data:') ? '' : moduleForm.fileUrl}
                                onChange={(e) => setModuleForm({ ...moduleForm, fileUrl: e.target.value })}
                                disabled={moduleForm.fileUrl?.startsWith('data:')}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-mono focus:outline-none focus:border-[#2563EB]"
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
                                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#2563EB] hover:text-[#2563EB] bg-white text-slate-500 cursor-pointer font-bold transition-all text-xs"
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
                              className="py-3 px-6 rounded-2xl bg-[#FFDE00] hover:bg-[#E6C800] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_12px_rgba(255,222,0,0.25)]"
                            >
                              <Plus className="w-4 h-4 stroke-[3]" />
                              <span>Simpan & Publikasikan Modul</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* DAFTAR MODUL TERUNGGAH */}
                    <div className="space-y-3 pt-2">
                      <h3 className="font-extrabold text-sm text-slate-900">Daftar Modul Ditambahkan ({modulesList.length})</h3>

                      {modulesList.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
                          Belum ada modul kustom yang ditambahkan. Gunakan form di atas untuk mempublikasikan modul PDF, DOC, atau PPT.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {modulesList.map((m) => (
                            <div key={m.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded border border-emerald-100">
                                    {m.badge}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-bold">{m.size}</span>
                                </div>
                                <h4 className="font-black text-base text-slate-900 leading-tight">{m.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{m.desc || 'Tidak ada deskripsi'}</p>
                                <div className="text-[11px] text-[#2563EB] font-mono font-bold">Format: {m.type}</div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                                {m.fileUrl && m.fileUrl.startsWith('data:') ? (
                                  <a
                                    href={m.fileUrl}
                                    download={`${m.title}.${m.type?.includes('Word') ? 'docx' : m.type?.includes('PowerPoint') ? 'pptx' : m.type?.includes('Audio') || m.type?.includes('Pack') ? 'zip' : 'pdf'}`}
                                    className="text-xs text-[#2563EB] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download File</span>
                                  </a>
                                ) : (
                                  <a
                                    href={m.fileUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-[#2563EB] font-bold hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Buka Link File</span>
                                  </a>
                                )}

                                <button
                                  onClick={() => handleDeleteModuleItem(m.id)}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 cursor-pointer transition-colors"
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
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 font-stinger">
                          <Video className="w-5 h-5 text-[#2563EB]" />
                          <span>Tambah Video Pembelajaran dari Cloud</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Gunakan link YouTube, Google Drive, Instagram, TikTok, Vimeo, atau Facebook. Tidak ada upload video lokal.
                        </p>
                      </div>
                      <button type="button" onClick={() => setShowContentForm((prev) => ({ ...prev, recordings: !prev.recordings }))} className="rounded-2xl bg-[#FFDE00] px-4 py-2.5 text-xs font-black text-slate-950 shadow-[0_4px_12px_rgba(255,222,0,0.25)] hover:bg-[#E6C800] transition-colors cursor-pointer">
                        {showContentForm.recordings ? 'Tutup Form' : '+ Tambah Video'}
                      </button>
                    </div>

                    {/* FORM INPUT VIDEO LINK */}
                    {showContentForm.recordings && (
                      <form onSubmit={handleSaveRecordedVideo} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                          <Plus className="w-4 h-4 text-[#2563EB]" />
                          <span>Detail Video Pembelajaran</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                          <div className="md:col-span-2">
                            <label className="block text-slate-500 mb-1">Judul Sesi Rekaman Kelas *</label>
                            <input
                              type="text"
                              placeholder="Misal: Live Practice: Job Interview & Business Negotiation Strategy"
                              value={videoForm.title}
                              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-slate-500 mb-1">Link Video Cloud *</label>
                            <input
                              type="url"
                              inputMode="url"
                              placeholder="Tempel link YouTube, GDrive, Instagram, TikTok, Vimeo, atau Facebook"
                              value={videoForm.videoUrl}
                              onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-mono focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Hanya tautan cloud. File video dari komputer tidak dapat diunggah.
                            </span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {['YouTube', 'Google Drive', 'Instagram', 'TikTok', 'Vimeo', 'Facebook'].map((platform) => (
                                <span key={platform} className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[9px] font-black text-blue-600">{platform}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Nama Tutor / Mentor</label>
                            <input
                              type="text"
                              placeholder="Misal: Native Speaker (Mr. James)"
                              value={videoForm.tutor}
                              onChange={(e) => setVideoForm({ ...videoForm, tutor: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Durasi Video</label>
                            <input
                              type="text"
                              placeholder="Misal: 90 Menit"
                              value={videoForm.duration}
                              onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">Tingkat / Level Kelas</label>
                            <input
                              type="text"
                              placeholder="Misal: All Levels / Level B1-B2"
                              value={videoForm.level}
                              onChange={(e) => setVideoForm({ ...videoForm, level: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold"
                            />
                          </div>

                          <div className="md:col-span-2 rounded-2xl border-2 border-yellow-250 bg-yellow-50/50 p-4">
                            <label className="mb-2 block font-black text-slate-900">Akses Video *</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button type="button" onClick={() => setVideoForm({ ...videoForm, access_type: 'free' })} className={`rounded-xl px-3 py-3 text-xs font-black transition ${videoForm.access_type === 'free' ? 'bg-[#FFDE00] text-slate-950 shadow-md' : 'bg-white text-slate-500 border border-blue-100'}`}>
                                Gratis
                              </button>
                              <button type="button" onClick={() => setVideoForm({ ...videoForm, access_type: 'subscription' })} className={`rounded-xl px-3 py-3 text-xs font-black transition ${videoForm.access_type === 'subscription' ? 'bg-[#FFDE00] text-slate-950 shadow-md' : 'bg-white text-slate-500 border border-blue-100'}`}>
                                Berlangganan
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-500 mb-1">URL Gambar Thumbnail Kustom (Opsional)</label>
                            <input
                              type="text"
                              placeholder="Kosongkan jika ingin auto-generate dari YouTube/GDrive"
                              value={videoForm.thumbnail}
                              onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>

                          <div className="md:col-span-2 pt-2">
                            <button
                              type="submit"
                              className="py-3 px-6 rounded-2xl bg-[#FFDE00] hover:bg-[#E6C800] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_12px_rgba(255,222,0,0.25)]"
                            >
                              <Plus className="w-4 h-4 stroke-[3]" />
                              <span>Publikasikan Video</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* DAFTAR VIDEO TERDAPAT */}
                    <div className="space-y-3 pt-2">
                      <h3 className="font-extrabold text-sm text-slate-900">Daftar Rekaman Video Ditambahkan ({recordingsList.length})</h3>

                      {recordingsList.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
                          Belum ada video rekaman kustom. Gunakan form di atas untuk menambahkan link YouTube atau Google Drive.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {recordingsList.map((v) => (
                            <div key={v.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm">
                              <div className="relative aspect-video bg-slate-900 group">
                                <img
                                  src={v.thumbnail}
                                  alt={v.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
                                  }}
                                />
                                <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-[#2563EB]/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                                    <Play className="w-5 h-5 fill-white ml-0.5" />
                                  </div>
                                </div>
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-black text-amber-400 uppercase border border-slate-700">
                                  {v.provider === 'youtube' ? 'YouTube' : v.provider === 'gdrive' ? 'Google Drive' : 'Video Link'}
                                </span>
                                <span className={`absolute right-2 top-2 rounded-md border px-2 py-0.5 text-[10px] font-black ${v.access_type === 'subscription' ? 'border-amber-100 bg-amber-50 text-amber-700' : 'border-sky-100 bg-sky-50 text-sky-700'}`}>
                                  {v.access_type === 'subscription' ? 'BERLANGGANAN' : 'GRATIS'}
                                </span>
                              </div>

                              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="font-black text-sm text-slate-900 line-clamp-2 leading-snug">{v.title}</h4>
                                  <p className="text-[11px] text-slate-500 mt-1">👨‍🏫 {v.tutor} • ⏱️ {v.duration}</p>
                                  <div className="text-[10px] text-slate-400 font-mono mt-1">📅 {v.date}</div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                                  <a
                                    href={v.rawUrl || v.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-[#2563EB] font-bold hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Preview Video</span>
                                  </a>

                                  <button
                                    onClick={() => handleDeleteVideoItem(v.id)}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 cursor-pointer transition-colors"
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

              {portalTab === 'exercises' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 font-stinger">
                          <MessageSquare className="w-5 h-5 text-[#2563EB]" />
                          <span>Manajemen Latihan Bot Mashira AI</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 font-semibold">
                          Tambah, edit, dan hapus latihan speaking di chatbot Mashira untuk dipraktikkan oleh siswa.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* KOLOM KIRI: FORM TAMBAH / UPDATE LATIHAN */}
                      <div id="exercise-form-section" className="lg:col-span-1 space-y-4">
                        <div className="bg-slate-55 p-5 rounded-[2rem] border border-slate-200 space-y-4 shadow-sm">
                          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>{selectedExerciseForEdit ? 'Edit Latihan' : 'Tambah Latihan Baru'}</span>
                          </h3>

                          <form onSubmit={handleSaveExercise} className="space-y-4">
                            {/* Level Select */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-slate-600 uppercase">Level Kemampuan:</label>
                              <select
                                value={exerciseForm.level}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, level: e.target.value })}
                                className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 cursor-pointer font-bold transition-all shadow-sm"
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
                              <label className="block text-[11px] font-bold text-slate-600 uppercase">Judul / Topik Latihan:</label>
                              <input
                                type="text"
                                placeholder="Contoh: Introduce Yourself"
                                value={exerciseForm.title}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, title: e.target.value })}
                                className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 font-bold transition-all shadow-sm"
                                required
                              />
                            </div>

                            {/* Instruksi Latihan */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-slate-600 uppercase">Instruksi Latihan:</label>
                              <input
                                type="text"
                                placeholder="Contoh: Dengarkan lalu ulangi kalimat berikut."
                                value={exerciseForm.instruction}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, instruction: e.target.value })}
                                className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 font-bold transition-all shadow-sm"
                                required
                              />
                            </div>

                            {/* Teks Bahasa Inggris */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-slate-600 uppercase">Teks Bahasa Inggris (Reference Text):</label>
                              <textarea
                                rows={3}
                                placeholder="Contoh: Hello, my name is Dhalfa and I am learning English."
                                value={exerciseForm.referenceText}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, referenceText: e.target.value })}
                                className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 resize-none font-bold transition-all shadow-sm font-mono"
                                required
                              />
                            </div>

                            {/* Terjemahan Indonesia */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-slate-600 uppercase">Terjemahan Bahasa Indonesia:</label>
                              <textarea
                                rows={3}
                                placeholder="Contoh: Halo, nama saya Dhalfa dan saya sedang belajar bahasa Inggris."
                                value={exerciseForm.translation}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, translation: e.target.value })}
                                className="w-full text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 resize-none font-bold transition-all shadow-sm"
                                required
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <button
                                type="submit"
                                className="flex-1 py-3 px-4 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                              >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>{selectedExerciseForEdit ? 'Simpan Perubahan' : 'Tambah Latihan'}</span>
                              </button>

                              {selectedExerciseForEdit && (
                                <button
                                  type="button"
                                  onClick={handleCancelExerciseEdit}
                                  className="py-3 px-4 rounded-xl text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-sm"
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
                        <div className="bg-slate-55 p-5 rounded-[2rem] border border-slate-200 space-y-4 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="font-extrabold text-sm text-slate-900">
                              Daftar Latihan Aktif ({exercisesList.length})
                            </h3>
                          </div>

                          {loading ? (
                            <div className="text-center py-8 text-slate-400 text-xs font-bold animate-pulse">
                              Memuat data latihan...
                            </div>
                          ) : exercisesList.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs font-bold border border-dashed border-slate-250 bg-white rounded-xl">
                              Belum ada latihan terdaftar. Silakan tambahkan lewat form di samping.
                            </div>
                          ) : (
                            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                              {exercisesList.map((ex) => (
                                <div
                                  key={ex.id}
                                  className={`p-4 rounded-xl border transition-all ${selectedExerciseForEdit && selectedExerciseForEdit.id === ex.id
                                    ? 'bg-blue-50 border-blue-300 shadow-md'
                                    : 'bg-white border-slate-200 hover:border-slate-350 shadow-sm'
                                    }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1.5 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${ex.level === 'A1' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            ex.level === 'A2' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                              ex.level === 'B1' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                ex.level === 'B2' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                  'bg-amber-50 text-amber-700 border-amber-200'
                                          }`}>
                                          {ex.level}
                                        </span>
                                        <h4 className="font-extrabold text-sm text-slate-900">{ex.title}</h4>
                                      </div>
                                      <p className="text-[11px] text-slate-500 italic font-bold">{ex.instruction}</p>

                                      <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-150 space-y-1">
                                        <div className="text-xs text-blue-700 font-mono font-bold leading-relaxed">{ex.referenceText}</div>
                                        <div className="text-[11px] text-slate-500 italic font-semibold">{ex.translation}</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() => handleEditExerciseClick(ex)}
                                        className="p-1.5 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 cursor-pointer transition-colors shadow-sm"
                                        title="Edit Latihan"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteExerciseItem(ex.id)}
                                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100 cursor-pointer transition-colors shadow-sm"
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
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 font-stinger">
                          <UserPlus className="w-5 h-5 text-[#2563EB]" />
                          <span>Daftar Tim Admin Asisten</span>
                        </h2>
                        <p className="text-xs text-slate-500">
                          Admin Asisten bertugas membantu memantau pengguna dan merespon bantuan tanpa memiliki hak menghapus data master.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddAssistantModal(true)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0362C0] px-4 py-3 text-xs font-black text-white shadow-lg transition hover:bg-[#024f9c] sm:w-auto"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>+ Tambah Admin Asisten</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {userList.filter(u => u && (u.admin_type === 'Admin Asisten' || u.role === 'admin')).map((adminItem) => (
                        <div key={adminItem.id} className="bg-slate-50 border border-slate-250 rounded-2xl p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#2563EB]">
                              {adminItem.full_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-slate-900">{adminItem.full_name}</div>
                              <div className="text-xs text-slate-400 font-mono">{adminItem.email}</div>
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] font-bold border border-blue-100">
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
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-655 border border-red-150 transition-all text-xs font-bold cursor-pointer"
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 font-stinger">
                    <Activity className="w-5 h-5 text-[#2563EB]" />
                    <span>Status Sistem</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="text-slate-400 font-bold">Status Server AI</div>
                      <div className="text-emerald-600 font-black text-base flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Online (Low Latency)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Koneksi API AI Voice/Text berjalan optimal.</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="text-slate-400 font-bold">Database Sync</div>
                      <div className="text-emerald-600 font-black text-base">Synced (0 Errors)</div>
                      <p className="text-[11px] text-slate-500">Terakhir disinkronkan 1 menit yang lalu.</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="text-slate-400 font-bold">Keamanan Admin</div>
                      <div className="text-emerald-600 font-black text-base">Proteksi Aktif</div>
                      <p className="text-[11px] text-slate-500">Informasi rahasia tidak ditampilkan di dashboard.</p>
                    </div>

                  </div>
                </div>
              )}

            </div> {/* END OF LEFT COLUMN */}

            {/* RIGHT SIDE PANEL (Desktop only) */}
            <div className="hidden lg:flex flex-col gap-6 sticky top-6 w-[320px] shrink-0">

              {/* Illustration Banner Card */}
              <div className="bg-gradient-to-br from-[#E2F0FD] to-[#DBEAFE] rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col justify-between shadow-sm border border-slate-100 min-h-[220px]">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
                <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-blue-300/20 blur-3xl" />

                <div className="relative space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-[9px] font-black uppercase text-blue-700">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Live Operations</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight font-stinger">
                    Mahir Speaking<br />Control Hub
                  </h2>
                </div>

                <div className="relative pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Server Status</p>
                    <p className="text-xs font-extrabold text-blue-700 flex items-center gap-1 mt-0.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-800">
                    <TrendingUp className="w-5 h-5 text-[#2563EB]" />
                  </div>
                </div>
              </div>

              {/* Custom Interactive Calendar Widget */}
              {(() => {
                const { monthName, daysOfWeek, calendarDays, todayDate } = getCalendarData();
                return (
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#2563EB]" />
                        <span>{monthName}</span>
                      </h3>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB]/20" />
                        <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-1.5 text-center text-[10px] font-extrabold text-slate-400">
                      {daysOfWeek.map((day, idx) => (
                        <div key={idx} className="py-1">{day}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-bold text-slate-700">
                      {calendarDays.map((day, idx) => {
                        if (day === null) {
                          return <div key={idx} className="py-1 text-slate-300">-</div>;
                        }
                        const isToday = day === todayDate;
                        return (
                          <div key={idx} className="flex justify-center items-center py-1">
                            <span className={`w-7 h-7 flex items-center justify-center text-xs ${isToday ? 'bg-[#2563EB] text-white rounded-full font-black shadow-[0_4px_12px_rgba(37,99,235,0.4)]' : 'hover:bg-slate-50 rounded-full cursor-pointer transition-colors'}`}>
                              {day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Urgent Action / Prioritas Tindakan Lists */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-rose-500" />
                    <span>Prioritas Tindakan</span>
                  </h3>
                  <span className="px-2.5 py-0.5 text-[9px] font-black bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                    Urgent
                  </span>
                </div>

                <div className="space-y-3">
                  {leads.filter(l => l.status === 'Belum Dihubungi' || !l.status).slice(0, 2).map((l, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2 transition-all">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-950 truncate">{l.nama}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate font-semibold">Diagnosis: {l.recommendedLevel}</p>
                      </div>
                      <button
                        onClick={() => handleOpenLeadWhatsApp(l)}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0 cursor-pointer"
                        title="Follow up WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {leads.filter(l => l.status === 'Belum Dihubungi' || !l.status).length === 0 && (
                    <div className="text-center py-4 text-[10px] font-bold text-slate-400 italic">
                      Semua lead baru sudah dihubungi! ✨
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div> {/* END OF MAIN DASHBOARD CONTENT GRID */}

          {/* -------------------------------------------------------------
          MODAL 1: PERPANJANG PAKET & FREE TRIAL
      ------------------------------------------------------------- */}
          {selectedUserForExtend && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 max-w-md w-full text-slate-850 space-y-5 shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base flex items-center gap-2 text-[#2563EB]">
                    <Edit3 className="w-5 h-5" />
                    <span>Perpanjang / Setting Paket</span>
                  </h3>
                  <button
                    onClick={() => setSelectedUserForExtend(null)}
                    className="text-slate-400 hover:text-slate-900 font-black text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150">
                    <span className="text-slate-450 text-[10px] uppercase font-black tracking-wider">Pengguna Target</span>
                    <div className="font-black text-sm text-slate-900 mt-1">{selectedUserForExtend.full_name}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{selectedUserForExtend.email}</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-650 font-bold">Pilih Jenis Paket:</label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                    >
                      <option value={1}>Standard Pro</option>
                      <option value={2}>Premium VIP</option>
                      <option value={3}>Enterprise VIP</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-650 font-bold">Tambah Masa Aktif (Hari):</label>
                    <input
                      type="number"
                      value={extendDays}
                      onChange={(e) => setExtendDays(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-[#2563EB] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <span className="text-slate-650 font-bold">Set Sebagai Free Trial:</span>
                    <input
                      type="checkbox"
                      checked={isTrialToggle}
                      onChange={(e) => setIsTrialToggle(e.target.checked)}
                      className="w-5 h-5 accent-[#2563EB] rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setSelectedUserForExtend(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSavePackageExtension}
                    className="flex-1 py-3 rounded-xl bg-[#FFDE00] hover:bg-[#E6C800] text-slate-950 font-black text-xs cursor-pointer shadow-[0_4px_12px_rgba(255,222,0,0.2)] transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>

              </div>
            </div>,
            document.body
          )}

          {/* -------------------------------------------------------------
          MODAL 2: TAMBAH ADMIN ASISTEN (KHUSUS SENIOR ADMIN)
      ------------------------------------------------------------- */}
          {showAddAssistantModal && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
              <form onSubmit={handleAddAssistant} className="bg-white border border-slate-100 rounded-[2rem] p-6 max-w-md w-full text-slate-850 space-y-5 shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base flex items-center gap-2 text-slate-900">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    <span>Jadikan Admin Asisten</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAssistantModal(false);
                      setNewAssistantForm({ email: '', full_name: '', whatsapp: '' });
                    }}
                    className="text-slate-400 hover:text-slate-900 font-black text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-slate-655 font-bold">Pilih Pengguna Terdaftar:</label>
                    <select
                      required
                      value={newAssistantForm.email}
                      onChange={(e) => {
                        const selected = userList.find(u => u && u.email === e.target.value);
                        if (selected) {
                          setNewAssistantForm({
                            email: selected.email,
                            full_name: selected.full_name,
                            whatsapp: selected.whatsapp || ''
                          });
                        } else {
                          setNewAssistantForm({ email: '', full_name: '', whatsapp: '' });
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-850 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                    >
                      <option value="">-- Pilih Akun Calon Asisten --</option>
                      {userList
                        .filter(u => u && u.role !== 'admin' && u.role !== 'tutor')
                        .map(u => (
                          <option key={u.id} value={u.email}>
                            {u.full_name} ({u.email})
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {newAssistantForm.email && (
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nama Lengkap:</span>
                        <span className="text-slate-900 font-extrabold">{newAssistantForm.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="text-slate-900 font-extrabold font-mono">{newAssistantForm.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">No. WhatsApp:</span>
                        <span className="text-slate-900 font-extrabold">{newAssistantForm.whatsapp || '-'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAssistantModal(false);
                      setNewAssistantForm({ email: '', full_name: '', whatsapp: '' });
                    }}
                    className="flex-1 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={assistantSaving || !newAssistantForm.email}
                    className="flex-1 py-3 rounded-xl bg-[#FFDE00] hover:bg-[#E6C800] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-950 font-black text-xs cursor-pointer shadow-[0_4px_12px_rgba(255,222,0,0.2)] transition-colors"
                  >
                    {assistantSaving ? 'Menyimpan...' : 'Jadikan Asisten'}
                  </button>
                </div>

              </form>
            </div>,
            document.body
          )}

          {/* -------------------------------------------------------------
          MODAL 3: DETAIL LOG AKTIVITAS PENGGUNA
      ------------------------------------------------------------- */}
          {selectedUserActivity && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 max-w-md w-full text-slate-850 space-y-4 shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base flex items-center gap-2 text-slate-900">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>Log Aktivitas Pengguna</span>
                  </h3>
                  <button
                    onClick={() => setSelectedUserActivity(null)}
                    className="text-slate-400 hover:text-slate-900 font-black text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs font-semibold">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 flex items-center justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{selectedUserActivity.full_name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{selectedUserActivity.email}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[#2563EB] font-extrabold text-sm">{selectedUserActivity.xp || 0} XP</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-500 font-bold text-[11px]">Riwayat Aktivitas Terakhir:</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedUserActivity.activities?.length > 0 ? (
                        selectedUserActivity.activities.map((act, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between text-[11px]">
                            <span className="text-slate-700">{act.action}</span>
                            <span className="text-slate-400 text-[10px] font-mono">{act.time}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-slate-150">
                          Belum ada log aktivitas tercatat.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserActivity(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 font-bold text-xs cursor-pointer transition-colors"
                >
                  Tutup
                </button>

              </div>
            </div>,
            document.body
          )}

        </main>
      </div>
    </div>
  );
}