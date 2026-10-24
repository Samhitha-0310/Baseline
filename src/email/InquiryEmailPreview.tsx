import { useMemo } from "react";
import {
  EMAIL_BRAND,
  formatInquiryStamp,
  inquiryAction,
  inquiryFields,
  renderInquiryEmailHtml,
  type InquiryEmailInput,
} from "../../shared/email/inquiryTemplate.ts";

const sampleInquiry: InquiryEmailInput = {
  fullName: "Hello",
  email: "Hello@gmail.com",
  phone: "9398807974",
  company: "Hello Pvt Ltd",
  projectType: "Photography",
  message: "We would like brand and product photography for a new collection.",
};

const longMessage = `${sampleInquiry.message}\n\nThe brief needs stills for the website and a short set of social frames. This note is intentionally long so the card can wrap across several lines without stretching the layout or forcing a horizontal scroll.`;

function readFixture(): InquiryEmailInput {
  const params = new URLSearchParams(window.location.search);
  const fixture = params.get("fixture");
  if (fixture === "missing") return { fullName: "", email: "", phone: "", company: "", message: "" };
  if (fixture === "long") return { ...sampleInquiry, message: longMessage, fullName: "A very long visitor name that should wrap inside the card" };
  if (fixture === "markup") return { ...sampleInquiry, fullName: `Hello <script>alert("x")</script>`, message: `Line one\n<img src=x onerror=alert(1)>` };
  return sampleInquiry;
}

function Wave() {
  return (
    <svg viewBox="0 0 420 280" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="gold-wave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E2B84B" stopOpacity="0.15" />
          <stop offset="45%" stopColor="#D4AF37" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E2B84B" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="gold-glow" cx="70%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="420" height="280" fill="url(#gold-glow)" />
      {Array.from({ length: 18 }, (_, index) => {
        const bend = 18 + index * 7;
        return (
          <path
            key={index}
            d={`M40 ${20 + index * 13} C 140 ${bend}, 250 ${280 - bend}, 400 ${40 + index * 11}`}
            fill="none"
            stroke="url(#gold-wave)"
            strokeWidth={index % 5 === 0 ? 1.4 : 0.7}
            opacity={0.35 + (index % 4) * 0.12}
          />
        );
      })}
    </svg>
  );
}

