import { formSubmitPayload, formSubmitUrl, interpretRelay } from "../../shared/relay.ts";

export type Inquiry = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
};

export type InquiryField = keyof Inquiry;
export type FieldErrors = Partial<Record<InquiryField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyInquiry = (): Inquiry => ({
  fullName: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  message: "",
});

export function validateInquiry(values: Inquiry): FieldErrors {
  const errors: FieldErrors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const company = values.company.trim();
  const message = values.message.trim();
  const digits = phone.replace(/\D/g, "");

  if (fullName.length < 2) errors.fullName = "Enter your name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (phone && (digits.length < 7 || digits.length > 15)) errors.phone = "Enter a valid mobile number, or leave this blank.";
  if (company && company.length < 2) errors.company = "Enter a brand or company name, or leave this blank.";
  if (!message) errors.message = "Tell us a little about the project.";
  else if (message.length < 10) errors.message = "Use at least 10 characters.";
  else if (message.length > 4000) errors.message = "Keep the message under 4,000 characters.";

  return errors;
}

export function hasErrors(errors: FieldErrors) {
  return Object.keys(errors).length > 0;
}

export type ApiInquiryResponse = {
  ok: boolean;
  id?: string;
  stored?: boolean;
  emailSent?: boolean;
  delivery?: "sent" | "confirm" | "failed";
  emailConfigured?: boolean;
  errors?: FieldErrors;
  error?: string;
};

export type SubmitResult =
  | { mode: "sent" }
  | { mode: "invalid"; errors: FieldErrors }
  | { mode: "activate" }
  | { mode: "error" };

function payload(values: Inquiry) {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    company: values.company.trim(),
    projectType: values.projectType.trim(),
    message: values.message.trim(),
  };
}

async function smtpConfigured() {
  try {
    const response = await fetch("/api/health", { headers: { Accept: "application/json" } });
    if (!response.ok) return false;
    const body = (await response.json()) as { smtpConfigured?: boolean };
    return Boolean(body.smtpConfigured);
  } catch {
    return false;
  }
}

async function storeInquiry(values: Inquiry, clientDelivery: "sent" | "confirm" | "failed") {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || "/api/inquiries";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ ...payload(values), clientDelivery }),
  });
  let body: ApiInquiryResponse = { ok: false };
  try {
    body = (await response.json()) as ApiInquiryResponse;
  } catch {
    body = { ok: false };
  }
  return { ...body, httpStatus: response.status };
}

async function deliverFromBrowser(values: Inquiry) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(formSubmitUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formSubmitPayload(payload(values))),
      signal: controller.signal,
    });
    return interpretRelay(response.status, await response.text());
  } catch {
    return { sent: false, delivery: "failed" as const, error: "relay_unreachable" };
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Browser FormSubmit is the production delivery path when SMTP is not set.
 * Success is returned only after FormSubmit or SMTP confirms acceptance.
 * An "activate" result means FormSubmit received the first request and emailed
 * an Activate Form link — that is not delivery, and we do not report success.
 */
export async function submitInquiry(values: Inquiry): Promise<SubmitResult> {
  const useSmtp = await smtpConfigured();

  if (useSmtp) {
    try {
      const stored = await storeInquiry(values, "failed");
      if (stored.httpStatus === 400 && stored.errors) return { mode: "invalid", errors: stored.errors };
      if (stored.emailSent || stored.delivery === "sent") return { mode: "sent" };
    } catch {
      // FormSubmit can still accept the inquiry.
    }
  }

  const relay = await deliverFromBrowser(values);
  if (relay.delivery === "sent") {
    void storeInquiry(values, "sent").catch(() => undefined);
    return { mode: "sent" };
  }

  if (relay.delivery === "confirm") {
    void storeInquiry(values, "confirm").catch(() => undefined);
    return { mode: "activate" };
  }

  if (!useSmtp) {
    try {
      const stored = await storeInquiry(values, "failed");
      if (stored.httpStatus === 400 && stored.errors) return { mode: "invalid", errors: stored.errors };
      if (stored.emailSent || stored.delivery === "sent") return { mode: "sent" };
      if (stored.delivery === "confirm") return { mode: "activate" };
    } catch {
      // Both delivery attempts failed.
    }
  }

  return { mode: "error" };
}
