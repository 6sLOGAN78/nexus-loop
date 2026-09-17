const { chromium } = require("playwright-core");
const fs = require("node:fs/promises");
const path = require("node:path");

const baseUrl = process.env.NEXUS_LOOP_URL || "http://127.0.0.1:8765/";
const outputDir = process.env.NEXUS_LOOP_SCREENSHOT_DIR || "artifacts/ui/latest";
const views = (process.env.NEXUS_LOOP_VIEWS || "landing:#/,dashboard:#/dashboard,detail:#/f/f02_kb_gap_acme")
  .split(",")
  .map((entry) => {
    const splitAt = entry.indexOf(":");
    return [entry.slice(0, splitAt), entry.slice(splitAt + 1)];
  });
const sizes = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];

(async () => {
  await fs.mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  });
  try {
    for (const [sizeName, width, height] of sizes) {
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 1,
        reducedMotion: "no-preference",
      });
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("request", (request) => {
        if (new URL(request.url()).origin !== new URL(baseUrl).origin) {
          consoleErrors.push(`External request: ${request.url()}`);
        }
      });
      for (const [viewName, hash] of views) {
        await page.goto(new URL(hash, baseUrl).href, { waitUntil: "networkidle" });
        await page.waitForFunction(() => window.__rep || document.body.dataset.ready === "true");
        const bodyOverflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        if (bodyOverflows) throw new Error(`${viewName}-${sizeName}: document overflows horizontally`);
        await page.screenshot({
          path: path.join(outputDir, `${viewName}-${sizeName}.png`),
          animations: "disabled",
          fullPage: false,
        });
      }
      if (consoleErrors.length) throw new Error(consoleErrors.join("\n"));
      await page.close();
    }
  } finally {
    await browser.close();
  }
})();
