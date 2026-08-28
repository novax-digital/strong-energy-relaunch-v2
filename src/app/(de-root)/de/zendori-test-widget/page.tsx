import type { Metadata } from "next";
import Script from "next/script";
import { PageHero } from "@/components/Hero";

export const metadata: Metadata = {
  title: "Zendori Test-Widget – Strong Energy",
  description: "Interne Testseite für das Zendori Webchat-Widget.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function ZendoriTestWidgetPage() {
  return (
    <>
      <PageHero eyebrow="Intern" title={<>Zendori <span>Test-Widget</span></>}>
        <p>
          Diese Seite dient ausschließlich dem Test des Zendori Webchats. Sie ist nirgends verlinkt, steht nicht in der
          Sitemap und ist für Suchmaschinen auf noindex gesetzt.
        </p>
      </PageHero>

      <section className="pb-24">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground">So testen Sie den Chat</h2>
              <p className="mt-2 text-muted-foreground">
                Der Chat-Button wird von Zendori selbst eingeblendet – in der Regel unten rechts. Sollte er nicht
                erscheinen, prüfen Sie in der Browser-Konsole, ob <code className="rounded bg-muted px-1.5 py-0.5 text-sm">widget.js</code>{" "}
                geladen wurde und ob ein Adblocker aktiv ist.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">Eingebundenes Skript</h2>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
                <code>{'<script src="https://app.zendori.ai/widget.js" data-zendori-token="ecb754a0f6245c9d08cb375371875046" async></script>'}</code>
              </pre>
            </div>

            <p className="text-sm text-muted-foreground">
              Auf allen anderen Seiten der Website ist das Widget nicht aktiv.
            </p>
          </div>
        </div>
      </section>

      <Script
        async
        data-zendori-token="ecb754a0f6245c9d08cb375371875046"
        src="https://app.zendori.ai/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
