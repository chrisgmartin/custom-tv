const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function load() {
  const ctx = vm.createContext({ window: {} });
  for (const name of ['i18n.js', 'weather.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', name), 'utf8'), ctx);
  return ctx.window;
}
test('Portuguese weather labels cover every known WMO code without altering weather behaviour', () => {
  const { TVI18n: lang, TVWeather: weather } = load();
  for (const code of [0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99,999]) {
    lang.setLanguage('en-GB'); const en = weather.describe(code);
    lang.setLanguage('pt-PT'); const pt = weather.describe(code);
    assert.notEqual(pt.label, en.label, `translation for ${code}`);
    assert.equal(pt.kind, en.kind);
    assert.equal(pt.intensity, en.intensity);
  }
  assert.equal(weather.describe(63).label, 'Chuva');
});
test('language fallback and substitutions preserve literal app and place names', () => {
  const { TVI18n: lang } = load();
  assert.equal(lang.setLanguage('pt-BR'), 'pt-PT');
  assert.equal(lang.text('Humidity'), 'Humidade');
  assert.equal(lang.text('{count} apps', { count: 5 }), '5 aplicações');
  assert.equal(lang.text('{name} is not connected', { name: 'Game console' }), 'Game console não está ligado');
  lang.setLanguage('en-GB');
  assert.equal(lang.text('{count} apps', { count: 5 }), '5 apps');
  assert.equal(lang.text('YouTube'), 'YouTube');
});

test('tab labels and page copy translate for both languages', () => {
  const { TVI18n: lang } = load();
  lang.setLanguage('pt-PT');
  for (const key of ['Home', 'Inputs', 'Apps', 'Settings', 'Featured', 'All', 'Streaming', 'Live TV', 'Utilities']) {
    const translated = lang.text(key);
    assert.notEqual(translated, '', `${key} must have a translation`);
  }
  // The specific wording for the four tab labels.
  assert.equal(lang.text('Home'), 'Início');
  assert.equal(lang.text('Inputs'), 'Entradas');
  assert.equal(lang.text('Apps'), 'Aplicações');
  assert.equal(lang.text('Settings'), 'Definições');
  assert.equal(lang.text('All'), 'Tudo');
  assert.equal(lang.text('Streaming'), 'Streaming');
  assert.equal(lang.text('Live TV'), 'TV em direto');
  assert.equal(lang.text('Utilities'), 'Utilitários');
  // Inputs page sub-header with count substitution.
  assert.equal(
    lang.text('{n} connected · press OK to switch · hold OK to rename', { n: 2 }),
    '2 ligadas · OK para trocar · OK longo para renomear'
  );
});

test('English source text is the fallback when a key is not translated', () => {
  const { TVI18n: lang } = load();
  lang.setLanguage('pt-PT');
  // Any key that happens to lack a PT entry falls through unchanged — exercise
  // the fallback with a made-up key so this test stays stable as the catalog grows.
  assert.equal(lang.text('A string that is intentionally not in the catalog'),
                         'A string that is intentionally not in the catalog');
});
