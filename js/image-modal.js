(function () {
  var modal;
  var imgEl;
  var siteLink;
  var prevBtn;
  var nextBtn;
  var galleryCounter;
  var lastFocus = null;
  /** @type {{ src: string, alt: string }[]} */
  var modalGallery = [];
  var galleryIndex = 0;

  function t(path) {
    if (typeof window.I18n !== "undefined" && window.I18n.t) {
      return window.I18n.t(path);
    }
    return "";
  }

  function galleryFromCarouselImg(img) {
    var carousel = img.closest(".app-carousel");
    if (!carousel) return null;
    var nodes = carousel.querySelectorAll(".app-slide img");
    if (nodes.length < 2) return null;
    var items = [];
    for (var i = 0; i < nodes.length; i++) {
      items.push({
        src: nodes[i].currentSrc || nodes[i].src,
        alt: nodes[i].alt != null ? nodes[i].alt : "",
      });
    }
    var idx = 0;
    for (var j = 0; j < nodes.length; j++) {
      if (nodes[j] === img) {
        idx = j;
        break;
      }
    }
    return { items: items, index: idx };
  }

  function clearModalImageCaps() {
    if (!imgEl) return;
    imgEl.style.removeProperty("max-width");
    imgEl.style.removeProperty("max-height");
  }

  /** Undvik uppskalning av lågupplösta PNG:er (min(100%, intrinsic) = skarpare i modal). */
  function applyModalImageCaps() {
    if (!imgEl) return;
    var nw = imgEl.naturalWidth;
    var nh = imgEl.naturalHeight;
    if (nw < 1 || nh < 1) return;
    imgEl.style.setProperty("max-width", "min(100%, " + nw + "px)");
    imgEl.style.setProperty("max-height", "min(100%, " + nh + "px)");
  }

  function applyModalImage() {
    if (!imgEl || !modalGallery.length) return;
    var item = modalGallery[galleryIndex];
    if (!item) return;
    clearModalImageCaps();
    function afterLoad() {
      imgEl.onload = null;
      applyModalImageCaps();
    }
    imgEl.onload = afterLoad;
    imgEl.src = item.src;
    imgEl.alt = item.alt != null ? item.alt : "";
    if (imgEl.complete) {
      afterLoad();
    }
  }

  function updateGalleryUi() {
    var multi = modalGallery.length > 1;
    if (prevBtn) {
      prevBtn.hidden = !multi;
      prevBtn.disabled = !multi || galleryIndex <= 0;
    }
    if (nextBtn) {
      nextBtn.hidden = !multi;
      nextBtn.disabled = !multi || galleryIndex >= modalGallery.length - 1;
    }
    if (galleryCounter) {
      galleryCounter.hidden = !multi;
      if (multi) {
        galleryCounter.textContent = galleryIndex + 1 + " / " + modalGallery.length;
      }
    }
  }

  function galleryStep(delta) {
    if (modalGallery.length < 2) return;
    var n = modalGallery.length;
    galleryIndex = Math.max(0, Math.min(n - 1, galleryIndex + delta));
    applyModalImage();
    updateGalleryUi();
  }

  function openModal(opts) {
    opts = opts || {};
    if (!modal || !imgEl) return;
    lastFocus = document.activeElement;

    siteLink.hidden = true;
    siteLink.removeAttribute("href");

    if (opts.gallery && opts.gallery.length) {
      modalGallery = opts.gallery.slice();
      galleryIndex = Math.max(0, Math.min(modalGallery.length - 1, opts.galleryIndex || 0));
    } else {
      var src = opts.src || "";
      if (!src) return;
      modalGallery = [{ src: src, alt: opts.alt != null ? opts.alt : "" }];
      galleryIndex = 0;
    }

    applyModalImage();
    updateGalleryUi();

    if (opts.siteUrl) {
      siteLink.hidden = false;
      siteLink.setAttribute("href", opts.siteUrl);
      siteLink.textContent = t("modal.visitSite");
    } else {
      siteLink.hidden = true;
      siteLink.removeAttribute("href");
    }
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".image-modal-close");
    if (closeBtn && closeBtn.focus) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hasAttribute("hidden")) return;
    modal.setAttribute("hidden", "");
    clearModalImageCaps();
    imgEl.removeAttribute("src");
    imgEl.alt = t("modal.previewImgAlt") || "";
    modalGallery = [];
    galleryIndex = 0;
    updateGalleryUi();
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  }

  function onDocClick(e) {
    var target = e.target;
    if (!target || !modal || modal.contains(target)) return;

    var thumbOpen = target.closest(".card-thumb-open");
    if (thumbOpen && thumbOpen.getAttribute("data-modal-src")) {
      e.preventDefault();
      openModal({
        src: thumbOpen.getAttribute("data-modal-src"),
        siteUrl: thumbOpen.getAttribute("data-modal-site") || "",
      });
      return;
    }

    if (target.tagName === "IMG" && target.closest(".app-slide")) {
      var cardEl = target.closest("article.card");
      var visitFromCard = (cardEl && cardEl.getAttribute("data-visit-site")) || "";
      var cg = galleryFromCarouselImg(target);
      if (cg) {
        e.preventDefault();
        openModal({ gallery: cg.items, galleryIndex: cg.index, siteUrl: visitFromCard });
      } else {
        openModal({
          src: target.currentSrc || target.src,
          alt: target.alt || "",
          siteUrl: visitFromCard,
        });
      }
      return;
    }

    var repoShot = target.closest(".card-repo-shot");
    if (repoShot && target.tagName === "IMG") {
      var img = target;
      var cardForShot = img.closest("article.card");
      var visitShot = (cardForShot && cardForShot.getAttribute("data-visit-site")) || "";
      openModal({ src: img.currentSrc || img.src, alt: img.alt || "", siteUrl: visitShot });
    }
  }

  function onModalClick(e) {
    if (e.target.closest("[data-image-modal-close]")) {
      closeModal();
      return;
    }
    if (e.target.closest("[data-image-modal-prev]")) {
      e.preventDefault();
      galleryStep(-1);
      return;
    }
    if (e.target.closest("[data-image-modal-next]")) {
      e.preventDefault();
      galleryStep(1);
    }
  }

  function onKeydown(e) {
    if (!modal || modal.hasAttribute("hidden")) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (modalGallery.length > 1) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        galleryStep(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        galleryStep(1);
      }
    }
  }

  function refreshModalI18n() {
    if (!modal || !siteLink) return;
    var closeBtn = modal.querySelector(".image-modal-close");
    var lbl = t("modal.close");
    if (closeBtn && lbl) closeBtn.setAttribute("aria-label", lbl);
    if (!siteLink.hidden && siteLink.getAttribute("href")) {
      siteLink.textContent = t("modal.visitSite");
    }
    var gp = t("modal.galleryPrev");
    var gn = t("modal.galleryNext");
    if (prevBtn && gp) prevBtn.setAttribute("aria-label", gp);
    if (nextBtn && gn) nextBtn.setAttribute("aria-label", gn);
  }

  function wire() {
    modal = document.getElementById("image-modal");
    imgEl = document.getElementById("image-modal-img");
    siteLink = document.getElementById("image-modal-site");
    prevBtn = document.getElementById("image-modal-prev");
    nextBtn = document.getElementById("image-modal-next");
    galleryCounter = document.getElementById("image-modal-gallery-counter");
    if (!modal || !imgEl || !siteLink) return;

    modal.addEventListener("click", onModalClick);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("portfolio:languagechange", refreshModalI18n);
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
