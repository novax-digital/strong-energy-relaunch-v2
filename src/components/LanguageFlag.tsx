import type { Language } from "@/lib/i18n";

type LanguageFlagProps = {
  language: Language;
  className?: string;
};

export function LanguageFlag({ language, className = "" }: LanguageFlagProps) {
  const sharedProps = {
    "aria-hidden": true,
    className: `h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] ${className}`,
    viewBox: "0 0 60 42"
  } as const;

  if (language === "de") {
    return (
      <svg {...sharedProps}>
        <path fill="#000" d="M0 0h60v14H0z" />
        <path fill="#D00" d="M0 14h60v14H0z" />
        <path fill="#FFCE00" d="M0 28h60v14H0z" />
      </svg>
    );
  }

  return (
    <svg {...sharedProps} viewBox="0 0 60 36">
      <g>
        <path fill="#012169" d="M0 0h60v36H0z" />
        <path stroke="#fff" strokeWidth="7.2" d="m0 0 60 36M60 0 0 36" />
        <path stroke="#C8102E" strokeWidth="2.4" d="m0 0 60 36M60 0 0 36" />
        <path fill="#fff" d="M25 0h10v36H25zM0 13h60v10H0z" />
        <path fill="#C8102E" d="M27 0h6v36h-6zM0 15h60v6H0z" />
      </g>
    </svg>
  );
}
