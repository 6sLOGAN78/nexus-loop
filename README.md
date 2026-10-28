# Nexus Loop — Deterministic Quality-Control Loop for Deployed AI Agents

**Team:** Mayush Aura · **Institution:** Indian Institute of Technology Patna  
**Event:** Yellow.ai TechQuest — Endterm Submission  
**Machine Score:** **55.0 / 55.0** (Deterministic Practice Kit Scorecard)  
**Status:** Complete, Offline-First, Zero Third-Party Python Dependencies  

---

## Executive Summary

**Nexus Loop** is an automated, deterministic quality-control loop for already-deployed customer-facing AI agents. Rather than relying on non-deterministic LLM judgements for factual telemetry, Nexus Loop reads production logs, pinpoints regressions, separates true root causes from traffic shifts, proposes minimal surgical fixes, verifies candidate fixes against a seeded replay harness, and presents an actionable, loss-averse decision card to an operator with a mandatory approval/rejection audit trail.

Everything required to run the pipeline and operator console is self-contained and operates completely offline: no external network requests, no remote CDNs, no API keys, and no model downloads.

```
       ┌──────────────────────┐
       │   Production Logs    │ (sessions.jsonl.gz, agent_steps.jsonl.gz, config_timeline.csv)
       └──────────┬───────────┘
                  │ 1-pass ingestion
                  ▼
       ┌──────────────────────┐
       │  Detection & Decoys  │ (Welch's t-test window scanning; KB gap, tool break, prompt bug)
       └──────────┬───────────┘ (Traffic mix, load surges, judge changes dismissed as lookalikes)
                  │
                  ▼
       ┌──────────────────────┐
       │  Golden Set & Replay │ (Top-decile baseline frozen BEFORE prescription; hypothesis replayed)
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │   loop-report.json   │ (Validated against official schema with honesty passports)
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │   Operator Console   │ (Offline HTML/CSS/JS, Approve/Reject/Defer, atomic write-back)
       └──────────────────────┘
```

---

## The Two Non-Negotiable Rules

1. **Never ask a language model for a fact the logs already record.**  
   If telemetry contains timestamps, error codes, token counts, tool payloads, or step types, extract and aggregate them deterministically. Never hallucinate metrics via prompts.
2. **Never change the yardstick to make a result look better.**  
   Metric definitions, human rubrics, judge versions, and baseline cohorts are immutable. A traffic shift or judge version change is not a service failure, and an unanswerable question is met with an explicit refusal, never an invented figure.

---

## Scorecard (55.0 / 55.0 Machine Points)

The pipeline deterministically achieves the maximum possible machine score:

```
==========================================================================
NEXUS LOOP  ·  scorecard
  team    Mayush Aura
  corpus  A   (ground truth: variant A)
==========================================================================

Diagnostic accuracy     20.0 / 20   [########################]
     HIT   F1  lag=0d  cohort=ok  cause=kb.gap             -> 6.7/6.7
     HIT   F2  lag=0d  cohort=ok  cause=tool.contract_break -> 6.7/6.7
     HIT   F3  lag=0d  cohort=ok  cause=prompt.regression  -> 6.7/6.7

Specificity             15.0 / 15   [########################]
     CLEAN D1 — examined and correctly dismissed (traffic mix shift)
     CLEAN D2 — examined and correctly dismissed (load surge)
     CLEAN D3 — examined and correctly dismissed (judge boundary)

Loop completeness        8.0 / 8    [########################]
     standard: 5 cohort standards mined
     verification against replay endpoint supported
     self_assessment closed-loop verification contract

Honesty                 12.0 / 12   [########################]
     coverage on tool metrics matches telemetry hole (v2_flow exclusion: 4/4)
     calibration published against human rubric labels
     gap spec for A11 names required event and all 4 fields
     fidelity correctly marked for judged (A09) and measured (A04)
--------------------------------------------------------------------------
SUBTOTAL                55.0 / 55   (machine-scored)
--------------------------------------------------------------------------
```

---

## Deliverables & Repository Layout

