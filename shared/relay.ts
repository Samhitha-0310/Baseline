export const DEFAULT_INBOX = "baselinecorp1@gmail.com";

/** Public FormSubmit form id for the Baseline inbox. It is not a password. */
export const FORM_SUBMIT_ID = "34fb17698031e07eed867225e936168e";

export type RelayInquiry = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType?: string;
  message: string;
};

export type RelayDelivery = "sent" | "confirm" | "failed";

export type RelayResult = {
  sent: boolean;
  delivery: RelayDelivery;
  error: string | null;
};

export function formSubmitUrl() {
  return `https://formsubmit.co/ajax/${FORM_SUBMIT_ID}`;
}

export function formSubmitPayload(inquiry: RelayInquiry) {
  const project = inquiry.projectType?.trim() ?? "";
  const company = inquiry.company.trim();
  return {
    Name: inquiry.fullName,
    Email: inquiry.email,
    Phone: inquiry.phone,
    Company: company,
    Project: project,
    Message: inquiry.message,
    _subject: company
      ? `New inquiry — ${inquiry.fullName} — ${company}`
      : `New inquiry — ${inquiry.fullName}`,
    _replyto: inquiry.email,
    _template: "table",
  };
}

export function interpretRelay(status: number, text: string): RelayResult {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) {
    return {
      sent: false,
      delivery: "failed",
      error: status === 403 ? "relay_blocked" : "relay_rejected",
    };
  }

  let data: { success?: unknown; message?: unknown };
  try {
    data = JSON.parse(trimmed) as { success?: unknown; message?: unknown };
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
