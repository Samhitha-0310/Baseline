import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { cn } from "../lib/cn.ts";

type Variant = "solid" | "line";

const variants: Record<Variant, string> = {
  solid:
    "border border-gold bg-gold text-graphite hover:bg-gold-bright hover:border-gold-bright",
  line: "border border-paper/30 bg-transparent text-paper hover:border-gold hover:text-gold",
};

const base =
  "btn-shine inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] transition-[color,background-color,border-color,transform] duration-300";

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a href={href} onClick={onClick} className={cn(base, variants[variant], className)}>
      {children}
    </a>
  );
}

export function Button({
  children,
  variant = "solid",
  className,
  type = "button",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, variants[variant], "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>
      {children}
    </button>
  );
}
