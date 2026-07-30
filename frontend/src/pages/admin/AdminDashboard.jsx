import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, Users, FileSpreadsheet, Upload, Download, Activity, CheckCircle, 
  Settings, Award, Flame, Search, Trash2, Edit, Plus, BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manage-users'); // 'manage-users' | 'import-quiz' | 'activity-logs'

  // =========================================================================
  // STATE 1: MANAGE USERS & ROLES / PACKAGES
  // =========================================================================
  const [usersList, setUsersList] = useState([
    { id: 1, full_name: 'Aci', username: 'aci_master', email: 'aci@mahirspeaking.com', role: 'student', package_name: 'English Speaking Partner Pro', xp: 3450, status: 'Active' },
    { id: 2, full_name: 'Fariha', username: 'fariha_speaking', email: 'fariha@mahirspeaking.com', role: 'student', package_name: 'English Speaking Partner Pro', xp: 2890, status: 'Active' },
    { id: 3, full_name: 'Ira', username: 'ira_fluent', email: 'ira@mahirspeaking.com', role: 'student', package_name: 'Private 1-on-1 VIP', xp: 2450, status: 'Active' },
    { id: 4, full_name: 'Pipit', username: 'pipit_voice', email: 'pipit@mahirspeaking.com', role: 'student', package_name: 'Group Speaking Kursus', xp: 1980, status: 'Active' },
    { id: 5, full_name: 'Ms. Era Purike', username: 'era_tutor', email: 'era@mahirspeaking.com', role: 'tutor', package_name: 'Tutor Specialist', xp: 5000, status: 'Active' },
    { id: 6, full_name: 'Admin Master', username: 'admin_master', email: 'admin@mahirspeaking.com', role: 'admin', package_name: 'System Admin', xp: 9999, status: 'Active' },
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [userSuccessMsg, setUserSuccessMsg] = useState('');

  const handleRoleChange = (userId, newRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setUserSuccessMsg('Akses role user berhasil diperbarui!');
    setTimeout(() => setUserSuccessMsg(''), 2500);
  };

  const handlePackageChange = (userId, newPackage) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, package_name: newPackage } : u));
    setUserSuccessMsg('Paket berlangganan user berhasil diubah!');
    setTimeout(() => setUserSuccessMsg(''), 2500);
  };

  // =========================================================================
  // STATE 2: IMPORT QUIZ FILE (EXCEL / CSV)
  // =========================================================================
  const [fileSelected, setFileSelected] = useState(null);
  const [parsedQuizzes, setParsedQuizzes] = useState([
    {
      id: 1,
      level: 'A1',
      question: 'What is the correct response to "How are you doing today?"',
      options: ['I am doing great, thank you!', 'Yes, I am do.', 'I have 20 years old.', 'Good bye.'],
      correctAnswer: 'A',
      explanation: 'Jawaban "I am doing great" paling alami dan tepat merespon sapaan kebiasaan sehari-hari.'
    },
    {
      id: 2,
      level: 'B1',
      question: 'Choose the most professional phrase for introducing a proposal:',
      options: ['Look at this thing now.', 'I would like to present our project proposal.', 'Hey check this out.', 'This is good.'],
      correctAnswer: 'B',
      explanation: '"I would like to present" adalah bentuk baku pengantar presentasi formal.'
    }
  ]);
  const [importStatusMsg, setImportStatusMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target.result;
        // Mock CSV/Excel parser
        const mockNewQuiz = {
          id: Date.now(),
          level: 'B2',
          question: `[Parsed from ${file.name}] In a job interview, how do you highlight your problem solving skill?`,
          options: [
            'I usually adapt quickly and use structured analytical approach.',
            'I don’t like problems.',
            'I ask someone else.',
            'No problem at all.'
          ],
          correctAnswer: 'A',
          explanation: 'Menggunakan pendekatan terstruktur (STAR method) menunjukkan profesionalisme.'
        };
        setParsedQuizzes(prev => [mockNewQuiz, ...prev]);
        setImportStatusMsg(`File "${file.name}" berhasil di-import dan diproses!`);
        setTimeout(() => setImportStatusMsg(''), 3000);
      };
      reader.readAsText(file);
    }
  };

  const downloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Level,Question,Option_A,Option_B,Option_C,Option_D,Correct_Option,Explanation\n"
      + "A1,How do you greet someone in the morning?,Good morning!,Good night!,See you later,Happy birthday,A,Good morning digunakan saat pagi hari.\n"
      + "B1,What is the synonym of 'fluent'?,Articulate,Hesitant,Silent,Slow,A,Articulate berarti lancar dan fasih berbicara.";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Template_Kuis_MahirSpeaking.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // STATE 3: LOG AKTIVITAS PENGGUNA
  // =========================================================================
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, user: 'Aci', action: 'Kuis Selesai', details: 'Menyelesaikan Kuis Diagnostik CEFR B2 (+50 XP)', timestamp: '30 Jul 2026, 12:15', badge: 'Kuis' },
    { id: 2, user: 'Fariha', action: 'Update Profile', details: 'Memperbarui foto avatar & target kelancaran bisnis', timestamp: '30 Jul 2026, 11:40', badge: 'Profil' },
    { id: 3, user: 'Admin Master', action: 'Perubahan Akses', details: 'Mengubah paket Pipit ke English Speaking Partner Pro', timestamp: '30 Jul 2026, 10:20', badge: 'Admin' },
    { id: 4, user: 'Ira', action: 'Akses LMS', details: 'Membuka Modul B1 Business Pitching & Practice', timestamp: '30 Jul 2026, 09:15', badge: 'LMS' },
    { id: 5, user: 'Pipit', action: 'Daily Streak', details: 'Mencapai 9 Hari Streak Pembelajaran Harian', timestamp: '30 Jul 2026, 08:00', badge: 'Streak' },
  ]);
  const [logSearch, setLogSearch] = useState('');

  const filteredUsers = usersList.filter(u => 
    u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = activityLogs.filter(l =>
    l.user.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Admin Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white bg-gradient-to-r from-slate-900 via-brand to-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-lime text-dark text-xs font-black px-3.5 py-1 rounded-full uppercase border border-dark">
            <Shield className="w-4 h-4 text-dark" />
            <span>ADMIN CONTROL CENTER</span>
          </div>
          <h1 className="font-stinger font-black text-2xl sm:text-4xl text-white">
            Kelola Akses User, Kuis & Log Aktivitas
          </h1>
          <p className="text-xs text-slate-300 font-semibold max-w-2xl">
            Pusat kendali admin untuk menguji hak akses role, meng-import bank kuis Excel/CSV, dan memantau log aktivitas pengguna.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('manage-users')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manage-users' ? 'bg-brand text-lime shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Ganti Akses User</span>
          </button>
          
          <button
            onClick={() => setActiveTab('import-quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'import-quiz' ? 'bg-brand text-lime shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Tambah Kuis (Excel/CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('activity-logs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'activity-logs' ? 'bg-brand text-lime shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Log Aktivitas</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GANTI AKSES USER & PAKET BERLANGGANAN */}
      {/* ========================================================================= */}
      {activeTab === 'manage-users' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white bg-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-stinger font-black text-xl text-slate-900">Kelola Role & Akses Paket User</h2>
              <p className="text-xs text-slate-500 font-medium">Ubah role akun (Student, Tutor, Admin) dan paket akses langsung.</p>
            </div>

            <div className="flex items-center gap-3">
              {userSuccessMsg && (
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full animate-pulse">
                  ✓ {userSuccessMsg}
                </span>
              )}
              <input
                type="text"
                placeholder="Cari user..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:border-brand outline-none shadow-sm w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role Hak Akses</th>
                  <th className="py-3 px-4">Paket Berlangganan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand text-lime font-black flex items-center justify-center border border-dark text-xs">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-stinger font-black text-slate-900 text-sm">{u.full_name}</div>
                          <div className="text-[10px] text-slate-400">@{u.username} • {u.xp} XP</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">{u.email}</td>

                    <td className="py-4 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 border border-slate-300 focus:border-brand outline-none cursor-pointer"
                      >
                        <option value="student">Student (Siswa)</option>
                        <option value="tutor">Tutor (Instruktur)</option>
                        <option value="admin">Admin (Master)</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={u.package_name}
                        onChange={(e) => handlePackageChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-50 text-emerald-900 border border-emerald-300 focus:border-brand outline-none cursor-pointer"
                      >
                        <option value="Group Speaking Kursus">Group Speaking Kursus</option>
                        <option value="English Speaking Partner Pro">English Speaking Partner Pro</option>
                        <option value="Private 1-on-1 VIP">Private 1-on-1 VIP</option>
                        <option value="System Admin">System Admin</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                        Terverifikasi
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TAMBAH KUIS (IMPORT FORMAT EXCEL & CSV) */}
      {/* ========================================================================= */}
      {activeTab === 'import-quiz' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white bg-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-stinger font-black text-xl text-slate-900">Import Kuis dari Excel (.xlsx) / CSV</h2>
              <p className="text-xs text-slate-500 font-medium">Unggah file soal kuis batch dalam format spreadsheet untuk otomatis masuk LMS.</p>
            </div>

            <button
              onClick={downloadSampleTemplate}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-lime font-black text-xs hover:bg-brand transition-all border border-slate-700 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Template (CSV/Excel)</span>
            </button>
          </div>

          {importStatusMsg && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>{importStatusMsg}</span>
            </div>
          )}

          {/* Visual Format Guide Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
            <h4 className="font-stinger font-black text-xs sm:text-sm text-amber-950 flex items-center gap-2">
              <span>📋 Format Kolom File Excel / CSV yang Benar:</span>
            </h4>
            <div className="overflow-x-auto text-[11px] font-mono text-slate-800 bg-white p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-brand">Level</span> | <span className="font-bold text-brand">Question</span> | <span className="font-bold text-brand">Option_A</span> | <span className="font-bold text-brand">Option_B</span> | <span className="font-bold text-brand">Option_C</span> | <span className="font-bold text-brand">Option_D</span> | <span className="font-bold text-brand">Correct_Option</span> | <span className="font-bold text-brand">Explanation</span>
            </div>
            <p className="text-[11px] text-amber-900 font-semibold">
              💡 <b>Keterangan:</b> Kolom <b>Correct_Option</b> diisi huruf kapital (A, B, C, atau D). Kolom <b>Level</b> diisi level CEFR (A1, B1, B2, C1). Anda juga bisa mengunduh file sampel dengan menekan tombol <i>"Unduh Template"</i> di kanan atas.
            </p>
          </div>

          {/* Upload Drop Zone */}
          <div className="border-3 border-dashed border-slate-300 hover:border-brand p-8 rounded-3xl text-center space-y-4 bg-slate-50/50 transition-all">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 text-brand flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            
            <div>
              <p className="text-sm font-black text-slate-900">Drag & Drop file Excel (.xlsx) / CSV di sini</p>
              <p className="text-xs text-slate-500 font-medium">Atau klik tombol di bawah untuk memilih file dari komputer</p>
            </div>

            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-quiz-input"
            />

            <label
              htmlFor="excel-quiz-input"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand text-lime font-black text-xs shadow-glow hover:scale-105 transition-transform cursor-pointer border border-dark"
            >
              <Upload className="w-4 h-4" />
              <span>Pilih File Excel / CSV</span>
            </label>

            {fileSelected && (
              <div className="text-xs font-bold text-brand pt-2">
                📂 File Terpilih: <span className="underline">{fileSelected}</span>
              </div>
            )}
          </div>

          {/* Preview Parsed Quizzes Table */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-stinger font-black text-lg text-slate-900">Preview Soal Kuis Ter-Parse</h3>
            <div className="space-y-3">
              {parsedQuizzes.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-brand text-lime text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                      Level {q.level}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Kunci Jawaban: {q.correctAnswer}
                    </span>
                  </div>

                  <p className="text-xs font-extrabold text-slate-900">{q.question}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-2 rounded-xl border font-bold ${String.fromCharCode(65 + i) === q.correctAnswer ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'}`}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium italic pt-1">💡 Pembahasan: {q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LOG AKTIVITAS PENGGUNA */}
      {/* ========================================================================= */}
      {activeTab === 'activity-logs' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white bg-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-stinger font-black text-xl text-slate-900">Log Aktivitas Pengguna</h2>
              <p className="text-xs text-slate-500 font-medium">Catatan riwayat kegiatan belajar, pengerjaan kuis, dan aktivitas akun secara real-time.</p>
            </div>

            <input
              type="text"
              placeholder="Filter log aktivitas..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:border-brand outline-none shadow-sm w-full sm:w-64"
            />
          </div>

          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-lime font-black flex items-center justify-center border border-slate-700 text-xs flex-shrink-0">
                    <Activity className="w-5 h-5 text-lime" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-stinger font-black text-slate-900 text-sm">{log.user}</span>
                      <span className="bg-slate-200 text-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        {log.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bold">{log.details}</p>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 flex-shrink-0">
                  <span>⏱️ {log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
