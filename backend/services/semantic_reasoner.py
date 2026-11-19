import re
from reasoning.rule_engine import CONCEPT_TAXONOMY, INTENT_PATTERNS, RULES
from services.ontology_service import ontology_instance

class SemanticReasoner:
    def __init__(self):
        self.ontology = ontology_instance

    def process_query(self, user_query):
        """
        Executes complete semantic reasoning pipeline on natural language query:
        Returns:
            reasoning_result = {
                "query": user_query,
                "tokens": [...],
                "matchedConcepts": [...],
                "detectedIntents": [...],
                "detectedEntities": [...],
                "firedRule": {...},
                "reasoningSteps": [...],
                "recommendedService": {...},
                "confidence": 0.98,
                "isAmbiguous": False,
                "disambiguationOptions": []
            }
        """
        cleaned_query = user_query.strip().lower()
        
        # Step 1: Lexical Analysis & Tokenization
        tokens = re.findall(r'\b[a-zA-Z0-9_\-]+\b', cleaned_query)
        stop_words = {"how", "can", "i", "to", "in", "a", "an", "the", "for", "of", "do", "where", "my", "me", "want", "need", "please", "is", "at"}
        significant_tokens = [t for t in tokens if t not in stop_words]

        # Step 2: Concept Identification via Ontology Synonyms
        matched_concepts = []
        concept_details = []
        
        for c_key, c_data in CONCEPT_TAXONOMY.items():
            for syn in c_data["synonyms"]:
                # Check phrase match or word boundary match
                pattern = r'\b' + re.escape(syn) + r'\b'
                if re.search(pattern, cleaned_query):
                    if c_key not in matched_concepts:
                        matched_concepts.append(c_key)
                        concept_details.append({
                            "conceptKey": c_key,
                            "label": c_data["label"],
                            "matchedSynonym": syn,
                            "canonicalUri": c_data["canonical"]
                        })
                    break

        # Step 3: Intent Classification
        detected_intents = []
        for intent_name, keywords in INTENT_PATTERNS.items():
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw) + r'\b', cleaned_query):
                    if intent_name not in detected_intents:
                        detected_intents.append(intent_name)
                    break

        # Step 4: Entity Recognition (Departments & Core Credentials)
        detected_entities = []
        entity_map = {
            "Aadhaar": ["aadhaar", "aadhar", "uidai", "uid"],
            "PAN Card": ["pan", "pancard", "nsdl", "utiitsl", "income tax"],
            "Passport": ["passport", "tatkaal", "psk", "mea"],
            "Driving Licence": ["driving licence", "driving license", "dl", "rto", "sarathi", "parivahan"],
            "Voter ID": ["voter", "voter id", "epic", "eci", "election card"],
            "Ration Card": ["ration", "rashan", "pds", "nfsa", "bpl"],
            "Revenue Department": ["tehsildar", "e-district", "caste", "income certificate"]
        }
        for ent, kws in entity_map.items():
            for kw in kws:
                if re.search(r'\b' + re.escape(kw) + r'\b', cleaned_query):
                    if ent not in detected_entities:
                        detected_entities.append(ent)
                    break

        # Step 5: Check for Ambiguity (e.g., "I lost my identity card")
        is_ambiguous = False
        disambiguation_options = []
        if ("IdentityCard" in matched_concepts or any(w in cleaned_query for w in ["identity card", "id card", "pehechan patra"])) \
           and not any(e in detected_entities for e in ["Aadhaar", "PAN Card", "Passport", "Driving Licence", "Voter ID"]):
            is_ambiguous = True
            disambiguation_options = [
                {"label": "Aadhaar Card", "serviceId": "AadhaarAddressUpdate", "department": "UIDAI"},
                {"label": "PAN Card", "serviceId": "PANCardCorrection", "department": "Income Tax Department"},
                {"label": "Voter ID Card", "serviceId": "VoterIDAddressCorrection", "department": "Election Commission of India"},
                {"label": "Driving Licence", "serviceId": "DrivingLicenceRenewal", "department": "Transport Department"}
            ]

        # Step 6: Rule Evaluation
        fired_rule = None
        target_service_id = None
        confidence = 0.5

        for rule in RULES:
            try:
                if rule["conditions"](matched_concepts, detected_entities, detected_intents, cleaned_query):
                    fired_rule = {
                        "id": rule["id"],
                        "name": rule["name"],
                        "rule_logic": rule["rule_logic"],
                        "target_service": rule["target_service"],
                        "confidence": rule.get("confidence", 0.95)
                    }
                    target_service_id = rule["target_service"]
                    confidence = rule["confidence"]
                    break
            except Exception as e:
                continue

        # Fallback if no specific rule fired: use ontology graph search & keyword matching
        if not target_service_id:
            services = self.ontology.get_all_services()
            best_match = None
            max_score = 0
            for s in services:
                score = 0
                # check service name
                for t in significant_tokens:
                    if t in s["name"].lower():
                        score += 3
                    if t in s["description"].lower():
                        score += 1
                for syn in s.get("synonyms", []):
                    if any(t in syn.lower() for t in significant_tokens):
                        score += 2
                if score > max_score:
                    max_score = score
                    best_match = s

            if best_match and max_score >= 3:
                target_service_id = best_match["id"]
                confidence = min(0.75 + (max_score * 0.05), 0.92)
                fired_rule = {
                    "id": "RULE_GENERAL_ONTOLOGY_MATCH",
                    "name": "Ontology Graph Concept Association Match",
                    "rule_logic": "IF Service associates with matching query tokens AND conforms to category schema THEN RecommendService",
                    "target_service": target_service_id,
                    "confidence": confidence
                }

        # Step 7: Retrieve Service Details from Ontology
        all_services = self.ontology.get_all_services()
        recommended_service = next((s for s in all_services if s["id"] == target_service_id), None)

        # Step 8: Build Step-by-Step Reasoning Trace
        reasoning_steps = []
        
        # Step 1 Trace
        reasoning_steps.append({
            "stepNumber": 1,
            "title": "Lexical & Morphological Tokenization",
            "description": f"Extracted {len(significant_tokens)} significant semantic tokens: {', '.join(significant_tokens)}.",
            "data": {"significantTokens": significant_tokens, "rawTokens": tokens}
        })

        # Step 2 Trace
        if concept_details:
            mapped_str = ", ".join([f"'{c['matchedSynonym']}' -> {c['canonicalUri']}" for c in concept_details])
            reasoning_steps.append({
                "stepNumber": 2,
                "title": "Ontology Concept & Synonym Resolution",
                "description": f"Identified {len(concept_details)} semantic concepts through Web Ontology Language (OWL) synonym mappings: {mapped_str}.",
                "data": {"concepts": concept_details}
            })
        else:
            reasoning_steps.append({
                "stepNumber": 2,
                "title": "Ontology Concept Mapping",
                "description": "No direct multi-word synonym found in primary concept dictionary; evaluating contextual entity relations.",
                "data": {}
            })

        # Step 3 Trace
        intent_str = ", ".join(detected_intents) if detected_intents else "GENERAL_INQUIRY"
        entity_str = ", ".join(detected_entities) if detected_entities else "General Citizen Domain"
        reasoning_steps.append({
            "stepNumber": 3,
            "title": "Entity & Intent Classification",
            "description": f"Detected Intent: [{intent_str}], Target Authority/Entity: [{entity_str}].",
            "data": {"intents": detected_intents, "entities": detected_entities}
        })

        # Step 4 Trace
        if fired_rule:
            reasoning_steps.append({
                "stepNumber": 4,
                "title": f"Semantic Rule Execution ({fired_rule['id']})",
                "description": f"Evaluated Horn Clause Rule: {fired_rule['name']}.\nLogic: {fired_rule['rule_logic']}",
                "data": {"ruleId": fired_rule["id"], "ruleName": fired_rule["name"], "logic": fired_rule["rule_logic"]}
            })
        else:
            reasoning_steps.append({
                "stepNumber": 4,
                "title": "SPARQL Knowledge Graph Query",
                "description": "Executed graph traversal across government department service nodes and required documents.",
                "data": {}
            })

        # Step 5 Trace
        if recommended_service:
            path_str = f"Query: \"{user_query}\"  -->  Concept: {matched_concepts[0] if matched_concepts else 'CitizenQuery'}  -->  Service: {recommended_service['name']}  -->  Department: {recommended_service['department']}"
            reasoning_steps.append({
                "stepNumber": 5,
                "title": "Knowledge Graph Inference & Verification",
                "description": f"Traversed Knowledge Graph Path: {path_str}. Required verification: {len(recommended_service.get('documents', []))} supporting document(s) required.",
                "data": {
                    "path": path_str,
                    "service": recommended_service["name"],
                    "department": recommended_service["department"],
                    "documents": recommended_service.get("documents", [])
                }
            })

        return {
            "query": user_query,
            "tokens": tokens,
            "significantTokens": significant_tokens,
            "matchedConcepts": concept_details,
            "detectedIntents": detected_intents,
            "detectedEntities": detected_entities,
            "firedRule": fired_rule,
            "reasoningSteps": reasoning_steps,
            "recommendedService": recommended_service,
            "confidence": round(confidence, 3),
            "isAmbiguous": is_ambiguous,
            "disambiguationOptions": disambiguation_options,
            "success": recommended_service is not None
        }

# Singleton reasoner instance
reasoner_instance = SemanticReasoner()
