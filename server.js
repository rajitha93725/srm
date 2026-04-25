const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR      = path.join(__dirname, 'data');
const PRICING_FILE  = path.join(DATA_DIR, 'pricing.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const USERS_FILE    = path.join(DATA_DIR, 'users.json');

const ADMIN_CREDS = { username: 'raji', password: 'Rajitha.123' };

const DEFAULT_PRICING = {
  base: 15000, perPage: 5000,
  domainCom: 3000, domainLk: 6000, domainNet: 4000, domainOrg: 4000, domainPremium: 10000,
  hosting: 12000,
  linkedinIntegration: 2500, youtubeIntegration: 2500,
  smCreateStandard: 2000, smCreatePremium: 2500,
  maintainStandard: 2000, maintainPremium: 2500,
  package1: 3500, package2: 5000, package3: 10000, package4: 20000, package5: 50000,
  designCustom1: 10000, designCustom2: 12000,
  designPremium1: 17500, designPremium2: 25000
};

if (!fs.existsSync(DATA_DIR))      fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PRICING_FILE))  fs.writeFileSync(PRICING_FILE,  JSON.stringify(DEFAULT_PRICING, null, 2));
if (!fs.existsSync(REQUESTS_FILE)) fs.writeFileSync(REQUESTS_FILE, '[]');
if (!fs.existsSync(USERS_FILE))    fs.writeFileSync(USERS_FILE,    '[]');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readJSON(file)       { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJSON(file, data){ fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

// ----------------------------------------------------------------
// Auth
// ----------------------------------------------------------------
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// ----------------------------------------------------------------
// Pricing
// ----------------------------------------------------------------
app.get('/api/pricing', (req, res) => {
  try { res.json(readJSON(PRICING_FILE)); }
  catch { res.json(DEFAULT_PRICING); }
});

app.post('/api/pricing', (req, res) => {
  try {
    writeJSON(PRICING_FILE, { ...DEFAULT_PRICING, ...req.body });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------
// Requests
// ----------------------------------------------------------------
app.get('/api/requests', (req, res) => {
  try { res.json(readJSON(REQUESTS_FILE)); }
  catch { res.json([]); }
});

app.post('/api/requests', (req, res) => {
  try {
    const requests = readJSON(REQUESTS_FILE);
    const entry = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
    requests.push(entry);
    writeJSON(REQUESTS_FILE, requests);
    res.json({ success: true, id: entry.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/requests', (req, res) => {
  try { writeJSON(REQUESTS_FILE, []); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------
// Users
// ----------------------------------------------------------------
app.get('/api/users', (req, res) => {
  try {
    const users = readJSON(USERS_FILE).map(u => ({ ...u, password: undefined }));
    res.json(users);
  } catch { res.json([]); }
});

app.post('/api/users', (req, res) => {
  try {
    const users = readJSON(USERS_FILE);
    const { fullName, login, password } = req.body;
    if (users.find(u => u.login === login)) {
      return res.status(409).json({ error: 'Already registered' });
    }
    const user = { id: Date.now(), fullName, login, password, registeredAt: new Date().toISOString() };
    users.push(user);
    writeJSON(USERS_FILE, users);
    res.json({ success: true, id: user.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users', (req, res) => {
  try { writeJSON(USERS_FILE, []); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------------------------------------------------------
// Catch-all
// ----------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('  DigiSolutions');
  console.log(`  Customer : http://localhost:${PORT}/`);
  console.log(`  Admin    : http://localhost:${PORT}/admin.html`);
  console.log('');
});
