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
  if (!window.IntersectionObserver) return;

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
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
