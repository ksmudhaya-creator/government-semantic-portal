from flask import Blueprint, request, jsonify
from services.ontology_service import ontology_instance

ontology_bp = Blueprint("ontology", __name__)

@ontology_bp.route("/graph", methods=["GET"])
def get_graph():
    graph_data = ontology_instance.get_knowledge_graph_data()
    return jsonify(graph_data)

@ontology_bp.route("/sparql", methods=["POST"])
def run_sparql():
    data = request.get_json() or {}
    sparql_query = data.get("query", "").strip()
    if not sparql_query:
        return jsonify({"error": "SPARQL query string is required"}), 400
    
    result = ontology_instance.execute_sparql(sparql_query)
    return jsonify(result)

@ontology_bp.route("/triples-summary", methods=["GET"])
def triples_summary():
    g = ontology_instance.graph
    return jsonify({
        "totalTriples": len(g),
        "ontologyUri": "http://gov.semantic.in/ontology",
        "format": "OWL-DL / RDF-Turtle",
        "version": "2.0.0",
        "supportedNamespaces": [
            {"prefix": "gov", "uri": "http://gov.semantic.in/ontology#"},
            {"prefix": "dept", "uri": "http://gov.semantic.in/department/"},
            {"prefix": "srv", "uri": "http://gov.semantic.in/service/"},
            {"prefix": "doc", "uri": "http://gov.semantic.in/document/"},
            {"prefix": "concept", "uri": "http://gov.semantic.in/concept/"}
        ]
    })
