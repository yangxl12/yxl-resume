document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

requestAnimationFrame(() => {
  document.body.classList.add("is-loaded");
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav__links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

let ticking = false;

function updateScrollState() {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? Math.min(1, window.scrollY / documentHeight) : 0;
  nav.style.setProperty("--scroll-progress", progress.toFixed(4));

  const activationLine = window.scrollY + window.innerHeight * 0.34;
  let currentId = "";

  sections.forEach((section) => {
    if (section.offsetTop <= activationLine) currentId = section.id;
  });

  if (window.scrollY >= documentHeight - 2 && sections.length) {
    currentId = sections[sections.length - 1].id;
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollState);
  },
  { passive: true },
);

window.addEventListener("resize", updateScrollState, { passive: true });

updateScrollState();
