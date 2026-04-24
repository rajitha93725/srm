/* ================================================================
   VisitSL / DigiSolutions — script.js
   All data operations use the Express REST API (/api/*)
   Theme preference is kept in localStorage (client-only).
   ================================================================ */

// ----------------------------------------------------------------
// THEME
// ----------------------------------------------------------------
function initTheme() {
  const saved = localStorage.getItem('ds_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ds_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ----------------------------------------------------------------
// SECTION NAVIGATION
// ----------------------------------------------------------------
function showSection(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showComingSoon() {
  showToast('This service is coming soon! Stay tuned.', 'ℹ️');
}

// ----------------------------------------------------------------
// CONDITIONAL FIELD HELPERS
// ----------------------------------------------------------------
function toggle(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', !!show);
}

function handleBusinessType() {
  toggle('otherBusinessField', document.getElementById('businessType')?.value === 'Other');
}

function handleSocialIntegration() {
  const val = document.querySelector('input[name="socialIntegration"]:checked')?.value;
  toggle('socialPlatformsField', val === 'yes');
  updatePricing();
}

function handleExistingSocial() {
  const val = document.querySelector('input[name="hasExistingSocial"]:checked')?.value;
  toggle('existingSocialYes', val === 'yes');
  toggle('existingSocialNo',  val === 'no');

  if (val === 'yes') {
    document.querySelectorAll('input[name="createProfiles"], input[name="wantMaintenance"], input[name="createPlatform"]').forEach(r => r.checked = false);
    toggle('createPlatformsField', false);
    toggle('wantMaintenanceField', false);
  } else {
    document.querySelectorAll('input[name="maintainExisting"], input[name="maintainPlatform"]').forEach(r => r.checked = false);
    toggle('maintainPlatformsField', false);
  }
  updatePricing();
}

function handleMaintainExisting() {
  const val = document.querySelector('input[name="maintainExisting"]:checked')?.value;
  toggle('maintainPlatformsField', val === 'yes');
  updatePricing();
}

function handleCreateProfiles() {
  const val = document.querySelector('input[name="createProfiles"]:checked')?.value;
  toggle('createPlatformsField', val === 'yes');
  toggle('wantMaintenanceField', val === 'yes');
  if (val === 'no') {
    document.querySelectorAll('input[name="wantMaintenance"], input[name="createPlatform"]').forEach(r => r.checked = false);
  }
  updatePricing();
}

// ----------------------------------------------------------------
// API HELPERS
// ----------------------------------------------------------------
async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${url} → ${res.status}`);
  return res.json();
}

async function apiDelete(url) {
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${url} → ${res.status}`);
  return res.json();
}

// ----------------------------------------------------------------
// PRICING
// ----------------------------------------------------------------
const DEFAULT_PRICING = {
  base: 15000, perPage: 5000,
  domainCom: 3000, domainLk: 6000, domainNet: 4000, domainOrg: 4000, domainPremium: 10000,
  hosting: 12000,
  linkedinIntegration: 2500, youtubeIntegration: 2500,
  smCreateStandard: 2000, smCreatePremium: 2500,
  package1: 3500, package2: 5000, package3: 10000, package4: 20000, package5: 50000,
  designCustom1: 10000, designCustom2: 12000,
  designPremium1: 17500, designPremium2: 25000
};

async function fetchPricing() {
  try { return await apiGet('/api/pricing'); }
  catch { return { ...DEFAULT_PRICING }; }
}

function formatLKR(n) {
  return 'LKR ' + Number(n).toLocaleString('en-US');
}

async function updatePricing() {
  const pricing = await fetchPricing();
  const items = [];
  let total = 0;

  // Pages
  const pages = parseInt(document.getElementById('numPages')?.value) || 0;
  if (pages > 0) {
    items.push({ label: 'Base website (1 page)', amount: pricing.base });
    total += pricing.base;
    if (pages > 1) {
      const extra = pages - 1;
      const cost = extra * pricing.perPage;
      items.push({ label: `Additional ${extra} page(s) × ${formatLKR(pricing.perPage)}`, amount: cost });
      total += cost;
    }
  }

  // Domain
  const domainVal = document.querySelector('input[name="domainExt"]:checked')?.value || 'none';
  const domainPriceMap = { none: 0, com: pricing.domainCom, lk: pricing.domainLk, net: pricing.domainNet, org: pricing.domainOrg, premium: pricing.domainPremium };
  const domainLabelMap = { com: 'Domain (.com) – yearly', lk: 'Domain (.lk) – yearly', net: 'Domain (.net) – yearly', org: 'Domain (.org) – yearly', premium: 'Premium domain – yearly' };
  const domainCost = domainPriceMap[domainVal] || 0;
  if (domainCost > 0) { items.push({ label: domainLabelMap[domainVal], amount: domainCost }); total += domainCost; }

  // Hosting
  if (document.querySelector('input[name="includeHosting"]:checked')?.value === 'yes') {
    items.push({ label: 'Managed web hosting – yearly', amount: pricing.hosting });
    total += pricing.hosting;
  }

  // Social media integration (LinkedIn & YouTube charged)
  if (document.querySelector('input[name="socialIntegration"]:checked')?.value === 'yes') {
    if (document.querySelector('input[name="socialPlatform"][value="LinkedIn"]:checked')) {
      items.push({ label: 'LinkedIn integration', amount: pricing.linkedinIntegration });
      total += pricing.linkedinIntegration;
    }
    if (document.querySelector('input[name="socialPlatform"][value="YouTube"]:checked')) {
      items.push({ label: 'YouTube integration', amount: pricing.youtubeIntegration });
      total += pricing.youtubeIntegration;
    }
  }

  // Social media profile creation (per platform)
  if (document.querySelector('input[name="createProfiles"]:checked')?.value === 'yes') {
    const premiumPlatforms = ['LinkedIn', 'YouTube'];
    document.querySelectorAll('input[name="createPlatform"]:checked').forEach(cb => {
      const cost = premiumPlatforms.includes(cb.value) ? pricing.smCreatePremium : pricing.smCreateStandard;
      items.push({ label: `${cb.value} profile creation`, amount: cost });
      total += cost;
    });
  }

  // Social media package (maintenance)
  const maintainExisting = document.querySelector('input[name="maintainExisting"]:checked')?.value;
  const wantMaintenance  = document.querySelector('input[name="wantMaintenance"]:checked')?.value;
  const needsMaint = maintainExisting === 'yes' || wantMaintenance === 'yes';
  const pkgVal = document.getElementById('smPackage')?.value;
  if (pkgVal && needsMaint) {
    const pkgPrice = pricing[`package${pkgVal}`] || 0;
    const pkgLabels = { '1':'Starter','2':'Growth','3':'Professional','4':'Business','5':'Enterprise' };
    items.push({ label: `SM Package ${pkgVal} – ${pkgLabels[pkgVal]} (monthly)`, amount: pkgPrice });
    total += pkgPrice;
  }

  // Design package
  const designPkg = document.querySelector('input[name="designPackage"]:checked')?.value || 'default';
  const designPriceMap = { default: 0, customUI1: pricing.designCustom1, customUI2: pricing.designCustom2, premiumAnim1: pricing.designPremium1, premiumAnim2: pricing.designPremium2 };
  const designLabelMap = { customUI1: 'Custom UI Design — Package 1', customUI2: 'Custom UI Design — Package 2 (20% off)', premiumAnim1: 'Premium Animations & Effects — Package 1', premiumAnim2: 'Premium Animations / Effects — Package 2' };
  const designCost = designPriceMap[designPkg] || 0;
  if (designCost > 0) { items.push({ label: designLabelMap[designPkg], amount: designCost }); total += designCost; }

  const itemsEl = document.getElementById('pricingItems');
  if (itemsEl) {
    itemsEl.innerHTML = items.length
      ? items.map(i => `<div class="pricing-item"><span>${i.label}</span><span>${formatLKR(i.amount)}</span></div>`).join('')
      : `<div class="pricing-item"><span>Select options above to see pricing</span><span>—</span></div>`;
  }

  const totalEl = document.getElementById('totalPrice');
  if (totalEl) totalEl.textContent = formatLKR(total);

  updatePackageHint(pkgVal, pricing, needsMaint);
}

function updatePackageHint(pkgVal, pricing, needsMaint) {
  const el = document.getElementById('packageHint');
  if (!el || !pkgVal) { if (el) el.textContent = ''; return; }
  const price = pricing[`package${pkgVal}`] || 0;
  const descs = {
    '1': 'Basic posting schedule & monitoring',
    '2': 'Content creation + posting schedule',
    '3': 'Full management + analytics report ⭐ Recommended',
    '4': 'Advanced campaigns + monthly report',
    '5': 'Complete digital marketing suite'
  };
  const applied = needsMaint ? ' — applied to total' : ' — select maintenance above to apply';
  el.textContent = `${descs[pkgVal] || ''} · ${formatLKR(price)}/month${applied}`;
}

// ----------------------------------------------------------------
// FORM VALIDATION
// ----------------------------------------------------------------
function validateField(inputId, errorId, isValid, message) {
  const el  = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (!el) return true;
  const valid = isValid(el);
  el.classList.toggle('error', !valid);
  if (err) { err.textContent = message; err.classList.toggle('show', !valid); }
  return valid;
}

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function validateWebsiteForm() {
  let ok = true;
  ok = validateField('businessType',       'businessTypeError',       el => el.value !== '',           'Please select a business type.')          && ok;
  ok = validateField('clientCount',        'clientCountError',        el => el.value !== '',           'Please select a client count range.')     && ok;
  ok = validateField('marketingScope',     'marketingScopeError',     el => el.value !== '',           'Please select a marketing scope.')        && ok;
  ok = validateField('websiteRequirement', 'websiteRequirementError', el => el.value.trim().length >= 10, 'Describe your requirements (min 10 chars).') && ok;
  ok = validateField('numPages',           'numPagesError',           el => el.value !== '',           'Please select the number of pages.')      && ok;
  ok = validateField('contactName',        'contactNameError',        el => el.value.trim().length >= 2, 'Please enter your full name.')          && ok;
  ok = validateField('contactEmail',       'contactEmailError',       el => isEmail(el.value.trim()),  'Please enter a valid email address.')     && ok;
  ok = validateField('contactPhone',       'contactPhoneError',       el => el.value.trim().length >= 7, 'Please enter your phone number.')      && ok;
  return ok;
}

function validateBusinessForm() {
  let ok = true;
  ok = validateField('bpName',  'bpNameError',  el => el.value.trim().length >= 2, 'Please enter your name.')      && ok;
  ok = validateField('bpEmail', 'bpEmailError', el => isEmail(el.value.trim()),     'Please enter a valid email.') && ok;
  return ok;
}

// ----------------------------------------------------------------
// COLLECT FORM DATA
// ----------------------------------------------------------------
async function collectWebsiteData() {
  const pricing        = await fetchPricing();
  const pages          = document.getElementById('numPages').value;
  const domainVal      = document.querySelector('input[name="domainExt"]:checked')?.value || 'none';
  const includeHosting = document.querySelector('input[name="includeHosting"]:checked')?.value || 'no';
  const createProfiles = document.querySelector('input[name="createProfiles"]:checked')?.value || '';
  const maintainExist  = document.querySelector('input[name="maintainExisting"]:checked')?.value || '';
  const wantMaint      = document.querySelector('input[name="wantMaintenance"]:checked')?.value  || '';
  const pkgVal         = document.getElementById('smPackage').value;
  const designPkg      = document.querySelector('input[name="designPackage"]:checked')?.value || 'default';
  const createPlatforms = [...document.querySelectorAll('input[name="createPlatform"]:checked')].map(c => c.value);

  let total = 0;
  const pg = parseInt(pages) || 0;
  if (pg > 0) { total += pricing.base; if (pg > 1) total += (pg - 1) * pricing.perPage; }

  const domainPriceMap = { none: 0, com: pricing.domainCom, lk: pricing.domainLk, net: pricing.domainNet, org: pricing.domainOrg, premium: pricing.domainPremium };
  total += domainPriceMap[domainVal] || 0;
  if (includeHosting === 'yes') total += pricing.hosting;

  const socialInt = document.querySelector('input[name="socialIntegration"]:checked')?.value || 'no';
  if (socialInt === 'yes') {
    if (document.querySelector('input[name="socialPlatform"][value="LinkedIn"]:checked')) total += pricing.linkedinIntegration;
    if (document.querySelector('input[name="socialPlatform"][value="YouTube"]:checked')) total += pricing.youtubeIntegration;
  }

  if (createProfiles === 'yes') {
    const premiumPlatforms = ['LinkedIn', 'YouTube'];
    createPlatforms.forEach(p => { total += premiumPlatforms.includes(p) ? pricing.smCreatePremium : pricing.smCreateStandard; });
  }

  if (pkgVal && (maintainExist === 'yes' || wantMaint === 'yes')) total += pricing[`package${pkgVal}`] || 0;

  const designPriceMap = { default: 0, customUI1: pricing.designCustom1, customUI2: pricing.designCustom2, premiumAnim1: pricing.designPremium1, premiumAnim2: pricing.designPremium2 };
  total += designPriceMap[designPkg] || 0;

  const bizType = document.getElementById('businessType').value;
  const otherBiz = document.getElementById('otherBusiness')?.value || '';

  return {
    type:               'website',
    businessType:       bizType === 'Other' && otherBiz ? `Other (${otherBiz})` : bizType,
    clientCount:        document.getElementById('clientCount').value,
    marketingScope:     document.getElementById('marketingScope').value,
    marketingCustom:    document.getElementById('marketingCustom').value,
    websiteRequirement: document.getElementById('websiteRequirement').value,
    exampleWebsite:     document.getElementById('exampleWebsite').value,
    numPages:           pages,
    domain:             domainVal,
    hosting:            includeHosting,
    socialIntegration:  socialInt,
    socialPlatforms:    [...document.querySelectorAll('input[name="socialPlatform"]:checked')].map(c => c.value),
    hasExistingSocial:  document.querySelector('input[name="hasExistingSocial"]:checked')?.value || '',
    maintainExisting:   maintainExist,
    maintainPlatforms:  [...document.querySelectorAll('input[name="maintainPlatform"]:checked')].map(c => c.value),
    createProfiles,
    createPlatforms,
    wantMaintenance:    wantMaint,
    smPackage:          pkgVal,
    designPackage:      designPkg,
    totalPrice:         total,
    contactName:        document.getElementById('contactName').value.trim(),
    contactEmail:       document.getElementById('contactEmail').value.trim(),
    contactPhone:       document.getElementById('contactPhone').value.trim()
  };
}

// ----------------------------------------------------------------
// SUBMIT — WEBSITE FORM
// ----------------------------------------------------------------
async function handleWebsiteSubmit(e) {
  e.preventDefault();
  if (!validateWebsiteForm()) {
    showToast('Please fix the highlighted fields.', '⚠️');
    document.querySelector('.form-control.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Submitting...';

  try {
    const data = await collectWebsiteData();
    await apiPost('/api/requests', data);
    showSuccessModal('Your request has been submitted. You will be contacted within 1 hour.');
  } catch (err) {
    showToast('Submission failed. Please try again.', '❌');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Request';
  }
}

// ----------------------------------------------------------------
// SUBMIT — BUSINESS FORM
// ----------------------------------------------------------------
async function handleBusinessSubmit(e) {
  e.preventDefault();
  if (!validateBusinessForm()) {
    showToast('Please fill in your name and email.', '⚠️');
    return;
  }

  const btn = document.getElementById('bpSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Submitting...';

  try {
    await apiPost('/api/requests', {
      type:          'business',
      processAreas:  [...document.querySelectorAll('input[name="processArea"]:checked')].map(c => c.value),
      businessScope: document.querySelector('input[name="businessScope"]:checked')?.value || '',
      details:       document.getElementById('processDetails')?.value || '',
      numPages: '', socialPlatforms: [], smPackage: '', totalPrice: 0,
      contactName:  document.getElementById('bpName').value.trim(),
      contactEmail: document.getElementById('bpEmail').value.trim(),
      contactPhone: document.getElementById('bpPhone')?.value.trim() || ''
    });
    showSuccessModal('Your inquiry has been submitted. Our team will contact you within 1 hour.');
  } catch (err) {
    showToast('Submission failed. Please try again.', '❌');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Inquiry';
  }
}

// ----------------------------------------------------------------
// MODAL
// ----------------------------------------------------------------
function showSuccessModal(msg) {
  const el = document.getElementById('successModalMsg');
  if (el) el.textContent = msg;
  document.getElementById('successModal')?.classList.add('show');
}

function closeModal() {
  document.getElementById('successModal')?.classList.remove('show');
  showSection('landingSection');
  const form = document.getElementById('websiteRequestForm');
  if (form) {
    form.reset();
    document.querySelectorAll('.conditional-field').forEach(f => f.classList.remove('show'));
    document.querySelectorAll('.form-control.error').forEach(f => f.classList.remove('error'));
    document.querySelectorAll('.error-msg.show').forEach(f => f.classList.remove('show'));
    updatePricing();
  }
}

// ----------------------------------------------------------------
// TOAST
// ----------------------------------------------------------------
let _toastTimer = null;
function showToast(message, icon) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').textContent   = message;
  document.getElementById('toastIcon').textContent  = icon || '✅';
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ----------------------------------------------------------------
// ADMIN — PRICING
// ----------------------------------------------------------------
async function loadAdminPricing() {
  const p = await fetchPricing();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('priceBase',          p.base);
  set('pricePerPage',       p.perPage);
  set('priceDomainCom',     p.domainCom);
  set('priceDomainLk',      p.domainLk);
  set('priceDomainNet',     p.domainNet);
  set('priceDomainOrg',     p.domainOrg);
  set('priceDomainPremium', p.domainPremium);
  set('priceHosting',       p.hosting);
  set('priceLinkedinInt',   p.linkedinIntegration);
  set('priceYoutubeInt',    p.youtubeIntegration);
  set('priceSMCreateStd',   p.smCreateStandard);
  set('priceSMCreatePrem',  p.smCreatePremium);
  set('pricePackage1',      p.package1);
  set('pricePackage2',      p.package2);
  set('pricePackage3',      p.package3);
  set('pricePackage4',      p.package4);
  set('pricePackage5',      p.package5);
  set('priceDesignCustom1', p.designCustom1);
  set('priceDesignCustom2', p.designCustom2);
  set('priceDesignPrem1',   p.designPremium1);
  set('priceDesignPrem2',   p.designPremium2);
}

async function savePricing() {
  const get = id => parseFloat(document.getElementById(id)?.value) || 0;
  const pricing = {
    base:                get('priceBase'),
    perPage:             get('pricePerPage'),
    domainCom:           get('priceDomainCom'),
    domainLk:            get('priceDomainLk'),
    domainNet:           get('priceDomainNet'),
    domainOrg:           get('priceDomainOrg'),
    domainPremium:       get('priceDomainPremium'),
    hosting:             get('priceHosting'),
    linkedinIntegration: get('priceLinkedinInt'),
    youtubeIntegration:  get('priceYoutubeInt'),
    smCreateStandard:    get('priceSMCreateStd'),
    smCreatePremium:     get('priceSMCreatePrem'),
    package1:            get('pricePackage1'),
    package2:            get('pricePackage2'),
    package3:            get('pricePackage3'),
    package4:            get('pricePackage4'),
    package5:            get('pricePackage5'),
    designCustom1:       get('priceDesignCustom1'),
    designCustom2:       get('priceDesignCustom2'),
    designPremium1:      get('priceDesignPrem1'),
    designPremium2:      get('priceDesignPrem2'),
  };
  try {
    await apiPost('/api/pricing', pricing);
  } catch (err) {
    showToast('Failed to save pricing.', '❌');
    console.error(err);
  }
}

// ----------------------------------------------------------------
// ADMIN — TABLE & PAGINATION
// ----------------------------------------------------------------
let currentPage = 1;

async function renderTable() {
  let requests = [];
  try { requests = await apiGet('/api/requests'); } catch { requests = []; }

  const perPage    = parseInt(document.getElementById('perPageSelect')?.value) || 10;
  const totalPages = Math.max(1, Math.ceil(requests.length / perPage));
  if (currentPage > totalPages) currentPage = totalPages;

  updateStats(requests);

  const tbody      = document.getElementById('requestsTableBody');
  const empty      = document.getElementById('emptyState');
  const pagination = document.getElementById('paginationControls');
  if (!tbody) return;

  if (requests.length === 0) {
    tbody.innerHTML = '';
    if (empty)      empty.style.display = 'block';
    if (pagination) pagination.style.display = 'none';
    return;
  }

  if (empty)      empty.style.display = 'none';
  if (pagination) pagination.style.display = 'flex';

  const reversed  = [...requests].reverse();
  const start     = (currentPage - 1) * perPage;
  const pageItems = reversed.slice(start, start + perPage);
  const pkgNames  = { '1':'Starter','2':'Growth','3':'Professional','4':'Business','5':'Enterprise' };

  tbody.innerHTML = pageItems.map((req, i) => {
    const rowNum    = requests.length - start - i;
    const date      = new Date(req.timestamp).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
    const typeBadge = req.type === 'business'
      ? '<span class="badge badge-purple">Business</span>'
      : '<span class="badge badge-blue">Website</span>';
    const platforms = req.socialPlatforms?.length ? req.socialPlatforms.join(', ') : '—';
    const pkg       = req.smPackage ? `Pkg ${req.smPackage} · ${pkgNames[req.smPackage] || ''}` : '—';
    const price     = req.totalPrice > 0
      ? `<span class="badge badge-green">${formatLKR(req.totalPrice)}</span>`
      : '<span style="color:var(--text-secondary)">—</span>';

    return `<tr>
      <td style="color:var(--text-secondary)">${rowNum}</td>
      <td><strong>${esc(req.contactName || '—')}</strong></td>
      <td>${typeBadge}</td>
      <td style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
          title="${esc(req.businessType || req.processAreas?.join(', ') || '')}">
        ${esc(req.businessType || req.processAreas?.join(', ') || '—')}
      </td>
      <td>${req.numPages || '—'}</td>
      <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(platforms)}">${esc(platforms)}</td>
      <td style="white-space:nowrap">${esc(pkg)}</td>
      <td>${price}</td>
      <td style="font-size:0.8rem">${esc(req.contactEmail || '—')}</td>
      <td style="font-size:0.8rem;white-space:nowrap">${esc(req.contactPhone || '—')}</td>
      <td style="font-size:0.78rem;color:var(--text-secondary);white-space:nowrap">${date}</td>
    </tr>`;
  }).join('');

  renderPagination(requests.length, perPage, totalPages, start);
}

function renderPagination(total, perPage, totalPages, start) {
  const infoEl = document.getElementById('paginationInfo');
  const btnsEl = document.getElementById('paginationBtns');
  if (!infoEl || !btnsEl) return;

  infoEl.textContent = `Showing ${start + 1}–${Math.min(start + perPage, total)} of ${total} request${total !== 1 ? 's' : ''}`;

  let html = `<button class="page-btn" onclick="changePage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>`;
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      html += `<button class="page-btn ${p===currentPage?'active':''}" onclick="changePage(${p})">${p}</button>`;
    } else if (Math.abs(p - currentPage) === 2) {
      html += `<button class="page-btn" disabled style="border:none;background:none">…</button>`;
    }
  }
  html += `<button class="page-btn" onclick="changePage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>›</button>`;
  btnsEl.innerHTML = html;
}

function changePage(p) {
  currentPage = p;
  renderTable();
}

function updateStats(requests) {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('statTotal', requests.length);
  set('statRevenue', formatLKR(requests.reduce((s, r) => s + (r.totalPrice || 0), 0)));
  set('statSocial', requests.filter(r => r.socialPlatforms?.length > 0 || r.socialIntegration === 'yes').length);
  const webReqs = requests.filter(r => r.numPages && parseInt(r.numPages));
  const avg = webReqs.length
    ? (webReqs.reduce((s, r) => s + (parseInt(r.numPages) || 0), 0) / webReqs.length).toFixed(1) : '0';
  set('statAvgPages', avg);
}

// ----------------------------------------------------------------
// ADMIN — EXPORT & CLEAR
// ----------------------------------------------------------------
async function exportJSON() {
  let requests = [];
  try { requests = await apiGet('/api/requests'); } catch {}
  if (!requests.length) { showToast('No requests to export.', 'ℹ️'); return; }

  const blob = new Blob([JSON.stringify(requests, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `visitsl-requests-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Exported as JSON!', '⬇️');
}

async function clearRequests() {
  if (!confirm('Delete ALL customer requests? This cannot be undone.')) return;
  try {
    await apiDelete('/api/requests');
    currentPage = 1;
    renderTable();
    showToast('All requests cleared.', '🗑️');
  } catch {
    showToast('Failed to clear requests.', '❌');
  }
}

// ----------------------------------------------------------------
// UTILITY
// ----------------------------------------------------------------
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ----------------------------------------------------------------
// INIT
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('websiteRequestForm')?.addEventListener('submit', handleWebsiteSubmit);
  document.getElementById('businessProcessForm')?.addEventListener('submit', handleBusinessSubmit);

  if (document.getElementById('pricingItems')) updatePricing();   // customer page

  if (document.getElementById('requestsTableBody')) {             // admin page
    loadAdminPricing();
    renderTable();
  }
});
