// Carregado antes do conteúdo para evitar um flash do tema errado.
// Se o navegador bloquear o armazenamento, os botões ainda funcionam.
function readPreference(key, fallback) {
  try { return localStorage.getItem(key) || fallback; }
  catch { return fallback; }
}
function savePreference(key, value) {
  try { localStorage.setItem(key, value); }
  catch { /* Mantém a escolha apenas nesta visita. */ }
}
let language = readPreference("wiki-language", "en") === "pt" ? "pt" : "en";
let theme = readPreference("wiki-theme", "dark") === "light" ? "light" : "dark";
document.documentElement.dataset.theme = theme;
document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
