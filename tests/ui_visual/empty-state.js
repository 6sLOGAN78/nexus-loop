const { chromium } = require("playwright-core");
const fs = require("node:fs/promises");

const baseUrl = process.env.NEXUS_LOOP_URL || "http://127.0.0.1:8765/";

(async () => {
  const report = JSON.parse(await fs.readFile("out/loop-report.json", "utf8"));
  report.verifications = [];
  delete report.generated_at;
  delete report.system_notes;
  for (const prescription of report.prescriptions || []) delete prescription.approval;

  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.route("**/report.json", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(report),
    }));
    await page.goto(new URL("#/", baseUrl).href, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__rep);
    const landing = await page.locator("#app").innerText();
    if (!landing.includes("0\nVERIFIED") || !landing.includes("time not recorded")) {
      throw new Error("landing did not render the empty verification/missing time state");
    }

    await page.goto(new URL("#/dashboard", baseUrl).href, { waitUntil: "networkidle" });
    const dashboard = await page.locator("#app").innerText();
    if (!dashboard.includes("Replay not run")) throw new Error("dashboard hid the no-replay state");

    await page.goto(new URL("#/f/f01_tool_contract_northwind", baseUrl).href, { waitUntil: "networkidle" });
    const detail = await page.locator("#detail").innerText();
    if (!detail.includes("Not verified this run")) throw new Error("detail hid the no-replay state");
    if (await page.locator('[data-testid="signed-copy"]').count()) {
      throw new Error("signed copy appeared without a recorded decision");
    }
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) {
      throw new Error("empty detail overflows horizontally");
    }
  } finally {
    await browser.close();
  }
})();
