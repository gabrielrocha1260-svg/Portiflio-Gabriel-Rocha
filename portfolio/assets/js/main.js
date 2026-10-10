/* Portfólio de Gabriel Rocha — comportamentos mínimos, sem dependências.
   Tudo aqui é melhoria progressiva: sem JavaScript, o site continua navegável. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  /* ---------- Menu móvel ---------- */
  var toggle = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("site-nav");
  var mq = window.matchMedia("(max-width: 900px)");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".menu-toggle__label").textContent = open ? "Fechar" : "Menu";
    nav.classList.toggle("is-open", open);
    root.classList.toggle("menu-open", open);
  }

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
      }
    }
  }

  /* ---------- Copiar e-mail ---------- */
  var copyBtn = doc.querySelector("[data-copy]");
  if (copyBtn) {
    var status = doc.getElementById(copyBtn.getAttribute("data-copy-status"));
    var timer;
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      var done = function (msg) {
        if (status) status.textContent = msg;
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (status) status.textContent = "";
        }, 3500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done("E-mail copiado."); },
          function () { done("Não consegui copiar. Selecione o endereço e copie manualmente."); }
        );
      } else {
        done("Seu navegador não permite copiar daqui. Selecione o endereço e copie manualmente.");
      }
    });
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
      '<button type="button" class="lightbox__close">Fechar</button></div>' +
      '<div class="lightbox__img"><img alt="" decoding="async"></div>' +
      "</div>";
    doc.body.appendChild(dlg);
    var dImg = dlg.querySelector("img");
    var dTitle = dlg.querySelector("#lightbox-title");

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

  /* ---------- Título da home: efeito de digitação ----------
     O texto continua inteiro e legível para leitores de tela (span oculto).
     A parte visual é escrita aos poucos; o que falta digitar fica invisível,
     mas ocupa espaço, para a quebra de linha não mudar durante o efeito.
     Não roda com "reduzir movimento" nem quando a pessoa volta para a home
     vindo de outra página do próprio site. */
  var title = doc.querySelector("[data-typing]");
  if (title) {
    var full = title.textContent.replace(/\s+/g, " ").trim();
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var entry = window.performance && performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
    var cameFromSite = false;
    try {
      cameFromSite = !!doc.referrer && new URL(doc.referrer).origin === location.origin;
    } catch (err) {}
    var seen = entry && (entry.type === "back_forward" || (entry.type === "navigate" && cameFromSite));

    if (reduce || seen || !full) {
      title.classList.add("is-static");
    } else {
      typeTitle(title, full);
    }
  }

  function typeTitle(el, text) {
    var chars = Array.from(text);
    var sr = doc.createElement("span");
    var vis = doc.createElement("span");
    var done = doc.createElement("span");
    var caret = doc.createElement("span");
    var rest = doc.createElement("span");
    sr.className = "visually-hidden";
    sr.textContent = text;
    vis.setAttribute("aria-hidden", "true");
    done.className = "type__done";
    caret.className = "type__caret";
    rest.className = "type__rest";
    rest.textContent = text;
    vis.appendChild(done);
    vis.appendChild(caret);
    vis.appendChild(rest);
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(vis);
    el.classList.add("is-typing");

    var n = 0;
    function step() {
      n += 1;
      done.textContent = chars.slice(0, n).join("");
      rest.textContent = chars.slice(n).join("");
      if (n >= chars.length) {
        el.classList.add("is-done");
        return;
      }
      var last = chars[n - 1];
      var wait = 45 + Math.random() * 45;
      if (last === ",") wait += 380;
      setTimeout(step, wait);
    }

    var fontsReady = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
    var cap = new Promise(function (resolve) { setTimeout(resolve, 600); });
    Promise.race([fontsReady, cap]).then(function () {
      setTimeout(step, 350);
    });
  }
})();
