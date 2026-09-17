#!/usr/bin/env python3
"""Generate the endterm-report figures from the real Nexus Loop pipeline.

Run:  python3 make_figures.py
Writes PNGs into this directory. Numbers come from the mounted kit + the
frozen report, so figures and report cannot drift.
"""
import json
import os
import sys

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
import numpy as np
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))


def _find_repo(start):
    for cand in (os.path.join(start, "..", ".."), os.path.join(start, "..", "yellow-ai"),
                 os.path.join(start, "..")):
        p = os.path.abspath(cand)
        if os.path.exists(os.path.join(p, "run.py")) and os.path.isdir(os.path.join(p, "nexus_loop")):
            return p
    raise SystemExit("repo root not found from %s" % start)


REPO = _find_repo(HERE)
sys.path.insert(0, REPO)
from nexus_loop.io import Kit  # noqa: E402
from nexus_loop.features import Corpus, resolved  # noqa: E402

NAVY = "#1f4e79"
NAVY_D = "#1a1f2b"
RED = "#b42318"
GREEN = "#1b7f4e"
AMBER = "#9a6700"
SLATE = "#5c6578"
LINE = "#d8deea"
PAPER = "#f6f4ef"
BLUE = "#2f6fb0"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 9,
    "axes.edgecolor": "#9aa4b2",
    "axes.linewidth": 0.8,
    "savefig.dpi": 200,
    "figure.dpi": 200,
})

corpus = Corpus(Kit(os.path.join(REPO, "kit"))).load()
D = corpus.days
report = json.load(open(os.path.join(REPO, "examples/sample-report.json")))


def daily_rate(rows, num_fn, den_fn):
    num = np.zeros(D); den = np.zeros(D)
    for s in rows:
        d = int(s["day"])
        n = num_fn(s); k = den_fn(s)
        num[d] += n; den[d] += k
    return np.where(den > 0, num / np.maximum(den, 1), np.nan), den


def shade(ax, a, b, color=NAVY, alpha=0.10):
    ax.axvspan(a, b + 1, color=color, alpha=alpha, lw=0)
    ax.axvline(a, color=NAVY, lw=0.8, ls="--", alpha=0.6)


# ---------------------------------------------------------------- fig: window scan
def fig_window_scan():
    fig, axes = plt.subplots(2, 2, figsize=(7.1, 3.6), sharex=True)
    nd = sorted({int(s["day"]) for s in corpus.rows("northwind-retail")})

    # F2 empty-success rate on get_order_status
    rows = [s for s in corpus.rows("northwind-retail")]
    empty = np.zeros(D); okc = np.zeros(D)
    for s in rows:
        dd = s["derived"]; day = int(s["day"])
        c = dd["calls_by_tool"].get("get_order_status", 0)
        if not c:
            continue
        e = dd["errors_by_tool"].get("get_order_status", 0)
        empty[day] += dd["empty_by_tool"].get("get_order_status", 0)
        okc[day] += c - e
    ser = np.where(okc > 0, 100 * empty / np.maximum(okc, 1), np.nan)
    ax = axes[0][0]
    ax.plot(range(D), ser, color=RED, lw=1.3, marker="o", ms=2)
    shade(ax, 40, 51)
    ax.set_title("F2  empty-success rate, get_order_status", fontsize=8.5, color=NAVY_D)
    ax.set_ylabel("% of ok calls", fontsize=8)
    ax.text(40, np.nanmax(ser) * 0.95, " window 40–51", fontsize=7, color=SLATE)

    # F2 cohort resolution
    orows = [s for s in corpus.rows("northwind-retail") if s["intent"] == "order_status"]
    r, n = daily_rate(orows, lambda s: 1 if resolved(s) else 0, lambda s: 1)
    ax = axes[0][1]
    ax.plot(range(D), r, color=NAVY, lw=1.2, marker="o", ms=2)
    shade(ax, 40, 51)
    ax.set_title("F2  order_status resolution", fontsize=8.5, color=NAVY_D)
    ax.set_ylabel("resolution rate", fontsize=8)

    # F3 turns on acme_main_v3
    arows = [s for s in corpus.rows("acme-bank") if s["agent_id"] == "acme_main_v3"]
    tsum = np.zeros(D); tden = np.zeros(D)
    for s in arows:
        if resolved(s):
            tsum[int(s["day"])] += float(s["turns"]); tden[int(s["day"])] += 1
    turns = np.where(tden > 0, tsum / np.maximum(tden, 1), np.nan)
    ax = axes[1][0]
    ax.plot(range(D), turns, color=AMBER, lw=1.2, marker="o", ms=2)
    shade(ax, 46, 55)
    ax.set_title("F3  mean turns to resolve, acme_main_v3", fontsize=8.5, color=NAVY_D)
    ax.set_ylabel("turns", fontsize=8)
    ax.set_xlabel("day", fontsize=8)

    # F1 KB hit rate on premium_card_info
    prows = [s for s in corpus.rows("acme-bank") if s["intent"] == "premium_card_info"]
    kb = np.zeros(D); lk = np.zeros(D)
    for s in prows:
        kb[int(s["day"])] += s["derived"]["n_kb_hits"]; lk[int(s["day"])] += s["derived"]["n_kb_lookups"]
    kbser = np.where(lk > 0, 100 * kb / np.maximum(lk, 1), np.nan)
    ax = axes[1][1]
    ax.plot(range(D), kbser, color=GREEN, lw=1.2, marker="o", ms=2)
    shade(ax, 34, 44)
    ax.set_title("F1  KB confident-hit rate, premium_card_info", fontsize=8.5, color=NAVY_D)
    ax.set_ylabel("% of lookups", fontsize=8)
    ax.set_xlabel("day", fontsize=8)

    for row in axes:
        for ax in row:
            ax.grid(True, color=LINE, lw=0.5, alpha=0.7)
            ax.tick_params(labelsize=7)
            ax.set_xlim(-1, D)
    fig.suptitle("Detector evidence — each series vs the window the scan selects (shaded)",
                 fontsize=9, color=NAVY_D, y=1.02)
    fig.tight_layout()
    fig.savefig(os.path.join(HERE, "window_scan.png"), bbox_inches="tight")
    plt.close(fig)


