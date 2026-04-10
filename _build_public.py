"""Build public questions JSON without energy/scoring/archetypes_map."""
import json, sys
sys.stdout.reconfigure(encoding="utf-8")

with open("api/_data/maru_data.json", encoding="utf-8") as f:
    full = json.load(f)

public = {
    "_meta": {
        "version": full["_meta"]["version"],
        "date": full["_meta"]["date"],
        "structure": full["_meta"]["structure"]
    },
    "blocks": full["blocks"],
    "questions": []
}

for q in full["questions"]:
    public_q = {
        "id": q["id"],
        "text": q["text"],
        "screen_block": q.get("screen_block"),
        "answers": [{"text": a["text"]} for a in q["answers"]]
    }
    public["questions"].append(public_q)

with open("maru_questions_public.json", "w", encoding="utf-8") as f:
    json.dump(public, f, ensure_ascii=False, indent=2)

print(f"Built maru_questions_public.json")
print(f"  Q: {len(public['questions'])}")
print(f"  size: {sum(len(json.dumps(q,ensure_ascii=False)) for q in public['questions'])} bytes")
print(f"  no energy: {all('energy' not in a for q in public['questions'] for a in q['answers'])}")
