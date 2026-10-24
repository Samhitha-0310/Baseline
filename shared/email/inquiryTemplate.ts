export const EMAIL_BRAND = {
  name: "Baseline Corp",
  descriptor: "Creative Content Studio",
  tagline: "Photography, film, and digital visuals crafted to help brands express who they are.",
  inbox: "baselinecorp1@gmail.com",
  website: "https://baseline-corp.vercel.app",
  source: "Baseline Corp Website Contact Form",
  black: "#0B0B0D",
  charcoal: "#151517",
  card: "#151517",
  gold: "#C9A227",
  goldWarm: "#E0C15A",
  paper: "#F5F3EE",
  muted: "#A5A5A5",
  line: "#2A2A2E",
} as const;

export type InquiryEmailInput = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType?: string;
  message: string;
  receivedAt?: Date;
};

export type InquiryEmailField = {
  label: string;
  value: string;
  href?: string;
};

const EMAIL_PATTERN = /^[^\s<>"]+@[^\s<>"]+\.[^\s<>"]+$/;

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatInquiryStamp(date: Date) {
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
  return { dateLabel, timeLabel };
}

function clean(value: string) {
  return value.trim();
}

function telHref(phone: string) {
  const compact = phone.trim().replace(/[^\d+]/g, "");
  const normalized = compact.startsWith("+") ? `+${compact.slice(1).replace(/\D/g, "")}` : compact.replace(/\D/g, "");
  if (normalized.replace(/\D/g, "").length < 7) return undefined;
  return `tel:${normalized}`;
}

export function inquiryFields(input: InquiryEmailInput): InquiryEmailField[] {
  const fields: InquiryEmailField[] = [];
  const fullName = clean(input.fullName);
  const email = clean(input.email);
  const phone = clean(input.phone);
  const company = clean(input.company);
  const projectType = clean(input.projectType ?? "");
  const message = clean(input.message);
  if (fullName) fields.push({ label: "Name", value: fullName });
  if (email) fields.push({ label: "Email", value: email, href: EMAIL_PATTERN.test(email) ? `mailto:${email}` : undefined });
  if (phone) fields.push({ label: "Mobile", value: phone, href: telHref(phone) });
  if (company) fields.push({ label: "Brand", value: company });
  if (projectType) fields.push({ label: "Project", value: projectType });
  if (message) fields.push({ label: "Message", value: message });
  return fields;
}

export function inquiryAction(input: InquiryEmailInput) {
  const email = clean(input.email);
  if (EMAIL_PATTERN.test(email)) {
    const name = clean(input.fullName);
    const subject = `Re: New inquiry — ${name || EMAIL_BRAND.name}`;
    const greeting = name ? `Hello ${name},` : "Hello,";
    const body = `${greeting}\n\nThank you for writing to Baseline.`;
    return {
      href: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      label: "View full inquiry",
    };
  }
  return {
    href: `${EMAIL_BRAND.website}/#contact`,
    label: "View full inquiry",
  };
}

export function renderInquiryEmailText(input: InquiryEmailInput) {
  const receivedAt = input.receivedAt ?? new Date();
  const stamp = formatInquiryStamp(receivedAt);
  const fields = inquiryFields(input);
  const lines = [
    "BASELINE CORP",
    "CREATIVE CONTENT STUDIO",
    "",
    "You've got a new inquiry.",
    "A new submission has been received through your website. Here are the details.",
    "",
  ];
  if (fields.length === 0) {
    lines.push("No inquiry details were included.");
  } else {
    for (const field of fields) lines.push(`${field.label}: ${field.value}`, "");
  }
  lines.push(
    `Received on: ${stamp.dateLabel}`,
    `Received at: ${stamp.timeLabel}`,
    `Source: ${EMAIL_BRAND.source}`,
    "",
    `Reply: ${inquiryAction(input).href}`,
    "",
    EMAIL_BRAND.tagline,
    EMAIL_BRAND.website,
    EMAIL_BRAND.inbox,
  );
  return lines.join("\n");
}

function assetUrl(assetBase: string, file: string) {
  return `${assetBase.replace(/\/$/, "")}/email/${file}`;
}

function logo(size: number, assetBase: string) {
  const src = escapeHtml(assetUrl(assetBase, "logo.png"));
  return `<img src="${src}" width="${size}" height="${size}" alt="Baseline Corp" style="display:block;width:${size}px;height:${size}px;border:0;outline:none;text-decoration:none;">`;
}

function fieldRow(label: string, value: string, href: string | undefined, last: boolean) {
  const safe = escapeHtml(value).replaceAll("\n", "<br>");
  const linked = href
    ? `<a href="${escapeHtml(href)}" style="color:${EMAIL_BRAND.paper};text-decoration:underline;">${safe}</a>`
    : safe;
  const rule = last ? "0" : `1px solid ${EMAIL_BRAND.line}`;
  return `<tr>
    <th class="col-label" align="left" valign="top" width="34%" scope="row" style="width:34%;padding:13px 12px;border-bottom:${rule};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;font-weight:600;color:${EMAIL_BRAND.gold};">${escapeHtml(label)}</th>
    <td class="col-value" valign="top" style="padding:13px 14px;border-bottom:${rule};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:${EMAIL_BRAND.paper};word-break:break-word;">${linked}</td>
  </tr>`;
}

export type InquiryEmailRenderOptions = {
  /** Origin used for decorative images. Defaults to the public site. */
  assetBase?: string;
};

export function renderInquiryEmailHtml(input: InquiryEmailInput, options: InquiryEmailRenderOptions = {}) {
  const assetBase = options.assetBase?.trim() || EMAIL_BRAND.website;
  const receivedAt = input.receivedAt ?? new Date();
  const stamp = formatInquiryStamp(receivedAt);
  const fields = inquiryFields(input);
  const action = inquiryAction({ ...input, receivedAt });
  const name = clean(input.fullName) || "someone";
  const tableFields = [
    ...fields,
    { label: "Received on", value: stamp.dateLabel },
    { label: "Received at", value: stamp.timeLabel },
    { label: "Source", value: EMAIL_BRAND.source },
  ];
  const rows =
    fields.length > 0
      ? tableFields.map((field, index) => fieldRow(field.label, field.value, field.href, index === tableFields.length - 1)).join("")
      : fieldRow("Details", "No inquiry details were included.", undefined, false) +
        tableFields.slice(-3).map((field, index, list) => fieldRow(field.label, field.value, undefined, index === list.length - 1)).join("");
  const waveSrc = escapeHtml(assetUrl(assetBase, "wave.png"));
  const mark = logo(36, assetBase);
  const sans = "Arial,Helvetica,sans-serif";
  const serif = "Georgia,'Times New Roman',serif";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>New inquiry — ${escapeHtml(EMAIL_BRAND.name)}</title>
  <style>
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
    }
    @media screen and (max-width: 560px) {
      .wave, .aside { display: none !important; width: 0 !important; max-width: 0 !important; max-height: 0 !important; overflow: hidden !important; font-size: 0 !important; line-height: 0 !important; }
    }
    @media screen and (max-width: 480px) {
      .hero-title { font-size: 30px !important; line-height: 34px !important; }
      .stack { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
      .col-label { width: 38% !important; font-size: 13px !important; padding: 12px 8px !important; }
      .col-value { font-size: 14px !important; padding: 12px 10px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${EMAIL_BRAND.black};color:${EMAIL_BRAND.paper};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">A new inquiry from ${escapeHtml(name)} has arrived through the Baseline Corp website.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL_BRAND.black}" style="background:${EMAIL_BRAND.black};">
    <tr>
      <td align="center" style="padding:20px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
          <tr>
            <td style="padding:4px 4px 16px;border-bottom:1px solid ${EMAIL_BRAND.gold};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" width="44" style="width:44px;">${mark}</td>
                  <td valign="middle" style="padding-left:12px;">
                    <p style="margin:0;font-family:${sans};font-size:13px;line-height:16px;letter-spacing:0.18em;text-transform:uppercase;color:${EMAIL_BRAND.paper};">Baseline Corp</p>
                    <p style="margin:5px 0 0;font-family:${sans};font-size:10px;line-height:14px;letter-spacing:0.12em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">Creative Content Studio</p>
                  </td>
                  <td class="aside" valign="middle" align="right" width="92" style="width:92px;font-family:${sans};font-size:10px;line-height:16px;letter-spacing:0.14em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">
                    Light<br>Frame<br>Story
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 4px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <p style="margin:0 0 12px;font-family:${sans};font-size:11px;line-height:14px;letter-spacing:0.22em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">New inquiry</p>
                    <h1 class="hero-title" style="margin:0;font-family:${serif};font-size:40px;line-height:44px;font-weight:normal;color:${EMAIL_BRAND.paper};">You've got<br><span style="color:${EMAIL_BRAND.goldWarm};">a new inquiry.</span></h1>
                    <p style="margin:14px 0 0;font-family:${sans};font-size:15px;line-height:23px;color:${EMAIL_BRAND.muted};">A new submission has been received through your website. Here are the details.</p>
                  </td>
                  <td class="wave" valign="middle" width="168" align="right" style="width:168px;padding-left:8px;">
                    <img src="${waveSrc}" width="160" height="96" alt="" style="display:block;width:160px;max-width:100%;height:auto;border:0;outline:none;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 4px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL_BRAND.card}" style="width:100%;background:${EMAIL_BRAND.card};border:1px solid ${EMAIL_BRAND.line};">
                ${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 8px 6px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${EMAIL_BRAND.gold}" style="background:${EMAIL_BRAND.gold};border-radius:4px;">
                    <a href="${escapeHtml(action.href)}" style="display:inline-block;padding:14px 28px;font-family:${sans};font-size:14px;line-height:18px;font-weight:700;text-decoration:none;color:${EMAIL_BRAND.black};">View full inquiry →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 4px 8px;border-top:1px solid ${EMAIL_BRAND.line};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="stack" valign="top" width="210" style="width:210px;padding-bottom:12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td valign="middle">${logo(32, assetBase)}</td>
                      <td valign="middle" style="padding-left:10px;font-family:${sans};">
                        <p style="margin:0;font-size:12px;line-height:16px;letter-spacing:0.16em;text-transform:uppercase;color:${EMAIL_BRAND.paper};">Baseline Corp</p>
                        <p style="margin:4px 0 0;font-size:10px;line-height:14px;letter-spacing:0.1em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">Creative Content Studio</p>
                      </td>
                    </tr></table>
                  </td>
                  <td class="stack" valign="top" style="font-family:${sans};font-size:13px;line-height:20px;color:${EMAIL_BRAND.muted};">
                    <p style="margin:0 0 6px;font-size:11px;line-height:16px;letter-spacing:0.12em;text-transform:uppercase;color:${EMAIL_BRAND.paper};">Let's create something considered.</p>
                    ${escapeHtml(EMAIL_BRAND.tagline)}
                    <p style="margin:10px 0 0;">
                      <a href="${EMAIL_BRAND.website}" style="color:${EMAIL_BRAND.gold};text-decoration:underline;">baseline-corp.vercel.app</a><br>
                      <a href="mailto:${EMAIL_BRAND.inbox}" style="color:${EMAIL_BRAND.gold};text-decoration:underline;">${EMAIL_BRAND.inbox}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
