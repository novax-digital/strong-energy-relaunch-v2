"use server";

type SubmissionIntent = "contact" | "inquiry";
type SupabaseTable = "contact_messages" | "inquiries";
type SupabaseValue = string | boolean | null;
type SupabaseRow = Record<string, SupabaseValue>;
type NotificationValue = string | boolean | null | undefined;

export interface ContactState {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

function readString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function hasAcceptedPrivacy(value: string) {
  return ["on", "true", "1", "yes"].includes(value.toLowerCase());
}

function normalizeCustomerType(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("gewerbe")) return "gewerbe";
  if (normalized.includes("installateur")) return "installateur";
  if (normalized.includes("gross")) return "grosshaendler";
  return "privatperson";
}

function splitName(value: string) {
  const parts = value.split(/\s+/).filter(Boolean);
  return {
    firstName: (parts[0] || value).slice(0, 100),
    lastName: (parts.slice(1).join(" ") || "-").slice(0, 100)
  };
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  return { url, key };
}

async function insertSupabaseRow(table: SupabaseTable, payload: SupabaseRow) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase ${table} insert failed (${response.status}): ${details}`);
  }
}

async function sendNotification(type: SubmissionIntent, data: Record<string, NotificationValue>) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/functions/v1/send-notification-email`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type, data })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Notification failed (${response.status}): ${details}`);
  }
}

export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const intent = readString(formData, "intent") === "inquiry" ? "inquiry" : "contact";
  const fields = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone"),
    topic: readString(formData, "topic"),
    message: readString(formData, "message"),
    privacy: readString(formData, "privacy"),
    customerType: readString(formData, "customerType"),
    productSlug: readString(formData, "productSlug"),
    productName: readString(formData, "productName"),
    utmSource: readString(formData, "utm_source"),
    utmMedium: readString(formData, "utm_medium"),
    utmCampaign: readString(formData, "utm_campaign"),
    utmContent: readString(formData, "utm_content")
  };

  const fieldErrors: Record<string, string> = {};
  if (fields.name.length < 2) fieldErrors.name = "Bitte geben Sie Ihren Namen ein.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) fieldErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  if (fields.message.length < 10) fieldErrors.message = "Bitte beschreiben Sie Ihr Anliegen etwas genauer.";
  if (!hasAcceptedPrivacy(fields.privacy)) fieldErrors.privacy = "Bitte stimmen Sie der Datenschutzerklärung zu.";

  if (Object.keys(fieldErrors).length) {
    return { ok: false, message: "Bitte prüfen Sie Ihre Eingaben.", fieldErrors };
  }

  const { firstName, lastName } = splitName(fields.name);
  const customerType = normalizeCustomerType(fields.customerType);
  const phone = fields.phone.slice(0, 30) || null;

  try {
    if (intent === "inquiry") {
      const details = [
        fields.productName && `Produkt: ${fields.productName}`,
        fields.topic && `Betreff: ${fields.topic}`,
        fields.message && `Nachricht: ${fields.message}`
      ]
        .filter(Boolean)
        .join(" | ")
        .slice(0, 255);

      await insertSupabaseRow("inquiries", {
        customer_type: customerType,
        first_name: firstName,
        last_name: lastName,
        email: fields.email.slice(0, 255),
        phone,
        bundesland: details || null,
        product_slug: fields.productSlug || null,
        privacy_accepted: true,
        utm_source: fields.utmSource || null,
        utm_medium: fields.utmMedium || null,
        utm_campaign: fields.utmCampaign || null,
        utm_content: fields.utmContent || null
      });

      try {
        await sendNotification("inquiry", {
          firstName,
          lastName,
          email: fields.email,
          phone: phone || undefined,
          customerType,
          productSlug: fields.productSlug || undefined,
          bundesland: details || undefined
        });
      } catch (error) {
        console.warn("Produktanfrage wurde gespeichert, aber die Benachrichtigung konnte nicht gesendet werden.", error);
      }

      return { ok: true, message: "Vielen Dank. Ihre Produktanfrage wurde übermittelt." };
    }

    await insertSupabaseRow("contact_messages", {
      customer_type: customerType,
      first_name: firstName,
      last_name: lastName,
      email: fields.email.slice(0, 255),
      phone,
      subject: (fields.topic || "Kontaktanfrage").slice(0, 200),
      message: fields.message.slice(0, 5000),
      privacy_accepted: true
    });

    try {
      await sendNotification("contact", {
        firstName,
        lastName,
        email: fields.email,
        phone: phone || undefined,
        customerType,
        subject: fields.topic || "Kontaktanfrage",
        message: fields.message
      });
    } catch (error) {
      console.warn("Kontaktnachricht wurde gespeichert, aber die Benachrichtigung konnte nicht gesendet werden.", error);
    }

    return { ok: true, message: "Vielen Dank. Ihre Nachricht wurde übermittelt." };
  } catch (error) {
    console.error("Anfrage konnte nicht gespeichert werden.", error);
    return { ok: false, message: "Leider konnte Ihre Anfrage gerade nicht gespeichert werden. Bitte versuchen Sie es später erneut." };
  }
}
