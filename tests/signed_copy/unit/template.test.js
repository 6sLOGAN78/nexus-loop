"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const fixtures = path.join(root, "tests/signed_copy/fixtures");
const template = require(path.join(
  root,
  "nexus_loop/static/signed-copy/template.js"
));

const { buildSignedCopy } = template;

function readGolden(name) {
  return fs.readFileSync(path.join(fixtures, name), "utf8").replace(/\n$/, "");
}

function readInput(name) {
  return JSON.parse(fs.readFileSync(path.join(fixtures, name), "utf8"));
}

function assertNoTrailingSpaces(text) {
  for (const line of text.split("\n")) {
    assert.equal(line, line.replace(/\s+$/, ""), "trailing space: " + JSON.stringify(line));
  }
}

describe("buildSignedCopy goldens", () => {
  for (const verdict of ["accept", "reject", "defer"]) {
    it("matches " + verdict + " golden byte-for-byte", () => {
      const input = readInput(verdict + ".input.json");
      const out = buildSignedCopy(input);
      const golden = readGolden(verdict + ".golden.txt");
      assert.equal(out, golden);
      assert.equal(out.endsWith("\n"), false);
      assert.equal(/\n\n\n/.test(out), false);
      assertNoTrailingSpaces(out);
    });
  }
});

describe("buildSignedCopy edges", () => {
  const base = () => readInput("accept.input.json");

  it("headlineNoTarget for every verdict when changeTarget null", () => {
    for (const verdict of ["accept", "reject", "defer"]) {
      const input = Object.assign(base(), { verdict, changeTarget: null });
      const out = buildSignedCopy(input);
      if (verdict === "accept") assert.match(out, /^Accepted: go ahead with this change\./);
      if (verdict === "reject") assert.match(out, /^Rejected: do not make this change\./);
      if (verdict === "defer") assert.match(out, /^Not decided yet: this change is on hold\./);
    }
  });

  it("whyCause / whyConfig / neither", () => {
    const causeOnly = Object.assign(base(), { configChange: null });
    assert.match(buildSignedCopy(causeOnly), /Why we think so: The order lookup tool reported success but returned nothing\./);
    const configOnly = Object.assign(base(), { cause: null });
    assert.match(buildSignedCopy(configOnly), /Why we think so: it started after the tool's response format was changed\./);
    const neither = Object.assign(base(), { cause: null, configChange: null });
    assert.equal(/Why we think so/.test(buildSignedCopy(neither)), false);
  });

  it("change target-only and description-only", () => {
    const targetOnly = Object.assign(base(), { changeDescription: null });
    assert.match(buildSignedCopy(targetOnly), /What we're changing: the order lookup instructions\./);
    const descOnly = Object.assign(base(), { changeTarget: null });
    assert.match(
      buildSignedCopy(descOnly),
      /What we're changing: treat an empty answer as a failure and ask the customer to try again\./
    );
  });

  it("replay with blank after uses replayNone", () => {
    const input = Object.assign(base(), { replay: { before: "76.0%", after: "  " } });
    assert.match(buildSignedCopy(input), /Replay test: No test this run\./);
  });

  it("reason with quotes, $& and newline kept verbatim", () => {
    const reason = 'Said "no" and used $& then\nbroke line';
    const input = Object.assign(base(), { reason });
    const out = buildSignedCopy(input);
    assert.ok(out.includes('My reason: "' + reason + '"'));
  });

  it("blank technical names are dropped", () => {
    const input = Object.assign(base(), {
      technicalNames: ["", "  ", "tool.contract_break", null],
    });
    // null in array — clean may not be called on non-strings; filter blanks
    const names = ["", "  ", "tool.contract_break"];
    const out = buildSignedCopy(Object.assign(base(), { technicalNames: names }));
    assert.match(out, /Technical names: tool\.contract_break$/m);
  });

  it("all optional null still yields headline, finding, reason, replayNone, open", () => {
    const input = {
      verdict: "accept",
      findingTitle: "T",
      reason: "R",
      findingUrl: "http://x/#f",
      metricLabel: null,
      observed: null,
      expected: null,
      affected: null,
      cause: null,
      configChange: null,
      changeTarget: null,
      changeDescription: null,
      replay: null,
      risk: null,
      ifNothingChanges: null,
      ownerLine: null,
      technicalNames: [],
      recordedAt: null,
      coverageText: null,
    };
    const out = buildSignedCopy(input);
    assert.equal(
      out,
      [
        "Accepted: go ahead with this change.",
        "Finding: T",
        "",
        'My reason: "R"',
        "",
        "Replay test: No test this run.",
        "",
        "Open this finding: http://x/#f",
      ].join("\n")
    );
  });

  it("validation TypeErrors", () => {
    assert.throws(() => buildSignedCopy({}), TypeError);
    assert.throws(() => buildSignedCopy(Object.assign(base(), { verdict: "nope" })), TypeError);
    assert.throws(() => buildSignedCopy(Object.assign(base(), { findingTitle: "  " })), TypeError);
    assert.throws(() => buildSignedCopy(Object.assign(base(), { findingUrl: "" })), TypeError);
    assert.throws(() => buildSignedCopy(Object.assign(base(), { reason: "   " })), TypeError);
  });
});
