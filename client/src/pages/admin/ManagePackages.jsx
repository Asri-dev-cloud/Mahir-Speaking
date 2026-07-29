import React, { useState, useEffect } from 'react';
import { packageService, adminService } from '../../services/api';
import { Shield, CheckCircle, Save, Edit3 } from 'lucide-react';

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [editingPkg, setEditingPkg] = useState(null);
  const [price, setPrice] = useState(0);
  const [aiLimit, setAiLimit] = useState(10);
  const [badge, setBadge] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = () => {
    packageService.getPackages()
      .then(data => {
        if (data.success) setPackages(data.packages);
      })
      .catch(() => {});
  };

  const handleEdit = (pkg) => {
    setEditingPkg(pkg);
    setPrice(pkg.price);
    setAiLimit(pkg.ai_daily_limit);
    setBadge(pkg.badge || '');
  };

  const handleSave = async () => {
    if (!editingPkg) return;
    try {
      const data = await adminService.updatePackage(editingPkg.id, {
        name: editingPkg.name,
        price: Number(price),
        ai_daily_limit: Number(aiLimit),
        tutor_sessions: editingPkg.tutor_sessions,
        badge
      });
      if (data.success) {
        setEditingPkg(null);
        fetchPackages();
      }
    } catch (err) {
      alert(err.message || 'Failed to update package');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-6">
        <div>
          <h1 className="font-stinger font-black text-3xl text-brand">Subscription Package Configuration</h1>
          <p className="text-xs text-slate-600">Configure pricing, daily AI limits, and package badges.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="bg-brand/10 text-brand text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                  {pkg.badge || pkg.name}
                </span>
                <button
                  onClick={() => handleEdit(pkg)}
                  className="p-1.5 rounded bg-slate-100 hover:bg-brand hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-stinger font-black text-xl text-slate-900">{pkg.name} Package</h3>
              
              <div className="font-stinger text-3xl font-black text-brand">
                Rp {pkg.price.toLocaleString('id-ID')}
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t">
                <div>AI Chat Daily Limit: <strong>{pkg.ai_daily_limit === -1 ? 'Unlimited' : `${pkg.ai_daily_limit} / day`}</strong></div>
                <div>Live Tutor Sessions: <strong>{pkg.tutor_sessions} / month</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white max-w-sm w-full bg-white space-y-4 shadow-2xl">
            <h3 className="font-stinger font-bold text-lg text-slate-900">Edit {editingPkg.name} Package</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Price (IDR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">AI Daily Limit (-1 for Unlimited)</label>
                <input
                  type="number"
                  value={aiLimit}
                  onChange={(e) => setAiLimit(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge Title</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingPkg(null)}
                className="w-1/2 py-2 rounded-xl bg-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-1/2 py-2 rounded-xl bg-brand text-electric font-bold text-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
