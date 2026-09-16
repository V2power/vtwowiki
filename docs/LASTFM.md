# Last.fm no GitHub Pages

A wiki consulta um Cloudflare Worker. Somente ele recebe a API key; o navegador recebe música, artista, capa, horário e status. Nenhuma dependência ou build é necessário na wiki.

## Publicar pelo painel

1. Abra **Workers & Pages → Create application** no Cloudflare e crie um Worker simples (Hello World, se disponível), com nome `vtwo-lastfm`.
2. No editor de código do Worker, substitua o código inicial pelo conteúdo de `workers/lastfm/worker.mjs` e publique em **Deploy**.
3. Em **Settings → Variables and Secrets**, adicione:

   | Tipo | Nome | Valor |
   | --- | --- | --- |
   | Secret | `LASTFM_API_KEY` | Sua API key do Last.fm |
   | Text | `LASTFM_USERNAME` | `Victivus` |
   | Text | `ALLOWED_ORIGIN` | `https://v2power.github.io` |

4. Clique em **Deploy** para aplicar as variáveis. A origem acima foi inferida do repositório; se você usa domínio próprio, coloque a origem real, sem caminho nem barra final.
5. Abra `https://vtwo-lastfm.SEU-SUBDOMINIO.workers.dev/now-playing`. Deve aparecer um JSON com `track` e `profile`. `track: null` significa que não há músicas recentes. `Not configured` indica variável ausente; `Last.fm unavailable` indica falha na consulta (por exemplo, chave inválida ou perfil privado).
6. Em `data/lastfm.js`, coloque essa URL completa entre as aspas de `window.lastfmEndpoint` e publique a wiki no GitHub Pages normalmente.

Não coloque a API key no GitHub, no JavaScript da wiki ou em `wrangler.jsonc`. O campo Secret deve receber a **API key**, não o shared secret. O método usado não exige login na conta Last.fm.

## Alternativa pelo terminal

Na pasta `workers/lastfm`, com Node.js instalado:

```sh
npx wrangler login
npx wrangler deploy
npx wrangler secret put LASTFM_API_KEY
```

O último comando pede a chave interativamente. O arquivo `wrangler.jsonc` já define o usuário Victivus e a origem do GitHub Pages. Depois, faça os passos 5 e 6 acima. Não é necessário contratar o plano pago.

## Comportamento

- O cartão fica abaixo da introdução. Enquanto a URL estiver vazia, permanece oculto.
- Consulta a cada 60 segundos somente com a aba visível; ao voltar, consulta se a última tentativa tiver mais de um minuto.
- O Worker guarda resultados por 30 segundos no cache de cada data center. Isso reduz consultas ao Last.fm, mas não elimina as requisições contabilizadas pelo Worker.
- Falhas não mantêm um status antigo de “ouvindo agora”. O cartão mostra indisponibilidade e tenta novamente no próximo intervalo.
- O endpoint aceita apenas GET e consulta apenas o usuário configurado. CORS limita a leitura por outros sites no navegador, mas não autentica visitantes nem impede chamadas por ferramentas externas.
- Não há banco de dados, KV ou agendamento. O status depende de seu player enviar “now playing” ao Last.fm.

## Verificações locais

```sh
node --test tests/lastfm.mjs
node --check assets/js/lastfm.js
```

Referências: [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Cache](https://developers.cloudflare.com/workers/runtime-apis/cache/), [user.getRecentTracks](https://www.last.fm/api/show/user.getRecentTracks).
