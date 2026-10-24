import { brand, navItems } from "../data/site.ts";
import { onSectionLink } from "../lib/scrollTo.ts";
import { Container } from "./Container.tsx";
import { Logo } from "./Logo.tsx";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-graphite">
      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-lg leading-snug text-paper">{brand.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{brand.statement}</p>
          </div>
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Navigation</p>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={onSectionLink(item.id)} className="footer-link text-sm text-paper/80 hover:text-paper">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Contact</p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-3 inline-block text-sm text-paper underline decoration-gold/50 underline-offset-4 hover:text-gold"
            >
              {brand.email}
            </a>
            <ul className="mt-4 space-y-2">
              {brand.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="text-sm text-paper underline decoration-gold/50 underline-offset-4 hover:text-gold"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-white/10 pt-4 text-xs tracking-wide text-muted">
          © 2026 Baseline Corp. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
