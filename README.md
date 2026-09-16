# vtwo — wiki pessoal

Uma wiki estática com visual inspirado em Material, categorias, busca e resenhas em Markdown. HTML, CSS e JavaScript, sem instalação ou etapa de compilação para publicar. Marked e DOMPurify estão incluídos em `assets/vendor/` para renderizar Markdown com segurança, sem CDN.

## Organização

```text
vtwowiki/
├── index.html             # Página inicial (entrada do GitHub Pages)
├── .nojekyll              # Publicação estática
├── README.md
├── pages/
│   └── article.html       # Página de leitura das resenhas
├── content/               # Uma pasta por recurso
│   ├── anki/
│   │   ├── anki.en.md
│   │   └── anki.pt.md
│   └── yomitan/
│       ├── yomitan.en.md
│       └── yomitan.pt.md
├── data/
│   ├── data.js            # Categorias, recursos, caminhos e perfis
│   └── translations.js    # Traduções da interface
├── assets/
│   ├── css/               # Estilos da coleção e das resenhas
│   ├── js/                # Comportamento e renderização
│   ├── icons/             # Favicon e ícones dos sites
│   └── vendor/            # Bibliotecas externas e licenças
└── tests/                 # Verificações de desenvolvimento
```

Para editar o conteúdo, concentre-se em **`content/`** e **`data/`**. Os caminhos em `data/data.js` continuam relativos à raiz do projeto, por exemplo `content/anki/anki.pt.md`.

## Abrir

Para carregar as resenhas Markdown, use um servidor local. Com Python instalado, execute na pasta do projeto:

```sh
python -m http.server 4173
```

Abra `http://localhost:4173`. No GitHub Pages isso funciona automaticamente. A coleção ainda abre por duplo clique, mas o navegador não permite carregar os arquivos Markdown usando `file://`.

## Personalizar

- **`data/data.js`**: categorias, programas, addons e links sociais. Os recursos iniciais são exemplos; os links sociais apontam para as páginas iniciais dos serviços até você inserir seus perfis.
- **`index.html`**: nome da wiki, título e textos fixos.
- **`assets/css/styles.css`**: cores, tamanhos e layout. As cores principais ficam no começo, dentro de `:root`.
- **`assets/js/app.js`**: renderização dos cartões, filtro por categoria e busca.
- **`assets/icons/favicon.svg`**: ícone da aba.

### Adicionar um programa ou addon

Copie este objeto para a lista `resources` em `data/data.js`, separando os itens por vírgula:

```js
{
  id: "nome-do-programa", // único, sem espaços
  name: "Nome do programa",
  markdown: { en: "content/nome-do-programa/nome-do-programa.en.md", pt: "content/nome-do-programa/nome-do-programa.pt.md" },
  category: "japanese", // japanese, music ou games
  type: "Addon",
  description: "Uma descrição curta do que você usa e por quê.",
  url: "https://exemplo.com/",
  icon: "N",
},
```

Para uma categoria nova, adicione um objeto à lista `categories` com `id`, `name`, `icon`, `description` e `color`. As cores disponíveis são `purple`, `green` e `peach`; crie outras classes em `assets/css/styles.css` se quiser. O campo `category` de cada recurso deve corresponder a um `id` existente.

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

- `data/translations.js`: traduções da interface e das descrições dos recursos. Adicione traduções em `englishDescriptions` usando o nome exato do recurso (ou o id da categoria). Sem tradução, o texto original de `data/data.js` é exibido.
- `assets/js/preferences.js`: valores iniciais e armazenamento das preferências.
- `assets/css/styles.css`: as cores do tema claro ficam em `:root[data-theme="light"]`.

A troca de idioma preserva a busca e a categoria selecionada.

## Escrever resenhas em Markdown

Cada cartão abre `pages/article.html?id=ID-DO-RECURSO`. A página carrega o arquivo configurado em `markdown`, exibe um índice automático e mantém um botão separado para o site oficial. O endereço pode ser compartilhado e recarregado no GitHub Pages, inclusive em repositórios com subpasta.

### Editar o Anki

- `content/anki/anki.pt.md`: resenha em português.
- `content/anki/anki.en.md`: resenha em inglês.

As duas páginas são modelos editáveis, não relatos reais do seu uso. As demais ferramentas têm modelos iniciais mais curtos. O nome da ferramenta já aparece no cabeçalho: comece o arquivo com um parágrafo ou títulos `##`.

### Criar uma resenha

1. Crie uma pasta dentro de `content/` para o recurso e adicione o arquivo, por exemplo `content/minha-ferramenta/minha-ferramenta.pt.md`.
2. Adicione o recurso em `data/data.js`, com `id` único e o caminho em `markdown`.
3. Escreva seu texto, salve e atualize a página. Envie os arquivos ao GitHub para atualizar a versão publicada.

Se você escrever apenas em português, use:

```js
markdown: { pt: "content/minha-ferramenta/minha-ferramenta.pt.md" },
```

O texto em português também será exibido na interface em inglês, com um aviso de que não há tradução. A tradução não é automática. Para um texto único compartilhado entre os dois idiomas, também é possível usar `markdown: "content/minha-ferramenta/minha-ferramenta.md"`.

### Formatação disponível

- Títulos, **negrito**, *itálico*, ~~riscado~~ e separadores.
- Listas simples, numeradas, aninhadas e tarefas (`- [ ]`, `- [x]`).
- Links, imagens, citações, tabelas e blocos de código.
- Avisos `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` e `> [!CAUTION]`.
- Seções recolhíveis com HTML `<details><summary>Texto</summary>…</details>`; deixe linhas vazias antes e depois do conteúdo Markdown interno.

O formato é Markdown comum com extensões do GitHub (GFM). Fórmulas LaTeX, Mermaid, notas de rodapé e sintaxe exclusiva de outros geradores não são interpretados. Blocos de código preservam a formatação, sem realce de sintaxe por linguagem. HTML básico é permitido; scripts, iframes e estilos embutidos são removidos.

### Imagens e links entre resenhas

Os caminhos são relativos ao arquivo Markdown:

```md
![Meu cartão do Anki](images/meu-cartao.png)

[Minhas notas sobre Yomitan](../yomitan/yomitan.pt.md)

[Ir para uma seção](#addons-que-utilizo)
```

Nesse exemplo, coloque a imagem em `content/anki/images/meu-cartao.png`. Links para arquivos `.md` cadastrados em `data/data.js` abrem a página de leitura automaticamente. Outros arquivos são links normais. As âncoras dos títulos ignoram acentos: `## Addons que utilizo` vira `#addons-que-utilizo` dentro do Markdown (na URL da página, `#section-addons-que-utilizo`).

### Arquivos do sistema de leitura

- `pages/article.html`: estrutura da página.
- `assets/js/article.js`: carrega a resenha, monta a navegação e troca os idiomas.
- `assets/js/markdown.js`: conversão, tabelas, avisos, imagens e âncoras.
- `assets/css/article.css`: aparência do texto e layout da leitura.
- `assets/js/ui.js`: cabeçalho, preferências e funções compartilhadas com a coleção.
- `assets/vendor/`: bibliotecas e licenças. Não é necessário editar esses arquivos.

## Verificação opcional para desenvolvimento

`tests/markdown.cjs` verifica as resenhas, tradução, navegação, formatação, higienização e erros usando Node.js e `jsdom`. Essa dependência serve apenas aos testes, não à wiki. Instale `jsdom` em um diretório de desenvolvimento e aponte `NODE_PATH` para o `node_modules` desse diretório antes de executar `node tests/markdown.cjs` na raiz do projeto.
