(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    nav.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var tabProjects = document.getElementById("tab-work-projects");
  var tabShopify = document.getElementById("tab-work-shopify");
  var panelProjects = document.getElementById("projekt");
  var panelShopify = document.getElementById("shopify");
  var tablist = document.querySelector(".work-tabs");

  if (tabProjects && tabShopify && panelProjects && panelShopify) {
  var WORK_TAB_STORAGE = "portfolio-work-tab";

  function activateWorkTab(which) {
    var shop = which === "shopify";
    panelProjects.hidden = shop;
    panelShopify.hidden = !shop;
    tabProjects.setAttribute("aria-selected", shop ? "false" : "true");
    tabShopify.setAttribute("aria-selected", shop ? "true" : "false");
    tabProjects.tabIndex = shop ? -1 : 0;
    tabShopify.tabIndex = shop ? 0 : -1;
    try {
      sessionStorage.setItem(WORK_TAB_STORAGE, shop ? "shopify" : "projects");
    } catch (e) {}
  }

  function scrollWorkPanelIntoView(id) {
    var el = document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(function () {
      el.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }

  function syncWorkFromHash() {
    var h = location.hash;
    if (h === "#shopify") {
      activateWorkTab("shopify");
      scrollWorkPanelIntoView("shopify");
    } else if (h === "#projekt") {
      activateWorkTab("projects");
      scrollWorkPanelIntoView("projekt");
    } else if (h === "#arbete") {
      var saved = sessionStorage.getItem(WORK_TAB_STORAGE);
      activateWorkTab(saved === "shopify" ? "shopify" : "projects");
      scrollWorkPanelIntoView("arbete");
    }
  }

  function initWorkOnLoad() {
    var h = location.hash;
    if (h === "#shopify" || h === "#projekt" || h === "#arbete") {
      syncWorkFromHash();
      return;
    }
    var saved = sessionStorage.getItem(WORK_TAB_STORAGE);
    if (saved === "shopify") {
      activateWorkTab("shopify");
    } else {
      activateWorkTab("projects");
    }
  }

  tabProjects.addEventListener("click", function () {
    activateWorkTab("projects");
    history.replaceState(null, "", "#projekt");
    scrollWorkPanelIntoView("arbete");
  });

  tabShopify.addEventListener("click", function () {
    activateWorkTab("shopify");
    history.replaceState(null, "", "#shopify");
    scrollWorkPanelIntoView("arbete");
  });

  if (tablist) {
    tablist.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var from = document.activeElement;
      if (e.key === "ArrowRight" && from === tabProjects) {
        e.preventDefault();
        tabShopify.focus();
        activateWorkTab("shopify");
        history.replaceState(null, "", "#shopify");
        scrollWorkPanelIntoView("arbete");
      } else if (e.key === "ArrowLeft" && from === tabShopify) {
        e.preventDefault();
        tabProjects.focus();
        activateWorkTab("projects");
        history.replaceState(null, "", "#projekt");
        scrollWorkPanelIntoView("arbete");
      }
    });
  }

  window.addEventListener("hashchange", syncWorkFromHash);

  initWorkOnLoad();
  }
})();

(function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;
  if (!window.lottie) return;

  var lottieHolders = Array.prototype.slice.call(
    document.querySelectorAll("[data-lottie-scroll]")
  );
  if (!lottieHolders.length) return;

  lottieHolders.forEach(function (holder) {
    var src = holder.getAttribute("data-lottie-src");
    if (!src) return;
    var startZoneEl = document.getElementById("arbete");
    var endZoneEl = document.getElementById("kontakt");

    var state = {
      animation: null,
      totalFrames: 0,
      ticking: false,
      currentFrame: 0,
    };

    function easeInOutCubic(t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function getScrollZoneProgress() {
      if (!startZoneEl || !endZoneEl) {
        var scrollTop = window.scrollY || window.pageYOffset;
        var maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        return { progress: Math.min(Math.max(scrollTop / maxScroll, 0), 1), inZone: true };
      }

      var scrollTop = window.scrollY || window.pageYOffset;
      var zoneStart = Math.max(0, startZoneEl.offsetTop - window.innerHeight * 0.35);
      var zoneEnd =
        endZoneEl.offsetTop + endZoneEl.offsetHeight - window.innerHeight * 0.45;
      var zoneRange = Math.max(zoneEnd - zoneStart, 1);
      var raw = (scrollTop - zoneStart) / zoneRange;
      var clamped = Math.min(Math.max(raw, 0), 1);
      return { progress: clamped, inZone: raw >= 0 && raw <= 1.04 };
    }

    function paintFrame() {
      if (!state.animation || !state.totalFrames) {
        state.ticking = false;
        return;
      }
      var zone = getScrollZoneProgress();
      var easedProgress = easeInOutCubic(zone.progress);
      var targetFrame = easedProgress * (state.totalFrames - 1);
      state.currentFrame += (targetFrame - state.currentFrame) * 0.22;
      if (Math.abs(targetFrame - state.currentFrame) < 0.08) {
        state.currentFrame = targetFrame;
      }
      holder.classList.toggle("is-active", zone.inZone);
      state.animation.goToAndStop(state.currentFrame, true);
      state.ticking = false;
    }

    function requestFramePaint() {
      if (state.ticking) return;
      state.ticking = true;
      requestAnimationFrame(paintFrame);
    }

    var animation = window.lottie.loadAnimation({
      container: holder,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: src,
      rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
    });

    animation.addEventListener("DOMLoaded", function () {
      state.animation = animation;
      state.totalFrames = Math.max(1, Math.floor(animation.totalFrames || 1));
      holder.classList.add("is-ready");
      requestFramePaint();
    });

    window.addEventListener("scroll", requestFramePaint, { passive: true });
    window.addEventListener("resize", requestFramePaint);
  });
})();

