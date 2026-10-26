/* Portfólio de Gabriel Rocha — comportamentos mínimos, sem dependências.
   Tudo aqui é melhoria progressiva: sem JavaScript, o site continua navegável. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  /* Textos criados aqui seguem o idioma escolhido (ver i18n.js). */
  function t(key, pt) {
    return window.SiteI18n ? window.SiteI18n.t(key, pt) : pt;
  }

  /* ---------- Menu móvel ---------- */
  var toggle = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("site-nav");
  var mq = window.matchMedia("(max-width: 900px)");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".menu-toggle__label").textContent = open ? t("ui.close", "Fechar") : t("ui.menu", "Menu");
    nav.classList.toggle("is-open", open);
    root.classList.toggle("menu-open", open);
  }

  doc.addEventListener("langchange", function () {
    if (toggle && nav) setMenu(toggle.getAttribute("aria-expanded") === "true");
  });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    doc.addEventListener("keydown", function (e) {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (!open) return;
      if (e.key === "Escape") {
        setMenu(false);
        toggle.focus();
        return;
      }
      if (e.key === "Tab") {
        /* Mantém o foco dentro do menu enquanto ele cobre a página. */
        var items = [toggle].concat([].slice.call(nav.querySelectorAll("a[href]")));
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && doc.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && doc.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    var onChange = function () {
      if (!mq.matches) setMenu(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Destaque do item atual (home e sumário dos cases) ---------- */
  function spy(links, sections, rootMargin) {
    if (!("IntersectionObserver" in window) || !links.length || !sections.length) return;
    var byId = {};
    links.forEach(function (a) {
      var id = (a.getAttribute("href") || "").split("#")[1];
      if (id) (byId[id] = byId[id] || []).push(a);
    });
    var visible = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          visible[en.target.id] = en.isIntersecting;
        });
        var current = null;
        for (var i = 0; i < sections.length; i++) {
          if (visible[sections[i].id]) {
            current = sections[i].id;
            break;
          }
        }
        if (!current) return;
        links.forEach(function (a) {
          a.removeAttribute("aria-current");
        });
        (byId[current] || []).forEach(function (a) {
          a.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: rootMargin }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* Home: Início / Projetos / Sobre */
  if (doc.body.hasAttribute("data-page-home")) {
    var navLinks = [].slice.call(doc.querySelectorAll(".nav__link"));
    var homeSections = ["inicio", "projetos", "sobre", "contato"]
      .map(function (id) { return doc.getElementById(id); })
      .filter(Boolean);
    spy(navLinks, homeSections, "-45% 0px -50% 0px");
  }

  /* Cases: sumário lateral e sumário móvel */
  var tocLinks = [].slice.call(doc.querySelectorAll(".toc a, .toc-mobile a"));
  var caseSections = [].slice.call(doc.querySelectorAll(".prose > section[id]"));
  if (tocLinks.length) {
    spy(tocLinks, caseSections, "-20% 0px -70% 0px");
    var tocMobile = doc.querySelector(".toc-mobile");
    if (tocMobile) {
      tocMobile.addEventListener("click", function (e) {
        if (e.target.closest("a")) tocMobile.removeAttribute("open");
      });
      /* Mostra no resumo a seção em que a pessoa está. */
      var label = tocMobile.querySelector(".toc-mobile__current");
      if (label) {
        var update = function () {
          var cur = tocMobile.querySelector('a[aria-current="true"]');
          if (cur) label.textContent = cur.textContent;
        };
        new MutationObserver(update).observe(tocMobile, { subtree: true, attributes: true, attributeFilter: ["aria-current"] });
        doc.addEventListener("langchange", update);
      }
    }
  }

  /* ---------- Ampliar imagens ---------- */
  var zoomLinks = [].slice.call(doc.querySelectorAll("a[data-lightbox]"));
  if (zoomLinks.length && typeof HTMLDialogElement === "function") {
    var dlg = doc.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-labelledby", "lightbox-title");
    dlg.innerHTML =
      '<div class="lightbox__body">' +
      '<div class="lightbox__bar"><span id="lightbox-title"></span>' +
      '<button type="button" class="lightbox__close"></button></div>' +
      '<div class="lightbox__img"><img alt="" decoding="async"></div>' +
      "</div>";
    doc.body.appendChild(dlg);
    var dImg = dlg.querySelector("img");
    var dTitle = dlg.querySelector("#lightbox-title");
    var dClose = dlg.querySelector(".lightbox__close");
    var closeLabel = function () {
      dClose.textContent = t("ui.close", "Fechar");
    };
    closeLabel();
    doc.addEventListener("langchange", closeLabel);

    zoomLinks.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var thumb = a.querySelector("img");
        dImg.src = a.getAttribute("href");
        dImg.alt = thumb ? thumb.alt : "";
        dTitle.textContent = a.getAttribute("data-title") || "";
        dlg.showModal();
        dlg.querySelector(".lightbox__close").focus();
      });
    });
    dlg.querySelector(".lightbox__close").addEventListener("click", function () {
      dlg.close();
    });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", function () {
      dImg.removeAttribute("src");
    });
  }

  /* ---------- Cabeçalho: linha fina depois que a página rola ---------- */
  var header = doc.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Palco da abertura ----------
     Alterna os dois projetos. A troca automática é dirigida pela barra de
     tempo do CSS (evento animationend), então pausar a animação pausa tudo.
     Para sozinho com o mouse em cima, com o foco do teclado dentro, com a aba
     escondida ou com o palco fora da tela. Com "reduzir movimento", não troca
     sozinho: só pelas abas. */
  var stage = doc.querySelector("[data-stage]");
  if (stage) {
    var slides = [].slice.call(stage.querySelectorAll("[data-slide]"));
    var tabs = [].slice.call(stage.querySelectorAll("[data-go]"));
    var pauseBtn = stage.querySelector("[data-pause]");
    var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    var current = 0;
    var userPaused = false;
    var hovered = false;
    var focused = false;
    var offscreen = false;

    var show = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === current;
        s.classList.toggle("is-active", on);
        if (on) {
          s.removeAttribute("aria-hidden");
          s.removeAttribute("inert");
        } else {
          s.setAttribute("aria-hidden", "true");
          s.setAttribute("inert", "");
        }
      });
      tabs.forEach(function (b, n) {
        b.setAttribute("aria-pressed", String(n === current));
      });
    };

    var sync = function () {
      var auto = !reduceMq.matches;
      stage.classList.toggle("is-auto", auto);
      stage.classList.toggle("is-paused", userPaused || hovered || focused || offscreen || doc.hidden);
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-pressed", String(userPaused));
        pauseBtn.setAttribute("aria-label", userPaused ? t("ui.play", "Continuar a apresentação") : t("ui.pause", "Pausar a apresentação"));
      }
    };

    tabs.forEach(function (b, n) {
      b.addEventListener("click", function () { show(n); });
    });
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        userPaused = !userPaused;
        sync();
      });
    }
    stage.addEventListener("animationend", function (e) {
      if (e.target.classList && e.target.classList.contains("stage__bar")) show(current + 1);
    });
    stage.addEventListener("mouseenter", function () { hovered = true; sync(); });
    stage.addEventListener("mouseleave", function () { hovered = false; sync(); });
    stage.addEventListener("focusin", function () { focused = true; sync(); });
    stage.addEventListener("focusout", function (e) {
      if (!stage.contains(e.relatedTarget)) { focused = false; sync(); }
    });
    doc.addEventListener("visibilitychange", sync);
    doc.addEventListener("langchange", sync);
    if (reduceMq.addEventListener) reduceMq.addEventListener("change", sync);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        offscreen = !entries[0].isIntersecting;
        sync();
      }).observe(stage);
    }
    show(0);
    sync();
  }
})();
