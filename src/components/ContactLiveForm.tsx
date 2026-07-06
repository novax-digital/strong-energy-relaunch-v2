"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { useActionState, useState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { localizedPath, translations, type Language } from "@/lib/i18n";

const initialState: ContactState = { ok: false, message: "" };

export function ContactLiveForm({ productName, productSlug, lang = "de" }: { productName?: string; productSlug?: string; lang?: Language } = {}) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientError, setClientError] = useState("");
  const isInquiry = Boolean(productName || productSlug);
  const t = translations[lang].contact;

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const data = new FormData(form);
        const email = String(data.get("email") || "");
        if (!email.includes("@")) {
          event.preventDefault();
          setClientError(t.invalidEmail);
        } else {
          setClientError("");
        }
      }}
    >
      <input type="hidden" name="name" value={`${firstName} ${lastName}`.trim()} />
      <input type="hidden" name="intent" value={isInquiry ? "inquiry" : "contact"} />
      {productName ? <input type="hidden" name="productName" value={productName} /> : null}
      {productSlug ? <input type="hidden" name="productSlug" value={productSlug} /> : null}
      <div>
        <p className="mb-3 block text-sm font-semibold text-foreground">
          {t.selectType} <span className="text-destructive">*</span>
        </p>
        <div className="flex items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="customerType" value="gewerbe" className="h-4 w-4 accent-[hsl(var(--primary))]" />
            <span className="text-sm text-foreground">{t.business}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="customerType" value="privatperson" defaultChecked className="h-4 w-4 accent-[hsl(var(--primary))]" />
            <span className="text-sm text-foreground">{t.private}</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className="rounded-xl border border-input bg-background px-4 py-3 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          placeholder={t.firstName}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          autoComplete="given-name"
          required
        />
        <input
          className="rounded-xl border border-input bg-background px-4 py-3 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          placeholder={t.lastName}
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          autoComplete="family-name"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className="rounded-xl border border-input bg-background px-4 py-3 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          name="email"
          type="email"
          placeholder={t.email}
          autoComplete="email"
          required
        />
        <input
          className="rounded-xl border border-input bg-background px-4 py-3 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          name="phone"
          type="tel"
          placeholder={t.phone}
          autoComplete="tel"
        />
      </div>

      <input
        className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
        name="topic"
        placeholder={t.subject}
        defaultValue={isInquiry ? `${productName ?? t.defaultSubject} ${lang === "en" ? "inquiry" : "anfragen"}` : undefined}
        required
      />

      <textarea
        className="min-h-[180px] w-full resize-y rounded-xl border border-input bg-background px-4 py-3 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
        name="message"
        placeholder={t.message}
        required
      />

      <div>
        <p className="mb-2 block text-sm font-semibold text-foreground">
          {t.privacyLabel} <span className="text-destructive">*</span>
        </p>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input name="privacy" type="checkbox" required className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" />
          <span>
            {t.privacyStart}{" "}
            <Link href={localizedPath("/datenschutz", lang)} className="text-primary underline hover:no-underline">
              {t.privacyLink}
            </Link>{" "}
            {t.privacyEnd}
          </span>
        </label>
      </div>

      {clientError ? <p className="text-sm text-destructive">{clientError}</p> : null}
      {state.message ? <p className={`text-sm ${state.ok ? "text-primary" : "text-destructive"}`}>{state.message}</p> : null}

      <button type="submit" disabled={pending} className="btn-gradient inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold disabled:opacity-50">
        <Send className="h-4 w-4" />
        {pending ? t.sending : isInquiry ? t.submitInquiry : t.submit}
      </button>
    </form>
  );
}
