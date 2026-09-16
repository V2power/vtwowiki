// Markdown GFM (tabelas, listas de tarefas etc.), com HTML higienizado.
// Os arquivos das bibliotecas estão no projeto, sem dependência de uma CDN.
function headingSlug(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "heading";
}

function renderMarkdown(source, fileUrl, container) {
  const html = marked.parse(source.replace(/^\uFEFF/, ""), { gfm: true });
  container.innerHTML = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "form", "button", "textarea", "select"],
    FORBID_ATTR: ["style", "id", "name"],
  });

  // Âncoras estáveis, inclusive quando há títulos repetidos.
  const usedIds = new Set();
  const headings = [];
  container.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(heading => {
    const slug = headingSlug(heading.textContent);
    let id = `section-${slug}`;
    let suffix = 2;
    while (usedIds.has(id)) id = `section-${slug}-${suffix++}`;
    usedIds.add(id);
    heading.id = id;
    headings.push({ id, text: heading.textContent, level: Number(heading.tagName[1]) });
  });

  // Links e imagens relativos são resolvidos a partir do arquivo .md.
  container.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      link.href = href.startsWith("#section-") ? href : `#section-${href.slice(1)}`;
      return;
    }
    let target;
    try { target = new URL(href, fileUrl); }
    catch { link.removeAttribute("href"); return; }
    const related = resources.find(item => {
      const paths = typeof item.markdown === "string" ? [item.markdown] : Object.values(item.markdown || {});
      return paths.some(path => new URL(path, siteRoot).pathname === target.pathname && target.origin === location.origin);
    });
    if (related) {
      link.href = articleUrl(related) + (target.hash ? `#section-${target.hash.slice(1).replace(/^section-/, "")}` : "");
    } else {
      link.href = target.href;
      if (target.origin !== location.origin && /^https?:$/.test(target.protocol)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
  });
  container.querySelectorAll("img[src]").forEach(img => {
    try { img.src = new URL(img.getAttribute("src"), fileUrl).href; }
    catch { img.removeAttribute("src"); }
    img.loading = "lazy";
    img.decoding = "async";
  });

  // As tabelas largas rolam dentro da resenha, sem alargar a página.
  container.querySelectorAll("table").forEach(table => {
    const wrapper = element("div", "markdown-table");
    wrapper.tabIndex = 0;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", language === "pt" ? "Tabela com rolagem horizontal" : "Horizontally scrollable table");
    table.replaceWith(wrapper);
    wrapper.append(table);
  });
  container.querySelectorAll('input[type="checkbox"]').forEach(input => { input.disabled = true; });
  container.querySelectorAll("pre").forEach(pre => { pre.tabIndex = 0; });

  // Avisos no formato do GitHub: > [!NOTE], > [!TIP], > [!WARNING] etc.
  const labels = language === "pt"
    ? { NOTE: "Nota", TIP: "Dica", IMPORTANT: "Importante", WARNING: "Atenção", CAUTION: "Cuidado" }
    : { NOTE: "Note", TIP: "Tip", IMPORTANT: "Important", WARNING: "Warning", CAUTION: "Caution" };
  container.querySelectorAll("blockquote").forEach(quote => {
    const first = quote.querySelector("p");
    const text = first?.firstChild;
    if (text?.nodeType !== Node.TEXT_NODE) return;
    const match = text.textContent.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
    if (!match) return;
    text.textContent = text.textContent.slice(match[0].length);
    quote.classList.add("callout", `callout-${match[1].toLowerCase()}`);
    quote.prepend(element("strong", "callout-label", labels[match[1]]));
  });
  return headings;
}
