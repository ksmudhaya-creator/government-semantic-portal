import React, { useState } from 'react';
import { 
  ExternalLink, FileCheck, Clock, CreditCard, Building2, 
  ChevronDown, ChevronUp, Network, CheckCircle, ShieldCheck, Share2
} from 'lucide-react';

export default function ServiceCard({ service, onExploreGraph, highlighted = false }) {
  const [showProcedure, setShowProcedure] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!service) return null;

  const handleCopyLink = () => {
    if (service.officialUrl) {
      navigator.clipboard.writeText(service.officialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
      highlighted 
        ? 'border-blue-500 ring-2 ring-blue-500/20' 
        : 'border-slate-200'
    }`}>
      {/* Top Header */}
      <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 via-white to-blue-50/20">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              {service.code || 'GOV-SRV'}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {service.category || 'Public Service'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Service
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {service.name}
        </h3>

        <div className="flex items-center space-x-2 mt-1 text-xs text-slate-600 font-medium">
          <Building2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
          <span>{service.department}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 pt-4 space-y-4">
        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {service.description}
        </p>

        {/* Quick Meta Stats: Fee, Processing Time */}
        <div className="grid grid-cols-2 gap-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Statutory Fee</span>
              <span className="font-semibold text-slate-800">{service.serviceFee || 'Free / Subsidized'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard SLA</span>
              <span className="font-semibold text-slate-800">{service.processingTime || '5-10 Days'}</span>
            </div>
          </div>
        </div>

        {/* Required Documents Section */}
        {service.documents && service.documents.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center">
              <FileCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Required Supporting Documents ({service.documents.length})
            </h4>
            <div className="space-y-1.5">
              {service.documents.map((doc, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                  <span className="font-semibold text-emerald-900 block">{doc.name}</span>
                  {doc.description && (
                    <span className="text-emerald-700/80 text-[11px] leading-tight block mt-0.5">
                      {doc.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible Application Procedure */}
        {service.procedure && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowProcedure(!showProcedure)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition text-left"
            >
              <span>Application Procedure & Steps</span>
              {showProcedure ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showProcedure && (
              <div className="p-3.5 text-xs text-slate-700 bg-white border-t border-slate-200 leading-relaxed space-y-2">
                <div className="bg-blue-50/50 p-2.5 rounded text-blue-900 font-mono text-[11px]">
                  {service.procedure}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          {service.officialUrl && (
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {onExploreGraph && (
            <button
              onClick={() => onExploreGraph(service.id)}
              className="inline-flex items-center space-x-1.5 px-3 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition"
              title="Inspect in Ontology Graph"
            >
              <Network className="w-3.5 h-3.5 text-blue-600" />
              <span>Explore Graph</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className="p-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
            title="Share or Copy Link"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
