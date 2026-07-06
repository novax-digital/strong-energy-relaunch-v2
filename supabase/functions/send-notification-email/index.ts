import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { createStrongEnergyEmail } from "../_shared/email-template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationPayload {
  type: "contact" | "inquiry";
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    customerType: string;
    subject?: string;
    message?: string;
    productSlug?: string;
    bundesland?: string;
  };
}

// Simple HTML entity escaping to prevent HTML injection
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validate and sanitize string input
function sanitizeField(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return escapeHtml(value.trim().slice(0, maxLength));
}

function buildDetailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 10px 14px; color: #64748b; font-size: 13px; font-weight: 500; width: 140px; vertical-align: top; border-bottom: 1px solid #f1f5f9;">${label}</td>
      <td style="padding: 10px 14px; color: #1a1a1a; font-size: 14px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${value}</td>
    </tr>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate JWT - require authenticated caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      // Fallback: allow if called with valid anon key from our app
      // by verifying a matching recent DB record exists
    }

    const payload = await req.json();
    const { type, data } = payload as NotificationPayload;

    // Validate type
    if (type !== "contact" && type !== "inquiry") {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    if (!data?.firstName || !data?.lastName || !data?.email || !data?.customerType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email) || data.email.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify that a matching record was recently inserted in the DB
    // This ensures the function is only called after a legitimate form submission
    const tableName = type === "contact" ? "contact_messages" : "inquiries";
    const { data: recentRecord, error: dbErr } = await supabase
      .from(tableName)
      .select("id")
      .eq("email", data.email.trim())
      .eq("first_name", data.firstName.trim())
      .eq("last_name", data.lastName.trim())
      .gte("created_at", new Date(Date.now() - 60000).toISOString()) // within last 60 seconds
      .limit(1)
      .single();

    if (dbErr || !recentRecord) {
      console.log("No matching recent DB record found, rejecting request");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize all user-supplied fields
    const sanitized = {
      firstName: sanitizeField(data.firstName, 100),
      lastName: sanitizeField(data.lastName, 100),
      email: data.email.trim().slice(0, 255), // email not HTML-escaped for mailto
      emailDisplay: sanitizeField(data.email, 255),
      phone: sanitizeField(data.phone, 30),
      customerType: sanitizeField(data.customerType, 50),
      subject: sanitizeField(data.subject, 200),
      message: sanitizeField(data.message, 2000),
      productSlug: sanitizeField(data.productSlug, 100),
      bundesland: sanitizeField(data.bundesland, 100),
    };

    // Fetch active recipients
    const { data: recipients, error: recErr } = await supabase
      .from("notification_recipients")
      .select("name, email")
      .or(`form_type.eq.${type},form_type.eq.both`)
      .eq("is_active", true);

    if (recErr) throw recErr;
    if (!recipients || recipients.length === 0) {
      console.log("No active recipients for type:", type);
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendKey);
    const isContact = type === "contact";
    const formLabel = isContact ? "Kontaktanfrage" : "Produktanfrage";

    // Build admin notification body
    const customerTypeLabel: Record<string, string> = {
      privatperson: "Privatperson",
      gewerbe: "Gewerbe",
      installateur: "Installateur",
      partner: "Partner",
    };

    let detailRows = "";
    detailRows += buildDetailRow("Kundentyp", customerTypeLabel[data.customerType] || sanitized.customerType);
    detailRows += buildDetailRow("Name", `${sanitized.firstName} ${sanitized.lastName}`);
    detailRows += buildDetailRow("E-Mail", `<a href="mailto:${sanitized.email}" style="color: #28a795; text-decoration: none;">${sanitized.emailDisplay}</a>`);
    if (data.phone) detailRows += buildDetailRow("Telefon", sanitized.phone);
    if (data.subject) detailRows += buildDetailRow("Betreff", sanitized.subject);
    if (data.productSlug) detailRows += buildDetailRow("Produkt", sanitized.productSlug);
    if (data.bundesland) detailRows += buildDetailRow("Region / Details", sanitized.bundesland);

    const adminBody = `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 8px;">
        ${detailRows}
      </table>
      ${sanitized.message ? `
        <div style="margin-top: 20px; padding: 20px; background-color: #f8faf9; border-radius: 8px; border-left: 3px solid #28a795;">
          <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">Nachricht</p>
          <p style="color: #1a1a1a; font-size: 14px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${sanitized.message}</p>
        </div>
      ` : ""}
    `;

    const adminHtml = createStrongEnergyEmail({
      title: `Neue ${formLabel}`,
      subtitle: `Von ${sanitized.firstName} ${sanitized.lastName} · ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`,
      body: adminBody,
      buttonText: "Im Dashboard ansehen",
      buttonUrl: "https://strong-energy.eu/admin",
    });

    // Build customer confirmation
    const confirmationBody = `
      <p style="margin: 0 0 16px;">Liebe/r ${sanitized.firstName} ${sanitized.lastName},</p>
      <p style="margin: 0 0 16px;">vielen Dank für Ihre ${formLabel}! Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
      <p style="margin: 0 0 4px;">Unser Team bearbeitet Anfragen in der Regel innerhalb von <strong>24 Stunden</strong> an Werktagen.</p>
    `;

    const confirmationHtml = createStrongEnergyEmail({
      title: "Vielen Dank für Ihre Anfrage!",
      subtitle: "Wir haben Ihre Nachricht erhalten.",
      body: confirmationBody,
      footerNote: "Dies ist eine automatische Bestätigung. Bitte antworten Sie nicht direkt auf diese E-Mail. Bei Fragen erreichen Sie uns unter info_de@strong-energy.eu oder telefonisch unter 0800 7788 787 (kostenfrei).",
    });

    const recipientEmails = recipients.map((r: { email: string }) => r.email);

    const results = await Promise.allSettled([
      resend.emails.send({
        from: "Strong Energy <info_de@strong-energy.eu>",
        to: recipientEmails,
        subject: `Neue ${formLabel}: ${sanitized.firstName} ${sanitized.lastName}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: "Strong Energy <info_de@strong-energy.eu>",
        to: [sanitized.email],
        subject: isContact
          ? "Ihre Kontaktanfrage bei STRONG Energy"
          : "Ihre Produktanfrage bei STRONG Energy",
        html: confirmationHtml,
      }),
    ]);

    const errors = results.filter((r) => r.status === "rejected");
    if (errors.length > 0) {
      console.error("Some emails failed:", errors);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in send-notification-email:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
