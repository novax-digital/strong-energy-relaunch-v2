"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { site } from "@/content/site";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const STORAGE_KEY = "strong-energy-authenticated";
const PROTECTED_SETTING_ID = "main";

type GateStatus = "checking" | "open" | "locked";

function isBypassedPath(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/login");
}

export function SitePasswordGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bypassed = isBypassedPath(pathname);
  const [gate, setGate] = useState<{ pathname: string; status: GateStatus }>({ pathname: "", status: "checking" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bypassed) {
      return;
    }

    let active = true;

    async function loadProtectionState() {
      setError("");

      try {
        const { data, error: settingsError } = await getSupabaseBrowserClient()
          .from("site_settings_public")
          .select("password_protection_enabled")
          .eq("id", PROTECTED_SETTING_ID)
          .maybeSingle();

        if (!active) {
          return;
        }

        if (settingsError || !data?.password_protection_enabled) {
          setGate({ pathname, status: "open" });
          return;
        }

        const { data: sessionData } = await getSupabaseBrowserClient().auth.getSession();
        if (!active) {
          return;
        }

        setGate({ pathname, status: sessionData.session || sessionStorage.getItem(STORAGE_KEY) === "true" ? "open" : "locked" });
      } catch {
        if (active) {
          setGate({ pathname, status: "open" });
        }
      }
    }

    loadProtectionState();

    return () => {
      active = false;
    };
  }, [bypassed, pathname]);

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: verifyError } = await getSupabaseBrowserClient().functions.invoke<{ success: boolean }>("verify-site-password", {
      body: { password }
    });

    setSubmitting(false);

    if (verifyError) {
      setError("Die Passwort-Prüfung ist gerade nicht erreichbar.");
      return;
    }

    if (!data?.success) {
      setError("Das Passwort stimmt nicht.");
      setPassword("");
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, "true");
    setGate({ pathname, status: "open" });
    setPassword("");
  }

  if (bypassed) {
    return <>{children}</>;
  }

  const status = gate.pathname === pathname ? gate.status : "checking";

  if (status === "open") {
    return <>{children}</>;
  }

  if (status === "checking") {
    return <div className="min-h-screen bg-background" aria-hidden="true" />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8faf9_0%,#edf7f5_48%,#f7f5df_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/80 bg-white/95 p-7 shadow-[0_24px_80px_rgba(13,38,35,0.16)] backdrop-blur md:p-9">
        <div className="mb-7 flex justify-center">
          <Image src={site.logo} alt="Strong Energy" width={190} height={55} priority className="h-12 w-auto" />
        </div>

        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold text-foreground">Website geschützt</h1>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-muted-foreground">
          Bitte geben Sie das Passwort ein, um die Vorschau zu öffnen.
        </p>

        <form onSubmit={submitPassword} className="mt-7 space-y-4">
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Passwort
            <span className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-12 w-full rounded-xl border border-input bg-background px-11 pr-12 outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                autoFocus
                required
              />
              <button
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

          <button className="btn-gradient h-12 w-full rounded-xl text-base font-semibold disabled:opacity-60" type="submit" disabled={submitting || !password}>
            {submitting ? "Prüfe..." : "Entsperren"}
          </button>
        </form>
      </div>
    </main>
  );
}
