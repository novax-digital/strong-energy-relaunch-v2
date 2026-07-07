"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Headphones, ShieldCheck, Truck, X } from "lucide-react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { localizedPath, type Language } from "@/lib/i18n";

const initialState: ContactState = { ok: false, message: "" };

type PartnerType = "installateur" | "grosshaendler";

const labels = {
  de: {
    cardTitle: "Partner werden?",
    cardText: "Sie haben Interesse an einer Partnerschaft mit Strong Energy? Kontaktieren Sie uns – wir freuen uns auf Ihre Nachricht.",
    cardCta: "Jetzt Kontakt aufnehmen",
    modalTitle: "Partner werden",
    modalText: "Sie haben Interesse an einer Partnerschaft mit Strong Energy? Wir freuen uns auf Ihre Nachricht.",
    selectType: "Bitte wählen:",
    installer: "Installateur",
    wholesaler: "Großhändler",
    firstName: "Vorname *",
    lastName: "Nachname *",
    company: "Name des Unternehmens",
    email: "E-Mail *",
    phone: "Telefonnummer",
    message: "Nachricht an uns",
    privacyStart: "Ich stimme der",
    privacyLink: "Datenschutzerklärung",
    privacyEnd: "zu. *",
    submit: "Anfrage absenden",
    sending: "Wird gesendet...",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    subject: "Partneranfrage",
    partnerType: "Partner-Typ",
    companyLabel: "Unternehmen",
    messageLabel: "Nachricht",
    benefits: ["Direkt vom Hersteller", "Schnelle Lieferung", "Deutscher Support"]
  },
  en: {
    cardTitle: "Become a partner?",
    cardText: "Interested in a partnership with Strong Energy? Contact us - we look forward to hearing from you.",
    cardCta: "Contact us",
    modalTitle: "Become a partner",
    modalText: "Interested in a partnership with Strong Energy? We look forward to hearing from you.",
    selectType: "Please select:",
    installer: "Installer",
    wholesaler: "Wholesaler",
    firstName: "First name *",
    lastName: "Last name *",
    company: "Company name",
    email: "Email *",
    phone: "Phone number",
    message: "Message to us",
    privacyStart: "I agree to the",
    privacyLink: "Privacy Policy",
    privacyEnd: ". *",
    submit: "Send request",
    sending: "Sending...",
    invalidEmail: "Please enter a valid email address.",
    subject: "Partner inquiry",
    partnerType: "Partner type",
    companyLabel: "Company",
    messageLabel: "Message",
    benefits: ["Direct from manufacturer", "Fast delivery", "German support"]
  }
} satisfies Record<Language, {
  cardTitle: string;
  cardText: string;
  cardCta: string;
  modalTitle: string;
  modalText: string;
  selectType: string;
  installer: string;
  wholesaler: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  privacyStart: string;
  privacyLink: string;
  privacyEnd: string;
  submit: string;
  sending: string;
  invalidEmail: string;
  subject: string;
  partnerType: string;
  companyLabel: string;
  messageLabel: string;
  benefits: string[];
}>;

const partnerTypeLabels = {
  de: {
    installateur: "Installateur",
    grosshaendler: "Großhändler"
  },
  en: {
    installateur: "Installer",
    grosshaendler: "Wholesaler"
  }
} satisfies Record<Language, Record<PartnerType, string>>;

export function PartnerApplicationForm({ lang = "de" }: { lang?: Language }) {
  const t = labels[lang];
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-20 scroll-mt-28 text-center" id="partnerformular">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 md:p-14">
        <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">{t.cardTitle}</h2>
        <p className="mx-auto mb-8 max-w-lg text-muted-foreground">{t.cardText}</p>
        <button
          className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-semibold shadow-lg transition-transform hover:scale-[1.01]"
          type="button"
          onClick={() => setOpen(true)}
        >
          {t.cardCta}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {open ? <PartnerInquiryModal lang={lang} onClose={() => setOpen(false)} /> : null}
    </section>
  );
}

