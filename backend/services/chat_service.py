import uuid
from services.semantic_reasoner import reasoner_instance
from services.ontology_service import ontology_instance

class ChatService:
    def __init__(self):
        self.reasoner = reasoner_instance
        self.ontology = ontology_instance
        self.sessions = {}

    def get_or_create_session(self, session_id=None):
        if not session_id or session_id not in self.sessions:
            new_id = str(uuid.uuid4())
            self.sessions[new_id] = {
                "id": new_id,
                "history": [],
                "pendingDisambiguation": None
            }
            return self.sessions[new_id]
        return self.sessions[session_id]

    def reset_session(self, session_id):
        if session_id in self.sessions:
            self.sessions[session_id] = {
                "id": session_id,
                "history": [],
                "pendingDisambiguation": None
            }
        return {"status": "reset", "sessionId": session_id}

    def process_message(self, message, session_id=None):
        session = self.get_or_create_session(session_id)
        cleaned = message.strip()
        lower = cleaned.lower()

        # Check if user is replying to a pending disambiguation
        if session["pendingDisambiguation"]:
            pending = session["pendingDisambiguation"]
            session["pendingDisambiguation"] = None

            # User clicked or typed one of the options
            matched_option = None
            if "aadhaar" in lower or "aadhar" in lower:
                matched_option = "AadhaarAddressUpdate"
                reply_text = "You may need Aadhaar document retrieval or a replacement-related service. UIDAI allows you to download an e-Aadhaar or order an official Aadhaar PVC Card reprint online."
            elif "pan" in lower:
                matched_option = "PANCardCorrection"
                reply_text = "For a lost or damaged PAN Card, the Income Tax Department (via NSDL/UTIITSL) provides a Reprint of PAN Card facility without changing existing data."
            elif "voter" in lower or "epic" in lower:
                matched_option = "VoterIDAddressCorrection"
                reply_text = "For a lost Voter ID, you can download a digital e-EPIC directly from the Election Commission portal or file Form 8 for a replacement card."
            elif "licence" in lower or "license" in lower or "dl" in lower:
                matched_option = "DrivingLicenceRenewal"
                reply_text = "For a lost or damaged Driving Licence, you can apply for a Duplicate DL on the Ministry of Road Transport Parivahan Sarathi portal."

            if matched_option:
                all_srv = self.ontology.get_all_services()
                srv = next((s for s in all_srv if s["id"] == matched_option), None)
                bot_msg = {
                    "role": "assistant",
                    "text": reply_text,
                    "serviceCard": srv,
                    "quickReplies": ["What documents are required?", "How long does it take?", "Official website link"]
                }
                session["history"].append({"role": "user", "text": message})
                session["history"].append(bot_msg)
                return {"sessionId": session["id"], "reply": bot_msg}

        # Handle greetings
        if lower in ["hi", "hello", "namaste", "good morning", "good afternoon", "help"]:
            reply_text = (
                "Namaste! Welcome to the Intelligent Government Services AI Assistant. "
                "I use an OWL-based Semantic Reasoning Engine to help you locate the exact public service, "
                "understand eligibility, and discover required documents. How may I assist you today?"
            )
            bot_msg = {
                "role": "assistant",
                "text": reply_text,
                "quickReplies": [
                    "How can I change my house location in Aadhaar?",
                    "I lost my identity card.",
                    "Where can I renew my driving licence?",
                    "How do I apply for a PAN card?"
                ]
            }
            session["history"].append({"role": "user", "text": message})
            session["history"].append(bot_msg)
            return {"sessionId": session["id"], "reply": bot_msg}

        # Process via Semantic Reasoner
        reasoning_res = self.reasoner.process_query(cleaned)

        # Check if the query is ambiguous (Module 6 Example)
        if reasoning_res.get("isAmbiguous"):
            session["pendingDisambiguation"] = True
            reply_text = "Are you referring to your Aadhaar Card, PAN Card, Voter ID, or Driving Licence?"
            bot_msg = {
                "role": "assistant",
                "text": reply_text,
                "isDisambiguation": True,
                "options": [
                    {"label": "Aadhaar Card", "value": "Aadhaar"},
                    {"label": "PAN Card", "value": "PAN Card"},
                    {"label": "Voter ID Card", "value": "Voter ID"},
                    {"label": "Driving Licence", "value": "Driving Licence"}
                ],
                "quickReplies": ["Aadhaar", "PAN Card", "Voter ID", "Driving Licence"]
            }
            session["history"].append({"role": "user", "text": message})
            session["history"].append(bot_msg)
            return {"sessionId": session["id"], "reply": bot_msg}

        # If a service was recommended
        service = reasoning_res.get("recommendedService")
        if service:
            dept = service["department"]
            fee = service["serviceFee"]
            time_needed = service["processingTime"]
            docs = [d["name"] for d in service.get("documents", [])]
            docs_text = f"Required Documents: {', '.join(docs)}." if docs else "Check portal for specific biometric requirements."

            reply_text = (
                f"Based on your query, our Semantic Reasoning Engine identified the service: **{service['name']}**, "
                f"governed by the **{dept}**.\n\n"
                f"• **Description:** {service['description']}\n"
                f"• **Processing Time:** {time_needed} | **Fee:** {fee}\n"
                f"• **{docs_text}**"
            )

            bot_msg = {
                "role": "assistant",
                "text": reply_text,
                "serviceCard": service,
                "reasoningTrace": reasoning_res.get("reasoningSteps", []),
                "quickReplies": ["Show application steps", "What is the official website?", "Search another service"]
            }
        else:
            reply_text = (
                "I couldn't pinpoint a single official service for that specific query. "
                "Could you provide more context, such as whether you want to apply for a new card, update an existing credential, or request a certificate?"
            )
            bot_msg = {
                "role": "assistant",
                "text": reply_text,
                "quickReplies": [
                    "Aadhaar Services", "PAN Card Services", "Passport Services", 
                    "Driving Licence", "Income Certificate"
                ]
            }

        session["history"].append({"role": "user", "text": message})
        session["history"].append(bot_msg)
        return {"sessionId": session["id"], "reply": bot_msg}

# Singleton chat service
chat_instance = ChatService()
