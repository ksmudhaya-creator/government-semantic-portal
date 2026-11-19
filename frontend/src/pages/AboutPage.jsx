import React from 'react';
import { 
  Network, BrainCircuit, ShieldCheck, FileCode, CheckCircle2, 
  ArrowRight, Sparkles, Building2, Layers
} from 'lucide-react';

export default function AboutPage({ setCurrentTab }) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 pb-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
            System Architecture
          </span>
          <span className="text-xs text-slate-400 font-mono">Knowledge to Intelligence</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Ontology-Based Semantic Search and Intelligent Government Service Portal
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          Public e-governance portals encompass hundreds of disparate citizen services across state and central departments. 
          Citizens routinely query these portals using colloquial or regional vocabulary (e.g., <em>"How can I change my house location in Aadhaar?"</em>, 
          <em>"pehechan patra"</em>, or <em>"I lost my identity card"</em>). Traditional keyword search fails to comprehend the true underlying semantic 
          intent because official services use formal bureaucratic language (e.g., <em>"Aadhaar Residential Address Update"</em>).
        </p>

        <p className="text-sm text-slate-600 leading-relaxed">
          This system demonstrates how <strong>Web Ontology Language (OWL)</strong>, <strong>RDF Knowledge Graphs</strong>, and 
          <strong>Rule-Based Semantic Reasoning</strong> bridge this linguistic divide, ensuring high-precision discovery of government services.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-slate-900 text-base">Formal OWL/RDF Ontology</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Constructed with 572 formal RDF triples defining Government Departments, Services, Required Supporting Documents, 
            Eligibility Criteria, and Semantic Concept anchors.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-slate-900 text-base">Rule-Based Reasoning Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Executes deterministic Horn Clause logical inference rules (<code>Antecedent ⇒ Consequent</code>) implemented in 
            Python without relying on opaque black-box APIs.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-slate-900 text-base">SPARQL 1.1 Protocol</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enables flexible graph queries across relationships, allowing citizens, officers, and administrators to extract 
            dynamic cross-departmental requirements.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            4
          </div>
          <h3 className="font-bold text-slate-900 text-base">Intelligent Disambiguation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When users pose ambiguous questions (e.g. <em>"I lost my identity card"</em>), the system proactively initiates multi-turn 
            clarification rather than returning arbitrary hits.
          </p>
        </div>
      </div>

      {/* Target Scenario Walkthrough */}
      <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>The College Project Demonstration Scenario</span>
        </div>

        <h3 className="text-xl font-bold text-white">
          "How can I change my house location in Aadhaar?"
        </h3>

        <div className="space-y-2 text-xs font-mono text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-blue-400 block font-bold mb-1">Step 1: Input</span>
            Citizen asks: "How can I change my house location in Aadhaar?"
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-purple-400 block font-bold mb-1">Step 2: Semantic Extraction</span>
            Extracts tokens: [change, house, location, aadhaar]
            <br />
            OWL Synonym: "house location" ⊑ concept:ResidentialAddress
            <br />
            Intent: UPDATE, Entity: Aadhaar (UIDAI)
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-amber-400 block font-bold mb-1">Step 3: Rule Evaluation</span>
            Rule RULE_001_AADHAAR_ADDRESS_UPDATE fires:
            <br />
            <code>IF Concept(ResidentialAddress) ∧ Entity(Aadhaar) ∧ Intent(UPDATE) THEN Recommend(AadhaarAddressUpdate)</code>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 block font-bold mb-1">Step 4: Output</span>
            Returns Service: Aadhaar Address Update | Department: UIDAI | Required Documents: Proof of Address (POA) | Fee: Rs 50
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setCurrentTab('search')}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
          >
            <span>Try Scenario in Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
