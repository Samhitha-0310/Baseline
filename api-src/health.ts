import { DEFAULT_INBOX } from "../shared/relay";
import { writeResponse, type NodeReq, type NodeRes } from "./nodeHandler";

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

export default async function handler(req: NodeReq, res: NodeRes) {
  const method = req.method ?? "GET";
  if (method !== "GET" && method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }
  await writeResponse(res, GET());
}
