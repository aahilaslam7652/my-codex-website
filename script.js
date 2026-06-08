(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const year = document.querySelector("[data-year]");
  const hero = document.querySelector(".hero"); // ✅ new

  /* =============================
     YEAR
  ============================= */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =============================
     HEADER SCROLL
  ============================= */
  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* =============================
     MOBILE MENU
  ============================= */
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =============================
     ✅ HERO PARALLAX + SCROLL GLOW
  ============================= */

  if (hero) {
    hero.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      hero.style.setProperty("--mouseX", `${x}px`);
      hero.style.setProperty("--mouseY", `${y}px`);
    });

    hero.addEventListener("mouseleave", () => {
      hero.style.setProperty("--mouseX", `0px`);
      hero.style.setProperty("--mouseY", `0px`);
    });
  }

  /* glow moves on scroll */
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY * 0.3;
    document.documentElement.style.setProperty("--scrollY", `${scrollY}px`);
  }, { passive: true });

  /* =============================
     CANVAS SYSTEM (UNCHANGED)
  ============================= */

  const canvas = document.getElementById("tech-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0, active: false };
  const particles = [];
  const traces = [];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;

  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(320, rect.width);
    height = Math.max(420, rect.height);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedScene();
  }

  function seedScene() {
    particles.length = 0;
    traces.length = 0;

    const particleCount = Math.round(Math.min(115, Math.max(58, width / 13)));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.7 + Math.random() * 1.8,
        speed: 0.12 + Math.random() * 0.38,
        angle: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        tone: Math.random() > 0.72 ? "amber" : Math.random() > 0.45 ? "green" : "cyan",
      });
    }

    const traceCount = Math.round(Math.min(26, Math.max(14, width / 54)));
    for (let i = 0; i < traceCount; i++) {
      const y = height * (0.18 + Math.random() * 0.68);
      const x = width * (0.34 + Math.random() * 0.58);

      traces.push({
        x,
        y,
        length: 80 + Math.random() * 190,
        phase: Math.random() * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.012,
        vertical: Math.random() > 0.55,
      });
    }
  }

  function draw() {
    frame += prefersReducedMotion ? 0 : 1;

    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#040706");
    bg.addColorStop(0.42, "#081211");
    bg.addColorStop(1, "#06100f");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", fitCanvas, { passive: true });

  fitCanvas();
  draw();
})();
