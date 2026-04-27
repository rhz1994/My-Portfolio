(function () {
  var STORAGE = "portfolio-lang";

  var STR = {
    sv: {
      meta: {
        description:
          "Rasmus Hanzén — fullstack- och Shopify-utvecklare. Utvalda GitHub-projekt, Shopify-case, CV, personligt brev och kontakt.",
        ogImageAlt: "Rasmus Hanzén — utdrag ur portfolio och Shopify-arbete",
      },
      title: "Rasmus Hanzén",
      nav: {
        aria: "Huvudmeny",
        menu: "Meny",
        home: "Hem",
        projects: "Egna projekt",
        shopify: "Shopify",
        cv: "CV",
        cover: "Personligt brev",
        contact: "Kontakt",
        langSv: "Svenska",
        langEn: "English",
        langHint: "Byt språk",
        workTabsAria: "Växla mellan projekt och Shopify",
      },
      hero: {
        h1: 'Hej — Mitt namn är <span class="hero-accent">Rasmus Hanzén</span>.',
        tagline:
          "Fullstack- och Shopify-utvecklare (JavaScript/TypeScript, React, Vue, Node). Studerar vid IT-Högskolan med examen 2026. Här finns utvalda projekt från GitHub, Shopify-case, CV och kontakt.",
        ctaProjects: "Se projekt",
        github: "GitHub",
        cv: "CV",
        ctaContact: "Boka intro",
      },
      projects: {
        title: "Egna projekt",
        loading: "Laddar projekt från GitHub …",
        leadFallback:
          'Här visas en inbakad projektlista. För att hämta listan live från GitHub behöver sidan köras över <strong>https</strong> (t.ex. publicerad på GitHub Pages eller lokalt med <code style="color:var(--accent)">npx serve .</code>).',
        appCarouselRegion: "Bildspel med skärmdumpar från projektet",
        appCarouselPrev: "Föregående bild",
        appCarouselNext: "Nästa bild",
        appCarouselGoto: "Gå till bild {n}",
        repoCarouselImgAlt: "Skärmdump från projektet",
        repoThumbAlt: "Skärmdump: {title}",
        cardGithub: "GitHub",
        repoFallback: "Publikt GitHub-repo.",
        mobileAppPill: "Mobilapp",
        webProjectPill: "Webbsida",
      },
      shopify: {
        title: "Shopify",
        lead: "Urval av Shopify-arbete: storefront med tema, Liquid och metafält, GraphQL mot externa API:er, samt en inbäddad B2B-app i Admin för grossistflöden.",
        skillsAria: "Öppna skillscombined.se i ny flik (förhandsvisning)",
        skillsTitle: "Skills Combined",
        skillsDesc:
          "Shopify-butik för varumärket Skills Combined (makeup och hudvård): blogg och storefront, skräddarsydd bundle-lösning så lagret kunde skriva ut korrekta etiketter. Tema, Liquid och kopplingar i Node/GraphQL.",
        fldAria: "Öppna finelittleday.com i ny flik (förhandsvisning)",
        fldTitle: "Fine Little Day",
        fldDesc:
          "Butik för livsstilsvarumärket: mega- och mobilmeny, produkter, kommande sidor och flerspråkigt innehåll i temat.",
        hannaTitle: "Hanna Instruments",
        hannaDesc:
          "Backend: Shopify GraphQL med integration mot API:et för den tidigare e-handelslösningen — produktdata och migrering.",
        appPill: "Shopify-app",
        storePill: "Tema & utveckling",
        appImgAlt: "Förhandsvisning: appvy i Shopify Admin (instrumentpanel)",
        skillsCarouselImgAlt:
          "Förhandsvisning: Skills Combined — storefront och bundleflöde",
        fldCarouselImgAlt:
          "Förhandsvisning: Fine Little Day — butik och navigation",
        hannaCarouselImgAlt:
          "Förhandsvisning: Hanna Instruments — Shopify och produktdata",
        gronagardarTitle: "Gröna gårdar",
        gronagardarDesc:
          "Shopify-butik för ekologiskt gräsbeteskött och mathantverk från Västsverige: produktpresentation, köttlådor och beställningsflöde i temat.",
        gronagardarCarouselImgAlt:
          "Förhandsvisning: Gröna gårdar — storefront och produkter",
        appCarouselRegion: "Bildspel med skärmdumpar",
        appCarouselPrev: "Föregående bild",
        appCarouselNext: "Nästa bild",
        appCarouselGoto: "Gå till bild {n}",
        appTitle: "B2B-app",
        appBody:
          "Egen lösning med <strong>PostgreSQL</strong>, <strong>TypeScript</strong> och React Router 7, <strong>Liquid</strong>, moms och valutor — inbäddad B2B-app i Admin.",
        appFootnote:
          "Ingen publik App Store- eller installationslänk ännu; bilderna ovan är från appen i Shopify Admin (B2B/grossist).",
        credlyBlockAria: "Verifierad Shopify-kompetens via Credly",
        credlyTitle: "Verifierad kompetens",
        credlyLead:
          "Shopify Development Fundamentals — verifierad kunskapsbadge (Credly), utgiven av Shopify.",
        credlyImgAlt:
          "Shopify Development Fundamentals — verifierad skill-badge (Credly)",
        credlyLogoAlt: "Shopify",
      },
      cv: {
        title: "CV",
        download: "Ladda ner",
        web: "Öppna",
        embedTitle: "CV som PDF",
      },
      cover: {
        title: "Personligt brev",
        download: "Ladda ner",
        web: "Öppna",
        embedTitle: "Personligt brev som PDF",
        missing:
          "PDF-förhandsvisning visas när <code>assets/personligt-brev.pdf</code> finns med i publiceringen. Du kan alltid läsa brevet via knappen <strong>Öppna</strong>.",
      },
      contact: {
        title: "Kontakt",
        lead: "Hör gärna av dig via mejl eller LinkedIn. Öppen kod finns på GitHub nedan.",
        email: "E-post:",
        linkedin: "LinkedIn:",
        linkedinLink: "LinkedIn-profil",
        github: "GitHub:",
      },
      modal: {
        close: "Stäng",
        title: "Bild i full storlek",
        visitSite: "Besök webbplatsen",
        previewImgAlt: "Förhandsvisning av bild i full storlek",
        openThumb: "Visa skärmdump i full storlek",
        galleryPrev: "Föregående bild",
        galleryNext: "Nästa bild",
      },
      footer: "© 2026 Rasmus Hanzén",
    },
    en: {
      meta: {
        description:
          "Rasmus Hanzén — full-stack and Shopify developer. Selected GitHub projects, Shopify work, CV, cover letter, and contact.",
        ogImageAlt: "Rasmus Hanzén — portfolio and Shopify work preview",
      },
      title: "Rasmus Hanzén",
      nav: {
        aria: "Main navigation",
        menu: "Menu",
        home: "Home",
        projects: "Projects",
        shopify: "Shopify",
        cv: "CV",
        cover: "Cover letter",
        contact: "Contact",
        langSv: "Swedish",
        langEn: "English",
        langHint: "Change language",
        workTabsAria: "Switch between projects and Shopify",
      },
      hero: {
        h1: 'Hello — my name is <span class="hero-accent">Rasmus Hanzén</span>.',
        tagline:
          "Full-stack and Shopify developer (JavaScript/TypeScript, React, Vue, Node). Studying at IT-Högskolan, Sweden, graduating in 2026. Selected GitHub projects, Shopify work, CV and contact below.",

        ctaProjects: "View projects",
        github: "GitHub",
        cv: "CV",
        ctaContact: "Book intro",
      },
      projects: {
        title: "Projects",
        loading: "Loading projects from GitHub …",
        leadFallback:
          'Showing an embedded project list. To load projects live from GitHub, open the site over <strong>https</strong> (e.g. published on GitHub Pages or locally with <code style="color:var(--accent)">npx serve .</code>).',
        appCarouselRegion: "Slideshow with project screenshots",
        appCarouselPrev: "Previous image",
        appCarouselNext: "Next image",
        appCarouselGoto: "Go to image {n}",
        repoCarouselImgAlt: "Project screenshot",
        repoThumbAlt: "Screenshot: {title}",
        cardGithub: "GitHub",
        repoFallback: "Public GitHub repository.",
        mobileAppPill: "Mobile app",
        webProjectPill: "Website",
      },
      shopify: {
        title: "Shopify",
        lead: "Selected Shopify work: storefront themes, Liquid and metafields, GraphQL to external APIs, plus an embedded B2B app in Admin for wholesale workflows.",
        skillsAria: "Open skillscombined.se in a new tab (preview)",
        skillsTitle: "Skills Combined",
        skillsDesc:
          "Shopify store for the Skills Combined brand (makeup and skincare): blog and storefront, custom bundle flow so the warehouse could print correct labels. Theme, Liquid, and integrations in Node/GraphQL.",
        fldAria: "Open finelittleday.com in a new tab (preview)",
        fldTitle: "Fine Little Day",
        fldDesc:
          "Store for the lifestyle brand: mega and mobile menus, products, upcoming pages, and multilingual content in the theme.",
        hannaTitle: "Hanna Instruments",
        hannaDesc:
          "Backend: Shopify GraphQL integrated with the previous e-commerce solution’s API — product data and migration.",
        appPill: "Shopify app",
        storePill: "Theme & development",
        appImgAlt: "Preview: app view in Shopify Admin (dashboard)",
        skillsCarouselImgAlt:
          "Preview: Skills Combined — storefront and bundle flow",
        fldCarouselImgAlt: "Preview: Fine Little Day — store and navigation",
        hannaCarouselImgAlt:
          "Preview: Hanna Instruments — Shopify and product data",
        gronagardarTitle: "Gröna gårdar",
        gronagardarDesc:
          "Shopify store for organic grass-fed meat and produce from West Sweden: product pages, meat boxes, and checkout in the theme.",
        gronagardarCarouselImgAlt:
          "Preview: Gröna gårdar — storefront and products",
        appCarouselRegion: "Slideshow with screenshots",
        appCarouselPrev: "Previous image",
        appCarouselNext: "Next image",
        appCarouselGoto: "Go to image {n}",
        appTitle: "B2B app",
        appBody:
          "Custom stack with <strong>PostgreSQL</strong>, <strong>TypeScript</strong> and React Router 7, <strong>Liquid</strong>, VAT and currencies — embedded B2B app in Admin.",
        appFootnote:
          "No public App Store or install link yet; the images above are from the app in Shopify Admin (B2B / wholesale).",
        credlyBlockAria: "Verified Shopify skills via Credly",
        credlyTitle: "Verified skills",
        credlyLead:
          "Shopify Development Fundamentals — verified skills badge (Credly), issued by Shopify.",
        credlyImgAlt:
          "Shopify Development Fundamentals — verified skill badge (Credly)",
        credlyLogoAlt: "Shopify",
      },
      cv: {
        title: "CV",
        download: "Download",
        web: "Open",
        embedTitle: "CV as PDF",
      },
      cover: {
        title: "Cover letter",
        download: "Download",
        web: "Open",
        embedTitle: "Cover letter as PDF",
        missing:
          "The PDF preview appears when <code>assets/personligt-brev.pdf</code> is included in the published site. You can always read the letter using the <strong>Open</strong> button.",
      },
      contact: {
        title: "Contact",
        lead: "Get in touch by email or LinkedIn. Open-source work is on GitHub below.",
        email: "Email:",
        linkedin: "LinkedIn:",
        linkedinLink: "LinkedIn profile",
        github: "GitHub:",
      },
      modal: {
        close: "Close",
        title: "Image at full size",
        visitSite: "Visit website",
        previewImgAlt: "Full-size image preview",
        openThumb: "View screenshot at full size",
        galleryPrev: "Previous image",
        galleryNext: "Next image",
      },
      footer: "© 2026 Rasmus Hanzén",
    },
  };

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o && o[k];
    }, obj);
  }

  function deepGet(lang, path) {
    var v = get(STR[lang], path);
    if (v !== undefined && v !== null) return v;
    return get(STR.sv, path);
  }

  function currentLang() {
    var s = localStorage.getItem(STORAGE);
    return s === "en" ? "en" : "sv";
  }

  function applyMeta(lang) {
    var desc = deepGet(lang, "meta.description");
    var title = deepGet(lang, "title");
    var m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", desc);
    document.title = title;

    var ogTitle = document.getElementById("meta-og-title");
    if (ogTitle) ogTitle.setAttribute("content", title);
    var ogDesc = document.getElementById("meta-og-description");
    if (ogDesc) ogDesc.setAttribute("content", desc);
    var ogLoc = document.getElementById("meta-og-locale");
    var ogLocAlt = document.getElementById("meta-og-locale-alt");
    if (ogLoc && ogLocAlt) {
      if (lang === "en") {
        ogLoc.setAttribute("content", "en_US");
        ogLocAlt.setAttribute("content", "sv_SE");
      } else {
        ogLoc.setAttribute("content", "sv_SE");
        ogLocAlt.setAttribute("content", "en_US");
      }
    }

    var twTitle = document.getElementById("meta-twitter-title");
    if (twTitle) twTitle.setAttribute("content", title);
    var twDesc = document.getElementById("meta-twitter-description");
    if (twDesc) twDesc.setAttribute("content", desc);

    var ogImgAlt = document.getElementById("meta-og-image-alt");
    if (ogImgAlt)
      ogImgAlt.setAttribute("content", deepGet(lang, "meta.ogImageAlt"));
  }

  function applyDom(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var path = el.getAttribute("data-i18n");
      if (!path) return;
      var v = deepGet(lang, path);
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var path = el.getAttribute("data-i18n-html");
      if (!path) return;
      var v = deepGet(lang, path);
      if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var raw = el.getAttribute("data-i18n-attr");
      if (!raw) return;
      raw.split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length >= 2) {
          var attr = parts[0].trim();
          var path = parts.slice(1).join(":").trim();
          var v = deepGet(lang, path);
          if (v !== undefined) el.setAttribute(attr, v);
        }
      });
    });
  }

  function setActiveLangButtons(lang) {
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var l = btn.getAttribute("data-set-lang");
      var on = l === lang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("lang-btn--active", on);
    });
  }

  function setLang(lang, silent) {
    var lng = lang === "en" ? "en" : "sv";
    localStorage.setItem(STORAGE, lng);
    document.documentElement.setAttribute("lang", lng);
    applyMeta(lng);
    applyDom(lng);
    setActiveLangButtons(lng);
    if (!silent) {
      document.dispatchEvent(
        new CustomEvent("portfolio:languagechange", { detail: { lang: lng } }),
      );
    }
  }

  function t(path) {
    return deepGet(currentLang(), path);
  }

  window.I18n = {
    t: t,
    getLang: currentLang,
    setLang: setLang,
    apply: function () {
      setLang(currentLang(), true);
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    setLang(currentLang(), true);
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lng = btn.getAttribute("data-set-lang");
        if (lng === "en" || lng === "sv") setLang(lng, false);
      });
    });
  });
})();
