# Portfólio de Gabriel Rocha

Site estático em HTML, CSS e JavaScript puro. Não precisa de build, framework nem servidor especial.

## Estrutura

```
index.html                       Home: hero, projetos em destaque, sobre, contato
projetos/circuito-cinemas.html   Estudo de caso: redesign conceitual
projetos/study.html              Estudo de caso: app de estudos no ar
assets/css/styles.css            Estilos de todo o site
assets/js/main.js                Menu móvel, sumário dos cases, lightbox, copiar e-mail, digitação do título
assets/img/                      Imagens em WebP (telas, pranchas, imagem de compartilhamento)
assets/fonts/                    Inter e Lora hospedadas junto com o site
favicon.svg, robots.txt
```

Para ver localmente, abra a pasta em um servidor simples, por exemplo `python3 -m http.server`, e acesse `http://localhost:8000`.
Abrir o `index.html` direto no navegador também funciona.

## Tema escuro e movimento

- **Modo escuro automático.** O site segue o tema do aparelho (`prefers-color-scheme`). Não há botão para trocar. As seções que são claras no tema claro passam a usar superfícies marinho-escuras; as que já eram escuras não mudam. As cores ficam no começo de `assets/css/styles.css`, em `:root` (claro) e no bloco "Modo escuro" (escuro). Para forçar um tema no teste, use `data-theme="dark"` ou `data-theme="light"` no `<html>`.
- **Título digitado.** A frase da home é escrita letra a letra uma vez por carregamento (cerca de 3 segundos). O texto completo continua disponível para leitores de tela. A animação não roda quando o sistema pede "reduzir movimento", sem JavaScript, e quando a pessoa volta para a home vindo de outra página do site. Para desligar de vez, remova `data-typing` do `<h1>` em `index.html`.

## Antes de publicar

1. **Endereço do site.** Depois de escolher onde hospedar (GitHub Pages, Netlify, Vercel ou outro), troque `assets/img/og.png` no `og:image` das três páginas pelo endereço completo da imagem e acrescente `<link rel="canonical">` e `og:url` com o endereço de cada página. Sem isso, o cartão de compartilhamento pode não aparecer no LinkedIn e no WhatsApp.
2. **Protótipo do Circuito Cinemas.** O botão "Abrir protótipo no Figma" aponta para o protótipo do arquivo, com início na tela Home. No Figma, em Compartilhar, deixe o acesso como "Qualquer pessoa com o link pode ver"; do contrário, quem visita o portfólio cai numa tela de pedido de acesso. Abra o link em uma janela anônima para conferir.
3. **Demo do Study.** O link é `https://gabrielrocha1260-svg.github.io/Studyapp/` e abre em nova aba. Se o login com Google estiver no modo de testes, só contas autorizadas conseguem entrar. Vale publicar o app OAuth ou avisar na página.

## Origem do conteúdo

- Circuito Cinemas: tudo vem das pranchas e dos slides do projeto. Personas, jornada e métricas aparecem como hipóteses, porque o material não registra pesquisa com usuários.
- Study: as funcionalidades, regras e limites descritos vêm do código do produto. As telas foram geradas fora do app em produção, com perfil e histórico fictícios, e a página avisa isso.
- Os textos de Aprendizados do Study foram escritos a partir das evidências do código e precisam da sua revisão.
