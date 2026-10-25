import nodemailer from "nodemailer";
import { renderInquiryEmailHtml, renderInquiryEmailText } from "../shared/email/inquiryTemplate";
import {
  DEFAULT_INBOX,
  formSubmitPayload,
  formSubmitUrl,
  interpretRelay,
  type RelayResult,
} from "../shared/relay";
import { validateInquiry } from "../server/validate";
import { readJsonBody, writeResponse, type NodeReq, type NodeRes } from "./nodeHandler";

export default async function handler(req: NodeReq, res: NodeRes) {
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
        body: readJsonBody(req),
      }),
    ),
  );
}

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

  const clientDelivery = readClientDelivery(parsed);
  const mail =
    clientDelivery === "sent"
      ? { sent: true, delivery: "sent" as const, error: null }
      : clientDelivery === "confirm"
        ? { sent: false, delivery: "confirm" as const, error: "awaiting_confirmation" }
        : await sendInquiryEmail(value);

  return Response.json(
    {
      ok: true,
      stored: false,
      emailSent: mail.sent,
      delivery: mail.delivery,
      emailConfigured: mail.sent || mail.delivery === "confirm" || mailSettings().configured,
    },
    { status: 201 },
  );
}

function readClientDelivery(parsed: unknown) {
  if (!parsed || typeof parsed !== "object") return null;
  const value = (parsed as Record<string, unknown>).clientDelivery;
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
    port: Number.isFinite(port) ? port : 587,
  };
}

async function sendInquiryEmail(inquiry: {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}): Promise<RelayResult> {
  const settings = mailSettings();
  if (settings.configured) {
    const smtp = await sendBrandedInquiry(inquiry, settings);
    if (smtp.sent) return smtp;
  }
  return sendFormSubmit(inquiry);
}

async function sendBrandedInquiry(
  inquiry: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    message: string;
  },
  settings: ReturnType<typeof mailSettings>,
): Promise<RelayResult> {
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
    return { sent: true, delivery: "sent", error: null };
  } catch (error) {
    console.error("Inquiry SMTP failed:", error instanceof Error ? error.message : "send_failed");
    return { sent: false, delivery: "failed", error: "send_failed" };
  }
}

async function sendFormSubmit(inquiry: {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}): Promise<RelayResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(formSubmitUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formSubmitPayload(inquiry)),
      signal: controller.signal,
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
