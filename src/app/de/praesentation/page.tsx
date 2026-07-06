import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Präsentation – Strong Energy",
  description: "Interne Präsentation",
  robots: {
    index: false,
    follow: false
  }
};

export default function PraesentationPage() {
  return (
    <section className="pt-24 md:pt-28 pb-16">
      <div className="container-wide">
        <div className="relative h-0 w-full overflow-hidden rounded-lg shadow-[0_2px_8px_0_rgba(63,69,81,0.16)]" style={{ paddingTop: "56.25%" }}>
          <iframe
            loading="lazy"
            className="absolute left-0 top-0 h-full w-full border-0"
            src="https://www.canva.com/design/DAG29jSOsOM/NJQ7lmp3JPY7ezLytKFGFg/view?embed"
            allowFullScreen
            allow="fullscreen"
            title="Strong Energy Präsentation"
          />
        </div>
      </div>
    </section>
  );
}
