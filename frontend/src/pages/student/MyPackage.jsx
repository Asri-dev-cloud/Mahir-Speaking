import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { packageService } from '../../services/api';
import { Sparkles, CheckCircle, CreditCard, History, Shield, Zap, ArrowRight, X } from 'lucide-react';

export default function MyPackage() {
  const { user, updateUserProfile, setActiveTab } = useAuth();
  const [packages, setPackages] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    packageService.getPackages()
      .then(data => {
        if (data.success) setPackages(data.packages);
      })
      .catch(() => {});

    packageService.getPurchaseHistory()
      .then(data => {
        if (data.success) setHistory(data.history);
      })
      .catch(() => {});
  }, []);

  const handleOpenCheckout = (pkg) => {
    setSelectedPkg(pkg);
    setShowCheckoutModal(true);
  };

  const handleCompletePayment = async () => {
    if (!selectedPkg) return;
    setLoading(true);
    try {
      const data = await packageService.purchasePackage({
        package_id: selectedPkg.id,
        payment_method: paymentMethod
      });
      if (data.success) {
        updateUserProfile({
          package_id: selectedPkg.id,
          package_name: selectedPkg.name,
          ai_daily_limit: selectedPkg.ai_daily_limit
        });
        setShowCheckoutModal(false);
        alert(`🎉 Success! Upgraded to ${selectedPkg.name} Package!`);
        // Refresh history
        packageService.getPurchaseHistory().then(d => d.success && setHistory(d.history));
      }
    } catch (err) {
      alert(err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Active Package Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-glass bg-gradient-to-r from-brand to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="bg-amberIcon text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">
            Active Package Status
          </span>
          <h1 className="font-stinger text-3xl sm:text-4xl font-black text-white">
            {user?.package_name || 'Standard Pro'} Package
          </h1>
          <p className="text-xs text-slate-300">
            Daily AI Chat Limit: <strong className="text-electric">{user?.ai_daily_limit === -1 ? 'UNLIMITED 24/7' : `${user?.ai_daily_limit || 50} messages / day`}</strong>
          </p>
        </div>

        <button
          onClick={() => setSelectedPkg(packages[2] || packages[0])}
          className="px-6 py-3 rounded-xl bg-electric text-slate-950 font-black text-xs shadow-goldGlow hover:scale-105 transition-all self-start md:self-auto"
        >
          Upgrade Package
        </button>
      </div>

      {/* Package Selection Cards */}
      <div className="space-y-4">
        <h2 className="font-stinger font-extrabold text-2xl text-brand">Available Subscription Packages</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isCurrent = user?.package_id === pkg.id;
            return (
              <div 
                key={pkg.id}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-6 transition-all ${
                  isCurrent ? 'border-2 border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-white hover:border-brand'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {pkg.badge || pkg.name}
                    </span>
                    {isCurrent && <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">CURRENT PLAN</span>}
                  </div>

                  <h3 className="font-stinger font-black text-xl text-slate-900">{pkg.name} Package</h3>
                  
                  <div className="pt-1">
                    <span className="font-stinger text-3xl font-black text-brand">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-slate-500"> / {pkg.period}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-200">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isCurrent}
                  onClick={() => handleOpenCheckout(pkg)}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-brand text-electric hover:bg-brand-600 shadow-glow'
                  }`}
                >
                  {isCurrent ? 'Current Active Package' : `Upgrade to ${pkg.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase History */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brand" />
          <h2 className="font-stinger font-extrabold text-xl text-brand">Purchase & Payment History</h2>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No previous transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Package</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {history.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-3 px-3 text-slate-600">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{tx.package_name}</td>
                    <td className="py-3 px-3 font-bold text-brand">Rp {tx.amount.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3">{tx.payment_method}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        SUCCESS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPkg && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white max-w-md w-full bg-white space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-brand">Checkout Order</span>
              <h3 className="font-stinger font-black text-2xl text-slate-900">Confirm Subscription</h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Selected Package:</span>
                <span>{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Daily AI Limit:</span>
                <span>{selectedPkg.ai_daily_limit === -1 ? 'Unlimited' : `${selectedPkg.ai_daily_limit} msgs`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Billing Period:</span>
                <span>1 Month</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-black text-sm text-brand">
                <span>Total Amount:</span>
                <span>Rp {selectedPkg.price.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['QRIS', 'Credit Card', 'Bank Transfer'].map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === pm ? 'border-brand bg-brand/10 text-brand' : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCompletePayment}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand text-electric font-black text-sm shadow-glow hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing Payment...' : `Pay Rp ${selectedPkg.price.toLocaleString('id-ID')}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
