document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

requestAnimationFrame(() => {
  document.body.classList.add("is-loaded");
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();

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

updateScrollState();

document.querySelectorAll(".interactive-glass").forEach((surface) => {
  surface.addEventListener("pointermove", (event) => {
    const bounds = surface.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    surface.style.setProperty("--pointer-x", `${x.toFixed(1)}%`);
    surface.style.setProperty("--pointer-y", `${y.toFixed(1)}%`);
  });

  surface.addEventListener("pointerleave", () => {
    surface.style.removeProperty("--pointer-x");
    surface.style.removeProperty("--pointer-y");
  });
});

const parallaxArea = document.querySelector("[data-parallax]");
const portrait = document.querySelector(".portrait-card");

if (parallaxArea && portrait && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  parallaxArea.addEventListener("pointermove", (event) => {
    const bounds = parallaxArea.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

    portrait.style.setProperty("--parallax-x", `${(normalizedX * 13).toFixed(2)}px`);
    portrait.style.setProperty("--parallax-y", `${(normalizedY * 10).toFixed(2)}px`);
    portrait.style.setProperty("--parallax-rx", `${(-normalizedY * 3).toFixed(2)}deg`);
    portrait.style.setProperty("--parallax-ry", `${(normalizedX * 4).toFixed(2)}deg`);
  });

  parallaxArea.addEventListener("pointerleave", () => {
    ["--parallax-x", "--parallax-y", "--parallax-rx", "--parallax-ry"].forEach((property) =>
      portrait.style.removeProperty(property),
    );
  });
}

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      button.style.transform = `translate3d(${(x * 0.12).toFixed(1)}px, ${(y * 0.16).toFixed(1)}px, 0)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "translate3d(0, 0, 0)";
    });
  });
}

document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});
