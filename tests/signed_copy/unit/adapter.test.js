"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const adapter = require(path.resolve(
  __dirname,
  "../../../nexus_loop/static/signed-copy/adapter.js"
));

const { toSignedCopyInput } = adapter;

const DESK_METHODS = new Set([
  "bucketOf",
  "decisionFor",
  "claimText",
  "findingUrl",
  "metricLabel",
  "observedText",
  "expectedText",
  "affectedFigureText",
  "causeText",
  "configChangeText",
  "changeTargetText",
  "changeDescriptionText",
  "replayText",
  "riskText",
  "ifNothingChangesText",
  "ownerText",
  "technicalNames",
  "coverageText",
]);

function fakeDesk(overrides) {
  const base = {
    bucketOf() {
      return "open";
    },
    decisionFor() {
      return { verdict: "accepted", reason: "because", recordedAtText: null };
    },
    claimText() {
      return "Title";
    },
    findingUrl() {
      return "http://localhost/#f1";
    },
    metricLabel() {
      return "Share we finished";
    },
    observedText() {
      return "77.5%";
    },
    expectedText() {
      return "85.5%";
    },
    affectedFigureText() {
      return "2,686";
    },
    causeText() {
      return "Cause.";
    },
    configChangeText() {
      return "config changed";
    },
    changeTargetText() {
      return "target";
    },
    changeDescriptionText() {
      return "description";
    },
    replayText() {
      return { before: "1%", after: "2%" };
    },
    riskText() {
      return "risk";
    },
    ifNothingChangesText() {
      return "inaction";
    },
    ownerText() {
      return "Agent team needs to act.";
    },
    technicalNames() {
      return ["a", "b"];
    },
    coverageText() {
      return "coverage 100%";
    },
  };
  Object.assign(base, overrides || {});
  return new Proxy(base, {
    get(target, prop) {
      if (typeof prop === "symbol") return target[prop];
      if (!DESK_METHODS.has(prop)) {
        throw new Error("unexpected desk property: " + String(prop));
      }
      return target[prop];
    },
  });
}

describe("toSignedCopyInput", () => {
  const finding = { id: "f1" };

  it("returns null when bucket is not open", () => {
    const desk = fakeDesk({
      bucketOf() {
        return "ignored";
      },
    });
    assert.equal(toSignedCopyInput(desk, finding), null);
  });

  it("returns null without decision", () => {
    const desk = fakeDesk({
      decisionFor() {
        return null;
      },
    });
    assert.equal(toSignedCopyInput(desk, finding), null);
  });

  it("returns null on unknown verdict with warn", () => {
    const warns = [];
    const orig = console.warn;
    console.warn = (m) => warns.push(m);
    try {
      const desk = fakeDesk({
        decisionFor() {
          return { verdict: "maybe", reason: "x", recordedAtText: null };
        },
      });
      assert.equal(toSignedCopyInput(desk, finding), null);
      assert.ok(warns.length);
    } finally {
      console.warn = orig;
    }
  });

  it("returns null when reason blank", () => {
    const desk = fakeDesk({
      decisionFor() {
        return { verdict: "accepted", reason: "  ", recordedAtText: null };
      },
    });
    assert.equal(toSignedCopyInput(desk, finding), null);
  });

  it("returns null when title or url missing", () => {
    assert.equal(
      toSignedCopyInput(
        fakeDesk({
          claimText() {
            return null;
          },
        }),
        finding
      ),
      null
    );
    assert.equal(
      toSignedCopyInput(
        fakeDesk({
          findingUrl() {
            return "";
          },
        }),
        finding
      ),
      null
    );
  });

  it("passes reason byte-for-byte and freezes input", () => {
    const reason = '  keep "quotes" and\nnewline  ';
    const desk = fakeDesk({
      decisionFor() {
        return { verdict: "rejected", reason, recordedAtText: null };
      },
    });
    const input = toSignedCopyInput(desk, finding);
    assert.equal(input.reason, reason);
    assert.equal(input.verdict, "reject");
    assert.equal(Object.isFrozen(input), true);
  });

  it("wrong-typed values become null with warn, never coerced", () => {
    const warns = [];
    const orig = console.warn;
    console.warn = (m) => warns.push(String(m));
    try {
      const desk = fakeDesk({
        metricLabel() {
          return 12;
        },
        replayText() {
          return { before: 1, after: "2" };
        },
        technicalNames() {
          return ["ok", 3];
        },
        observedText() {
          return { x: 1 };
        },
      });
      const input = toSignedCopyInput(desk, finding);
      assert.equal(input.metricLabel, null);
      assert.equal(input.observed, null);
      assert.equal(input.replay, null);
      assert.deepEqual(input.technicalNames, ["ok"]);
      assert.ok(warns.length >= 3);
    } finally {
      console.warn = orig;
    }
  });

  it("only touches desk methods (Proxy)", () => {
    const desk = fakeDesk();
    const input = toSignedCopyInput(desk, finding);
    assert.equal(input.findingTitle, "Title");
    assert.equal(input.findingUrl, "http://localhost/#f1");
  });
});
