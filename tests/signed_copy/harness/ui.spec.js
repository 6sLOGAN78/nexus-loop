"use strict";

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { Window } = require("happy-dom");

const root = path.resolve(__dirname, "../../..");
const contract = require(path.join(root, "nexus_loop/static/signed-copy/contract.js"));
const template = require(path.join(root, "nexus_loop/static/signed-copy/template.js"));
const summary = require(path.join(root, "nexus_loop/static/signed-copy/summary.js"));
const adapter = require(path.join(root, "nexus_loop/static/signed-copy/adapter.js"));
const ui = require(path.join(root, "nexus_loop/static/signed-copy/ui.js"));

const sampleInput = {
  verdict: "accept",
  findingTitle: "Title",
  reason: "Because",
  findingUrl: "http://localhost/#f1",
  metricLabel: "Share we finished",
  observed: "77.5%",
  expected: "85.5%",
  affected: "2,686",
  cause: "Cause.",
  configChange: "config",
  changeTarget: "target",
  changeDescription: "desc",
  replay: { before: "1%", after: "2%" },
  risk: "risk",
  ifNothingChanges: "inaction",
  ownerLine: "Agent team needs to act",
  technicalNames: ["a"],
  recordedAt: null,
  coverageText: null,
};

function setup() {
  const window = new Window({ url: "http://localhost/" });
  const { document } = window;
  global.window = window;
  global.document = document;
  global.HTMLElement = window.HTMLElement;
  global.self = window;
  const slot = document.createElement("div");
  slot.setAttribute("data-testid", "signed-copy-slot");
  document.body.appendChild(slot);
  return { window, document, slot };
}

