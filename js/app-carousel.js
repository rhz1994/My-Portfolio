(function () {
  var DEFAULT_BASE = "b2b-app/slides/";
  /** Ordning: dashboard först, sedan numrerade vyer, feature, sedan promo-bilder */
  var DEFAULT_FILES = [
    "1_dashboard.png",
    "2_applications.png",
    "3_companies.png",
    "4_discounts.png",
    "5_product.png",
    "b2b_feature.png",
    "promo-1.png",
    "promo-2.png",
    "promo-3.png",
    "promo-4.png",
  ];

  function t(key) {
    if (typeof window.I18n !== "undefined" && window.I18n.t) {
      return window.I18n.t("shopify." + key);
    }
    var fall = {
      appCarouselRegion: "Bildspel med skärmdumpar",
      appCarouselPrev: "Föregående bild",
      appCarouselNext: "Nästa bild",
      appCarouselGoto: "Gå till bild {n}",
      appImgAlt: "Förhandsvisning: appvy i Shopify Admin (instrumentpanel)",
    };
    return fall[key] || "";
  }

  /** För repo-karuseller: data-carousel-i18n-prefix, ev. repoCarouselImgAlt under projects */
  function translateForRoot(root, key) {
    var prefix = root.getAttribute("data-carousel-i18n-prefix");
    var mapKey = key;
    if (prefix === "projects" && key === "appImgAlt") {
      mapKey = "repoCarouselImgAlt";
    }
    if (prefix && typeof window.I18n !== "undefined" && window.I18n.t) {
      var v = window.I18n.t(prefix + "." + mapKey);
      if (v) return v;
    }
    return t(key);
  }

  function build(root) {
    if (!root || root.getAttribute("data-carousel-built")) return;
    root.setAttribute("data-carousel-built", "1");
    root.classList.add("app-carousel");

    var filesAttr = root.getAttribute("data-carousel-files");
    var customBase = root.getAttribute("data-carousel-base");
    var BASE;
    var FILES;
    if (filesAttr && String(filesAttr).trim()) {
      BASE =
        customBase && String(customBase).trim()
          ? String(customBase).endsWith("/")
            ? customBase
            : customBase + "/"
          : "assets/project-screenshots/";
      FILES = filesAttr
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
    } else {
      BASE = DEFAULT_BASE;
      FILES = DEFAULT_FILES.slice();
    }

    function T(key) {
      return translateForRoot(root, key);
    }

    function firstSlideAlt() {
      var key = root.getAttribute("data-carousel-first-alt-i18n");
      if (key && typeof window.I18n !== "undefined" && window.I18n.t) {
        var s = window.I18n.t(key);
        if (s) return s;
      }
      return T("appImgAlt");
    }

    function gotoTpl(n) {
      return T("appCarouselGoto").replace("{n}", String(n));
    }

    var viewport = document.createElement("div");
    viewport.className = "app-carousel-viewport";
    viewport.setAttribute("tabindex", "0");
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-label", T("appCarouselRegion"));

    var track = document.createElement("div");
    track.className = "app-carousel-track";

    FILES.forEach(function (file, i) {
      var slide = document.createElement("div");
      slide.className = "app-slide";
      var img = document.createElement("img");
      img.src = BASE + file;
      img.decoding = "async";
      img.loading = i < 2 ? "eager" : "lazy";
      slide.appendChild(img);
      track.appendChild(slide);
    });

    viewport.appendChild(track);

    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "app-carousel-fab app-carousel-fab--prev";
    prev.setAttribute("aria-label", T("appCarouselPrev"));
    prev.innerHTML =
      '<span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></span>';

    var next = document.createElement("button");
    next.type = "button";
    next.className = "app-carousel-fab app-carousel-fab--next";
    next.setAttribute("aria-label", T("appCarouselNext"));
    next.innerHTML =
      '<span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></span>';

    var meta = document.createElement("div");
    meta.className = "app-carousel-meta";

    var counter = document.createElement("span");
    counter.className = "app-carousel-counter";
    counter.setAttribute("aria-live", "polite");

    var dots = document.createElement("div");
    dots.className = "app-carousel-dots";

    meta.appendChild(counter);
    meta.appendChild(dots);

    var stage = document.createElement("div");
    stage.className = "app-carousel-stage";
    stage.appendChild(viewport);
    stage.appendChild(prev);
    stage.appendChild(next);
    root.appendChild(stage);
    root.appendChild(meta);

    var n = FILES.length;
    var imgs = track.querySelectorAll("img");

    function setAllSlideAlts() {
      var base = firstSlideAlt();
      for (var si = 0; si < imgs.length; si++) {
        imgs[si].alt = n <= 1 ? base : base + " (" + (si + 1) + "/" + n + ")";
      }
    }

    setAllSlideAlts();

    function slideWidth() {
      var first = track.querySelector(".app-slide");
      if (first && first.offsetWidth > 0) {
        return first.offsetWidth;
      }
      return viewport.clientWidth || 1;
    }

    function snapScrollToNearestSlide() {
      if (n < 1) return;
      var w = slideWidth();
      if (w < 1) return;
      var i = Math.max(0, Math.min(n - 1, Math.round(viewport.scrollLeft / w)));
      viewport.scrollLeft = i * w;
    }

    function currentIndex() {
      var w = slideWidth();
      return Math.round(viewport.scrollLeft / w);
    }

    function go(delta) {
      var w = slideWidth();
      var i = Math.max(0, Math.min(n - 1, currentIndex() + delta));
      viewport.scrollTo({ left: i * w, behavior: "smooth" });
    }

    function goTo(i) {
      var w = slideWidth();
      viewport.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * w, behavior: "smooth" });
    }

    function syncUi() {
      var i = currentIndex();
      counter.textContent = i + 1 + " / " + n;
      dots.querySelectorAll(".app-carousel-dot").forEach(function (dot, di) {
        var on = di === i;
        dot.classList.toggle("app-carousel-dot--active", on);
      });
    }

    function buildDots() {
      dots.innerHTML = "";
      for (var d = 0; d < n; d++) {
        (function (index) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "app-carousel-dot";
          b.setAttribute("aria-label", gotoTpl(index + 1));
          b.addEventListener("click", function () {
            goTo(index);
          });
          dots.appendChild(b);
        })(d);
      }
    }

    function refreshI18nStrings() {
      viewport.setAttribute("aria-label", T("appCarouselRegion"));
      prev.setAttribute("aria-label", T("appCarouselPrev"));
      next.setAttribute("aria-label", T("appCarouselNext"));
      dots.querySelectorAll(".app-carousel-dot").forEach(function (dot, di) {
        dot.setAttribute("aria-label", gotoTpl(di + 1));
      });
      setAllSlideAlts();
    }

    prev.addEventListener("click", function () {
      go(-1);
    });
    next.addEventListener("click", function () {
      go(1);
    });

    viewport.addEventListener(
      "scroll",
      function () {
        syncUi();
      },
      { passive: true }
    );

    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    });

    var ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(function () {
            snapScrollToNearestSlide();
            syncUi();
          })
        : null;
    if (ro) ro.observe(viewport);

    buildDots();
    snapScrollToNearestSlide();
    syncUi();

    document.addEventListener("portfolio:languagechange", refreshI18nStrings);

    window.addEventListener("resize", function () {
      snapScrollToNearestSlide();
      syncUi();
    });
  }

  function initAppCarouselsIn(container) {
    (container || document).querySelectorAll("[data-app-carousel]").forEach(function (node) {
      build(node);
    });
  }

  window.initAppCarouselsIn = initAppCarouselsIn;

  document.addEventListener("DOMContentLoaded", function () {
    initAppCarouselsIn(document);
  });
})();
