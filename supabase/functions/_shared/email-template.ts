// Shared email template for STRONG Energy
// Modern, clean design inspired by Passflow template with STRONG Energy branding

export function createStrongEnergyEmail(content: {
  title: string;
  subtitle?: string;
  body: string;
  buttonText?: string;
  buttonUrl?: string;
  footerNote?: string;
}) {
  const { title, subtitle, body, buttonText, buttonUrl, footerNote } = content;

  const buttonHtml = buttonText && buttonUrl ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0 8px 0;">
      <tr>
        <td style="border-radius: 8px; background: linear-gradient(90deg, #d7d42f, #28a795);">
          <a href="${buttonUrl}" style="display: inline-block; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 14px; letter-spacing: 0.3px;">
            ${buttonText}
          </a>
        </td>
      </tr>
    </table>
  ` : '';

  const footerNoteHtml = footerNote ? `
    <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      ${footerNote}
    </p>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Logo Header -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px;">
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <img src="https://strong-energy.eu/assets/logo-CkaIU7X8.png" alt="STRONG Energy" width="180" style="display: block; margin: 0 auto;" />
            </td>
          </tr>
        </table>

        <!-- Gradient accent bar -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px;">
          <tr>
            <td style="height: 4px; border-radius: 4px 4px 0 0; background: linear-gradient(90deg, #d7d42f, #28a795);"></td>
          </tr>
        </table>

        <!-- Main Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);">
          <tr>
            <td style="padding: 36px 32px;">

              <!-- Title -->
              <h1 style="color: #1a1a1a; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; line-height: 1.3;">
                ${title}
              </h1>

              ${subtitle ? `<p style="color: #64748b; font-size: 14px; margin: 0 0 28px 0; line-height: 1.5;">${subtitle}</p>` : '<div style="margin-bottom: 28px;"></div>'}

              <!-- Body Content -->
              <div style="color: #374151; font-size: 15px; line-height: 1.7;">
                ${body}
              </div>

              ${buttonHtml}

              ${footerNoteHtml}

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px;">
          <tr>
            <td style="padding: 28px 0; text-align: center;">
              <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0;">
                STRONG Digital GmbH
              </p>
              <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0 0 4px 0;">
                Von-Werth-Straße 1 · 50670 Köln · Deutschland
              </p>
              <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0 0 4px 0;">
                Tel: +49 221 2920 1070 · info_de@strong-energy.eu
              </p>
              <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0 0 4px 0;">
                HRB 84738 · AG Köln · USt-IdNr.: DE815579052
              </p>
              <p style="color: #b0b8c4; font-size: 10px; margin: 16px 0 0 0;">
                © ${new Date().getFullYear()} STRONG Digital GmbH. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

export default createStrongEnergyEmail;
