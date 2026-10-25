// api-src/inquiries.ts
import nodemailer from "nodemailer";

// shared/email/inquiryTemplate.ts
var EMAIL_BRAND = {
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
  line: "#2A2A2E"
};
var EMAIL_PATTERN = /^[^\s<>"]+@[^\s<>"]+\.[^\s<>"]+$/;
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function formatInquiryStamp(date) {
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short"
  }).format(date);
  return { dateLabel, timeLabel };
}
function clean(value) {
  return value.trim();
}
function telHref(phone) {
  const compact = phone.trim().replace(/[^\d+]/g, "");
  const normalized = compact.startsWith("+") ? `+${compact.slice(1).replace(/\D/g, "")}` : compact.replace(/\D/g, "");
  if (normalized.replace(/\D/g, "").length < 7) return void 0;
  return `tel:${normalized}`;
}
function inquiryFields(input) {
  const fields = [];
  const fullName = clean(input.fullName);
  const email = clean(input.email);
  const phone = clean(input.phone);
  const company = clean(input.company);
  const projectType = clean(input.projectType ?? "");
  const message = clean(input.message);
  if (fullName) fields.push({ label: "Name", value: fullName });
  if (email) fields.push({ label: "Email", value: email, href: EMAIL_PATTERN.test(email) ? `mailto:${email}` : void 0 });
  if (phone) fields.push({ label: "Mobile", value: phone, href: telHref(phone) });
  if (company) fields.push({ label: "Brand", value: company });
  if (projectType) fields.push({ label: "Project", value: projectType });
  if (message) fields.push({ label: "Message", value: message });
  return fields;
}
function inquiryAction(input) {
  const email = clean(input.email);
  if (EMAIL_PATTERN.test(email)) {
    const name = clean(input.fullName);
    const subject = `Re: New inquiry \u2014 ${name || EMAIL_BRAND.name}`;
    const greeting = name ? `Hello ${name},` : "Hello,";
    const body = `${greeting}

Thank you for writing to Baseline.`;
    return {
      href: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      label: "View full inquiry"
    };
  }
  return {
    href: `${EMAIL_BRAND.website}/#contact`,
    label: "View full inquiry"
  };
}
function renderInquiryEmailText(input) {
  const receivedAt = input.receivedAt ?? /* @__PURE__ */ new Date();
  const stamp = formatInquiryStamp(receivedAt);
  const fields = inquiryFields(input);
  const lines = [
    "BASELINE CORP",
    "CREATIVE CONTENT STUDIO",
    "",
    "You've got a new inquiry.",
    "A new submission has been received through your website. Here are the details.",
    ""
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
    EMAIL_BRAND.inbox
  );
  return lines.join("\n");
}
function assetUrl(assetBase, file) {
  return `${assetBase.replace(/\/$/, "")}/email/${file}`;
}
function logo(size, assetBase) {
  const src = escapeHtml(assetUrl(assetBase, "logo.png"));
  return `<img src="${src}" width="${size}" height="${size}" alt="Baseline Corp" style="display:block;width:${size}px;height:${size}px;border:0;outline:none;text-decoration:none;">`;
}
function fieldRow(label, value, href, last) {
  const safe = escapeHtml(value).replaceAll("\n", "<br>");
  const linked = href ? `<a href="${escapeHtml(href)}" style="color:${EMAIL_BRAND.paper};text-decoration:underline;">${safe}</a>` : safe;
  const rule = last ? "0" : `1px solid ${EMAIL_BRAND.line}`;
  return `<tr>
    <th class="col-label" align="left" valign="top" width="34%" scope="row" style="width:34%;padding:13px 12px;border-bottom:${rule};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;font-weight:600;color:${EMAIL_BRAND.gold};">${escapeHtml(label)}</th>
    <td class="col-value" valign="top" style="padding:13px 14px;border-bottom:${rule};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:${EMAIL_BRAND.paper};word-break:break-word;">${linked}</td>
  </tr>`;
}
function renderInquiryEmailHtml(input, options = {}) {
  const assetBase = options.assetBase?.trim() || EMAIL_BRAND.website;
  const receivedAt = input.receivedAt ?? /* @__PURE__ */ new Date();
  const stamp = formatInquiryStamp(receivedAt);
  const fields = inquiryFields(input);
  const action = inquiryAction({ ...input, receivedAt });
  const name = clean(input.fullName) || "someone";
  const tableFields = [
    ...fields,
    { label: "Received on", value: stamp.dateLabel },
    { label: "Received at", value: stamp.timeLabel },
    { label: "Source", value: EMAIL_BRAND.source }
  ];
  const rows = fields.length > 0 ? tableFields.map((field, index) => fieldRow(field.label, field.value, field.href, index === tableFields.length - 1)).join("") : fieldRow("Details", "No inquiry details were included.", void 0, false) + tableFields.slice(-3).map((field, index, list) => fieldRow(field.label, field.value, void 0, index === list.length - 1)).join("");
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
  <title>New inquiry \u2014 ${escapeHtml(EMAIL_BRAND.name)}</title>
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
                    <a href="${escapeHtml(action.href)}" style="display:inline-block;padding:14px 28px;font-family:${sans};font-size:14px;line-height:18px;font-weight:700;text-decoration:none;color:${EMAIL_BRAND.black};">View full inquiry \u2192</a>
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

// shared/relay.ts
var DEFAULT_INBOX = "baselinecorp1@gmail.com";
var FORM_SUBMIT_ID = "34fb17698031e07eed867225e936168e";
function formSubmitUrl() {
  return `https://formsubmit.co/ajax/${FORM_SUBMIT_ID}`;
}
function formSubmitPayload(inquiry) {
  const project = inquiry.projectType?.trim() ?? "";
  const company = inquiry.company.trim();
  return {
    Name: inquiry.fullName,
    Email: inquiry.email,
    Phone: inquiry.phone,
    Company: company,
    Project: project,
    Message: inquiry.message,
    _subject: company ? `New inquiry \u2014 ${inquiry.fullName} \u2014 ${company}` : `New inquiry \u2014 ${inquiry.fullName}`,
    _replyto: inquiry.email,
    _template: "table",
    _captcha: false
  };
}
function interpretRelay(status, text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) {
    return {
      sent: false,
      delivery: "failed",
      error: status === 403 ? "relay_blocked" : "relay_rejected"
    };
  }
  let data;
  try {
    data = JSON.parse(trimmed);
  } catch {
    return { sent: false, delivery: "failed", error: "relay_rejected" };
  }
  const message = typeof data.message === "string" ? data.message : "";
  if (/activat/i.test(message)) {
    return { sent: false, delivery: "confirm", error: "awaiting_confirmation" };
  }
  const success = data.success === true || data.success === "true";
  if (success && status >= 200 && status < 300) {
    return { sent: true, delivery: "sent", error: null };
  }
  return { sent: false, delivery: "failed", error: "relay_rejected" };
}

