import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { onSectionLink } from "../lib/scrollTo.ts";
import { ButtonLink } from "./Button.tsx";
import { Container } from "./Container.tsx";
import { HeroMark } from "./HeroMark.tsx";

function rise(delay: string): CSSProperties {
  return { "--rise-delay": delay } as CSSProperties;
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-graphite">
      <div className="hero-shade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-noise pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-orbs pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        <span className="gold-ball gold-ball-1" />
        <span className="gold-ball gold-ball-2" />
        <span className="gold-ball gold-ball-3" />
        <span className="gold-ball gold-ball-4" />
        <span className="gold-ball gold-ball-5" />
        <span className="gold-ball gold-ball-6" />
        <span className="gold-ball gold-ball-7" />
      </div>
      <Container className="relative z-10 pb-12 pt-4 sm:pb-16 sm:pt-5 lg:pb-20 lg:pt-6">
        <p className="hero-rise text-[11px] font-medium uppercase tracking-[0.28em] text-gold" style={rise("0.05s")}>
          Growth &amp; Marketing Agency
        </p>
        <h1 className="hero-title mt-3 w-full max-w-none uppercase text-paper">
          <span className="hero-line">
            <span className="hero-line-inner" style={rise("0.12s")}>
              Build the baseline.
            </span>
          </span>
          <span className="hero-line">
            <span className="hero-line-inner" style={rise("0.28s")}>
              Raise the <span className="hero-glow">standard</span>.
            </span>
          </span>
        </h1>
        <div className="gold-rule mt-8" aria-hidden="true" />

        <div className="mt-10 grid items-center gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="hero-rise max-w-xl text-pretty text-lg leading-snug text-paper sm:text-xl" style={rise("0.34s")}>
              Strategic marketing and growth solutions built to move ambitious businesses forward.
            </p>
            <p
              className="hero-rise mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-base"
              style={rise("0.4s")}
            >
              Baseline Corp helps businesses sharpen their positioning, strengthen their digital presence, acquire the
              right customers, and build systems for sustainable growth.
            </p>
            <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={rise("0.46s")}>
              <ButtonLink href="#contact" onClick={onSectionLink("contact")}>
                Start a Conversation
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#services" variant="line" onClick={onSectionLink("services")}>
                Explore Services
              </ButtonLink>
            </div>
          </div>
          <div className="hero-mark-in lg:col-span-6">
            <HeroMark />
          </div>
        </div>

        <div className="marquee mt-12" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }, (_, copy) => (
              <span key={copy}>
                Build the baseline · Raise the standard · Strategy · Momentum · Growth · Acquisition · Systems ·{" "}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-5 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Strategy · Positioning · Acquisition · Systems</p>
          <a
            href="#about"
            onClick={onSectionLink("about")}
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-paper"
          >
            <span className="scroll-beam" aria-hidden="true" />
            Scroll
          </a>
        </div>
      </Container>
    </section>
  );
}
