// Teste de integração sem navegador. Requer jsdom apenas no ambiente de testes.
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const base = 'https://example.com/vtwowiki/';
const scripts = ['assets/js/preferences.js', 'data/translations.js', 'data/data.js', 'assets/js/ui.js', 'assets/vendor/marked.js', 'assets/vendor/purify.min.js', 'assets/js/markdown.js'];
const instances = [];
const tick = () => new Promise(resolve => setImmediate(resolve));

function setup(page, id = 'anki', lang = 'en') {
  const dom = new JSDOM(fs.readFileSync(page, 'utf8'), { url: base + page + '?id=' + id, runScripts: 'outside-only' });
  instances.push(dom);
  const w = dom.window;
  const run = code => vm.runInContext(code, dom.getInternalVMContext());
  w.localStorage.setItem('wiki-language', lang);
  w.fetch = async url => {
    const path = new URL(url).pathname.replace('/vtwowiki/', '');
    return { ok: fs.existsSync(path), status: fs.existsSync(path) ? 200 : 404, text: async () => fs.readFileSync(path, 'utf8') };
  };
  for (const file of scripts) run(fs.readFileSync(file, 'utf8'));
  return { w, d: w.document, run, start: () => run(fs.readFileSync(page === 'index.html' ? 'assets/js/app.js' : 'assets/js/article.js', 'utf8')) };
}

async function test() {
  const page = setup('pages/article.html');
  const { d, run } = page;
  page.start(); await tick();
  assert.equal(d.querySelector('#article-content').hidden, false, d.querySelector('#article-status').textContent);
  assert.equal(d.querySelectorAll('.markdown-table table').length, 1);
  assert.equal(d.querySelectorAll('.callout').length, 2);
  assert.equal(d.querySelectorAll('details').length, 1);
  assert.ok(d.querySelectorAll('#toc a').length >= 5);
  assert.ok(d.querySelector('.markdown-body a[href="https://example.com/vtwowiki/pages/article.html?id=yomitan"]'));
  assert.ok(d.querySelector('.markdown-body a[href="#section-my-card-template"]'));
  assert.equal(d.querySelector('.markdown-body input').disabled, true);
  d.querySelector('#language-toggle').click(); await tick();
  assert.equal(d.documentElement.lang, 'pt-BR');
  assert.ok(d.getElementById('section-meu-modelo-de-cartao'));
  d.querySelector('#theme-toggle').click();
  assert.equal(d.documentElement.dataset.theme, 'light');

  run(`renderMarkdown('## Repetido\\n\\n## Repetido\\n\\n![test](images/test.png)\\n\\n<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">bad</a><iframe src="x"></iframe>', new URL('content/anki.pt.md', siteRoot), document.querySelector('#article-content'))`);
  assert.ok(d.getElementById('section-repetido-2'));
  assert.equal(d.querySelector('.markdown-body img').src, base + 'content/images/test.png');
  assert.equal(d.querySelectorAll('.markdown-body script,.markdown-body iframe,.markdown-body [onerror],.markdown-body a[href^="javascript:"]').length, 0);

  const home = setup('index.html'); home.start();
  assert.equal(home.d.querySelectorAll('.resource').length, 9);
  assert.equal(home.d.querySelector('.resource').getAttribute('href'), base + 'pages/article.html?id=anki');
  assert.equal(home.d.querySelector('.resource').target, '');
  assert.match(home.d.querySelector('.resource p').textContent, /Spaced repetition/);
  for (const lang of ['en', 'pt']) {
    for (const id of home.run('resources.map(item => item.id)')) {
      const review = setup('pages/article.html', id, lang); review.start(); await tick();
      assert.equal(review.d.querySelector('#article-content').hidden, false, id + ' ' + lang);
    }
  }
  const missing = setup('pages/article.html', 'not-real'); missing.start();
  assert.match(missing.d.querySelector('#article-status').textContent, /not found/);
  const broken = setup('pages/article.html');
  broken.w.fetch = async () => ({ ok: false, status: 404 });
  broken.w.console.error = () => {};
  broken.start(); await tick();
  assert.equal(broken.d.querySelector('#retry').hidden, false);
  const fallback = setup('pages/article.html');
  fallback.run('resources[0].markdown = {pt: "content/anki.pt.md"}');
  fallback.start(); await tick();
  assert.equal(fallback.d.querySelector('#article-content').lang, 'pt-BR');
  assert.match(fallback.d.querySelector('#article-status').textContent, /Portuguese only/);
  console.log('PASS: 18 reviews, preferences, collection links, GFM, callouts, TOC, relative URLs, sanitization, errors and language fallback.');
}

test().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  for (const dom of instances) dom.window.close();
});
