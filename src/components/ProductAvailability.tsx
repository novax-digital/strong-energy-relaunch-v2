import { CalendarClock } from "lucide-react";

export function ProductAvailability({ label, className = "text-primary" }: { label?: string; className?: string }) {
  if (!label) return null;

  return (
    <p className={`mt-3 flex items-center gap-2 text-sm font-semibold ${className}`}>
      <CalendarClock aria-hidden="true" className="h-4 w-4 shrink-0" />
      {label}
    </p>
  );
}
