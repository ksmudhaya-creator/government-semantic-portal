"""
Portal Controller
Coordinates high-level business orchestration between ontology queries,
reasoning deductions, and analytics logging.
"""

from services.search_service import search_instance
from services.ontology_service import ontology_instance
from services.chat_service import chat_instance
from models.database import db_instance

class PortalController:
    @staticmethod
    def handle_semantic_search(query):
        return search_instance.semantic_search(query)

    @staticmethod
    def handle_compare_search(query):
        return search_instance.compare_search(query)

    @staticmethod
    def handle_graph_request():
        return ontology_instance.get_knowledge_graph_data()

    @staticmethod
    def handle_sparql_execution(query_str):
        return ontology_instance.execute_sparql(query_str)

    @staticmethod
    def handle_chat_message(message, session_id):
        return chat_instance.process_message(message, session_id)

    @staticmethod
    def handle_analytics_stats():
        return db_instance.get_analytics()
