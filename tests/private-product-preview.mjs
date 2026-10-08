import assert from "node:assert/strict";
import { chromium, request } from "@playwright/test";

const baseURL = process.env.PREVIEW_TEST_BASE_URL || "http://127.0.0.1:3100";
const password = process.env.PRIVATE_PREVIEW_PASSWORD;
assert.ok(password, "Set PRIVATE_PREVIEW_PASSWORD to test the protected preview.");
const preview = process.env.PRIVATE_PREVIEW_ID;
const productName = process.env.PRIVATE_PREVIEW_PRODUCT_NAME;
assert.ok(preview && productName, "Set PRIVATE_PREVIEW_ID and PRIVATE_PREVIEW_PRODUCT_NAME.");
const productPattern = new RegExp(productName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
const routes = { de: `/de/private-preview/${preview}`, en: `/en/private-preview/${preview}` };
const mediaPath = `/api/private-preview/media/${preview}`;
const api = await request.newContext({ baseURL });
let authenticated = await request.newContext({ baseURL });
const headers = { Origin: baseURL };

try {
  for (const path of Object.values(routes)) {
    for (const requestHeaders of [{}, { RSC: "1" }, { Cookie: "strong-energy-private-product=unlocked; strong-energy-site-preview=unlocked" }]) {
      const response = await api.get(path, { headers: requestHeaders });
      assert.equal(response.status(), 200);
      assert.match(response.headers()["x-robots-tag"], /noindex/);
      assert.match(response.headers()["cache-control"], /no-store/);
      assert.doesNotMatch(await response.text(), productPattern);
    }
  }
  for (const asset of ["cabinet.webp", "hero.mp4"]) {
    assert.equal((await api.get(`${mediaPath}/${asset}`)).status(), 401);
  }
  assert.equal((await api.post("/api/private-preview/password", { headers, data: { password: "wrong", preview } })).status(), 401);
  assert.equal((await api.post("/api/private-preview/password", { headers: { Origin: "https://example.com" }, data: { password, preview } })).status(), 403);

  const login = await authenticated.post("/api/private-preview/password", { headers, data: { password, preview } });
  assert.equal(login.status(), 200);
  assert.match(login.headers()["set-cookie"], /HttpOnly/i);
  assert.match(login.headers()["set-cookie"], /SameSite=Lax/i);
  const state = await authenticated.storageState();
  const session = state.cookies.find((cookie) => cookie.name === "strong-energy-private-product");
  assert.ok(session);
  if (baseURL.startsWith("http://")) {
    // Production cookies require HTTPS; explicitly send the cookie for local API tests.
    await authenticated.dispose();
    authenticated = await request.newContext({ baseURL, extraHTTPHeaders: { Cookie: `${session.name}=${session.value}` } });
  }
  for (const path of Object.values(routes)) {
    const response = await authenticated.get(path);
    assert.ok((await response.text()).includes(productName), "Authenticated preview must contain the product.");
    assert.match(response.headers()["cache-control"], /no-store/);
  }
  const tampered = session.value.slice(0, -1) + (session.value.endsWith("0") ? "1" : "0");
  assert.doesNotMatch(await (await api.get(routes.de, { headers: { Cookie: `strong-energy-private-product=${tampered}` } })).text(), productPattern);
  assert.equal((await authenticated.get(`${mediaPath}/cabinet.webp`)).status(), 200);
  const video = await authenticated.get(`${mediaPath}/hero.mp4`, { headers: { Range: "bytes=0-1023" } });
  assert.equal(video.status(), 206);
  assert.equal((await video.body()).length, 1024);
  assert.equal(video.headers()["content-type"], "video/mp4");
  assert.equal((await authenticated.get(`${mediaPath}/hero.mp4`, { headers: { Range: "bytes=999999999-" } })).status(), 416);
  assert.equal((await api.get(`${mediaPath}/hero.mp4`)).status(), 401);

  for (const path of ["/de/produkte", "/de/produkte/gewerbespeicher-aio", "/en/products", "/en/products/commercial-storage-aio", "/de/produkte/gewerbespeicher-aio/star-h", "/de/produkte/gewerbespeicher-aio/star-q", "/sitemap.xml"]) {
    assert.doesNotMatch(await (await api.get(path)).text(), productPattern, `Unpublished product leaked into ${path}`);
  }
  console.log("PASS: protected HTML/RSC, signed cookie, media, video ranges and public catalogue isolation.");

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(routes.de);
    await page.getByRole("button", { name: "Nur notwendige", exact: true }).click();
    await page.getByLabel("Passwort", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Vorschau öffnen" }).click();
    await page.getByRole("heading", { name: productName, exact: true, level: 1 }).waitFor();
    await page.waitForFunction(() => document.querySelector("video")?.readyState >= 2);
    assert.ok(await page.locator(`img[src="${mediaPath}/cabinet.webp"]`).first().evaluate((img) => img.complete && img.naturalWidth > 0));
    await page.getByRole("tab", { name: "Vergleich", exact: true }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), productPattern);
    await page.getByRole("tab", { name: "Technische Daten", exact: true }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), /kWh/);
    await page.getByRole("tab", { name: "Downloads", exact: true }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), /Brochure 2026/);
    await page.screenshot({ path: "/tmp/strong-private-preview-desktop.png", fullPage: true });
    await page.getByRole("button", { name: "Aktuelle Sprache Deutsch" }).click();
    await page.getByRole("link", { name: "English", exact: true }).click();
    await page.waitForURL(`**${routes.en}`);
    await page.getByRole("heading", { name: productName, exact: true, level: 1 }).waitFor();
    await page.getByRole("tab", { name: "Technical Data", exact: true }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), /Nominal capacity/);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: "/tmp/strong-private-preview-mobile.png", fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log("PASS: browser password flow, uploaded hero video, product image, private comparison, DE/EN tabs and mobile layout.");
    await context.close();
  } finally {
    await browser.close();
  }
} finally {
  await api.dispose();
  await authenticated.dispose();
}
