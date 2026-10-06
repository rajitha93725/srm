# Stargazers Constitution

Edit the text in `constitution.js`, then regenerate the PDF and Word files.

```
cd Stargazers
npm install        # first time only
npm run build      # both files
npm run build:pdf  # PDF only
npm run build:docx # Word only
```

Output goes to `output/Stargazers_Constitution.pdf` and `output/Stargazers_Constitution.docx`.

## Editing

- **Text:** every article, section, paragraph and list item is in `constitution.js`.
  - A plain string is a paragraph.
  - `{ bullets: [...] }` makes a bullet list.
  - `{ numbered: [...] }` makes a numbered list.
- **Document reference / title / output file name:** the `meta` block at the top.
- **Brand colours:** `annex.brands`. The `hex` value sets the colour swatch. Leave a field empty and it prints as `TBD`.
- **Logos:** put a PNG or JPG in `assets/` and set `logo: 'assets/orion.png'`. That replaces the colour swatch.
- **Summary page:** the `summary` block (key facts, the "who must agree" table and the four summary boxes) is the last page. Update it when you change the rules it summarises.

## How the PDF is made

`pdf.js` builds a styled HTML page and prints it to PDF with headless Chrome (or Edge). If neither is in its usual location, set `CHROME_PATH` to the browser executable.
