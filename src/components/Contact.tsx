import { Check } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { brand, projectTypes } from "../data/site.ts";
import {
  emptyInquiry,
  hasErrors,
  submitInquiry,
  validateInquiry,
  type FieldErrors,
  type Inquiry,
  type InquiryField,
} from "../lib/contact.ts";
import { Button } from "./Button.tsx";
import { Container } from "./Container.tsx";
import { Reveal } from "./Reveal.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

const fields: Array<{
  name: Exclude<InquiryField, "message" | "projectType">;
  label: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  maxLength: number;
  required: boolean;
  placeholder: string;
}> = [
  { name: "fullName", label: "Name", type: "text", autoComplete: "name", maxLength: 120, required: true, placeholder: "Your name" },
  {
    name: "email",
    label: "Email address",
    type: "email",
    autoComplete: "email",
    maxLength: 160,
    required: true,
    placeholder: "you@studio.com",
  },
  {
    name: "phone",
    label: "Mobile number",
    type: "tel",
    autoComplete: "tel",
    maxLength: 32,
    required: false,
    placeholder: "Optional",
  },
  {
    name: "company",
    label: "Brand or company",
    type: "text",
    autoComplete: "organization",
    maxLength: 160,
    required: false,
    placeholder: "Optional",
  },
];

