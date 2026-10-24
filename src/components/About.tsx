import { images } from "../content/images.ts";
import { principles } from "../data/site.ts";
import { Container } from "./Container.tsx";
import { FrameImage } from "./FrameImage.tsx";
import { Reveal } from "./Reveal.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

export function About() {
  return (
    <section id="about" className="section-space border-t border-white/10 bg-graphite">
      <Container>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <SectionHeading eyebrow="About" title="Every brand has a story worth telling." />
            <div className="mt-4 max-w-xl space-y-3 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              <p>
                Baseline is a creative content studio. We turn ideas, products, and identities into considered visual
                work — photography and digital assets shaped around how a brand wants to be seen.
              </p>
              <p>
                Much of the work on this site is hospitality stills: plates, glasses, and café details made for menus,
                campaigns, and the places a brand lives online.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 items-start gap-3 sm:gap-4 lg:col-span-6">
            <Reveal className="self-start" delay={60}>
              <figure className="frame-shot border border-white/10">
                <FrameImage image={images.latteHand} sizes="(min-width: 1024px) 24vw, 50vw" />
              </figure>
            </Reveal>
            <Reveal className="mt-4 self-start sm:mt-8" delay={120}>
              <figure className="frame-shot border border-white/10">
                <FrameImage image={images.pizzaLounge} sizes="(min-width: 1024px) 24vw, 50vw" />
              </figure>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <figure className="relative mt-10 pl-6 sm:mt-12 sm:pl-8">
            <span className="quote-bar" aria-hidden="true" />
            <blockquote>
              <p className="display-quote max-w-5xl text-3xl leading-[1.12] text-paper sm:text-4xl lg:text-5xl">
                <span className="block">We turn ideas, products, and identities</span>
                <span className="mt-2 block text-gold">into compelling visual experiences.</span>
              </p>
            </blockquote>
          </figure>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-x-8 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4">
          {principles.map((principle, index) => (
            <li key={principle.index} className="border-t border-white/10 py-5">
              <Reveal delay={index * 70}>
                <p className="text-sm tabular-nums tracking-[0.18em] text-gold">{principle.index}</p>
                <h3 className="mt-3 text-xl font-semibold uppercase tracking-[0.12em] text-paper">{principle.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{principle.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
