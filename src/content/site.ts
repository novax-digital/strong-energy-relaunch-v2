import type { SeoContent } from "@/types/content";

export const site = {
  name: "Strong Energy",
  legalName: "STRONG Digital GmbH",
  baseUrl: "https://strong-energy.eu",
  locale: "de_DE",
  logo: "/assets/logo-CkaIU7X8.png",
  defaultImage: "/favicon.png",
  phone: "0800 7788 787",
  phoneHref: "tel:+4908007788787",
  email: "info_de@strong-energy.eu",
  address: {
    street: "Von-Werth-Straße 1",
    postalCode: "50670",
    city: "Köln",
    country: "Deutschland"
  },
  openingHours: ["Mo-Do: 8:00-17:00 Uhr", "Fr: 8:00-15:30 Uhr"],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/strong-energy" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Instagram", href: "https://www.instagram.com/strongenergy.eu/" }
  ],
  appLinks: {
    apple: "https://apps.apple.com/en/app/6503048954",
    google: "https://play.google.com/store/apps/details?id=com.strong.energy"
  }
};

export const pageSeo: Record<string, SeoContent> = {
  home: {
    path: "/de",
    title: "Strong Energy – Solar & Energiespeicher für Privat & Gewerbe",
    description:
      "Hochwertige Solaranlagen, Heim- und Gewerbespeicher sowie mobile Energielösungen. Offizieller Vertriebspartner für CNTE und CATL in Europa.",
    image: "/assets/solaranlagen-2BF5y_wA.webp"
  },
  products: {
    path: "/de/produkte",
    title: "Produkte – Solar, Speicher & Mobile Charging | Strong Energy",
    description:
      "Entdecken Sie Solaranlagen, All-in-One Gewerbespeicher und mobile Energielösungen von Strong Energy.",
    image: "/assets/alfred-02-C1Z1mvvG.webp"
  },
  about: {
    path: "/de/ueber-uns",
    title: "Über uns | Strong Energy",
    description:
      "Strong Energy entwickelt innovative Lösungen für erneuerbare Energien und ist Teil der europäischen Strong Group.",
    image: "/assets/strong-energy-haeuser-DVL7HDbk.jpg"
  },
  partner: {
    path: "/de/partner",
    title: "Partner | Strong Energy",
    description:
      "Gemeinsam für eine nachhaltige Energiezukunft: Entdecken Sie das Partnernetzwerk von Strong Energy.",
    image: "/assets/solarstrom-konzepte-CE908hF3.png"
  },
  app: {
    path: "/de/360-app",
    title: "Strong Energy 360 App",
    description:
      "Die Strong Energy 360 App bietet Echtzeitüberwachung und Verwaltung für Wechselrichter, Energiespeicher und Zubehör.",
    image: "/assets/strong-energy-360-app-C7nuayTw.webp"
  },
  blog: {
    path: "/de/blog",
    title: "Blog – News, Tipps & Wissenswertes | Strong Energy",
    description:
      "Aktuelle Energie-Tipps, Produktneuheiten und Wissenswertes rund um Strong Energy.",
    image: "/assets/alfred-02-C1Z1mvvG.webp"
  },
  downloads: {
    path: "/de/downloads",
    title: "Downloads – Datenblätter, Anleitungen & Zertifikate | Strong Energy",
    description:
      "Datenblätter, Installationsanleitungen, Broschüren, Zertifikate und Garantiebedingungen für Strong Energy Produkte.",
    image: "/assets/logo-CkaIU7X8.png"
  },
  media: {
    path: "/de/media",
    title: "Mediengalerie – Produktbilder, Fotos & Videos | Strong Energy",
    description:
      "Durchstöbern Sie Produktbilder, Installationsfotos und Videos zu Solaranlagen und Energiespeichern.",
    image: "/assets/alfred-02-C1Z1mvvG.webp"
  },
  contact: {
    path: "/de/kontakt",
    title: "Kontakt | Strong Energy",
    description:
      "Kontaktieren Sie Strong Energy für Beratung zu Solaranlagen, Energiespeichern und mobilen Energielösungen.",
    image: "/assets/kontakt-hero-BGf2Dxw2.jpg"
  },
  faq: {
    path: "/de/faq",
    title: "FAQ – Häufig gestellte Fragen | Strong Energy",
    description:
      "Antworten zu Strong Energy Produkten, Downloads, Installation, Solarbatterien und Solar-PV-Anlagen.",
    image: "/assets/logo-CkaIU7X8.png"
  }
};
