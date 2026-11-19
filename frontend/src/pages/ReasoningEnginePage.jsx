import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, ArrowRight, CheckCircle2, Sparkles, 
  Code2, Play, GitBranch, ShieldCheck, RefreshCw, Cpu
} from 'lucide-react';
import { searchSemantic } from '../services/api';
import ServiceCard from '../components/ServiceCard';

export default function ReasoningEnginePage({ onExploreGraph }) {
  const [testQuery, setTestQuery] = useState("change my home location in Aadhaar");
  const [loading, setLoading] = useState(false);
  const [reasoningData, setReasoningData] = useState(null);

  const testCases = [
    {
      title: "Case 1: Aadhaar Home Location (The Target Scenario)",
      query: "change my home location in Aadhaar",
      expectedConcept: "ResidentialAddress",
      expectedService: "Aadhaar Address Update"
    },
    {
      title: "Case 2: Driving Licence Expiry Renewal",
      query: "my driving licence has expired how do i renew",
      expectedConcept: "DrivingLicence",
      expectedService: "Driving Licence Renewal"
    },
    {
      title: "Case 3: First Time Taxpayer Identity",
      query: "i want to apply for form 49a new pan card",
      expectedConcept: "TaxIdentification",
      expectedService: "PAN Card New Application"
    },
    {
      title: "Case 4: Constituency Address Shifting for Voting",
      query: "shift my residence address in voter id card",
      expectedConcept: "ResidentialAddress + ElectoralRegistration",
      expectedService: "Voter ID Address Change"
    },
    {
      title: "Case 5: Community Proof for Reservation",
      query: "how to get jaati praman patra caste certificate",
      expectedConcept: "CasteClassification",
      expectedService: "Community and Caste Certificate"
    }
  ];

  const runReasoner = async (queryToRun) => {
    const q = queryToRun || testQuery;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await searchSemantic(q.trim());
      setReasoningData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runReasoner(testQuery);
  }, []);

  const handleSelectCase = (test) => {
    setTestQuery(test.query);
    runReasoner(test.query);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
              Module 4
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Semantic Reasoning Engine
            </h1>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center">
            <Cpu className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Horn Clause Logic Active
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Visual demonstration of knowledge representation, axiom evaluation, and step-by-step semantic deduction.
        </p>

        {/* Interactive Query Runner */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Type query to trace Horn Clause execution..."
            className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => runReasoner(testQuery)}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Execute Reasoning</span>
          </button>
        </div>

        {/* Test Case Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Select Automated Reasoning Benchmark:
          </span>
          <div className="flex flex-wrap gap-2">
            {testCases.map((tc, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectCase(tc)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                  testQuery === tc.query 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tc.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Rule Flow Diagram (As required by Module 4 specification) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-blue-900 shadow-xl space-y-6">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <GitBranch className="w-4 h-4" />
          <span>Semantic Deduction Flowchart</span>
        </div>

        {/* 3-Column Visual Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Box 1: Citizen Expression */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-300 block">IF (Citizen Query)</span>
            <div className="font-mono text-xs text-amber-300 font-semibold bg-black/30 p-2.5 rounded-lg border border-white/5">
              "{testQuery}"
            </div>
            <p className="text-[11px] text-slate-300">
              User expresses everyday intent using colloquial vocabulary.
            </p>
          </div>

          {/* Box 2: Ontology Concept Mapping */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2">
            <span className="text-[10px] uppercase font-bold text-purple-300 block">AND (Ontology Axioms)</span>
            <div className="font-mono text-xs text-purple-300 font-semibold bg-black/30 p-2.5 rounded-lg border border-white/5">
              {reasoningData?.matchedConcepts?.[0]?.matchedSynonym || 'home location'} ⊑ {reasoningData?.matchedConcepts?.[0]?.canonicalUri || 'concept:ResidentialAddress'}
            </div>
            <p className="text-[11px] text-slate-300">
              Resolves synonym through Web Ontology Language (OWL) equivalence rules.
            </p>
          </div>

          {/* Box 3: Target Inference */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">THEN (Inferred Service)</span>
            <div className="font-mono text-xs text-emerald-300 font-bold bg-black/30 p-2.5 rounded-lg border border-white/5 truncate">
              {reasoningData?.recommendedService?.name || 'Aadhaar Address Update'}
            </div>
            <p className="text-[11px] text-slate-300">
              Department: {reasoningData?.recommendedService?.department || 'UIDAI'}
            </p>
          </div>
        </div>

        {/* Fired Rule Card */}
        {reasoningData?.firedRule && (
          <div className="p-4 bg-black/40 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-300">Horn Clause Rule Executed:</span>
              <span className="font-mono text-amber-400 font-bold">{reasoningData.firedRule.id}</span>
            </div>
            <div className="font-mono text-xs text-emerald-400 bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
              {reasoningData.firedRule.rule_logic}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Reasoning Trace & Recommended Service Result */}
      {reasoningData?.recommendedService && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <ServiceCard 
              service={reasoningData.recommendedService} 
              onExploreGraph={onExploreGraph}
              highlighted={true}
            />
          </div>

          {/* Reasoning Steps breakdown */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Step-by-Step Inference Chain</span>
            </h3>

            <div className="space-y-3">
              {reasoningData.reasoningSteps?.map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center space-x-2 font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-slate-600 mt-1 pl-7 leading-relaxed text-[11px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
