import type { Locale, NavItem, SeoContent } from "@/types/content";

export type Language = Locale;

export const languages: Record<Language, { label: string; shortLabel: string; flag: string; htmlLang: string; ogLocale: string }> = {
  de: { label: "Deutsch", shortLabel: "DE", flag: "🇩🇪", htmlLang: "de-DE", ogLocale: "de_DE" },
  en: { label: "English", shortLabel: "EN", flag: "🇬🇧", htmlLang: "en-GB", ogLocale: "en_GB" }
};

const deToEn: Record<string, string> = {
  "/produkte": "/products",
  "/ueber-uns": "/about-us",
  "/kontakt": "/contact",
  "/impressum": "/imprint",
  "/datenschutz": "/privacy",
  "/agb": "/terms",
  "/garantiebedingungen": "/warranty",
  "/rechtliche-hinweise": "/legal-notice",
  "/gpsr": "/gpsr",
  "/cookie-richtlinie": "/cookie-policy",
  "/partner": "/partners",
  "/360-app": "/360-app",
  "/praesentation": "/presentation"
};

const enToDe: Record<string, string> = Object.fromEntries(Object.entries(deToEn).map(([de, en]) => [en, de]));

export const categorySlugsDeToEn: Record<string, string> = {
  solaranlagen: "solar-systems",
  "gewerbespeicher-aio": "commercial-storage-aio",
  "gewerbespeicher-container": "commercial-storage-container"
};

export const categorySlugsEnToDe: Record<string, string> = Object.fromEntries(Object.entries(categorySlugsDeToEn).map(([de, en]) => [en, de]));

export const legalSlugsDeToEn: Record<string, string> = {
  impressum: "imprint",
  datenschutz: "privacy",
  agb: "terms",
  garantiebedingungen: "warranty",
  "rechtliche-hinweise": "legal-notice",
  gpsr: "gpsr",
  "cookie-richtlinie": "cookie-policy"
};

export const legalSlugsEnToDe: Record<string, string> = Object.fromEntries(Object.entries(legalSlugsDeToEn).map(([de, en]) => [en, de]));

