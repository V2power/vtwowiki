// Textos da interface. Cada par contém [português, inglês].
const interfaceText = {
  ".skip-link": ["Pular para a coleção", "Skip to collection"],
  ".brand-sub": ["wiki pessoal", "personal wiki"],
  ".intro > .eyebrow": ["MINHA BIBLIOTECA DIGITAL", "MY DIGITAL LIBRARY"],
  ".intro > p": ["Programas, addons e recursos. Tudo no seu lugar.", "Apps, addons and resources. Everything in its place."],
  "#show-all": ["Ver tudo ↗", "View all ↗"],
  ".sample-note": ["Coleção de exemplo — personalize com seus favoritos.", "Sample collection — make it yours with your favorites."],
  "#empty": ["Nenhum recurso encontrado. Tente outro termo ou veja toda a coleção.", "No resources found. Try another search or view the full collection."],
  ".elsewhere .eyebrow": ["ALÉM DA WIKI", "BEYOND THE WIKI"],
  "#elsewhere-title": ["Outros lugares", "Elsewhere"],
  ".elsewhere p": ["Filmes, jogos e histórias que acompanho.", "Films, games and stories I follow."],
  ".footer .muted": ["/ feito para consultar e compartilhar.", "/ made to browse and share."],
  ".footer a": ["Voltar ao topo ↑", "Back to top ↑"],
};
const messages = {
  pt: { all: "Toda a coleção", description: "Uma seleção de ferramentas para o dia a dia.", search: "Buscar na coleção", resources: "recursos", newTab: "abre em nova aba", light: "Ativar tema claro", dark: "Ativar tema escuro", categories: "Categorias", home: "vtwo wiki, início", title: ["Coisas que valem", "ter por perto"], types: {} },
  en: { all: "The whole collection", description: "A selection of tools for everyday life.", search: "Search the collection", resources: "resources", newTab: "opens in a new tab", light: "Switch to light mode", dark: "Switch to dark mode", categories: "Categories", home: "vtwo wiki, home", title: ["Things worth", "keeping close"], types: { Programa: "App", Addon: "Addon", Site: "Website" } },
};

// Traduções opcionais dos recursos. Itens novos sem tradução usam o texto original.
const englishDescriptions = {
  japanese: "Learn, read and explore the language.",
  music: "Listen better. Discover more.",
  games: "Play, organize and revisit.",
  Anki: "Spaced repetition flashcards to keep your vocabulary fresh.",
  Yomitan: "A Japanese dictionary to look up words while reading in your browser.",
  Jisho: "A quick reference for words, kanji and usage examples.",
  foobar2000: "An audio player to organize and enjoy your local library.",
  "MusicBrainz Picard": "Organize the metadata and tags in your albums.",
  MusicBee: "Your library, playlists and music playback in one place.",
  Playnite: "Bring games from your different libraries together in one interface.",
  RetroArch: "A frontend for emulators and your favorite classic games.",
  PCGamingWiki: "Fixes and tweaks to get more out of your PC games.",
};
function descriptionFor(item) {
  return language === "en" ? englishDescriptions[item.id || item.name] || item.description : item.description;
}
function categoryName(category) {
  const portuguese = { japanese: "Japonês", music: "Música", games: "Jogos" };
  return language === "pt" ? portuguese[category.id] || category.name : category.name;
}
function resourceType(item) { return messages[language].types[item.type] || item.type; }
