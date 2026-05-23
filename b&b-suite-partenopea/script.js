(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const navLinks = document.querySelectorAll(".nav-links a, .nav-cta");
  const parallaxTarget = document.querySelector("[data-parallax]");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const whatsappNumber = "393331234567";

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  function closeMenu() {
    if (!navToggle || !navPanel) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Apri menu");
    navPanel.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function toggleMenu() {
    if (!navToggle || !navPanel) return;
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Apri menu" : "Chiudi menu");
    navPanel.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  }

  function setupRevealAnimations() {
    const elements = document.querySelectorAll(".reveal, .reveal-card");

    if (motionQuery.matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const siblings = Array.from(entry.target.parentElement.children).filter((child) =>
            child.classList.contains("reveal-card")
          );
          const index = siblings.indexOf(entry.target);

          if (index >= 0) {
            entry.target.style.transitionDelay = `${Math.min(index * 120, 360)}ms`;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function updateParallax() {
    if (!parallaxTarget || motionQuery.matches) return;
    const offset = Math.min(window.scrollY * 0.12, 90);
    parallaxTarget.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
  }

  function setupFormWhatsAppFallback() {
    const form = document.querySelector(".booking-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const message = [
        "Ciao B&B Suite Partenopea, vorrei richiedere disponibilita.",
        `Nome: ${formData.get("name")}`,
        `Email: ${formData.get("email")}`,
        `Telefono: ${formData.get("phone")}`,
        `Date: ${formData.get("arrival")} - ${formData.get("departure")}`,
        `Ospiti: ${formData.get("guests")}`,
        `Messaggio: ${formData.get("message") || "Nessuna nota"}`
      ].join("\n");

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    });
  }

  navToggle?.addEventListener("click", toggleMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1040) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  updateHeader();
  updateParallax();
  setupRevealAnimations();
  setupFormWhatsAppFallback();
})();
