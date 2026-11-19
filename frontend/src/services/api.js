const API_BASE = '/api';

export async function searchSemantic(query) {
  const res = await fetch(`${API_BASE}/search/semantic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Failed to perform semantic search');
  return res.json();
}

export async function compareSearch(query) {
  const res = await fetch(`${API_BASE}/search/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Failed to perform search comparison');
  return res.json();
}

export async function getSuggestions() {
  const res = await fetch(`${API_BASE}/search/suggestions`);
  if (!res.ok) throw new Error('Failed to fetch suggestions');
  return res.json();
}

export async function getKnowledgeGraph() {
  const res = await fetch(`${API_BASE}/ontology/graph`);
  if (!res.ok) throw new Error('Failed to load knowledge graph');
  return res.json();
}

export async function runSparql(query) {
  const res = await fetch(`${API_BASE}/ontology/sparql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('SPARQL query failed');
  return res.json();
}

export async function getTriplesSummary() {
  const res = await fetch(`${API_BASE}/ontology/triples-summary`);
  if (!res.ok) throw new Error('Failed to load triples summary');
  return res.json();
}

export async function getAllServices() {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}

export async function getServiceById(id) {
  const res = await fetch(`${API_BASE}/services/${id}`);
  if (!res.ok) throw new Error('Service not found');
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/services/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function getAllDepartments() {
  const res = await fetch(`${API_BASE}/departments`);
  if (!res.ok) throw new Error('Failed to load departments');
  return res.json();
}

export async function getDepartmentServices(deptId) {
  const res = await fetch(`${API_BASE}/departments/${deptId}/services`);
  if (!res.ok) throw new Error('Failed to load department services');
  return res.json();
}

export async function sendChatMessage(message, sessionId) {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!res.ok) throw new Error('Chat communication error');
  return res.json();
}

export async function resetChat(sessionId) {
  const res = await fetch(`${API_BASE}/chat/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) throw new Error('Failed to reset chat');
  return res.json();
}

export async function getAnalyticsStats() {
  const res = await fetch(`${API_BASE}/analytics/stats`);
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}

export async function getSearchLogs() {
  const res = await fetch(`${API_BASE}/analytics/search-logs`);
  if (!res.ok) throw new Error('Failed to load search logs');
  return res.json();
}
