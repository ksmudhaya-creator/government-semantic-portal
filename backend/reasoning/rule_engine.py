"""
Rule-Based Semantic Reasoning Engine
Implements Horn Clause rules, concept taxonomy matching, intent classification,
and inference logic over the Government Services Ontology.
"""

import re

# Canonical concept definitions and their lexical variants / synonyms
CONCEPT_TAXONOMY = {
    "ResidentialAddress": {
        "canonical": "concept:ResidentialAddress",
        "label": "Residential Address & Location",
        "synonyms": [
            "house location", "home location", "home address", "house address", 
            "residential address", "residence", "living place", "flat address", 
            "street address", "permanent address", "current address", "pata", 
            "ghar ka pata", "relocate", "relocation", "shifting house", "moved to", 
            "new house", "change location", "shifted", "area change"
        ]
    },
    "IdentityCard": {
        "canonical": "concept:IdentityCard",
        "label": "National Identity Credential",
        "synonyms": [
            "identity card", "id card", "identity proof", "id proof", "pehechan patra", 
            "identity document", "gov id", "national id", "lost my card", "lost identity"
        ]
    },
    "DrivingLicence": {
        "canonical": "concept:DrivingLicence",
        "label": "Motor Vehicle Driving Licence",
        "synonyms": [
            "driving licence", "driving license", "driver license", "driver licence", 
            "dl", "learner licence", "learning licence", "rto licence", "gaadi licence", 
            "two wheeler licence", "four wheeler licence", "driving permit", "parivahan licence"
        ]
    },
    "TaxIdentification": {
        "canonical": "concept:TaxIdentification",
        "label": "Permanent Account Number (Tax ID)",
        "synonyms": [
            "pan", "pan card", "pancard", "tax id", "form 49a", "taxpayer id", 
            "income tax id", "income tax card", "permanent account number", "tax identification"
        ]
    },
    "ElectoralRegistration": {
        "canonical": "concept:ElectoralRegistration",
        "label": "Voter Identification & Electoral Roll",
        "synonyms": [
            "voter id", "voter card", "voting card", "epic", "epic card", "form 6", 
            "form 8", "election card", "voter registration", "matdata card", "matdata suchi"
        ]
    },
    "CasteClassification": {
        "canonical": "concept:CasteClassification",
        "label": "Community & Caste Category",
        "synonyms": [
            "caste certificate", "community certificate", "jaati praman patra", 
            "caste cert", "obc certificate", "sc certificate", "st certificate", 
            "ews certificate", "reservation certificate", "social category proof"
        ]
    },
    "IncomeVerification": {
        "canonical": "concept:IncomeVerification",
        "label": "Annual Income Verification",
        "synonyms": [
            "income certificate", "aay praman patra", "income cert", "salary certificate", 
            "family income", "low income certificate", "proof of income", "scholarship income"
        ]
    },
    "TravelCredential": {
        "canonical": "concept:TravelCredential",
        "label": "International Travel Credential",
        "synonyms": [
            "passport", "pass port", "tatkaal passport", "psk", "international travel document", 
            "foreign travel permit", "passport renewal"
        ]
    },
    "VehicleRegistration": {
        "canonical": "concept:VehicleRegistration",
        "label": "Motor Vehicle Registration & Ownership",
        "synonyms": [
            "rc", "registration certificate", "vehicle transfer", "car transfer", 
            "bike rc", "rc ownership", "transfer ownership", "vahan transfer", 
            "second hand vehicle rc", "form 29 30"
        ]
    },
    "FoodSecurity": {
        "canonical": "concept:FoodSecurity",
        "label": "Public Distribution Food Security",
        "synonyms": [
            "ration card", "ration", "rashan card", "rashan patra", "bpl card", 
            "apl card", "nfsa", "subsidized grains", "food security card"
        ]
    },
    "CivilBirth": {
        "canonical": "concept:CivilBirth",
        "label": "Vital Civil Registration - Birth",
        "synonyms": [
            "birth certificate", "janam praman patra", "child birth registration", 
            "newborn registration", "birth proof", "crs birth"
        ]
    }
}

