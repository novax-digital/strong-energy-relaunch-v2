"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileDown,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  Key,
  Lightbulb,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Newspaper,
  Package,
  PanelLeft,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Shield,
  Sparkles,
  Star,
  Trash2,
  Upload,
  UserCircle,
  Users,
  Video,
  X
} from "lucide-react";
import { Fragment, FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { site } from "@/content/site";
import { products } from "@/content/products";
import { getBlogAuthorProfile } from "@/content/blog-authors";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Inquiry = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  customer_type: string;
  product_slug: string | null;
  bundesland: string | null;
  privacy_accepted: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
};

type ContactMessage = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  customer_type: string;
  subject: string;
  message: string;
  privacy_accepted: boolean;
};

type UserEntry = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string | null;
};

type BlogAuthor = {
  id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  is_default: boolean;
};

type BlogTopic = {
  id: string;
  topic: string;
  description: string | null;
  used_at: string | null;
  used_in_post_id: string | null;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author: string | null;
  author_id: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  scheduled_at: string | null;
  reading_time_minutes: number | null;
  created_at: string;
  updated_at: string;
  language: string | null;
  translation_group_id: string | null;
};

type GeneratedBlogPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author?: string | null;
  author_id?: string | null;
  tags: string[] | null;
  cover_image_url?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  published_at?: string | null;
  scheduled_at?: string | null;
  reading_time_minutes: number | null;
  language: "de" | "en";
  translation_group_id: string;
};

type GeneratedBlogResponse = {
  postDe: GeneratedBlogPost;
  postEn: GeneratedBlogPost;
  topicId?: string | null;
};

