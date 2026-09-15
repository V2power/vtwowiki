// EDITE AQUI: o conteúdo da wiki fica separado do visual.
// Cada categoria precisa de um id único. Use esse id no campo "category" dos recursos.
const categories = [
  { id: "japanese", name: "Japanese", icon: "あ", description: "Aprender, ler e explorar o idioma.", color: "purple" },
  { id: "music", name: "Music", icon: "♫", description: "Ouvir melhor. Descobrir mais.", color: "green" },
  { id: "games", name: "Games", icon: "✛", description: "Jogar, organizar e revisitar.", color: "peach" },
];

// Os itens abaixo são EXEMPLOS, não uma lista dos seus programas reais.
// Para adicionar um recurso, copie um objeto e altere os campos.
const resources = [
  { name: "Anki", category: "japanese", type: "Programa", description: "Flashcards com repetição espaçada para manter o vocabulário em dia.", url: "https://apps.ankiweb.net/", icon: "A" },
  { name: "Yomitan", category: "japanese", type: "Addon", description: "Dicionário de japonês para consultar palavras durante a leitura no navegador.", url: "https://yomitan.wiki/", icon: "よ" },
  { name: "Jisho", category: "japanese", type: "Site", description: "Uma referência rápida para palavras, kanji e exemplos de uso.", url: "https://jisho.org/", icon: "辞" },
  { name: "foobar2000", category: "music", type: "Programa", description: "Player de áudio para organizar e ouvir sua biblioteca local.", url: "https://www.foobar2000.org/", icon: "f" },
  { name: "MusicBrainz Picard", category: "music", type: "Programa", description: "Organize os metadados e as tags dos seus álbuns.", url: "https://picard.musicbrainz.org/", icon: "P" },
  { name: "MusicBee", category: "music", type: "Programa", description: "Biblioteca, playlists e reprodução de música em um só lugar.", url: "https://getmusicbee.com/", icon: "♫" },
  { name: "Playnite", category: "games", type: "Programa", description: "Reúna os jogos das suas diferentes bibliotecas em uma única interface.", url: "https://playnite.link/", icon: "P" },
  { name: "RetroArch", category: "games", type: "Programa", description: "Uma interface para emuladores e seus jogos clássicos favoritos.", url: "https://www.retroarch.com/", icon: "R" },
  { name: "PCGamingWiki", category: "games", type: "Site", description: "Correções e ajustes para aproveitar melhor seus jogos de PC.", url: "https://www.pcgamingwiki.com/", icon: "PC" },
];

// Troque as URLs iniciais pelas URLs dos seus perfis pessoais.
const socialLinks = [
  { name: "Letterboxd", url: "https://letterboxd.com/", icon: "●", color: "#8bd5ac" },
  { name: "Backloggd", url: "https://backloggd.com/", icon: "▥", color: "#9ebcf7" },
  { name: "RetroAchievements", url: "https://retroachievements.org/", icon: "◆", color: "#efc276" },
  { name: "Exophase", url: "https://www.exophase.com/", icon: "✛", color: "#a9d196" },
  { name: "AniList", url: "https://anilist.co/", icon: "A", color: "#8ac5ed" },
];
