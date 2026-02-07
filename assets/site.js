// /assets/site.js

async function injectPartial(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    host.innerHTML = await res.text();

    // After header is injected, wire up behaviors
    initHeaderBehavior();
    markActiveNav();
  } catch (err) {
    console.error(err);
    host.innerHTML = "";
  }
}

function markActiveNav() {
  // simple active nav highlighting by pathname
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const key =
    path === "/" ? "home" :
    path.endsWith("services.html") ? "services" :
    path.endsWith("contact.html") ? "contact" : "";

  if (!key) return;

  document.querySelectorAll(`[data-nav="${key}"]`).forEach(a => {
    a.classList.add("active");
  });
}

function initHeaderBehavior() {
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  if (!toggle || !drawer) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    drawer.hidden = isOpen;

    document.body.classList.toggle("no-scroll", !isOpen);
  });

  // close drawer on link click
  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      drawer.hidden = true;
      document.body.classList.remove("no-scroll");
    });
  });
}

// Inject shared header on every page that has <div id="site-header"></div>
document.addEventListener("DOMContentLoaded", () => {
  injectPartial("#site-header", "/partials/header.html");
});
