import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, AlertCircle, CheckCircle2, XCircle, 
  ArrowRight, BrainCircuit, Network, HelpCircle, RefreshCw, 
  Split, Sliders, ExternalLink, ShieldCheck, FileCheck
} from 'lucide-react';
import { compareSearch } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import ReasoningStepsCard from '../components/ReasoningStepsCard';

export default function SemanticSearchPage({ initialQuery = '', onExploreGraph }) {
  const [query, setQuery] = useState(initialQuery || 'How can I change my house location in Aadhaar?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(true);

  const scenarioQueries = [
    { label: "1. Demonstration Scenario (Aadhaar Location)", q: "How can I change my house location in Aadhaar?" },
    { label: "2. Driving Licence Renewal", q: "Where can I renew my driving licence?" },
    { label: "3. Identity Card Ambiguity", q: "I lost my identity card." },
    { label: "4. PAN Card New Application", q: "How do I get a PAN card?" },
    { label: "5. Caste / Community Certificate", q: "How can I apply for a caste certificate?" },
    { label: "6. Vehicle RC Ownership Transfer", q: "I sold my car and need to transfer RC registration" },
    { label: "7. Food Security Ration Card", q: "Apply for ration card for subsidized grains" }
  ];

  const handleSearch = async (searchQuery) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await compareSearch(q.trim());
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Unable to perform search. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run search on initial load
    handleSearch(query);
  }, []);

  const handleSelectScenario = (q) => {
    setQuery(q);
    handleSearch(q);
  };

  const semantic = result?.semanticSearch;
  const keyword = result?.keywordSearch;
  const insight = result?.comparisonInsight;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      {/* Top Banner / Explanation */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                Module 2
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Intelligent Semantic Search
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Meaning-based search and reasoning rather than literal keyword matching.
            </p>
          </div>

          {/* Toggle for Comparison */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setShowComparison(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                !showComparison ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semantic Only
            </button>
            <button
              onClick={() => setShowComparison(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                showComparison ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison</span>
            </button>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative mt-2">
          <div className="relative flex items-center bg-slate-50 rounded-2xl border-2 border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all p-2 shadow-inner">
            <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about government services in natural language..."
              className="w-full px-4 py-3 text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {loading ? (
              <div className="px-6 py-3 flex items-center space-x-2 text-blue-700 text-sm font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Reasoning...</span>
              </div>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow transition flex items-center space-x-2 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Scenario Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Preset Test Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {scenarioQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectScenario(item.q)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium text-left ${
                  query === item.q 
                    ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Semantic Understanding Breakdown Cards (As requested by Demonstration Scenario) */}
      {semantic?.recommendedService && (
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl text-white shadow-lg border border-blue-700/50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Semantic Entity-Intent-Attribute Extraction
              </h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
              Match Confidence: {Math.round((semantic.confidence || 0.95) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Entity */}
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-blue-300 block">Identified Entity</span>
              <span className="text-base font-extrabold text-white mt-1 block">
                {semantic.detectedEntities?.[0] || 'Aadhaar (UIDAI)'}
              </span>
            </div>

            {/* Intent */}
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Classified Intent</span>
              <span className="text-base font-extrabold text-white mt-1 block">
                {semantic.detectedIntents?.[0] || 'UPDATE / MODIFY'}
              </span>
            </div>

            {/* Attribute */}
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-purple-300 block">Ontology Attribute</span>
              <span className="text-base font-extrabold text-white mt-1 block truncate" title={semantic.matchedConcepts?.[0]?.label || 'Residential Address'}>
                {semantic.matchedConcepts?.[0]?.label || 'Residential Address'}
              </span>
            </div>

            {/* Target Service */}
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Resolved Service</span>
              <span className="text-base font-extrabold text-emerald-300 mt-1 block truncate" title={semantic.recommendedService.name}>
                {semantic.recommendedService.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Results Layout */}
      {result && (
        <div className={`grid gap-8 ${showComparison ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
          {/* Left Column: Semantic Search Results & Reasoning Trace */}
          <div className={showComparison ? 'lg:col-span-7 space-y-6' : 'space-y-6'}>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Semantic Search Results (Ontology & Reasoning)
              </h2>
            </div>

            {semantic?.recommendedService ? (
              <ServiceCard 
                service={semantic.recommendedService} 
                onExploreGraph={onExploreGraph}
                highlighted={true}
              />
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-bold text-slate-800">No Direct Service Inferred</h3>
                <p className="text-xs text-slate-500">
                  Try asking about Aadhaar update, PAN card, driving licence, passport, voter ID, or certificates.
                </p>
              </div>
            )}

            {/* Reasoning Trace Component */}
            {semantic?.reasoningSteps && (
              <ReasoningStepsCard
                steps={semantic.reasoningSteps}
                query={semantic.query}
                confidence={semantic.confidence}
                firedRule={semantic.firedRule}
              />
            )}
          </div>

          {/* Right Column: Traditional Keyword Search Comparison */}
          {showComparison && (
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Traditional Keyword Search
                </h2>
              </div>

              {/* Analytical Insight Box */}
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-3">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Why Keyword Search Struggles:</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {insight?.outcomeSummary}
                </p>
                {insight?.analyticalPoints && (
                  <ul className="text-xs text-amber-800/90 space-y-1.5 pl-4 list-disc">
                    {insight.analyticalPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Keyword Result List */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <span>Literal Search Keywords:</span>
                  <div className="flex flex-wrap gap-1">
                    {keyword?.searchKeywords?.map((kw, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                        "{kw}"
                      </span>
                    ))}
                  </div>
                </div>

                {keyword?.results && keyword.results.length > 0 ? (
                  <div className="space-y-3">
                    {keyword.results.map((hit, idx) => {
                      const isTopMatch = idx === 0;
                      return (
                        <div 
                          key={idx} 
                          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                            isTopMatch ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {hit.service.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              Score: {hit.keywordScore}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            {hit.service.department}
                          </div>

                          {/* Missing Keywords Warning */}
                          {hit.missingKeywords && hit.missingKeywords.length > 0 && (
                            <div className="text-[11px] flex items-center space-x-1 text-rose-600 bg-rose-50 p-1.5 rounded">
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Missing query words: {hit.missingKeywords.join(', ')}</span>
                            </div>
                          )}

                          {/* Matched Keywords */}
                          {hit.matchedKeywords && hit.matchedKeywords.length > 0 && (
                            <div className="text-[11px] flex items-center space-x-1 text-emerald-700 bg-emerald-50 p-1.5 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Matched: {hit.matchedKeywords.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No verbatim keyword matches found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
