import React, { useState } from 'react';
import { 
  Search, Sparkles, Fingerprint, CreditCard, Globe, 
  Car, Vote, Users, FileText, Baby, ArrowRight, ShieldCheck, 
  BrainCircuit, Network, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

export default function HomePage({ onSearch, setCurrentTab }) {
  const [queryInput, setQueryInput] = useState('');

  const popularCategories = [
    { id: 'Aadhaar', name: 'Aadhaar Services', dept: 'UIDAI', icon: Fingerprint, color: 'blue', query: 'How can I change my house location in Aadhaar?' },
    { id: 'PAN', name: 'PAN Card Services', dept: 'Income Tax', icon: CreditCard, color: 'amber', query: 'How do I get a PAN card?' },
    { id: 'Passport', name: 'Passport Services', dept: 'Passport Seva', icon: Globe, color: 'indigo', query: 'Apply for fresh passport online' },
    { id: 'Driving', name: 'Driving Licence', dept: 'Transport / Parivahan', icon: Car, color: 'emerald', query: 'Where can I renew my driving licence?' },
    { id: 'Voter', name: 'Voter ID (EPIC)', dept: 'Election Commission', icon: Vote, color: 'purple', query: 'New voter ID registration Form 6' },
    { id: 'Ration', name: 'Ration Card', dept: 'Food & Civil Supplies', icon: Users, color: 'rose', query: 'Apply for family ration card under NFSA' },
    { id: 'Income', name: 'Income Certificate', dept: 'Revenue / e-District', icon: FileText, color: 'cyan', query: 'How to get income certificate for college scholarship?' },
    { id: 'Caste', name: 'Community Certificate', dept: 'Revenue / e-District', icon: Baby, color: 'orange', query: 'How can I apply for a caste certificate?' },
  ];

  const sampleQuestions = [
    "How can I change my house location in Aadhaar?",
    "Where can I renew my driving licence?",
    "I lost my identity card.",
    "How do I get a PAN card?",
    "How can I apply for a caste certificate?",
    "I want to transfer my car RC ownership"
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSearch(queryInput.trim());
      setCurrentTab('search');
    }
  };

  const handleQuickClick = (q) => {
    setQueryInput(q);
    onSearch(q);
    setCurrentTab('search');
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white shadow-xl border border-blue-800/40">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-800/60 border border-blue-700/60 text-xs font-semibold text-blue-200 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Transforming Information into Intelligent Solutions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* Main Titles as required by specification */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">Intelligent Government Services</span>
          </h1>

          <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Find the right government service using intelligent semantic search.
          </p>

          {/* Flagship Search Input Box */}
          <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border-2 border-amber-400/80 focus-within:ring-4 focus-within:ring-blue-400/30 transition-all">
              <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask anything about government services..."
                className="w-full px-4 py-3.5 text-base sm:text-lg text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
              >
                <span>Semantic Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Example Query Pills */}
          <div className="pt-2 text-xs">
            <span className="text-blue-300 mr-2 font-medium">Try asking in everyday words:</span>
            <div className="inline-flex flex-wrap justify-center gap-2 mt-2">
              {sampleQuestions.slice(0, 4).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickClick(q)}
                  className="px-3 py-1.5 rounded-lg bg-blue-800/70 hover:bg-blue-700 text-blue-100 border border-blue-700/60 hover:text-white transition text-xs font-medium text-left"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Banner Stats */}
        <div className="border-t border-blue-800/60 bg-blue-950/70 py-4 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">17+</div>
              <div className="text-xs text-blue-200">Cataloged Services</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">572</div>
              <div className="text-xs text-blue-200">OWL/RDF Triples</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">94.6%</div>
              <div className="text-xs text-blue-200">Semantic Accuracy</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-300">Horn Clause</div>
              <div className="text-xs text-blue-200">Rule-Based Reasoner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Service Categories Section (Required by Module 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Service Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select any domain to trigger automated semantic reasoning and discover required documentation
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('services')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All 17 Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleQuickClick(cat.query)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-700 group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Authority: {cat.dept}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Demonstration Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg border border-blue-700/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Flagship Demonstration Scenario
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                "How can I change my house location in Aadhaar?"
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Traditional keyword search fails here because <em>"house"</em> and <em>"location"</em> do not exist in the official service title <strong>"Aadhaar Address Update"</strong>.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleQuickClick("How can I change my house location in Aadhaar?")}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow transition flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Demonstration Scenario</span>
                </button>
                <button
                  onClick={() => setCurrentTab('reasoning')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition"
                >
                  Inspect Reasoning Rules
                </button>
              </div>
            </div>

            {/* Visual Pathway Graphic */}
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-blue-500/30 font-mono text-xs space-y-3">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                Ontology Reasoning Pipeline:
              </div>
              <div className="p-2.5 rounded bg-blue-950/80 border border-blue-700/50 text-blue-200">
                1. Input: <span className="text-amber-300">"house location in Aadhaar"</span>
              </div>
              <div className="p-2.5 rounded bg-indigo-950/80 border border-indigo-700/50 text-indigo-200">
                2. Synonym Mapping: <span className="text-purple-300">concept:ResidentialAddress</span>
              </div>
              <div className="p-2.5 rounded bg-purple-950/80 border border-purple-700/50 text-purple-200">
                3. Rule Evaluated: <span className="text-emerald-300">RULE_001_AADHAAR_ADDRESS_UPDATE</span>
              </div>
              <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-200 font-bold">
                4. Resolution: <span className="text-white">srv:AadhaarAddressUpdate (UIDAI)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Navigation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Core System Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Knowledge Graph */}
          <div 
            onClick={() => setCurrentTab('graph')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition">
              Ontology Knowledge Graph
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Interactive visual graph with physics rendering connecting Government Services, Departments, Documents, and Semantic Concepts with live SPARQL console.
            </p>
          </div>

          {/* Card 2: Semantic Reasoning */}
          <div 
            onClick={() => setCurrentTab('reasoning')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition">
              Rule-Based Reasoning Engine
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Trace Horn Clause evaluations and semantic inferences. Inspect how everyday natural language maps into verified statutory public services.
            </p>
          </div>

          {/* Card 3: AI Chatbot */}
          <div 
            onClick={() => setCurrentTab('chat')}
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition">
              AI Conversational Assistant
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Multi-turn conversational assistant with intelligent disambiguation. Ask vague queries like "I lost my identity card" and receive structured guidance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
