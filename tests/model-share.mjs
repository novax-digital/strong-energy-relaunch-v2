import assert from "node:assert/strict";
import { chromium, request } from "@playwright/test";

const baseURL = process.env.MODEL_SHARE_TEST_BASE_URL || "http://127.0.0.1:3100";
const token = process.env.MODEL_SHARE_TEST_TOKEN;
assert.match(token || "", /^[a-f0-9]{64}$/, "Set MODEL_SHARE_TEST_TOKEN to the independent model link token.");
const pagePath = `/3d/${token}`;
const api = await request.newContext({ baseURL });

try {
  for (const headers of [{}, { RSC: "1" }]) {
    const response = await api.get(pagePath, { headers });
    assert.equal(response.status(), 200);
    assert.match(response.headers()["cache-control"], /no-store/);
    assert.match(response.headers()["x-robots-tag"], /noindex/);
    assert.equal(response.headers()["referrer-policy"], "no-referrer");
    assert.equal(response.headers()["set-cookie"], undefined);
    assert.doesNotMatch(await response.text(), /\/private-preview\/|Technische Daten|ProductDetailHero|UmamiAnalytics/);
  }

  const wrongToken = token.slice(0, -1) + (token.endsWith("0") ? "1" : "0");
  for (const value of [wrongToken, "invalid", "0".repeat(40)]) {
    for (const path of [`/3d/${value}`, `/api/model-share/${value}`]) {
      const response = await api.get(path);
      assert.equal(response.status(), 404);
      assert.match(response.headers()["cache-control"], /no-store/);
    }
  }
  const model = await api.get(`/api/model-share/${token}`);
  assert.equal(model.status(), 200);
  assert.equal(model.headers()["content-type"], "model/gltf-binary");
  assert.equal((await model.body()).subarray(0, 4).toString(), "glTF");
  assert.equal((await api.get(`/api/private-preview/model/${"0".repeat(40)}`)).status(), 401);
  assert.doesNotMatch(await (await api.get("/sitemap.xml")).text(), /\/3d\/|\/model-share\//);
  console.log("PASS: independent model link, denied invalid tokens, private response headers, no preview access and no sitemap exposure.");

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1100 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(pagePath);
    await page.getByRole("heading", { name: "Onovo Kunstor in 3D", level: 1 }).waitFor();
    await page.waitForFunction(() => document.querySelector("[data-model-status]")?.getAttribute("data-model-status") === "ready", undefined, { timeout: 90_000 });
    assert.equal(await page.locator("header, footer, nav, video").count(), 0);
    assert.equal((await context.cookies()).some((cookie) => cookie.name.startsWith("strong-energy-")), false);

    await page.getByRole("button", { name: "Tür öffnen", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("[data-door-angle]")?.textContent === "115°");
    await page.getByRole("button", { name: "Tür schließen", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("[data-door-angle]")?.textContent === "0°");
    const orbit = await page.locator("model-viewer").evaluate((viewer) => viewer.getCameraOrbit().theta);
    await page.getByRole("button", { name: "Rechts drehen", exact: true }).click();
    await page.waitForFunction((previous) => Math.abs(document.querySelector("model-viewer").getCameraOrbit().theta - previous) > 0.1, orbit);
    await page.getByRole("button", { name: "Hineinzoomen", exact: true }).click();
    await page.getByRole("button", { name: "Ansicht zurücksetzen", exact: true }).click();
    await page.screenshot({ path: "/tmp/strong-onovo-model-share-desktop.png", fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await page.waitForFunction(() => document.querySelector("[data-model-status]")?.getAttribute("data-model-status") === "ready");
    await page.getByRole("slider", { name: "Türöffnung" }).fill("60");
    await page.waitForFunction(() => document.querySelector("[data-door-angle]")?.textContent === "60°");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: "/tmp/strong-onovo-model-share-mobile.png", fullPage: true });
    assert.deepEqual(errors, []);
    console.log("PASS: desktop/mobile model loading, door animation, angle slider, rotation and controls without website navigation or preview cookies.");
    await context.close();
  } finally {
    await browser.close();
  }
} finally {
  await api.dispose();
}