function PartnerInquiryModal({ lang, onClose }: { lang: Language; onClose: () => void }) {
  const t = labels[lang];
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const [partnerType, setPartnerType] = useState<PartnerType>("installateur");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [clientError, setClientError] = useState("");

  const selectedPartnerLabel = partnerTypeLabels[lang][partnerType];
  const combinedMessage = useMemo(
    () =>
      [
        `${t.partnerType}: ${selectedPartnerLabel}`,
        company.trim() ? `${t.companyLabel}: ${company.trim()}` : "",
        message.trim() ? `${t.messageLabel}: ${message.trim()}` : ""
      ]
        .filter(Boolean)
        .join("\n\n"),
    [company, message, selectedPartnerLabel, t.companyLabel, t.messageLabel, t.partnerType]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 text-left backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-labelledby="partner-inquiry-title"
        aria-modal="true"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        role="dialog"
      >
        <div className="relative px-7 pb-5 pt-7">
          <button
            aria-label={lang === "en" ? "Close form" : "Formular schließen"}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            type="button"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <h2 className="pr-10 text-2xl font-bold tracking-tight text-foreground" id="partner-inquiry-title">
            {t.modalTitle}
          </h2>
          <p className="mt-2 max-w-[28rem] text-sm leading-6 text-muted-foreground">{t.modalText}</p>
        </div>

        <div className="h-px bg-border" />

        <form
          action={formAction}
          className="max-h-[calc(100vh-13rem)] space-y-5 overflow-y-auto px-7 py-6"
          onSubmit={(event) => {
            const email = String(new FormData(event.currentTarget).get("email") || "");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              event.preventDefault();
              setClientError(t.invalidEmail);
              return;
            }
            setClientError("");
          }}
        >
          <input name="customerType" type="hidden" value={partnerType} />
          <input name="intent" type="hidden" value="contact" />
          <input name="name" type="hidden" value={`${firstName} ${lastName}`.trim()} />
          <input name="topic" type="hidden" value={t.subject} />
          <input name="message" type="hidden" value={combinedMessage} />

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-foreground">{t.selectType}</p>
            <div className="grid grid-cols-2 gap-2">
              {(["installateur", "grosshaendler"] as const).map((type) => {
                const active = partnerType === type;
                return (
                  <button
                    className={`flex h-11 items-center justify-center rounded-xl border-2 px-4 text-sm font-medium transition-all ${
                      active
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                    key={type}
                    type="button"
                    onClick={() => setPartnerType(type)}
                  >
                    {partnerTypeLabels[lang][type]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              aria-label={stripRequiredMark(t.firstName)}
              autoComplete="given-name"
              className={inputClass}
              maxLength={100}
              placeholder={t.firstName}
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <input
              aria-label={stripRequiredMark(t.lastName)}
              autoComplete="family-name"
              className={inputClass}
              maxLength={100}
              placeholder={t.lastName}
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>

          <input
            aria-label={t.company}
            autoComplete="organization"
            className={inputClass}
            maxLength={150}
            placeholder={t.company}
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />

          <input
            aria-label={stripRequiredMark(t.email)}
            autoComplete="email"
            className={inputClass}
            maxLength={255}
            name="email"
            placeholder={t.email}
            required
            type="email"
          />

          <input
            aria-label={t.phone}
            autoComplete="tel"
            className={inputClass}
            maxLength={30}
            name="phone"
            placeholder={t.phone}
            type="tel"
          />

          <textarea
            aria-label={t.message}
            className={`${inputClass} min-h-28 resize-none`}
            maxLength={2000}
            placeholder={t.message}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          <label className="flex cursor-pointer items-center gap-3 text-xs leading-5 text-muted-foreground">
            <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <input
                className="peer h-5 w-5 appearance-none rounded-full border-2 border-muted-foreground/40 transition-colors checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                name="privacy"
                required
                type="checkbox"
              />
              <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" aria-hidden />
            </span>
            <span>
              {t.privacyStart}{" "}
              <Link className="text-muted-foreground underline underline-offset-2 hover:text-primary" href={localizedPath("/datenschutz", lang)}>
                {t.privacyLink}
              </Link>{" "}
              {t.privacyEnd}
            </span>
          </label>

          {clientError ? <p className="text-sm text-destructive">{clientError}</p> : null}
          {state.message ? <p className={`text-sm ${state.ok ? "text-primary" : "text-destructive"}`}>{state.message}</p> : null}

          <button
            className="btn-gradient flex h-14 w-full items-center justify-center rounded-full px-8 text-lg font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {pending ? t.sending : t.submit}
          </button>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            {[
              { icon: ShieldCheck, text: t.benefits[0] },
              { icon: Truck, text: t.benefits[1] },
              { icon: Headphones, text: t.benefits[2] }
            ].map((benefit) => (
              <div className="flex min-w-0 flex-col items-center gap-1.5" key={benefit.text}>
                <benefit.icon className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                <span className="text-[10px] font-medium leading-tight text-muted-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-foreground/15 bg-secondary/40 px-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30";

function stripRequiredMark(value: string) {
  return value.replace(/\s\*$/, "");
}