describe("ui harness", () => {
  beforeEach(() => {
    // Reset module status by clearing via empty render keys — re-require not needed;
    // status is keyed; use unique reasons per test when needed.
  });

  it("clears slot when adapter returns null", () => {
    const { slot } = setup();
    slot.innerHTML = "<span>stale</span>";
    ui.render(slot, { id: "f" }, {
      desk: {},
      adapter: { toSignedCopyInput: () => null },
      template,
      summary: { toSummaryInput: () => null },
      clipboard: { writeText: async () => {} },
      copy: contract.COPY,
    });
    assert.equal(slot.innerHTML, "");
  });

  it("clears slot when template returns non-string", () => {
    const { slot } = setup();
    ui.render(slot, { id: "f" }, {
      desk: {},
      adapter: { toSignedCopyInput: () => sampleInput },
      template: { buildSignedCopy: () => null },
      summary: { toSummaryInput: () => null },
      clipboard: { writeText: async () => {} },
      copy: contract.COPY,
    });
    assert.equal(slot.querySelector("[data-testid=signed-copy]"), null);
  });

  it("renders DOM contract", () => {
    const { slot } = setup();
    ui.render(slot, { id: "f" }, {
      desk: {},
      adapter: { toSignedCopyInput: () => sampleInput },
      template,
      summary: { toSummaryInput: () => null },
      clipboard: { writeText: async () => {} },
      copy: contract.COPY,
    });
    const section = slot.querySelector('[data-testid="signed-copy"]');
    assert.ok(section);
    assert.equal(section.getAttribute("aria-label"), "Signed copy");
    assert.equal(
      slot.querySelector('[data-testid="signed-copy-button"]').textContent,
      "Copy signed copy"
    );
    assert.equal(
      slot.querySelector('[data-testid="signed-copy-status"]').getAttribute("role"),
      "status"
    );
    assert.ok(slot.querySelector('[data-testid="signed-copy-preview"]'));
    assert.equal(
      slot.querySelector('[data-testid="signed-copy-text"]').readOnly,
      true
    );
    assert.equal(slot.querySelector('[data-testid="decisions-summary"]'), null);
  });

  it("copy success persists across re-render with same key", async () => {
    const { slot } = setup();
    const deps = {
      desk: {},
      adapter: { toSignedCopyInput: () => sampleInput },
      template,
      summary: { toSummaryInput: () => null },
      clipboard: { writeText: async () => {} },
      copy: contract.COPY,
    };
    ui.render(slot, { id: "f" }, deps);
    const btn = slot.querySelector('[data-testid="signed-copy-button"]');
    await btn.click();
    // happy-dom click may not await async handlers — wait a tick
    await new Promise((r) => setImmediate(r));
    assert.equal(
      slot.querySelector('[data-testid="signed-copy-status"]').textContent,
      contract.COPY.ui.copied
    );
    ui.render(slot, { id: "f" }, deps);
    assert.equal(
      slot.querySelector('[data-testid="signed-copy-status"]').textContent,
      contract.COPY.ui.copied
    );
  });

  it("status resets on new key", async () => {
    const { slot } = setup();
    let reason = "Because A";
    const deps = {
      desk: {},
      adapter: {
        toSignedCopyInput: () => Object.assign({}, sampleInput, { reason }),
      },
      template,
      summary: { toSummaryInput: () => null },
      clipboard: { writeText: async () => {} },
      copy: contract.COPY,
    };
    ui.render(slot, { id: "f" }, deps);
    await slot.querySelector('[data-testid="signed-copy-button"]').click();
    await new Promise((r) => setImmediate(r));
    reason = "Because B";
    ui.render(slot, { id: "f" }, deps);
    assert.equal(slot.querySelector('[data-testid="signed-copy-status"]').textContent, "");
  });

  it("failure path opens preview and selects text", async () => {
    const { slot } = setup();
    const deps = {
      desk: {},
      adapter: { toSignedCopyInput: () => sampleInput },
      template,
      summary: { toSummaryInput: () => null },
      clipboard: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
      copy: contract.COPY,
    };
    ui.render(slot, { id: "f" }, deps);
    await slot.querySelector('[data-testid="signed-copy-button"]').click();
    await new Promise((r) => setImmediate(r));
    const preview = slot.querySelector('[data-testid="signed-copy-preview"]');
    const ta = slot.querySelector('[data-testid="signed-copy-text"]');
    assert.equal(preview.open, true);
    assert.equal(
      slot.querySelector('[data-testid="signed-copy-status"]').textContent,
      contract.COPY.ui.copyFailed
    );
    assert.equal(ta.selectionStart, 0);
    assert.equal(ta.selectionEnd, ta.value.length);
  });

  it("summary section only when summary returns string", () => {
    const { slot } = setup();
    const summaryInput = {
      runLabel: null,
      decided: [
        {
          verdict: "accept",
          findingTitle: "T",
          reason: "R",
          findingUrl: "http://x/#f",
        },
      ],
      dismissedCount: "0",
      refusals: [],
    };
    ui.render(slot, { id: "f" }, {
      desk: {},
      adapter: { toSignedCopyInput: () => sampleInput },
      template,
      summary: {
        toSummaryInput: () => summaryInput,
        buildDecisionsSummary: (i) => summary.buildDecisionsSummary(i),
      },
      clipboard: { writeText: async () => {} },
      copy: contract.COPY,
    });
    assert.ok(slot.querySelector('[data-testid="decisions-summary"]'));
    assert.equal(
      slot.querySelector('[data-testid="decisions-summary-button"]').textContent,
      "Copy all decisions"
    );
  });

  it("keydown on textarea stops propagation for arrows", () => {
    const { slot, document } = setup();
    ui.render(slot, { id: "f" }, {
      desk: {},
      adapter: { toSignedCopyInput: () => sampleInput },
      template,
      summary: { toSummaryInput: () => null },
      clipboard: { writeText: async () => {} },
      copy: contract.COPY,
    });
    const ta = slot.querySelector('[data-testid="signed-copy-text"]');
    let bubbled = false;
    document.body.addEventListener("keydown", () => {
      bubbled = true;
    });
    const ev = new document.defaultView.KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
    });
    ta.dispatchEvent(ev);
    assert.equal(bubbled, false);
  });

  it("button is visually secondary (neutral, not traffic-light fills)", () => {
    const css = fs.readFileSync(
      path.join(root, "nexus_loop/static/signed-copy/signed-copy.css"),
      "utf8"
    );
    assert.match(css, /--ds-neutral/);
    assert.equal(/--ds-success[^-]/.test(css.replace(/\/\*[\s\S]*?\*\//g, "")), false);
    assert.equal(css.includes("background: var(--ds-success)"), false);
    assert.equal(css.includes("background: var(--ds-danger)"), false);
    assert.equal(css.includes("background: var(--ds-brand)"), false);
  });
});
