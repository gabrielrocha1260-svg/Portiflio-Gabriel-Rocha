# Portfólio de Gabriel Rocha

Site estático em HTML, CSS e JavaScript puro. Não precisa de build, framework nem servidor especial.

## Estrutura

```
index.html                       Home: hero, projetos em destaque, sobre, contato
projetos/circuito-cinemas.html   Estudo de caso: redesign conceitual
projetos/study.html              Estudo de caso: app de estudos no ar
assets/css/styles.css            Estilos de todo o site
assets/js/main.js                Menu móvel, sumário dos cases, lightbox, digitação do título
assets/img/                      Imagens em WebP (telas, pranchas, imagem de compartilhamento)
assets/fonts/                    Inter e Lora hospedadas junto com o site
favicon.svg, robots.txt, sitemap.xml
```

Para ver localmente, abra a pasta em um servidor simples, por exemplo `python3 -m http.server`, e acesse `http://localhost:8000`.
Abrir o `index.html` direto no navegador também funciona.

## Tema escuro e movimento

- **Modo escuro automático.** O site segue o tema do aparelho (`prefers-color-scheme`). Não há botão para trocar. As seções que são claras no tema claro passam a usar superfícies marinho-escuras; as que já eram escuras não mudam. As cores ficam no começo de `assets/css/styles.css`, em `:root` (claro) e no bloco "Modo escuro" (escuro). Para forçar um tema no teste, use `data-theme="dark"` ou `data-theme="light"` no `<html>`.
- **Título digitado.** A frase da home é escrita letra a letra uma vez por carregamento (cerca de 3 segundos). O texto completo continua disponível para leitores de tela. A animação não roda quando o sistema pede "reduzir movimento", sem JavaScript, e quando a pessoa volta para a home vindo de outra página do site. Para desligar de vez, remova `data-typing` do `<h1>` em `index.html`.

## Como publicar no GitHub Pages

O site está configurado para `https://gabrielrocha1260-svg.github.io/Portiflio-Gabriel-Rocha/`. Os caminhos de arquivos são relativos, então funcionam nessa subpasta.

1. No repositório, substitua os arquivos pelos desta pasta, mantendo a estrutura (`index.html` na raiz, `projetos/`, `assets/`, `favicon.svg`, `robots.txt`, `sitemap.xml`). Pelo navegador: "Add file" > "Upload files", arraste o conteúdo da pasta (não a pasta em si) e confirme o commit na branch publicada.
2. Em Settings > Pages, confira que a fonte é a branch e a pasta onde está o `index.html`. A atualização leva de 1 a 2 minutos.
3. Abra o endereço acima em uma janela anônima e teste os dois cases, o botão de demo e o botão do protótipo.

Se o endereço mudar (domínio próprio, outro nome de repositório), troque o endereço de `og:image`, `og:url` e `canonical` nas três páginas e o de `sitemap.xml` e `robots.txt`. Sem isso, o cartão de compartilhamento pode não aparecer no LinkedIn e no WhatsApp.

## Antes de divulgar

1. **Protótipo do Circuito Cinemas.** O botão "Abrir protótipo no Figma" aponta para o protótipo do arquivo, com início na tela Home. No Figma, em Compartilhar, deixe o acesso como "Qualquer pessoa com o link pode ver"; do contrário, quem visita o portfólio cai numa tela de pedido de acesso. Abra o link em uma janela anônima para conferir.
2. **Demo do Study.** O link é `https://studyapp-kyi5.onrender.com/` e abre em nova aba. Se o login com Google estiver no modo de testes, só contas autorizadas conseguem entrar. Vale publicar o app OAuth ou avisar na página.
3. **Autoria do código do Study.** A seção "Quem fez o quê" do case traz um item "Em aberto" sobre como o código foi escrito. Quando tiver a resposta, edite o terceiro cartão dessa seção.

## Origem do conteúdo

- Circuito Cinemas: tudo vem das pranchas e dos slides do projeto. Personas, jornada e métricas aparecem como hipóteses, porque o material não registra pesquisa com usuários.
- Study: as funcionalidades, regras e limites descritos vêm do código do produto. As telas foram geradas fora do app em produção, com perfil e histórico fictícios, e a página avisa isso.
- Os textos de Aprendizados do Study foram escritos a partir das evidências do código e precisam da sua revisão.
- Os planos de teste de usabilidade dos dois cases são propostas, marcadas como tal. Nenhum teste aconteceu.
- Cinema: as métricas da prancha original aparecem como metas hipotéticas, porque o material não cita a fonte. Das 34 fricções, só 16 estão detalhadas nas pranchas, e a página diz isso.
