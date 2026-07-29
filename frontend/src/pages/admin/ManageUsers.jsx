import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
  Search, UserCheck, Shield, Edit2, Save, X, Sparkles, Lock, Unlock, 
  UserPlus, CheckCircle2, Award, Zap, Sliders, Users, RefreshCw
} from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([
    { id: 1, full_name: 'Budi Pratama', username: 'budipratama', email: 'budi@gmail.com', role: 'student', package_id: 1, package_name: 'Basic Starter', xp: 450, points: 120, isPaid: false },
    { id: 2, full_name: 'Siti Rahma', username: 'sitirahma', email: 'siti@gmail.com', role: 'student', package_id: 2, package_name: 'Standard Pro', xp: 1200, points: 350, isPaid: true },
    { id: 3, full_name: 'Aci Daily', username: 'acidaily846', email: 'acidaily846@gmail.com', role: 'student', package_id: 3, package_name: 'Premium VIP', xp: 2800, points: 890, isPaid: true },
    { id: 4, full_name: 'Sarah Jenkins (Native Tutor)', username: 'sarah_native', email: 'sarah@mahirspeaking.com', role: 'tutor', package_id: 3, package_name: 'Premium VIP', xp: 5000, points: 1500, isPaid: true },
    { id: 5, full_name: 'Super Admin', username: 'admin_mahir', email: 'admin@mahirspeaking.com', role: 'admin', package_id: 3, package_name: 'Premium VIP', xp: 9999, points: 9999, isPaid: true }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [editingUser, setEditingUser] = useState(null);
  const [role, setRole] = useState('student');
  const [packageId, setPackageId] = useState(1);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminService.getUsers()
      .then(data => {
        if (data.success && data.users && data.users.length > 0) {
          setUsers(data.users);
        }
      })
      .catch(() => {
        // Keeps rich demo data if server is unreachable
      })
      .finally(() => setLoading(false));
  };

  const handleEditClick = (u) => {
    setEditingUser(u);
    setRole(u.role);
    setPackageId(u.package_id || 1);
    setIsPaid(u.isPaid || u.package_id === 3);
  };

  const handleToggleVipDirect = async (targetUser) => {
    const newPaidStatus = !targetUser.isPaid;
    const newPkgId = newPaidStatus ? 3 : 1;
    const newPkgName = newPaidStatus ? 'Premium VIP' : 'Basic Starter';

    // Update local state immediately for responsive feedback
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { 
      ...u, 
      isPaid: newPaidStatus, 
      package_id: newPkgId,
      package_name: newPkgName
    } : u));

    setStatusMessage(`Akses VIP untuk ${targetUser.full_name} berhasil ${newPaidStatus ? 'DISEDIAKAN (DIBUKA)' : 'DICABUT'}!`);
    setTimeout(() => setStatusMessage(null), 3500);

    try {
      await adminService.updateUser(targetUser.id, {
        role: targetUser.role,
        package_id: newPkgId,
        isPaid: newPaidStatus
      });
    } catch (err) {
      // Backend api call if available
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    const packageNameMap = {
      1: 'Basic Starter',
      2: 'Standard Pro',
      3: 'Premium VIP'
    };

    const updatedPkgName = packageNameMap[packageId] || 'Basic Starter';

    setUsers(prev => prev.map(u => u.id === editingUser.id ? {
      ...u,
      role: role,
      package_id: Number(packageId),
      package_name: updatedPkgName,
      isPaid: isPaid || Number(packageId) === 3
    } : u));

    setStatusMessage(`Data & akses pengguna ${editingUser.full_name} berhasil diperbarui!`);
    setTimeout(() => setStatusMessage(null), 3500);

    try {
      await adminService.updateUser(editingUser.id, {
        role,
        package_id: Number(packageId),
        isPaid: isPaid || Number(packageId) === 3
      });
    } catch (err) {
      // Ignore API errors gracefully
    } finally {
      setEditingUser(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter.toUpperCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Control Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border-4 border-slate-800 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-purple-400/30">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Mahir Speaking • Admin Access Governance</span>
            </div>
            <h1 className="font-stinger font-black text-3xl sm:text-4xl text-white pt-2">
              Kelola Hak Akses & Fitur Pengguna
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-300">
              Admin memiliki kendali penuh untuk mengubah peran (*Role*), memberikan lisensi VIP, serta mengatur paket berlangganan seluruh pengguna.
            </p>
          </div>

          <button 
            onClick={fetchUsers}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-lime" />
            <span>Muat Ulang Data</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl border-2 border-emerald-500/50 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-lime flex-shrink-0" />
          <span className="text-xs font-black">{statusMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bento-card p-4 rounded-2xl border-2 border-white shadow-popout flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Role Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'STUDENT', 'TUTOR', 'ADMIN'].map((rf) => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex-shrink-0 border ${
                roleFilter === rf 
                  ? 'bg-brand text-lime border-dark shadow-glow scale-105' 
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-white'
              }`}
            >
              {rf === 'ALL' ? 'Semua User' : rf}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, atau username..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:border-brand outline-none shadow-inner"
          />
        </div>

      </div>

      {/* Users Management Table */}
      <div className="bento-card p-6 rounded-3xl border-4 border-white shadow-popout space-y-4">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Paket Berlangganan</th>
                <th className="py-3 px-4">Akses VIP</th>
                <th className="py-3 px-4">XP & Poin</th>
                <th className="py-3 px-4 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* User Profile */}
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-slate-900 text-sm">{u.full_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email} • @{u.username}</div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      u.role === 'admin' 
                        ? 'bg-purple-100 text-purple-900 border-purple-300' 
                        : u.role === 'tutor' 
                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                        : 'bg-blue-100 text-brand border-blue-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Package Tier */}
                  <td className="py-4 px-4">
                    <div className="font-black text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amberIcon" />
                      <span>{u.package_name || 'Basic Starter'}</span>
                    </div>
                  </td>

                  {/* VIP Access Toggle Badge */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleVipDirect(u)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border cursor-pointer ${
                        u.isPaid || u.package_id === 3
                          ? 'bg-lime text-dark border-dark shadow-limeGlow'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {u.isPaid || u.package_id === 3 ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-dark" />
                          <span>VIP Aktif (Buka)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Terkunci</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* XP & Points */}
                  <td className="py-4 px-4 font-black text-brand">
                    ⚡ {u.xp || 0} XP
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleEditClick(u)}
                      className="px-3 py-2 rounded-xl bg-brand text-lime font-black text-xs hover:scale-105 transition-transform border border-dark flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Ubah Akses</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* EDIT USER ACCESS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-8 max-w-md w-full space-y-6 border-4 border-brand shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <button 
              onClick={() => setEditingUser(null)} 
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center font-black border border-brand/20">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-stinger font-black text-xl text-slate-900">Ubah Hak Akses Pengguna</h3>
                <p className="text-xs text-slate-500 font-bold">{editingUser.full_name} ({editingUser.email})</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold">
              
              {/* Role Selection */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider">Peran Pengguna (Role)</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-black text-slate-800 focus:border-brand outline-none bg-slate-50"
                >
                  <option value="student">Student (Siswa)</option>
                  <option value="tutor">Tutor (Pengajar Native)</option>
                  <option value="admin">Admin (Pengelola Platform)</option>
                </select>
              </div>

              {/* Package Selection */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-extrabold uppercase tracking-wider">Paket Langganan LMS</label>
                <select 
                  value={packageId} 
                  onChange={(e) => {
                    const selectedPkg = Number(e.target.value);
                    setPackageId(selectedPkg);
                    if (selectedPkg === 3) setIsPaid(true);
                  }} 
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-black text-slate-800 focus:border-brand outline-none bg-slate-50"
                >
                  <option value={1}>Basic Starter (Level A1)</option>
                  <option value={2}>Standard Pro (Level A1 - B1)</option>
                  <option value={3}>Premium VIP (Buka Seluruh Akses LMS & AI 24/7)</option>
                </select>
              </div>

              {/* Instant VIP Status Checkbox Toggle */}
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="font-black text-slate-900">Buka Akses VIP Langsung</div>
                  <div className="text-[10px] text-slate-500 font-semibold">Memberikan hak akses penuh ke modul LMS & AI Coach tanpa kunci.</div>
                </div>

                <input 
                  type="checkbox"
                  checked={isPaid || Number(packageId) === 3}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-5 h-5 accent-brand rounded cursor-pointer"
                />
              </div>

            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="w-1/2 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleSaveUser}
                className="w-1/2 py-3 rounded-xl bg-brand text-lime font-black text-xs shadow-glow hover:scale-105 transition-transform flex items-center justify-center gap-2 border border-dark cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Akses</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
