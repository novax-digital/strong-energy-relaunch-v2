import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function Icon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return <Icon {...props}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>;
}

export function CloseIcon(props: IconProps) {
  return <Icon {...props}><path d="M6 6l12 12M18 6 6 18" /></Icon>;
}

export function ArrowRightIcon(props: IconProps) {
  return <Icon {...props}><path d="M5 12h14M13 5l7 7-7 7" /></Icon>;
}

export function DownloadIcon(props: IconProps) {
  return <Icon {...props}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Icon>;
}

export function MailIcon(props: IconProps) {
  return <Icon {...props}><path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" /></Icon>;
}

export function PhoneIcon(props: IconProps) {
  return <Icon {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2Z" /></Icon>;
}

export function PinIcon(props: IconProps) {
  return <Icon {...props}><path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Icon>;
}

export function CheckIcon(props: IconProps) {
  return <Icon {...props}><path d="m20 6-11 11-5-5" /></Icon>;
}

export function SearchIcon(props: IconProps) {
  return <Icon {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
}
