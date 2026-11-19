import re
from services.semantic_reasoner import reasoner_instance
from services.ontology_service import ontology_instance
from models.database import db_instance

class SearchService:
    def __init__(self):
        self.reasoner = reasoner_instance
        self.ontology = ontology_instance
        self.db = db_instance

    def semantic_search(self, query):
        """Executes full semantic reasoning and logs result"""
        result = self.reasoner.process_query(query)
        
        # Log to database/file store
        self.db.log_search(
            query=query,
            detected_concepts=[c["label"] for c in result.get("matchedConcepts", [])],
            matched_service=result.get("recommendedService", {}).get("name") if result.get("recommendedService") else None,
            reasoning_trace=result.get("reasoningSteps", []),
            search_type="semantic",
            success=result.get("success", False)
        )
        return result

    def traditional_keyword_search(self, query):
        """
        Emulates traditional keyword/text-matching search.
        Matches exact words against service name, code, and official description.
        Does NOT understand synonyms, ontologies, or concepts.
        """
        cleaned = query.lower()
        query_words = set(re.findall(r'\b[a-z0-9]+\b', cleaned))
        stop_words = {"how", "can", "i", "to", "in", "a", "an", "the", "for", "of", "do", "where", "my", "me", "want", "need", "please", "is", "at"}
        search_words = [w for w in query_words if w not in stop_words]

        all_services = self.ontology.get_all_services()
        scored_services = []

        for s in all_services:
            name_words = set(re.findall(r'\b[a-z0-9]+\b', s["name"].lower()))
            desc_words = set(re.findall(r'\b[a-z0-9]+\b', s["description"].lower()))
            
            # Count exact word hits
            name_hits = [w for w in search_words if w in name_words]
            desc_hits = [w for w in search_words if w in desc_words]
            
            # Traditional score based strictly on verbatim word presence
            score = (len(name_hits) * 3) + len(desc_hits)
            matched_terms = list(set(name_hits + desc_hits))
            missing_terms = [w for w in search_words if w not in matched_terms]

            if score > 0:
                scored_services.append({
                    "service": s,
                    "keywordScore": score,
                    "matchedKeywords": matched_terms,
                    "missingKeywords": missing_terms,
                    "matchPercentage": round((len(matched_terms) / len(search_words) * 100), 1) if search_words else 0
                })

        # Sort by traditional keyword score
        scored_services.sort(key=lambda x: x["keywordScore"], reverse=True)

        return {
            "query": query,
            "searchKeywords": search_words,
            "results": scored_services[:5],
            "totalHits": len(scored_services),
            "topMatch": scored_services[0] if scored_services else None
        }

    def compare_search(self, query):
        """
        Executes both Semantic Search and Traditional Keyword Search side-by-side,
        evaluating why Semantic Search succeeds on synonym and concept levels.
        """
        semantic_res = self.semantic_search(query)
        keyword_res = self.traditional_keyword_search(query)

        # Generate comparative insight
        semantic_top = semantic_res.get("recommendedService")
        keyword_top = keyword_res["topMatch"]["service"] if keyword_res["topMatch"] else None
        
        reasons = []
        if semantic_res.get("matchedConcepts"):
            for c in semantic_res["matchedConcepts"]:
                reasons.append(f"Identified synonym '{c['matchedSynonym']}' which resolves to formal ontology concept '{c['label']}'. Traditional keyword search lacks this semantic bridge.")
        
        if keyword_res["topMatch"]:
            missing = keyword_res["topMatch"].get("missingKeywords", [])
            if missing:
                reasons.append(f"Traditional search penalized relevant service because keywords like {missing} do not appear verbatim in the official government title.")
        else:
            reasons.append("Traditional search returned ZERO exact keyword matches because none of the official service titles literally contain the user's everyday vocabulary.")

        if semantic_top and (not keyword_top or semantic_top["id"] != keyword_top["id"]):
            outcome_summary = "Semantic Search successfully identified the exact intended service via Ontology Reasoning, whereas Traditional Keyword Search failed or surfaced a lower-relevance match."
        elif semantic_top and keyword_top and semantic_top["id"] == keyword_top["id"]:
            outcome_summary = "Both matched the service, but Semantic Search provided a validated reasoning trace, document verification, and higher confidence."
        else:
            outcome_summary = "Semantic search extracted concepts and evaluated department rules for optimal routing."

        return {
            "query": query,
            "semanticSearch": semantic_res,
            "keywordSearch": keyword_res,
            "comparisonInsight": {
                "outcomeSummary": outcome_summary,
                "analyticalPoints": reasons,
                "semanticConfidence": semantic_res.get("confidence", 0),
                "keywordMatchConfidence": (keyword_res["topMatch"]["matchPercentage"] / 100.0) if keyword_res["topMatch"] else 0.0
            }
        }

# Singleton search service instance
search_instance = SearchService()