| Path | Description |
|---|---|
| **Core Pipeline & Application** | |
| `run.py` | One-command entrypoint: loads the kit, detects regressions, dismisses decoys, answers asks, freezes golden sets, verifies fixes, validates schema, and writes `out/loop-report.json`. |
| `nexus_loop/` | The core Python package (ingestion, features, coverage, detectors, decoys, asks, standards, replay client, report assembly, validator). |
| `nexus_loop/app.py` | Built-in HTTP server providing `/`, `/report.json`, `/decision`, and `/health` with strict offline CSP. |
| `nexus_loop/static/` | Modular offline operator console: `index.html`, `app.css`, `app.js`, and offline bundled woff2 fonts (`fonts/`). |
| `out/` | Output directory containing `loop-report.json` and `golden_set.json` (runtime `decisions.log` generated upon operator action). |
| `kit/` | The practice dataset: 80k+ sessions, steps, turns, config timeline, ground truth, and catalog (~33 MB). |
| **Reports & Certificates** | |
| `Yellow.ai_ES_MayushAura_EndReport.pdf` | The official 8-page Endterm Report: methodology, architecture, mathematical alignment, and results. |
| `Certificates/` | Turnitin verification reports: `Yellow.ai_ES_MayushAura_AICheckReport.pdf` and `Yellow.ai_ES_MayushAura_PlagiarismReport.pdf`. |
| `report/` | LaTeX source code (`endterm-report.tex`), figures, markdown draft, and PDF builds. |
| **Presentation & Media** | |
| `presentation-8-minute/` | Complete 8-minute pitch presentation kit: `full-script.md`, `cue-cards/`, `rehearsal-sheet.md`, and `timing.csv`. |
| `figma-slide-assets/` | High-fidelity slide assets, automated HTML panel captures, typography, and motion capture videos. |
| `composition_2026-09-30_17-21-58.mp4` | High-definition recorded video demo and pitch presentation walkthrough. |
| **Landing Page & Web App** | |
| `landing/` | Standalone Next.js + Tailwind web application showcasing the Nexus Loop product narrative using the Steep design aesthetic. |
| `nexus-loop-landing-spec.md` | Comprehensive design and copy specification for the Nexus Loop landing experience. |
| **Yellow.ai Platform Integration** | |
| `yellow-ai-port/` | Ready-to-deploy port for the Yellow.ai Skills platform: knowledge base zip, manifest, agent instructions, and setup guide. |
| **Tooling & Testbeds** | |
| `tools/nexus-loop-kit/` | Organiser tooling: JSON schema, replay service (`serve.py`), and scoring harness (`score.py`). |
| `tools/testbed/` | Multi-corpus generator and evaluation harness for held-out corpus testing. |
| `nexus_loop/test_app.py` | Complete unit test suite verifying offline static serving, security headers, atomic decision persistence, and decision note exports. |
| **Submission & Reference Deliverables** | |
| `submission/` | Official competition submission package: `Yellow.ai_ES_MayushAura.zip` and unpacked submission tree. |
| `YellowAI_PS_TechQuest (1).pdf` | Official Yellow.ai TechQuest Problem Statement specification. |
| `examples/` | Standalone reference artifacts: pre-rendered `demo.html` operator screen and `sample-report.json`. |
| **Documentation** | |
| `docs/` | Comprehensive technical documentation: `solution-overview.md`, `submission-note.md`, `advisory-agent-harness.md`, `findings-and-fixes.md`, `manager-english.md`, `ux-psychology.md`, `report-audit.md`, and `edge-cases.md`. |

---

## Quick Start

### 1. Prerequisites
- **Python:** 3.9 or newer (tested on Python 3.10 and 3.12).
- **Dependencies:** Standard library only! No `pip install` required for core pipeline or operator console.
- **Node.js (Optional):** Required only if running the `landing/` Next.js frontend.

### 2. Run the Full Pipeline

Start the local replay service in a separate terminal (optional, verifies proposed fixes against the test harness):
```bash
python3 tools/nexus-loop-kit/replay/serve.py --kit kit --port 8719
```

Run the pipeline:
```bash
python3 run.py --kit kit --team "Mayush Aura" --out out/loop-report.json
```
*(If running without the replay service, append `--no-replay`)*

### 3. Open the Operator Decision Screen

```bash
python3 -m nexus_loop.app --report out/loop-report.json --port 8765
```
Open **`http://127.0.0.1:8765`** in your browser.

- Browse **Findings** (true regressions with financial impact and loss-averse framing).
- Inspect **Refusals** (honestly refused questions such as A11 failover rate and ungrounded LLM judges).
- Review **Metrics** (16 measured metrics with passport telemetry and fidelity tracking).
- Take action: select **Approve**, **Reject**, or **Defer**, type your reason, and commit. Decisions are written back atomically to `out/loop-report.json` and recorded in `out/decisions.log`.
- Export signed handoff notes with **Copy decision note**.

### 4. Verify with Automated Tests

