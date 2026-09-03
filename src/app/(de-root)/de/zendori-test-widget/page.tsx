import type { Metadata } from "next";
import Script from "next/script";

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
      <section className="container-wide flex min-h-[70vh] items-center justify-center px-6 pb-20 pt-36 text-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Widget-Testseite</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Das Widget befindet sich unten rechts und kann dort getestet werden.
          </p>
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
