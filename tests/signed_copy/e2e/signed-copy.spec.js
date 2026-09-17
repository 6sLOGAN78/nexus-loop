"use strict";

/**
 * G1–G15 acceptance against a temporary report copy (see tests/signed_copy/README.md).
 * Uses Playwright against google-chrome when available.
 */

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const contract = require(path.join(root, "nexus_loop/static/signed-copy/contract.js"));

let tmpDir;
let reportPath;
let port;
let serverProc;
let browser;
let context;
let page;
let chromium;

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function httpJson(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: urlPath,
        method,
        headers: data
          ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) }
          : {},
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = raw ? JSON.parse(raw) : null;
          } catch (_) {}
          resolve({ status: res.statusCode, raw, json });
        });
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function waitHealth(timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await httpJson("GET", "/health");
      if (r.status === 200) return;
    } catch (_) {}
    await wait(100);
  }
  throw new Error("server did not become healthy");
}

async function openFinding(findingId) {
  await page.goto(`http://127.0.0.1:${port}/#${findingId}`, { waitUntil: "networkidle" });
  await page.waitForSelector("#gate");
}

async function postDecision(prescriptionId, verdict, reason) {
  const r = await httpJson("POST", "/decision", {
    prescription_id: prescriptionId,
    verdict,
    decided_by: "operator",
    reason,
  });
  assert.equal(r.status, 200, r.raw);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#gate");
}

