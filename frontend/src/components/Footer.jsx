import React from 'react';
import { Shield, Sparkles, ExternalLink, Network, FileCode, CheckCircle2 } from 'lucide-react';

export default function Footer({ setCurrentTab }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 text-sm">
      {/* Tricolor Accent */}
      <div className="tricolor-border w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Portal Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                <Network className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">SEVAPORTAL AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transforming Information into Intelligent Solutions. Next-generation public service discovery powered by Web Ontology Language (OWL), RDFLib, and Horn Clause Semantic Reasoning.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>572 Verified RDF Triples in Graph</span>
            </div>
          </div>

          {/* Column 2: System Modules */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Portal Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('search')} className="hover:text-blue-400 transition">
                  Module 2: Semantic Search
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('graph')} className="hover:text-blue-400 transition">
                  Module 3: Ontology Knowledge Graph
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('reasoning')} className="hover:text-blue-400 transition">
                  Module 4: Semantic Reasoning Engine
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('departments')} className="hover:text-blue-400 transition">
                  Module 5: Department Explorer
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('chat')} className="hover:text-blue-400 transition">
                  Module 6: AI Chat Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('analytics')} className="hover:text-blue-400 transition">
                  Module 7: Analytics & Audit Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Semantic Technologies */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Semantic Standards</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>W3C RDF (Resource Description Framework)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>OWL 2 (Web Ontology Language)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>SPARQL 1.1 Query Protocol</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Python RDFLib Graph Engine</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Horn Clause Semantic Rule Reasoner</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Departments */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Key Authorities</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>UIDAI (Aadhaar Services)</li>
              <li>CBDT (PAN & Income Tax)</li>
              <li>Passport Seva (MEA)</li>
              <li>MoRTH (Parivahan / Driving Licence)</li>
              <li>Election Commission of India (ECI)</li>
              <li>State Revenue & e-District Portals</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © 2026 National Semantic Government Services Portal. Built for Academic Demonstration & Knowledge to Intelligence Technical Presentation.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-medium">Concept: Transforming Information into Intelligent Solutions</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">v2.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
