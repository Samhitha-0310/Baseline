import { images } from "../content/images.ts";
import { frameworkSteps } from "../data/site.ts";
import { cn } from "../lib/cn.ts";
import { useInView } from "../lib/useInView.ts";
import { Container } from "./Container.tsx";
import { FrameImage } from "./FrameImage.tsx";
import { SectionHeading } from "./SectionHeading.tsx";

export function Framework() {
  const { ref, shown } = useInView<HTMLOListElement>(0.2);

  return (
    <section id="approach" className="section-space border-t border-white/10 bg-charcoal">
      <Container>
        <SectionHeading
          eyebrow="Approach"
          title="How a project takes shape"
          intro="A simple process, kept close to the work itself."
        />
        <ol ref={ref} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {frameworkSteps.map((step, index) => (
            <li
              key={step.index}
              className={cn(
                "border border-white/10 bg-graphite transition duration-700 ease-out",
                shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
              )}
              style={{ transitionDelay: shown ? `${140 + index * 90}ms` : "0ms" }}
            >
              <figure className="frame-shot border-b border-white/10">
                <FrameImage
                  image={images[step.image]}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                />
              </figure>
              <div className="p-4">
                <p className="text-[11px] tabular-nums tracking-[0.18em] text-gold">{step.index}</p>
                <h3 className="mt-2 text-base font-semibold uppercase tracking-[0.14em] text-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
