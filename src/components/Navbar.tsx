import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { navItems } from "../data/site.ts";
import { cn } from "../lib/cn.ts";
import { onSectionLink, scrollToId } from "../lib/scrollTo.ts";
import { ButtonLink } from "./Button.tsx";
import { Logo } from "./Logo.tsx";

const FOCUSABLE = "a[href], button:not([disabled])";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const previousPad = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = previousPad;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = menuRef.current;
    const closeButton = toggleRef.current;
    const nodes = [
      closeButton,
      ...(root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : []),
    ].filter((node): node is HTMLElement => Boolean(node));
    nodes[1]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const run = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || id === "top") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      scrollToId(id);
    };
    window.addEventListener("hashchange", run);
    window.addEventListener("popstate", run);
    return () => {
      window.removeEventListener("hashchange", run);
      window.removeEventListener("popstate", run);
    };
  }, []);

  const close = () => setOpen(false);

  const follow = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    setOpen(false);
    onSectionLink(id)(event);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-t border-gold transition-colors duration-300",
        scrolled || open ? "border-b border-b-white/10 bg-graphite" : "border-b border-b-transparent bg-graphite",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:h-[72px] sm:px-8 lg:px-10">
        <Logo onClick={close} />
        <nav aria-label="Primary" className="hidden items-center gap-5 xl:gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={follow(item.id)}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "nav-link text-[11px] font-medium uppercase tracking-[0.16em] transition-colors xl:text-[12px] xl:tracking-[0.18em]",
                active === item.id ? "text-gold" : "text-paper/75",
              )}
            >
              {item.label}
            </a>
          ))}
          <ButtonLink href="#contact" className="px-5" onClick={follow("contact")}>
            Let&apos;s Talk
          </ButtonLink>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="grid h-11 w-11 place-items-center border border-white/15 text-paper transition-colors duration-300 hover:border-gold lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        ref={menuRef}
        className={cn("mobile-nav fixed inset-0 top-16 z-40 bg-graphite sm:top-[72px] lg:hidden", open && "is-open")}
        inert={!open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex h-full flex-col px-6 py-8">
          {navItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={follow(item.id)}
              className={cn(
                "flex items-baseline gap-4 border-b border-white/10 py-5 text-3xl font-semibold uppercase tracking-[-0.03em] transition duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
              style={{ transitionDelay: open ? `${80 + index * 50}ms` : "0ms" }}
            >
              <span className="text-xs font-medium tracking-[0.2em] text-gold">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
          <ButtonLink href="#contact" className="mt-8 w-full" onClick={follow("contact")}>
            Let&apos;s Talk
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
