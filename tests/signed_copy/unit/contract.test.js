"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const contract = require(path.resolve(
  __dirname,
  "../../../nexus_loop/static/signed-copy/contract.js"
));

const { present, clean, bare, fill, normalizeVerdict, COPY } = contract;

describe("contract helpers", () => {
  it("present", () => {
    assert.equal(present("a"), true);
    assert.equal(present("  b  "), true);
    assert.equal(present(""), false);
    assert.equal(present("   "), false);
    assert.equal(present(null), false);
    assert.equal(present(undefined), false);
    assert.equal(present(1), false);
  });

  it("clean", () => {
    assert.equal(clean("  hi  "), "hi");
    assert.equal(clean("   "), null);
    assert.equal(clean(null), null);
  });

  it("bare", () => {
    assert.equal(bare("Hello."), "Hello");
    assert.equal(bare("Hello"), "Hello");
    assert.equal(bare("  Hello.  "), "Hello");
    assert.equal(bare(""), null);
    assert.equal(bare("."), "");
  });

  it("fill inserts literally including $&", () => {
    assert.equal(fill("X {v} Y", { v: "a$&b" }), "X a$&b Y");
    assert.equal(fill("{a}-{b}", { a: "1", b: "2" }), "1-2");
    assert.throws(() => fill("{missing}", {}), /fill: missing missing/);
  });

  it("normalizeVerdict maps report and short forms", () => {
    assert.equal(normalizeVerdict("accepted"), "accept");
    assert.equal(normalizeVerdict("accept"), "accept");
    assert.equal(normalizeVerdict("rejected"), "reject");
    assert.equal(normalizeVerdict("reject"), "reject");
    assert.equal(normalizeVerdict("deferred"), "defer");
    assert.equal(normalizeVerdict("defer"), "defer");
    assert.equal(normalizeVerdict("other"), null);
    assert.equal(normalizeVerdict(null), null);
    assert.equal(normalizeVerdict(""), null);
  });

  it("COPY is frozen with expected ui button", () => {
    assert.equal(COPY.ui.button, "Copy signed copy");
    assert.equal(Object.isFrozen(COPY), true);
    assert.throws(() => {
      COPY.extra = true;
    });
  });
});