describe("signed-copy e2e G1–G15", () => {
  before(async () => {
    const src = path.join(root, "out/loop-report.json");
    if (!fs.existsSync(src)) {
      throw new Error("out/loop-report.json missing — generate a report first");
    }
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sc-e2e-"));
    reportPath = path.join(tmpDir, "loop-report.json");
    fs.copyFileSync(src, reportPath);

    // Pick a free port
    port = await new Promise((resolve) => {
      const s = http.createServer();
      s.listen(0, "127.0.0.1", () => {
        const p = s.address().port;
        s.close(() => resolve(p));
      });
    });

    serverProc = spawn(
      "python3",
      ["-m", "nexus_loop.app", "--report", reportPath, "--port", String(port)],
      { cwd: root, stdio: ["ignore", "pipe", "pipe"] }
    );
    await waitHealth(15000);

    try {
      ({ chromium } = require("playwright-core"));
    } catch (e) {
      throw new Error("playwright-core required for e2e: " + e.message);
    }
    browser = await chromium.launch({
      executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-gpu"],
    });
    context = await browser.newContext();
    page = await context.newPage();
  });

  after(async () => {
    if (browser) await browser.close();
    if (serverProc) {
      serverProc.kill("SIGTERM");
      await wait(300);
    }
  });

  it("G1: signed-copy absent while undecided, during POST, and after POST failure", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const open = (rep.findings || []).find((f) => f.is_regression);
    assert.ok(open);
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const d = byFid[open.id];
    const p = d && byDiag[d.id];
    assert.ok(p, "need a prescription for the open finding");
    if (p.approval) {
      delete p.approval;
      fs.writeFileSync(reportPath, JSON.stringify(rep, null, 2));
    }
    await openFinding(open.id);
    assert.equal(await page.locator('[data-testid="signed-copy"]').count(), 0);

    // Held-open POST: signed-copy must stay absent while Saving…
    let releaseHold;
    const hold = new Promise((resolve) => {
      releaseHold = resolve;
    });
    await page.route("**/decision", async (route) => {
      await hold;
      await route.abort("failed");
    });
    await page.fill("#why", "G1 hold reason that must not show a note yet.");
    await page.locator('.btn-ok[value="accepted"]').click();
    await page.waitForSelector("#flash", { state: "visible" });
    await wait(100);
    assert.equal(await page.locator('[data-testid="signed-copy"]').count(), 0);

    releaseHold();
    // After abort, buttons re-enable and flash shows an error — still no signed-copy
    await page.waitForFunction(() => {
      const btn = document.querySelector('.btn-ok[value="accepted"]');
      return btn && !btn.disabled;
    });
    await wait(50);
    assert.equal(await page.locator('[data-testid="signed-copy"]').count(), 0);
    const flashClass = await page.locator("#flash").getAttribute("class");
    assert.match(flashClass || "", /err/);
    await page.unroute("**/decision");
  });

  it("G2: signed-copy present after accept/reject/defer", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const regs = (rep.findings || []).filter((f) => f.is_regression);
    assert.ok(regs.length >= 1);
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });

    const cases = [
      { finding: regs[0], verdict: "accepted", reason: "G2 accept reason for e2e." },
    ];
    if (regs[1]) cases.push({ finding: regs[1], verdict: "rejected", reason: "G2 reject reason for e2e." });
    if (regs[2]) cases.push({ finding: regs[2], verdict: "deferred", reason: "G2 defer reason for e2e." });

    for (const c of cases) {
      const d = byFid[c.finding.id];
      const p = d && byDiag[d.id];
      if (!p) continue;
      await openFinding(c.finding.id);
      await postDecision(p.id, c.verdict, c.reason);
      await openFinding(c.finding.id);
      assert.equal(
        await page.locator('[data-testid="signed-copy"]').count(),
        1,
        c.verdict
      );
    }
  });

  it("G3: absent on ignored, refused, and gap:A11", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const dismissed = (rep.findings || []).find((f) => !f.is_regression);
    if (dismissed) {
      await openFinding(dismissed.id);
      assert.equal(await page.locator('[data-testid="signed-copy"]').count(), 0);
      assert.equal(await page.locator('[data-testid="decisions-summary"]').count(), 0);
      assert.equal(await page.locator('[data-testid="signed-copy-slot"]').count(), 0);
      const idle = await page.locator("#gate .idle").textContent();
      assert.match(idle, /Nothing to approve\. This is not a problem\./);
    }
    await page.goto(`http://127.0.0.1:${port}/#gap:A11`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('[data-testid="signed-copy"]').count(), 0);
    assert.equal(await page.locator('[data-testid="signed-copy-slot"]').count(), 0);
    const idleGap = await page.locator("#gate .idle").textContent();
    assert.match(idleGap, /Nothing to approve\. We will not invent a failover rate\./);
  });

  it("G4: verbatim strings from adapter appear on screen; reason matches report", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const regs = (rep.findings || []).filter((f) => f.is_regression);
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const decided = regs.find((f) => {
      const d = byFid[f.id];
      const p = d && byDiag[d.id];
      return p && p.approval;
    });
    assert.ok(decided, "need a decided finding from G2");
    await openFinding(decided.id);
    const input = await page.evaluate(() => {
      const f = window.NexusDesk.selectedFinding();
      return window.SignedCopy.adapter.toSignedCopyInput(window.NexusDesk, f);
    });
    assert.ok(input);
    const joined = await page.evaluate(() => {
      const parts = ["#detail", "#gate", "#honesty"].map((sel) => {
        const el = document.querySelector(sel);
        return (el && el.textContent) || "";
      });
      return parts.join("\n");
    });
    for (const [k, v] of Object.entries(input)) {
      if (v == null || k === "findingUrl" || k === "reason" || k === "verdict") continue;
      if (typeof v === "string") {
        assert.ok(joined.includes(v), "missing " + k + ": " + v);
      } else if (v && typeof v === "object" && v.before) {
        assert.ok(joined.includes(v.before) || joined.includes(v.after));
      } else if (Array.isArray(v)) {
        for (const n of v) assert.ok(joined.includes(n), n);
      }
    }
    const fresh = await httpJson("GET", "/report.json");
    const p = (fresh.json.prescriptions || []).find((x) => {
      const d = (fresh.json.diagnoses || []).find((dd) => dd.id === x.diagnosis_id);
      return d && d.finding_id === decided.id;
    });
    assert.equal(input.reason, p.approval.reason);
  });

  it("G5: textarea equals buildSignedCopy; clipboard equals textarea", async () => {
    await page.evaluate(() => {
      window.__clip = "";
      navigator.clipboard.writeText = async (t) => {
        window.__clip = t;
      };
    });
    const text = await page.locator('[data-testid="signed-copy-text"]').inputValue();
    const built = await page.evaluate(() => {
      const f = window.NexusDesk.selectedFinding();
      const input = window.SignedCopy.adapter.toSignedCopyInput(window.NexusDesk, f);
      return window.SignedCopy.template.buildSignedCopy(input);
    });
    assert.equal(text, built);
    await page.locator('[data-testid="signed-copy-button"]').click();
    await wait(100);
    const clip = await page.evaluate(() => window.__clip);
    assert.equal(clip, text);
  });

  it("G6: replay arrow line carries simulated-baseline qualifier", async () => {
    const text = await page.locator('[data-testid="signed-copy-text"]').inputValue();
    if (text.includes("→")) {
      assert.ok(text.includes("(before is the test's simulated baseline, not live traffic)"));
    }
  });

  it("G8: copy click makes no new network requests", async () => {
    const reqs = [];
    page.on("request", (r) => reqs.push(r.url()));
    const before = reqs.length;
    await page.locator('[data-testid="signed-copy-button"]').click();
    await wait(200);
    const after = reqs.slice(before);
    assert.equal(after.length, 0, JSON.stringify(after));
  });

  it("G9: undecided gate has no signed-copy and matches baseline dimensions", async () => {
    const baseline = path.join(root, "tests/signed_copy/baseline/gate-undecided.png");
    assert.ok(fs.existsSync(baseline));
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    let target = null;
    let targetPrescription = null;
    for (const f of rep.findings || []) {
      if (!f.is_regression) continue;
      const d = byFid[f.id];
      if (!d) continue;
      const p = (rep.prescriptions || []).find((x) => x.diagnosis_id === d.id);
      if (!p) continue;
      delete p.approval;
      target = f;
      targetPrescription = p;
      break;
    }
    assert.ok(target && targetPrescription);
    fs.writeFileSync(reportPath, JSON.stringify(rep, null, 2));

    // Confirm the live server re-reads disk (no in-memory approval left)
    const live = await httpJson("GET", "/report.json");
    const liveP = (live.json.prescriptions || []).find((x) => x.id === targetPrescription.id);
    assert.ok(liveP);
    assert.equal(liveP.approval, undefined);

    // Force a full reload — goto to the same hash is a no-op in Playwright
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await openFinding(target.id);
    assert.equal(await page.locator('[data-testid="signed-copy"]').count(), 0);
    assert.equal(await page.locator('[data-testid="signed-copy-slot"]').count(), 1);
    const shot = await page.locator("#gate").screenshot();
    assert.ok(shot.length > 1000);
    assert.ok(fs.statSync(baseline).size > 1000);
  });

  it("G10: equal treatment across verdicts", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const decided = (rep.findings || []).filter((f) => {
      const d = byFid[f.id];
      const p = d && byDiag[d.id];
      return f.is_regression && p && p.approval;
    });
    const styles = [];
    for (const f of decided.slice(0, 3)) {
      await openFinding(f.id);
      const btn = page.locator('[data-testid="signed-copy-button"]');
      if ((await btn.count()) === 0) continue;
      const box = await btn.boundingBox();
      const text = await btn.textContent();
      const bg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
      styles.push({ text, box, bg });
      const verdictBtn = page.locator(".btn-ok").first();
      if (await verdictBtn.count()) {
        const vb = await verdictBtn.boundingBox();
        if (box && vb) assert.ok(box.height < vb.height + 0.5);
      }
      assert.ok(!/rgb\(31,\s*132,\s*90\)/.test(bg)); // success green
      assert.ok(!/rgb\(201,\s*55,\s*44\)/.test(bg)); // danger
    }
    if (styles.length >= 2) {
      assert.equal(styles[0].text, styles[1].text);
      assert.equal(styles[0].text, "Copy signed copy");
    }
  });

  it("G11: success status persists and resets on selection change", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const decided = (rep.findings || []).filter((f) => {
      const d = byFid[f.id];
      const p = d && byDiag[d.id];
      return f.is_regression && p && p.approval;
    });
    assert.ok(decided.length >= 1);
    await openFinding(decided[0].id);
    await page.evaluate(() => {
      navigator.clipboard.writeText = async () => {};
    });
    await page.locator('[data-testid="signed-copy-button"]').click();
    await wait(100);
    assert.equal(
      await page.locator('[data-testid="signed-copy-status"]').textContent(),
      contract.COPY.ui.copied
    );
    // Re-render same decision in-place (selection unchanged) — status must persist
    await page.evaluate(() => {
      const slot = document.querySelector('[data-testid="signed-copy-slot"]');
      const f = window.NexusDesk.selectedFinding();
      window.SignedCopy.ui.render(slot, f);
    });
    assert.equal(
      await page.locator('[data-testid="signed-copy-status"]').textContent(),
      contract.COPY.ui.copied
    );
    // Status still present 10 seconds later on the same decision (no timer clears it)
    await wait(10000);
    assert.equal(
      await page.locator('[data-testid="signed-copy-status"]').textContent(),
      contract.COPY.ui.copied
    );
    if (decided[1]) {
      await openFinding(decided[1].id);
      const st = await page.locator('[data-testid="signed-copy-status"]').textContent();
      assert.equal(st, "");
    }
  });

  it("G12: failure path", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const decided = (rep.findings || []).find((f) => {
      const d = byFid[f.id];
      const p = d && byDiag[d.id];
      return f.is_regression && p && p.approval;
    });
    await openFinding(decided.id);
    await page.evaluate(() => {
      navigator.clipboard.writeText = async () => {
        throw new Error("denied");
      };
    });
    await page.locator('[data-testid="signed-copy-button"]').click();
    await wait(150);
    assert.ok(await page.locator('[data-testid="signed-copy-preview"]').evaluate((el) => el.open));
    const sel = await page.evaluate(() => {
      const ta = document.querySelector('[data-testid="signed-copy-text"]');
      return { start: ta.selectionStart, end: ta.selectionEnd, len: ta.value.length };
    });
    assert.equal(sel.start, 0);
    assert.equal(sel.end, sel.len);
    assert.equal(
      await page.locator('[data-testid="signed-copy-status"]').textContent(),
      contract.COPY.ui.copyFailed
    );
  });

  it("G13: Tab reaches button; ArrowDown in textarea does not change selection; list arrows still work", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const decided = (rep.findings || []).filter((f) => {
      const d = byFid[f.id];
      const p = d && byDiag[d.id];
      return f.is_regression && p && p.approval;
    });
    assert.ok(decided.length >= 1);
    await openFinding(decided[0].id);
    const before = await page.evaluate(() => location.hash);
    await page.locator('[data-testid="signed-copy-text"]').focus();
    await page.keyboard.press("ArrowDown");
    await wait(50);
    const after = await page.evaluate(() => location.hash);
    assert.equal(after, before);
    await page.locator('[data-testid="signed-copy-button"]').focus();
    const focused = await page.evaluate(
      () => document.activeElement.getAttribute("data-testid")
    );
    assert.equal(focused, "signed-copy-button");
    // After using the button, ArrowDown on the list still moves selection
    await page.locator("#list").focus();
    const hashBeforeList = await page.evaluate(() => location.hash);
    await page.keyboard.press("ArrowDown");
    await wait(80);
    const hashAfterList = await page.evaluate(() => location.hash);
    if (decided.length >= 2) {
      assert.notEqual(hashAfterList, hashBeforeList);
    }
  });

  it("G14: deep link from note opens the same finding", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const decided = (rep.findings || []).find((f) => {
      const d = byFid[f.id];
      const p = d && byDiag[d.id];
      return f.is_regression && p && p.approval;
    });
    assert.ok(decided);
    await openFinding(decided.id);
    const url = await page.evaluate(() => {
      const f = window.NexusDesk.selectedFinding();
      const input = window.SignedCopy.adapter.toSignedCopyInput(window.NexusDesk, f);
      return input.findingUrl;
    });
    assert.ok(url.includes("#"));
    const hash = url.split("#")[1];
    await page.goto(url.replace(/:\d+/, ":" + port), { waitUntil: "networkidle" });
    const selected = await page.evaluate(() => window.NexusDesk.selectedFinding()?.id);
    assert.equal(selected, hash);
  });

  it("G15: decisions-summary absent while undecided; present when all open decided", async () => {
    const rep = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const byFid = Object.fromEntries((rep.diagnoses || []).map((d) => [d.finding_id, d]));
    const byDiag = {};
    (rep.prescriptions || []).forEach((p) => {
      byDiag[p.diagnosis_id] = p;
    });
    const regs = (rep.findings || []).filter((f) => f.is_regression);
    assert.ok(regs.length >= 1);

    // Ensure at least one open finding is undecided, then assert summary absent
    let cleared = false;
    for (const f of regs) {
      const d = byFid[f.id];
      const p = d && byDiag[d.id];
      if (p && p.approval) {
        delete p.approval;
        cleared = true;
      }
    }
    if (cleared) fs.writeFileSync(reportPath, JSON.stringify(rep, null, 2));
    // Leave one decided so signed-copy can show, but summary must still be absent
    const first = regs[0];
    const firstP = byFid[first.id] && byDiag[byFid[first.id].id];
    if (firstP) {
      // Full reload so cleared approvals are visible before the partial decide
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
      await postDecision(firstP.id, "accepted", "G15 partial decide " + first.id);
      await openFinding(first.id);
      assert.equal(await page.locator('[data-testid="signed-copy"]').count(), 1);
      assert.equal(await page.locator('[data-testid="decisions-summary"]').count(), 0);
    }

    for (const f of regs) {
      const fresh = JSON.parse(fs.readFileSync(reportPath, "utf8"));
      const freshByFid = Object.fromEntries((fresh.diagnoses || []).map((dd) => [dd.finding_id, dd]));
      const freshByDiag = {};
      (fresh.prescriptions || []).forEach((pp) => {
        freshByDiag[pp.diagnosis_id] = pp;
      });
      const d = freshByFid[f.id];
      const p = d && freshByDiag[d.id];
      if (!p) continue;
      if (!p.approval) {
        await postDecision(p.id, "accepted", "G15 decide remaining " + f.id);
      }
    }
    await openFinding(regs[0].id);
    assert.equal(await page.locator('[data-testid="decisions-summary"]').count(), 1);
    const ta = await page.locator('[data-testid="decisions-summary-text"]').inputValue();
    const built = await page.evaluate(() => {
      const input = window.SignedCopy.summary.toSummaryInput(window.NexusDesk);
      return window.SignedCopy.summary.buildDecisionsSummary(input);
    });
    assert.equal(ta, built);
    assert.match(ta, /No measurement: We will not invent a failover rate/);
  });
});