// server/validate.ts
var EMAIL_PATTERN2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateInquiry(body) {
  const source = body && typeof body === "object" ? body : {};
  const read = (key) => typeof source[key] === "string" ? source[key].trim() : "";
  const value = {
    fullName: read("fullName"),
    email: read("email"),
    phone: read("phone"),
    company: read("company"),
    projectType: read("projectType"),
    message: read("message")
  };
  const errors = {};
  const digits = value.phone.replace(/\D/g, "");
  if (value.fullName.length < 2) errors.fullName = "Enter your name.";
  if (!value.email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN2.test(value.email)) errors.email = "Enter a valid email address.";
  if (value.phone && (digits.length < 7 || digits.length > 15)) {
    errors.phone = "Enter a valid mobile number, or leave this blank.";
  }
  if (value.company && value.company.length < 2) {
    errors.company = "Enter a brand or company name, or leave this blank.";
  }
  if (!value.message) errors.message = "Tell us a little about the project.";
  else if (value.message.length < 10) errors.message = "Use at least 10 characters.";
  else if (value.message.length > 4e3) errors.message = "Keep the message under 4,000 characters.";
  return { value: Object.keys(errors).length ? void 0 : value, errors };
}

// api-src/nodeHandler.ts
async function writeResponse(res, response) {
  const text = await response.text();
  let payload = text;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { ok: false, error: text };
    }
  }
  res.status(response.status).json(payload);
}
function readJsonBody(req) {
  if (typeof req.body === "string") return req.body;
  if (req.body == null) return "";
  if (typeof req.body === "object") return JSON.stringify(req.body);
  return String(req.body);
}

