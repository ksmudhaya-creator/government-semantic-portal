import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, ExternalLink, ShieldCheck, ChevronRight, 
  FileText, ArrowRight, Layers, CheckCircle2, AlertCircle
} from 'lucide-react';
import { getAllDepartments, getDepartmentServices } from '../services/api';
import ServiceCard from '../components/ServiceCard';

export default function DepartmentExplorerPage({ onExploreGraph }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptServices, setDeptServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadDepts() {
      setLoading(true);
      try {
        const res = await getAllDepartments();
        setDepartments(res.departments || []);
        if (res.departments?.length > 0) {
          handleSelectDept(res.departments[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDepts();
  }, []);

  const handleSelectDept = async (dept) => {
    setSelectedDept(dept);
    setServicesLoading(true);
    try {
      const res = await getDepartmentServices(dept.id);
      setDeptServices(res.services || []);
    } catch (err) {
      console.error(err);
    } finally {
      setServicesLoading(false);
    }
  };

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ministry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
              Module 5
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Department Explorer
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Browse official ministries, statutory authorities, and their citizen public service catalogs.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      {/* Demonstration Notice Box (As requested: distinguish sample from verified official) */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
          <span>
            <strong>Official Hierarchy Model:</strong> Department names, ministries, and URLs correspond to verified Government of India portals. Service workflows and fee schedules are modeled for academic knowledge demonstration.
          </span>
        </div>
        <span className="hidden md:inline px-2 py-0.5 bg-blue-200 text-blue-800 rounded font-bold text-[10px]">
          Verified OWL Mapping
        </span>
      </div>

      {/* Two Column Layout: Department Cards on Left, Services on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Department List / Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 px-1">
            Governing Authorities ({filteredDepts.length})
          </h2>

          <div className="space-y-3">
            {filteredDepts.map((dept) => {
              const isSelected = selectedDept?.id === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => handleSelectDept(dept)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/10' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {dept.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {dept.ministry}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0 ml-2">
                      {dept.serviceCount} Services
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {dept.officialUrl && (
                      <a
                        href={dept.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-700 hover:text-blue-800 font-semibold flex items-center space-x-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className={`flex items-center space-x-1 font-bold ${
                      isSelected ? 'text-blue-700' : 'text-slate-400'
                    }`}>
                      <span>View Catalog</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Department Details & Service Catalog */}
        <div className="lg:col-span-7 space-y-6">
          {selectedDept && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {selectedDept.ministry}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                    {selectedDept.name}
                  </h2>
                </div>

                {selectedDept.officialUrl && (
                  <a
                    href={selectedDept.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                  >
                    <span>Visit Authority Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedDept.description}
              </p>

              {/* Service Cards under this Department */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Statutory Services Under {selectedDept.id} ({deptServices.length})</span>
                </h3>

                {servicesLoading ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Loading department services...
                  </div>
                ) : deptServices.length > 0 ? (
                  <div className="space-y-4">
                    {deptServices.map((srv) => (
                      <ServiceCard 
                        key={srv.id} 
                        service={srv} 
                        onExploreGraph={onExploreGraph}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                    No services currently registered under this department.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
