// Raiz do site, inclusive quando publicado em uma subpasta do GitHub Pages.
const siteRoot = new URL(document.body.dataset.root || "./", document.baseURI);

// Componentes pequenos compartilhados entre a coleção e as resenhas.
function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

function externalLink(url, className) {
  const link = element("a", className);
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  const button = document.querySelector("#theme-toggle");
  button.textContent = theme === "dark" ? "☀" : "☾";
  button.setAttribute("aria-label", messages[language][theme === "dark" ? "light" : "dark"]);
  button.title = button.getAttribute("aria-label");
}

function updateHeader() {
  const navigation = document.querySelector("#header-links");
  navigation.setAttribute("aria-label", language === "pt" ? "Links principais" : "Main links");
  navigation.replaceChildren();
  headerLinks.forEach(item => {
    const link = externalLink(item.url, "header-link");
    const icon = element("span", "header-brand-icon");
    icon.style.setProperty("--brand-icon", `url("${new URL(item.icon, siteRoot).href}")`);
    icon.setAttribute("aria-hidden", "true");
    link.append(icon);
    link.title = item.name;
    link.setAttribute("aria-label", `${item.name} (${messages[language].newTab})`);
    navigation.append(link);
  });
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  document.querySelector(".brand-sub").textContent = language === "pt" ? "wiki pessoal" : "personal wiki";
  document.querySelector(".brand").setAttribute("aria-label", messages[language].home);
  const button = document.querySelector("#language-toggle");
  button.textContent = language === "pt" ? "EN" : "PT";
  button.setAttribute("aria-label", language === "pt" ? "Switch to English" : "Mudar para português");
  button.title = button.getAttribute("aria-label");
  button.lang = language === "pt" ? "en" : "pt-BR";
  applyTheme();
}

function setupPreferences(onLanguageChange) {
  document.querySelector("#language-toggle").addEventListener("click", () => {
    language = language === "pt" ? "en" : "pt";
    savePreference("wiki-language", language);
    onLanguageChange();
  });
  document.querySelector("#theme-toggle").addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    savePreference("wiki-theme", theme);
    applyTheme();
  });
}

function articleUrl(item) {
  return new URL(`pages/article.html?id=${encodeURIComponent(item.id)}`, siteRoot).href;
}
