import os
from flask import Flask, jsonify
from flask_cors import CORS

from routes.search_routes import search_bp
from routes.ontology_routes import ontology_bp
from routes.service_routes import service_bp
from routes.department_routes import department_bp
from routes.chat_routes import chat_bp
from routes.analytics_routes import analytics_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(search_bp, url_prefix="/api/search")
    app.register_blueprint(ontology_bp, url_prefix="/api/ontology")
    app.register_blueprint(service_bp, url_prefix="/api/services")
    app.register_blueprint(department_bp, url_prefix="/api/departments")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "National Semantic Government Portal Backend",
            "version": "2.0.0",
            "ontologyEngine": "RDFLib + OWL-DL Reasoning"
        })

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Semantic Government Services Portal Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
