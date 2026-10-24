import { useInView } from "../lib/useInView.ts";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  titleId,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  titleId?: string;
}) {
  const { ref, shown } = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} data-section-start="" data-shown={shown ? "true" : "false"}>
      <p className="section-kicker text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
        <span className="section-kicker-rule" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className="section-title mt-3 max-w-4xl text-balance text-[2rem] font-semibold uppercase leading-[0.98] tracking-[-0.03em] text-paper sm:text-5xl lg:text-[3.35rem]"
      >
        <span className="section-title-line">{title}</span>
      </h2>
      {intro ? (
        <p className="section-intro mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{intro}</p>
      ) : null}
    </div>
  );
}