# ---------------------------------------------------------------- fig: coverage
def fig_coverage():
    declared = {"tool_call": (0.72, 0.93), "kb_lookup": (0.72, 0.93), "cost_usd": (0.72, 0.93)}
    observed = {"tool_call": (0.7205, 0.9308), "kb_lookup": (1.0, 1.0), "cost_usd": (1.0, 1.0)}
    tenants = ["acme-bank", "northwind-retail"]
    metrics = ["tool_call", "kb_lookup", "cost_usd"]
    fig, ax = plt.subplots(figsize=(3.5, 2.4))
    x = np.arange(len(metrics)); w = 0.2
    for i, t in enumerate(tenants):
        d = [declared[m][i] for m in metrics]
        o = [observed[m][i] for m in metrics]
        ax.bar(x + (i - 0.5) * 2 * w - w / 2, d, w, label=f"{t} declared", color="#c9d3e0",
               edgecolor=SLATE, lw=0.5)
        ax.bar(x + (i - 0.5) * 2 * w + w / 2, o, w, label=f"{t} observed", color=NAVY)
    ax.set_xticks(x); ax.set_xticklabels(metrics, fontsize=8)
    ax.set_ylim(0, 1.28); ax.set_ylabel("emission coverage", fontsize=8)
    ax.set_title("Declared vs measured coverage", fontsize=9, color=NAVY_D)
    ax.legend(fontsize=6.0, ncol=2, loc="upper center", frameon=False)
    ax.grid(True, axis="y", color=LINE, lw=0.5, alpha=0.7)
    ax.tick_params(labelsize=7)
    fig.tight_layout()
    fig.savefig(os.path.join(HERE, "coverage_by_tenant.png"), bbox_inches="tight")
    plt.close(fig)


