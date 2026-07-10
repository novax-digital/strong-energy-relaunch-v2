"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { ok: false, message: "" };

export function ContactForm({
  defaultMessage = "",
  defaultTopic = "Beratung",
  submitLabel = "Nachricht senden",
  intent = "contact",
  productName,
  productSlug,
  customerType = "privatperson"
}: {
  defaultMessage?: string;
  defaultTopic?: string;
  submitLabel?: string;
  intent?: "contact" | "inquiry";
  productName?: string;
  productSlug?: string;
  customerType?: "gewerbe" | "privatperson" | "installateur" | "grosshaendler";
} = {}) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef("");
  const requestIdInputRef = useRef<HTMLInputElement>(null);
  const [clientError, setClientError] = useState("");

  useEffect(() => {
    if (!state.ok || state.requestId !== requestIdRef.current) return;
    queueMicrotask(() => {
      formRef.current?.reset();
      requestIdRef.current = "";
    });
  }, [state.ok, state.requestId]);

  return (
    <form
      className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
      action={formAction}
      ref={formRef}
      onSubmit={(event) => {
        requestIdRef.current ||= crypto.randomUUID();
        if (requestIdInputRef.current) requestIdInputRef.current.value = requestIdRef.current;
        const form = event.currentTarget;
        const email = String(new FormData(form).get("email") || "");
        if (!email.includes("@")) {
          event.preventDefault();
          setClientError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        } else {
          setClientError("");
        }
      }}
    >
      <input ref={requestIdInputRef} type="hidden" name="request_id" />
      <input className="hidden" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="customerType" value={customerType} />
      {productName ? <input type="hidden" name="productName" value={productName} /> : null}
      {productSlug ? <input type="hidden" name="productSlug" value={productSlug} /> : null}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Name
          <input className="rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" name="name" autoComplete="name" required />
          {state.fieldErrors?.name ? <small className="text-destructive">{state.fieldErrors.name}</small> : null}
        </label>
        <label className="grid gap-2 text-sm font-medium text-foreground">
          E-Mail
          <input className="rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" name="email" type="email" autoComplete="email" required />
          {state.fieldErrors?.email ? <small className="text-destructive">{state.fieldErrors.email}</small> : null}
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Telefon
          <input className="rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" name="phone" type="tel" autoComplete="tel" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Thema
          <select className="rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" name="topic" defaultValue={defaultTopic}>
            <option>Beratung</option>
            <option>Produktanfrage</option>
            <option>Partnerschaft</option>
            <option>Support</option>
            {["Beratung", "Produktanfrage", "Partnerschaft", "Support"].includes(defaultTopic) ? null : <option>{defaultTopic}</option>}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-foreground mt-4">
        Nachricht
        <textarea className="rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 resize-y" name="message" rows={6} defaultValue={defaultMessage} required />
        {state.fieldErrors?.message ? <small className="text-destructive">{state.fieldErrors.message}</small> : null}
      </label>
      <label className="flex items-start gap-3 text-sm text-muted-foreground mt-5">
        <input name="privacy" type="checkbox" required /> Ich habe die <Link href="/de/datenschutz">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Angaben zu.
      </label>
      {state.fieldErrors?.privacy ? <small className="text-destructive">{state.fieldErrors.privacy}</small> : null}
      {clientError ? <p className="mt-4 text-sm text-destructive">{clientError}</p> : null}
      {state.message ? <p className={`mt-4 text-sm ${state.ok ? "text-primary" : "text-destructive"}`}>{state.message}</p> : null}
      <button className="btn-gradient px-8 py-4 rounded-full text-lg font-semibold shadow-lg mt-6 disabled:opacity-60" type="submit" disabled={pending}>
        {pending ? "Wird gesendet..." : submitLabel}
      </button>
    </form>
  );
}
