// Generates PDF and DOCX versions of the Stargazers Constitution from constitution.js.
// Usage: node generate.js [pdf|docx]   (no argument = both)

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, Header,
  PageNumber, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  ImageRun, LevelFormat, TableBorders,
} = require('docx');

const content = require('./constitution');
const { buildPdf } = require('./pdf');

const OUT_DIR = path.join(__dirname, 'output');
const ACCENT = '#1F2A44';
const MUTED = '#555555';

const orTBD = (v) => (v && String(v).trim()) || 'TBD';
const resolveLogo = (p) => {
  if (!p) return null;
  const full = path.resolve(__dirname, p);
  if (!fs.existsSync(full)) {
    console.warn(`  ! logo not found, using swatch: ${p}`);
    return null;
  }
  return full;
};
const brandRows = (b) => [
  ['Primary Color', orTBD(b.colorName)],
  ['HEX Code', orTBD(b.hex)],
  ['Pantone Standard', orTBD(b.pantone)],
  ['CMYK Equivalent', orTBD(b.cmyk)],
  ['Visual Elements', orTBD(b.visual)],
];

// ---------------------------------------------------------------------------
// DOCX
// ---------------------------------------------------------------------------
async function buildDocx(filePath) {
  const { meta, articles, annex, summary } = content;
  const children = [];
  const hex = (c) => c.replace('#', '');

  const para = (text) => new Paragraph({ children: [new TextRun(text)], alignment: AlignmentType.JUSTIFIED, spacing: { after: 120 } });
  const list = (items, ref) => items.map((t) => new Paragraph({
    children: [new TextRun(t)], numbering: { reference: ref, level: 0 }, alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
  }));
  let numberedListCount = 0;
  const numberingConfigs = [{
    reference: 'bullets',
    levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
  }];
  // Each numbered list needs its own reference so numbering restarts at 1.
  const newNumbered = () => {
    const ref = `numbered-${++numberedListCount}`;
    numberingConfigs.push({
      reference: ref,
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    });
    return ref;
  };
  const renderBody = (body) => body.forEach((b) => {
    if (typeof b === 'string') children.push(para(b));
    else if (b.bullets) children.push(...list(b.bullets, 'bullets'));
    else if (b.numbered) children.push(...list(b.numbered, newNumbered()));
  });
  const articleHeading = (text) => children.push(new Paragraph({
    text, heading: HeadingLevel.HEADING_1,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: hex(ACCENT), space: 2 } },
  }));
  const sectionHeading = (text) => children.push(new Paragraph({ text, heading: HeadingLevel.HEADING_2 }));

  // Title block
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 80 }, children: [new TextRun({ text: meta.title, bold: true, size: 44, color: hex(ACCENT) })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: meta.organization, bold: true, size: 28 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: `Document Reference: ${meta.reference}`, size: 20, color: hex(MUTED) })] }),
  );

  articles.forEach((a) => {
    articleHeading(a.title);
    a.sections.forEach((s) => {
      sectionHeading(`${s.num} ${s.heading}`);
      renderBody(s.body);
    });
  });

  // Annex
  children.push(new Paragraph({ children: [new PageBreak()] }));
  articleHeading(annex.title);
  sectionHeading(annex.purpose.heading);
  children.push(para(annex.purpose.text));
  sectionHeading(annex.brandsHeading);

  const noBorders = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
  annex.brands.forEach((b, i) => {
    children.push(new Paragraph({ spacing: { before: 200, after: 80 }, children: [new TextRun({ text: `${i + 1}. ${b.name}`, bold: true })] }));

    const logo = resolveLogo(b.logo);
    let logoCell;
    if (logo) {
      const ext = path.extname(logo).slice(1).toLowerCase();
      logoCell = new TableCell({
        rowSpan: 5, width: { size: 1800, type: WidthType.DXA }, borders: noBorders,
        children: [new Paragraph({ children: [new ImageRun({ type: ext === 'jpeg' ? 'jpg' : ext, data: fs.readFileSync(logo), transformation: { width: 90, height: 90 } })] })],
      });
    } else {
      logoCell = new TableCell({
        rowSpan: 5, width: { size: 1800, type: WidthType.DXA },
        shading: b.hex ? { type: ShadingType.CLEAR, fill: hex(b.hex), color: 'auto' } : undefined,
        borders: b.hex ? noBorders : undefined,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: b.hex ? '' : 'LOGO', color: '999999', size: 16 })] })],
      });
    }

    const rows = brandRows(b).map(([k, v], idx) => new TableRow({
      height: { value: 360, rule: 'atLeast' },
      children: [
        ...(idx === 0 ? [logoCell] : []),
        new TableCell({ width: { size: 2200, type: WidthType.DXA }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: `${k}:`, bold: true })] })] }),
        new TableCell({ width: { size: 5000, type: WidthType.DXA }, borders: noBorders, children: [new Paragraph(v)] }),
      ],
    }));
    children.push(new Table({ borders: TableBorders.NONE, width: { size: 9000, type: WidthType.DXA }, columnWidths: [1800, 2200, 5000], rows }));
  });

  sectionHeading(annex.rules.heading);
  children.push(...list(annex.rules.items, newNumbered()));

  // Summary (last page)
  if (summary) {
    const cell = (text, opts = {}) => new TableCell({
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: 'auto' } : undefined,
      children: [new Paragraph({ children: [new TextRun({ text, bold: opts.bold, color: opts.color, size: opts.size })] })],
    });
    const grid = (rows, widths) => new Table({ width: { size: 9600, type: WidthType.DXA }, columnWidths: widths, rows });

    children.push(new Paragraph({ children: [new PageBreak()] }));
    articleHeading(summary.title.toUpperCase());
    children.push(grid([
      new TableRow({ children: summary.facts.map((f) => cell(f.label.toUpperCase(), { bold: true, color: hex(MUTED), size: 16, fill: 'F4F6FA' })) }),
      new TableRow({ children: summary.facts.map((f) => cell(f.value, { bold: true, color: hex(ACCENT), size: 24 })) }),
      new TableRow({ children: summary.facts.map((f) => cell(f.note, { color: hex(MUTED), size: 17 })) }),
    ], [2400, 2400, 2400, 2400]));

    sectionHeading(summary.decisions.heading);
    children.push(grid([
      new TableRow({ tableHeader: true, children: summary.decisions.columns.map((c) => cell(c, { bold: true, color: 'FFFFFF', fill: hex(ACCENT) })) }),
      ...summary.decisions.rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, { bold: i === 0 })) })),
    ], [4000, 2800, 2800]));

    summary.groups.forEach((g) => {
      sectionHeading(g.heading);
      children.push(...list(g.items, 'bullets'));
    });
  }

  const doc = new Document({
    creator: meta.organization,
    title: meta.title,
    styles: {
      default: { document: { run: { font: 'Calibri', size: 21 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { bold: true, size: 26, color: hex(ACCENT) }, paragraph: { spacing: { before: 360, after: 160 }, keepNext: true } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { bold: true, size: 22 }, paragraph: { spacing: { before: 200, after: 80 }, keepNext: true } },
      ],
    },
    numbering: { config: numberingConfigs },
    sections: [{
      properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${meta.organization} — ${meta.reference}`, size: 16, color: hex(MUTED) })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 16, color: hex(MUTED) })] })] }) },
      children,
    }],
  });

  fs.writeFileSync(filePath, await Packer.toBuffer(doc));
}

// ---------------------------------------------------------------------------
(async () => {
  const which = (process.argv[2] || 'all').toLowerCase();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const base = path.join(OUT_DIR, content.meta.fileName);
  if (which === 'all' || which === 'pdf') {
    buildPdf(content, `${base}.pdf`, __dirname);
    console.log(`✔ ${base}.pdf`);
  }
  if (which === 'all' || which === 'docx') {
    await buildDocx(`${base}.docx`);
    console.log(`✔ ${base}.docx`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
