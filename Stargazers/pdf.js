// Renders the constitution as a designed HTML page and prints it to PDF with headless Chrome/Edge.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { execFileSync } = require('child_process');

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const HOUSES = { Orion: '#0066CC', Aquila: '#5F259F', Cygnus: '#862633', Draco: '#00843D' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const orTBD = (v) => (v && String(v).trim()) || 'TBD';

// "ARTICLE I: ENTITY, NAME & PURPOSE" -> { eyebrow: 'Article I', title: 'Entity, Name & Purpose' }
function splitTitle(t) {
  const m = /^((?:ARTICLE|ANNEX)\s+[IVXA-Z]+):\s*(.*)$/i.exec(t);
  if (!m) return { eyebrow: '', title: t };
  const titleCase = (s) => s.toLowerCase().replace(/\b([a-z])/g, (c) => c.toUpperCase()).replace(/\b(And|Of|The|For)\b/g, (w) => w.toLowerCase()).replace(/\b(Hr|Ceo)\b/g, (w) => w.toUpperCase());
  return { eyebrow: titleCase(m[1]).replace(/\b([ivx]+)\b/gi, (r) => r.toUpperCase()), title: titleCase(m[2]) };
}

// Deterministic star field for the cover
function starField(w, h, n) {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let out = '';
  for (let i = 0; i < n; i++) {
    const r = rnd() < 0.08 ? 1.6 : rnd() < 0.3 ? 1 : 0.6;
    out += `<circle cx="${(rnd() * w).toFixed(1)}" cy="${(rnd() * h).toFixed(1)}" r="${r}" fill="#fff" opacity="${(0.25 + rnd() * 0.6).toFixed(2)}"/>`;
  }
  return out;
}

function renderBlock(b) {
  if (typeof b === 'string') {
    if (b.includes('→')) {
      const steps = b.split('→').map((s) => `<span class="chip">${esc(s.trim())}</span>`);
      return `<div class="flow">${steps.join('<span class="arrow">→</span>')}</div>`;
    }
    if (/^Example:/i.test(b)) return `<div class="callout"><strong>Example</strong>${esc(b.replace(/^Example:\s*(.)/i, (m, c) => c.toUpperCase()))}</div>`;
    return `<p>${esc(b)}</p>`;
  }
  if (b.bullets) return `<ul>${b.bullets.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  if (b.numbered) return `<ol>${b.numbered.map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`;
  return '';
}

function buildHtml(content, baseDir) {
  const { meta, articles, annex, summary } = content;
  const header = `${meta.title} · ${meta.reference}`;

  const cover = `
  <section class="cover">
    <svg class="stars" viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
      ${starField(595, 842, 260)}
      <g stroke="#E3C46B" stroke-width="0.7" opacity="0.7" fill="none">
        <polyline points="390,140 430,175 470,160 500,205 545,215"/>
        <polyline points="430,175 445,230 500,205"/>
      </g>
      <g fill="#E3C46B">
        <circle cx="390" cy="140" r="2.4"/><circle cx="430" cy="175" r="2.8"/><circle cx="470" cy="160" r="2"/>
        <circle cx="500" cy="205" r="3"/><circle cx="545" cy="215" r="2.2"/><circle cx="445" cy="230" r="2.2"/>
      </g>
    </svg>
    <div class="cover-inner">
      <div class="cover-org">${esc(meta.organization)}</div>
      <h1 class="cover-title">Stargazers<br/><span>Constitution</span></h1>
      <div class="cover-rule"></div>
      <p class="cover-sub">The governing framework of the Stargazers Club, the official employee event organizing club, and the Four-House System.</p>
      <div class="cover-houses">
        ${Object.entries(HOUSES).map(([n, c]) => `<div class="house"><span style="background:${c}"></span>${n}</div>`).join('')}
      </div>
    </div>
    <div class="cover-foot">Document Reference: ${esc(meta.reference)}</div>
  </section>`;

  const tocEntries = [
    ...articles.map((a) => ({ ...splitTitle(a.title), sections: a.sections.map((s) => `${s.num} ${s.heading}`) })),
    { ...splitTitle(annex.title), sections: [annex.purpose.heading, annex.brandsHeading, annex.rules.heading].map((h) => h.replace(/^(A\.\d)\s+/, '$1 ').replace(/\b([A-Z])([A-Z&]+)\b/g, (w, a, b) => a + b.toLowerCase())) },
    ...(summary ? [{ eyebrow: 'Summary', title: summary.title, sections: [] }] : []),
  ];
  const toc = `
  <section class="toc">
    <div class="eyebrow">Contents</div>
    <h2 class="page-title">Table of Contents</h2>
    ${tocEntries.map((e) => `
      <div class="toc-entry">
        <div class="toc-head"><span class="toc-eyebrow">${esc(e.eyebrow)}</span><span class="toc-title">${esc(e.title)}</span></div>
        ${e.sections.length ? `<div class="toc-secs">${e.sections.map((s) => `<span>${esc(s)}</span>`).join('')}</div>` : ''}
      </div>`).join('')}
  </section>`;

  const articleHtml = articles.map((a) => {
    const t = splitTitle(a.title);
    return `
    <section class="article">
      <header class="article-head"><div class="eyebrow">${esc(t.eyebrow)}</div><h2>${esc(t.title)}</h2></header>
      ${a.sections.map((s, i) => `
        <div class="sec${i === 0 ? ' first' : ''}">
          <h3><span class="num">${esc(s.num)}</span>${esc(s.heading)}</h3>
          <div class="sec-body">${s.body.map(renderBlock).join('')}</div>
        </div>`).join('')}
    </section>`;
  }).join('');

  const annexT = splitTitle(annex.title);
  const brandCard = (b) => {
    let swatch;
    const logo = b.logo && path.resolve(baseDir, b.logo);
    if (logo && fs.existsSync(logo)) swatch = `<div class="swatch logo"><img src="${pathToFileURL(logo).href}"/></div>`;
    else if (b.hex) swatch = `<div class="swatch" style="background:${esc(b.hex)}"><span>${esc(b.hex.toUpperCase())}</span></div>`;
    else swatch = `<div class="swatch empty"><span>Logo &amp; colour TBD</span></div>`;
    const rows = [['Colour', b.colorName], ['HEX', b.hex], ['Pantone', b.pantone], ['CMYK', b.cmyk], ['Visual', b.visual]];
    return `<div class="brand">${swatch}<div class="brand-body"><h4>${esc(b.name)}</h4>
      <dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(orTBD(v))}</dd>`).join('')}</dl></div></div>`;
  };
  const annexHtml = `
  <section class="article annex">
    <header class="article-head"><div class="eyebrow">${esc(annexT.eyebrow)}</div><h2>${esc(annexT.title)}</h2></header>
    <div class="sec"><h3><span class="num">A.1</span>Purpose &amp; Scope</h3><div class="sec-body"><p>${esc(annex.purpose.text)}</p></div></div>
    <div class="sec"><h3><span class="num">A.2</span>Official House Logos &amp; Brand Specifications</h3>
      <div class="brands">${annex.brands.map(brandCard).join('')}</div></div>
    <div class="sec"><h3><span class="num">A.3</span>Brand Usage Rules &amp; Logo Amendment Procedure</h3>
      <div class="sec-body"><ol>${annex.rules.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ol></div></div>
  </section>`;

  const summaryHtml = !summary ? '' : `
  <section class="summary">
    <div class="sum-band">
      <div class="eyebrow light">Summary</div>
      <h2>${esc(summary.title)}</h2>
    </div>
    <div class="facts">${summary.facts.map((f) => `
      <div class="fact"><div class="fact-label">${esc(f.label)}</div><div class="fact-value">${esc(f.value)}</div><div class="fact-note">${esc(f.note)}</div></div>`).join('')}
    </div>
    <h3 class="sum-h">${esc(summary.decisions.heading)}</h3>
    <table class="decisions">
      <thead><tr>${summary.decisions.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${summary.decisions.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    <div class="groups">${summary.groups.map((g, i) => `
      <div class="group" style="--accent:${Object.values(HOUSES)[i % 4]}"><h4>${esc(g.heading)}</h4>
        <ul>${g.items.map((it) => `<li>${esc(it)}</li>`).join('')}</ul></div>`).join('')}
    </div>
  </section>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(meta.title)}</title>
<style>
  :root {
    --navy: #141B34; --navy-2: #22305A; --gold: #C9A227; --gold-soft: #E3C46B;
    --ink: #1E2230; --muted: #5E6578; --line: #DFE3EC; --tint: #F4F6FA;
  }
  @page {
    size: A4; margin: 20mm 18mm 18mm 18mm;
    @top-right { content: "${esc(header)}"; font: 7.5pt "Segoe UI", sans-serif; color: #8A90A2; letter-spacing: .04em; }
    @bottom-center { content: counter(page) " / " counter(pages); font: 8pt "Segoe UI", sans-serif; color: #8A90A2; }
  }
  @page cover { margin: 0; @top-right { content: none; } @bottom-center { content: none; } }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font: 10.2pt/1.55 "Segoe UI", Calibri, sans-serif; color: var(--ink); background: #fff; }
  h1, h2, h3, h4 { margin: 0; }
  .eyebrow { font-size: 8pt; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); }
  .eyebrow.light { color: var(--gold-soft); }

  /* Cover */
  .cover { page: cover; position: relative; width: 210mm; height: 297mm; overflow: hidden;
    background: radial-gradient(120% 80% at 80% 10%, #2B3A6B 0%, var(--navy) 55%, #0B1022 100%); color: #fff; break-after: page; }
  .stars { position: absolute; inset: 0; width: 100%; height: 100%; }
  .cover-inner { position: absolute; left: 22mm; right: 22mm; top: 92mm; }
  .cover-org { font-size: 10pt; letter-spacing: .3em; color: var(--gold-soft); font-weight: 600; }
  .cover-title { font: 600 46pt/1.02 Cambria, Georgia, serif; margin-top: 6mm; letter-spacing: -.01em; }
  .cover-title span { color: var(--gold-soft); font-style: italic; font-weight: 400; }
  .cover-rule { width: 28mm; height: 1.4mm; background: var(--gold); margin: 9mm 0 7mm; border-radius: 1mm; }
  .cover-sub { font-size: 11.5pt; line-height: 1.6; color: #C9D0E4; max-width: 125mm; margin: 0; }
  .cover-houses { display: flex; gap: 6mm; margin-top: 16mm; }
  .house { display: flex; align-items: center; gap: 2.5mm; font-size: 10pt; letter-spacing: .08em; color: #E6E9F2; }
  .house span { width: 4.5mm; height: 4.5mm; border-radius: 50%; box-shadow: 0 0 0 1.2px rgba(255,255,255,.55); }
  .cover-foot { position: absolute; left: 22mm; bottom: 18mm; font-size: 8.5pt; letter-spacing: .12em; color: #8E98B8; }

  /* Contents */
  .toc { break-after: page; }
  .page-title { font: 600 24pt/1.2 Cambria, Georgia, serif; color: var(--navy); margin: 2mm 0 8mm; }
  .toc-entry { padding: 3.2mm 0; border-bottom: 1px solid var(--line); }
  .toc-head { display: flex; align-items: baseline; gap: 4mm; }
  .toc-eyebrow { width: 24mm; flex: none; font-size: 8pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); }
  .toc-title { font: 600 12.5pt Cambria, Georgia, serif; color: var(--navy); }
  .toc-secs { margin: 1.4mm 0 0 28mm; display: flex; flex-wrap: wrap; gap: 0 5mm; font-size: 8.4pt; color: var(--muted); }

  /* Articles */
  .article { margin-bottom: 4mm; }
  .article-head { padding: 0 0 3mm; margin: 4mm 0 5mm; border-bottom: 2px solid var(--navy); break-inside: avoid; break-after: avoid; }
  .article-head + .sec.first { break-before: avoid; }
  .article-head h2 { font: 600 18pt/1.25 Cambria, Georgia, serif; color: var(--navy); margin-top: 1mm; }
  .sec { margin: 0 0 4.5mm; break-inside: avoid; }
  .sec h3 { display: flex; align-items: center; gap: 3mm; font-size: 11pt; font-weight: 700; color: var(--navy); margin-bottom: 1.6mm; break-after: avoid; }
  .num { display: inline-block; min-width: 10mm; padding: .5mm 1.8mm; border-radius: 1.2mm; background: var(--navy); color: #fff; font-size: 8.5pt; text-align: center; letter-spacing: .03em; }
  .sec-body { padding-left: 13mm; }
  .sec-body p { margin: 0 0 2mm; text-align: justify; }
  .sec-body ul, .sec-body ol { margin: 0 0 2mm; padding-left: 5mm; }
  .sec-body li { margin: 0 0 1.2mm; padding-left: 1mm; }
  .sec-body ul li::marker { color: var(--gold); }
  .sec-body ol li::marker { color: var(--navy); font-weight: 700; }
  .callout { margin: 2mm 0; padding: 2.6mm 3.5mm; background: var(--tint); border-left: 3px solid var(--gold); border-radius: 0 1.5mm 1.5mm 0; font-size: 9.6pt; }
  .callout strong { display: block; font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); margin-bottom: .6mm; }
  .flow { display: flex; flex-wrap: wrap; align-items: center; gap: 2mm; margin: 1mm 0 2mm; }
  .chip { padding: 1.2mm 3mm; border-radius: 10mm; background: var(--tint); border: 1px solid var(--line); font-weight: 600; font-size: 9.4pt; color: var(--navy); }
  .arrow { color: var(--gold); font-weight: 700; }

  /* Annex */
  .annex { break-before: page; }
  .brands { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; padding-left: 13mm; margin-top: 1mm; }
  .brand { border: 1px solid var(--line); border-radius: 2.5mm; overflow: hidden; break-inside: avoid; }
  .swatch { height: 10mm; display: flex; align-items: flex-end; justify-content: flex-end; padding: 1.6mm 2.4mm; }
  .swatch span { font-size: 7.5pt; font-weight: 700; letter-spacing: .1em; color: rgba(255,255,255,.9); }
  .swatch.empty { background: repeating-linear-gradient(45deg, #F1F3F8 0 3mm, #E7EAF1 3mm 6mm); }
  .swatch.empty span { color: var(--muted); }
  .swatch.logo { height: 24mm; justify-content: center; align-items: center; background: var(--tint); }
  .swatch.logo img { max-height: 20mm; max-width: 80%; }
  .brand-body { padding: 2.4mm 3mm 2.6mm; }
  .brand h4 { font-size: 9.4pt; color: var(--navy); margin-bottom: 1.2mm; }
  .brand dl { display: grid; grid-template-columns: 17mm 1fr; gap: .3mm 1.5mm; margin: 0; font-size: 7.8pt; line-height: 1.4; }
  .brand dt { color: var(--muted); }
  .brand dd { margin: 0; font-weight: 600; }

  /* Summary */
  .summary { break-before: page; }
  .sum-band { background: linear-gradient(120deg, var(--navy) 0%, var(--navy-2) 100%); color: #fff; border-radius: 3mm; padding: 5mm 6mm; position: relative; overflow: hidden; }
  .sum-band h2 { font: 600 19pt/1.2 Cambria, Georgia, serif; margin-top: 1mm; }
  .facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 4mm 0 5mm; }
  .fact { border: 1px solid var(--line); border-top: 3px solid var(--gold); border-radius: 2mm; padding: 2.5mm 3mm; }
  .fact-label { font-size: 7.4pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .fact-value { font: 600 12pt/1.25 Cambria, Georgia, serif; color: var(--navy); margin: 1mm 0 .6mm; }
  .fact-note { font-size: 8pt; line-height: 1.35; color: var(--muted); }
  .sum-h { font-size: 10.5pt; color: var(--navy); margin: 0 0 2mm; }
  .decisions { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 8.8pt; border: 1px solid var(--line); border-radius: 2mm; overflow: hidden; }
  .decisions th { background: var(--navy); color: #fff; text-align: left; font-weight: 600; padding: 2mm 3mm; }
  .decisions td { padding: 1.9mm 3mm; border-top: 1px solid var(--line); vertical-align: top; }
  .decisions tr:nth-child(even) td { background: var(--tint); }
  .decisions td:first-child { font-weight: 600; color: var(--navy); width: 42%; }
  .groups { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5mm; margin-top: 5mm; }
  .group { border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: 0 2mm 2mm 0; padding: 2.6mm 3.5mm; break-inside: avoid; }
  .group h4 { font-size: 9.8pt; color: var(--navy); margin-bottom: 1.2mm; }
  .group ul { margin: 0; padding-left: 4mm; font-size: 8.6pt; line-height: 1.45; }
  .group li { margin-bottom: .6mm; }
  .group li::marker { color: var(--accent); }
</style></head>
<body>
${cover}
${toc}
${articleHtml}
${annexHtml}
${summaryHtml}
</body></html>`;
}

function findBrowser() {
  const found = BROWSERS.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome or Edge not found. Set CHROME_PATH to a Chromium-based browser executable.');
  return found;
}

function buildPdf(content, filePath, baseDir) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stargazers-'));
  const htmlPath = path.join(tmp, 'constitution.html');
  fs.writeFileSync(htmlPath, buildHtml(content, baseDir));
  try {
    execFileSync(findBrowser(), [
      '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--no-first-run',
      `--user-data-dir=${path.join(tmp, 'profile')}`,
      `--print-to-pdf=${path.resolve(filePath)}`,
      pathToFileURL(htmlPath).href,
    ], { stdio: 'pipe' });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

module.exports = { buildPdf, buildHtml };
