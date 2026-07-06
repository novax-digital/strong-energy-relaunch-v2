import Link from "next/link";

export function CTASection({
  title = "Erleben Sie die Energie von morgen!",
  text = "Unser Team berät Sie unverbindlich zu unseren Produkten.",
  href = "/de/kontakt",
  label = "Unverbindlich informieren"
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">{text}</p>
        </div>
        <Link className="btn-gradient px-8 py-4 rounded-full text-lg font-semibold shadow-lg whitespace-nowrap" href={href}>{label}</Link>
      </div>
    </section>
  );
}