# Intents dictionary
INTENT_PATTERNS = {
    "UPDATE": [
        "change", "update", "modify", "correct", "correction", "shifting", 
        "relocate", "alter", "amend", "badalna", "sudhar"
    ],
    "NEW_APPLICATION": [
        "apply", "new", "fresh", "register", "registration", "create", "enroll", 
        "enrollment", "make", "get", "first time", "how do i get", "banaana"
    ],
    "RENEWAL": [
        "renew", "renewal", "extend", "validity", "expired", "expiry", "re-issue", "reissue"
    ],
    "RETRIEVAL_DUPLICATE": [
        "lost", "lost my", "missing", "misplaced", "duplicate", "reprint", "download", 
        "damaged", "kho gaya", "gum gaya", "retrieve"
    ],
    "LINK_AUTHENTICATE": [
        "link", "connect", "attach", "bind", "otp not received", "verify", "phone change"
    ]
}

# Rule definitions
RULES = [
    {
        "id": "RULE_001_AADHAAR_ADDRESS_UPDATE",
        "name": "Aadhaar Residential Address Modification Rule",
        "rule_logic": "IF (Concept == ResidentialAddress) ∧ (Entity in [Aadhaar, UIDAI] or Text contains 'aadhaar') ∧ (Intent == UPDATE) THEN Service = AadhaarAddressUpdate",
        "target_service": "AadhaarAddressUpdate",
        "conditions": lambda concepts, entities, intents, text: (
            "ResidentialAddress" in concepts and 
            ("Aadhaar" in entities or "aadhaar" in text or "aadhar" in text) and
            ("UPDATE" in intents or "change" in text or "update" in text or "shift" in text or "relocate" in text)
        ),
        "confidence": 0.99
    },
    {
        "id": "RULE_002_AADHAAR_NEW_ENROLLMENT",
        "name": "Aadhaar Fresh Enrollment Rule",
        "rule_logic": "IF (Entity in [Aadhaar, UIDAI] or Text contains 'aadhaar') ∧ (Intent == NEW_APPLICATION or Text contains ['new', 'first time', 'enroll', 'apply']) ∧ NOT (Concept == ResidentialAddress) THEN Service = AadhaarNewEnrollment",
        "target_service": "AadhaarNewEnrollment",
        "conditions": lambda concepts, entities, intents, text: (
            ("Aadhaar" in entities or "aadhaar" in text or "aadhar" in text) and
            ("NEW_APPLICATION" in intents or "enroll" in text or "register" in text or "first time" in text or "apply" in text) and
            "ResidentialAddress" not in concepts and
            "UPDATE" not in intents
        ),
        "confidence": 0.98
    },
    {
        "id": "RULE_003_AADHAAR_PHONE_LINK",
        "name": "Aadhaar Mobile/Email Authentication Link Rule",
        "rule_logic": "IF (Entity in [Aadhaar, UIDAI] or Text contains 'aadhaar') ∧ (Text contains ['mobile', 'phone', 'number', 'email', 'otp']) THEN Service = AadhaarMobileLink",
        "target_service": "AadhaarMobileLink",
        "conditions": lambda concepts, entities, intents, text: (
            ("Aadhaar" in entities or "aadhaar" in text or "aadhar" in text) and
            any(w in text for w in ["mobile", "phone", "number", "email", "otp"])
        ),
        "confidence": 0.97
    },
    {
        "id": "RULE_004_PAN_NEW_APPLICATION",
        "name": "Permanent Account Number Fresh Issuance Rule",
        "rule_logic": "IF (Concept == TaxIdentification or Text contains 'pan') ∧ (Intent == NEW_APPLICATION or Text contains ['apply', 'get', 'new', 'form 49a']) ∧ NOT (Intent == UPDATE) THEN Service = PANCardNewApplication",
        "target_service": "PANCardNewApplication",
        "conditions": lambda concepts, entities, intents, text: (
            ("TaxIdentification" in concepts or "pan" in text) and
            ("NEW_APPLICATION" in intents or any(w in text for w in ["apply", "get", "new", "49a", "make"])) and
            "UPDATE" not in intents and "lost" not in text
        ),
        "confidence": 0.98
    },
    {
        "id": "RULE_005_PAN_CORRECTION_REPRINT",
        "name": "PAN Correction and Duplicate Reprint Rule",
        "rule_logic": "IF (Concept == TaxIdentification or Text contains 'pan') ∧ (Intent in [UPDATE, RETRIEVAL_DUPLICATE] or Text contains ['correct', 'change', 'lost', 'damaged', 'reprint']) THEN Service = PANCardCorrection",
        "target_service": "PANCardCorrection",
        "conditions": lambda concepts, entities, intents, text: (
            ("TaxIdentification" in concepts or "pan" in text) and
            ("UPDATE" in intents or "RETRIEVAL_DUPLICATE" in intents or any(w in text for w in ["correct", "change", "lost", "reprint", "damage", "duplicate"]))
        ),
        "confidence": 0.97
    },
    {
        "id": "RULE_006_PASSPORT_FRESH",
        "name": "Passport Fresh Issuance Rule",
        "rule_logic": "IF (Concept == TravelCredential or Text contains 'passport') ∧ (Intent == NEW_APPLICATION or Text contains ['new', 'apply', 'fresh']) ∧ NOT (Intent == RENEWAL) THEN Service = PassportFreshApplication",
        "target_service": "PassportFreshApplication",
        "conditions": lambda concepts, entities, intents, text: (
            ("TravelCredential" in concepts or "passport" in text) and
            ("NEW_APPLICATION" in intents or any(w in text for w in ["apply", "new", "fresh", "get"])) and
            "RENEWAL" not in intents and "renew" not in text and "reissue" not in text
        ),
        "confidence": 0.98
    },
    {
        "id": "RULE_007_PASSPORT_RENEWAL",
        "name": "Passport Renewal & Reissue Rule",
        "rule_logic": "IF (Concept == TravelCredential or Text contains 'passport') ∧ (Intent == RENEWAL or Text contains ['renew', 'reissue', 're-issue', 'expired', 'exhausted', 'pages']) THEN Service = PassportRenewalReissue",
        "target_service": "PassportRenewalReissue",
        "conditions": lambda concepts, entities, intents, text: (
            ("TravelCredential" in concepts or "passport" in text) and
            ("RENEWAL" in intents or any(w in text for w in ["renew", "reissue", "re-issue", "expire", "expired", "pages"]))
        ),
        "confidence": 0.98
    },
    {
        "id": "RULE_008_DRIVING_LICENCE_LEARNER",
        "name": "Learner's Driving Licence Application Rule",
        "rule_logic": "IF (Concept == DrivingLicence) ∧ (Text contains ['learn', 'learner', 'learning', 'll', 'first time']) THEN Service = DrivingLicenceLearner",
        "target_service": "DrivingLicenceLearner",
        "conditions": lambda concepts, entities, intents, text: (
            "DrivingLicence" in concepts and
            any(w in text for w in ["learner", "learning", "learn", " ll ", "first time"])
        ),
        "confidence": 0.97
    },
    {
        "id": "RULE_009_DRIVING_LICENCE_RENEWAL",
        "name": "Driving Licence Validity Extension Rule",
        "rule_logic": "IF (Concept == DrivingLicence) ∧ (Intent == RENEWAL or Text contains ['renew', 'renewal', 'expire', 'expired']) THEN Service = DrivingLicenceRenewal",
        "target_service": "DrivingLicenceRenewal",
        "conditions": lambda concepts, entities, intents, text: (
            "DrivingLicence" in concepts and
            ("RENEWAL" in intents or any(w in text for w in ["renew", "renewal", "expire", "expired", "extend"]))
        ),
        "confidence": 0.98
    },
    {
        "id": "RULE_010_DRIVING_LICENCE_PERMANENT",
        "name": "Permanent Driving Licence Issuance Rule",
        "rule_logic": "IF (Concept == DrivingLicence) ∧ NOT (Intent == RENEWAL) ∧ NOT (Text contains 'learner') THEN Service = DrivingLicencePermanent",
        "target_service": "DrivingLicencePermanent",
        "conditions": lambda concepts, entities, intents, text: (
            "DrivingLicence" in concepts and
            "RENEWAL" not in intents and
            not any(w in text for w in ["renew", "renewal", "expire", "learner", "learning"])
        ),
        "confidence": 0.95
    },
    {
        "id": "RULE_011_VOTER_ID_ADDRESS_CORRECTION",
        "name": "Voter ID Shifting & Constituency Form 8 Rule",
        "rule_logic": "IF (Concept in [ElectoralRegistration, ResidentialAddress]) ∧ (Text contains ['voter', 'epic', 'form 8']) ∧ (Intent == UPDATE or Concept == ResidentialAddress) THEN Service = VoterIDAddressCorrection",
        "target_service": "VoterIDAddressCorrection",
        "conditions": lambda concepts, entities, intents, text: (
            ("voter" in text or "epic" in text or "form 8" in text) and
            ("ResidentialAddress" in concepts or "UPDATE" in intents or any(w in text for w in ["address", "shift", "change", "correction", "pata"]))
        ),
        "confidence": 0.97
    },
    {
        "id": "RULE_012_VOTER_ID_NEW_REGISTRATION",
        "name": "Voter ID Fresh Enrollment Form 6 Rule",
        "rule_logic": "IF (Concept == ElectoralRegistration or Text contains 'voter') ∧ (Intent == NEW_APPLICATION or Text contains ['new', 'apply', 'form 6', 'register']) THEN Service = VoterIDNewRegistration",
        "target_service": "VoterIDNewRegistration",
        "conditions": lambda concepts, entities, intents, text: (
            ("ElectoralRegistration" in concepts or "voter" in text or "epic" in text) and
            ("NEW_APPLICATION" in intents or any(w in text for w in ["new", "apply", "form 6", "register", "vote"])) and
            "ResidentialAddress" not in concepts and "UPDATE" not in intents
        ),
        "confidence": 0.98
    },
    {
        "id": "RULE_013_VEHICLE_RC_TRANSFER",
        "name": "Motor Vehicle Ownership Transfer Rule",
        "rule_logic": "IF (Concept == VehicleRegistration or Text contains ['rc', 'vehicle', 'car', 'bike']) ∧ (Text contains ['transfer', 'ownership', 'sell', 'buyer', 'second hand', 'name change']) THEN Service = VehicleRegistrationTransfer",
        "target_service": "VehicleRegistrationTransfer",
        "conditions": lambda concepts, entities, intents, text: (
            ("VehicleRegistration" in concepts or any(w in text for w in ["rc", "vehicle", "car", "bike", "vahan"])) and
            any(w in text for w in ["transfer", "ownership", "sell", "sold", "buyer", "second hand", "name change", "29", "30"])
        ),
        "confidence": 0.96
    },
    {
        "id": "RULE_014_RATION_CARD_APPLICATION",
        "name": "Public Distribution Ration Card Rule",
        "rule_logic": "IF (Concept == FoodSecurity or Text contains ['ration', 'rashan', 'bpl', 'nfsa', 'food security']) THEN Service = RationCardApplication",
        "target_service": "RationCardApplication",
        "conditions": lambda concepts, entities, intents, text: (
            "FoodSecurity" in concepts or any(w in text for w in ["ration", "rashan", "bpl", "nfsa", "food security"])
        ),
        "confidence": 0.96
    },
    {
        "id": "RULE_015_INCOME_CERTIFICATE",
        "name": "Revenue Income Certificate Rule",
        "rule_logic": "IF (Concept == IncomeVerification or Text contains ['income certificate', 'aay praman', 'income cert', 'annual income']) THEN Service = IncomeCertificate",
        "target_service": "IncomeCertificate",
        "conditions": lambda concepts, entities, intents, text: (
            "IncomeVerification" in concepts or any(w in text for w in ["income certificate", "aay praman", "income cert", "annual income", "salary cert"])
        ),
        "confidence": 0.97
    },
    {
        "id": "RULE_016_COMMUNITY_CASTE_CERTIFICATE",
        "name": "Statutory Community / Caste Certificate Rule",
        "rule_logic": "IF (Concept == CasteClassification or Text contains ['caste', 'community', 'jaati', 'obc', 'sc', 'st']) THEN Service = CommunityCasteCertificate",
        "target_service": "CommunityCasteCertificate",
        "conditions": lambda concepts, entities, intents, text: (
            "CasteClassification" in concepts or any(w in text for w in ["caste", "community", "jaati", "obc", "sc cert", "st cert", "reservation"])
        ),
        "confidence": 0.97
    },
    {
        "id": "RULE_017_BIRTH_CERTIFICATE",
        "name": "Civil Registration Birth Certificate Rule",
        "rule_logic": "IF (Concept == CivilBirth or Text contains ['birth', 'janam', 'newborn', 'child birth']) THEN Service = BirthCertificateRegistration",
        "target_service": "BirthCertificateRegistration",
        "conditions": lambda concepts, entities, intents, text: (
            "CivilBirth" in concepts or any(w in text for w in ["birth certificate", "janam", "newborn", "child birth", "birth registration"])
        ),
        "confidence": 0.98
    }
]
