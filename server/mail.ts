import nodemailer from "nodemailer";
import { renderInquiryEmailHtml, renderInquiryEmailText } from "../shared/email/inquiryTemplate.ts";
import {
  DEFAULT_INBOX,
  formSubmitPayload,
  formSubmitUrl,
  interpretRelay,
  type RelayResult,
} from "../shared/relay.ts";
import type { InquiryInput } from "./validate.ts";

export type MailResult = RelayResult;

export function mailSettings() {
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

export async function sendInquiryEmail(inquiry: InquiryInput): Promise<MailResult> {
  const settings = mailSettings();
  if (settings.configured) {
    const smtp = await sendSmtp(inquiry, settings);
    if (smtp.sent) return smtp;
  }
  return sendFormSubmit(inquiry);
}

async function sendSmtp(
  inquiry: InquiryInput,
  settings: ReturnType<typeof mailSettings>,
): Promise<MailResult> {
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
    const message = error instanceof Error ? error.message : "Email send failed.";
    console.error("Inquiry SMTP failed:", message);
    return { sent: false, delivery: "failed", error: "send_failed" };
  }
}

async function sendFormSubmit(inquiry: InquiryInput): Promise<MailResult> {
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