export const translations = {
  de: {
    nav: {
      home: "Home",
      products: "Produkte",
      about: "Über uns",
      partner: "Partner",
      app: "360 App",
      blog: "Blog",
      downloads: "Downloads",
      media: "Media",
      contact: "Kontakt",
      faq: "FAQ"
    },
    topbar: {
      followUs: "Folge uns:",
      announcement: "Offizieller Vertriebspartner für CNTE & CATL in Europa"
    },
    hero: {
      subtitle: "Ihr führender Anbieter für fortschrittliche Energiespeicherlösungen für Wohn-, Gewerbe- und Industrieanwendungen.",
      products: "Produkte entdecken",
      consultation: "Beratung vereinbaren"
    },
    home: {
      productWorlds: "Unsere",
      productWorldsHighlight: "Produktwelten",
      discover: "Entdecken",
      why: "Warum Strong Energy?",
      reasons: [
        {
          title: "VERTRAUEN",
          text: "Wir haben sehr hohe Qualitätsanforderungen, um unseren Kunden Vertrauen und Sicherheit zu geben. Strong Energy bietet 360° Premium Qualität in Design und Technik. In Deutschland geprüft, getestet und zertifiziert."
        },
        {
          title: "ERFAHRUNG",
          text: "Als Teil der Strong Group sind wir seit 1986 tief im europäischen Markt verwurzelt und betreuen mehr als 20 Millionen europäische Familien. Wir sind ein wachsender Konzern mit mehr als 5 GW Erfahrung der Muttergesellschaft Skyworth im Photovoltaikbau."
        },
        {
          title: "STARKE KAPAZITÄT",
          text: "Die Produktionskapazitäten unserer Muttergesellschaft Skyworth lassen es zu in einem einzigen Monat über 20.000 Photovoltaikanlagen zu fertigen."
        },
        {
          title: "AUS EINER HAND",
          text: "Wir bieten unseren Kunden maßgeschneiderte saubere Energielösungen und umfassende Dienstleistungen aus einer Hand."
        }
      ]
    },
    products: {
      title: "Unsere",
      titleHighlight: "Produkte",
      subtitle: "Entdecken Sie unsere innovativen Energiespeicherlösungen für Wohn-, Gewerbe- und Industrieanwendungen.",
      categorySubtitle: "Entdecken Sie passende Strong Energy Lösungen und technische Details für diese Produktwelt.",
      all: "Alle",
      comingSoon: "Diese Kategorie wird bald ergänzt.",
      viewDetails: "Details ansehen",
      back: "Zurück",
      home: "Home",
      products: "Produkte",
      inquireNow: "Angebot anfragen",
      productVideo: "Produktvideo",
      learnMore: "Mehr erfahren",
      tabs: {
        description: "Beschreibung",
        features: "Features",
        specs: "Technische Daten",
        downloads: "Downloads"
      },
      noSpecs: "Für dieses Produkt sind aktuell keine technischen Daten hinterlegt.",
      specsTitle: "Technische Daten",
      specsFeature: "Merkmal",
      noDownloads: "Für dieses Produkt sind aktuell keine Downloads verfügbar."
    },
    blog: {
      badge: "Strong Energy Blog",
      title: "News, Tipps & Wissenswertes",
      subtitle: "Bleib auf dem Laufenden mit den neuesten Energie-Tipps, Produktneuheiten und Wissenswertem rund um Strong Energy.",
      search: "Beiträge durchsuchen...",
      all: "Alle",
      categories: ["Alle", "Neuigkeiten", "Produkte", "Energie", "Nachhaltigkeit", "Tipps"],
      featured: "Featured",
      readTime: "Min. Lesezeit",
      noPosts: "Keine Beiträge gefunden."
    },
    downloads: {
      title: "Downloads",
      subtitle: "Datenblätter, Installationsanleitungen, Broschüren und mehr für alle unsere Produkte.",
      search: "Downloads durchsuchen...",
      categories: "Kategorien",
      products: "Produkte",
      reset: "Filter zurücksetzen",
      open: "Öffnen",
      copy: "Link kopieren",
      download: "Herunterladen",
      fileCategoryMap: {}
    },
    media: {
      title: "Mediengalerie",
      subtitle: "Entdecken Sie Produktbilder, Installationsfotos und Videos.",
      all: "Alle",
      search: "Medien durchsuchen...",
      countLabel: "Medien",
      noResults: "Keine Medien gefunden.",
      video: "Video"
    },
    contact: {
      title: "Kontakt",
      inquiryTitleSuffix: "anfragen",
      subtitle: "Haben Sie Fragen oder möchten Sie ein Angebot? Wir freuen uns auf Ihre Nachricht.",
      inquirySubtitle: "Wir melden uns mit Beratung, Verfügbarkeit und einem passenden Angebot.",
      howToReach: "So erreichen Sie uns",
      country: "Deutschland",
      tollFree: "(gebührenfrei)",
      selectType: "Bitte wählen:",
      business: "Gewerbe",
      private: "Privatperson",
      firstName: "Vorname *",
      lastName: "Nachname *",
      email: "E-Mail *",
      phone: "Telefonnummer",
      subject: "Betreff *",
      defaultSubject: "Produkt anfragen",
      message: "Ihre Nachricht an uns *",
      privacyLabel: "Datenschutzerklärung",
      privacyStart: "Ich stimme der",
      privacyLink: "Datenschutzerklärung",
      privacyEnd: "zu.",
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      submit: "Absenden",
      submitInquiry: "Anfrage absenden",
      sending: "Wird gesendet..."
    },
    faq: {
      title: "Häufig gestellte",
      titleHighlight: "Fragen",
      subtitle: "Finden Sie Antworten zu unseren Produkten, Installation und Solarenergie.",
      search: "Frage suchen...",
      all: "Alle",
      result: "Ergebnis",
      results: "Ergebnisse",
      question: "Frage",
      questions: "Fragen",
      for: "für",
      noResults: "Keine passenden Fragen gefunden."
    },
    partner: {
      title: "Unsere Partner",
      subtitle: "Gemeinsam für eine nachhaltige Energiezukunft – unsere starken Partner im Überblick.",
      all: "Alle Partner",
      becomeTitle: "Partner werden?",
      becomeText: "Sie haben Interesse an einer Partnerschaft mit Strong Energy? Kontaktieren Sie uns - wir freuen uns auf Ihre Nachricht.",
      cta: "Jetzt Kontakt aufnehmen"
    },
    about: {
      title: "Über",
      titleHighlight: "Uns",
      subtitle: "Hochqualifizierte Experten, die gemeinsam daran arbeiten, innovative Lösungen für erneuerbare Energien zu entwickeln.",
      why: "Warum",
      parent: "Unsere Muttergesellschaft",
      teamEyebrow: "Die Menschen dahinter",
      teamTitle: "Unser",
      teamHighlight: "Team",
      contact: "Kontakt",
      join: "Werde Teil unseres Teams",
      applyHint: "Wir freuen uns über Initiativbewerbungen.",
      apply: "Bewerben",
      missionTitle: "Unsere",
      missionHighlight: "Mission",
      missionText: "Wir folgen dem Trend der Entwicklung sauberer Energie und leisten einen positiven Beitrag zum globalen Umweltschutz.",
      products: "Unsere Produkte",
      contactAction: "Kontakt aufnehmen"
    },
    app: {
      title: "Strong Energy",
      titleHighlight: "360 App",
      subtitle: "Intelligente Überwachung für Ihre Energielösungen. Ihre zentrale Plattform für die Überwachung und Verwaltung von Energiegeräten - Wechselrichter, Energiespeicher und Zubehör.",
      allInOne: "Alles in einer App",
      allInOneText: "Die Strong Energy 360 App bietet Ihnen volle Kontrolle über Ihre Energiezukunft.",
      ctaTitle: "Erleben Sie die Energie von morgen!",
      ctaText: "Unser Team berät Sie unverbindlich zu unseren Produkten.",
      cta: "Unverbindlich informieren"
    },
    footer: {
      menu: "Menü",
      address: "Adresse",
      contact: "Kontakt",
      tollFree: "(gebührenfrei)",
      appTitle: "Strong Energy 360 App",
      appDownload: "Downloade die Strong Energy 360 App:",
      copyright: "Alle Rechte vorbehalten.",
      disclaimer: "Änderungen und Irrtümer vorbehalten."
    },
    cookie: {
      title: "Cookie-Einstellungen",
      description: "Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Weitere Informationen finden Sie in unserer",
      cookiePolicy: "Cookie-Richtlinie",
      and: "und",
      privacyPolicy: "Datenschutzerklärung",
      customize: "Einstellungen anpassen",
      necessary: "Notwendig",
      necessaryDesc: "Für die Grundfunktion der Website erforderlich",
      marketing: "Marketing",
      marketingDesc: "Für optionale Marketingfunktionen vorbereitet",
      acceptAll: "Alle akzeptieren",
      saveSelection: "Auswahl speichern",
      onlyNecessary: "Nur notwendige"
    }
  },
  en: {
    nav: {
      home: "Home",
      products: "Products",
      about: "About Us",
      partner: "Partners",
      app: "360 App",
      blog: "Blog",
      downloads: "Downloads",
      media: "Media",
      contact: "Contact",
      faq: "FAQ"
    },
    topbar: {
      followUs: "Follow us:",
      announcement: "Official distribution partner for CNTE & CATL in Europe"
    },
    hero: {
      subtitle: "Your leading provider of advanced energy storage solutions for residential, commercial and industrial applications.",
      products: "Discover products",
      consultation: "Book a consultation"
    },
    home: {
      productWorlds: "Our",
      productWorldsHighlight: "Product Range",
      discover: "Discover",
      why: "Why Strong Energy?",
      reasons: [
        {
          title: "TRUST",
          text: "We have very high quality standards to give our customers trust and safety. Strong Energy offers 360° premium quality in design and engineering. Tested and certified in Germany."
        },
        {
          title: "EXPERIENCE",
          text: "As part of the Strong Group, we have been deeply rooted in the European market since 1986, serving more than 20 million European families. We are a growing group with more than 5 GW of experience from our parent company Skyworth in photovoltaic construction."
        },
        {
          title: "STRONG CAPACITY",
          text: "The production capacities of our parent company Skyworth allow us to manufacture over 20,000 photovoltaic systems in a single month."
        },
        {
          title: "ALL-IN-ONE",
          text: "We offer our customers tailor-made clean energy solutions and comprehensive services from a single source."
        }
      ]
    },
    products: {
      title: "Our",
      titleHighlight: "Products",
      subtitle: "Discover our innovative energy storage solutions for residential, commercial and industrial applications.",
      categorySubtitle: "Discover suitable Strong Energy solutions and technical details for this product range.",
      all: "All",
      comingSoon: "Products in this category will be added soon.",
      viewDetails: "View details",
      back: "Back",
      home: "Home",
      products: "Products",
      inquireNow: "Request a quote",
      productVideo: "Product video",
      learnMore: "Learn more",
      tabs: {
        description: "Description",
        features: "Features",
        specs: "Technical Data",
        downloads: "Downloads"
      },
      noSpecs: "No technical data is currently available for this product.",
      specsTitle: "Technical Data",
      specsFeature: "Feature",
      noDownloads: "No downloads are currently available for this product."
    },
    blog: {
      badge: "Strong Energy Blog",
      title: "News, Tips & Knowledge",
      subtitle: "Stay up to date with the latest energy tips, product news and knowledge from Strong Energy.",
      search: "Search posts...",
      all: "All",
      categories: ["All", "News", "Products", "Energy", "Sustainability", "Tips"],
      featured: "Featured",
      readTime: "min read",
      noPosts: "No posts found."
    },
    downloads: {
      title: "Downloads",
      subtitle: "Datasheets, installation manuals, brochures and more for all our products.",
      search: "Search downloads...",
      categories: "Categories",
      products: "Products",
      reset: "Reset filters",
      open: "Open",
      copy: "Copy link",
      download: "Download",
      fileCategoryMap: {
        Sonstiges: "Other",
        Datenblatt: "Datasheet",
        Installationsanleitung: "Installation manual",
        Software: "Software",
        Zertifikat: "Certificate",
        Garantie: "Warranty",
        "Broschüre": "Brochure"
      }
    },
    media: {
      title: "Media Gallery",
      subtitle: "Discover product images, installation photos and videos.",
      all: "All",
      search: "Search media...",
      countLabel: "media",
      noResults: "No media found.",
      video: "Video"
    },
    contact: {
      title: "Contact",
      inquiryTitleSuffix: "inquiry",
      subtitle: "Do you have questions or would you like a quote? We look forward to hearing from you.",
      inquirySubtitle: "We will get back to you with consultation, availability and a suitable quote.",
      howToReach: "How to reach us",
      country: "Germany",
      tollFree: "(toll-free)",
      selectType: "Please select:",
      business: "Business",
      private: "Private customer",
      firstName: "First name *",
      lastName: "Last name *",
      email: "Email *",
      phone: "Phone number",
      subject: "Subject *",
      defaultSubject: "Product inquiry",
      message: "Your message to us *",
      privacyLabel: "Privacy Policy",
      privacyStart: "I agree to the",
      privacyLink: "Privacy Policy",
      privacyEnd: ".",
      invalidEmail: "Please enter a valid email address.",
      submit: "Submit",
      submitInquiry: "Send inquiry",
      sending: "Sending..."
    },
    faq: {
      title: "Frequently Asked",
      titleHighlight: "Questions",
      subtitle: "Find answers about our products, installation and solar energy.",
      search: "Search questions...",
      all: "All",
      result: "result",
      results: "results",
      question: "question",
      questions: "questions",
      for: "for",
      noResults: "No matching questions found."
    },
    partner: {
      title: "Our Partners",
      subtitle: "Together for a sustainable energy future - an overview of our strong partners.",
      all: "All Partners",
      becomeTitle: "Become a partner?",
      becomeText: "Interested in a partnership with Strong Energy? Contact us - we look forward to hearing from you.",
      cta: "Get in touch"
    },
    about: {
      title: "About",
      titleHighlight: "Us",
      subtitle: "Highly qualified experts working together to develop innovative renewable energy solutions.",
      why: "Why",
      parent: "Our Parent Company",
      teamEyebrow: "The People Behind It",
      teamTitle: "Our",
      teamHighlight: "Team",
      contact: "Contact",
      join: "Join our team",
      applyHint: "We welcome unsolicited applications.",
      apply: "Apply",
      missionTitle: "Our",
      missionHighlight: "Mission",
      missionText: "We follow the trend of clean energy development and make a positive contribution to global environmental protection.",
      products: "Our Products",
      contactAction: "Contact us"
    },
    app: {
      title: "Strong Energy",
      titleHighlight: "360 App",
      subtitle: "Intelligent monitoring for your energy solutions. Your central platform for monitoring and managing energy devices - inverters, energy storage and accessories.",
      allInOne: "All in one app",
      allInOneText: "The Strong Energy 360 App gives you full control over your energy future.",
      ctaTitle: "Experience the energy of tomorrow!",
      ctaText: "Our team will advise you on our products without obligation.",
      cta: "Get information"
    },
    footer: {
      menu: "Menu",
      address: "Address",
      contact: "Contact",
      tollFree: "(toll-free)",
      appTitle: "Strong Energy 360 App",
      appDownload: "Download the Strong Energy 360 App:",
      copyright: "All rights reserved.",
      disclaimer: "Subject to changes and errors."
    },
    cookie: {
      title: "Cookie Settings",
      description: "We use cookies to provide you with the best possible experience on our website. More information can be found in our",
      cookiePolicy: "Cookie Policy",
      and: "and",
      privacyPolicy: "Privacy Policy",
      customize: "Customize settings",
      necessary: "Necessary",
      necessaryDesc: "Required for the basic function of the website",
      marketing: "Marketing",
      marketingDesc: "Prepared for optional marketing features",
      acceptAll: "Accept all",
      saveSelection: "Save selection",
      onlyNecessary: "Necessary only"
    }
  }
} satisfies Record<Language, Record<string, unknown>>;

