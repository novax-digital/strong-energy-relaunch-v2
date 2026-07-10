"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Headphones, ShieldCheck, Truck, X } from "lucide-react";
import { sendProductInquiry, type ContactState } from "@/app/actions/contact";
import type { Product } from "@/types/content";
import type { Language } from "@/lib/i18n";

const initialState: ContactState = { ok: false, message: "" };

const COMMERCIAL_STORAGE_SLUGS = ["star-q", "star-h", "enerc", "enerc-plus", "gewerbespeicher-kompakt"];
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

const labels = {
  de: {
    open: "Angebot anfragen",
    title: "Jetzt Beratungstermin vereinbaren",
    standardTitle: "Jetzt Produktanfrage stellen",
    inquiryFor: "Anfrage für",
    selectType: "Bitte wählen:",
    installer: "Installateur",
    business: "Gewerbe",
    private: "Privatperson",
    goalQuestion: "Was ist Ihr Ziel mit einer Gewerbespeicherlösung?",
    projectStatus: "Wie ist der aktuelle Projektstatus?",
    connectionPower: "Bitte wenn möglich maximale Anschlussleistung in kW angeben.",
    selectAnswer: "Bitte Antwort auswählen",
    enterAnswer: "Bitte geben Sie Ihre Antwort ein.",
    leaveContact: "Hinterlassen Sie hier Ihre Kontaktdaten und einer unserer Experten meldet sich zeitnah bei Ihnen.",
    firstName: "Vorname *",
    lastName: "Nachname *",
    companyName: "Name des Unternehmens",
    email: "E-Mail *",
    phone: "Telefonnummer",
    postalCode: "Postleitzahl",
    state: "Bundesland",
    statePlaceholder: "Bundesland auswählen",
    privacy: "Ich stimme der Datenschutzerklärung zu. *",
    back: "Zurück",
    next: "Weiter",
    submit: "Anfrage absenden",
    sending: "Wird gesendet...",
    success: "Anfrage gesendet.",
    direct: "Direkt vom Hersteller",
    delivery: "Schnelle Lieferung",
    support: "Deutscher Support",
    errorEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein."
  },
  en: {
    open: "Request a quote",
    title: "Book a consultation now",
    standardTitle: "Send product inquiry",
    inquiryFor: "Inquiry for",
    selectType: "Please choose:",
    installer: "Installer",
    business: "Business",
    private: "Private customer",
    goalQuestion: "What is your goal with a commercial storage solution?",
    projectStatus: "What is the current project status?",
    connectionPower: "If possible, please enter the maximum connection power in kW.",
    selectAnswer: "Please select an answer",
    enterAnswer: "Please enter your answer.",
    leaveContact: "Leave your contact details and one of our experts will get back to you soon.",
    firstName: "First name *",
    lastName: "Last name *",
    companyName: "Company name",
    email: "Email *",
    phone: "Phone number",
    postalCode: "Postal code",
    state: "State / region",
    statePlaceholder: "Select state / region",
    privacy: "I agree to the privacy policy. *",
    back: "Back",
    next: "Next",
    submit: "Send inquiry",
    sending: "Sending...",
    success: "Inquiry sent.",
    direct: "Direct from manufacturer",
    delivery: "Fast delivery",
    support: "German support",
    errorEmail: "Please enter a valid email address."
  }
} satisfies Record<Language, Record<string, string>>;

const goals = {
  de: ["Eigenverbrauchoptimierung", "Peak Shaving", "Traden", "Sonstiges"],
  en: ["Self-consumption optimization", "Peak shaving", "Trading", "Other"]
} satisfies Record<Language, string[]>;

const projectStatuses = {
  de: ["In Planung", "Ready to Build"],
  en: ["In planning", "Ready to build"]
} satisfies Record<Language, string[]>;

const states = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
  "Österreich",
  "Schweiz"
];

function captureUtmParams() {
  if (typeof window === "undefined") {
    return { utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "" };
  }

  const params = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) sessionStorage.setItem(key, value);
  });

  return {
    utm_source: sessionStorage.getItem("utm_source") || "",
    utm_medium: sessionStorage.getItem("utm_medium") || "",
    utm_campaign: sessionStorage.getItem("utm_campaign") || "",
    utm_content: sessionStorage.getItem("utm_content") || ""
  };
}

