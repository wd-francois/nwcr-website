// Measures each capability-statement line in Chrome and stores a letter-spacing
// correction (em) in src/data/capability-statement.json so every line matches its
// width in the PDF. Run after generate.py, against `npm run preview`, then rebuild.
//
//   npm install --no-save puppeteer-core
//   node scripts/capability/calibrate.mjs [http://localhost:4321]
//
// Set CHROME_PATH if Chrome is not in the default Windows location.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const JSON_PATH = new URL('../../src/data/capability-statement.json', import.meta.url);
const BASE = process.argv[2] ?? 'http://localhost:4321';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const b = await puppeteer.launch({ executablePath: CHROME, headless: true });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 1000 });
await p.goto(`${BASE}/capability-statement/`, { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
const measured = await p.$$eval('.cs-frame', (frames) =>
  frames.map((f) => {
    const fw = f.getBoundingClientRect().width;
    return [...f.querySelectorAll('.cs-line')].map((l) => {
      l.style.setProperty('--ls', '0');
      return (l.getBoundingClientRect().width / fw) * 100;
    });
  }),
);
let n = 0,
  maxBefore = 0,
  changed = 0;
data.forEach((page, pi) => {
  const lines = [];
  for (const u of page.units) {
    if (u.tag === 'ul') for (const it of u.items) lines.push(...it);
    else if (u.lines) lines.push(...u.lines);
  }
  if (lines.length !== measured[pi].length)
    throw new Error(`page ${pi + 1}: ${lines.length} vs ${measured[pi].length}`);
  lines.forEach((ln, i) => {
    delete ln.ls;
    if (ln.token) return;
    const chars = [...ln.s.map((s) => s.t).join('')].length;
    const diff = ln.pw - measured[pi][i];
    maxBefore = Math.max(maxBefore, Math.abs(diff / ln.pw));
    const ls = diff / (ln.fs * chars);
    if (Math.abs(ls) >= 0.0005) {
      ln.ls = Math.round(ls * 10000) / 10000;
      changed++;
    }
    n++;
  });
});
fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 1));
console.log(
  `lines: ${n}, corrected: ${changed}, largest width difference before: ${(maxBefore * 100).toFixed(1)}%`,
);
await b.close();
