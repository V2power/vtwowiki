// Sem bibliotecas: os cartões são criados com as APIs nativas do navegador.
const categoryContainer = document.querySelector("#categories");
const resourceContainer = document.querySelector("#resources");
const search = document.querySelector("#search");
let selectedCategory = "all";

function renderCategories() {
categoryContainer.replaceChildren();
categories.forEach(category => {
  const button = element("button", `category ${category.color}`);
  button.type = "button";
  button.dataset.category = category.id;
  button.setAttribute("aria-pressed", "false");
  const top = element("span", "category-top");
  top.append(element("span", "category-icon", category.icon), element("span", "category-count", `${resources.filter(item => item.category === category.id).length} ${messages[language].resources}`));
  const title = element("span", "category-title", categoryName(category));
  title.append(element("span", "category-arrow", "↗"));
  button.append(top, title, element("span", "category-description", descriptionFor(category)));
  button.addEventListener("click", () => {
    selectedCategory = selectedCategory === category.id ? "all" : category.id;
    renderResources();
  });
  categoryContainer.append(button);
});
}

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderResources() {
  const category = categories.find(item => item.id === selectedCategory);
  const query = normalize(search.value.trim());
  const filtered = resources.filter(item =>
    (selectedCategory === "all" || item.category === selectedCategory) &&
    normalize(`${item.name} ${item.description} ${descriptionFor(item)} ${item.type} ${resourceType(item)} ${item.category} ${categoryName(categories.find(category => category.id === item.category))}`).includes(query)
  );
  document.querySelector("#collection-title").textContent = category ? categoryName(category) : messages[language].all;
  document.querySelector("#description").textContent = category ? descriptionFor(category) : messages[language].description;
  document.querySelector("#count").textContent = filtered.length;
  document.querySelector("#show-all").hidden = selectedCategory === "all";
  document.querySelector("#empty").hidden = filtered.length > 0;
  document.querySelector("#result-status").textContent = language === "en" ? `${filtered.length} ${filtered.length === 1 ? "resource" : "resources"} found` : `${filtered.length} ${filtered.length === 1 ? "recurso encontrado" : "recursos encontrados"}`;
  categoryContainer.querySelectorAll("button").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.category === selectedCategory));
  });
  resourceContainer.replaceChildren();
  filtered.forEach(item => {
    const category = categories.find(category => category.id === item.category);
    const card = element("a", "resource");
    card.href = articleUrl(item);
    card.setAttribute("aria-label", `${item.name} — ${language === "pt" ? "Ler resenha" : "Read review"}`);
    const icon = element("span", `resource-icon ${category.color}`, item.icon);
    icon.setAttribute("aria-hidden", "true");
    const body = element("div", "resource-body");
    const heading = element("div", "resource-heading");
    heading.append(element("h3", "", item.name), element("span", "external-arrow", "→"));
    body.append(heading, element("p", "", descriptionFor(item)));
    const metadata = element("div", "metadata");
    metadata.append(element("span", "", categoryName(category)), element("span", "metadata-dot", "·"), element("span", "", resourceType(item)));
    body.append(metadata);
    card.append(icon, body);
    resourceContainer.append(card);
  });
}

function renderSocialLinks() {
document.querySelector("#social-links").replaceChildren();
socialLinks.forEach(item => {
  const link = externalLink(item.url, "social-link");
  link.setAttribute("aria-label", `${item.name} (${messages[language].newTab})`);
  const icon = element("img", "social-icon");
  icon.src = item.icon;
  icon.alt = ""; // O nome do site já está no texto do link.
  icon.width = 20;
  icon.height = 20;
  icon.setAttribute("aria-hidden", "true");
  link.append(icon, element("span", "", item.name), element("span", "social-arrow", "↗"));
  document.querySelector("#social-links").append(link);
});
}

search.addEventListener("input", renderResources);
document.querySelector("#show-all").addEventListener("click", () => {
  selectedCategory = "all";
  renderResources();
});

// Atualiza o idioma sem apagar a busca ou a categoria selecionada.
function applyLanguage() {
  const text = messages[language];
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  document.title = language === "pt" ? "vtwo / wiki pessoal" : "vtwo / personal wiki";
  document.querySelector('meta[name="description"]').content = language === "pt"
    ? "Minha coleção pessoal de programas, addons e recursos para japonês, música e jogos."
    : "My personal collection of apps, addons and resources for Japanese, music and games.";
  Object.entries(interfaceText).forEach(([selector, translations]) => {
    document.querySelector(selector).textContent = translations[language === "pt" ? 0 : 1];
  });
  document.querySelector("#title").replaceChildren(
    document.createTextNode(text.title[0]), document.createElement("br"),
    document.createTextNode(text.title[1]), element("span", "accent", ".")
  );
  search.placeholder = `${text.search}…`;
  search.setAttribute("aria-label", text.search);
  categoryContainer.setAttribute("aria-label", text.categories);
  document.querySelector(".brand").setAttribute("aria-label", text.home);
  updateHeader();
  renderCategories();
  renderResources();
  renderSocialLinks();
  applyTheme();
}

setupPreferences(applyLanguage);
applyLanguage();
