export type InquiryInput = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiry(body: unknown): { value?: InquiryInput; errors: FieldErrors } {
  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const read = (key: string) => (typeof source[key] === "string" ? source[key].trim() : "");
  const value: InquiryInput = {
    fullName: read("fullName"),
    email: read("email"),
    phone: read("phone"),
    company: read("company"),
    projectType: read("projectType"),
    message: read("message"),
  };
  const errors: FieldErrors = {};
  const digits = value.phone.replace(/\D/g, "");

  if (value.fullName.length < 2) errors.fullName = "Enter your name.";
  if (!value.email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(value.email)) errors.email = "Enter a valid email address.";
  if (value.phone && (digits.length < 7 || digits.length > 15)) {
    errors.phone = "Enter a valid mobile number, or leave this blank.";
  }
  if (value.company && value.company.length < 2) {
    errors.company = "Enter a brand or company name, or leave this blank.";
  }
  if (!value.message) errors.message = "Tell us a little about the project.";
  else if (value.message.length < 10) errors.message = "Use at least 10 characters.";
  else if (value.message.length > 4000) errors.message = "Keep the message under 4,000 characters.";

  return { value: Object.keys(errors).length ? undefined : value, errors };
}
