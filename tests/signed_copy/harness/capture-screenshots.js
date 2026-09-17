"use strict";

/**
 * Capture idle + copied harness screenshots for WS-C visual evidence.
 * Run: node tests/signed_copy/harness/capture-screenshots.js
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const root = path.resolve(__dirname, "../../..");
const outDir = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
};

const sampleInput = {
  verdict: "accept",
  findingTitle: "Share we finished dropped after the prompt change",
  reason: "Because the replay matched and the risk is acceptable.",
  findingUrl: "http://127.0.0.1:8765/#f01_demo",
  metricLabel: "Share we finished",
  observed: "77.5%",
  expected: "85.5%",
  affected: "2,686",
  cause: "The prompt change cut the finish rate.",
  configChange: "agent.prompt.v2",
  changeTarget: "agent.prompt",
  changeDescription: "Roll back to the previous prompt",
  replay: { before: "85.5%", after: "77.5%" },
  risk: "We might undo a real improvement.",
  ifNothingChanges: "Finish rate stays low.",
  ownerLine: "Agent team needs to act",
  technicalNames: ["completion_rate", "f01_demo"],
  recordedAt: null,
  coverageText: "coverage 92%",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const filePath = path.join(root, urlPath.replace(/^\//, ""));
      if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function main() {
  const { server, port } = await startServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage({ viewport: { width: 720, height: 640 } });
  await page.goto(
    `http://127.0.0.1:${port}/tests/signed_copy/harness/ui-harness.html`,
    { waitUntil: "networkidle" }
  );

  const ready = await page.evaluate(() => !!(window.SignedCopy && window.SignedCopy.ui));
  if (!ready) throw new Error("SignedCopy.ui not loaded in harness");

  await page.evaluate((input) => {
    const slot = document.getElementById("slot");
    window.SignedCopy.ui.render(slot, { id: "f01" }, {
      desk: {},
      adapter: { toSignedCopyInput: () => input },
      template: window.SignedCopy.template,
      summary: { toSummaryInput: () => null },
      clipboard: { writeText: async () => {} },
      copy: window.SignedCopy.contract.COPY,
    });
  }, sampleInput);

  await page.waitForSelector('[data-testid="signed-copy-button"]');
  await page.locator('[data-testid="signed-copy"]').screenshot({
    path: path.join(outDir, "idle.png"),
  });

  await page.locator('[data-testid="signed-copy-button"]').click();
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="signed-copy-status"]');
    return el && (el.textContent || "").includes("Copied");
  });
  await page.locator('[data-testid="signed-copy"]').screenshot({
    path: path.join(outDir, "copied.png"),
  });

  await browser.close();
  server.close();
  console.log("wrote idle.png and copied.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
