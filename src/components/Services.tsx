import { services } from "../data/services.ts";
import { Container } from "./Container.tsx";
import { FrameImage } from "./FrameImage.tsx";
import { Reveal } from "./Reveal.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

export function Services() {
  return (
    <section id="services" className="section-space border-t border-white/10 bg-charcoal">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Services" title="What we photograph" />
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.map((service, index) => (
            <li key={service.title}>
              <Reveal delay={(index % 3) * 50}>
                <figure className="frame-shot border border-white/10 bg-ink">
                  <div className="aspect-[4/5] bg-ink">
                    <FrameImage
                      image={service.image}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                  <figcaption className="border-t border-white/10 px-4 py-3">
                    <h3 className="truncate text-sm font-medium uppercase tracking-[0.16em] text-paper">{service.title}</h3>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
