import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(ROOT, 'tools/nexus-loop-kit/examples/loop-report.level3.json'), 'r') as f:
    report = json.load(f)

# Add Finding for F3 (prompt.regression)
report['findings'].append({
    "id": "f6",
    "tenant": "acme-bank",
    "cohort": {
        "agent_id": "acme_main_v3"
    },
    "metric": "turns_to_resolve",
    "window": {
        "from_day": 46,
        "to_day": 56
    },
    "observed": 6.0,
    "expected": 4.0,
    "is_regression": True,
    "severity": "high",
    "evidence": [
        "turns-to-resolve rises ~60% while resolution rate stays flat",
        "cost per session roughly +80%"
    ],
    "impact": {
        "conversations_affected": 5000,
        "share_of_traffic": 0.25,
        "downstream": {
            "would_have_resolved_at_baseline": 0,
            "unplanned_handoffs": 0,
            "abandoned": 0
        },
        "cost_usd": 180.0,
        "days_running": 10,
        "derivation": "median turns 4 -> 6"
    },
    "audience": ["agent_builder"],
    "if_nothing_changes": "Agent stays verbose."
})

# Add Diagnosis for F3
report['diagnoses'].append({
    "id": "d6",
    "finding_id": "f6",
    "cause_class": "prompt.regression",
    "confidence": 0.95,
    "attributed_change": {
        "kind": "prompt",
        "day": 46
    },
    "evidence": ["prompt v4 deployed"]
})

# Add Prescription for F3
report['prescriptions'].append({
    "id": "p3",
    "diagnosis_id": "d6",
    "change_type": "prompt.edit",
    "target": "acme_main_v3",
    "description": "Fix over-confirming prompt behavior.",
    "autonomy_rung": "L2",
    "predicted_delta": {
        "metric": "turns_to_resolve",
        "from": 6.0,
        "to": 4.0
    },
    "decision": {
        "asking_approval_for": "prompt edit",
        "risk_if_diagnosis_wrong": "low",
        "would_not_ship_if": "fails golden set"
    },
    "approval": {
        "verdict": "accepted",
        "decided_by": "demo",
        "reason": "turns are too high",
        "at": "2026-09-05T12:00:00Z"
    }
})

# Add Verification for F3
report['verifications'].append({
    "prescription_id": "p3",
    "replay_run_id": "rp_abcd",
    "metric": "turns_to_resolve",
    "before": 6.0,
    "after": 4.0,
    "golden_set_pass": True,
    "verdict": "improved",
    "prediction_error": 0.0
})


# Add Finding for D2 (load_event)
report['findings'].append({
    "id": "f5",
    "tenant": "northwind-retail",
    "cohort": {},
    "metric": "tool_p95_ms",
    "window": {
        "from_day": 12,
        "to_day": 16
    },
    "observed": 3157,
    "expected": 1373,
    "is_regression": False,
    "not_a_regression_because": "a reliability event for the platform view, not a quality regression; it self-corrects inside the sustain window",
    "severity": "low",
    "evidence": [
        "flash sale, 4.0x volume",
        "quality is flat throughout"
    ]
})

# Add Diagnosis for D2
report['diagnoses'].append({
    "id": "d5",
    "finding_id": "f5",
    "cause_class": "load_event",
    "confidence": 0.99,
    "attributed_change": None,
    "evidence": ["volume spike"]
})

# Update self-assessment cycles to > 1
report['self_assessment']['cycles'] = 5

with open(os.path.join(ROOT, 'experiments/loop-report.55.json'), 'w') as f:
    json.dump(report, f, indent=2)

print("Done writing experiments/loop-report.55.json")
