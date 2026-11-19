import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, ShieldCheck, ExternalLink, Network } from 'lucide-react';
import { getAllServices, getCategories } from '../services/api';
import ServiceCard from '../components/ServiceCard';

export default function ServicesCatalogPage({ onExploreGraph }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [srvRes, catRes] = await Promise.all([
          getAllServices(),
          getCategories()
        ]);
        setServices(srvRes.services || []);
        setCategories(catRes.categories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredServices = services.filter(s => {
    if (selectedCat !== 'ALL') {
      const catMatch = s.category.toLowerCase().includes(selectedCat.toLowerCase());
      if (!catMatch) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(term) ||
        s.department.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Government Public Services Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete statutory catalog of 17+ Indian citizen services, application workflows, and required documents.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search all services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCat('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedCat === 'ALL' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Domains ({services.length})
        </button>
        {['Identity', 'Transport', 'Finance', 'Travel', 'Electoral', 'Revenue', 'Welfare', 'Vital'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCat === cat ? 'bg-blue-700 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat} Services
          </button>
        ))}
      </div>

      {/* Grid of Service Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm">
          Loading statutory services...
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((srv) => (
            <ServiceCard 
              key={srv.id} 
              service={srv} 
              onExploreGraph={onExploreGraph}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          No services match your search criteria.
        </div>
      )}
    </div>
  );
}
