import { ArrowUpRight } from "lucide-react";
import { images } from "../content/images.ts";
import { onSectionLink } from "../lib/scrollTo.ts";
import { ButtonLink } from "./Button.tsx";
import { Container } from "./Container.tsx";
import { FrameImage } from "./FrameImage.tsx";
import { Reveal } from "./Reveal.tsx";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-y border-gold/40 bg-ink" aria-labelledby="cta-title">
      <div className="hero-noise pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <Container className="relative py-10 sm:py-12 lg:py-14">
        <span className="pointer-events-none absolute left-5 top-6 h-7 w-7 border-l border-t border-gold/80 sm:left-8 lg:left-10" aria-hidden="true" />
        <span className="pointer-events-none absolute right-5 top-6 h-7 w-7 border-r border-t border-gold/80 sm:right-8 lg:right-10" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-6 left-5 h-7 w-7 border-b border-l border-gold/80 sm:left-8 lg:left-10" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-6 right-5 h-7 w-7 border-b border-r border-gold/80 sm:right-8 lg:right-10" aria-hidden="true" />
        <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Next</p>
            <h2
              id="cta-title"
              className="display-quote mt-3 max-w-5xl text-balance text-[2.1rem] leading-[1.05] text-paper sm:text-5xl lg:text-6xl"
            >
              Bring the brief. We&apos;ll find the frame.
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Photography, film, Reels, or digital visuals — tell us what the brand needs to show.
            </p>
            <div className="mt-6">
              <ButtonLink href="#contact" onClick={onSectionLink("contact")}>
                Work with us
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={80}>
            <figure className="frame-shot border border-white/10">
              <FrameImage image={images.cocktailGarnish} sizes="(min-width: 1024px) 32vw, 90vw" />
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
