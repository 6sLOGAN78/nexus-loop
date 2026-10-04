# Nexus Loop Report Audit: Algorithm Alignment & Humanization

This document provides a comprehensive audit of the `yellow_ai_report.pdf` report, checking its alignment with the implemented Python algorithms and evaluating it against the `manager-english.md` and `ux-psychology.md` repository guidelines. 

---

## Part 1: Algorithmic & Code Alignment

We audited the pipeline logic described in the paper against the actual `nexus_loop/` Python implementation.

### 1. Verified Alignments (Mathematically Sound)
The mathematical algorithms, thresholds, and data flows are highly honest and perfectly aligned with the provided code:
*   **Window Scanning (Sec 4.2 & 6.2):** The report claims a "shared window scanner finds the day window whose inside mean differs most... scored with a Welch z." This perfectly matches `series.best_window`, which calculates the Welch's t-test (`z`) for all valid windows and maximizes it, mathematically guaranteeing zero detection latency and finding the exact onset day.
*   **Detector Thresholds (Sec 4.2):** The relative and absolute thresholds cited in the report (e.g., tool lift of 4 points, efficiency ratio of 1.2, z=4 and z=5) perfectly match the constants defined in `detect.py` (`T.TOOL_MIN_Z = 4.0`, `T.EFF_MIN_RATIO = 1.20`, etc.).
*   **Golden Set Mining (Sec 8.1):** The report states the golden set is "30 eligible baseline sessions... top decile by efficiency." This perfectly matches `standards.py` where `GOLDEN_N = 30`, sessions are sorted by turns, and written atomically before prescriptions exist.
*   **Lookalikes (Sec 5.2):** The "three changes that look like regressions" perfectly map to the three specific decoy functions in `decoys.py` (`detect_traffic_mix`, `detect_load`, `detect_judge_boundary`).
*   **Calibration Bounds (Sec 12.2):** The claim that "If agreement reaches 0.995 we publish the tighter half-point reading or withhold" perfectly matches `validate.py`, which throws a schema error if `calibration.agreement >= 0.995`.

### 2. Algorithmic Mismatches (To Be Corrected)
*   **Detector Nomenclature (Sec 4.2):** The report states: *"The knowledge-base detector groups by tenant and intent."* 
    *   *Reality:* There is no dedicated "knowledge-base detector" in `detect.py`. There is `detect_resolution_drops` which groups by tenant and intent to find generic outcome failures, and *then* attributes the cause to `kb.gap` only if the telemetry proves it.
    *   *Fix:* Rename "knowledge-base detector" to **"resolution drop detector"** to accurately reflect the architecture.

---

## Part 2: Humanization & Repository Alignment

The report is written in an academic, strictly technical format. To align with the Operator Console's Canvas Design System philosophy defined in `manager-english.md` and `ux-psychology.md`, the following changes must be made.

### 1. Translate Technical Jargon to "Manager English"
The report exposes raw schema variables. The `manager-english.md` guide mandates specific translations for the UI:
*   Replace **`resolution_rate`** with **"Share we finished"**.
*   Replace **`turns_to_resolve`** with **"Turns to finish"**.
*   Replace **`tool_p95_latency_ms`** with **"Tool wait time"**.
*   Replace **`containment_rate`** with **"Share we handled end to end"**.
*   Replace diagnosis **`tool.contract_break`** with **"The tool said success but sent an empty answer"**.
*   Replace diagnosis **`kb.gap`** with **"The knowledge base has nothing for this question"**.

### 2. Restructure Around "Harm Before the Ask" (Loss Aversion)
In Sections 5 (Findings) and 6 (Diagnosis), the report currently explains the technical mechanism *before* the business impact. 
*   **Rule Violation:** `ux-psychology.md` strictly dictates "Harm before the ask." 
*   **Fix:** Move the impact block (e.g., "2,686 conversations affected", "213 would have resolved") to the very beginning of the finding. Frame the data as losses already incurred to trigger loss aversion, making inaction feel like an active choice.

### 3. Reframe False Alarms and Gaps (Aggressive Honesty)
Sections 5.2 ("False Alarms") and 7.1 ("Unanswerable Questions") use dry, academic framing.
*   **Rule Violation:** The UI relies on explicit "Not a problem" and "We will not invent" categories to fight confirmation bias and availability heuristic.
*   **Fix:** Rename "False Alarms" to **"Not a problem"**. Rename "Unanswerable Questions" to **"We will not invent"**. For example, instead of stating "A11 failover rate cannot be answered," explicitly declare: **"We will not invent a failover rate."** Make the absence of data a visible, first-class finding.

### 4. Stage 1 Transparency: Real vs. Simulated
Section 18 ("Assumptions") lists technical constraints as bullets.
*   **Fix:** Group these under a clear **"What is real, stubbed, simulated"** disclosure header, just like the UI. When discussing replay verification (Section 10), explicitly mute the "Before" metric as *simulated* so the reader does not falsely correlate it with live corpus numbers, preventing "authority confusion".

### 5. Simplify Ledes
The Abstract and Introduction use long, dense sentences ("We present Nexus Loop, a deterministic pipeline...").
*   **Fix:** Apply the "Story lede" rule. Open with one or two sharp sentences that state the harm and the decision. Example: *"Nexus Loop detects real agent failures, calculates the cost of waiting, and asks a human to approve the fix."*

### 6. The Human "Bias Brake"
Section 11 ("Decision Layer") describes the approval process mechanically.
*   **Fix:** Highlight that writing a reason for an Accept/Reject/Defer is a psychological "implementation intention" (slowing down the click to reduce bias). The *human* is the loop, and the required reason is the "bias brake."
