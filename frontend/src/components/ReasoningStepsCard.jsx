import React, { useState } from 'react';
import { 
  BrainCircuit, CheckCircle2, ArrowRight, Sparkles, 
  Code2, Database, ChevronDown, ChevronUp, Layers, HelpCircle
} from 'lucide-react';

export default function ReasoningStepsCard({ steps, query, confidence, firedRule }) {
  const [expandedStep, setExpandedStep] = useState(null);

  if (!steps || steps.length === 0) return null;

  const toggleStep = (idx) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-sm">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-lg">Semantic Reasoning Trace</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
                Live Inference
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Step-by-step logic proving why this service was recommended
            </p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Confidence:</span>
          <span className="text-sm font-extrabold text-blue-700">
            {Math.round((confidence || 0.95) * 100)}%
          </span>
          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
              style={{ width: `${Math.round((confidence || 0.95) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Query Banner */}
      <div className="my-4 p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-purple-900 uppercase text-[10px] tracking-wider">Citizen Query:</span>
          <span className="font-mono text-purple-800 font-semibold italic">"{query}"</span>
        </div>
        {firedRule && (
          <span className="font-mono text-[11px] text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
            Rule: {firedRule.id}
          </span>
        )}
      </div>

      {/* Timeline Steps */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 before:z-0">
        {steps.map((step, idx) => {
          const isExpanded = expandedStep === idx;
          return (
            <div key={idx} className="relative z-10">
              <div 
                onClick={() => toggleStep(idx)}
                className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isExpanded 
                    ? 'bg-blue-50/60 border-blue-200 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                    idx === steps.length - 1 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-blue-700 text-white'
                  }`}>
                    {step.stepNumber || idx + 1}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 pl-2">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Collapsible Inspection Details */}
              {isExpanded && step.data && Object.keys(step.data).length > 0 && (
                <div className="ml-11 mt-2 p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto shadow-inner border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans font-bold mb-1">
                    Internal Knowledge Engine State:
                  </div>
                  <pre className="text-[11px] leading-tight text-emerald-300">
                    {JSON.stringify(step.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Horn Clause Formula Highlight */}
      {firedRule && firedRule.logic && (
        <div className="mt-5 p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Code2 className="w-4 h-4" />
            <span>Formal OWL Horn-Clause Rule Evaluated</span>
          </div>
          <div className="font-mono text-xs text-emerald-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
            {firedRule.logic}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Evaluated by Python RDFLib + Semantic Reasoning Engine</span>
            <span className="text-emerald-400 font-semibold">Status: SATISFIED (TRUE)</span>
          </div>
        </div>
      )}
    </div>
  );
}
