"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const fixtures = path.join(root, "tests/signed_copy/fixtures");
const summary = require(path.join(root, "nexus_loop/static/signed-copy/summary.js"));

const { toSummaryInput, buildDecisionsSummary } = summary;

function readGolden(name) {
  return fs.readFileSync(path.join(fixtures, name), "utf8").replace(/\n$/, "");
}

function readInput(name) {
  return JSON.parse(fs.readFileSync(path.join(fixtures, name), "utf8"));
}

describe("buildDecisionsSummary", () => {
  it("matches summary golden", () => {
    const input = readInput("summary.input.json");
    const out = buildDecisionsSummary(input);
    assert.equal(out, readGolden("summary.golden.txt"));
  });

  it("titleWithRun when runLabel present", () => {
    const input = Object.assign(readInput("summary.input.json"), {
      runLabel: "demo · corpus",
    });
    const out = buildDecisionsSummary(input);
    assert.match(out, /^Decisions for demo · corpus\n/);
  });

  it("dismissedCount 1 / 0 / null", () => {
    const base = readInput("summary.input.json");
    const one = buildDecisionsSummary(Object.assign({}, base, { dismissedCount: "1" }));
    assert.match(one, /Dismissed signals: 1 looked like a problem and is not\./);
    const zero = buildDecisionsSummary(Object.assign({}, base, { dismissedCount: "0", refusals: [] }));
    assert.equal(/Dismissed signals/.test(zero), false);
    const nil = buildDecisionsSummary(Object.assign({}, base, { dismissedCount: null, refusals: [] }));
    assert.equal(/Dismissed signals/.test(nil), false);
    assert.equal(/No measurement/.test(nil), false);
  });

  it("empty refusals omits refusals line", () => {
    const input = Object.assign(readInput("summary.input.json"), { refusals: [] });
    assert.equal(/No measurement/.test(buildDecisionsSummary(input)), false);
  });

  it("TypeError on empty decided", () => {
    assert.throws(() => buildDecisionsSummary({ decided: [] }), TypeError);
  });
});

describe("toSummaryInput", () => {
  function desk(overrides) {
    const findings = [{ id: "f1" }, { id: "f2" }];
    const decisions = {
      f1: { verdict: "accepted", reason: "a", recordedAtText: null },
      f2: { verdict: "rejected", reason: "b", recordedAtText: null },
    };
    return Object.assign(
      {
        findingsIn(bucket) {
          return bucket === "open" ? findings : [];
        },
        decisionFor(f) {
          return decisions[f.id] || null;
        },
        claimText(f) {
          return "Title " + f.id;
        },
        findingUrl(f) {
          return "http://x/#" + f.id;
        },
        runLabelText() {
          return null;
        },
        bucketCountText(bucket) {
          return bucket === "ignored" ? "4" : "0";
        },
        refusalClaims() {
          return ["We will not invent a failover rate", "We will not invent this number."];
        },
      },
      overrides || {}
    );
  }

  it("null when open empty", () => {
    assert.equal(
      toSummaryInput(
        desk({
          findingsIn() {
            return [];
          },
        })
      ),
      null
    );
  });

  it("null when any open finding undecided", () => {
    assert.equal(
      toSummaryInput(
        desk({
          decisionFor(f) {
            return f.id === "f1"
              ? { verdict: "accepted", reason: "a", recordedAtText: null }
              : null;
          },
        })
      ),
      null
    );
  });

  it("builds decided in list order", () => {
    const input = toSummaryInput(desk());
    assert.equal(input.decided.length, 2);
    assert.equal(input.decided[0].verdict, "accept");
    assert.equal(input.decided[1].verdict, "reject");
    assert.equal(input.dismissedCount, "4");
    assert.equal(input.refusals[0], "We will not invent a failover rate");
  });
});
