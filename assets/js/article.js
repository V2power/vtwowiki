const article = document.querySelector("#article-content");
const status = document.querySelector("#article-status");
const retry = document.querySelector("#retry");
const item = resources.find(resource => resource.id === new URLSearchParams(location.search).get("id"));
let requestNumber = 0; // Impede uma resposta antiga de substituir o idioma recém-selecionado.
const markdownCache = new Map();

const articleText = {
  en: { back: "← Collection", toc: "On this page", official: "Official website ↗", loading: "Loading notes…", missing: "This article was not found. Return to the collection to choose a resource.", error: "The article could not be loaded. Try again in a moment.", local: "To load Markdown files, open this wiki using a local server or GitHub Pages.", retry: "Try again", draft: "No review yet. Come back soon.", fallback: "This review is available in Portuguese only.", footer: "/ personal notes.", related: "In this category", skip: "Skip to article", top: "Back to top ↑" },
  pt: { back: "← Coleção", toc: "Nesta página", official: "Site oficial ↗", loading: "Carregando resenha…", missing: "Esta resenha não foi encontrada. Volte à coleção para escolher um recurso.", error: "Não foi possível carregar a resenha. Tente novamente em instantes.", local: "Para carregar os arquivos Markdown, abra a wiki com um servidor local ou no GitHub Pages.", retry: "Tentar novamente", draft: "Ainda não há uma resenha. Volte em breve.", fallback: "Esta resenha está disponível apenas em inglês.", footer: "/ notas pessoais.", related: "Nesta categoria", skip: "Pular para a resenha", top: "Voltar ao topo ↑" },
};

async function loadArticle() {
  const currentRequest = ++requestNumber;
  const text = articleText[language];
  updateHeader();
  document.querySelector("#back-link").textContent = text.back;
  document.querySelector("#toc-title").textContent = text.toc;
  document.querySelector("#article-footer").textContent = text.footer;
  document.querySelector("#top-link").textContent = text.top;
  document.querySelector(".skip-link").textContent = text.skip;
  document.querySelector("#related").setAttribute("aria-label", text.related);
  document.querySelector(".article-index").hidden = true;
  retry.textContent = text.retry;
  retry.hidden = true;
  article.hidden = true;
  article.replaceChildren();
  status.hidden = false;
  status.textContent = text.loading;

  if (!item) {
    document.querySelector("#article-title").textContent = language === "pt" ? "Resenha não encontrada" : "Article not found";
    status.textContent = text.missing;
    return;
  }
  const category = categories.find(category => category.id === item.category);
  document.title = `${item.name} / vtwo`;
  document.querySelector("#article-title").textContent = item.name;
  document.querySelector("#article-category").textContent = `${categoryName(category)} / ${resourceType(item)}`;
  document.querySelector("#article-description").textContent = descriptionFor(item);
  document.querySelector('meta[name="description"]').content = descriptionFor(item);
  const official = document.querySelector("#official-link");
  official.href = item.url;
  official.textContent = text.official;
  official.hidden = false;
  const related = document.querySelector("#related");
  related.replaceChildren(element("h2", "eyebrow", categoryName(category)));
  resources.filter(resource => resource.category === item.category).forEach(resource => {
    const link = element("a", "related-link", resource.name);
    link.href = articleUrl(resource);
    if (resource.id === item.id) link.setAttribute("aria-current", "page");
    related.append(link);
  });

  // Um caminho único funciona em ambos os idiomas. Um objeto permite traduções.
  const paths = typeof item.markdown === "string" ? { [language]: item.markdown } : item.markdown || {};
  const contentLanguage = paths[language] ? language : (paths.en ? "en" : "pt");
  const path = paths[contentLanguage];
  if (!path) { status.textContent = text.draft; return; }
  if (location.protocol === "file:") { status.textContent = text.local; return; }

  try {
    const fileUrl = new URL(path, siteRoot);
    let source = markdownCache.get(fileUrl.href);
    if (source === undefined) {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Markdown: HTTP ${response.status}`);
      source = await response.text();
      markdownCache.set(fileUrl.href, source);
    }
    if (currentRequest !== requestNumber) return;
    const headings = renderMarkdown(source, fileUrl, article);
    article.lang = contentLanguage === "pt" ? "pt-BR" : "en";
    article.hidden = false;
    status.textContent = contentLanguage === language ? "" : text.fallback;
    status.hidden = contentLanguage === language;
    const toc = document.querySelector("#toc");
    toc.replaceChildren();
    headings.filter(heading => heading.level <= 3).forEach(heading => {
      const row = element("li", heading.level >= 3 ? "toc-nested" : "");
      const link = element("a", "", heading.text);
      link.href = `#${heading.id}`;
      row.append(link);
      toc.append(row);
    });
    document.querySelector(".article-index").hidden = !toc.children.length;
    if (location.hash) {
      let anchor;
      try { anchor = decodeURIComponent(location.hash.slice(1)); } catch { anchor = ""; }
      document.getElementById(anchor)?.scrollIntoView();
    }
  } catch (error) {
    if (currentRequest !== requestNumber) return;
    status.textContent = text.error;
    retry.hidden = false;
    console.error(error);
  }
}

retry.addEventListener("click", () => { markdownCache.clear(); loadArticle(); });
setupPreferences(loadArticle);
loadArticle();
