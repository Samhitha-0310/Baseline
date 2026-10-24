import { differentiators } from "../data/site.ts";
import { Container } from "./Container.tsx";
import { Reveal } from "./Reveal.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

export function WhyBaseline() {
  const [lead, ...rest] = differentiators;

  return (
    <section id="why" className="section-space border-t border-white/10 bg-graphite">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow="The studio" title="How we look at the work" />
            </div>
          </div>
          <div className="lg:col-span-8">
            {lead ? (
              <Reveal>
                <article className="border-t border-white/10 py-8 sm:py-10">
                  <p className="text-sm tabular-nums tracking-[0.2em] text-gold">{lead.index}</p>
                  <h3 className="mt-5 max-w-xl text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-paper sm:text-5xl">
                    {lead.title}
                  </h3>
                  <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                    {lead.description}
                  </p>
                </article>
              </Reveal>
            ) : null}
            <div className="grid border-t border-white/10 md:grid-cols-3">
              {rest.map((item, index) => (
                <article
                  key={item.index}
                  className="border-b border-white/10 py-8 md:border-b-0 md:border-r md:px-6 md:last:border-r-0 md:first:pl-0"
                >
                  <Reveal delay={index * 80}>
                    <p className="text-sm tabular-nums tracking-[0.2em] text-gold">{item.index}</p>
                    <h3 className="mt-5 text-lg font-semibold uppercase leading-snug tracking-[0.06em] text-paper">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted">{item.description}</p>
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
