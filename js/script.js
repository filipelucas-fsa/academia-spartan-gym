/* =========================================================
   SPARTA GYM — INTERAÇÕES
   Vanilla JS puro (sem dependências externas) para manter
   o carregamento leve e a pontuação de performance alta.
   ========================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: estado ao rolar ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Scroll indicator da Hero ---------- */
  var scrollIndicator = document.getElementById("scrollIndicator");
  if (scrollIndicator) {
    function onScrollIndicator() {
      if (window.scrollY > 80) {
        scrollIndicator.classList.add("is-hidden");
      } else if (window.scrollY < 40) {
        scrollIndicator.classList.remove("is-hidden");
      }
    }
    onScrollIndicator();
    window.addEventListener("scroll", onScrollIndicator, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var navBackdrop = document.getElementById("navBackdrop");

  function setMenuOpen(open) {
    mainNav.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (navBackdrop) navBackdrop.classList.toggle("open", open);
    document.body.classList.toggle("nav-locked", open);
  }

  navToggle.addEventListener("click", function () {
    setMenuOpen(!mainNav.classList.contains("open"));
  });

  if (navBackdrop) {
    navBackdrop.addEventListener("click", function () { setMenuOpen(false); });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mainNav.classList.contains("open")) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () { setMenuOpen(false); });
  });

  /* ---------- Nav ativo conforme seção visível ---------- */
  var sections = document.querySelectorAll("main section[id], .hero[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active-link", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach(function (section) { navObserver.observe(section); });

  /* ---------- Reveal ao rolar ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Parallax discreto no Hero ---------- */
  var heroMedia = document.getElementById("heroMedia");
  var heroImg = heroMedia ? heroMedia.querySelector(".hero-img") : null;

  if (heroImg && !prefersReducedMotion) {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var offset = window.scrollY * 0.25;
            heroImg.style.transform = "scale(1.08) translateY(" + Math.min(offset, 120) + "px)";
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------- Carrossel de depoimentos ---------- */
  var track = document.getElementById("testimonialTrack");
  var dotsWrap = document.getElementById("carouselDots");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var current = 0;
    var autoplayId = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Ir para depoimento " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + current * 100 + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      clearInterval(autoplayId);
      autoplayId = setInterval(function () { goTo(current + 1); }, 6000);
    }
    function resetAutoplay() {
      clearInterval(autoplayId);
      startAutoplay();
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1); resetAutoplay(); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); resetAutoplay(); });

    var carouselWrap = document.getElementById("testimonialCarousel");
    carouselWrap.addEventListener("mouseenter", function () { clearInterval(autoplayId); });
    carouselWrap.addEventListener("mouseleave", startAutoplay);

    /* Pausa autoplay fora da viewport e quando a aba fica oculta */
    if ("IntersectionObserver" in window && carouselWrap) {
      var carouselObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              startAutoplay();
            } else {
              clearInterval(autoplayId);
            }
          });
        },
        { threshold: 0.2 }
      );
      carouselObs.observe(carouselWrap);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearInterval(autoplayId);
      } else if (carouselWrap && carouselWrap.getBoundingClientRect().bottom > 0 && carouselWrap.getBoundingClientRect().top < window.innerHeight) {
        startAutoplay();
      }
    });

    /* Suporte a swipe em touch */
    var touchStartX = 0;
    track.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener(
      "touchend",
      function (e) {
        var delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
          goTo(current + (delta < 0 ? 1 : -1));
          resetAutoplay();
        }
      },
      { passive: true }
    );

    goTo(0);
    startAutoplay();
  }
})();
