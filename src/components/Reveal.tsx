import type { ReactNode } from "react";
import { cn } from "../lib/cn.ts";
import { useInView } from "../lib/useInView.ts";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, shown } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", shown && "is-shown", className)}
    >
      {children}
    </div>
  );
}
