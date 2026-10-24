import { useEffect, useState } from "react";
import { portfolio, type PortfolioItem } from "../content/portfolio.ts";
import { Container } from "./Container.tsx";
import { FrameImage } from "./FrameImage.tsx";
import { Reveal } from "./Reveal.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

export function Portfolio() {
  const [active, setActive] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section id="portfolio" className="section-space border-t border-white/10 bg-graphite">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected frames"
            titleId="portfolio-title"
            intro="Hospitality, café, and beverage stills from recent studio photography. These are finished frames, grouped by subject rather than invented clients."
          />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {portfolio.map((shot, index) => (
            <Reveal key={shot.id} delay={(index % 3) * 70} className="h-full min-h-0">
              <figure className="frame-shot flex h-full flex-col border border-white/10 bg-ink">
                <button
                  type="button"
                  className="block w-full cursor-zoom-in text-left"
                  onClick={() => setActive(shot)}
                  aria-haspopup="dialog"
                  aria-label={`Open ${shot.title}`}
                >
                  <div className="aspect-[3/4] bg-ink">
                    <FrameImage
                      image={shot.image}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                </button>
                <figcaption className="flex items-start justify-between gap-4 px-4 py-3">
                  <span>
                    <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-paper">
                      {shot.title}
                    </span>
                    <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-muted">{shot.category}</span>
                  </span>
                  <span className="text-[11px] tabular-nums tracking-[0.16em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>

      {active ? (
        <div
          className="lightbox-in fixed inset-0 z-[60] flex items-center justify-center bg-graphite/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-lightbox-title"
          onClick={() => setActive(null)}
        >
          <div className="flex max-h-full max-w-5xl flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p id="work-lightbox-title" className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
                  {active.title}
                </p>
                <p className="mt-1 text-sm text-muted">{active.description}</p>
              </div>
              <button
                type="button"
                className="min-h-11 shrink-0 border border-white/15 px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-paper"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>
            <img
              src={active.image.src}
              width={active.image.width}
              height={active.image.height}
              alt={active.image.alt}
              className="h-auto max-h-[calc(100svh-8rem)] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
