/* Portfólio de Gabriel Rocha — seletor de idioma PT | EN, sem dependências.
   O português está no HTML e é o padrão. O inglês vem de translations.js.
   A troca acontece na própria página, sem recarregar. A escolha fica salva no
   navegador e também na URL (?lang=en), para que um link em inglês funcione
   quando alguém o abre direto. Sem JavaScript, o site continua em português. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var EN = (window.SITE_I18N && window.SITE_I18N.en) || {};
  var STORE = "site-lang";
  var LANGS = { pt: { html: "pt-BR", og: "pt_BR" }, en: { html: "en", og: "en_US" } };
  /* data-i18n-<sufixo> → atributo traduzido */
  var ATTRS = { alt: "alt", "aria-label": "aria-label", title: "data-title", label: "data-label", content: "content" };
  var EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

  var original = new WeakMap();
  var current = "pt";

  function store(el) {
    var o = original.get(el);
    if (!o) {
      o = { attrs: {} };
      original.set(el, o);
    }
    return o;
  }

  /* Guarda o português antes de qualquer troca. */
  function remember(scope) {
    each(scope, "[data-i18n]", function (el) {
      var o = store(el);
      if (o.html == null) o.html = el.tagName === "TITLE" ? el.textContent : el.innerHTML;
    });
    Object.keys(ATTRS).forEach(function (suffix) {
      var name = ATTRS[suffix];
      each(scope, "[data-i18n-" + suffix + "]", function (el) {
        var o = store(el);
        if (!(name in o.attrs)) o.attrs[name] = el.getAttribute(name);
      });
    });
    each(scope, "a[href]", function (a) {
      var o = store(a);
      if (o.href == null) o.href = a.getAttribute("href");
    });
  }

  function each(scope, sel, fn) {
    if (scope.matches && scope.matches(sel)) fn(scope);
    [].forEach.call(scope.querySelectorAll(sel), fn);
  }

  function pick(key, pt) {
    if (current === "en" && Object.prototype.hasOwnProperty.call(EN, key)) return EN[key];
    return pt;
  }

  function withLang(href) {
    var hash = "";
    var i = href.indexOf("#");
    if (i > -1) {
      hash = href.slice(i);
      href = href.slice(0, i);
    }
    href = href.replace(/([?&])lang=[^&]*&?/, "$1").replace(/[?&]$/, "");
    if (current === "en") href += (href.indexOf("?") > -1 ? "&" : "?") + "lang=en";
    return href + hash;
  }

  function translate(scope) {
    remember(scope);

    each(scope, "[data-i18n]", function (el) {
      var o = original.get(el);
      var value = pick(el.getAttribute("data-i18n"), o.html);
      if (el.tagName === "TITLE") {
        if (el.textContent !== value) el.textContent = value;
        return;
      }
      var typing = el.hasAttribute("data-typing") && el.classList.contains("is-typing");
      if (el.innerHTML !== value || typing) el.innerHTML = value;
      /* Título da home: se a digitação já começou, mostra o texto inteiro. */
      if (typing) {
        el.classList.remove("is-typing", "is-done");
        el.classList.add("is-static");
      }
    });

    Object.keys(ATTRS).forEach(function (suffix) {
      var name = ATTRS[suffix];
      each(scope, "[data-i18n-" + suffix + "]", function (el) {
        var o = original.get(el);
        var value = pick(el.getAttribute("data-i18n-" + suffix), o.attrs[name]);
        if (value != null && el.getAttribute(name) !== value) el.setAttribute(name, value);
      });
    });

    /* Links internos levam o idioma junto, para a próxima página abrir igual. */
    remember(scope);
    each(scope, "a[href]", function (a) {
      var href = original.get(a).href;
      if (!href || EXTERNAL.test(href)) return;
      var next = withLang(href);
      if (a.getAttribute("href") !== next) a.setAttribute("href", next);
    });
  }

  function updateHead() {
    root.lang = LANGS[current].html;
    var og = doc.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute("content", LANGS[current].og);
    var alt = doc.querySelector('meta[property="og:locale:alternate"]');
    if (alt) alt.setAttribute("content", LANGS[current === "en" ? "pt" : "en"].og);
    ['link[rel="canonical"]', 'meta[property="og:url"]'].forEach(function (sel) {
      var el = doc.querySelector(sel);
      if (!el) return;
      var attr = el.tagName === "LINK" ? "href" : "content";
      var o = store(el);
      if (o.url == null) o.url = el.getAttribute(attr);
      el.setAttribute(attr, withLang(o.url));
    });
  }

  function updateSwitch() {
    [].forEach.call(doc.querySelectorAll("[data-set-lang]"), function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-set-lang") === current));
    });
  }

  function updateUrl() {
    if (!window.history || !history.replaceState) return;
    try {
      var url = new URL(location.href);
      if (current === "en") url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");
      if (url.href !== location.href) history.replaceState(history.state, "", url.href);
    } catch (err) {}
  }

  function setLang(lang, save) {
    current = LANGS[lang] ? lang : "pt";
    translate(doc);
    updateHead();
    updateSwitch();
    if (save) {
      updateUrl();
      try {
        localStorage.setItem(STORE, current);
      } catch (err) {}
    }
    root.classList.remove("i18n-pending");
    var ev;
    try {
      ev = new CustomEvent("langchange", { detail: { lang: current } });
    } catch (err) {
      ev = doc.createEvent("CustomEvent");
      ev.initCustomEvent("langchange", false, false, { lang: current });
    }
    doc.dispatchEvent(ev);
  }

  /* Idioma inicial: URL (?lang=en ou ?lang=pt) > escolha salva > português. */
  function initial() {
    var lang = null;
    try {
      lang = new URLSearchParams(location.search).get("lang");
    } catch (err) {}
    if (!LANGS[lang]) {
      try {
        lang = localStorage.getItem(STORE);
      } catch (err) {}
    }
    return LANGS[lang] ? lang : "pt";
  }

  remember(doc);
  var start = initial();
  if (start === "en") setLang("en", false);
  else {
    updateSwitch();
    root.classList.remove("i18n-pending");
  }

  doc.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-set-lang]");
    if (!btn) return;
    var lang = btn.getAttribute("data-set-lang");
    if (lang !== current) setLang(lang, true);
  });

  window.SiteI18n = {
    lang: function () { return current; },
    t: function (key, pt) { return pick(key, pt); },
    apply: function (scope) { translate(scope || doc); }
  };
})();
