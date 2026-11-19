from flask import Blueprint, request, jsonify
from services.chat_service import chat_instance

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/message", methods=["POST"])
def send_message():
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    session_id = data.get("sessionId")
    if not message:
        return jsonify({"error": "Message is required"}), 400
    
    response = chat_instance.process_message(message, session_id)
    return jsonify(response)

@chat_bp.route("/reset", methods=["POST"])
def reset_chat():
    data = request.get_json() or {}
    session_id = data.get("sessionId")
    result = chat_instance.reset_session(session_id)
    return jsonify(result)