export function getLanguageFromPathname(pathname: string | null | undefined): Language {
  return pathname?.startsWith("/en") ? "en" : "de";
}

export function stripLocalePrefix(pathname: string) {
  return pathname.replace(/^\/(de|en)(?=\/|$)/, "") || "/";
}

export function translateCategorySlug(deSlug: string, lang: Language) {
  return lang === "en" ? categorySlugsDeToEn[deSlug] || deSlug : deSlug;
}

export function reverseCategorySlug(slug: string) {
  return categorySlugsEnToDe[slug] || slug;
}

export function translatePath(dePath: string, lang: Language): string {
  if (lang === "de") return dePath;
  if (dePath === "/") return "/";

  for (const [de, en] of Object.entries(deToEn)) {
    if (dePath === de || dePath.startsWith(`${de}/`)) {
      if (de === "/produkte" && dePath.length > de.length) {
        const rest = dePath.slice(de.length + 1);
        const segments = rest.split("/");
        segments[0] = translateCategorySlug(segments[0], "en");
        return `${en}/${segments.join("/")}`;
      }
      return `${en}${dePath.slice(de.length)}`;
    }
  }

  return dePath;
}

export function reverseTranslatePath(path: string): string {
  if (path === "/") return "/";

  for (const [en, de] of Object.entries(enToDe)) {
    if (path === en || path.startsWith(`${en}/`)) {
      if (en === "/products" && path.length > en.length) {
        const rest = path.slice(en.length + 1);
        const segments = rest.split("/");
        segments[0] = reverseCategorySlug(segments[0]);
        return `${de}/${segments.join("/")}`;
      }
      return `${de}${path.slice(en.length)}`;
    }
  }

  return path;
}

