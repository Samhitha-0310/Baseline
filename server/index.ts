import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { existsSync, readFileSync } from "node:fs";
import { Hono } from "hono";
import { databasePath, listInquiries, saveInquiry } from "./db.ts";
import { mailSettings, sendInquiryEmail } from "./mail.ts";
import { validateInquiry } from "./validate.ts";

loadEnvFile();

const app = new Hono();
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;

app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
});

app.get("/api/health", (c) => {
  const mail = mailSettings();
  return c.json({
    ok: true,
    storage: "sqlite",
    emailConfigured: true,
    smtpConfigured: mail.configured,
    contactTo: mail.to,
  });
});

app.get("/api/inquiries", (c) => {
  const token = process.env.ADMIN_TOKEN?.trim();
  if (!token) {
    return c.json({ ok: false, error: "Admin access is not configured." }, 503);
  }
  const header = c.req.header("authorization") ?? "";
  if (header !== `Bearer ${token}`) {
    return c.json({ ok: false, error: "Unauthorized." }, 401);
  }
  return c.json({ ok: true, inquiries: listInquiries() });
});

app.post("/api/inquiries", async (c) => {
  if (!allow(clientIp(c.req.raw))) {
    return c.json({ ok: false, error: "Too many inquiries. Try again shortly." }, 429);
  }

  const raw = await c.req.text();
  if (raw.length > 20_000) {
    return c.json({ ok: false, error: "Payload too large." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    return c.json({ ok: false, error: "Invalid JSON." }, 400);
  }

  const { value, errors } = validateInquiry(parsed);
  if (!value) {
    return c.json({ ok: false, errors }, 400);
  }

  const clientDelivery = readClientDelivery(parsed);
  const mail =
    clientDelivery === "sent"
      ? { sent: true, delivery: "sent" as const, error: null }
      : clientDelivery === "confirm"
        ? { sent: false, delivery: "confirm" as const, error: "awaiting_confirmation" }
        : await sendInquiryEmail(value);
  const saved = saveInquiry(value, mail.sent, mail.error);
  console.log(`Inquiry ${saved.id} delivery: ${mail.delivery}`);
  return c.json(
    {
      ok: true,
      id: saved.id,
      stored: true,
      emailSent: saved.emailSent,
      delivery: mail.delivery,
      emailConfigured: mail.sent || mail.delivery === "confirm" || mailSettings().configured,
    },
    201,
  );
});

if (existsSync("dist/index.html")) {
  app.use("/*", serveStatic({ root: "./dist" }));
  app.get("*", () => {
    return new Response(readFileSync("dist/index.html"), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  });
}

const port = Number(process.env.PORT || (process.env.NODE_ENV === "production" ? 4317 : 4318));
const hostname = process.env.HOST || "127.0.0.1";

serve({ fetch: app.fetch, port, hostname }, () => {
  console.log(`Baseline API listening on http://${hostname}:${port}`);
  console.log(`SQLite database: ${databasePath()}`);
  console.log(
    mailSettings().configured
      ? `Outbound email: SMTP to ${mailSettings().to}`
      : `Outbound email: browser relay to ${mailSettings().to}`,
  );
});

function allow(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "local";
}

function readClientDelivery(parsed: unknown) {
  if (!parsed || typeof parsed !== "object") return null;
  const value = (parsed as Record<string, unknown>).clientDelivery;
  if (value === "sent" || value === "confirm" || value === "failed") return value;
  return null;
}

function loadEnvFile() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
