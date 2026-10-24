import nodemailer from "nodemailer";
import { renderInquiryEmailHtml, renderInquiryEmailText } from "../shared/email/inquiryTemplate";
import { DEFAULT_INBOX } from "../shared/relay";
import { validateInquiry } from "../server/validate";

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 20_000) {
    return Response.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }
  let parsed: unknown;
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const { value, errors } = validateInquiry(parsed);
  if (!value) return Response.json({ ok: false, errors }, { status: 400 });

  const mail = await sendBrandedInquiry(value);
  return Response.json(
    {
      ok: true,
      stored: false,
      emailSent: mail.sent,
      delivery: mail.delivery,
      emailConfigured: mailSettings().configured,
    },
    { status: 201 },
  );
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
    port: Number.isFinite(port) ? port : 587,
  };
}

async function sendBrandedInquiry(inquiry: {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}) {
  const settings = mailSettings();
  if (!settings.configured) return { sent: false, delivery: "failed" as const };
  try {
    const transport = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.port === 465,
      auth: { user: settings.user, pass: settings.pass },
    });
    const content = { ...inquiry, receivedAt: new Date() };
    await transport.sendMail({
      from: settings.from,
      to: settings.to,
      replyTo: inquiry.email || undefined,
      subject: `You've got a new inquiry — ${inquiry.fullName || "Baseline Corp"}`,
      text: renderInquiryEmailText(content),
      html: renderInquiryEmailHtml(content),
    });
    return { sent: true, delivery: "sent" as const };
  } catch (error) {
    console.error("Inquiry SMTP failed:", error instanceof Error ? error.message : "send_failed");
    return { sent: false, delivery: "failed" as const };
  }
}
