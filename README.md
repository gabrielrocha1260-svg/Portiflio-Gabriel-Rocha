# Portfólio de Gabriel Rocha

Site estático em HTML, CSS e JavaScript puro. Não precisa de build, framework nem servidor especial.

## Estrutura

```
index.html                       Home: hero, projetos em destaque, sobre, contato
projetos/circuito-cinemas.html   Estudo de caso: redesign conceitual
projetos/study.html              Estudo de caso: app de estudos no ar
assets/css/styles.css            Estilos de todo o site
assets/js/main.js                Menu móvel, sumário dos cases, lightbox, digitação do título
assets/js/i18n.js                Seletor de idioma PT | EN (troca sem recarregar a página)
assets/js/translations.js        Todas as traduções para o inglês, por chave
assets/img/                      Imagens em WebP (telas, pranchas, imagem de compartilhamento)
assets/fonts/                    Inter e Lora hospedadas junto com o site
favicon.svg, robots.txt, sitemap.xml
```

## Idiomas

O português é o padrão e fica escrito no próprio HTML. O inglês fica em
`assets/js/translations.js`: cada texto traduzível do HTML tem um atributo
`data-i18n="chave"` (ou `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-title`,
`data-i18n-label`, `data-i18n-content` para atributos), e a mesma chave no arquivo
de traduções. Para corrigir uma tradução, edite só o `translations.js`.

A versão em inglês de cada página é a mesma URL com `?lang=en`, por exemplo
`projetos/study.html?lang=en`. A escolha fica salva no navegador e os links
internos levam o idioma junto.
