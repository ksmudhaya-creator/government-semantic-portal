import React, { useState } from 'react';
import { 
  Search, Network, BrainCircuit, Building2, FileText, 
  BotMessageSquare, BarChart3, Home, Menu, X, ShieldCheck, 
  LogIn, UserCheck, Sparkles, Info
} from 'lucide-react';

export default function Header({ currentTab, setCurrentTab, fontSize, setFontSize }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Semantic Search', icon: Search, badge: 'AI Core' },
    { id: 'graph', label: 'Ontology Graph', icon: Network },
    { id: 'reasoning', label: 'Reasoning Engine', icon: BrainCircuit },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'chat', label: 'AI Assistant', icon: BotMessageSquare, badge: 'Live' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Tricolor Stripe */}
      <div className="tricolor-border w-full"></div>

      {/* Top Government Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            {/* National Emblem SVG */}
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-amber-400 tracking-wide">भारत सरकार</span>
              <span className="text-slate-500">|</span>
              <span className="font-medium text-slate-300">Government of India</span>
            </div>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400">Department of Administrative Reforms & Public Grievances</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Font Resizing Controls */}
            <div className="flex items-center space-x-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-slate-400 mr-1 text-[11px]">Font:</span>
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                className="px-1 hover:text-white font-medium"
                title="Decrease font size"
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize(16)}
                className="px-1 hover:text-white font-medium"
                title="Reset font size"
              >
                A
              </button>
              <button 
                onClick={() => setFontSize(prev => Math.min(18, prev + 1))}
                className="px-1 hover:text-white font-medium"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <span className="hidden sm:inline-flex items-center text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              OWL-DL RDF Verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md border border-blue-700/30 group-hover:scale-105 transition-transform">
            <Network className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                SEVAPORTAL
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-200">
                Semantic AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ontology-Based Intelligent Public Service Portal
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-800 shadow-sm border border-blue-200/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA: Citizen Login Modal Button */}
        <div className="hidden sm:flex items-center space-x-3">
          <button 
            onClick={() => setLoginModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            <span>Citizen Login</span>
          </button>
          
          <button
            onClick={() => setCurrentTab('search')}
            className="flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm hover:shadow transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask Portal</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-200 flex space-x-2">
            <button 
              onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}
              className="w-1/2 text-xs py-2 border border-slate-300 rounded font-semibold text-slate-700"
            >
              Citizen Login
            </button>
            <button 
              onClick={() => { setCurrentTab('search'); setMobileMenuOpen(false); }}
              className="w-1/2 text-xs py-2 bg-blue-700 text-white rounded font-semibold"
            >
              Semantic Search
            </button>
          </div>
        </div>
      )}

      {/* Simulated Citizen Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-lg">National Single Sign-On (MeriPehchaan)</h3>
              </div>
              <button onClick={() => setLoginModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-4">
              <p className="text-xs text-slate-600">
                Demo SSO authentication gateway. Authenticate using Aadhaar OTP, DigiLocker, or Jan Parichay credentials.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar / Mobile / Virtual ID</label>
                <input 
                  type="text" 
                  defaultValue="XXXX-XXXX-4921" 
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-800">
                <strong>Simulated Citizen Session:</strong> Connected to RDF User Profile with privileges to file applications and access verified documents.
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setLoginModalOpen(false)} 
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow"
              >
                Sign In With OTP (Demo)
              </button>
              <button 
                onClick={() => setLoginModalOpen(false)} 
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
