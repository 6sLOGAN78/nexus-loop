"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const dir = path.join(root, "nexus_loop/static/signed-copy");

const FORBIDDEN_PURE = [
  /\bparseFloat\b/,
  /\bparseInt\b/,
  /\bNumber\s*\(/,
  /\btoFixed\b/,
  /\btoPrecision\b/,
  /\btoLocaleString\b/,
  /\bMath\./,
  /\bIntl\./,
  /\bDate\b/,
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bdocument\b/,
  /\bwindow\./,
];

const FORBIDDEN_UI = [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bsetTimeout\b/, /\bsetInterval\b/];

function assertClean(file, patterns) {
  const src = fs.readFileSync(path.join(dir, file), "utf8");
  for (const re of patterns) {
    assert.equal(re.test(src), false, file + " matched " + re);
  }
}

describe("G7 purity", () => {
  it("template.js / adapter.js / summary.js have no forbidden tokens", () => {
    for (const f of ["template.js", "adapter.js", "summary.js"]) {
      assertClean(f, FORBIDDEN_PURE);
    }
  });

  it("ui.js has no fetch / XHR / timers", () => {
    assertClean("ui.js", FORBIDDEN_UI);
  });
});
