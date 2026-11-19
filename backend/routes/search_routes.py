from flask import Blueprint, request, jsonify
from services.search_service import search_instance

search_bp = Blueprint("search", __name__)

@search_bp.route("/semantic", methods=["POST"])
def semantic_search():
    data = request.get_json() or {}
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query string is required"}), 400
    
    result = search_instance.semantic_search(query)
    return jsonify(result)

@search_bp.route("/compare", methods=["POST"])
def compare_search():
    data = request.get_json() or {}
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query string is required"}), 400
    
    result = search_instance.compare_search(query)
    return jsonify(result)

@search_bp.route("/suggestions", methods=["GET"])
def search_suggestions():
    suggestions = [
        "How can I change my house location in Aadhaar?",
        "Where can I renew my driving licence?",
        "I lost my identity card.",
        "How do I get a PAN card?",
        "How can I apply for a caste certificate?",
        "I want to register for a new Aadhaar card",
        "How to transfer vehicle ownership and RC?",
        "Apply for family ration card under NFSA",
        "How to get income certificate for college scholarship?",
        "New voter ID registration Form 6",
        "Apply for fresh passport online"
    ]
    return jsonify({"suggestions": suggestions})
