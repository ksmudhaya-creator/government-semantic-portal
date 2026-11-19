import os
import rdflib
from rdflib.namespace import RDF, RDFS, OWL, XSD

class OntologyService:
    def __init__(self):
        self.graph = rdflib.Graph()
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.ttl_path = os.path.join(self.base_dir, "ontology", "government.ttl")
        self.owl_path = os.path.join(self.base_dir, "ontology", "government.owl")
        
        self.GOV = rdflib.Namespace("http://gov.semantic.in/ontology#")
        self.DEPT = rdflib.Namespace("http://gov.semantic.in/department/")
        self.SRV = rdflib.Namespace("http://gov.semantic.in/service/")
        self.DOC = rdflib.Namespace("http://gov.semantic.in/document/")
        self.CAT = rdflib.Namespace("http://gov.semantic.in/category/")
        self.CONCEPT = rdflib.Namespace("http://gov.semantic.in/concept/")

        self.prefixes = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX gov: <http://gov.semantic.in/ontology#>
        PREFIX dept: <http://gov.semantic.in/department/>
        PREFIX srv: <http://gov.semantic.in/service/>
        PREFIX doc: <http://gov.semantic.in/document/>
        PREFIX cat: <http://gov.semantic.in/category/>
        PREFIX concept: <http://gov.semantic.in/concept/>
        """
        self._load_ontology()

    def _load_ontology(self):
        if os.path.exists(self.ttl_path):
            self.graph.parse(self.ttl_path, format="turtle")
            print(f"[OntologyService] Successfully parsed {len(self.graph)} triples from {self.ttl_path}")
        elif os.path.exists(self.owl_path):
            self.graph.parse(self.owl_path, format="xml")
            print(f"[OntologyService] Successfully parsed {len(self.graph)} triples from {self.owl_path}")
        else:
            print("[OntologyService] ERROR: No ontology file found!")

    def get_all_services(self):
        query = self.prefixes + """
        SELECT ?service ?name ?code ?deptName ?deptUri ?categoryName ?desc ?procedure ?url ?time ?fee
        WHERE {
            ?service a ?type .
            ?type rdfs:subClassOf* gov:GovernmentService .
            FILTER(?type != gov:GovernmentService)
            
            OPTIONAL { ?service gov:serviceName ?name . }
            OPTIONAL { ?service gov:serviceCode ?code . }
            OPTIONAL { 
                ?service gov:belongsToDepartment ?deptUri .
                ?deptUri gov:departmentName ?deptName .
            }
            OPTIONAL {
                ?service gov:hasCategory ?cat .
                ?cat rdfs:label ?categoryName .
            }
            OPTIONAL { ?service gov:hasDescription ?desc . }
            OPTIONAL { ?service gov:hasApplicationProcedure ?procedure . }
            OPTIONAL { ?service gov:officialPortalUrl ?url . }
            OPTIONAL { ?service gov:processingTime ?time . }
            OPTIONAL { ?service gov:serviceFee ?fee . }
        }
        ORDER BY ?name
        """
        results = self.graph.query(query)
        services = []
        for row in results:
            srv_uri = str(row.service)
            srv_id = srv_uri.split("/")[-1]
            
            # Fetch required documents for this service
            docs = self.get_service_documents(srv_uri)
            # Fetch synonyms
            synonyms = self.get_service_synonyms(srv_uri)
            # Fetch related services
            related = self.get_related_services(srv_uri)

            services.append({
                "id": srv_id,
                "uri": srv_uri,
                "name": str(row.name) if row.name else srv_id,
                "code": str(row.code) if row.code else "",
                "department": str(row.deptName) if row.deptName else "Government Authority",
                "departmentUri": str(row.deptUri) if row.deptUri else "",
                "category": str(row.categoryName) if row.categoryName else "General Services",
                "description": str(row.desc) if row.desc else "",
                "procedure": str(row.procedure) if row.procedure else "",
                "officialUrl": str(row.url) if row.url else "",
                "processingTime": str(row.time) if row.time else "Standard",
                "serviceFee": str(row.fee) if row.fee else "Free",
                "documents": docs,
                "synonyms": synonyms,
                "relatedServices": related
            })
        return services

    def get_service_documents(self, service_uri):
        query = self.prefixes + f"""
        SELECT ?doc ?label ?desc
        WHERE {{
            <{service_uri}> gov:requiresDocument ?doc .
            OPTIONAL {{ ?doc rdfs:label ?label . }}
            OPTIONAL {{ ?doc gov:hasDescription ?desc . }}
        }}
        """
        results = self.graph.query(query)
        docs = []
        for row in results:
            docs.append({
                "uri": str(row.doc),
                "name": str(row.label) if row.label else str(row.doc).split("/")[-1],
                "description": str(row.desc) if row.desc else ""
            })
        return docs

    def get_service_synonyms(self, service_uri):
        query = self.prefixes + f"""
        SELECT ?syn
        WHERE {{
            <{service_uri}> gov:hasSynonym ?syn .
        }}
        """
        results = self.graph.query(query)
        return [str(row.syn) for row in results]

    def get_related_services(self, service_uri):
        query = self.prefixes + f"""
        SELECT ?rel ?name
        WHERE {{
            <{service_uri}> gov:relatedTo ?rel .
            OPTIONAL {{ ?rel gov:serviceName ?name . }}
        }}
        """
        results = self.graph.query(query)
        return [{"id": str(row.rel).split("/")[-1], "name": str(row.name) if row.name else str(row.rel).split("/")[-1]} for row in results]

    def get_all_departments(self):
        query = self.prefixes + """
        SELECT ?dept ?name ?ministry ?desc ?url
        WHERE {
            ?dept a gov:GovernmentDepartment .
            OPTIONAL { ?dept gov:departmentName ?name . }
            OPTIONAL { ?dept gov:ministryName ?ministry . }
            OPTIONAL { ?dept gov:hasDescription ?desc . }
            OPTIONAL { ?dept gov:officialPortalUrl ?url . }
        }
        ORDER BY ?name
        """
        results = self.graph.query(query)
        departments = []
        all_services = self.get_all_services()
        
        for row in results:
            dept_uri = str(row.dept)
            dept_id = dept_uri.split("/")[-1]
            services_under = [s for s in all_services if s["departmentUri"] == dept_uri]
            
            departments.append({
                "id": dept_id,
                "uri": dept_uri,
                "name": str(row.name) if row.name else dept_id,
                "ministry": str(row.ministry) if row.ministry else "Government of India",
                "description": str(row.desc) if row.desc else "",
                "officialUrl": str(row.url) if row.url else "",
                "serviceCount": len(services_under),
                "services": [{"id": s["id"], "name": s["name"], "code": s["code"]} for s in services_under]
            })
        return departments

    def get_knowledge_graph_data(self):
        """Constructs an interactive visual graph format: { nodes: [...], edges: [...] }"""
        nodes = []
        edges = []
        seen_nodes = set()
        edge_id = 0

        # 1. Departments
        depts = self.get_all_departments()
        for d in depts:
            node_id = f"dept_{d['id']}"
            if node_id not in seen_nodes:
                seen_nodes.add(node_id)
                nodes.append({
                    "id": node_id,
                    "label": d["name"],
                    "shortLabel": d["id"],
                    "type": "Department",
                    "color": "#1e3a8a", # Deep Navy Blue
                    "borderColor": "#3b82f6",
                    "size": 36,
                    "info": {
                        "category": "Government Department",
                        "ministry": d["ministry"],
                        "description": d["description"],
                        "url": d["officialUrl"]
                    }
                })

        # 2. Services
        services = self.get_all_services()
        for s in services:
            node_id = f"srv_{s['id']}"
            if node_id not in seen_nodes:
                seen_nodes.add(node_id)
                nodes.append({
                    "id": node_id,
                    "label": s["name"],
                    "shortLabel": s["code"] or s["id"],
                    "type": "Service",
                    "color": "#0284c7", # Ocean Blue
                    "borderColor": "#38bdf8",
                    "size": 28,
                    "info": {
                        "category": s["category"],
                        "department": s["department"],
                        "fee": s["serviceFee"],
                        "processingTime": s["processingTime"],
                        "description": s["description"]
                    }
                })

            # Edge to department
            if s.get("departmentUri"):
                dept_id = s["departmentUri"].split("/")[-1]
                edges.append({
                    "id": f"e_{edge_id}",
                    "source": f"dept_{dept_id}",
                    "target": node_id,
                    "label": "providesService",
                    "color": "#60a5fa"
                })
                edge_id += 1

            # Documents
            for doc in s.get("documents", []):
                doc_node_id = f"doc_{doc['uri'].split('/')[-1]}"
                if doc_node_id not in seen_nodes:
                    seen_nodes.add(doc_node_id)
                    nodes.append({
                        "id": doc_node_id,
                        "label": doc["name"],
                        "shortLabel": doc["name"],
                        "type": "Document",
                        "color": "#059669", # Emerald Green
                        "borderColor": "#34d399",
                        "size": 22,
                        "info": {
                            "category": "Required Document",
                            "description": doc["description"]
                        }
                    })
                edges.append({
                    "id": f"e_{edge_id}",
                    "source": node_id,
                    "target": doc_node_id,
                    "label": "requiresDocument",
                    "color": "#34d399"
                })
                edge_id += 1

            # Related services
            for rel in s.get("relatedServices", []):
                target_node = f"srv_{rel['id']}"
                # Avoid duplicate bidirectional edges
                if target_node < node_id:
                    edges.append({
                        "id": f"e_{edge_id}",
                        "source": node_id,
                        "target": target_node,
                        "label": "relatedTo",
                        "color": "#f59e0b",
                        "dashed": True
                    })
                    edge_id += 1

        # 3. Semantic Concepts
        concept_query = self.prefixes + """
        SELECT ?c ?label
        WHERE {
            ?c a gov:SemanticConcept .
            OPTIONAL { ?c rdfs:label ?label . }
        }
        """
        for row in self.graph.query(concept_query):
            c_uri = str(row.c)
            c_id = c_uri.split("/")[-1]
            c_node_id = f"concept_{c_id}"
            if c_node_id not in seen_nodes:
                seen_nodes.add(c_node_id)
                nodes.append({
                    "id": c_node_id,
                    "label": str(row.label) if row.label else c_id,
                    "shortLabel": c_id,
                    "type": "Concept",
                    "color": "#7c3aed", # Purple
                    "borderColor": "#a78bfa",
                    "size": 24,
                    "info": {
                        "category": "Semantic Concept Anchor",
                        "uri": c_uri
                    }
                })

            # Connect concept to services
            srv_concept_query = self.prefixes + f"""
            SELECT ?srv WHERE {{
                ?srv gov:associatedWithConcept <{c_uri}> .
            }}
            """
            for srow in self.graph.query(srv_concept_query):
                s_id = str(srow.srv).split("/")[-1]
                edges.append({
                    "id": f"e_{edge_id}",
                    "source": f"srv_{s_id}",
                    "target": c_node_id,
                    "label": "associatedWith",
                    "color": "#c084fc"
                })
                edge_id += 1

        return {"nodes": nodes, "edges": edges}

    def execute_sparql(self, sparql_query):
        """Executes arbitrary SPARQL query against RDF Graph with prefixes injected"""
        if "PREFIX" not in sparql_query.upper():
            full_query = self.prefixes + "\n" + sparql_query
        else:
            full_query = sparql_query

        try:
            results = self.graph.query(full_query)
            vars_list = [str(v) for v in results.vars] if results.vars else []
            rows = []
            for row in results:
                row_dict = {}
                for v in vars_list:
                    val = getattr(row, v, None)
                    row_dict[v] = str(val) if val is not None else ""
                rows.append(row_dict)
            return {
                "success": True,
                "variables": vars_list,
                "rows": rows,
                "count": len(rows)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Singleton ontology instance
ontology_instance = OntologyService()
