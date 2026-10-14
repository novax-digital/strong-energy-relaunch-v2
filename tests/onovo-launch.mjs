import assert from "node:assert/strict";
import { chromium, request } from "@playwright/test";

const baseURL = process.env.ONOVO_TEST_BASE_URL || "http://127.0.0.1:3101";
const routes = {
  de: "/de/produkte/gewerbespeicher-aio",
  en: "/en/products/commercial-storage-aio"
};
const preview = "0807726eb6b6911d40cdd2265cffdaf11f4e6e7b";
const shareToken = process.env.MODEL_SHARE_TEST_TOKEN;
const api = await request.newContext({ baseURL });
const browser = await chromium.launch();

try {
  for (const lang of ["de", "en"]) {
    const path = `${routes[lang]}/onovo-kunstor`;
    const response = await api.get(path);
    assert.equal(response.status(), 200);
    const html = await response.text();
    assert.match(html, /REPT/);
    assert.doesNotMatch(html, /\/api\/private-preview\/|Vorschau öffnen|Open preview/);
    const redirect = await api.get(`/${lang}/private-preview/${preview}`, { maxRedirects: 0 });
    assert.equal(redirect.status(), 308);
    assert.equal(new URL(redirect.headers().location, baseURL).pathname, path);

    const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1100 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await page.getByRole("heading", { level: 1, name: "Onovo Kunstor", exact: true }).waitFor();
    const cookieButton = page.getByRole("button", { name: lang === "de" ? "Nur notwendige" : "Necessary only", exact: true });
    if (await cookieButton.isVisible()) await cookieButton.click();
    assert.doesNotMatch(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
    assert.equal(await page.locator('link[rel="alternate"][hreflang="en-GB"]').getAttribute("href"), `https://strong-energy.eu${routes.en}/onovo-kunstor`);
    assert.equal(await page.locator('link[rel="alternate"][hreflang="de-DE"]').getAttribute("href"), `https://strong-energy.eu${routes.de}/onovo-kunstor`);

    const manufacturer = lang === "de" ? "Hersteller: REPT, REPT Battero 5 × 52,2 kWh" : "Manufacturer: REPT, REPT Battero 5 × 52.2 kWh";
    const highlight = page.locator("section").filter({ has: page.getByRole("heading", { level: 2, name: "Onovo Kunstor", exact: true }) });
    assert.match(await highlight.innerText(), new RegExp(manufacturer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    for (let index = 1; index <= 4; index++) {
      await page.getByRole("button", { name: lang === "de" ? `Onovo Kunstor Bild ${index} anzeigen` : `Onovo Kunstor show image ${index}`, exact: true }).click();
      await page.waitForFunction(() => {
        const img = document.querySelector('button[aria-label*="Bild vergrößern"] img, button[aria-label*="enlarge image"] img');
        return img?.complete && img.naturalWidth > 0;
      });
    }
    await page.getByRole("button", { name: lang === "de" ? "Onovo Kunstor Bild 1 anzeigen" : "Onovo Kunstor show image 1", exact: true }).click();
    await page.getByRole("tab", { name: lang === "de" ? "Beschreibung" : "Description", exact: true }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), lang === "de" ? /LFP-Zellen \(Hersteller: REPT\)/ : /LFP cells \(manufacturer: REPT\)/);
    await page.getByRole("tab", { name: "Features", exact: true }).click();
    assert.ok((await page.getByRole("tabpanel").innerText()).includes(manufacturer));
    await page.getByRole("tab", { name: lang === "de" ? "Technische Daten" : "Technical Data", exact: true }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), /314 Ah \((?:Hersteller|manufacturer): REPT\)/);
    assert.match(await page.getByRole("tabpanel").innerText(), lang === "de" ? /10 Jahre Garantie, individuell erweiterbar/ : /10-year warranty, individually extendable/);
    await page.getByRole("tab", { name: lang === "de" ? "Vergleich" : "Comparison", exact: true }).click();
    const table = page.getByRole("table");
    assert.equal(await table.getByRole("columnheader").count(), 4);
    const ems = table.getByRole("row").filter({ has: page.getByRole("rowheader", { name: lang === "de" ? "Externes EMS" : "External EMS", exact: true }) });
    assert.match(await ems.getByRole("cell").last().innerText(), lang === "de" ? /Ja\s+Consolinno EMS/ : /Yes\s+Consolinno EMS/);
    assert.doesNotMatch(await table.innerText(), /nicht spezifiziert|not specified/);
    await page.getByRole("tab", { name: "Downloads", exact: true }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), /Brochure 2026/);

    await page.getByRole("button", { name: lang === "de" ? "Angebot anfragen" : "Request a quote", exact: true }).first().click();
    const inquiry = page.locator('form:has(input[name="productSlug"])');
    assert.equal(await inquiry.locator('input[name="productSlug"]').inputValue(), "onovo-kunstor");
    assert.equal(await inquiry.locator('input[name="productName"]').inputValue(), "Onovo Kunstor");
    await page.getByRole("button", { name: lang === "de" ? "Formular schließen" : "Close form", exact: true }).click();

    await page.locator("[data-onovo-viewer]").scrollIntoViewIfNeeded();
    await page.waitForFunction((ready) => document.querySelector("[data-model-status]")?.textContent === ready, lang === "de" ? "Bereit zum Erkunden" : "Ready to explore", { timeout: 90_000 });
    await page.getByRole("button", { name: lang === "de" ? "Tür öffnen" : "Open door", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("[data-door-angle]")?.textContent === "115°");
    await page.screenshot({ path: `/tmp/onovo-launch-${lang}-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `/tmp/onovo-launch-${lang}-mobile.png`, fullPage: true });
    assert.deepEqual(errors, []);

    for (const slug of ["star-q", "star-h"]) {
      await page.goto(`${routes[lang]}/${slug}#${lang === "de" ? "vergleich" : "comparison"}`);
      await page.getByRole("table").getByRole("link", { name: /Onovo Kunstor/ }).waitFor();
      assert.equal(await page.getByRole("table").getByRole("columnheader").count(), 4);
      assert.ok((await page.getByRole("table").getByRole("link", { name: /Onovo Kunstor/ }).getAttribute("href")).startsWith(path));
    }
    await page.goto(routes[lang]);
    assert.equal(await page.getByRole("tabpanel").locator("article h2").first().innerText(), "Onovo Kunstor");
    await context.close();
  }
  const sitemap = await (await api.get("/sitemap.xml")).text();
  for (const prefix of Object.values(routes)) assert.ok(sitemap.includes(`${prefix}/onovo-kunstor`));
  for (const name of ["onovo-office.jpg", "onovo-wallboxes.jpg", "onovo-warehouse.jpg", "cabinet.webp"]) {
    assert.equal((await api.head(`/assets/products/onovo-kunstor/${name}`)).status(), 200);
  }
  const video = await api.get("/assets/products/onovo-kunstor/hero-fullhd.mp4", { headers: { Range: "bytes=0-1023" } });
  assert.equal(video.status(), 206);
  assert.equal((await video.body()).length, 1024);

  if (shareToken) {
    const page = await browser.newPage({ baseURL });
    await page.goto(`/3d/${shareToken}?lang=en`);
    await page.waitForFunction(() => document.querySelector("[data-model-status]")?.textContent === "Ready to explore", undefined, { timeout: 90_000 });
    await page.getByRole("button", { name: "Open door", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("[data-door-angle]")?.textContent === "115°");
    assert.equal(await page.locator("header, footer, nav").count(), 0);
    assert.equal(await page.locator("main").getAttribute("lang"), "en");
    await page.getByRole("link", { name: "Deutsch", exact: true }).click();
    await page.getByRole("button", { name: "Tür öffnen", exact: true }).waitFor();
    await page.close();
  }
  console.log("PASS: public bilingual Onovo pages, exact REPT corrections, four photos, specs, warranty, all three product comparisons, brochure, model controls, first catalogue position, preview redirects, sitemap and English standalone viewer.");
} finally {
  await browser.close();
  await api.dispose();
}
