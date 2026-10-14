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
    const availability = lang === "de" ? "Lieferbar ab November 2026" : "Available from November 2026";
    assert.ok((await highlight.innerText()).includes(availability));
    assert.ok((await highlight.locator('button img').first().getAttribute("src")).includes("onovo-carport.jpg"));
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute("content")).endsWith("onovo-carport.jpg"));
    assert.match(await highlight.innerText(), new RegExp(manufacturer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.equal(await page.locator("section").first().getByRole("button", { name: "Produktvideo", exact: true }).count(), 0);
    if (lang === "de") {
      await highlight.getByRole("button", { name: "Produktvideo", exact: true }).click();
      const videoDialog = page.getByRole("dialog", { name: "Onovo Kunstor Produktvideo", exact: true });
      await videoDialog.waitFor();
      assert.equal(await videoDialog.locator('source[type="video/mp4"]').getAttribute("src"), "/assets/products/onovo-kunstor/niklas-erklaert-onovo.mp4");
      await videoDialog.locator("video").evaluate((video) => video.readyState >= 1 || new Promise((resolve) => video.addEventListener("loadedmetadata", resolve, { once: true })));
      assert.deepEqual(await videoDialog.locator("video").evaluate((video) => [video.videoWidth, video.videoHeight]), [720, 1280]);
      const videoBox = await videoDialog.locator("video").boundingBox();
      assert.ok(videoBox.height > videoBox.width);
      await page.keyboard.press("Escape");
      assert.equal(await videoDialog.count(), 0);
    } else {
      assert.equal(await page.getByRole("button", { name: /Product video|Produktvideo/, exact: true }).count(), 0);
    }
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
    const datasheet = page.getByRole("tabpanel").getByRole("link", { name: lang === "de" ? "Onovo Kunstor – Datenblatt" : "Onovo Kunstor – Datasheet", exact: true });
    assert.equal(await datasheet.getAttribute("href"), `/assets/downloads/STRONG_Onovo_Kunstor_${lang === "de" ? "Datenblatt_DE" : "Datasheet_EN"}.pdf`);

    await page.getByRole("button", { name: lang === "de" ? "Angebot anfragen" : "Request a quote", exact: true }).first().click();
    const inquiry = page.locator('form:has(input[name="productSlug"])');
    assert.equal(await inquiry.locator('input[name="productSlug"]').inputValue(), "onovo-kunstor");
    assert.equal(await inquiry.locator('input[name="productName"]').inputValue(), "Onovo Kunstor");
    await page.getByRole("button", { name: lang === "de" ? "Formular schließen" : "Close form", exact: true }).click();

    await page.locator("[data-onovo-viewer]").scrollIntoViewIfNeeded();
    await page.waitForFunction((ready) => document.querySelector("[data-model-status]")?.getAttribute("data-model-status") === ready, "ready", { timeout: 90_000 });
    assert.doesNotMatch(await page.locator("[data-onovo-viewer]").innerText(), /Bereit zum Erkunden|Ready to explore/);
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
    assert.ok((await page.getByRole("tabpanel").locator("article").first().innerText()).includes(availability));
    assert.ok((await page.getByRole("tabpanel").locator("article img").first().getAttribute("src")).includes("onovo-carport.jpg"));
    await context.close();
  }
  const sitemap = await (await api.get("/sitemap.xml")).text();
  for (const prefix of Object.values(routes)) assert.ok(sitemap.includes(`${prefix}/onovo-kunstor`));
  for (const name of ["onovo-carport.jpg", "onovo-office.jpg", "onovo-warehouse.jpg", "cabinet.webp"]) {
    assert.equal((await api.head(`/assets/products/onovo-kunstor/${name}`)).status(), 200);
  }
  const video = await api.get("/assets/products/onovo-kunstor/hero-fullhd.mp4", { headers: { Range: "bytes=0-1023" } });
  assert.equal(video.status(), 206);
  assert.equal((await video.body()).length, 1024);
  const explanation = await api.get("/assets/products/onovo-kunstor/niklas-erklaert-onovo.mp4", { headers: { Range: "bytes=0-1023" } });
  assert.equal(explanation.status(), 206);
  assert.equal((await explanation.body()).length, 1024);
  for (const name of ["STRONG_Onovo_Kunstor_Datenblatt_DE.pdf", "STRONG_Onovo_Kunstor_Datasheet_EN.pdf"]) {
    const pdf = await api.get(`/assets/downloads/${name}`);
    assert.equal(pdf.status(), 200);
    assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
  }

  const commercialPage = await browser.newPage({ baseURL, viewport: { width: 1440, height: 1100 } });
  const commercialErrors = [];
  commercialPage.on("pageerror", (error) => commercialErrors.push(error.message));
  await commercialPage.goto("/de/gewerbespeicher?utm_source=onovo-check&utm_campaign=commercial");
  const commercialCookies = commercialPage.getByRole("button", { name: "Nur notwendige", exact: true });
  await commercialCookies.waitFor();
  await commercialCookies.click();
  for (const target of [
    { name: "Gewerbespeicher", slug: "gewerbespeicher-beratung", button: "Beratungstermin buchen" },
    { name: "Onovo Kunstor", slug: "onovo-kunstor", button: "Onovo Kunstor anfragen" },
    { name: "Star Q", slug: "star-q", button: "Star Q anfragen" },
    { name: "Star H", slug: "star-h", button: "Star H anfragen" }
  ]) {
    await commercialPage.getByRole("button", { name: target.button, exact: true }).first().click();
    const dialog = commercialPage.getByRole("dialog", { name: `Anfrage für ${target.name}`, exact: true });
    await dialog.waitFor();
    assert.equal(await dialog.locator('input[name="productName"]').inputValue(), target.name);
    assert.equal(await dialog.locator('input[name="productSlug"]').inputValue(), target.slug);
    assert.equal(await dialog.locator('input[name="form_id"]').inputValue(), "product_inquiry");
    assert.equal(await dialog.locator('input[name="utm_source"]').inputValue(), "onovo-check");
    await dialog.locator('select[name="customerType"]').selectOption("gewerbe");
    await dialog.locator('select[name="goalSelect"]').selectOption("Peak Shaving");
    await dialog.locator('select[name="projectStatusSelect"]').selectOption("In Planung");
    await dialog.getByPlaceholder("Bitte geben Sie Ihre Antwort ein.").fill("125");
    await dialog.getByRole("button", { name: "Weiter", exact: true }).click();
    await dialog.getByPlaceholder("Vorname *", { exact: true }).waitFor();
    assert.equal(await dialog.locator('input[name="goal"]').inputValue(), "Peak Shaving");
    assert.equal(await dialog.locator('input[name="projectStatus"]').inputValue(), "In Planung");
    assert.equal(await dialog.locator('input[name="connectionPower"]').inputValue(), "125");
    await dialog.getByRole("button", { name: "Zurück", exact: true }).click();
    assert.equal(await dialog.locator('select[name="goalSelect"]').inputValue(), "Peak Shaving");
    await commercialPage.keyboard.press("Escape");
    assert.equal(await dialog.count(), 0);
  }
  await commercialPage.setViewportSize({ width: 390, height: 844 });
  await commercialPage.getByRole("button", { name: "Beratungstermin buchen", exact: true }).last().click();
  const mobileDialog = commercialPage.getByRole("dialog", { name: "Anfrage für Gewerbespeicher", exact: true });
  await mobileDialog.waitFor();
  assert.equal(await commercialPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await commercialPage.screenshot({ path: "/tmp/onovo-commercial-inquiry-mobile.png" });
  await mobileDialog.getByRole("button", { name: "Weiter", exact: true }).click();
  await mobileDialog.getByPlaceholder("E-Mail *", { exact: true }).waitFor();
  await commercialPage.screenshot({ path: "/tmp/onovo-commercial-inquiry-contact-mobile.png" });
  await commercialPage.keyboard.press("Escape");
  assert.deepEqual(commercialErrors, []);
  await commercialPage.close();

  if (shareToken) {
    const page = await browser.newPage({ baseURL });
    await page.goto(`/3d/${shareToken}?lang=en`);
    await page.waitForFunction(() => document.querySelector("[data-model-status]")?.getAttribute("data-model-status") === "ready", undefined, { timeout: 90_000 });
    await page.getByRole("button", { name: "Open door", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("[data-door-angle]")?.textContent === "115°");
    assert.equal(await page.locator("header, footer, nav").count(), 0);
    assert.equal(await page.locator("main").getAttribute("lang"), "en");
    await page.getByRole("link", { name: "Deutsch", exact: true }).click();
    await page.getByRole("button", { name: "Tür öffnen", exact: true }).waitFor();
    await page.close();
  }
  console.log("PASS: bilingual Onovo pages, new primary carport image, availability, German portrait video, model controls, catalogue and metadata, and general/product-specific two-step commercial inquiries on desktop/mobile.");
} finally {
  await browser.close();
  await api.dispose();
}
