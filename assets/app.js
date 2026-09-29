/* ============================================================
   Doctor Sanjeev Godha Nilay — Donor Records
   Shared configuration and helpers.
   ============================================================ */

// PASTE your deployed Google Apps Script Web App URL here.
// It looks like: https://script.google.com/macros/s/XXXXXXXX/exec
const API_URL = 'https://script.google.com/macros/s/AKfycbzSm7I8Zel0Nia9CBqT4eGjFWMRHyzVWPf-MHPJHyABCXYN5U2VwNKPKdBgNQvx7hSx/exec';

const SESSION_KEY = 'psjt_donor_session';

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
  catch (e) { return null; }
}
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Redirects to login if there is no session, or if the role isn't allowed on this page. */
function requireRole(allowedRoles) {
  const s = getSession();
  if (!s || !s.u || !s.p) {
    window.location.href = 'index.html';
    return null;
  }
  if (allowedRoles && allowedRoles.indexOf(s.role) === -1) {
    window.location.href = 'index.html';
    return null;
  }
  return s;
}

function showToast(message, isError) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.toggle('error', !!isError);
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 4200);
}

async function apiGet(params) {
  const url = new URL(API_URL);
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  const res = await fetch(url.toString(), { method: 'GET' });
  return res.json();
}

async function apiPost(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight
    body: JSON.stringify(payload)
  });
  return res.json();
}

function renderSidebarUser(session) {
  const nameEl = document.getElementById('sbUserName');
  const roleEl = document.getElementById('sbUserRole');
  if (nameEl) nameEl.textContent = session.name || session.u;
  if (roleEl) roleEl.textContent = session.role;
  const logoutBtn = document.getElementById('sbLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    clearSession();
    window.location.href = 'index.html';
  });
}

const archSVG = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 56V30C8 16 18 6 32 6C46 6 56 16 56 30V56" stroke="currentColor" stroke-width="2.2"/>
  <path d="M14 56V32C14 20 22 12 32 12C42 12 50 20 50 32V56" stroke="currentColor" stroke-width="1.3" opacity="0.55"/>
  <circle cx="32" cy="24" r="2.4" fill="currentColor"/>
  <path d="M2 56H62" stroke="currentColor" stroke-width="2.2"/>
</svg>`;
