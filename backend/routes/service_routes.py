from flask import Blueprint, jsonify
from services.ontology_service import ontology_instance

service_bp = Blueprint("services", __name__)

@service_bp.route("", methods=["GET"])
def list_services():
    services = ontology_instance.get_all_services()
    return jsonify({"services": services, "count": len(services)})

@service_bp.route("/<service_id>", methods=["GET"])
def get_service(service_id):
    services = ontology_instance.get_all_services()
    srv = next((s for s in services if s["id"] == service_id), None)
    if not srv:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(srv)

@service_bp.route("/categories", methods=["GET"])
def list_categories():
    categories = [
        {"id": "identity", "name": "Aadhaar & Identity Services", "icon": "Fingerprint", "serviceCount": 3},
        {"id": "finance", "name": "PAN & Tax Services", "icon": "CreditCard", "serviceCount": 2},
        {"id": "travel", "name": "Passport & Travel Services", "icon": "Globe", "serviceCount": 2},
        {"id": "transport", "name": "Driving Licence & Parivahan", "icon": "Car", "serviceCount": 4},
        {"id": "electoral", "name": "Voter ID & Election Commission", "icon": "Vote", "serviceCount": 2},
        {"id": "welfare", "name": "Ration Card & Public Distribution", "icon": "Users", "serviceCount": 1},
        {"id": "revenue", "name": "Income & Caste Certificates", "icon": "FileText", "serviceCount": 2},
        {"id": "vital", "name": "Birth & Vital Registration", "icon": "Baby", "serviceCount": 1}
    ]
    return jsonify({"categories": categories})
