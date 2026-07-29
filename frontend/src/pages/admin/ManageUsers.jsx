import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Search, UserCheck, Shield, Edit2, Save, X } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [role, setRole] = useState('student');
  const [packageId, setPackageId] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    adminService.getUsers()
      .then(data => {
        if (data.success) setUsers(data.users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setRole(user.role);
    setPackageId(user.package_id || 1);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const data = await adminService.updateUser(editingUser.id, {
        role,
        package_id: Number(packageId)
      });
      if (data.success) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-stinger font-black text-3xl text-brand">User Governance</h1>
            <p className="text-xs text-slate-600">Search users, modify roles, and upgrade subscription tiers.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or username..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-brand outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Active Package</th>
                <th className="py-2.5 px-3">XP</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{u.full_name}</div>
                    <div className="text-[10px] text-slate-400">{u.email} • @{u.username}</div>
                  </td>
                  <td className="py-3 px-3 uppercase font-bold text-[10px]">
                    <span className={`px-2 py-0.5 rounded ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-900' : u.role === 'tutor' ? 'bg-amber-100 text-amber-900' : 'bg-brand/10 text-brand'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{u.package_name || 'Basic'}</td>
                  <td className="py-3 px-3 font-bold text-brand">⚡ {u.xp || 0}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleEditClick(u)}
                      className="p-1.5 rounded-lg bg-brand/10 text-brand hover:bg-brand hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white max-w-sm w-full bg-white space-y-4 shadow-2xl relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-stinger font-bold text-lg text-slate-900">Edit {editingUser.full_name}</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">User Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded-xl">
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Package Tier</label>
                <select value={packageId} onChange={(e) => setPackageId(e.target.value)} className="w-full p-2 border rounded-xl">
                  <option value={1}>Basic Package</option>
                  <option value={2}>Standard Package</option>
                  <option value={3}>Premium Package</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveUser}
              className="w-full py-2.5 rounded-xl bg-brand text-electric font-bold text-xs shadow-glow hover:bg-brand-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
