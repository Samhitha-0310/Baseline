import { DEFAULT_INBOX } from "../shared/relay";

function smtpConfigured() {
  const host = process.env.SMTP_HOST?.trim() ?? "";
  const user = process.env.SMTP_USER?.trim() ?? "";
  const pass = process.env.SMTP_PASS?.trim() ?? "";
  const from = process.env.SMTP_FROM?.trim() || user;
  return Boolean(host && user && pass && from);
}

export function GET() {
  return Response.json({
    ok: true,
    storage: "vercel",
    emailConfigured: true,
    smtpConfigured: smtpConfigured(),
    contactTo: process.env.CONTACT_TO?.trim() || DEFAULT_INBOX,
    htmlTemplate: smtpConfigured(),
  });
}
