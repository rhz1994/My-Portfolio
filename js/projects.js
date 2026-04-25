(function () {
  var GITHUB_USER = "rhz1994";
  var API_URL =
    "https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100&sort=updated&type=owner";

  /** Valfri skärmdump per repo: PNG med samma namn som repot, i denna mapp (t.ex. CityQuest.png). */
  var PROJECT_SCREENSHOT_BASE = "assets/project-screenshots/";

  /** Flera bilder → karusell. Värde: filnamnlista eller { files: [...] }. */
  var REPO_SCREENSHOT_SLIDES = {
    grupp7: ["Worldly-1.png", "Worldly-2.png", "Worldly-3.png"],
    Stadspusslet: ["Stadspusslet-1.png", "Stadspusslet-2.png", "Stadspusslet-3.png"],
    Trygghetskollen: ["Trygghetskollen-1.png", "Trygghetskollen-2.png", "Trygghetskollen-3.png"],
    "Capital-Quiz": ["Capital-Quiz-1.png", "Capital-Quiz-2.png", "Capital-Quiz-3.png"],
    "Capital-Quiz-React-Native": [
      "Capital-Quiz-React-Native-1.png",
      "Capital-Quiz-React-Native-2.png",
      "Capital-Quiz-React-Native-3.png",
    ],
    "just-write": ["just-write-1.png", "just-write-2.png", "just-write-3.png"],
    "Met-Collection-Explorer": [
      "Met-Collection-Explorer-1.png",
      "Met-Collection-Explorer-2.png",
      "Met-Collection-Explorer-3.png",
    ],
  };

  function repoSlideConfig(name) {
    var raw = REPO_SCREENSHOT_SLIDES[name];
    if (!raw) return null;
    if (Array.isArray(raw)) {
      return { files: raw };
    }
    return {
      files: raw.files || [],
    };
  }

  var HIDE_FROM_PORTFOLIO = {
    "My-Portfolio": true,
    "hello-world": true,
    newdemo: true,
    "vite-render-demo": true,
    "vite-render-full": true,
    "fullstack-ish": true,
    group12: true,
  };

  /** Efter datum-sortering: dessa repo-namn flyttas sist (ordning inom svansen enligt listan). */
  var REPO_ORDER_TAIL = ["Met-Collection-Explorer"];

  /**
   * Repos som inte finns under GITHUB_USER men ska visas när listan hämtas live.
   * (Undvik dubblett: om samma repo-namn redan finns från API används API-versionen.)
   */
  var PORTFOLIO_REPO_JUST_WRITE = {
    name: "just-write",
    html_url: "https://github.com/ofedchen/just-write",
    homepage: "https://justwrite.olha.dev",
    description: null,
    language: "Vue",
    fork: false,
    updated_at: "2026-03-15T12:00:00Z",
  };

  var EXTRA_PORTFOLIO_REPOS = [PORTFOLIO_REPO_JUST_WRITE];

  function mergeExtraPortfolioRepos(apiRepos) {
    if (!Array.isArray(apiRepos) || !apiRepos.length) return apiRepos;
    var seen = {};
    apiRepos.forEach(function (r) {
      if (r && r.name) seen[r.name] = true;
    });
    var out = apiRepos.slice();
    EXTRA_PORTFOLIO_REPOS.forEach(function (extra) {
      if (extra && extra.name && !seen[extra.name]) {
        seen[extra.name] = true;
        out.push(extra);
      }
    });
    return out;
  }

  var FALLBACK_REPOS = [
    { name: "CityQuest", html_url: "https://github.com/rhz1994/CityQuest", description: null, language: "TypeScript" },
    { name: "Stadspusslet", html_url: "https://github.com/rhz1994/Stadspusslet", description: null, language: "HTML" },
    { name: "grupp7", html_url: "https://github.com/rhz1994/grupp7", description: null, language: "JavaScript" },
    { name: "Trygghetskollen", html_url: "https://github.com/rhz1994/Trygghetskollen", description: null, language: "JavaScript" },
    {
      name: "Capital-Quiz-React-Native",
      html_url: "https://github.com/rhz1994/Capital-Quiz-React-Native",
      description: null,
      language: "JavaScript",
    },
    { name: "Capital-Quiz", html_url: "https://github.com/rhz1994/Capital-Quiz", description: null, language: "JavaScript" },
    PORTFOLIO_REPO_JUST_WRITE,
    {
      name: "Met-Collection-Explorer",
      html_url: "https://github.com/rhz1994/Met-Collection-Explorer",
      homepage: "https://rhz1994.github.io/Met-Collection-Explorer/",
      description: null,
      language: "JavaScript",
      fork: false,
      updated_at: "2026-04-18T12:00:00Z",
    },
  ];

  /** Kort copy när GitHub saknar description. Synkad med ~/Projekt/PORTFOLIO-BESKRIVNINGAR.md och TEKNOLOGIER.md */
  var SUMMARY_SV = {
    CityQuest:
      "React Native-app (Expo) där användaren följer ledtrådar på kartan, löser pussel på plats och samlar poäng — med eget Express-API och MySQL i Docker.",
    Stadspusslet:
      "Webbaserat stadspussel med interaktiva kartor (Leaflet), MUI-gränssnitt och Express/MySQL i bakgrunden.",
    grupp7:
      "Worldly — reseapp: logga besökta länder, betyg och anteckningar; Vue 3, Express och både MySQL och MongoDB.",
    Trygghetskollen:
      "Webbapp där användaren kan söka och rapportera misstänkta bedrägerier (nummer, länkar, namn) — React, Express, PostgreSQL och Docker Compose.",
    "Capital-Quiz-React-Native":
      "Mobilquiz i Expo och React Native: gissa landets huvudstad, byt vy med flikar (till exempel startsida, spel och resultat) och spara poäng och förlopp lokalt med AsyncStorage. Samma grundidé som webbversionen Capital Quiz, anpassad för telefon.",
    "Capital-Quiz":
      "Quiz om världens huvudstäder i React och Vite — svårighetsgrad och kontinent styr frågorna via REST Countries API.",
    "just-write":
      "Gruppprojekt i Vue 3 och Vite: skriv- och publiceringsflöde med profiler, inloggning och publicerade texter — Tailwind, Pinia och Vue Router.",
    "Met-Collection-Explorer":
      "Webbapp mot Metropolitan Museums öppna Collection API: sök, avdelningsfilter och höjdpunkter, detaljmodal med metadata, favoriter i localStorage och spridningsdiagram över årtal (Chart.js).",
  };

  var SUMMARY_EN = {
    CityQuest:
      "React Native (Expo) app where users follow map clues, solve on-site puzzles, and earn points—with a custom Express API and MySQL in Docker.",
    Stadspusslet:
      "Web-based city puzzle with interactive maps (Leaflet), a MUI frontend, and Express/MySQL behind the scenes.",
    grupp7:
      "Worldly — travel log: visited countries, ratings, and notes; Vue 3, Express, MySQL, and MongoDB.",
    Trygghetskollen:
      "Web app to search and report suspected fraud (numbers, links, names)—React, Express, PostgreSQL, and Docker Compose.",
    "Capital-Quiz-React-Native":
      "Mobile quiz built with Expo and React Native: guess each country’s capital, move between screens with tab navigation (home, play, results, and similar), and persist scores and progress locally with AsyncStorage. Same core idea as the Capital Quiz web app, tailored for phones.",
    "Capital-Quiz":
      "World capitals quiz in React and Vite—difficulty and continent drive questions via the REST Countries API.",
    "just-write":
      "Group project in Vue 3 and Vite: writing and publishing flow with profiles, sign-in, and public texts—Tailwind, Pinia, and Vue Router.",
    "Met-Collection-Explorer":
      "Web app on the Metropolitan Museum’s open Collection API: search, department filters and highlights, detail modal with metadata, favourites in localStorage, and a year scatter chart (Chart.js).",
  };

  /**
   * Taggar per repo (kort tech stack). Justerade mot ~/Projekt/TEKNOLOGIER.md.
   * Nya repos: lägg till nyckel = exakt GitHub-repo-namn.
   */
  var REPO_TAGS = {
    CityQuest: ["React Native", "Expo", "expo-router", "Express", "TypeScript", "MySQL", "Docker"],
    Stadspusslet: ["React", "Vite", "TypeScript", "MUI", "Leaflet", "React Router 7", "Express", "MySQL", "Cypress"],
    grupp7: ["Vue", "Vite", "Bootstrap", "Axios", "Express", "MySQL", "MongoDB"],
    Trygghetskollen: ["React", "Vite", "MUI", "React Router 7", "TanStack Query", "Express", "PostgreSQL", "Docker"],
    "Capital-Quiz-React-Native": ["React Native", "Expo", "React Navigation", "AsyncStorage"],
    "Capital-Quiz": ["React", "Vite", "React Router", "styled-components", "REST Countries", "JavaScript"],
    "just-write": ["Vue", "Vite", "Pinia", "Vue Router", "Tailwind CSS", "Axios"],
    "Met-Collection-Explorer": ["JavaScript", "REST API", "Chart.js", "Fetch", "HTML", "CSS"],
    "fullstack-ish": ["React", "Vite", "Express", "PostgreSQL"],
    "vite-render-demo": ["Vite", "React", "TypeScript"],
    "vite-render-full": ["Vite", "React", "TypeScript"],
    newdemo: ["JavaScript"],
    "hello-world": ["HTML"],
  };

  /** Valfritt visningsnamn på kortet (nyckel = exakt GitHub-repo-namn). */
  var REPO_CARD_TITLE = {
    grupp7: "Worldly",
    "just-write": "Just Write",
    CityQuest: "City Quest",
    "Capital-Quiz-React-Native": "Capital Quiz React Native",
    "Capital-Quiz": "Capital Quiz",
    "Met-Collection-Explorer": "Met Collection Explorer",
  };

  /**
   * Endast här: Demo-länk + modal «Besök webbplatsen» (data-visit-site på kortet).
   * GitHub-fältet homepage på andra repos kan vara tomt/sönder — används inte.
   */
  var REPO_LIVE_SITE_URL = {
    "just-write": "https://justwrite.olha.dev",
    "Met-Collection-Explorer": "https://rhz1994.github.io/Met-Collection-Explorer/",
  };

  /** Mobilappar (samma ögonbryn-stil som Shopify B2B-kortet). */
  var REPO_MOBILE_APP = {
    CityQuest: true,
    "Capital-Quiz-React-Native": true,
  };

  var state = { lastRepos: null, lastLive: false };

  function tProjects(key) {
    if (typeof window.I18n !== "undefined" && window.I18n.t) {
      return window.I18n.t("projects." + key);
    }
    var fall = {
      loading: "Laddar projekt från GitHub …",
      leadFallback:
        'Här visas en inbakad projektlista. För att hämta listan live från GitHub behöver sidan köras över <strong>https</strong> (t.ex. publicerad på GitHub Pages eller lokalt med <code style="color:var(--accent)">npx serve .</code>).',
      cardGithub: "GitHub",
      repoFallback: "Publikt GitHub-repo.",
      mobileAppPill: "Mobilapp",
      webProjectPill: "Webbsida",
      repoThumbAlt: "Skärmdump: {title}",
    };
    return fall[key] || "";
  }

  function repoThumbAltText(repoName) {
    var display = REPO_CARD_TITLE[repoName] || repoName || "";
    var tpl = tProjects("repoThumbAlt");
    if (tpl && tpl.indexOf("{title}") !== -1) {
      return tpl.split("{title}").join(String(display));
    }
    return "Skärmdump: " + String(display);
  }

  function summaryMap() {
    var lng = typeof window.I18n !== "undefined" && window.I18n.getLang ? window.I18n.getLang() : "sv";
    return lng === "en" ? SUMMARY_EN : SUMMARY_SV;
  }

  function repoSummary(repo) {
    var map = summaryMap();
    var curated = map[repo.name];
    if (curated && String(curated).trim()) {
      return escapeHtml(curated.trim());
    }
    if (repo.description && String(repo.description).trim()) {
      return escapeHtml(repo.description.trim());
    }
    return escapeHtml(tProjects("repoFallback"));
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function tagsFor(repo) {
    var name = repo.name || "";
    if (REPO_TAGS[name]) {
      return REPO_TAGS[name].slice();
    }
    if (name.indexOf("vite-render") === 0) {
      return ["Vite"].concat(repo.language ? [repo.language] : []);
    }
    if (repo.language) {
      return [repo.language];
    }
    return ["GitHub"];
  }

  function renderTags(repo) {
    return tagsFor(repo)
      .map(function (tag) {
        return '<span class="tag">' + escapeHtml(tag) + "</span>";
      })
      .join("");
  }

  function renderCard(repo) {
    var name = repo.name || "";
    var title = escapeHtml(REPO_CARD_TITLE[name] || name);
    var url = repo.html_url;
    var gh = escapeHtml(tProjects("cardGithub"));
    var liveSite = REPO_LIVE_SITE_URL[name] || "";
    var visitAttr = liveSite ? ' data-visit-site="' + escapeHtml(liveSite) + '"' : "";
    var isMobileApp = !!REPO_MOBILE_APP[name];
    var cardClass = "card card--github-project";
    var pillClass = isMobileApp ? "eyebrow-pill" : "eyebrow-pill eyebrow-pill--web";
    var pillKey = isMobileApp ? "mobileAppPill" : "webProjectPill";
    var eyebrowBlock =
      '<div class="card-eyebrow">' +
      '<span class="' +
      escapeHtml(pillClass) +
      '">' +
      escapeHtml(tProjects(pillKey)) +
      "</span>" +
      "</div>";
    var slideCfg = repoSlideConfig(name);
    var shotBlock;
    if (slideCfg && slideCfg.files.length) {
      var filesAttr = slideCfg.files.map(escapeHtml).join(",");
      var baseAttr = escapeHtml(PROJECT_SCREENSHOT_BASE);
      shotBlock =
        '<div class="card-project-media">' +
        '<div class="app-carousel" data-app-carousel data-carousel-base="' +
        baseAttr +
        '" data-carousel-files="' +
        filesAttr +
        '" data-carousel-i18n-prefix="projects"></div>' +
        "</div>";
    } else {
      var thumbSrc = PROJECT_SCREENSHOT_BASE + encodeURIComponent(name) + ".png";
      shotBlock =
        '<div class="card-project-media">' +
        '<div class="card-repo-shot">' +
        '<img src="' +
        escapeHtml(thumbSrc) +
        '" alt="' +
        escapeHtml(repoThumbAltText(name)) +
        '" loading="lazy" decoding="async" />' +
        "</div></div>";
    }
    return (
      '<article class="' +
      escapeHtml(cardClass) +
      '"' +
      visitAttr +
      ">" +
      eyebrowBlock +
      shotBlock +
      "<h3>" +
      title +
      "</h3>" +
      "<p>" +
      repoSummary(repo) +
      "</p>" +
      '<div class="card-tags">' +
      renderTags(repo) +
      "</div>" +
      '<div class="card-links">' +
      '<a href="' +
      escapeHtml(url) +
      '" rel="noopener noreferrer">' +
      gh +
      "</a>" +
      (liveSite
        ? '<a href="' + escapeHtml(liveSite) + '" rel="noopener noreferrer">Demo</a>'
        : "") +
      "</div>" +
      "</article>"
    );
  }

  function hiddenFromPortfolio(repo) {
    var n = repo && repo.name;
    return !n || !!HIDE_FROM_PORTFOLIO[n];
  }

  function renderGrid(el, repos) {
    if (!el) return;
    var list = (repos || []).filter(function (r) {
      return !r.fork && !hiddenFromPortfolio(r);
    });
    list.sort(function (a, b) {
      var da = new Date(a.updated_at || 0).getTime();
      var db = new Date(b.updated_at || 0).getTime();
      return db - da;
    });
    var tailSet = {};
    REPO_ORDER_TAIL.forEach(function (n) {
      tailSet[n] = true;
    });
    var byName = {};
    list.forEach(function (r) {
      if (r && r.name) byName[r.name] = r;
    });
    var rest = list.filter(function (r) {
      return !r || !tailSet[r.name];
    });
    var tailOrdered = REPO_ORDER_TAIL.map(function (n) {
      return byName[n];
    }).filter(Boolean);
    list = rest.concat(tailOrdered);
    el.innerHTML = list.map(renderCard).join("");
    el.querySelectorAll(".card-project-media img").forEach(function (img) {
      img.addEventListener("error", function () {
        var media = this.closest(".card-project-media");
        if (media) media.remove();
      });
    });
    if (typeof window.initAppCarouselsIn === "function") {
      window.initAppCarouselsIn(el);
    }
  }

  function updateProjectLead() {
    var lead = document.getElementById("projects-lead");
    if (!lead) return;
    if (state.lastRepos) {
      lead.innerHTML = "";
      lead.hidden = true;
    } else {
      lead.hidden = false;
      lead.innerHTML = tProjects("leadFallback");
    }
  }

  function refreshProjectsForLang() {
    var grid = document.getElementById("project-grid");
    if (!grid) return;
    if (state.lastRepos && state.lastRepos.length) {
      renderGrid(grid, state.lastRepos);
    } else {
      renderGrid(grid, FALLBACK_REPOS);
    }
    updateProjectLead();
  }

  async function fetchRepos() {
    var res = await fetch(API_URL, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error("GitHub API " + res.status);
    return res.json();
  }

  async function initProjects() {
    var grid = document.getElementById("project-grid");
    var lead = document.getElementById("projects-lead");
    if (!grid) return;

    if (lead) {
      lead.hidden = false;
      lead.innerHTML = tProjects("loading");
    }

    var live = false;
    var repos = null;
    try {
      repos = await fetchRepos();
      if (Array.isArray(repos) && repos.length) {
        repos = mergeExtraPortfolioRepos(repos);
        state.lastRepos = repos;
        state.lastLive = true;
        renderGrid(grid, repos);
        live = true;
      }
    } catch (e) {}

    if (!live) {
      state.lastRepos = null;
      state.lastLive = false;
      renderGrid(grid, FALLBACK_REPOS);
    }

    updateProjectLead();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProjects();
  });

  document.addEventListener("portfolio:languagechange", function () {
    refreshProjectsForLang();
  });
})();