type DownloadEntry = {
  id: string;
  title_de: string;
  title_en: string | null;
  description_de: string | null;
  description_en: string | null;
  category: string;
  file_url_de: string | null;
  file_url_en: string | null;
  product_slugs: string[] | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

type MediaCategory = {
  id: string;
  name_de: string;
  name_en: string | null;
  sort_order: number;
  parent_id: string | null;
  created_at: string;
};

type MediaItem = {
  id: string;
  title_de: string;
  title_en: string | null;
  description_de: string | null;
  description_en: string | null;
  category_id: string | null;
  media_type: string;
  file_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  product_slugs: string[] | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

type AdminSection =
  | "inquiries"
  | "messages"
  | "blog"
  | "topics"
  | "authors"
  | "downloads"
  | "media"
  | "media-categories"
  | "users"
  | "products"
  | "notifications"
  | "sitemap"
  | "llms"
  | "protection"
  | "account";

type CrudValue = string | number | boolean | string[] | null;
type CrudRecord = Record<string, CrudValue>;

type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "select" | "array" | "date";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  required?: boolean;
};

const sectionTitles: Record<AdminSection, string> = {
  inquiries: "Produktanfragen",
  messages: "Kontaktnachrichten",
  blog: "Blog-Beiträge",
  topics: "Blog-Themen",
  authors: "Blog-Autoren",
  downloads: "Downloads",
  media: "Media",
  "media-categories": "Media-Kategorien",
  users: "Nutzerverwaltung",
  products: "Produkte",
  notifications: "E-Mail-Empfänger",
  sitemap: "Sitemap",
  llms: "llms.txt",
  protection: "Website-Schutz",
  account: "Passwort ändern"
};

const categoryOptions = ["Datenblatt", "Installationsanleitung", "Broschüre", "Zertifikat", "Garantie", "Software", "Strong Energy Products 2026 - International", "Sonstiges"].map((value) => ({ label: value, value }));
const productOptions = products.map((product) => ({ label: product.name, value: product.slug }));
const blogGeneratorCategoryOptions = ["Neuigkeiten", "Produkte", "Energie", "Nachhaltigkeit", "Tipps", "Technologie", "Unternehmen"];
const blogCategoryOptions = [...blogGeneratorCategoryOptions, "News", "Products", "Energy", "Sustainability", "Tips", "Technology", "Company"];
const blogCategoryColors: Record<string, string> = {
  Neuigkeiten: "border-primary/20 bg-primary/10 text-primary",
  Produkte: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  Energie: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  Nachhaltigkeit: "border-green-500/20 bg-green-500/10 text-green-600",
  Tipps: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  Technologie: "border-sky-500/20 bg-sky-500/10 text-sky-600",
  Unternehmen: "border-slate-500/20 bg-slate-500/10 text-slate-600",
  News: "border-primary/20 bg-primary/10 text-primary",
  Products: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  Energy: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  Sustainability: "border-green-500/20 bg-green-500/10 text-green-600",
  Tips: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  Technology: "border-sky-500/20 bg-sky-500/10 text-sky-600",
  Company: "border-slate-500/20 bg-slate-500/10 text-slate-600"
};
const blogLanguageOptions = [{ label: "🇩🇪 Deutsch", value: "de" }, { label: "🇬🇧 English", value: "en" }];

const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50";
const textareaClass = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "text-sm font-medium leading-none text-foreground";
const tableClass = "w-full caption-bottom text-sm";
const tableHeadClass = "h-12 px-4 text-left align-middle font-medium text-muted-foreground";
const tableCellClass = "p-4 align-middle";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "icon";

function buttonClass(variant: ButtonVariant = "default", size: ButtonSize = "default") {
  return cx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    variant === "default" && "bg-primary text-white hover:bg-primary/90",
    variant === "outline" && "border border-input bg-background hover:bg-secondary",
    variant === "ghost" && "hover:bg-secondary",
    variant === "destructive" && "bg-destructive text-white hover:bg-destructive/90",
    size === "default" && "h-10 px-4 py-2",
    size === "sm" && "h-9 px-3",
    size === "icon" && "h-10 w-10"
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("de-DE").format(new Date(value));
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatCustomerType(value: string | null | undefined) {
  const normalized = value?.toLowerCase();
  if (normalized === "gewerbe") return "Gewerbe";
  if (normalized === "privatperson") return "Privatperson";
  if (normalized === "installateur") return "Installateur";
  if (normalized === "grosshaendler") return "Großhändler";
  return value || "-";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function errorPayloadMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const record = payload as Record<string, unknown>;
  if (typeof record.error === "string") return record.error;
  if (typeof record.message === "string") return record.message;
  return "";
}

async function functionErrorMessage(data: unknown, fnError: unknown, fallback: string) {
  const dataMessage = errorPayloadMessage(data);
  if (dataMessage) return dataMessage;

  if (fnError && typeof fnError === "object") {
    const errorRecord = fnError as { context?: unknown; message?: unknown };
    const response = errorRecord.context instanceof Response ? errorRecord.context : null;

    if (response) {
      try {
        const payload = await response.clone().json();
        const payloadMessage = errorPayloadMessage(payload);
        if (payloadMessage) return payloadMessage;
      } catch {
        try {
          const text = await response.clone().text();
          if (text.trim()) return text.trim();
        } catch {
          // Fall through to the generic error message below.
        }
      }
    }

    if (typeof errorRecord.message === "string") return errorRecord.message;
  }

  return fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function productLabel(slug: string) {
  return productOptions.find((product) => product.value === slug)?.label || slug;
}

function StatusBadge({ active, activeText = "Aktiv", inactiveText = "Entwurf" }: { active: boolean; activeText?: string; inactiveText?: string }) {
  return (
    <span className={cx("inline-flex rounded-full px-2 py-1 text-xs font-semibold", active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
      {active ? activeText : inactiveText}
    </span>
  );
}

function AuthorAvatarPreview({ name, src, showName }: { name: string; src?: string | null; showName?: boolean }) {
  const profile = getBlogAuthorProfile(name);
  const imageSrc = src || profile?.avatar || "";
  const displayName = name || profile?.name || "Autor";

  return (
    <span className={cx("inline-flex min-w-0 items-center gap-3", !showName && "justify-center")}>
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
        {imageSrc ? (
          <Image src={imageSrc} alt={`Profilbild von ${displayName}`} fill sizes="40px" className="object-cover" unoptimized />
        ) : (
          <UserCircle className="h-5 w-5 text-muted-foreground" />
        )}
      </span>
      {showName ? <span className="truncate font-medium text-foreground">{displayName}</span> : null}
    </span>
  );
}

function ProductChipSelector({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg border border-border p-3">
      {productOptions.map((product) => {
        const active = value.includes(product.value);
        return (
          <button
            className={cx(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "bg-primary text-white" : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
            key={product.value}
            onClick={() => onChange(active ? value.filter((slug) => slug !== product.value) : [...value, product.value])}
            type="button"
          >
            {product.label}
          </button>
        );
      })}
    </div>
  );
}

function SwitchControl({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      aria-pressed={checked}
      className={cx("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted")}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className={cx("absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform", checked && "translate-x-5")} />
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  className
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number" | "email" | "password";
  className?: string;
}) {
  return (
    <label className={cx("grid gap-2", className)}>
      <span className={labelClass}>{label}{required ? " *" : ""}</span>
      <input className={inputClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
  mono,
  className
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  mono?: boolean;
  className?: string;
}) {
  return (
    <label className={cx("grid gap-2", className)}>
      <span className={labelClass}>{label}</span>
      <textarea className={cx(textareaClass, mono && "font-mono")} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Bitte wählen",
  className
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cx("grid gap-2", className)}>
      <span className={labelClass}>{label}</span>
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("overflow-hidden rounded-xl border border-border bg-white", className)}>{children}</div>;
}

function IconButton({ label, onClick, children, destructive }: { label: string; onClick: () => void; children: ReactNode; destructive?: boolean }) {
  return (
    <button className={buttonClass("ghost", "icon")} onClick={onClick} type="button" aria-label={label}>
      <span className={destructive ? "text-destructive" : undefined}>{children}</span>
    </button>
  );
}

function channelForInquiry(inquiry: Inquiry) {
  const source = inquiry.utm_source?.toLowerCase();
  if (source === "google") return { label: "Google Ads", className: "bg-blue-50 text-blue-600" };
  if (source === "meta" || source === "facebook" || source === "instagram") return { label: "Meta Ads", className: "bg-purple-50 text-purple-600" };
  if (source === "bing") return { label: "Bing Ads", className: "bg-teal-50 text-teal-600" };
  if (source) return { label: inquiry.utm_source || "Kampagne", className: "bg-orange-50 text-orange-600" };
  return { label: "Organisch", className: "bg-green-50 text-green-600" };
}

function cleanPayload(record: CrudRecord, fields: FieldConfig[]) {
  const payload: CrudRecord = {};
  for (const field of fields) {
    const value = record[field.key];
    if (field.type === "array") {
      payload[field.key] = Array.isArray(value) ? value.filter(Boolean) : String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
    } else if (field.type === "number") {
      payload[field.key] = Number(value || 0);
    } else if (field.type === "checkbox") {
      payload[field.key] = Boolean(value);
    } else if (value === "") {
      payload[field.key] = null;
    } else {
      payload[field.key] = value;
    }
  }
  return payload;
}

function valueToInput(value: CrudValue) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined) return "";
  return String(value);
}

function createLabelFor(title: string) {
  const labels: Record<string, string> = {
    "Blog-Beiträge": "Neuer Beitrag",
    "Blog-Themen": "Neues Thema",
    "Blog-Autoren": "Neuer Autor",
    Downloads: "Neuer Download",
    Medien: "Neues Medium",
    "Media-Kategorien": "Neue Kategorie",
    Produktkategorien: "Neue Kategorie",
    "E-Mail-Empfänger": "Neuer Empfänger"
  };
  return labels[title] || "Neu";
}

function dialogTitleFor(title: string, editing: boolean) {
  if (editing) return `${title} bearbeiten`;
  return createLabelFor(title);
}

export function AdminApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSection = (searchParams.get("section") || "inquiries") as AdminSection;
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        const { data: roles, error } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
        if (error) throw error;

        const hasAdmin = Array.isArray(roles) && roles.some((role) => role.role === "admin");
        if (!hasAdmin) {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        if (mounted) setLoading(false);
      } catch (error) {
        if (mounted) {
          setAuthError(error instanceof Error ? error.message : "Admin-Authentifizierung fehlgeschlagen.");
          setLoading(false);
        }
      }
    }

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  function navigate(section: AdminSection) {
    router.push(`/admin?section=${section}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-6">
        <div className="max-w-lg rounded-2xl border border-destructive/20 bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-foreground">Backend konnte nicht geladen werden</h1>
          <p className="mt-3 text-sm text-muted-foreground">{authError}</p>
          <button className="btn-gradient mt-6 rounded-full px-6 py-3 text-sm font-semibold" onClick={() => router.push("/login")} type="button">
            Zum Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[15px] text-foreground">
      <AdminSidebar collapsed={collapsed} currentSection={currentSection} onNavigate={navigate} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-white px-5">
          <button className="rounded-md p-1.5 text-foreground transition-colors hover:bg-secondary" onClick={() => setCollapsed((value) => !value)} type="button" aria-label="Navigation umschalten">
            <PanelLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold text-foreground">{sectionTitles[currentSection] || "Backend"}</h1>
        </header>
        <main className="p-5 md:p-6">
          <SectionRenderer section={currentSection} />
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({
  collapsed,
  currentSection,
  onNavigate
}: {
  collapsed: boolean;
  currentSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
}) {
  const router = useRouter();
  const [requestsOpen, setRequestsOpen] = useState(true);
  const [blogOpen, setBlogOpen] = useState(true);

  async function logout() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/login");
  }

  return (
    <aside className={cx("sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-white transition-all duration-300", collapsed ? "w-[68px]" : "w-64")}>
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/de" aria-label="Zur Hauptseite" className="inline-flex items-center rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/35">
          <Image src={site.logo} alt="Strong Energy" width={160} height={46} className={cx("h-8 w-auto", collapsed && "h-6")} />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarGroupButton collapsed={collapsed} icon={<Mail />} label="Anfragen" open={requestsOpen} onClick={() => setRequestsOpen((value) => !value)} />
        {!collapsed && requestsOpen ? (
          <div className="ml-4 border-l border-border pl-3">
            <SidebarButton collapsed={collapsed} icon={<Mail />} label="Produktanfragen" active={currentSection === "inquiries"} onClick={() => onNavigate("inquiries")} small />
            <SidebarButton collapsed={collapsed} icon={<MessageSquare />} label="Kontaktnachrichten" active={currentSection === "messages"} onClick={() => onNavigate("messages")} small />
          </div>
        ) : null}

        <div className="mt-4">
          <SidebarGroupButton collapsed={collapsed} icon={<Newspaper />} label="Blog" open={blogOpen} onClick={() => setBlogOpen((value) => !value)} />
          {!collapsed && blogOpen ? (
            <div className="ml-4 border-l border-border pl-3">
              <SidebarButton collapsed={collapsed} icon={<Newspaper />} label="Beiträge" active={currentSection === "blog"} onClick={() => onNavigate("blog")} small />
              <SidebarButton collapsed={collapsed} icon={<Lightbulb />} label="Themen" active={currentSection === "topics"} onClick={() => onNavigate("topics")} small />
              <SidebarButton collapsed={collapsed} icon={<UserCircle />} label="Autoren" active={currentSection === "authors"} onClick={() => onNavigate("authors")} small />
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-1">
          <SidebarButton collapsed={collapsed} icon={<FileDown />} label="Downloads" active={currentSection === "downloads"} onClick={() => onNavigate("downloads")} />
          <SidebarButton collapsed={collapsed} icon={<ImageIcon />} label="Media" active={currentSection === "media"} onClick={() => onNavigate("media")} />
          <SidebarButton collapsed={collapsed} icon={<Users />} label="Nutzer" active={currentSection === "users"} onClick={() => onNavigate("users")} />
          <SidebarButton collapsed={collapsed} icon={<Package />} label="Produkte" active={currentSection === "products"} onClick={() => onNavigate("products")} />
        </div>

        {!collapsed ? <p className="mt-8 px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Einstellungen</p> : null}
        <div className="mt-2 space-y-1">
          <SidebarButton collapsed={collapsed} icon={<Bell />} label="E-Mail-Empfänger" active={currentSection === "notifications"} onClick={() => onNavigate("notifications")} />
          <SidebarButton collapsed={collapsed} icon={<Globe />} label="Sitemap" active={currentSection === "sitemap"} onClick={() => onNavigate("sitemap")} />
          <SidebarButton collapsed={collapsed} icon={<Bot />} label="llms.txt" active={currentSection === "llms"} onClick={() => onNavigate("llms")} />
          <SidebarButton collapsed={collapsed} icon={<Shield />} label="Website-Schutz" active={currentSection === "protection"} onClick={() => onNavigate("protection")} />
          <SidebarButton collapsed={collapsed} icon={<Key />} label="Passwort ändern" active={currentSection === "account"} onClick={() => onNavigate("account")} />
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <SidebarButton collapsed={collapsed} icon={<LogOut />} label="Abmelden" onClick={logout} />
      </div>
    </aside>
  );
}

function SidebarGroupButton({
  collapsed,
  icon,
  label,
  open,
  onClick
}: {
  collapsed: boolean;
  icon: ReactNode;
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button className={cx("flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary", open && "bg-secondary")} onClick={onClick} type="button">
      <span className="[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0">{icon}</span>
      {!collapsed ? (
        <>
          <span className="flex-1">{label}</span>
          <ChevronDown className={cx("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </>
      ) : null}
    </button>
  );
}

function SidebarButton({
  collapsed,
  icon,
  label,
  active,
  onClick,
  small
}: {
  collapsed: boolean;
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      className={cx(
        "flex w-full items-center gap-2 overflow-hidden rounded-md text-left text-sm transition-colors hover:bg-secondary",
        small ? "h-7 px-2" : "h-8 p-2",
        active ? "bg-secondary font-medium text-foreground" : "text-foreground/85",
        collapsed && "justify-center"
      )}
      onClick={onClick}
      title={collapsed ? label : undefined}
      type="button"
    >
      <span className={cx("[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0", small && "[&>svg]:h-3.5 [&>svg]:w-3.5")}>{icon}</span>
      {!collapsed ? <span>{label}</span> : null}
    </button>
  );
}

function SectionRenderer({ section }: { section: AdminSection }) {
  switch (section) {
    case "inquiries":
      return <InquiriesSection />;
    case "messages":
      return <MessagesSection />;
    case "blog":
      return <BlogSection />;
    case "topics":
      return (
        <CrudSection
          title="Blog-Themen"
          table="blog_topics"
          primaryKey="id"
          order={{ column: "created_at", ascending: false }}
          columns={[
            { key: "topic", label: "Thema" },
            { key: "description", label: "Beschreibung" },
            { key: "used_at", label: "Genutzt", render: (row) => formatDate(String(row.used_at || "")) }
          ]}
          fields={[
            { key: "topic", label: "Thema", required: true, placeholder: "z.B. Warum sich ein Batteriespeicher 2026 lohnt" },
            { key: "description", label: "Beschreibung (optional)", type: "textarea", placeholder: "Zusätzliche Notizen oder Stichpunkte..." }
          ]}
          defaults={{ topic: "", description: "" }}
        />
      );
    case "authors":
      return (
        <CrudSection
          title="Blog-Autoren"
          table="blog_authors"
          primaryKey="id"
          order={{ column: "created_at", ascending: false }}
          columns={[
            { key: "avatar_url", label: "Bild", render: (row) => <AuthorAvatarPreview name={valueToInput(row.name) || "Autor"} src={valueToInput(row.avatar_url)} /> },
            { key: "name", label: "Name" },
            { key: "bio", label: "Bio" },
            { key: "is_default", label: "Standard", render: (row) => (row.is_default ? "Ja" : "Nein") }
          ]}
          fields={[
            { key: "name", label: "Name", required: true, placeholder: "Max Mustermann" },
            { key: "avatar_url", label: "Profilbild" },
            { key: "bio", label: "Kurzbiografie", type: "textarea", placeholder: "Kurze Beschreibung des Autors..." },
            { key: "is_default", label: "Als Standard-Autor festlegen", type: "checkbox" }
          ]}
          defaults={{ name: "", bio: "", avatar_url: "", is_default: false }}
        />
      );
    case "downloads":
      return <DownloadsSection />;
    case "media":
      return <MediaSection initialTab="items" />;
    case "media-categories":
      return <MediaSection initialTab="categories" />;
    case "users":
      return <UsersSection />;
    case "products":
      return <ProductCategoriesSection />;
    case "notifications":
      return (
        <CrudSection
          title="E-Mail-Empfänger"
          table="notification_recipients"
          primaryKey="id"
          order={{ column: "created_at", ascending: true }}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "E-Mail" },
            { key: "form_type", label: "Formulare" },
            { key: "is_active", label: "Status", render: (row) => (row.is_active ? "Aktiv" : "Inaktiv") }
          ]}
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "email", label: "E-Mail", required: true },
            { key: "form_type", label: "Formular", type: "select", options: [{ label: "Alle Formulare", value: "both" }, { label: "Nur Kontakt", value: "contact" }, { label: "Nur Produktanfragen", value: "inquiry" }] },
            { key: "is_active", label: "Aktiv", type: "checkbox" }
          ]}
          defaults={{ form_type: "both", is_active: true }}
        />
      );
    case "sitemap":
      return <InfoPanel title="Sitemap" text="Die öffentliche Sitemap wird in dieser Next-Version automatisch aus statischen Routen, Produkten, Blogposts und Rechtstexten generiert." link="/sitemap.xml" linkLabel="Sitemap öffnen" />;
    case "llms":
      return <InfoPanel title="llms.txt" text="Die ursprüngliche Admin-Ansicht für llms.txt ist vorbereitet. Für eine echte Bearbeitung braucht es entweder eine Supabase-Tabelle oder eine Datei-Write-Route auf dem Hosting." />;
    case "protection":
      return <ProtectionSection />;
    case "account":
      return <AccountSection />;
    default:
      return null;
  }
}

function InquiriesSection() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getSupabaseBrowserClient().from("inquiries").select("*").order("created_at", { ascending: false });
    if (!error) setRows((data || []) as Inquiry[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function remove(row: Inquiry) {
    if (!confirm(`Produktanfrage von ${row.first_name} ${row.last_name} löschen?`)) return;
    await getSupabaseBrowserClient().from("inquiries").delete().eq("id", row.id);
    setSelected(null);
    load();
  }

  return (
    <div className="space-y-4">
      <SectionToolbar title={`${rows.length} Produktanfragen`} loading={loading} onRefresh={load} />
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-[13px]">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                {["Datum", "Name", "E-Mail", "Telefon", "Typ", "Produkt", "Kanal"].map((label) => (
                  <th className="px-4 py-3 text-left text-[13px] font-bold text-foreground" key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((row) => {
                const channel = channelForInquiry(row);
                return (
                  <tr className="cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30" key={row.id} onClick={() => setSelected(row)}>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3 font-semibold">{row.first_name} {row.last_name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.phone || "-"}</td>
                    <td className="px-4 py-3">{formatCustomerType(row.customer_type)}</td>
                    <td className="px-4 py-3">{row.product_slug || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={cx("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold", channel.className)}>{channel.label}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td className="p-7 text-center text-muted-foreground" colSpan={7}>{loading ? "Lade Anfragen..." : "Keine Produktanfragen vorhanden."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selected ? (
        <DetailDialog title="Produktanfrage" onClose={() => setSelected(null)} onDelete={() => remove(selected)}>
          <DetailGrid
            rows={[
              ["Datum", formatDateTime(selected.created_at)],
              ["Name", `${selected.first_name} ${selected.last_name}`],
              ["E-Mail", selected.email],
              ["Telefon", selected.phone || "-"],
              ["Typ", formatCustomerType(selected.customer_type)],
              ["Produkt", selected.product_slug || "-"],
              ["Kanal", `${channelForInquiry(selected).label}${selected.utm_campaign ? ` (${selected.utm_campaign})` : ""}`],
              ["Details", selected.bundesland || "-"]
            ]}
          />
        </DetailDialog>
      ) : null}
    </div>
  );
}

function MessagesSection() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getSupabaseBrowserClient().from("contact_messages").select("*").order("created_at", { ascending: false });
    if (!error) setRows((data || []) as ContactMessage[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function remove(row: ContactMessage) {
    if (!confirm(`Kontaktnachricht von ${row.first_name} ${row.last_name} löschen?`)) return;
    await getSupabaseBrowserClient().from("contact_messages").delete().eq("id", row.id);
    setSelected(null);
    load();
  }

  return (
    <div className="space-y-4">
      <SectionToolbar title={`${rows.length} Kontaktnachrichten`} loading={loading} onRefresh={load} />
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[13px]">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                {["Datum", "Name", "E-Mail", "Betreff", "Nachricht"].map((label) => (
                  <th className="px-4 py-3 text-left text-[13px] font-bold text-foreground" key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((row) => (
                <tr className="cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30" key={row.id} onClick={() => setSelected(row)}>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(row.created_at)}</td>
                  <td className="px-4 py-3 font-semibold">{row.first_name} {row.last_name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.subject}</td>
                  <td className="max-w-md truncate px-4 py-3">{row.message}</td>
                </tr>
              )) : (
                <tr><td className="p-7 text-center text-muted-foreground" colSpan={5}>{loading ? "Lade Nachrichten..." : "Keine Kontaktnachrichten vorhanden."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selected ? (
        <DetailDialog title="Kontaktnachricht" onClose={() => setSelected(null)} onDelete={() => remove(selected)}>
          <DetailGrid
            rows={[
              ["Datum", formatDateTime(selected.created_at)],
              ["Name", `${selected.first_name} ${selected.last_name}`],
              ["E-Mail", selected.email],
              ["Telefon", selected.phone || "-"],
              ["Typ", formatCustomerType(selected.customer_type)],
              ["Betreff", selected.subject],
              ["Nachricht", selected.message]
            ]}
          />
        </DetailDialog>
      ) : null}
    </div>
  );
}

function MediaSection({ initialTab }: { initialTab: "items" | "categories" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<MediaCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState<"file_url" | "thumbnail_url" | null>(null);
  const [error, setError] = useState("");
  const emptyCatForm = { name_de: "", name_en: "", sort_order: 0, parent_id: "" };
  const emptyItemForm = {
    title_de: "",
    title_en: "",
    description_de: "",
    description_en: "",
    category_id: "",
    media_type: "image",
    file_url: "",
    video_url: "",
    thumbnail_url: "",
    product_slugs: [] as string[],
    is_published: true,
    sort_order: 0
  };
  const [catForm, setCatForm] = useState(emptyCatForm);
  const [itemForm, setItemForm] = useState(emptyItemForm);

  const loadCategories = useCallback(async () => {
    const { data, error: loadError } = await getSupabaseBrowserClient().from("media_categories").select("*").order("sort_order", { ascending: true });
    if (loadError) setError(loadError.message);
    else setCategories((data || []) as MediaCategory[]);
  }, []);

  const loadItems = useCallback(async () => {
    const { data, error: loadError } = await getSupabaseBrowserClient().from("media_items").select("*").order("sort_order", { ascending: true });
    if (loadError) setError(loadError.message);
    else setItems((data || []) as MediaItem[]);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => Promise.all([loadCategories(), loadItems()]));
  }, [loadCategories, loadItems]);

  const mainCategories = categories.filter((category) => !category.parent_id);
  const getSubcategories = (parentId: string) => categories.filter((category) => category.parent_id === parentId);
  const categoryPath = (id: string | null) => {
    const category = categories.find((entry) => entry.id === id);
    if (!category) return "-";
    if (!category.parent_id) return category.name_de;
    const parent = categories.find((entry) => entry.id === category.parent_id);
    return parent ? `${parent.name_de} → ${category.name_de}` : category.name_de;
  };

  function openCreateCat() {
    setEditingCat(null);
    setCatForm(emptyCatForm);
    setError("");
    setCatDialogOpen(true);
  }

  function openEditCat(category: MediaCategory) {
    setEditingCat(category);
    setCatForm({
      name_de: category.name_de,
      name_en: category.name_en || "",
      sort_order: category.sort_order || 0,
      parent_id: category.parent_id || ""
    });
    setError("");
    setCatDialogOpen(true);
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!catForm.name_de.trim()) {
      setError("Name (DE) ist erforderlich.");
      return;
    }
    const payload = {
      name_de: catForm.name_de.trim(),
      name_en: catForm.name_en.trim(),
      sort_order: Number(catForm.sort_order || 0),
      parent_id: catForm.parent_id || null
    };
    const supabase = getSupabaseBrowserClient();
    const result = editingCat ? await supabase.from("media_categories").update(payload).eq("id", editingCat.id) : await supabase.from("media_categories").insert(payload);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setCatDialogOpen(false);
    await loadCategories();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Kategorie wirklich löschen?")) return;
    const { error: deleteError } = await getSupabaseBrowserClient().from("media_categories").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else await loadCategories();
  }

  function openCreateItem() {
    setEditingItem(null);
    setItemForm(emptyItemForm);
    setError("");
    setItemDialogOpen(true);
  }

  function openEditItem(item: MediaItem) {
    setEditingItem(item);
    setItemForm({
      title_de: item.title_de,
      title_en: item.title_en || "",
      description_de: item.description_de || "",
      description_en: item.description_en || "",
      category_id: item.category_id || "",
      media_type: item.media_type || "image",
      file_url: item.file_url || "",
      video_url: item.video_url || "",
      thumbnail_url: item.thumbnail_url || "",
      product_slugs: item.product_slugs || [],
      is_published: item.is_published,
      sort_order: item.sort_order || 0
    });
    setError("");
    setItemDialogOpen(true);
  }

  async function uploadMediaFile(file: File, field: "file_url" | "thumbnail_url") {
    setUploading(field);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const path = `${Date.now()}-${sanitizedName}`;
    const { error: uploadError } = await getSupabaseBrowserClient().storage.from("media").upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: true
    });
    setUploading(null);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    const { data } = getSupabaseBrowserClient().storage.from("media").getPublicUrl(path);
    setItemForm((previous) => ({ ...previous, [field]: data.publicUrl }));
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!itemForm.title_de.trim()) {
      setError("Titel (DE) ist erforderlich.");
      return;
    }
    const payload = {
      title_de: itemForm.title_de.trim(),
      title_en: itemForm.title_en.trim(),
      description_de: itemForm.description_de.trim() || null,
      description_en: itemForm.description_en.trim() || null,
      category_id: itemForm.category_id || null,
      media_type: itemForm.media_type,
      file_url: itemForm.file_url.trim() || null,
      video_url: itemForm.video_url.trim() || null,
      thumbnail_url: itemForm.thumbnail_url.trim() || null,
      product_slugs: itemForm.product_slugs,
      is_published: itemForm.is_published,
      sort_order: Number(itemForm.sort_order || 0),
      updated_at: new Date().toISOString()
    };
    const supabase = getSupabaseBrowserClient();
    const result = editingItem ? await supabase.from("media_items").update(payload).eq("id", editingItem.id) : await supabase.from("media_items").insert(payload);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setItemDialogOpen(false);
    await loadItems();
  }

  async function deleteItem(id: string) {
    if (!confirm("Medium wirklich löschen?")) return;
    const { error: deleteError } = await getSupabaseBrowserClient().from("media_items").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else await loadItems();
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex h-10 items-center rounded-md bg-muted p-1 text-muted-foreground">
        <button className={cx(buttonClass(activeTab === "items" ? "outline" : "ghost", "sm"), activeTab === "items" && "bg-white text-foreground shadow-sm")} onClick={() => setActiveTab("items")} type="button">
          <ImageIcon className="h-4 w-4" />
          Medien
        </button>
        <button className={cx(buttonClass(activeTab === "categories" ? "outline" : "ghost", "sm"), activeTab === "categories" && "bg-white text-foreground shadow-sm")} onClick={() => setActiveTab("categories")} type="button">
          <FolderOpen className="h-4 w-4" />
          Kategorien
        </button>
      </div>

      {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p> : null}

      {activeTab === "items" ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Medien verwalten</h2>
            <button className={buttonClass("default", "sm")} onClick={openCreateItem} type="button">
              <Plus className="h-4 w-4" />
              Neues Medium
            </button>
          </div>
          <SectionCard>
            <div className="overflow-x-auto">
              <table className={cx(tableClass, "min-w-[900px]")}>
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    {["Vorschau", "Titel (DE)", "Typ", "Kategorie", "Status", "Aktionen"].map((label) => (
                      <th className={tableHeadClass} key={label}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.length ? items.map((item) => (
                    <tr className="border-b border-border/50 hover:bg-secondary/20" key={item.id}>
                      <td className={tableCellClass}>
                        {item.media_type === "image" && item.file_url ? (
                          <img alt={item.title_de} className="h-10 w-10 rounded object-cover" src={item.file_url} />
                        ) : item.media_type === "video" && item.thumbnail_url ? (
                          <img alt={item.title_de} className="h-10 w-10 rounded object-cover" src={item.thumbnail_url} />
                        ) : item.media_type === "video" ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-secondary">
                            <Video className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className={cx(tableCellClass, "font-medium")}>{item.title_de}</td>
                      <td className={tableCellClass}>
                        <span className="inline-flex items-center gap-1 text-xs font-medium">
                          {item.media_type === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                          {item.media_type === "video" ? "Video" : "Bild"}
                        </span>
                      </td>
                      <td className={cx(tableCellClass, "text-xs")}>{categoryPath(item.category_id)}</td>
                      <td className={tableCellClass}><StatusBadge active={item.is_published} /></td>
                      <td className={tableCellClass}>
                        <div className="flex gap-2">
                          <IconButton label="Bearbeiten" onClick={() => openEditItem(item)}><Pencil className="h-4 w-4" /></IconButton>
                          <IconButton destructive label="Löschen" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4" /></IconButton>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td className="p-8 text-center text-muted-foreground" colSpan={6}>Keine Medien vorhanden.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Medien-Kategorien</h2>
            <button className={buttonClass("default", "sm")} onClick={openCreateCat} type="button">
              <Plus className="h-4 w-4" />
              Neue Kategorie
            </button>
          </div>
          <SectionCard>
            <div className="overflow-x-auto">
              <table className={cx(tableClass, "min-w-[900px]")}>
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    {["Name (DE)", "Name (EN)", "Typ", "Medien", "Sortierung", "Aktionen"].map((label) => (
                      <th className={tableHeadClass} key={label}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.length ? mainCategories.map((main) => (
                    <Fragment key={main.id}>
                      <tr className="border-b border-border/50 bg-secondary/10">
                        <td className={cx(tableCellClass, "font-bold")}>{main.name_de}</td>
                        <td className={cx(tableCellClass, "font-medium")}>{main.name_en || "-"}</td>
                        <td className={tableCellClass}><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Hauptkategorie</span></td>
                        <td className={tableCellClass}><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">{items.filter((item) => item.category_id === main.id || getSubcategories(main.id).some((sub) => sub.id === item.category_id)).length}</span></td>
                        <td className={tableCellClass}>{main.sort_order}</td>
                        <td className={tableCellClass}>
                          <div className="flex gap-2">
                            <IconButton label="Bearbeiten" onClick={() => openEditCat(main)}><Pencil className="h-4 w-4" /></IconButton>
                            <IconButton destructive label="Löschen" onClick={() => deleteCategory(main.id)}><Trash2 className="h-4 w-4" /></IconButton>
                          </div>
                        </td>
                      </tr>
                      {getSubcategories(main.id).map((sub) => (
                        <tr className="border-b border-border/50 hover:bg-secondary/20" key={sub.id}>
                          <td className={cx(tableCellClass, "flex items-center gap-1 pl-8 font-medium")}><ChevronRight className="h-3 w-3 text-muted-foreground" />{sub.name_de}</td>
                          <td className={tableCellClass}>{sub.name_en || "-"}</td>
                          <td className={tableCellClass}><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">Unterkategorie</span></td>
                          <td className={cx(tableCellClass, "text-xs font-medium text-muted-foreground")}>{items.filter((item) => item.category_id === sub.id).length}</td>
                          <td className={tableCellClass}>{sub.sort_order}</td>
                          <td className={tableCellClass}>
                            <div className="flex gap-2">
                              <IconButton label="Bearbeiten" onClick={() => openEditCat(sub)}><Pencil className="h-4 w-4" /></IconButton>
                              <IconButton destructive label="Löschen" onClick={() => deleteCategory(sub.id)}><Trash2 className="h-4 w-4" /></IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  )) : (
                    <tr><td className="p-8 text-center text-muted-foreground" colSpan={6}>Keine Kategorien vorhanden.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}

      {catDialogOpen ? (
        <FormDialog title={editingCat ? "Kategorie bearbeiten" : "Neue Kategorie"} onClose={() => setCatDialogOpen(false)}>
          <form className="space-y-4" onSubmit={saveCategory}>
            <SelectField
              label="Übergeordnete Kategorie"
              value={catForm.parent_id}
              onChange={(value) => setCatForm((previous) => ({ ...previous, parent_id: value }))}
              placeholder="Keine (= Hauptkategorie)"
              options={mainCategories.filter((category) => category.id !== editingCat?.id).map((category) => ({ label: category.name_de, value: category.id }))}
            />
            <TextField label="Name (DE)" required value={catForm.name_de} onChange={(value) => setCatForm((previous) => ({ ...previous, name_de: value }))} />
            <TextField label="Name (EN)" value={catForm.name_en} onChange={(value) => setCatForm((previous) => ({ ...previous, name_en: value }))} />
            <TextField label="Sortierung" type="number" value={catForm.sort_order} onChange={(value) => setCatForm((previous) => ({ ...previous, sort_order: Number(value || 0) }))} />
            <div className="flex justify-end gap-3">
              <button className={buttonClass("outline")} onClick={() => setCatDialogOpen(false)} type="button">Abbrechen</button>
              <button className={buttonClass()} type="submit">{editingCat ? "Speichern" : "Erstellen"}</button>
            </div>
          </form>
        </FormDialog>
      ) : null}

      {itemDialogOpen ? (
        <FormDialog title={editingItem ? "Medium bearbeiten" : "Neues Medium"} onClose={() => setItemDialogOpen(false)}>
          <form className="space-y-4" onSubmit={saveItem}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Titel (DE)" required value={itemForm.title_de} onChange={(value) => setItemForm((previous) => ({ ...previous, title_de: value }))} />
              <TextField label="Titel (EN)" value={itemForm.title_en} onChange={(value) => setItemForm((previous) => ({ ...previous, title_en: value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextAreaField label="Beschreibung (DE)" value={itemForm.description_de} onChange={(value) => setItemForm((previous) => ({ ...previous, description_de: value }))} />
              <TextAreaField label="Beschreibung (EN)" value={itemForm.description_en} onChange={(value) => setItemForm((previous) => ({ ...previous, description_en: value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField label="Typ" value={itemForm.media_type} onChange={(value) => setItemForm((previous) => ({ ...previous, media_type: value }))} options={[{ label: "Bild", value: "image" }, { label: "Video", value: "video" }]} />
              <SelectField
                label="Kategorie"
                value={itemForm.category_id}
                onChange={(value) => setItemForm((previous) => ({ ...previous, category_id: value }))}
                placeholder="Keine"
                options={categories.flatMap((category) => category.parent_id ? [{ label: `- ${category.name_de}`, value: category.id }] : [{ label: `${category.name_de} (Gesamt)`, value: category.id }])}
              />
              <TextField label="Sortierung" type="number" value={itemForm.sort_order} onChange={(value) => setItemForm((previous) => ({ ...previous, sort_order: Number(value || 0) }))} />
            </div>
            {itemForm.media_type === "image" ? (
              <label className="grid gap-2">
                <span className={labelClass}>Bild</span>
                <input className={inputClass} value={itemForm.file_url} onChange={(event) => setItemForm((previous) => ({ ...previous, file_url: event.target.value }))} placeholder="URL oder hochladen" />
                <label className={cx(buttonClass("outline", "sm"), "w-fit cursor-pointer")}>
                  <Upload className="h-4 w-4" />{uploading === "file_url" ? "Lädt..." : "Bild hochladen"}
                  <input className="hidden" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && void uploadMediaFile(event.target.files[0], "file_url")} disabled={uploading === "file_url"} />
                </label>
              </label>
            ) : (
              <>
                <TextField label="Wistia Video-URL / Embed-ID" value={itemForm.video_url} onChange={(value) => setItemForm((previous) => ({ ...previous, video_url: value }))} placeholder="z.B. https://fast.wistia.com/embed/medias/abc123 oder abc123" />
                <label className="grid gap-2">
                  <span className={labelClass}>Thumbnail (optional)</span>
                  <input className={inputClass} value={itemForm.thumbnail_url} onChange={(event) => setItemForm((previous) => ({ ...previous, thumbnail_url: event.target.value }))} placeholder="URL oder hochladen" />
                  <label className={cx(buttonClass("outline", "sm"), "w-fit cursor-pointer")}>
                    <Upload className="h-4 w-4" />{uploading === "thumbnail_url" ? "Lädt..." : "Thumbnail hochladen"}
                    <input className="hidden" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && void uploadMediaFile(event.target.files[0], "thumbnail_url")} disabled={uploading === "thumbnail_url"} />
                  </label>
                </label>
              </>
            )}
            <div className="grid gap-2">
              <span className={labelClass}>Produkte zuordnen</span>
              <ProductChipSelector value={itemForm.product_slugs} onChange={(value) => setItemForm((previous) => ({ ...previous, product_slugs: value }))} />
            </div>
            <label className="flex items-center gap-3">
              <SwitchControl checked={itemForm.is_published} onChange={(value) => setItemForm((previous) => ({ ...previous, is_published: value }))} />
              <span className={labelClass}>Veröffentlicht</span>
            </label>
            <div className="flex justify-end gap-3">
              <button className={buttonClass("outline")} onClick={() => setItemDialogOpen(false)} type="button">Abbrechen</button>
              <button className={buttonClass()} type="submit">{editingItem ? "Speichern" : "Erstellen"}</button>
            </div>
          </form>
        </FormDialog>
      ) : null}
    </div>
  );
}

function DownloadsSection() {
  const [downloads, setDownloads] = useState<DownloadEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DownloadEntry | null>(null);
  const [uploading, setUploading] = useState<"de" | "en" | null>(null);
  const [error, setError] = useState("");
  const emptyForm = {
    title_de: "",
    title_en: "",
    description_de: "",
    description_en: "",
    category: "Datenblatt",
    file_url_de: "",
    file_url_en: "",
    product_slugs: [] as string[],
    is_published: true,
    sort_order: 0
  };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    const { data, error: loadError } = await getSupabaseBrowserClient().from("downloads").select("*").order("sort_order", { ascending: true });
    if (loadError) setError(loadError.message);
    else setDownloads((data || []) as DownloadEntry[]);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function openEdit(download: DownloadEntry) {
    setEditing(download);
    setForm({
      title_de: download.title_de,
      title_en: download.title_en || "",
      description_de: download.description_de || "",
      description_en: download.description_en || "",
      category: download.category || "Datenblatt",
      file_url_de: download.file_url_de || "",
      file_url_en: download.file_url_en || "",
      product_slugs: download.product_slugs || [],
      is_published: download.is_published,
      sort_order: download.sort_order || 0
    });
    setError("");
    setDialogOpen(true);
  }

  async function uploadDownloadFile(file: File, lang: "de" | "en") {
    setUploading(lang);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const path = `${lang}/${Date.now()}-${sanitizedName}`;
    const { error: uploadError } = await getSupabaseBrowserClient().storage.from("downloads").upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: true
    });
    setUploading(null);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    const { data } = getSupabaseBrowserClient().storage.from("downloads").getPublicUrl(path);
    setForm((previous) => ({ ...previous, [lang === "de" ? "file_url_de" : "file_url_en"]: data.publicUrl }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title_de.trim()) {
      setError("Titel (DE) ist erforderlich.");
      return;
    }
    const payload = {
      title_de: form.title_de.trim(),
      title_en: form.title_en.trim(),
      description_de: form.description_de.trim() || null,
      description_en: form.description_en.trim() || null,
      category: form.category,
      file_url_de: form.file_url_de.trim() || null,
      file_url_en: form.file_url_en.trim() || null,
      product_slugs: form.product_slugs,
      is_published: form.is_published,
      sort_order: Number(form.sort_order || 0),
      updated_at: new Date().toISOString()
    };
    const supabase = getSupabaseBrowserClient();
    const result = editing ? await supabase.from("downloads").update(payload).eq("id", editing.id) : await supabase.from("downloads").insert(payload);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setDialogOpen(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Download wirklich löschen?")) return;
    const { error: deleteError } = await getSupabaseBrowserClient().from("downloads").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Downloads verwalten</h2>
        <button className={buttonClass("default", "sm")} onClick={openCreate} type="button">
          <Plus className="h-4 w-4" />
          Neuer Download
        </button>
      </div>
      {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p> : null}
      <SectionCard>
        <div className="overflow-x-auto">
          <table className={cx(tableClass, "min-w-[980px]")}>
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                {["Titel (DE)", "Kategorie", "Produkte", "DE", "EN", "Status", "Aktionen"].map((label) => (
                  <th className={tableHeadClass} key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {downloads.length ? downloads.map((download) => (
                <tr className="border-b border-border/50 hover:bg-secondary/20" key={download.id}>
                  <td className={cx(tableCellClass, "font-medium")}>{download.title_de}</td>
                  <td className={tableCellClass}>{download.category}</td>
                  <td className={cx(tableCellClass, "max-w-[260px]")}>
                    <div className="flex flex-wrap gap-1">
                      {(download.product_slugs || []).map((slug) => (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary" key={slug} title={productLabel(slug)}>{slug}</span>
                      ))}
                    </div>
                  </td>
                  <td className={tableCellClass}>{download.file_url_de ? <Check className="h-4 w-4" /> : "-"}</td>
                  <td className={tableCellClass}>{download.file_url_en ? <Check className="h-4 w-4" /> : "-"}</td>
                  <td className={tableCellClass}><StatusBadge active={download.is_published} /></td>
                  <td className={tableCellClass}>
                    <div className="flex gap-2">
                      <IconButton label="Bearbeiten" onClick={() => openEdit(download)}><Pencil className="h-4 w-4" /></IconButton>
                      <IconButton destructive label="Löschen" onClick={() => remove(download.id)}><Trash2 className="h-4 w-4" /></IconButton>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="p-8 text-center text-muted-foreground" colSpan={7}>Keine Downloads vorhanden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {dialogOpen ? (
        <FormDialog title={editing ? "Download bearbeiten" : "Neuer Download"} onClose={() => setDialogOpen(false)}>
          <form className="space-y-4" onSubmit={save}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Titel (DE)" required value={form.title_de} onChange={(value) => setForm((previous) => ({ ...previous, title_de: value }))} />
              <TextField label="Titel (EN)" value={form.title_en} onChange={(value) => setForm((previous) => ({ ...previous, title_en: value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextAreaField label="Beschreibung (DE)" value={form.description_de} onChange={(value) => setForm((previous) => ({ ...previous, description_de: value }))} />
              <TextAreaField label="Beschreibung (EN)" value={form.description_en} onChange={(value) => setForm((previous) => ({ ...previous, description_en: value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Kategorie" value={form.category} onChange={(value) => setForm((previous) => ({ ...previous, category: value }))} options={categoryOptions} />
              <TextField label="Sortierung" type="number" value={form.sort_order} onChange={(value) => setForm((previous) => ({ ...previous, sort_order: Number(value || 0) }))} />
            </div>
            <p className="text-sm text-muted-foreground">Tipp: Nur Dateien für die jeweilige Sprache hinterlegen. Downloads ohne DE-Datei werden auf der deutschen Seite nicht angezeigt (und umgekehrt).</p>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className={labelClass}>Datei (DE)</span>
                <input className={inputClass} value={form.file_url_de} onChange={(event) => setForm((previous) => ({ ...previous, file_url_de: event.target.value }))} placeholder="URL oder hochladen" />
                <label className={cx(buttonClass("outline", "sm"), "w-fit cursor-pointer")}>
                  <Upload className="h-4 w-4" />{uploading === "de" ? "Lädt..." : "Datei hochladen"}
                  <input className="hidden" type="file" onChange={(event) => event.target.files?.[0] && void uploadDownloadFile(event.target.files[0], "de")} disabled={uploading === "de"} />
                </label>
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>Datei (EN)</span>
                <input className={inputClass} value={form.file_url_en} onChange={(event) => setForm((previous) => ({ ...previous, file_url_en: event.target.value }))} placeholder="URL oder hochladen" />
                <label className={cx(buttonClass("outline", "sm"), "w-fit cursor-pointer")}>
                  <Upload className="h-4 w-4" />{uploading === "en" ? "Lädt..." : "Datei hochladen"}
                  <input className="hidden" type="file" onChange={(event) => event.target.files?.[0] && void uploadDownloadFile(event.target.files[0], "en")} disabled={uploading === "en"} />
                </label>
              </label>
            </div>
            <div className="grid gap-2">
              <span className={labelClass}>Produkte zuordnen</span>
              <ProductChipSelector value={form.product_slugs} onChange={(value) => setForm((previous) => ({ ...previous, product_slugs: value }))} />
            </div>
            <label className="flex items-center gap-3">
              <SwitchControl checked={form.is_published} onChange={(value) => setForm((previous) => ({ ...previous, is_published: value }))} />
              <span className={labelClass}>Veröffentlicht</span>
            </label>
            <div className="flex justify-end gap-3">
              <button className={buttonClass("outline")} onClick={() => setDialogOpen(false)} type="button">Abbrechen</button>
              <button className={buttonClass()} type="submit">{editing ? "Speichern" : "Erstellen"}</button>
            </div>
          </form>
        </FormDialog>
      ) : null}
    </div>
  );
}

function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");
  const emptyForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    author_id: "",
    tags: "",
    cover_image_url: "",
    is_published: false,
    is_featured: false,
    language: "de",
    translation_group_id: ""
  };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const [{ data: postData, error: postError }, { data: authorData }, { data: topicData }] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_authors").select("*").order("is_default", { ascending: false }).order("name", { ascending: true }),
      supabase.from("blog_topics").select("id, topic, description, used_at, used_in_post_id").order("created_at", { ascending: false })
    ]);
    if (postError) setError(postError.message);
    else setPosts((postData || []) as BlogPost[]);
    setAuthors((authorData || []) as BlogAuthor[]);
    setTopics((topicData || []) as BlogTopic[]);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  function defaultAuthor() {
    return authors.find((author) => author.is_default) || authors[0];
  }

  function authorForPost(post: BlogPost) {
    const author = authors.find((entry) => entry.id === post.author_id) || authors.find((entry) => entry.name === post.author);
    const fallbackProfile = getBlogAuthorProfile(post.author);
    return {
      name: author?.name || post.author || fallbackProfile?.name || "Strong Energy",
      avatar: author?.avatar_url || fallbackProfile?.avatar || null
    };
  }

  function translationCandidates(language = form.language) {
    const targetLanguage = language === "en" ? "de" : "en";
    return posts.filter((post) => post.id !== editing?.id && (post.language || "de") === targetLanguage);
  }

  function selectedTranslationValue() {
    const candidates = translationCandidates();
    return candidates.some((post) => (post.translation_group_id || post.id) === form.translation_group_id) ? form.translation_group_id : "";
  }

  function updateLanguage(language: string) {
    setForm((previous) => {
      const stillValid = posts.some((post) => post.id !== editing?.id && (post.language || "de") !== language && (post.translation_group_id || post.id) === previous.translation_group_id);
      return { ...previous, language, translation_group_id: stillValid ? previous.translation_group_id : crypto.randomUUID() };
    });
  }

  function openCreate() {
    const author = defaultAuthor();
    setEditing(null);
    setForm({ ...emptyForm, author: author?.name || "", author_id: author?.id || "", translation_group_id: crypto.randomUUID() });
    setError("");
    setDialogOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "",
      author: post.author || "",
      author_id: post.author_id || "",
      tags: post.tags?.join(", ") || "",
      cover_image_url: post.cover_image_url || "",
      is_published: post.is_published,
      is_featured: post.is_featured,
      language: post.language || "de",
      translation_group_id: post.translation_group_id || crypto.randomUUID()
    });
    setError("");
    setDialogOpen(true);
  }

  function calculateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError("Titel, Slug und Inhalt sind erforderlich.");
      return;
    }
    const payload: Record<string, string | boolean | number | string[] | null> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      category: form.category || null,
      author: form.author || null,
      author_id: form.author_id || null,
      tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : null,
      cover_image_url: form.cover_image_url.trim() || null,
      is_published: form.is_published,
      is_featured: form.is_featured,
      published_at: form.is_published && !editing?.published_at ? new Date().toISOString() : editing?.published_at || null,
      reading_time_minutes: calculateReadingTime(form.content),
      language: form.language,
      updated_at: new Date().toISOString()
    };
    if (form.translation_group_id) payload.translation_group_id = form.translation_group_id;
    const supabase = getSupabaseBrowserClient();
    const result = editing ? await supabase.from("blog_posts").update(payload).eq("id", editing.id) : await supabase.from("blog_posts").insert(payload);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setDialogOpen(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Beitrag wirklich löschen?")) return;
    const { error: deleteError } = await getSupabaseBrowserClient().from("blog_posts").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else await load();
  }

  function languageLabel(language: string | null | undefined) {
    return language === "en" ? "EN" : "DE";
  }

  function languagePath(post: BlogPost) {
    return `/${post.language === "en" ? "en" : "de"}/blog/${post.slug}`;
  }

  function pairedLanguages(post: BlogPost) {
    if (!post.translation_group_id) return [post.language || "de"];
    return Array.from(new Set(posts.filter((entry) => entry.translation_group_id === post.translation_group_id).map((entry) => entry.language || "de"))).sort();
  }

  async function saveGeneratedPosts(data: GeneratedBlogResponse) {
    setError("");
    const author = authors.find((entry) => entry.id === (data.postDe.author_id || data.postEn.author_id)) || defaultAuthor();
    const now = new Date().toISOString();
    const rows = [data.postDe, data.postEn].map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author || author?.name || null,
      author_id: post.author_id || author?.id || null,
      tags: post.tags,
      cover_image_url: post.cover_image_url || null,
      is_published: post.is_published || false,
      is_featured: post.is_featured || false,
      published_at: post.published_at || null,
      scheduled_at: post.scheduled_at || null,
      reading_time_minutes: post.reading_time_minutes || calculateReadingTime(post.content),
      language: post.language,
      translation_group_id: post.translation_group_id,
      updated_at: now
    }));

    const supabase = getSupabaseBrowserClient();
    const { data: inserted, error: insertError } = await supabase.from("blog_posts").insert(rows).select("id, slug, language");
    if (insertError) {
      setError(insertError.message);
      throw insertError;
    }

    if (data.topicId) {
      const dePost = inserted?.find((post) => post.language === "de") || inserted?.[0];
      const { error: topicError } = await supabase
        .from("blog_topics")
        .update({ used_at: now, used_in_post_id: dePost?.id || null, updated_at: now })
        .eq("id", data.topicId);
      if (topicError) {
        setError(topicError.message);
        throw topicError;
      }
    }

    setAiDialogOpen(false);
    await load();
  }

  return (
    <SectionCard className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Blog-Beiträge</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Verwalte Blog-Beiträge für die öffentliche Seite</p>
        </div>
        <div className="flex gap-2">
          <button className={buttonClass("outline")} onClick={() => setAiDialogOpen(true)} type="button">
            <Sparkles className="h-4 w-4" />
            KI-Generator
          </button>
          <button className={buttonClass()} onClick={openCreate} type="button">
            <Plus className="h-4 w-4" />
            Neuer Beitrag
          </button>
        </div>
      </div>
      {error ? <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className={cx(tableClass, "min-w-[1120px]")}>
          <thead>
            <tr className="border-b border-border">
              {["Titel", "Sprachen", "Autor", "Kategorie", "Status", "Featured", "Erstellt", "Aktionen"].map((label) => (
                <th className={cx(tableHeadClass, label === "Aktionen" && "text-right")} key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.length ? posts.map((post) => {
              const postAuthor = authorForPost(post);
              return (
                <tr className="border-b border-border" key={post.id}>
                  <td className={tableCellClass}>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">{languagePath(post)}</p>
                  </td>
                  <td className={tableCellClass}>
                    <div className="flex flex-wrap gap-1.5">
                      {["de", "en"].map((language) => {
                        const active = pairedLanguages(post).includes(language);
                        return (
                          <span className={cx("rounded-full border px-2 py-0.5 text-[11px] font-bold", active ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground")} key={language}>
                            {language.toUpperCase()}
                          </span>
                        );
                      })}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">aktuell: {languageLabel(post.language)}</p>
                  </td>
                  <td className={tableCellClass}>
                    <AuthorAvatarPreview name={postAuthor.name} src={postAuthor.avatar} showName />
                  </td>
                  <td className={tableCellClass}>
                    {post.category ? <span className={cx("rounded-full border px-2.5 py-1 text-xs font-semibold", blogCategoryColors[post.category] || "border-border bg-secondary text-foreground")}>{post.category}</span> : "-"}
                  </td>
                  <td className={tableCellClass}>{post.is_published ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}</td>
                  <td className={tableCellClass}><Star className={cx("h-4 w-4", post.is_featured ? "fill-amber-500 text-amber-500" : "text-muted-foreground")} /></td>
                  <td className={tableCellClass}><span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3 w-3" />{formatDate(post.created_at)}</span></td>
                  <td className={cx(tableCellClass, "text-right")}>
                    <div className="flex justify-end gap-1">
                      <IconButton label="Bearbeiten" onClick={() => openEdit(post)}><Pencil className="h-4 w-4" /></IconButton>
                      <IconButton destructive label="Löschen" onClick={() => remove(post.id)}><Trash2 className="h-4 w-4" /></IconButton>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr><td className="p-8 text-center text-muted-foreground" colSpan={8}>Noch keine Blog-Beiträge vorhanden.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {dialogOpen ? (
        <FormDialog title={editing ? "Beitrag bearbeiten" : "Neuer Beitrag"} onClose={() => setDialogOpen(false)}>
          <form className="space-y-4" onSubmit={save}>
            <p className="text-sm text-muted-foreground">{editing ? "Bearbeite den Blog-Beitrag." : "Erstelle einen neuen Blog-Beitrag."}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Titel" required value={form.title} onChange={(value) => setForm((previous) => ({ ...previous, title: value, slug: previous.slug || slugify(value) }))} placeholder="Beitragstitel" />
              <TextField label="Slug" required value={form.slug} onChange={(value) => setForm((previous) => ({ ...previous, slug: value }))} placeholder="url-freundlicher-slug" />
            </div>
            <TextAreaField label="Kurzbeschreibung" value={form.excerpt} onChange={(value) => setForm((previous) => ({ ...previous, excerpt: value }))} placeholder="Kurze Zusammenfassung für die Vorschau..." rows={2} />
            <TextAreaField label="Inhalt (Markdown)" value={form.content} onChange={(value) => setForm((previous) => ({ ...previous, content: value }))} placeholder={"# Überschrift\n\nDein Inhalt hier...\n\n- Listenpunkt 1\n- Listenpunkt 2"} rows={12} mono />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Kategorie" value={form.category} onChange={(value) => setForm((previous) => ({ ...previous, category: value }))} placeholder="Kategorie wählen" options={blogCategoryOptions.map((value) => ({ label: value, value }))} />
              <SelectField label="Sprache" value={form.language} onChange={updateLanguage} options={blogLanguageOptions} />
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Sprachversion
              <select
                className={inputClass}
                value={selectedTranslationValue()}
                onChange={(event) => setForm((previous) => ({ ...previous, translation_group_id: event.target.value || crypto.randomUUID() }))}
              >
                <option value="">Eigenständiger Beitrag / neues Übersetzungspaar</option>
                {translationCandidates().map((post) => (
                  <option key={post.id} value={post.translation_group_id || post.id}>
                    Als Übersetzung von {languageLabel(post.language)}: {post.title}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal leading-5 text-muted-foreground">
                Verknüpft deutsche und englische Versionen miteinander. Für einen neuen einzelnen Beitrag einfach auf „Eigenständiger Beitrag“ lassen.
              </span>
            </label>
            <SelectField
              label="Autor"
              value={form.author_id}
              onChange={(value) => {
                const author = authors.find((entry) => entry.id === value);
                setForm((previous) => ({ ...previous, author_id: value, author: author?.name || "" }));
              }}
              placeholder="Autor wählen"
              options={authors.map((author) => ({ label: `${author.name}${author.is_default ? " (Standard)" : ""}`, value: author.id }))}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Tags (kommagetrennt)" value={form.tags} onChange={(value) => setForm((previous) => ({ ...previous, tags: value }))} placeholder="Solar, Energie, Tipps" />
              <TextField label="Titelbild URL" value={form.cover_image_url} onChange={(value) => setForm((previous) => ({ ...previous, cover_image_url: value }))} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2"><SwitchControl checked={form.is_published} onChange={(value) => setForm((previous) => ({ ...previous, is_published: value }))} /><span className={labelClass}>Veröffentlichen</span></label>
              <label className="flex items-center gap-2"><SwitchControl checked={form.is_featured} onChange={(value) => setForm((previous) => ({ ...previous, is_featured: value }))} /><span className={labelClass}>Hervorgehoben</span></label>
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button className={buttonClass("outline")} onClick={() => setDialogOpen(false)} type="button">Abbrechen</button>
              <button className={buttonClass()} disabled={!form.title || !form.slug || !form.content} type="submit">{editing ? "Speichern" : "Erstellen"}</button>
            </div>
          </form>
        </FormDialog>
      ) : null}

      {aiDialogOpen ? (
        <BlogAIGeneratorDialog
          authors={authors}
          categories={blogGeneratorCategoryOptions}
          onClose={() => setAiDialogOpen(false)}
          onGenerated={saveGeneratedPosts}
          topics={topics}
        />
      ) : null}
    </SectionCard>
  );
}

function BlogAIGeneratorDialog({
  authors,
  categories,
  onClose,
  onGenerated,
  topics
}: {
  authors: BlogAuthor[];
  categories: string[];
  onClose: () => void;
  onGenerated: (data: GeneratedBlogResponse) => Promise<void>;
  topics: BlogTopic[];
}) {
  const [topicMode, setTopicMode] = useState<"manual" | "list">("manual");
  const [topic, setTopic] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [category, setCategory] = useState("Neuigkeiten");
  const [authorId, setAuthorId] = useState(authors.find((author) => author.is_default)?.id || authors[0]?.id || "");
  const [generating, setGenerating] = useState(false);
  const [localError, setLocalError] = useState("");
  const unusedTopics = topics.filter((entry) => !entry.used_at);
  const selectedTopic = unusedTopics.find((entry) => entry.id === selectedTopicId);
  const effectiveTopic = topicMode === "list" ? selectedTopic?.topic || "" : topic;

  async function generate() {
    if (!effectiveTopic.trim()) {
      setLocalError("Bitte gib ein Thema ein oder wähle eines aus der Themenliste.");
      return;
    }

    setGenerating(true);
    setLocalError("");

    const { data, error } = await getSupabaseBrowserClient().functions.invoke<GeneratedBlogResponse | { error: string }>("generate-blog-post", {
      body: {
        topic: effectiveTopic.trim(),
        category,
        topicId: topicMode === "list" ? selectedTopicId : null,
        authorId: authorId || null
      }
    });

    if (error) {
      setLocalError(error.message || "Die Generierung ist fehlgeschlagen.");
      setGenerating(false);
      return;
    }

    if (!data || "error" in data) {
      setLocalError(data?.error || "Die Generierung ist fehlgeschlagen.");
      setGenerating(false);
      return;
    }

    try {
      await onGenerated(data);
    } catch {
      setGenerating(false);
      return;
    }
  }

  return (
    <FormDialog title="KI-Blog-Generator" onClose={generating ? () => undefined : onClose}>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">Generiert automatisch einen Beitrag auf Deutsch und Englisch als zusammengehöriges Übersetzungspaar.</p>

        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
            <input checked={topicMode === "manual"} className="h-4 w-4 accent-[hsl(var(--primary))]" name="topicMode" onChange={() => setTopicMode("manual")} type="radio" />
            Eigenes Thema
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
            <input checked={topicMode === "list"} className="h-4 w-4 accent-[hsl(var(--primary))]" name="topicMode" onChange={() => setTopicMode("list")} type="radio" />
            <Lightbulb className="h-4 w-4" />
            Aus Themenliste
            {unusedTopics.length ? <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{unusedTopics.length}</span> : null}
          </label>
        </div>

        {topicMode === "manual" ? (
          <TextField label="Thema" required value={topic} onChange={setTopic} placeholder="z.B. Warum sich ein Batteriespeicher 2026 lohnt" />
        ) : (
          <div className="grid gap-2">
            <span className={labelClass}>Thema aus Liste *</span>
            {unusedTopics.length ? (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
                {unusedTopics.map((entry) => (
                  <label className={cx("flex cursor-pointer items-start gap-3 border-b border-border p-3 transition-colors last:border-b-0 hover:bg-secondary/60", selectedTopicId === entry.id && "bg-primary/10")} key={entry.id}>
                    <input checked={selectedTopicId === entry.id} className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" name="selectedTopic" onChange={() => setSelectedTopicId(entry.id)} type="radio" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{entry.topic}</span>
                      {entry.description ? <span className="mt-1 block truncate text-xs text-muted-foreground">{entry.description}</span> : null}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-secondary/40 p-5 text-center text-sm text-muted-foreground">
                <Lightbulb className="mx-auto mb-2 h-7 w-7 opacity-50" />
                Keine offenen Themen vorhanden. Lege zuerst ein Blog-Thema an oder nutze ein eigenes Thema.
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Kategorie" value={category} onChange={setCategory} options={categories.map((value) => ({ label: value, value }))} />
          <SelectField
            label="Autor"
            value={authorId}
            onChange={setAuthorId}
            options={authors.map((author) => ({ label: `${author.name}${author.is_default ? " (Standard)" : ""}`, value: author.id }))}
            placeholder="Autor wählen"
          />
        </div>

        {localError ? <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{localError}</p> : null}

        <div className="rounded-lg border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">LLM-Anbindung:</strong> Die Generierung läuft serverseitig über die Supabase Function <code className="rounded bg-white px-1">generate-blog-post</code>. Dafür muss ein Secret wie <code className="rounded bg-white px-1">LLM_API_KEY</code> gesetzt sein.
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <button className={buttonClass("outline")} disabled={generating} onClick={onClose} type="button">Abbrechen</button>
          <button className={buttonClass()} disabled={generating || !effectiveTopic.trim()} onClick={generate} type="button">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Generiere..." : "Generieren"}
          </button>
        </div>
      </div>
    </FormDialog>
  );
}

function ProductCategoriesSection() {
  const [rows, setRows] = useState<Array<{ slug: string; label_de: string; label_en: string; is_visible: boolean; sort_order: number }>>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error: loadError } = await getSupabaseBrowserClient().from("product_categories").select("*").order("sort_order", { ascending: true });
    if (loadError) setError(loadError.message);
    else setRows((data || []) as Array<{ slug: string; label_de: string; label_en: string; is_visible: boolean; sort_order: number }>);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function toggle(row: { slug: string; is_visible: boolean }) {
    const { error: updateError } = await getSupabaseBrowserClient().from("product_categories").update({ is_visible: !row.is_visible }).eq("slug", row.slug);
    if (updateError) setError(updateError.message);
    else await load();
  }

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p> : null}
      <SectionCard>
        <table className={tableClass}>
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              <th className={tableHeadClass}>Kategorie (DE)</th>
              <th className={tableHeadClass}>Kategorie (EN)</th>
              <th className={tableHeadClass}>Sichtbar</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row) => (
              <tr className="border-b border-border/50" key={row.slug}>
                <td className={cx(tableCellClass, "font-medium")}>{row.label_de}</td>
                <td className={cx(tableCellClass, "text-muted-foreground")}>{row.label_en}</td>
                <td className={tableCellClass}><SwitchControl checked={row.is_visible} onChange={() => toggle(row)} /></td>
              </tr>
            )) : (
              <tr><td className="p-8 text-center text-muted-foreground" colSpan={3}>Keine Produktkategorien vorhanden.</td></tr>
            )}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

function CrudSection({
  title,
  table,
  primaryKey,
  order,
  columns,
  fields,
  defaults,
  extraAction
}: {
  title: string;
  table: string;
  primaryKey: string;
  order: { column: string; ascending: boolean };
  columns: Array<{ key: string; label: string; render?: (row: Record<string, CrudValue>) => ReactNode }>;
  fields: FieldConfig[];
  defaults: CrudRecord;
  extraAction?: ReactNode;
}) {
  const [rows, setRows] = useState<Array<Record<string, CrudValue>>>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, CrudValue> | null>(null);
  const [form, setForm] = useState<CrudRecord>(defaults);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await getSupabaseBrowserClient().from(table).select("*").order(order.column, { ascending: order.ascending });
    if (!loadError) setRows((data || []) as Array<Record<string, CrudValue>>);
    else setError(loadError.message);
    setLoading(false);
  }, [order.ascending, order.column, table]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(defaults);
    setError("");
    setDialogOpen(true);
  }

  function openEdit(row: Record<string, CrudValue>) {
    setEditing(row);
    setForm({ ...defaults, ...row });
    setError("");
    setDialogOpen(true);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const payload = cleanPayload(form, fields);
    if (fields.some((field) => field.required && !payload[field.key])) {
      setError("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const hasUpdatedAtColumn = Boolean(editing && Object.prototype.hasOwnProperty.call(editing, "updated_at"));
    const payloadWithTimestamp = hasUpdatedAtColumn ? { ...payload, updated_at: new Date().toISOString() } : payload;
    const result = editing
      ? await supabase.from(table).update(payloadWithTimestamp).eq(primaryKey, editing[primaryKey] as string)
      : await supabase.from(table).insert(payloadWithTimestamp);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setDialogOpen(false);
    load();
  }

  async function remove(row: Record<string, CrudValue>) {
    if (!confirm(`Eintrag wirklich löschen?`)) return;
    const result = await getSupabaseBrowserClient().from(table).delete().eq(primaryKey, row[primaryKey] as string);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    load();
  }

  return (
    <div className="space-y-4">
      <SectionToolbar title={`${title} (${rows.length})`} loading={loading} onRefresh={load}>
        {extraAction}
        <button className={buttonClass("default", "sm")} onClick={openCreate} type="button">
          <Plus className="h-3.5 w-3.5" />
          {createLabelFor(title)}
        </button>
      </SectionToolbar>
      {error ? <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p> : null}
      <SectionCard>
        <div className="overflow-x-auto">
          <table className={cx(tableClass, "min-w-[900px]")}>
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                {columns.map((column) => (
                  <th className={tableHeadClass} key={column.key}>{column.label}</th>
                ))}
                <th className={cx(tableHeadClass, "text-right")}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((row, index) => (
                <tr className="border-b border-border/50 transition-colors hover:bg-secondary/30" key={String(row[primaryKey] || index)}>
                  {columns.map((column) => (
                    <td className={cx(tableCellClass, "max-w-sm truncate")} key={column.key}>{column.render ? column.render(row) : valueToInput(row[column.key]) || "-"}</td>
                  ))}
                  <td className={cx(tableCellClass, "text-right")}>
                    <div className="flex justify-end gap-1">
                      <button className="rounded-md p-1.5 text-foreground transition-colors hover:bg-secondary" onClick={() => openEdit(row)} type="button" aria-label="Bearbeiten">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10" onClick={() => remove(row)} type="button" aria-label="Löschen">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="p-7 text-center text-muted-foreground" colSpan={columns.length + 1}>{loading ? "Daten werden geladen..." : "Keine Einträge vorhanden."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {dialogOpen ? (
        <FormDialog title={dialogTitleFor(title, Boolean(editing))} onClose={() => setDialogOpen(false)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <AdminField key={field.key} field={field} value={form[field.key]} onChange={(value) => setForm((previous) => ({ ...previous, [field.key]: value }))} />
              ))}
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button className={buttonClass("outline")} onClick={() => setDialogOpen(false)} type="button">
                Abbrechen
              </button>
              <button className={buttonClass()} type="submit">
                <Save className="h-3.5 w-3.5" />
                Speichern
              </button>
            </div>
          </form>
        </FormDialog>
      ) : null}
    </div>
  );
}

function AdminField({ field, value, onChange }: { field: FieldConfig; value: CrudValue; onChange: (value: CrudValue) => void }) {
  const [uploading, setUploading] = useState(false);
  const baseClass = inputClass;
  const localTextareaClass = textareaClass;

  async function uploadFile(file: File) {
    setUploading(true);
    const bucket = field.key.includes("file_url_de") || field.key.includes("file_url_en") ? "downloads" : field.key.includes("avatar") ? "blog-authors" : "media";
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const path = `${Date.now()}-${sanitizedName}`;
    const { error } = await getSupabaseBrowserClient().storage.from(bucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: true
    });
    setUploading(false);
    if (error) {
      onChange(valueToInput(value));
      alert(error.message);
      return;
    }
    const { data } = getSupabaseBrowserClient().storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-10 items-center gap-3 text-sm font-medium text-foreground">
        <button
          className={cx("relative h-6 w-11 rounded-full transition-colors", Boolean(value) ? "bg-primary" : "bg-muted")}
          onClick={() => onChange(!Boolean(value))}
          type="button"
          aria-pressed={Boolean(value)}
        >
          <span className={cx("absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform", Boolean(value) && "translate-x-5")} />
        </button>
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "array" && field.key === "product_slugs") {
    const selected = Array.isArray(value) ? value : valueToInput(value).split(",").map((item) => item.trim()).filter(Boolean);
    return (
      <label className="grid gap-2 text-sm font-medium text-foreground md:col-span-2">
        {field.label}
        <div className="flex min-h-10 flex-wrap gap-2 rounded-lg border border-input bg-background p-3">
          {productOptions.map((option) => {
            const active = selected.includes(option.value);
            return (
              <button
                className={cx("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", active ? "bg-primary text-white" : "bg-secondary text-foreground hover:bg-muted")}
                key={option.value}
                onClick={() => onChange(active ? selected.filter((item) => item !== option.value) : [...selected, option.value])}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </label>
    );
  }

  const uploadable = ["file_url", "thumbnail_url", "avatar_url", "cover_image_url"].some((key) => field.key.includes(key));
  const textareaRows = field.key === "content" ? 14 : field.key === "excerpt" || field.key.includes("description") ? 3 : 5;

  return (
    <label className={cx("grid gap-2 text-sm font-medium text-foreground", (field.type === "textarea" || field.type === "array" || uploadable) && "md:col-span-2")}>
      {field.label}{field.required ? " *" : ""}
      {field.type === "textarea" ? (
        <textarea className={cx(localTextareaClass, field.key === "content" && "font-mono")} rows={textareaRows} value={valueToInput(value)} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} required={field.required} />
      ) : field.type === "select" ? (
        <select className={baseClass} value={valueToInput(value)} onChange={(event) => onChange(event.target.value)} required={field.required}>
          <option value="">Bitte wählen</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : field.type === "array" ? (
        <>
          <input className={baseClass} value={valueToInput(value)} onChange={(event) => onChange(event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder={field.placeholder || "Kommagetrennt"} />
          {field.key === "product_slugs" ? <small className="text-xs font-normal text-muted-foreground">Verfügbare Produkte: {productOptions.map((option) => option.value).join(", ")}</small> : null}
        </>
      ) : uploadable ? (
        <div className="grid gap-2">
          <input className={baseClass} type="text" value={valueToInput(value)} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || "URL oder hochladen"} required={field.required} />
          <label className="inline-flex h-9 w-fit cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-medium transition-colors hover:bg-secondary">
            <Upload className="h-4 w-4" />
            {uploading ? "Lädt..." : field.label.toLowerCase().includes("bild") || field.key.includes("image") || field.key.includes("avatar") || field.key.includes("cover") ? "Bild hochladen" : "Datei hochladen"}
            <input className="hidden" type="file" onChange={(event) => event.target.files?.[0] && void uploadFile(event.target.files[0])} disabled={uploading} />
          </label>
        </div>
      ) : (
        <input className={baseClass} type={field.type === "number" ? "number" : field.type === "date" ? "datetime-local" : "text"} value={valueToInput(value)} onChange={(event) => onChange(field.type === "number" ? Number(event.target.value) : event.target.value)} placeholder={field.placeholder} required={field.required} />
      )}
    </label>
  );
}

function UsersSection() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: fnError } = await getSupabaseBrowserClient().functions.invoke("manage-users", { body: { action: "list" } });
    if (fnError || data?.error) {
      setError(await functionErrorMessage(data, fnError, "Die Edge Function manage-users ist nicht erreichbar."));
      setUsers([]);
    } else {
      setUsers(data?.users || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  function openCreateDialog() {
    setEmail("");
    setPassword("");
    setError("");
    setCreateDialogOpen(true);
  }

  function closeCreateDialog() {
    setCreateDialogOpen(false);
    setEmail("");
    setPassword("");
    setCreating(false);
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError("");
    const { data, error: fnError } = await getSupabaseBrowserClient().functions.invoke("manage-users", {
      body: { action: "create", email: email.trim(), password, role: "admin" }
    });
    if (fnError || data?.error) {
      setError(await functionErrorMessage(data, fnError, "Nutzer konnte nicht erstellt werden."));
      setCreating(false);
      return;
    }
    setEmail("");
    setPassword("");
    setCreating(false);
    setCreateDialogOpen(false);
    void load();
  }

  async function deleteUser(user: UserEntry) {
    if (!confirm(`Nutzer ${user.email} wirklich löschen?`)) return;
    const { data, error: fnError } = await getSupabaseBrowserClient().functions.invoke("manage-users", { body: { action: "delete", userId: user.id } });
    if (fnError || data?.error) {
      setError(await functionErrorMessage(data, fnError, "Nutzer konnte nicht gelöscht werden."));
      return;
    }
    void load();
  }

  return (
    <div className="space-y-4">
      <SectionToolbar title={`Nutzer (${users.length})`} loading={loading} onRefresh={load}>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90" onClick={openCreateDialog} type="button">
          <Plus className="h-3.5 w-3.5" />
          Neuer Nutzer
        </button>
      </SectionToolbar>

      {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p> : null}

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-[13px]">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              {["E-Mail", "Erstellt", "Letzter Login", "Rolle", "Aktionen"].map((label) => (
                <th className="px-4 py-3 text-left font-bold" key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length ? users.map((user) => (
              <tr className="border-b border-border/50" key={user.id}>
                <td className="px-4 py-3 font-semibold">{user.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(user.created_at)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(user.last_sign_in_at)}</td>
                <td className="px-4 py-3">{user.role || "-"}</td>
                <td className="px-4 py-3">
                  <button className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" onClick={() => deleteUser(user)} type="button">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td className="p-7 text-center text-muted-foreground" colSpan={5}>{loading ? "Lade Nutzer..." : "Keine Nutzer geladen."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {createDialogOpen ? (
        <FormDialog title="Neuer Nutzer" onClose={closeCreateDialog}>
          <form className="space-y-4" onSubmit={createUser}>
            <p className="text-sm text-muted-foreground">Lege einen neuen Admin-Nutzer für das Backend an.</p>
            <TextField label="E-Mail" required type="email" value={email} onChange={setEmail} placeholder="admin@example.com" />
            <TextField label="Passwort" required type="password" value={password} onChange={setPassword} placeholder="Mindestens 6 Zeichen" />
            <p className="text-xs leading-5 text-muted-foreground">Der neue Nutzer erhält automatisch die Rolle „admin“.</p>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button className={buttonClass("outline")} onClick={closeCreateDialog} type="button">Abbrechen</button>
              <button className={buttonClass()} disabled={creating || !email || password.length < 6} type="submit">
                {creating ? "Erstellt..." : "Erstellen"}
              </button>
            </div>
          </form>
        </FormDialog>
      ) : null}
    </div>
  );
}

function ProtectionSection() {
  const [enabled, setEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await getSupabaseBrowserClient().from("site_settings").select("*").eq("id", "main").maybeSingle();
      if (!active) {
        return;
      }

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }

      if (data) {
        setEnabled(Boolean(data.password_protection_enabled));
        setPassword(String(data.password_protection_password || ""));
        setUpdatedAt(typeof data.updated_at === "string" ? data.updated_at : null);
      } else {
        setMessage({ type: "error", text: "Die site_settings-Zeile 'main' wurde nicht gefunden." });
      }
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (enabled && !password.trim()) {
      setMessage({ type: "error", text: "Bitte ein Passwort eintragen, wenn der Schutz aktiv ist." });
      return;
    }

    setSaving(true);
    const { data, error } = await getSupabaseBrowserClient().from("site_settings").update({
      password_protection_enabled: enabled,
      password_protection_password: password,
      updated_at: new Date().toISOString()
    }).eq("id", "main").select("updated_at").single();
    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setUpdatedAt(typeof data?.updated_at === "string" ? data.updated_at : new Date().toISOString());
    setMessage({ type: "success", text: enabled ? "Passwortschutz ist aktiv." : "Passwortschutz ist deaktiviert." });
  }

  return (
    <form onSubmit={save} className="max-w-3xl overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border bg-secondary/30 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Website-Schutz</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">Schützt die öffentliche Website mit einem Vorschau-Passwort.</p>
          </div>
        </div>
        <span className={cx(
          "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
          enabled ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-white text-muted-foreground"
        )}>
          <span className={cx("h-2 w-2 rounded-full", enabled ? "bg-primary" : "bg-muted-foreground/40")} />
          {enabled ? "Aktiv" : "Inaktiv"}
        </span>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-background/60 px-4 py-3">
            <span>
              <span className="block text-sm font-semibold text-foreground">Passwortschutz aktivieren</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">Besucher müssen zuerst das Passwort eingeben.</span>
            </span>
            <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
              <input className="peer sr-only" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} type="checkbox" disabled={loading || saving} />
              <span className="absolute inset-0 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-disabled:opacity-60" />
              <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </span>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Passwort
            <span className="relative">
              <Key className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-12 w-full rounded-xl border border-input bg-background px-11 pr-12 font-normal outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                disabled={loading || saving}
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

          {message ? (
            <div className={cx(
              "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
              message.type === "success" ? "border-primary/20 bg-primary/10 text-primary" : "border-destructive/20 bg-destructive/10 text-destructive"
            )}>
              {message.type === "success" ? <Check className="mt-0.5 h-4 w-4" /> : <X className="mt-0.5 h-4 w-4" />}
              <span>{message.text}</span>
            </div>
          ) : null}

          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60" type="submit" disabled={loading || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>

        <div className="border-t border-border pt-4 text-sm md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aktueller Zustand</p>
          <p className="mt-3 font-semibold text-foreground">{loading ? "Wird geladen..." : enabled ? "Schutz eingeschaltet" : "Schutz ausgeschaltet"}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Gespeichert wird die Einstellung <span className="font-mono">site_settings.main</span>, die auch die Passwort-Prüfung nutzt.
          </p>
          {updatedAt ? <p className="mt-4 text-xs text-muted-foreground">Aktualisiert: {formatDateTime(updatedAt)}</p> : null}
        </div>
      </div>
    </form>
  );
}

function AccountSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    if (!currentPassword) {
      setMessage("Bitte geben Sie Ihr aktuelles Passwort ein.");
      setSaving(false);
      return;
    }
    if (password.length < 6) {
      setMessage("Das Passwort muss mindestens 6 Zeichen lang sein.");
      setSaving(false);
      return;
    }
    if (password !== repeat) {
      setMessage("Die Passwörter stimmen nicht überein.");
      setSaving(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      setMessage("Sitzung konnte nicht geprüft werden. Bitte neu einloggen.");
      setSaving(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (verifyError) {
      setMessage("Das aktuelle Passwort ist nicht korrekt.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Passwort wurde aktualisiert.");
    if (!error) {
      setCurrentPassword("");
      setPassword("");
      setRepeat("");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={save} className="max-w-xl rounded-xl border border-border bg-white p-5">
      <h2 className="text-lg font-bold">Passwort ändern</h2>
      <div className="mt-6 space-y-4">
        <label className="grid gap-2 text-sm font-semibold">
          Altes Passwort
          <input className="h-11 rounded-xl border border-input bg-background px-3.5 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/25" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Neues Passwort
          <input className="h-11 rounded-xl border border-input bg-background px-3.5 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/25" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Wiederholen
          <input className="h-11 rounded-xl border border-input bg-background px-3.5 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/25" type="password" value={repeat} onChange={(event) => setRepeat(event.target.value)} autoComplete="new-password" required />
        </label>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60" disabled={saving} type="submit">
          {saving ? "Speichert..." : "Speichern"}
        </button>
      </div>
    </form>
  );
}

function InfoPanel({ title, text, link, linkLabel }: { title: string; text: string; link?: string; linkLabel?: string }) {
  return (
    <div className="max-w-2xl rounded-xl border border-border bg-white p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      {link ? (
        <a className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90" href={link} target="_blank" rel="noreferrer">
          {linkLabel || "Öffnen"}
        </a>
      ) : null}
    </div>
  );
}

function SectionToolbar({ title, loading, onRefresh, children }: { title: string; loading?: boolean; onRefresh?: () => void; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {onRefresh ? (
        <button className={buttonClass("outline", "sm")} onClick={onRefresh} type="button">
            <RefreshCcw className={cx("h-3.5 w-3.5", loading && "animate-spin")} />
            Aktualisieren
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DetailDialog({ title, children, onClose, onDelete }: { title: string; children: ReactNode; onClose: () => void; onDelete?: () => void }) {
  return (
    <FormDialog title={title} onClose={onClose}>
      {children}
      <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
        {onDelete ? (
          <button className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 px-5 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10" onClick={onDelete} type="button">
            <Trash2 className="h-4 w-4" />
            Löschen
          </button>
        ) : null}
        <button className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary" onClick={onClose} type="button">Schließen</button>
      </div>
    </FormDialog>
  );
}

function FormDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const compact = ["Neue Kategorie", "Kategorie bearbeiten"].includes(title);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onMouseDown={onClose}>
      <div
        className={cx(
          "max-h-[90vh] w-full overflow-y-auto rounded-lg border border-border bg-white p-6 shadow-2xl",
          compact ? "max-w-md" : "max-w-2xl"
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
          <button className="rounded-sm opacity-70 transition-opacity hover:opacity-100" onClick={onClose} type="button" aria-label="Schließen">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailGrid({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-x-8 gap-y-3 text-base md:grid-cols-[160px_1fr]">
      {rows.map(([label, value]) => (
        label === "Nachricht" ? (
          <div className="contents" key={label}>
            <dt className="font-semibold text-muted-foreground">{label}:</dt>
            <dd className="rounded-xl bg-secondary/50 p-4 whitespace-pre-wrap break-words text-foreground">{value}</dd>
          </div>
        ) : (
          <div className="contents" key={label}>
            <dt className="font-semibold text-muted-foreground">{label}:</dt>
            <dd className="whitespace-pre-wrap break-words text-foreground">{value}</dd>
          </div>
        )
      ))}
    </dl>
  );
}
