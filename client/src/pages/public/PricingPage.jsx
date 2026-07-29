import React, { useState } from 'react';
import { CheckCircle, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PricingPage() {
  const { setActiveTab, user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full uppercase">
          <Sparkles className="w-4 h-4 text-amberIcon" /> Flexible Subscription Plans
        </div>
        <h1 className="font-stinger text-4xl sm:text-5xl font-black text-brand">
          Invest in Your English Fluency
        </h1>
        <p className="text-slate-700 text-base sm:text-lg">
          No hidden fees. Cancel or upgrade your plan anytime with a 7-day money-back guarantee.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center bg-white p-1.5 rounded-full border border-slate-200 shadow-sm mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              billingCycle === 'monthly' ? 'bg-brand text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Monthly Plan
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-brand text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            <span>Annual Billing</span>
            <span className="bg-electric text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded">SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Basic */}
        <div className="glass-panel p-8 rounded-3xl border border-white flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Basic</span>
            <h3 className="font-stinger font-black text-2xl text-slate-900">Starter Plan</h3>
            <p className="text-xs text-slate-600">Ideal for self-paced beginners building daily habits.</p>
            <div className="pt-2">
              <span className="font-stinger text-4xl font-black text-brand">
                {billingCycle === 'yearly' ? 'Rp 79.000' : 'Rp 99.000'}
              </span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-200">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> A1 Everyday Speaking Course</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> 10 Daily AI Chat Messages</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Community XP Leaderboard</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Web Speech Pronunciation Drill</li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab(user ? 'my-package' : 'register')}
            className="w-full py-3.5 rounded-xl font-bold bg-slate-200 text-slate-800 hover:bg-brand hover:text-white transition-all text-sm"
          >
            Get Started Free
          </button>
        </div>

        {/* Standard */}
        <div className="glass-panel p-8 rounded-3xl border-2 border-brand flex flex-col justify-between space-y-6 bg-white shadow-glow relative">
          <span className="absolute -top-4 right-8 bg-amberIcon text-slate-900 font-black text-xs px-4 py-1 rounded-full">POPULAR</span>
          <div className="space-y-4">
            <span className="bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full uppercase">Standard</span>
            <h3 className="font-stinger font-black text-2xl text-brand">Pro Speaker Plan</h3>
            <p className="text-xs text-slate-600">Recommended for career & business English learners.</p>
            <div className="pt-2">
              <span className="font-stinger text-4xl font-black text-brand">
                {billingCycle === 'yearly' ? 'Rp 159.000' : 'Rp 199.000'}
              </span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-200 font-medium">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> All Foundation & Business Courses</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> 50 Daily AI Chat Messages</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> 2 Live 1-on-1 Native Tutor Sessions/mo</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Verified Completion Certificate</li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab(user ? 'my-package' : 'register')}
            className="w-full py-3.5 rounded-xl font-black bg-brand text-electric hover:bg-brand-600 transition-all text-sm shadow-glow"
          >
            Upgrade to Standard
          </button>
        </div>

        {/* Premium */}
        <div className="glass-panel p-8 rounded-3xl border border-white flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Premium</span>
            <h3 className="font-stinger font-black text-2xl text-purple-900">VIP Master Plan</h3>
            <p className="text-xs text-slate-600">Unrestricted access for serious IELTS/TOEFL candidates.</p>
            <div className="pt-2">
              <span className="font-stinger text-4xl font-black text-purple-900">
                {billingCycle === 'yearly' ? 'Rp 279.000' : 'Rp 349.000'}
              </span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-200">
              <li className="flex items-center gap-2 font-bold text-amber-800"><CheckCircle className="w-4 h-4 text-amberIcon" /> UNLIMITED 24/7 AI Chat Assistant</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> 8 Live Native Tutor Sessions/mo</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> IELTS/TOEFL Speaking Mock Tests</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> VIP Gold Badge on Leaderboard</li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab(user ? 'my-package' : 'register')}
            className="w-full py-3.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-purple-900 transition-all text-sm"
          >
            Get VIP Master
          </button>
        </div>

      </div>

    </div>
  );
}