function Monogram({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center border border-[#F5F3EE]/25 font-semibold text-[#F5F3EE]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      B
      <span className="absolute right-[18%] bottom-[16%] left-[18%] h-px bg-[#C9A227]" />
    </span>
  );
}

export function InquiryEmailPreview() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const width = Number(params.get("width") || 600);
  const input = useMemo(() => ({ ...readFixture(), receivedAt: new Date() }), []);
  const stamp = formatInquiryStamp(input.receivedAt ?? new Date());
  const fields = inquiryFields(input);
  const action = inquiryAction(input);

  if (view === "message") {
    const html = renderInquiryEmailHtml(input, { assetBase: window.location.origin });
    const frameWidth = Number.isFinite(width) ? Math.min(Math.max(width, 280), 800) : 600;
    return (
      <main className="min-h-svh bg-[#1b1b1b] px-3 py-6 text-[#F5F3EE]">
        <p className="mx-auto mb-4 max-w-[600px] text-center text-[11px] uppercase tracking-[0.18em] text-[#A6A6A6]">
          Email message preview · {frameWidth}px
        </p>
        <iframe
          title="Baseline Corp inquiry email"
          srcDoc={html}
          className="mx-auto block border-0 bg-[#0A0A0A]"
          style={{ width: frameWidth, height: 1400 }}
          onLoad={(event) => {
            const frame = event.currentTarget;
            const doc = frame.contentDocument;
            if (!doc) return;
            frame.style.height = `${doc.documentElement.scrollHeight}px`;
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-[#0B0B0D] text-[#F5F3EE]">
      <article className="mx-auto flex min-h-svh w-full max-w-[980px] flex-col px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <header className="flex items-start justify-between gap-6 border-b border-[#C9A227] pb-6">
          <div className="flex items-center gap-3">
            <Monogram />
            <div>
              <p className="text-[13px] uppercase tracking-[0.24em]">Baseline Corp</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#C9A227]">Creative Content Studio</p>
            </div>
          </div>
          <p className="hidden text-right text-[10px] uppercase leading-5 tracking-[0.2em] text-[#C9A227] min-[380px]:block">
            Light
            <br />
            Frame
            <br />
            Story
          </p>
        </header>

        <section className="relative grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#C9A227]">New inquiry</p>
            <h1 className="mt-4 max-w-[12ch] text-[3.1rem] font-bold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
              You've got
              <span className="block text-[#E0C15A]">a new inquiry.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#A6A6A6]">
              A new submission has been received through your website. Here are the details.
            </p>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[320px] lg:block" aria-hidden="true">
            <Wave />
          </div>
        </section>

        <section className="overflow-hidden border border-[#2A2A2E] bg-[#151517]" aria-label="Inquiry details">
          <table className="w-full table-fixed border-collapse text-left">
            <tbody>
              {fields.length === 0 ? (
                <tr className="border-b border-[#2A2A2E]">
                  <th scope="row" className="w-[38%] px-3 py-3 align-top text-sm font-semibold text-[#C9A227] sm:w-[34%] sm:px-4">
                    Details
                  </th>
                  <td className="px-3 py-3 align-top text-sm break-words text-[#A5A5A5] sm:px-4">No inquiry details were included.</td>
                </tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.label} className="border-b border-[#2A2A2E]">
                    <th scope="row" className="w-[38%] px-3 py-3 align-top text-sm font-semibold text-[#C9A227] sm:w-[34%] sm:px-4">
                      {field.label}
                    </th>
                    <td className="px-3 py-3 align-top text-sm leading-relaxed break-words whitespace-pre-wrap text-[#F5F3EE] sm:px-4 sm:text-base">
                      {field.href ? (
                        <a className="underline decoration-[#C9A227]/70 underline-offset-4" href={field.href}>
                          {field.value}
                        </a>
                      ) : (
                        field.value
                      )}
                    </td>
                  </tr>
                ))
              )}
              <tr className="border-b border-[#2A2A2E]">
                <th scope="row" className="w-[38%] px-3 py-3 align-top text-sm font-semibold text-[#C9A227] sm:w-[34%] sm:px-4">
                  Received on
                </th>
                <td className="px-3 py-3 align-top text-sm text-[#F5F3EE] sm:px-4">{stamp.dateLabel}</td>
              </tr>
              <tr className="border-b border-[#2A2A2E]">
                <th scope="row" className="w-[38%] px-3 py-3 align-top text-sm font-semibold text-[#C9A227] sm:w-[34%] sm:px-4">
                  Received at
                </th>
                <td className="px-3 py-3 align-top text-sm text-[#F5F3EE] sm:px-4">{stamp.timeLabel}</td>
              </tr>
              <tr>
                <th scope="row" className="w-[38%] px-3 py-3 align-top text-sm font-semibold text-[#C9A227] sm:w-[34%] sm:px-4">
                  Source
                </th>
                <td className="px-3 py-3 align-top text-sm text-[#F5F3EE] sm:px-4">{EMAIL_BRAND.source}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="py-8 text-center">
          <a
            href={action.href}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#C9A227] px-8 text-sm font-semibold text-[#0B0B0D]"
          >
            View full inquiry →
          </a>
        </div>

        <footer className="mt-auto grid gap-6 border-t border-[#2C2C2C] pt-6 sm:grid-cols-[auto_1fr] sm:items-start">
          <div className="flex items-center gap-3">
            <Monogram size={34} />
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em]">Baseline Corp</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#C9A227]">Creative Content Studio</p>
            </div>
          </div>
          <div className="text-sm leading-relaxed text-[#A6A6A6]">
            <p className="text-[11px] tracking-[0.14em] text-[#F5F3EE] uppercase">Let's create something considered.</p>
            <p className="mt-2">{EMAIL_BRAND.tagline}</p>
            <p className="mt-3">
              <a className="text-[#C9A227] underline underline-offset-4" href={EMAIL_BRAND.website}>
                baseline-corp.vercel.app
              </a>
              <span className="mx-2 text-[#2C2C2C]">/</span>
              <a className="text-[#C9A227] underline underline-offset-4" href={`mailto:${EMAIL_BRAND.inbox}`}>
                {EMAIL_BRAND.inbox}
              </a>
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}
