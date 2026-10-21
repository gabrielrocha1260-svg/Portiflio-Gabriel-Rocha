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
assets/fonts/                    Inter e Lora hospedadas junto com o site
favicon.svg, robots.txt, sitemap.xml
```

## Sistema visual (v2, outubro de 2026)

Editorial claro com "placas" escuras para cada projeto. Tudo sai dos tokens no
topo de `assets/css/styles.css`:

- **Cores:** papel `--bg` #F4F2ED, tinta `--ink` #121211, um acento vermelhão
  (`--accent` para elementos gráficos e texto grande, `--accent-ink` para texto
  pequeno). Placas: `--plate-cc` (Circuito Cinemas), `--plate-study` (Study) e
  `--plate-ink` (contato, rodapé). Modo escuro troca só os tokens.
- **Tipografia:** Inter Display nos títulos, Lora itálico para a voz editorial
  (palavras em `<em>` nos títulos), Inter na leitura e na interface.
- **Cor do case:** `<body data-case="cc">` ou `data-case="study"` define a cor das
  placas e painéis daquela página.
- **Movimento:** `data-reveal` faz o bloco entrar ao rolar (uma vez). Nada fica
  escondido sem JavaScript ou com "reduzir movimento".

## Idiomas

O português é o padrão e fica escrito no próprio HTML. O inglês fica em
`assets/js/translations.js`: cada texto traduzível do HTML tem um atributo
`data-i18n="chave"` (ou `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-title`,
`data-i18n-label`, `data-i18n-content` para atributos), e a mesma chave no arquivo
de traduções. Para corrigir uma tradução, edite só o `translations.js`.

A versão em inglês de cada página é a mesma URL com `?lang=en`, por exemplo
`projetos/study.html?lang=en`. A escolha fica salva no navegador e os links
internos levam o idioma junto.
