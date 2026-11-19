import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Search, ZoomIn, ZoomOut, RefreshCw, Filter, 
  Code2, Play, Layers, Info, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { getKnowledgeGraph, runSparql, getTriplesSummary } from '../services/api';

export default function KnowledgeGraphPage({ initialSelectedService }) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showSparqlConsole, setShowSparqlConsole] = useState(false);
  
  // SPARQL Playground state
  const [sparqlQuery, setSparqlQuery] = useState(
    "SELECT ?service ?dept WHERE {\n  ?service gov:belongsToDepartment ?dept .\n} LIMIT 10"
  );
  const [sparqlResult, setSparqlResult] = useState(null);
  const [sparqlLoading, setSparqlLoading] = useState(false);
  const [triplesSummary, setTriplesSummary] = useState(null);

  const canvasRef = useRef(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 0.85 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef(null);
  const nodePositionsRef = useRef(new Map());

  // Preset SPARQL queries
  const sampleSparqlQueries = [
    {
      name: "1. All Services and their Governing Departments",
      query: "SELECT ?service ?dept WHERE {\n  ?service gov:belongsToDepartment ?dept .\n} LIMIT 10"
    },
    {
      name: "2. Services requiring Proof of Address (POA)",
      query: "SELECT ?service ?doc WHERE {\n  ?service gov:requiresDocument doc:ProofOfAddress .\n  BIND(doc:ProofOfAddress AS ?doc)\n}"
    },
    {
      name: "3. Services associated with Residential Address Concept",
      query: "SELECT ?service ?concept WHERE {\n  ?service gov:associatedWithConcept concept:ResidentialAddress .\n  BIND(concept:ResidentialAddress AS ?concept)\n}"
    },
    {
      name: "4. All UIDAI Identity Services",
      query: "SELECT ?service ?name ?fee WHERE {\n  ?service gov:belongsToDepartment dept:UIDAI .\n  ?service gov:serviceName ?name .\n  OPTIONAL { ?service gov:serviceFee ?fee . }\n}"
    }
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [graph, summary] = await Promise.all([
          getKnowledgeGraph(),
          getTriplesSummary()
        ]);
        setGraphData(graph);
        setTriplesSummary(summary);
        initializePositions(graph.nodes);
      } catch (err) {
        console.error('Failed to load ontology graph:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Initialize node layout with circular/clustered positions
  const initializePositions = (nodes) => {
    const width = 1000;
    const height = 700;
    const centerX = width / 2;
    const centerY = height / 2;
    const posMap = new Map();

    const depts = nodes.filter(n => n.type === 'Department');
    const srvs = nodes.filter(n => n.type === 'Service');
    const docs = nodes.filter(n => n.type === 'Document');
    const concepts = nodes.filter(n => n.type === 'Concept');

    // Place Departments in an inner orbit
    depts.forEach((node, i) => {
      const angle = (i / depts.length) * 2 * Math.PI;
      posMap.set(node.id, {
        x: centerX + 180 * Math.cos(angle),
        y: centerY + 180 * Math.sin(angle),
        vx: 0,
        vy: 0
      });
    });

    // Place Services in a middle orbit
    srvs.forEach((node, i) => {
      const angle = (i / srvs.length) * 2 * Math.PI;
      posMap.set(node.id, {
        x: centerX + 340 * Math.cos(angle),
        y: centerY + 300 * Math.sin(angle),
        vx: 0,
        vy: 0
      });
    });

    // Place Documents in an outer orbit
    docs.forEach((node, i) => {
      const angle = (i / docs.length) * 2 * Math.PI;
      posMap.set(node.id, {
        x: centerX + 460 * Math.cos(angle),
        y: centerY + 400 * Math.sin(angle),
        vx: 0,
        vy: 0
      });
    });

    // Place Concepts around the perimeter
    concepts.forEach((node, i) => {
      const angle = (i / concepts.length) * 2 * Math.PI + 0.3;
      posMap.set(node.id, {
        x: centerX + 440 * Math.cos(angle),
        y: centerY + 280 * Math.sin(angle),
        vx: 0,
        vy: 0
      });
    });

    nodePositionsRef.current = posMap;
  };

  // Canvas drawing loop
  useEffect(() => {
    if (loading || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply Zoom & Pan
      ctx.translate(transformRef.current.x, transformRef.current.y);
      ctx.scale(transformRef.current.scale, transformRef.current.scale);

      const positions = nodePositionsRef.current;

      // Filter visible nodes
      const filteredNodes = graphData.nodes.filter(n => {
        if (typeFilter !== 'ALL' && n.type !== typeFilter) return false;
        if (searchFilter && !n.label.toLowerCase().includes(searchFilter.toLowerCase())) return false;
        return true;
      });
      const visibleIds = new Set(filteredNodes.map(n => n.id));

      // Draw Edges
      graphData.edges.forEach(edge => {
        if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return;
        const sourcePos = positions.get(edge.source);
        const targetPos = positions.get(edge.target);
        if (!sourcePos || !targetPos) return;

        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.strokeStyle = edge.dashed ? '#cbd5e1' : (edge.color || '#94a3b8');
        ctx.lineWidth = edge.source === selectedNode?.id || edge.target === selectedNode?.id ? 2.5 : 1;
        if (edge.dashed) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();

        // Edge label (drawn halfway along edge if selected)
        if (edge.source === selectedNode?.id || edge.target === selectedNode?.id) {
          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(edge.label, midX + 4, midY - 4);
        }
      });

      // Draw Nodes
      filteredNodes.forEach(node => {
        const pos = positions.get(node.id);
        if (!pos) return;

        const isSelected = selectedNode?.id === node.id;
        const radius = isSelected ? (node.size || 24) + 6 : (node.size || 24);

        // Glow when selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 8, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
          ctx.fill();
        }

        // Main node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || '#0284c7';
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = node.borderColor || '#ffffff';
        ctx.stroke();

        // Label
        ctx.fillStyle = '#1e293b';
        ctx.font = isSelected ? 'bold 12px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        // Truncate long label for canvas
        const labelText = node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label;
        ctx.fillText(labelText, pos.x, pos.y + radius + 14);
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [loading, graphData, selectedNode, searchFilter, typeFilter]);

  // Handle canvas mouse interaction: pan, drag node, click
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Transform mouse coordinates to canvas virtual space
    const virtualX = (mouseX - transformRef.current.x) / transformRef.current.scale;
    const virtualY = (mouseY - transformRef.current.y) / transformRef.current.scale;

    // Check if clicked on a node
    let clickedNode = null;
    const positions = nodePositionsRef.current;
    for (const node of graphData.nodes) {
      const pos = positions.get(node.id);
      if (pos) {
        const dist = Math.hypot(virtualX - pos.x, virtualY - pos.y);
        if (dist <= (node.size || 24) + 5) {
          clickedNode = node;
          break;
        }
      }
    }

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      setSelectedNode(clickedNode);
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: mouseX - transformRef.current.x, y: mouseY - transformRef.current.y };
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (draggedNodeRef.current) {
      const virtualX = (mouseX - transformRef.current.x) / transformRef.current.scale;
      const virtualY = (mouseY - transformRef.current.y) / transformRef.current.scale;
      const pos = nodePositionsRef.current.get(draggedNodeRef.current.id);
      if (pos) {
        pos.x = virtualX;
        pos.y = virtualY;
      }
    } else if (isDraggingRef.current) {
      transformRef.current.x = mouseX - dragStartRef.current.x;
      transformRef.current.y = mouseY - dragStartRef.current.y;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    draggedNodeRef.current = null;
  };

  const handleZoom = (factor) => {
    transformRef.current.scale = Math.min(Math.max(0.4, transformRef.current.scale * factor), 2.2);
  };

  const handleReset = () => {
    transformRef.current = { x: 50, y: 50, scale: 0.8 };
    initializePositions(graphData.nodes);
  };

  const handleExecuteSparql = async () => {
    if (!sparqlQuery.trim()) return;
    setSparqlLoading(true);
    try {
      const res = await runSparql(sparqlQuery);
      setSparqlResult(res);
    } catch (err) {
      console.error(err);
      setSparqlResult({ success: false, error: 'Network failure or syntax error' });
    } finally {
      setSparqlLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-100 text-purple-800">
              Module 3
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ontology Knowledge Graph
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Visual relationships between Government Departments, Services, Documents, and Concepts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSparqlConsole(!showSparqlConsole)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm ${
              showSparqlConsole ? 'bg-slate-900 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-500" />
            <span>Interactive SPARQL Console</span>
          </button>
        </div>
      </div>

      {/* Interactive SPARQL Console (Collapsible) */}
      {showSparqlConsole && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-white">Live SPARQL 1.1 Query Console</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Backend: Python RDFLib Graph ({triplesSummary?.totalTriples || 572} Triples)
            </span>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block mb-2">Preset SPARQL Queries:</span>
            <div className="flex flex-wrap gap-2">
              {sampleSparqlQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSparqlQuery(item.query)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 font-mono"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Query Editor */}
          <div>
            <textarea
              rows={4}
              value={sparqlQuery}
              onChange={(e) => setSparqlQuery(e.target.value)}
              className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleExecuteSparql}
              disabled={sparqlLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{sparqlLoading ? 'Executing Query...' : 'Run SPARQL Query'}</span>
            </button>

            {sparqlResult?.count !== undefined && (
              <span className="text-xs text-emerald-400 font-mono">
                Returned {sparqlResult.count} result rows
              </span>
            )}
          </div>

          {/* SPARQL Results Table */}
          {sparqlResult && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              {sparqlResult.success ? (
                <div className="max-h-60 overflow-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 sticky top-0">
                      <tr>
                        {sparqlResult.variables?.map((v, i) => (
                          <th key={i} className="p-2 border-b border-slate-800">?{v}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {sparqlResult.rows?.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/50">
                          {sparqlResult.variables?.map((v, cIdx) => (
                            <td key={cIdx} className="p-2 truncate max-w-xs" title={row[v]}>
                              {row[v]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs font-mono">
                  Error: {sparqlResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Canvas Container with Controls & Inspector Drawer */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[680px]">
        {/* Floating Top Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-md">
          {/* Node Search */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5" />
            <input
              type="text"
              placeholder="Find node..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 sm:w-44"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
            {['ALL', 'Department', 'Service', 'Document', 'Concept'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
                  typeFilter === t ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Zoom & Pan Controls */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md">
          <button
            onClick={() => handleZoom(1.2)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 hidden md:flex items-center space-x-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 text-xs shadow-md">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1e3a8a]"></span>
            <span className="text-slate-600">Department</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0284c7]"></span>
            <span className="text-slate-600">Service</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#059669]"></span>
            <span className="text-slate-600">Required Document</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#7c3aed]"></span>
            <span className="text-slate-600">Concept</span>
          </div>
        </div>

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={1100}
          height={680}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full cursor-grab active:cursor-grabbing bg-slate-50/50"
        />

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 p-5 shadow-2xl space-y-3 animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedNode.type}
                </span>
                <h4 className="font-extrabold text-slate-900 text-base mt-1 leading-snug">
                  {selectedNode.label}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-2 font-sans">
              {selectedNode.info?.category && (
                <div>
                  <span className="font-semibold text-slate-400 block text-[10px] uppercase">Domain</span>
                  <span className="font-medium text-slate-800">{selectedNode.info.category}</span>
                </div>
              )}
              {selectedNode.info?.department && (
                <div>
                  <span className="font-semibold text-slate-400 block text-[10px] uppercase">Governing Authority</span>
                  <span className="font-medium text-slate-800">{selectedNode.info.department}</span>
                </div>
              )}
              {selectedNode.info?.description && (
                <div>
                  <span className="font-semibold text-slate-400 block text-[10px] uppercase">Official Description</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{selectedNode.info.description}</p>
                </div>
              )}
              {selectedNode.info?.fee && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory Fee:</span>
                  <span className="font-bold text-slate-800">{selectedNode.info.fee}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Node ID: {selectedNode.id}</span>
              <button
                onClick={() => {
                  setSparqlQuery(`DESCRIBE <http://gov.semantic.in/service/${selectedNode.id.replace('srv_', '')}>`);
                  setShowSparqlConsole(true);
                }}
                className="text-blue-700 hover:underline font-semibold text-[11px]"
              >
                Inspect Triples
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
