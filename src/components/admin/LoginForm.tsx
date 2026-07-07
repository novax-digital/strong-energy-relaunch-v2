"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { FormEvent, useState } from "react";
import { site } from "@/content/site";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (loginError) {
      setError("Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/50 via-background to-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border/50 bg-white p-8 shadow-2xl md:p-12">
          <div className="mb-8 flex justify-center">
            <Image src={site.logo} alt="Strong Energy" width={190} height={55} priority className="h-14 w-auto" />
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">Bitte melden Sie sich mit Ihren Zugangsdaten an.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              E-Mail
              <input
                className="h-12 rounded-xl border border-input bg-background px-4 font-normal outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Passwort
              <input
                className="h-12 rounded-xl border border-input bg-background px-4 font-normal outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Passwort eingeben"
                required
              />
            </label>

            {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

            <button className="btn-gradient h-12 w-full rounded-xl text-base font-semibold disabled:opacity-60" type="submit" disabled={loading || !email || !password}>
              {loading ? "Anmelden..." : "Anmelden"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Strong Energy. Alle Rechte vorbehalten.</p>
      </div>
    </main>
  );
}
