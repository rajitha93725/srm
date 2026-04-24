const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR   = path.join(__dirname, 'data');
const PRICING_FILE  = path.join(DATA_DIR, 'pricing.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

const DEFAULT_PRICING = {
  base: 15000, perPage: 5000, smCreation: 10000,
  package1: 5000, package2: 10000, package3: 15000,
  package4: 20000, package5: 25000
};

// Ensure data directory and seed files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PRICING_FILE))  fs.writeFileSync(PRICING_FILE,  JSON.stringify(DEFAULT_PRICING, null, 2));
if (!fs.existsSync(REQUESTS_FILE)) fs.writeFileSync(REQUESTS_FILE, '[]');

// ----------------------------------------------------------------
// Middleware
// ----------------------------------------------------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ----------------------------------------------------------------
// API — Pricing
// ----------------------------------------------------------------
app.get('/api/pricing', (req, res) => {
  try {
    res.json(readJSON(PRICING_FILE));
  } catch {
    res.json(DEFAULT_PRICING);
  }
});

app.post('/api/pricing', (req, res) => {
  try {
    const pricing = { ...DEFAULT_PRICING, ...req.body };
    writeJSON(PRICING_FILE, pricing);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------
// API — Requests
// ----------------------------------------------------------------
app.get('/api/requests', (req, res) => {
  try {
    res.json(readJSON(REQUESTS_FILE));
  } catch {
    res.json([]);
  }
});

app.post('/api/requests', (req, res) => {
  try {
    const requests = readJSON(REQUESTS_FILE);
    const entry = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
    requests.push(entry);
    writeJSON(REQUESTS_FILE, requests);
    res.json({ success: true, id: entry.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/requests', (req, res) => {
  try {
    writeJSON(REQUESTS_FILE, []);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------
// Catch-all — serve index.html for any unmatched route
// ----------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------------------------------------------------------
// Start
// ----------------------------------------------------------------
app.listen(PORT, () => {
  console.log('');
  console.log('  VisitSL — DigiSolutions');
  console.log(`  Customer : http://localhost:${PORT}/`);
  console.log(`  Admin    : http://localhost:${PORT}/admin.html`);
  console.log(`  API      : http://localhost:${PORT}/api/requests`);
  console.log('');
});
