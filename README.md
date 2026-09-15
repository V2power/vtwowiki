# vtwo — wiki pessoal

Uma wiki estática com visual inspirado em Material, categorias e busca. HTML, CSS e JavaScript puro: sem dependências, instalação ou etapa de compilação.

## Abrir

Abra `index.html` no navegador. Funciona também diretamente pelo arquivo, sem servidor.

## Personalizar

- **`data.js`**: categorias, programas, addons e links sociais. Os recursos iniciais são exemplos; os links sociais apontam para as páginas iniciais dos serviços até você inserir seus perfis.
- **`index.html`**: nome da wiki, título e textos fixos.
- **`styles.css`**: cores, tamanhos e layout. As cores principais ficam no começo, dentro de `:root`.
- **`app.js`**: renderização dos cartões, filtro por categoria e busca.
- **`favicon.svg`**: ícone da aba.

### Adicionar um programa ou addon

Copie este objeto para a lista `resources` em `data.js`, separando os itens por vírgula:

```js
{
  name: "Nome do programa",
  category: "japanese", // japanese, music ou games
  type: "Addon",
  description: "Uma descrição curta do que você usa e por quê.",
  url: "https://exemplo.com/",
  icon: "N",
},
```

Para uma categoria nova, adicione um objeto à lista `categories` com `id`, `name`, `icon`, `description` e `color`. As cores disponíveis são `purple`, `green` e `peach`; crie outras classes em `styles.css` se quiser. O campo `category` de cada recurso deve corresponder a um `id` existente.

Para mudar seus perfis, altere `url` em `socialLinks`. Todos os links externos abrem em nova aba.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos desta pasta, incluindo `.nojekyll`.
2. Nas configurações do repositório, entre em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch com seus arquivos (geralmente `main`) e a pasta **/ (root)**. Salve.
5. Aguarde a publicação e abra o endereço exibido pelo GitHub.

Os caminhos dos arquivos são relativos, então o site funciona tanto em `usuario.github.io` quanto em `usuario.github.io/repositorio/`.

## Comportamento

Clique em uma categoria para filtrar. Clique novamente nela ou em **Ver tudo** para voltar à coleção inteira. A busca considera nome, descrição, tipo e categoria, ignorando acentos e diferenças entre maiúsculas e minúsculas. Os filtros podem ser combinados.

O conteúdo é público quando publicado: não adicione informações privadas, senhas ou chaves de API. Não há backend, rastreamento, fontes externas nem serviços necessários para renderizar a página.


## Idioma e tema

Os botões no canto superior direito alternam entre inglês/português e tema claro/escuro. O padrão é inglês com tema escuro. As escolhas ficam salvas no navegador; quando o armazenamento está bloqueado, continuam funcionando durante a visita.

- `translations.js`: traduções da interface e das descrições dos recursos. Adicione traduções em `englishDescriptions` usando o nome exato do recurso (ou o id da categoria). Sem tradução, o texto original de `data.js` é exibido.
- `preferences.js`: valores iniciais e armazenamento das preferências.
- `styles.css`: as cores do tema claro ficam em `:root[data-theme="light"]`.

A troca de idioma preserva a busca e a categoria selecionada.
