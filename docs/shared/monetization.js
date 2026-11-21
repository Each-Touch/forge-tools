(function () {
  "use strict";

  var cfg = window.FORGE_CONFIG || {
    brand: "Each-Touch Forge",
    tagline: "Free, Private, Zero-Upload Browser Tools for Indie Game Devs & Video Creators",
    baseUrl: "https://each-touch.github.io/forge-tools",
    arcadeUrl: "https://each-touch.github.io/",
    itchProfileUrl: "https://each-touch.itch.io/",
    monetization: {}
  };
  var catalog = Array.isArray(window.FORGE_CATALOG) ? window.FORGE_CATALOG : [];
  var activeSlug = (document.body && document.body.getAttribute("data-forge-slug")) || "";
  var inIframe = false;
  try {
    inIframe = window.self !== window.top;
  } catch (e) {
    inIframe = true;
  }
  var isItchHost = /itch\.zone|itch\.io|hwcdn\.net/i.test(window.location.hostname || "");
  var targetAttr = inIframe || isItchHost ? ' target="_blank" rel="noopener noreferrer"' : "";

  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toolUrl(slug) {
    if (isItchHost || window.location.protocol === "file:") {
      return cfg.baseUrl.replace(/\/+$/, "") + "/" + slug + "/";
    }
    return activeSlug ? "../" + slug + "/" : "./" + slug + "/";
  }

  function hubUrl() {
    if (isItchHost || window.location.protocol === "file:") {
      return cfg.baseUrl.replace(/\/+$/, "") + "/";
    }
    return activeSlug ? "../" : "./";
  }

  function renderFooter() {
    var mount = document.getElementById("forge-monetization-footer");
    if (!mount) return;

    var mon = cfg.monetization || {};
    var others = catalog.filter(function (item) {
      return item.status === "live" && item.slug !== activeSlug;
    });

    var actionHtml = "";
    if (mon.supportUrl) {
      actionHtml += '<a class="btn btn-primary btn-sm" href="' + esc(mon.supportUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(mon.supportLabel || "Support Each-Touch Forge") + "</a>";
    }
    if (mon.proStoreUrl) {
      actionHtml += '<a class="btn btn-cyan btn-sm" href="' + esc(mon.proStoreUrl) + '" target="_blank" rel="noopener noreferrer">Pro Asset Packs</a>';
    }
    if (cfg.itchProfileUrl) {
      actionHtml += '<a class="btn btn-sm" href="' + esc(cfg.itchProfileUrl) + '" target="_blank" rel="noopener noreferrer">itch.io Tools</a>';
    }
    if (cfg.arcadeUrl) {
      actionHtml += '<a class="btn btn-sm" href="' + esc(cfg.arcadeUrl) + '" target="_blank" rel="noopener noreferrer">Each-Touch Arcade</a>';
    }

    var cardsHtml = "";
    if (others.length > 0) {
      cardsHtml = '<div class="forge-cross-grid">' + others.map(function (item) {
        return (
          '<a class="forge-mini-card" href="' + esc(toolUrl(item.slug)) + '"' + targetAttr + ">" +
          "<strong>" + esc(item.name) + "</strong>" +
          "<span>" + esc(item.tagline) + "</span>" +
          "</a>"
        );
      }).join("") + "</div>";
    } else {
      cardsHtml =
        '<div class="forge-cross-grid">' +
        '<a class="forge-mini-card" href="' + esc(hubUrl()) + '"' + targetAttr + ">" +
        "<strong>" + esc(cfg.brand) + " Web Hub</strong>" +
        "<span>Bookmark the main hub for new zero-upload browser tools &amp; CC0 asset packs released weekly.</span>" +
        "</a>" +
        '<a class="forge-mini-card" href="' + esc(cfg.arcadeUrl) + '" target="_blank" rel="noopener noreferrer">' +
        "<strong>Each-Touch Instant Arcade</strong>" +
        "<span>Play our free zero-install HTML5 indie web games built with these tools.</span>" +
        "</a>" +
        "</div>";
    }

    var adHtml = '<div id="forge-ad-slot" class="forge-ad-slot" aria-label="Sponsor"></div>';

    mount.innerHTML =
      '<div class="forge-footer-wrap">' +
      '<div class="forge-cross-panel">' +
      '<div class="forge-cross-head">' +
      '<div class="forge-cross-title">' + esc(cfg.brand) + " · Ecosystem &amp; More Tools</div>" +
      '<div class="forge-cross-actions">' + actionHtml + "</div>" +
      "</div>" +
      cardsHtml +
      "</div>" +
      adHtml +
      '<div class="forge-legal-bar">' +
      "<span>100% Client-Side Processing · Zero File Uploads · Zero Generative AI in DSP Tools</span>" +
      '<span>Built by <a href="' + esc(hubUrl()) + '"' + targetAttr + ">" + esc(cfg.brand) + "</a></span>" +
      "</div>" +
      "</div>";

    if (mon.adsenseClientId && mon.adsenseSlotId && !inIframe && !isItchHost) {
      var slotEl = document.getElementById("forge-ad-slot");
      if (slotEl) {
        slotEl.style.display = "flex";
        var ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.style.width = "100%";
        ins.setAttribute("data-ad-client", mon.adsenseClientId);
        ins.setAttribute("data-ad-slot", mon.adsenseSlotId);
        ins.setAttribute("data-ad-format", "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        slotEl.appendChild(ins);

        var s = document.createElement("script");
        s.async = true;
        s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(mon.adsenseClientId);
        s.crossOrigin = "anonymous";
        s.onload = function () {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            // ignore
          }
        };
        document.head.appendChild(s);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooter);
  } else {
    renderFooter();
  }
})();
