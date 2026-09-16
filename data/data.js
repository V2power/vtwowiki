// EDITE AQUI: o conteúdo da wiki fica separado do visual.
// Cada categoria precisa de um id único. Use esse id no campo "category" dos recursos.
const categories = [
  { id: "japanese", name: "Japanese", icon: "あ", description: "Aprender, ler e explorar o idioma.", color: "purple" },
  { id: "music", name: "Music", icon: "♫", description: "Ouvir melhor. Descobrir mais.", color: "green" },
  { id: "games", name: "Games", icon: "✛", description: "Jogar, organizar e revisitar.", color: "peach" },
];

// Os itens abaixo são EXEMPLOS, não uma lista dos seus programas reais.
// Para adicionar um recurso, copie um objeto e altere os campos.
// id: endereço único da resenha. markdown: caminhos relativos para arquivos .md.
// Você também pode usar markdown: "content/arquivo/arquivo.md" para um texto único.
const resources = [
  { id: "anki", markdown: { en: "content/anki/anki.en.md", pt: "content/anki/anki.pt.md" }, name: "Anki", category: "japanese", type: "Programa", description: "Flashcards com repetição espaçada para manter o vocabulário em dia.", url: "https://apps.ankiweb.net/", icon: "A" },
  { id: "yomitan", markdown: { en: "content/yomitan/yomitan.en.md", pt: "content/yomitan/yomitan.pt.md" }, name: "Yomitan", category: "japanese", type: "Addon", description: "Dicionário de japonês para consultar palavras durante a leitura no navegador.", url: "https://yomitan.wiki/", icon: "よ" },
  { id: "jisho", markdown: { en: "content/jisho/jisho.en.md", pt: "content/jisho/jisho.pt.md" }, name: "Jisho", category: "japanese", type: "Site", description: "Uma referência rápida para palavras, kanji e exemplos de uso.", url: "https://jisho.org/", icon: "辞" },
  { id: "foobar2000", markdown: { en: "content/foobar2000/foobar2000.en.md", pt: "content/foobar2000/foobar2000.pt.md" }, name: "foobar2000", category: "music", type: "Programa", description: "Player de áudio para organizar e ouvir sua biblioteca local.", url: "https://www.foobar2000.org/", icon: "f" },
  { id: "limusic", markdown: { en: "content/limusic/limusic.en.md", pt: "content/limusic/limusic.pt.md" }, name: "Limusic", category: "music", type: "Programa", description: "Organize os metadados e as tags dos seus álbuns.", url: "https://simohypers.github.io/limusic/", icon: "P" },
  { id: "musicbee", markdown: { en: "content/musicbee/musicbee.en.md", pt: "content/musicbee/musicbee.pt.md" }, name: "MusicBee", category: "music", type: "Programa", description: "Biblioteca, playlists e reprodução de música em um só lugar.", url: "https://getmusicbee.com/", icon: "♫" },
  { id: "playnite", markdown: { en: "content/playnite/playnite.en.md", pt: "content/playnite/playnite.pt.md" }, name: "Playnite", category: "games", type: "Programa", description: "Reúna os jogos das suas diferentes bibliotecas em uma única interface.", url: "https://playnite.link/", icon: "P" },
  { id: "retroarch", markdown: { en: "content/retroarch/retroarch.en.md", pt: "content/retroarch/retroarch.pt.md" }, name: "RetroArch", category: "games", type: "Programa", description: "Uma interface para emuladores e seus jogos clássicos favoritos.", url: "https://www.retroarch.com/", icon: "R" },
  { id: "pcgamingwiki", markdown: { en: "content/pcgamingwiki/pcgamingwiki.en.md", pt: "content/pcgamingwiki/pcgamingwiki.pt.md" }, name: "PCGamingWiki", category: "games", type: "Site", description: "Correções e ajustes para aproveitar melhor seus jogos de PC.", url: "https://www.pcgamingwiki.com/", icon: "PC" },
];

// Troque as URLs iniciais pelas URLs dos seus perfis pessoais.
const headerLinks = [
  { name: "YouTube", url: "https://www.youtube.com/@V2power%E3%83%84", icon: "assets/icons/brands/youtube.svg" },
  { name: "Instagram", url: "https://www.instagram.com/", icon: "assets/icons/brands/instagram.svg" },
  { name: "GitHub", url: "https://github.com/V2power", icon: "assets/icons/brands/github.svg" },
];

const socialLinks = [
  { name: "Letterboxd", url: "https://letterboxd.com/V2power/", icon: "assets/icons/letterboxd.ico" },
  { name: "Backloggd", url: "https://backloggd.com/u/V2power/", icon: "assets/icons/backloggd.ico" },
  { name: "RetroAchievements", url: "https://retroachievements.org/user/V2power", icon: "assets/icons/retroachievements.png" },
  { name: "Exophase", url: "https://www.exophase.com/user/V2power/", icon: "assets/icons/exophase.ico" },
  { name: "AniList", url: "https://anilist.co/user/V2power/", icon: "assets/icons/anilist.png" },
  { name: "Last.fm", url: "https://www.last.fm/user/Victivus", icon: "assets/icons/lastfm.ico" },
  { name: "VNDB", url: "https://vndb.org/u300042", icon: "assets/icons/vndb.ico" },
];