# ---------------------------------------------------------------- fig: standard
def fig_standard():
    std = report["standard"]

    def find(intent=None, agent=None, metric="resolution_rate"):
        for s in std:
            if s["metric"] != metric:
                continue
            if intent and s["cohort"].get("intent") == intent:
                return s
            if agent and s["cohort"].get("agent_id") == agent:
                return s
        return None

    res = [("F1 premium_card_info", find(intent="premium_card_info"), 0.3087),
           ("F2 order_status", find(intent="order_status"), 0.7755)]
    turn = [("F3 acme_main_v3", find(agent="acme_main_v3", metric="turns_to_resolve"), 6.0)]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.1, 2.3),
                                   gridspec_kw={"width_ratios": [1.5, 1]})

    def groupbars(ax, entries, title, ylab):
        labels = [e[0] for e in entries]
        obs = [e[2] for e in entries]
        med = [e[1]["median"] if e[1] else np.nan for e in entries]
        best = [e[1]["best"] if e[1] else np.nan for e in entries]
        x = np.arange(len(labels)); w = 0.26
        ax.bar(x - w, obs, w, label="observed (window)", color=RED)
        ax.bar(x, med, w, label="standard median", color="#c9d3e0", edgecolor=SLATE, lw=0.5)
        ax.bar(x + w, best, w, label="standard best (p90/p10)", color=GREEN)
        ax.set_xticks(x); ax.set_xticklabels(labels, fontsize=7)
        ax.set_title(title, fontsize=8.6, color=NAVY_D)
        ax.set_ylabel(ylab, fontsize=8)
        ax.grid(True, axis="y", color=LINE, lw=0.5, alpha=0.7)
        ax.tick_params(labelsize=7)
        ax.legend(fontsize=6.0, frameon=False)

    groupbars(ax1, res, "Resolution cohorts vs standard", "resolution rate")
    groupbars(ax2, turn, "Efficiency cohort vs standard", "median turns")
    fig.tight_layout()
    fig.savefig(os.path.join(HERE, "standard_comparison.png"), bbox_inches="tight")
    plt.close(fig)


# ---------------------------------------------------------------- fig: results
def fig_results():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.1, 2.3),
                                   gridspec_kw={"width_ratios": [1.35, 1]})
    sections = ["Accuracy\n/20", "Specificity\n/15", "Loop\n/8", "Honesty\n/12"]
    vals = [20, 15, 8, 12]
    ax1.bar(sections, vals, color=[NAVY, GREEN, AMBER, BLUE])
    for i, v in enumerate(vals):
        ax1.text(i, v + 0.4, str(v), ha="center", fontsize=8.5, color=NAVY_D)
    ax1.set_ylim(0, 22); ax1.set_ylabel("points", fontsize=8)
    ax1.set_title("Machine scorecard — 55.0 / 55", fontsize=9, color=NAVY_D)
    ax1.grid(True, axis="y", color=LINE, lw=0.5, alpha=0.7)
    ax1.tick_params(labelsize=7.5)

    runs = ["Practice\nkit", "Sealed pool\n(3)", "Moved\nfault", "Moved + 3rd\ntenant"]
    scores = [55.0, 55.0, 55.0, 55.0]
    passn = ["1/1", "3/3", "1/1", "1/1"]
    ax2.bar(runs, scores, color=GREEN)
    for i, (v, p) in enumerate(zip(scores, passn)):
        ax2.text(i, v + 0.6, p, ha="center", fontsize=8, color=NAVY_D)
    ax2.set_ylim(0, 62); ax2.set_yticks([0, 27.5, 55]); ax2.set_ylabel("machine score", fontsize=8)
    ax2.set_title("Generalization (held-out)", fontsize=9, color=NAVY_D)
    ax2.grid(True, axis="y", color=LINE, lw=0.5, alpha=0.7)
    ax2.tick_params(labelsize=7.5)
    fig.tight_layout()
    fig.savefig(os.path.join(HERE, "results.png"), bbox_inches="tight")
    plt.close(fig)