(function () {
  if (!window.IntersectionObserver) return;

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  function observeRevealEl(el) {
    revealObserver.observe(el);
  }

  document.querySelectorAll(".reveal").forEach(observeRevealEl);

  if (window.MutationObserver) {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains("reveal")) {
            observeRevealEl(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll(".reveal").forEach(observeRevealEl);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();

(function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var progressBar = document.querySelector(".scroll-progress-bar");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main .section"));
  var ticking = false;

  function updateScrollProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || window.pageYOffset;
    var maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    var ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    progressBar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
  }

  function requestProgressUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateScrollProgress();
      ticking = false;
    });
  }

  updateScrollProgress();
  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);

  if (!window.IntersectionObserver || !sections.length) return;
  if (reducedMotion) return;

  var activeIndex = 0;
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active-section");
          activeIndex = sections.indexOf(entry.target);
          if (activeIndex < 0) activeIndex = 0;
          var tint = Math.min(0.18, 0.05 + activeIndex * 0.03);
          document.documentElement.style.setProperty(
            "--section-tint-opacity",
            tint.toFixed(2)
          );
        } else {
          entry.target.classList.remove("is-active-section");
        }
      });
    },
    { threshold: 0.45, rootMargin: "-8% 0px -30% 0px" }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
})();

(function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  var hero = document.querySelector(".hero");
  var heroContent = document.querySelector(".hero-content");
  var interactiveEls = Array.prototype.slice.call(
    document.querySelectorAll(".card")
  );

  if (reducedMotion || coarsePointer) return;

  if (hero && heroContent) {
    var heroTicking = false;
    var heroX = 0;
    var heroY = 0;

    function paintHeroParallax() {
      heroContent.style.setProperty("--hero-x", heroX.toFixed(2) + "px");
      heroContent.style.setProperty("--hero-y", heroY.toFixed(2) + "px");
      heroTicking = false;
    }

    hero.addEventListener("pointermove", function (e) {
      var rect = hero.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroX = relX * 7;
      heroY = relY * 5;
      if (heroTicking) return;
      heroTicking = true;
      requestAnimationFrame(paintHeroParallax);
    });

    hero.addEventListener("pointerleave", function () {
      heroX = 0;
      heroY = 0;
      if (heroTicking) return;
      heroTicking = true;
      requestAnimationFrame(paintHeroParallax);
    });
  }

  interactiveEls.forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var rect = el.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      var maxShift = 3;
      var dx = relX * maxShift * 2;
      var dy = relY * maxShift * 2;
      el.style.setProperty("--magnet-x", dx.toFixed(2) + "px");
      el.style.setProperty("--magnet-y", dy.toFixed(2) + "px");
      if (el.classList.contains("card")) {
        var spotX = ((e.clientX - rect.left) / rect.width) * 100;
        var spotY = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--spotlight-x", spotX.toFixed(2) + "%");
        el.style.setProperty("--spotlight-y", spotY.toFixed(2) + "%");
      }
    });

    el.addEventListener("pointerleave", function () {
      el.style.setProperty("--magnet-x", "0px");
      el.style.setProperty("--magnet-y", "0px");
    });
  });
})();

(function () {
  var frame = document.getElementById("cover-pdf-frame");
  var missing = document.getElementById("cover-pdf-missing");
  var wrap = document.getElementById("cover-embed-wrap");
  var dl = document.getElementById("cover-download");
  if (!frame || !missing) return;

  function showMissing() {
    missing.hidden = false;
    frame.hidden = true;
    if (wrap) wrap.classList.add("doc-embed-wrap--empty");
    if (dl) dl.hidden = true;
  }

  function showCoverPdf() {
    frame.src = "assets/personligt-brev.pdf#view=FitH";
    frame.removeAttribute("hidden");
    missing.hidden = true;
    if (wrap) wrap.classList.remove("doc-embed-wrap--empty");
    if (dl) dl.hidden = false;
  }

  function pdfReachable(url) {
    return fetch(url, { method: "HEAD", cache: "no-store" }).then(function (res) {
      if (res.ok) return true;
      if (res.status === 405 || res.status === 501) {
        return fetch(url, {
          method: "GET",
          cache: "no-store",
          headers: { Range: "bytes=0-0" },
        }).then(function (r2) {
          return r2.ok;
        });
      }
      return false;
    });
  }

  pdfReachable("assets/personligt-brev.pdf")
    .then(function (ok) {
      if (ok) showCoverPdf();
      else showMissing();
    })
    .catch(function () {
      showMissing();
    });
})();