// api-src/inquiries.ts
async function handler(req, res) {
  if ((req.method ?? "") !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }
  await writeResponse(
    res,
    await POST(
      new Request("https://baseline.local/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: readJsonBody(req)
      })
    )
  );
}
async function POST(request) {
  const raw = await request.text();
  if (raw.length > 2e4) {
    return Response.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const { value, errors } = validateInquiry(parsed);
  if (!value) return Response.json({ ok: false, errors }, { status: 400 });
  const clientDelivery = readClientDelivery(parsed);
  const mail = clientDelivery === "sent" ? { sent: true, delivery: "sent", error: null } : clientDelivery === "confirm" ? { sent: false, delivery: "confirm", error: "awaiting_confirmation" } : await sendInquiryEmail(value);
  return Response.json(
    {
      ok: true,
      stored: false,
      emailSent: mail.sent,
      delivery: mail.delivery,
      emailConfigured: mail.sent || mail.delivery === "confirm" || mailSettings().configured
    },
    { status: 201 }
  );
}
function readClientDelivery(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  const value = parsed.clientDelivery;
  if (value === "sent" || value === "confirm" || value === "failed") return value;
  return null;
}
function mailSettings() {
  const host = process.env.SMTP_HOST?.trim() ?? "";
  const user = process.env.SMTP_USER?.trim() ?? "";
  const pass = process.env.SMTP_PASS?.trim() ?? "";
  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.CONTACT_TO?.trim() || DEFAULT_INBOX;
  const port = Number(process.env.SMTP_PORT || 587);
  return {
    configured: Boolean(host && user && pass && from),
    host,
    user,
    pass,
    from,
    to,
    port: Number.isFinite(port) ? port : 587
  };
}
async function sendInquiryEmail(inquiry) {
  const settings = mailSettings();
  if (settings.configured) {
    const smtp = await sendBrandedInquiry(inquiry, settings);
    if (smtp.sent) return smtp;
  }
  return sendFormSubmit(inquiry);
}
async function sendBrandedInquiry(inquiry, settings) {
  try {
    const transport = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.port === 465,
      auth: { user: settings.user, pass: settings.pass }
    });
    const content = { ...inquiry, receivedAt: /* @__PURE__ */ new Date() };
    await transport.sendMail({
      from: settings.from,
      to: settings.to,
      replyTo: inquiry.email || void 0,
      subject: `You've got a new inquiry \u2014 ${inquiry.fullName || "Baseline Corp"}`,
      text: renderInquiryEmailText(content),
      html: renderInquiryEmailHtml(content)
    });
    return { sent: true, delivery: "sent", error: null };
  } catch (error) {
    console.error("Inquiry SMTP failed:", error instanceof Error ? error.message : "send_failed");
    return { sent: false, delivery: "failed", error: "send_failed" };
  }
}
async function sendFormSubmit(inquiry) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8e3);
  try {
    const response = await fetch(formSubmitUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formSubmitPayload(inquiry)),
      signal: controller.signal
    });
    const result = interpretRelay(response.status, await response.text());
    if (!result.sent) console.error("Inquiry relay:", result.error);
    return result;
  } catch (error) {
    console.error("Inquiry relay failed:", error instanceof Error ? error.name : "error");
    return { sent: false, delivery: "failed", error: "relay_unreachable" };
  } finally {
    clearTimeout(timer);
  }
}
export {
  POST,
  handler as default
};