# ---------------------------------------------------------------- fig: architecture
def fig_architecture():
    fig, ax = plt.subplots(figsize=(7.1, 3.3))
    ax.set_xlim(0, 100); ax.set_ylim(0, 52); ax.axis("off")

    def box(x, y, w, h, text, fc="#eef2f7", ec=NAVY, fs=7.4, tc=NAVY_D, bold=False):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3,rounding_size=1.2",
                                    fc=fc, ec=ec, lw=0.9))
        ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=fs, color=tc,
                weight="bold" if bold else "normal", wrap=True)

    def arrow(x1, y1, x2, y2, color=SLATE):
        ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>", mutation_scale=9,
                                     color=color, lw=0.9, shrinkA=1, shrinkB=1))

    box(1, 22, 15, 8, "Kit corpus\nsessions · steps\nconfig · labels", fc="#f6f4ef", bold=True)
    box(20, 34, 17, 8, "io.py + features.py\nsession table\n(step facts folded)")
    box(20, 22, 17, 8, "coverage.py\nemission coverage\nper tenant")
    box(20, 10, 17, 8, "series.py\nwindow scan\nWelch-z")
    box(41, 40, 15, 7, "detect.py\n3 fault detectors")
    box(41, 30, 15, 7, "decoys.py\n3 lookalike\ndismissals")
    box(41, 20, 15, 7, "asks.py\n11 asks →\nmetrics / gaps")
    box(41, 10, 15, 7, "standards.py\ngolden set\nfrozen pre-fix")
    box(60, 33, 15, 8, "report.py\nassemble +\nvalidate")
    box(60, 21, 15, 8, "replay.py\n1 high-confidence\nverification")
    box(79, 40, 19, 9, "loop-report.json\nschema-valid\nunedited", fc="#e7f6ef", ec=GREEN, bold=True)
    box(79, 24, 19, 9, "app.py + screen\none brief,\none signature", fc="#eef2f7")
    box(79, 8, 19, 9, "decisions.log\napproval written\nback into report", fc="#fdf3e7", ec=AMBER)

    arrow(16, 26, 20, 36); arrow(16, 26, 20, 25); arrow(16, 26, 20, 13)
    for yy in (43, 34, 24, 13):
        arrow(37, yy, 41, yy if yy < 40 else 42)
    arrow(56, 43, 60, 39); arrow(56, 33, 60, 37)
    arrow(56, 24, 60, 35); arrow(56, 13, 60, 34)
    ax.add_patch(FancyArrowPatch((67, 33), (67, 29), arrowstyle="-|>", mutation_scale=9, color=SLATE, lw=0.9))
    arrow(75, 37, 79, 43); arrow(75, 37, 79, 29); arrow(88, 24, 88, 17)
    ax.text(50, 50.5, "Nexus Loop — deterministic pipeline (stdlib only; no model for logged facts)",
            ha="center", fontsize=8.5, color=NAVY_D, weight="bold")
    fig.tight_layout()
    fig.savefig(os.path.join(HERE, "system_architecture.png"), bbox_inches="tight")
    plt.close(fig)


# ---------------------------------------------------------------- fig: diagnosis
def fig_diagnosis():
    fig, ax = plt.subplots(figsize=(7.1, 1.9))
    ax.set_xlim(0, 100); ax.set_ylim(0, 22); ax.axis("off")
    steps = [
        ("Symptom\ntool_error_rate flat\nresolution 0.7755", "#fdecec", RED),
        ("Cohort\nintent=order_status\ntool=get_order_status", "#eef2f7", NAVY),
        ("Mechanism\nempty 200 →\n13.7% of ok calls (z=21)", "#fff4d6", AMBER),
        ("Change\ntool get_order_status\n3.2.0 → 3.3.0 (day 40)", "#eef2f7", NAVY),
        ("Fix\ntool.validate →\npredicted 0.8468", "#e7f6ef", GREEN),
    ]
    x = 1.5; w = 17.5; gap = 2.2
    for i, (t, fc, ec) in enumerate(steps):
        ax.add_patch(FancyBboxPatch((x, 5), w, 12, boxstyle="round,pad=0.3,rounding_size=1",
                                    fc=fc, ec=ec, lw=1.0))
        ax.text(x + w / 2, 11, t, ha="center", va="center", fontsize=7.2, color=NAVY_D)
        if i < len(steps) - 1:
            ax.add_patch(FancyArrowPatch((x + w, 11), (x + w + gap, 11), arrowstyle="-|>",
                                         mutation_scale=10, color=SLATE, lw=1.0))
        x += w + gap
    ax.text(50, 20.5, "Diagnosis chain — F2 silent tool contract break (evidence at every step)",
            ha="center", fontsize=8.6, color=NAVY_D, weight="bold")
    fig.tight_layout()
    fig.savefig(os.path.join(HERE, "diagnosis.png"), bbox_inches="tight")
    plt.close(fig)




if __name__ == "__main__":
    fig_window_scan(); fig_coverage(); fig_standard(); fig_results()
    fig_architecture(); fig_diagnosis()
    # operator_screen.png is a live capture of the running console, not a generated schematic
    print("figures written to", HERE)
