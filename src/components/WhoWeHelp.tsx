import { audiences } from "../data/site.ts";
import { Container } from "./Container.tsx";
import { Reveal } from "./Reveal.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

export function WhoWeHelp() {
  return (
    <section id="audiences" className="section-space border-t border-white/10 bg-graphite">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Who we create for"
            title="Made for brands that care how they appear."
            intro="From product houses to hospitality and independent makers, the work begins with the identity in front of the lens."
          />
        </Reveal>
        <ul className="mt-14 grid grid-cols-1 border-b border-white/10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => (
            <li key={audience} className="audience-cell min-h-[132px] px-1 py-7 sm:px-6 lg:px-7">
              <Reveal delay={index * 70}>
                <p className="audience-index text-xs tabular-nums tracking-[0.2em] text-gold/80">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-paper">{audience}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
