function resetToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function startAtTop() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (window.location.hash) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  resetToTop();
  requestAnimationFrame(resetToTop);
  window.addEventListener("load", resetToTop, { once: true });
}
