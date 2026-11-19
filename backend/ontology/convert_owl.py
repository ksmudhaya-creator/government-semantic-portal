import rdflib
import os

ttl_path = os.path.join(os.path.dirname(__file__), "government.ttl")
owl_path = os.path.join(os.path.dirname(__file__), "government.owl")

g = rdflib.Graph()
print(f"Parsing {ttl_path}...")
g.parse(ttl_path, format="turtle")
print(f"Loaded {len(g)} triples.")

print(f"Serializing to {owl_path} in xml format...")
g.serialize(destination=owl_path, format="xml")
print("Successfully generated government.owl!")