export function Contact() {
  const [values, setValues] = useState<Inquiry>(emptyInquiry);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [mailReady, setMailReady] = useState<boolean | null>(null);
  const lock = useRef(false);
  const fieldRefs = useRef<Partial<Record<InquiryField, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>>(
    {},
  );

  const successRef = useRef<HTMLHeadingElement>(null);
  const successPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "sent") return;
    successPanelRef.current?.scrollIntoView({ block: "center" });
    successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    let active = true;
    fetch("/api/health")
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { emailConfigured?: boolean } | null) => {
        if (active) setMailReady(Boolean(body?.emailConfigured));
      })
      .catch(() => {
        if (active) setMailReady(null);
      });
    return () => {
      active = false;
    };
  }, []);

  function update(field: InquiryField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateField(field: InquiryField, value: string) {
    const next = validateInquiry({ ...values, [field]: value });
    setErrors((current) => {
      const copy = { ...current };
      if (next[field]) copy[field] = next[field];
      else delete copy[field];
      return copy;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;

    const nextErrors = validateInquiry(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const first = (Object.keys(nextErrors) as InquiryField[]).find((key) => nextErrors[key]);
      if (first) fieldRefs.current[first]?.focus();
      return;
    }

    lock.current = true;
    setStatus("submitting");
    setFormError("");

    try {
      const result = await submitInquiry(values);
      if (result.mode === "invalid") {
        setErrors(result.errors);
        setStatus("idle");
        const first = (Object.keys(result.errors) as InquiryField[]).find((key) => result.errors[key]);
        if (first) fieldRefs.current[first]?.focus();
        return;
      }
      if (result.mode === "sent") {
        setStatus("sent");
        return;
      }
      setStatus("error");
      setFormError(
        result.mode === "activate"
          ? `Check ${brand.email} for FormSubmit's "Activate Form" email for this website, click Activate Form, then submit again. That step is required once per domain and cannot be completed from this page.`
          : "We couldn't submit your inquiry. Please try again.",
      );
    } catch {
      setStatus("error");
      setFormError(`We couldn't deliver your inquiry. Email ${brand.email} directly.`);
    } finally {
      lock.current = false;
    }
  }

  const errorEntries = (Object.keys(errors) as InquiryField[]).filter((key) => errors[key]);

  return (
    <section id="contact" className="section-space border-t border-white/10 bg-graphite">
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title="Start a project"
              titleId="contact-title"
              intro="Tell us about the photographs, films, Reels, or visual assets you have in mind. We'll begin with a conversation."
            />
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Email us at</p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-3 inline-block text-lg text-paper underline decoration-gold/60 underline-offset-4 transition-colors duration-300 hover:text-gold sm:text-xl"
            >
              {brand.email}
            </a>
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Call us</p>
            <ul className="mt-3 space-y-2">
              {brand.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="text-lg text-paper underline decoration-gold/60 underline-offset-4 transition-colors duration-300 hover:text-gold sm:text-xl"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={80}>
            {status === "sent" ? (
              <div
                ref={successPanelRef}
                role="status"
                aria-live="polite"
                className="panel-in scroll-mt-28 border border-white/10 bg-charcoal p-6 sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-gold/70 text-gold" aria-hidden="true">
                    <Check size={20} strokeWidth={1.5} />
                  </span>
                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    className="text-3xl font-semibold uppercase tracking-[-0.03em] text-paper outline-none"
                  >
                    Inquiry received.
                  </h3>
                </div>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  Thank you for writing to Baseline. Your project note has been received, and we will be in touch.
                </p>
                <div className="mt-8">
                  <Button
                    variant="line"
                    onClick={() => {
                      setValues(emptyInquiry());
                      setErrors({});
                      setFormError("");
                      setStatus("idle");
                    }}
                  >
                    Send another inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate aria-labelledby="contact-title" className="space-y-4">
                {errorEntries.length > 0 ? (
                  <div role="alert" className="border border-white/10 px-4 py-3 text-sm text-danger">
                    Check the highlighted fields before continuing.
                  </div>
                ) : null}
                {formError ? (
                  <p role="alert" className="text-sm text-danger">
                    {formError}{" "}
                    <a className="underline" href={`mailto:${brand.email}`}>
                      {brand.email}
                    </a>
                  </p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((field) => {
                    const error = errors[field.name];
                    const errorId = `${field.name}-error`;
                    return (
                      <label key={field.name} className="block" htmlFor={field.name}>
                        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                          {field.label}
                          {field.required ? <span className="text-gold"> *</span> : <span className="text-muted/70"> (optional)</span>}
                        </span>
                        <input
                          ref={(node) => {
                            fieldRefs.current[field.name] = node;
                          }}
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          required={field.required}
                          maxLength={field.maxLength}
                          placeholder={field.placeholder}
                          value={values[field.name]}
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? errorId : undefined}
                          onChange={(event) => update(field.name, event.target.value)}
                          onBlur={(event) => validateField(field.name, event.target.value)}
                          className={`field-line mt-2 w-full border-b bg-transparent py-2.5 text-base text-paper placeholder:text-[#8d8d8d] ${
                            error ? "border-danger" : "border-white/20 focus:border-gold"
                          }`}
                        />
                        {error ? (
                          <span id={errorId} className="mt-2 block text-sm text-danger">
                            {error}
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>

                <label className="block" htmlFor="projectType">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                    Type of project <span className="text-muted/70">(optional)</span>
                  </span>
                  <select
                    ref={(node) => {
                      fieldRefs.current.projectType = node;
                    }}
                    id="projectType"
                    name="projectType"
                    value={values.projectType}
                    aria-invalid={Boolean(errors.projectType)}
                    onChange={(event) => update("projectType", event.target.value)}
                    className="field-line mt-2 w-full border-b border-white/20 bg-transparent py-2.5 text-base text-paper focus:border-gold"
                  >
                    <option value="" className="bg-graphite text-paper">
                      Select a project type
                    </option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-graphite text-paper">
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block" htmlFor="message">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                    Project details<span className="text-gold"> *</span>
                  </span>
                  <textarea
                    ref={(node) => {
                      fieldRefs.current.message = node;
                    }}
                    id="message"
                    name="message"
                    required
                    rows={4}
                    maxLength={4000}
                    placeholder="What would you like to create?"
                    value={values.message}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    onChange={(event) => update("message", event.target.value)}
                    onBlur={(event) => validateField("message", event.target.value)}
                    className={`field-line mt-2 min-h-28 w-full resize-y border bg-transparent px-4 py-3 text-base leading-relaxed text-paper placeholder:text-[#8d8d8d] ${
                      errors.message ? "border-danger" : "border-white/20 focus:border-gold"
                    }`}
                  />
                  {errors.message ? (
                    <span id="message-error" className="mt-2 block text-sm text-danger">
                      {errors.message}
                    </span>
                  ) : null}
                </label>

                <div className="flex flex-col items-start gap-4 pt-2">
                  <Button type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"}>
                    {status === "submitting" ? "Sending…" : "Start a project"}
                  </Button>
                  <p className="max-w-md text-sm leading-relaxed text-muted">
                    {mailReady === null
                      ? "The form stays on this page and confirms only after the message is accepted."
                      : `Name, email, and project details are sent to ${brand.email}. A mobile number is optional.`}
                  </p>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
