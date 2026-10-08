"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import type { Language } from "@/lib/i18n";

const copy = {
  de: { title: "Private Produktvorschau", text: "Bitte geben Sie das Passwort ein, um die Vorschau zu öffnen.", password: "Passwort", open: "Vorschau öffnen", loading: "Wird geöffnet …", error: "Das Passwort ist nicht korrekt.", unavailable: "Bitte versuchen Sie es später erneut.", limited: "Zu viele Versuche. Bitte warten Sie 15 Minuten." },
  en: { title: "Private product preview", text: "Enter the password to open the preview.", password: "Password", open: "Open preview", loading: "Opening …", error: "The password is incorrect.", unavailable: "Please try again later.", limited: "Too many attempts. Please wait 15 minutes." }
};

export function PrivateProductPasswordForm({ lang, preview }: { lang: Language; preview: string }) {
  const t = copy[lang];
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/private-preview/password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, lang, preview })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        window.location.assign(data.next);
        return;
      }
      setError(response.status === 429 ? t.limited : response.status === 401 ? t.error : t.unavailable);
    } catch {
      setError(t.unavailable);
    }
    setPending(false);
  }

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-[#123c3b] to-[#101c23] px-5 pb-16 pt-40">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl">
        <LockKeyhole aria-hidden="true" className="mb-5 h-9 w-9 text-primary" />
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="mb-7 mt-3 text-muted-foreground">{t.text}</p>
        <form onSubmit={submit}>
          <label className="mb-2 block font-semibold" htmlFor="preview-password">{t.password}</label>
          <input className="h-12 w-full rounded-xl border border-input px-4 focus:outline-primary" id="preview-password" type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby={error ? "preview-error" : undefined} aria-invalid={Boolean(error)} />
          {error ? <p className="mt-3 text-sm text-red-700" id="preview-error" role="alert">{error}</p> : null}
          <button className="btn-gradient mt-5 min-h-12 w-full rounded-xl font-semibold disabled:opacity-60" disabled={pending || !password} type="submit">{pending ? t.loading : t.open}</button>
        </form>
      </div>
    </section>
  );
}
