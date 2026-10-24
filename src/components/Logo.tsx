import { brand } from "../data/site.ts";
import { onSectionLink } from "../lib/scrollTo.ts";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#top"
      onClick={(event) => {
        onClick?.();
        onSectionLink("top")(event);
      }}
      className="group inline-flex items-center gap-3 text-paper"
    >
      <span className="relative grid h-8 w-8 shrink-0 place-items-center border border-paper/25 text-[13px] font-semibold tracking-normal">
        B
        <span className="absolute bottom-[5px] left-1.5 right-1.5 h-px bg-gold" />
      </span>
      <span className="text-[13px] font-semibold uppercase tracking-[0.22em]">{brand.name}</span>
    </a>
  );
}
