from flask import Blueprint, jsonify
from services.ontology_service import ontology_instance

department_bp = Blueprint("departments", __name__)

@department_bp.route("", methods=["GET"])
def list_departments():
    departments = ontology_instance.get_all_departments()
    return jsonify({"departments": departments, "count": len(departments)})

@department_bp.route("/<dept_id>/services", methods=["GET"])
def get_dept_services(dept_id):
    departments = ontology_instance.get_all_departments()
    dept = next((d for d in departments if d["id"] == dept_id), None)
    if not dept:
        return jsonify({"error": "Department not found"}), 404
    
    all_services = ontology_instance.get_all_services()
    dept_services = [s for s in all_services if s["departmentUri"] == dept["uri"]]
    return jsonify({
        "department": dept,
        "services": dept_services,
        "count": len(dept_services)
    })