export function localizedPath(dePath: string, lang: Language) {
  const translated = translatePath(dePath, lang);
  return `/${lang}${translated === "/" ? "" : translated}`;
}

export function switchLocalePath(pathname: string, targetLang: Language, search = "", hash = "") {
  const pathWithoutLocale = stripLocalePrefix(pathname);
  const dePath = reverseTranslatePath(pathWithoutLocale);
  return `${localizedPath(dePath, targetLang)}${search}${hash}`;
}

export function getMainNavigation(lang: Language): NavItem[] {
  const nav = translations[lang].nav;
  return [
    { label: nav.home, href: localizedPath("/", lang) },
    { label: nav.products, href: localizedPath("/produkte", lang) },
    { label: nav.about, href: localizedPath("/ueber-uns", lang) },
    { label: nav.partner, href: localizedPath("/partner", lang) },
    { label: nav.app, href: localizedPath("/360-app", lang) },
    { label: nav.blog, href: localizedPath("/blog", lang) },
    { label: nav.downloads, href: localizedPath("/downloads", lang) },
    { label: nav.media, href: localizedPath("/media", lang) }
  ];
}

export function getFooterLegalNavigation(lang: Language): NavItem[] {
  return [
    { label: lang === "en" ? "Legal Notice" : "Impressum", href: localizedPath("/impressum", lang) },
    { label: lang === "en" ? "Privacy Policy" : "Datenschutz", href: localizedPath("/datenschutz", lang) },
    { label: lang === "en" ? "Terms & Conditions" : "AGB", href: localizedPath("/agb", lang) },
    { label: lang === "en" ? "Warranty" : "Garantiebedingungen", href: localizedPath("/garantiebedingungen", lang) },
    { label: lang === "en" ? "Legal Information" : "Rechtliche Hinweise", href: localizedPath("/rechtliche-hinweise", lang) },
    { label: "GPSR", href: localizedPath("/gpsr", lang) },
    { label: lang === "en" ? "Cookie Policy" : "Cookie-Richtlinie", href: localizedPath("/cookie-richtlinie", lang) }
  ];
}

export function localizeSeo(seo: SeoContent, lang: Language, overrides?: Partial<SeoContent>): SeoContent {
  return {
    ...seo,
    ...overrides,
    path: overrides?.path ?? localizedPath(stripLocalePrefix(seo.path), lang)
  };
}

export function localizeLegalSlug(slug: string, lang: Language) {
  return lang === "en" ? legalSlugsDeToEn[slug] || slug : slug;
}

export function normalizeLegalSlug(slug: string) {
  return legalSlugsEnToDe[slug] || slug;
}
