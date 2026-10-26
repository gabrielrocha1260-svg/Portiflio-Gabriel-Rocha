# Portfólio de Gabriel Rocha

Site estático em HTML, CSS e JavaScript puro. Não precisa de build, framework nem servidor especial.

## Estrutura

```
index.html                       Home: hero, projetos em destaque, sobre, contato
projetos/circuito-cinemas.html   Estudo de caso: redesign conceitual
projetos/study.html              Estudo de caso: app de estudos no ar
assets/css/styles.css            Estilos de todo o site
assets/js/main.js                Menu móvel, sumário dos cases, lightbox
assets/js/i18n.js                Seletor de idioma PT | EN (troca sem recarregar a página)
assets/js/translations.js        Todas as traduções para o inglês, por chave
assets/docs/                     Currículo em PDF (cópia de entregaveis/curriculos/final)
assets/img/                      Imagens em WebP (telas, pranchas, imagem de compartilhamento)
assets/fonts/                    Inter e Inter Display hospedadas junto com o site
favicon.svg, robots.txt, sitemap.xml
```

## Sistema visual (v3, outubro de 2026)

Palco neutro, grafite e branco, sem cor de marca. A cor entra pelos projetos:
cada um aparece sobre os tokens reais do próprio design system. Referência:
Apple Human Interface Guidelines (marca cede lugar ao conteúdo, uma cor por
significado, movimento só com propósito, contraste 4,5:1, alvos de 44 px).
Tudo sai dos tokens no topo de `assets/css/styles.css`:

- **Cores do site:** fundo `--bg` #F4F5F7, grupos `--surface` #FFFFFF, texto
  `--ink` #15171C (16,4:1), `--ink-2` (7,5:1), `--ink-3` (5,4:1). Links e foco
  `--link` #1F5BD6 (5,5:1). Status `--ok`. Modo escuro troca só os tokens.
- **Cores dos projetos:** `--cc-*` (#0D0D0D, laranja acessível #FF6B35) e
  `--study-*` (#111827, #60A5FA). Nos cases, `<body data-case="cc|study">`
  aplica essas cores ao palco de abertura e aos painéis de telas.
- **Assinatura:** a ficha técnica de cada projeto (`.spec-sheet`, `.case-tokens`)
  com as cores reais em amostras (`.token`, cor em `--c`).
- **Tipografia:** Inter Display nos títulos (600), Inter na leitura (17 px) e
  na interface. Escala fluida em `--fs-*`.
- **Componentes:** `.btn` (`--primary`, `--secondary`, `--lg`, `--sm`; 44 px de
  altura, exceto o `--sm` da barra no desktop, com 36 px; estados de hover, pressão, foco e desabilitado), `.link` (`--arrow`,
  `--external`, `--download`), ícones por máscara (`.icon`, uma só família),
  `.group` (lista agrupada para dados), `.showcase` (vitrine do projeto).
- **Movimento:** só feedback de estado. Sem animação de entrada. Respeita
  "reduzir movimento", "reduzir transparência" e "aumentar contraste".
- **Breakpoints:** 640 px, 900 px (menu de tela cheia) e 1100 px (sumário do case).

## Idiomas

O português é o padrão e fica escrito no próprio HTML. O inglês fica em
`assets/js/translations.js`: cada texto traduzível do HTML tem um atributo
`data-i18n="chave"` (ou `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-title`,
`data-i18n-label`, `data-i18n-content` para atributos), e a mesma chave no arquivo
de traduções. Para corrigir uma tradução, edite só o `translations.js`.

A versão em inglês de cada página é a mesma URL com `?lang=en`, por exemplo
`projetos/study.html?lang=en`. A escolha fica salva no navegador e os links
internos levam o idioma junto.
