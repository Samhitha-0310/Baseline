// shared/relay.ts
var DEFAULT_INBOX = "baselinecorp1@gmail.com";

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

// api-src/health.ts
function smtpConfigured() {
  const host = process.env.SMTP_HOST?.trim() ?? "";
  const user = process.env.SMTP_USER?.trim() ?? "";
  const pass = process.env.SMTP_PASS?.trim() ?? "";
  const from = process.env.SMTP_FROM?.trim() || user;
  return Boolean(host && user && pass && from);
}
function GET() {
  return Response.json({
    ok: true,
    storage: "vercel",
    emailConfigured: true,
    smtpConfigured: smtpConfigured(),
    contactTo: process.env.CONTACT_TO?.trim() || DEFAULT_INBOX,
    htmlTemplate: smtpConfigured()
  });
}
async function handler(req, res) {
  const method = req.method ?? "GET";
  if (method !== "GET" && method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }
  await writeResponse(res, GET());
}
export {
  GET,
  handler as default
};
