import { products, productCategories } from "@/content/products";
import type { Product, ProductCategory } from "@/types/content";
import { translateCategorySlug, type Language } from "@/lib/i18n";

const productTranslationsEn: Record<string, Partial<Product>> = {
  "alfred-10": {
    subtitle: "All-in-One Battery Storage",
    shortDescription: "Inverter and battery storage in one device\n(IP65, installation under 45 min.)",
    description:
      "The Alfred 10 by Strong Energy is a modular, compact energy storage system suitable for residential and commercial applications. With a powerful 10 kW inverter and a battery with up to 24 kWh storage capacity, Alfred 10 provides reliable energy supply - even in backup power mode at full capacity. Thanks to the integrated switchbox and plug & play functionality, the system is easy to install and ideal for flexible, space-saving applications. Awarded the Red Dot Design Award 2024.",
    highlights: [
      { icon: "Zap", title: "Full Inverter Power", text: "10 kW in backup mode, black-start capable" },
      { icon: "Clock", title: "Fast Modular Setup", text: "Installation under 45 minutes, only 24 cm depth" },
      { icon: "Battery", title: "9.6 - 24 kWh Storage", text: "Modularly expandable, 10,000 charge cycles" },
      { icon: "Shield", title: "High Protection Class IP65", text: "Suitable for indoor and outdoor installation" },
      { icon: "Link", title: "AC Coupling", text: "Compatible with existing PV systems" },
      { icon: "HeadphonesIcon", title: "German Support", text: "Free hotline & 12-year warranty" }
    ],
    specs: [
      { label: "Max. PV Input Voltage", value: "1000 V" },
      { label: "Start-up Voltage", value: "150 V" },
      { label: "MPPT Operating Voltage Range", value: "160-950 V" },
      { label: "Number of MPPTs", value: "2" },
      { label: "Max. Input Current per MPPT", value: "20A + 30A" },
      { label: "Battery Type", value: "LFP (integrated)" },
      { label: "Number of Battery Modules", value: "4 to 10" },
      { label: "Rated Capacity", value: "9.6 - 24 kWh" },
      { label: "Max. Charge/Discharge Power", value: "12.5 kW / 11.3 kW" },
      { label: "European Efficiency", value: "97%" },
      { label: "Rated Power", value: "10 kW" },
      { label: "Dimensions (WxHxD)", value: "780 x 1760 x 240 mm" },
      { label: "Weight", value: "215 kg" }
    ]
  },
  "star-q": {
    subtitle: "Commercial Storage",
    tagline: "Commercial Storage Complete System",
    shortDescription: "50 kW | 109.7 kWh | Floor mounted | Outdoor - scalable commercial storage solution for industry and business.",
    description:
      "The Star Q is a powerful complete system with an integrated hybrid inverter (Solis S6-EH3P50K-H), designed for industrial and commercial applications. With 7 CATL battery modules (15.7 kWh each, 306 Ah), integrated fire suppression system and protection classes IP66 (inverter) and IP67 (battery modules), it offers the highest safety and reliability. The system supports peak shaving, self-consumption optimization, backup (50 kW) and is black-start capable. Scalable up to 6 systems in master/slave operation. Strong Energy is the official distribution partner for CNTE and CATL commercial storage in Europe.",
    highlights: [
      { icon: "Shield", title: "IP66 Inverter / IP67 Battery Modules", text: "Integrated fire suppression with smoke detector, gas detector & aerosol extinguishing system" },
      { icon: "Zap", title: "50 kW Power", text: "109.7 kWh storage capacity, scalable up to 6 systems (218 kWh battery expansion)" },
      { icon: "Battery", title: "CATL Cells / Modules", text: "LFP technology, >=10,000 cycles, 95% DoD, 306 Ah" },
      { icon: "Link", title: "Solis EMS / Solis Cloud", text: "Peak shaving, grid services & self-consumption optimization via Modbus TCP" },
      { icon: "Clock", title: "Operating Range -25°C to +55°C", text: "For indoor and outdoor installation" },
      { icon: "HeadphonesIcon", title: "Up to 10-Year Warranty", text: "3-year warranty, extendable up to 10 years at additional cost" }
    ],
    specsSections: [
      {
        title: "Basics",
        rows: [
          { label: "Manufacturer", values: ["CNTE - Star Q 50 kW / 109 kWh"] },
          { label: "Inverter", values: ["Solis - S6-EH3P50K-H"] },
          { label: "Battery Modules", values: ["CATL - 7 x 15.7 kWh (=109.7 kWh)"] },
          { label: "Cells", values: ["CATL - 306 Ah"] },
          { label: "Architecture", values: ["1P16S7S"] }
        ]
      },
      {
        title: "Inverter",
        groups: [
          {
            label: "DC Battery Input",
            rows: [
              { label: "Max DC Voltage (VDC)", values: ["800"] },
              { label: "Min DC Voltage (VDC)", values: ["150"] },
              { label: "Charge/Discharge Rate (C-rate)", values: ["0.48"] }
            ]
          },
          {
            label: "AC Input/Output",
            rows: [
              { label: "Nominal Power (kW)", values: ["50"] },
              { label: "Maximum Power (kVA)", values: ["50"] },
              { label: "Maximum Current (A)", values: ["76"] },
              { label: "Nominal Voltage (VAC)", values: ["230 / 400"] },
              { label: "Frequency (Hz)", values: ["50 / 60"] },
              { label: "Power Factor", values: ["Adjustable from -0.8 to +0.8"] }
            ]
          },
          {
            label: "Backup Output",
            rows: [
              { label: "Nominal Power (kW)", values: ["50"] },
              { label: "Maximum Power (kVA)", values: ["50"] },
              { label: "Special Function", values: ["Simultaneous charging and backup supply at 50 kW each"] }
            ]
          },
          {
            label: "PV Input",
            rows: [
              { label: "Max PV Input Power (kW)", values: ["96"] },
              { label: "Max String Power (kW)", values: ["100"] },
              { label: "Max Input Voltage (VDC)", values: ["1000"] },
              { label: "Nominal PV Input Voltage (VDC)", values: ["600"] },
              { label: "Number of MPPTs", values: ["4"] },
              { label: "Number of PV Inputs / Strings", values: ["8"] },
              { label: "MPPT Control Range (VDC)", values: ["150 to 850"] },
              { label: "MPPT Start Voltage (VDC)", values: ["180"] }
            ]
          },
          {
            label: "General Information",
            rows: [
              { label: "Temperature Range", values: ["-25°C to +55°C"] },
              { label: "Max Installation Altitude (m)", values: ["4000"] },
              { label: "Weight (kg)", values: ["73"] },
              { label: "Inverter Protection Class", values: ["IP66"] },
              { label: "Battery Module Protection Class", values: ["IP67"] }
            ]
          }
        ]
      },
      {
        title: "Battery Modules",
        rows: [
          { label: "Architecture", values: ["1P16S"] },
          { label: "Cell Chemistry", values: ["LFP"] },
          { label: "Nominal Voltage (VDC)", values: ["51.2"] },
          { label: "Battery Lifetime (Cycles)", values: [">=10,000"] },
          { label: "SOH @25°C (%)", values: ["70"] },
          { label: "DoD (%)", values: ["95"] }
        ]
      },
      {
        title: "Dimensions & Weight",
        rows: [
          { label: "Width (mm)", values: ["1272"] },
          { label: "Depth (mm)", values: ["1356"] },
          { label: "Height (mm)", values: ["2070"] },
          { label: "Weight (kg)", values: ["1800"] }
        ]
      },
      {
        title: "Other",
        rows: [
          { label: "Safety", values: ["Smoke detector, gas detector, pressure relief valve, aerosol extinguishing system, flood valve"] },
          { label: "Certificates", values: ["VDE-AR-N 4105 / 4110"] },
          { label: "Communication", values: ["Modbus TCP"] },
          { label: "EMS", values: ["Solis EMS / Solis Cloud"] },
          { label: "Warranty", values: ["3 years, extendable up to 10 years at additional cost"] },
          { label: "Scalability", values: ["Up to 6 systems in master/slave operation - battery expansion to 218 kWh available"] }
        ]
      }
    ]
  },
  "star-h": {
    subtitle: "Commercial Storage",
    tagline: "Commercial Storage Complete System",
    shortDescription: "115 kW | 232.5 kWh | Floor mounted | Outdoor - scalable commercial storage solution for industry and business.",
    description:
      "The Star H-232 is a powerful complete system with YUNT MARS-125KT inverter, designed for industrial and commercial applications. With 5 CATL battery modules, integrated fire suppression system and robust protection classes, it offers high safety and reliability. Scalable up to 12 systems in master/slave operation."
  },
  "hochvolt-bundle": {
    name: "High-Voltage Bundle",
    subtitle: "Hybrid Inverter & HV Battery Storage",
    tagline: "Complete package for your solar system",
    shortDescription: "Hybrid inverter plus HV battery storage - smart home compatible and Solar Manager ready."
  }
};

function localizeProduct(product: Product, lang: Language): Product {
  const category = productCategories.find((item) => item.slug === product.categorySlug);
  const localizedCategory = lang === "en" ? category?.label_en || product.category : category?.label_de || product.category;
  const overrides = lang === "en" ? productTranslationsEn[product.slug] || {} : {};
  return {
    ...product,
    ...overrides,
    category: localizedCategory,
    categorySlug: translateCategorySlug(product.categorySlug, lang),
    modelAssets: product.modelAssets
  };
}

function localizeCategory(category: ProductCategory, lang: Language): ProductCategory {
  return {
    ...category,
    slug: translateCategorySlug(category.slug, lang)
  };
}

export function getProducts(lang: Language = "de") {
  return products.map((product) => localizeProduct(product, lang));
}

export function getProductCategories(lang: Language = "de") {
  return productCategories.map((category) => localizeCategory(category, lang));
}

export function getProductsByCategory(categorySlug: string, lang: Language = "de") {
  return getProducts(lang).filter((product) => product.categorySlug === categorySlug);
}