Run the Python unit test suite:
```bash
python3 -m unittest discover -s nexus_loop -p "test_*.py"
```

Score against the ground-truth key:
```bash
python3 tools/nexus-loop-kit/score.py \
  --report out/loop-report.json \
  --ground-truth kit/ground_truth/ground_truth.json
```

Run the held-out testbed:
```bash
python3 tools/testbed/make_corpora.py --out-dir /tmp/nexus-testbed/pool --secrets pool-alpha,pool-bravo
python3 tools/testbed/evaluate.py --candidates tools/testbed/candidates.json --kits-dir /tmp/nexus-testbed/pool --quick
```

### 5. Launch the Next.js Landing Page (Optional)

```bash
cd landing
npm install
npm run dev
```
Open **`http://localhost:3000`** to view the landing page.

---

## Architectural Deep Dive

### 1. Root Cause Detection vs. Lookalike Dismissal
Nexus Loop scans log series using Welch's t-test to detect the exact onset day ($z \ge 4.0$) and isolates:
- **KB Gap (`kb.gap`):** Resolution rate collapses on a specific intent (`premium_card_info`), while peer intents on the same agent family remain healthy. Attributed to the nearest documentation change or born-broken launch.
- **Tool Contract Break (`tool.contract_break`):** Tool returns HTTP 200 with an empty body, resulting in zero containment on `order_status`.
- **Prompt Regression (`prompt.regression`):** Step efficiency worsens by >20% following an agent version bump, with sibling control agents unaffected.

Critically, three deceptive signals are examined and explicitly dismissed as **Not a problem**:
1. **Traffic Mix Shift (acme-bank):** A surge in intrinsically low-resolution intents changes aggregate performance without any underlying software regression. Handled via mix-adjusted counterfactual rates.
2. **Traffic Surge / Load (northwind-retail):** A 3x traffic spike increases absolute volume but error rates remain within standard deviations.
3. **Judge Version Boundary:** Rubric judge calibration changes from v1 to v2; historical trends across this boundary are rejected to prevent artificial alarms.

### 2. Aggressive Honesty & Structured Gaps
- **The Telemetry Hole (A04):** `v2_flow` agents do not record step-level tool telemetry. Rather than treating missing tools as 0% failure, Nexus Loop excludes `v2_flow` from the denominator and publishes measured tool coverage ($72.1\%$ for Acme, $93.1\%$ for Northwind).
- **A11 (Failover Rate):** Production logs do not record runtime failover events. The system refuses to proxy this with LLM retries (which are quality retries, not infrastructure failovers), marking A11 as `NOT_MEASURABLE` and specifying the exact missing event schema: `from_target, to_target, reason, recovered`.
- **A09 (User Frustration):** Requires a dedicated calibrated judge; Nexus Loop refuses to guess without a validated model.

### 3. Golden Set Freezing & Replay
Before any fix is prescribed, 30 eligible baseline sessions in the top efficiency decile are frozen to `out/golden_set.json`. The candidate fix is submitted to the replay testbed to verify that the target intent improves without regressing the golden set.

---

## What is Real, Stubbed, Simulated

| Aspect | Status | Implementation Detail |
|---|---|---|
| **Log Ingestion & Parsing** | **Real** | Single-pass ingestion of gzip JSONL logs, strict schema checks, orphan preservation. |
| **Statistical Detection** | **Real** | Welch's t-test window scanning, peer-agent controls, mix-adjusted rates. |
| **Decision Audit Loop** | **Real** | HTTP server, temp-file atomic replacement, schema re-validation, `decisions.log`. |
| **Offline Console UI** | **Real** | Zero-remote HTML/CSS/JS, bundled woff2 fonts, strict CSP headers. |
| **LLM Inference** | **Stubbed** | Logged facts stay in deterministic code; no LLM API calls are made. |
| **Frustration Judge (A09)** | **Stubbed** | Refused honestly as `REQUIRES_NEW_JUDGE`. |
| **Replay Service** | **Simulated** | Seeded replay harness verifies proposed fixes against synthetic test cohorts. |

---

## Authors & Credits

**Team Mayush Aura**  
Indian Institute of Technology Patna  
- Ayush Maurya ([@6sLOGAN78](https://github.com/6sLOGAN78))
- Mayookh Ghosh ([@Man1ac-1773](https://github.com/Man1ac-1773))
- Developed for the **Yellow.ai TechQuest Hackathon**

- Anupam Sharma ([@Anupamgt](https://github.com/Anupamgt))
