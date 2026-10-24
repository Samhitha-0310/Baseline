import type { MouseEvent } from "react";

function motion(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function layoutTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

export function scrollToId(id: string) {
  const behavior = motion();
  if (!id || id === "top" || id === "main") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const section = document.getElementById(id);
  if (!section) return;
  const target = section.querySelector<HTMLElement>("[data-section-start]") ?? section;
  const header = document.querySelector("header");
  const offset = (header?.getBoundingClientRect().height ?? 72) + 16;
  window.scrollTo({ top: Math.max(0, layoutTop(target) - offset), behavior });
}

export function onSectionLink(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToId(id);
    const next = id === "top" || id === "main" ? "#top" : `#${id}`;
    if (window.location.hash !== next) history.pushState(null, "", next);
  };
}