function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className={step === 1 ? "h-2 w-8 rounded-full bg-gradient-to-r from-[#d9dc22] to-[#28a795]" : "h-2 w-2 rounded-full bg-slate-300"} />
      <span className={step === 2 ? "h-2 w-8 rounded-full bg-gradient-to-r from-[#d9dc22] to-[#28a795]" : "h-2 w-2 rounded-full bg-slate-300"} />
    </div>
  );
}

function SelectField({
  name,
  value,
  onChange,
  children,
  className
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-[52px] w-full appearance-none rounded-xl border-2 border-slate-200 bg-slate-50 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15 ${className ?? ""}`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function FactBar({ t }: { t: Record<string, string> }) {
  return (
    <div className="grid grid-cols-3 gap-3 pt-2">
      {[
        { icon: ShieldCheck, text: t.direct },
        { icon: Truck, text: t.delivery },
        { icon: Headphones, text: t.support }
      ].map((fact) => (
        <div key={fact.text} className="flex flex-col items-center gap-1.5 text-center">
          <fact.icon className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-medium leading-tight text-slate-500">{fact.text}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductInquiryButton({
  product,
  lang = "de",
  label,
  className
}: {
  product: Product;
  lang?: Language;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const t = labels[lang];

  return (
    <>
      <button
        type="button"
        className={className ?? "btn-gradient inline-flex justify-center rounded-full px-6 py-3 text-center text-base font-semibold shadow-lg"}
        onClick={() => setOpen(true)}
      >
        {label ?? t.open}
      </button>
      {open ? <ProductInquiryModal product={product} lang={lang} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ProductInquiryModal({ product, lang, onClose }: { product: Product; lang: Language; onClose: () => void }) {
  const t = labels[lang];
  const [state, formAction, pending] = useActionState(sendProductInquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef("");
  const requestIdInputRef = useRef<HTMLInputElement>(null);
  const isCommercialStorage = COMMERCIAL_STORAGE_SLUGS.includes(product.slug);
  const [step, setStep] = useState<1 | 2>(isCommercialStorage ? 1 : 2);
  const [customerType, setCustomerType] = useState(isCommercialStorage ? "gewerbe" : "installateur");
  const [goal, setGoal] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [connectionPower, setConnectionPower] = useState("");
  const [bundesland, setBundesland] = useState("");
  const [utmParams] = useState(captureUtmParams);
  const [clientError, setClientError] = useState("");
  const title = isCommercialStorage ? t.title : t.standardTitle;
  const customerOptions = useMemo(
    () => [
      { value: "installateur", label: t.installer },
      { value: "gewerbe", label: t.business },
      { value: "privatperson", label: t.private }
    ],
    [t.business, t.installer, t.private]
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!state.ok || state.requestId !== requestIdRef.current) return;
    formRef.current?.reset();
    requestIdRef.current = "";
    const timeout = window.setTimeout(onClose, 900);
    return () => window.clearTimeout(timeout);
  }, [onClose, state.ok, state.requestId]);

  const inputClass =
    "h-[52px] w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-[24px] border border-white/70 bg-white text-left shadow-[0_28px_80px_-20px_rgba(0,0,0,0.45)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative px-7 pb-5 pt-7">
          <button
            type="button"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            aria-label="Formular schließen"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="pr-10 text-2xl font-bold leading-tight text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {t.inquiryFor} <span className="font-semibold text-slate-950">{product.name}</span>
          </p>
        </div>

        <div className="h-px bg-slate-100" />

        <form
          action={formAction}
          className="max-h-[calc(90vh-116px)] space-y-5 overflow-y-auto px-7 py-7"
          ref={formRef}
          onSubmit={(event) => {
            requestIdRef.current ||= crypto.randomUUID();
            if (requestIdInputRef.current) requestIdInputRef.current.value = requestIdRef.current;
            const data = new FormData(event.currentTarget);
            const email = String(data.get("email") || "");
            if (!email.includes("@")) {
              event.preventDefault();
              setClientError(t.errorEmail);
            } else {
              setClientError("");
            }
          }}
        >
          <input ref={requestIdInputRef} type="hidden" name="request_id" />
          <input type="hidden" name="form_id" value="product_inquiry" />
          <input className="hidden" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <input type="hidden" name="productName" value={product.name} />
          <input type="hidden" name="productSlug" value={product.slug} />
          <input type="hidden" name="goal" value={goal} />
          <input type="hidden" name="projectStatus" value={projectStatus} />
          <input type="hidden" name="connectionPower" value={connectionPower} />
          {UTM_KEYS.map((key) => (
            <input key={key} type="hidden" name={key} value={utmParams[key]} />
          ))}

          {isCommercialStorage ? <StepDots step={step} /> : null}

          {isCommercialStorage && step === 1 ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">{t.selectType}</label>
                <SelectField name="customerType" value={customerType} onChange={setCustomerType}>
                  {customerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">{t.goalQuestion}</label>
                <SelectField name="goalSelect" value={goal} onChange={setGoal}>
                  <option value="">{t.selectAnswer}</option>
                  {goals[lang].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">{t.projectStatus}</label>
                <SelectField name="projectStatusSelect" value={projectStatus} onChange={setProjectStatus}>
                  <option value="">{t.selectAnswer}</option>
                  {projectStatuses[lang].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </SelectField>
              </div>

              <label className="block text-sm font-bold text-slate-900">
                <span className="mb-2 block">{t.connectionPower}</span>
                <input className={inputClass} value={connectionPower} onChange={(event) => setConnectionPower(event.target.value)} placeholder={t.enterAnswer} maxLength={50} />
              </label>

              <button type="button" className="btn-gradient flex h-14 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-bold uppercase shadow-lg" onClick={() => setStep(2)}>
                {t.next}
                <ArrowRight className="h-4 w-4" />
              </button>

              <FactBar t={t} />
            </>
          ) : (
            <>
              {!isCommercialStorage ? (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-900">{t.selectType}</label>
                  <SelectField name="customerType" value={customerType} onChange={setCustomerType}>
                    {customerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectField>
                </div>
              ) : (
                <input type="hidden" name="customerType" value={customerType} />
              )}

              <p className="text-sm leading-relaxed text-slate-500">{t.leaveContact}</p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input className={inputClass} name="firstName" placeholder={t.firstName} autoComplete="given-name" maxLength={100} required />
                <input className={inputClass} name="lastName" placeholder={t.lastName} autoComplete="family-name" maxLength={100} required />
              </div>

              <input className={inputClass} name="companyName" placeholder={t.companyName} autoComplete="organization" maxLength={150} />
              <input className={inputClass} name="email" type="email" placeholder={t.email} autoComplete="email" maxLength={255} required />
              <input className={inputClass} name="phone" type="tel" placeholder={t.phone} autoComplete="tel" maxLength={30} />
              {isCommercialStorage ? (
                <input className={inputClass} name="postalCode" placeholder={t.postalCode} autoComplete="postal-code" maxLength={12} />
              ) : (
                <SelectField name="bundesland" value={bundesland} onChange={setBundesland}>
                  <option value="">{t.statePlaceholder}</option>
                  {states.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </SelectField>
              )}

              <label className="flex cursor-pointer items-center gap-3 text-xs leading-relaxed text-slate-500">
                <input name="privacy" type="checkbox" value="true" required className="h-5 w-5 rounded-full border-slate-300 accent-[hsl(var(--primary))]" />
                <span>{t.privacy}</span>
              </label>

              {clientError ? <p className="text-sm font-medium text-destructive">{clientError}</p> : null}
              {state.message ? (
                <p className={`flex items-center gap-2 text-sm font-medium ${state.ok ? "text-primary" : "text-destructive"}`}>
                  {state.ok ? <Check className="h-4 w-4" /> : null}
                  {state.ok ? t.success : state.message}
                </p>
              ) : null}
              {state.fieldErrors?.privacy ? <p className="text-sm font-medium text-destructive">{state.fieldErrors.privacy}</p> : null}

              <div className="grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.55fr)] gap-3">
                {isCommercialStorage ? (
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t.back}
                  </button>
                ) : null}
                <button
                  type="submit"
            disabled={pending}
                  className={`${isCommercialStorage ? "" : "col-span-2"} btn-gradient flex h-14 items-center justify-center rounded-full px-6 text-base font-bold uppercase shadow-lg disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {pending ? t.sending : t.submit}
                </button>
              </div>

              <FactBar t={t} />
            </>
          )}
        </form>
      </div>
    </div>
  );
}
