
let users = [
  { phone: '+91 98765 43210', name: 'Rohan Sharma',  status: 'SAFE',     time: new Date(Date.now()-120000), device: 'ESP32-A1', signal: '-62 dBm' },
  { phone: '+91 87654 32109', name: 'Priya Mehta',   status: 'SAFE',     time: new Date(Date.now()-300000), device: 'ESP32-B2', signal: '-55 dBm' },
  { phone: '+91 76543 21098', name: 'Aman Verma',    status: 'ACCIDENT', time: new Date(Date.now()-45000),  device: 'ESP32-C3', signal: '-71 dBm' },
  { phone: '+91 65432 10987', name: 'Sneha Kapoor',  status: 'SAFE',     time: new Date(Date.now()-600000), device: 'ESP32-D4', signal: '-58 dBm' },
  { phone: '+91 54321 09876', name: 'Karan Joshi',   status: 'SAFE',     time: new Date(Date.now()-900000), device: 'ESP32-E5', signal: '-66 dBm' },
];

let filter     = 'all';
let searchTerm = '';


function render() {
  const body = document.getElementById('table-body');

  const filtered = users.filter(u => {
    const matchFilter = filter === 'all' || u.status.toLowerCase() === filter;
    const matchSearch =
      u.phone.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, '')) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  body.innerHTML = '';

  filtered.forEach((u, i) => {
    const isPanic = u.status === 'ACCIDENT';
    const row     = document.createElement('div');
    row.className = 'user-row';
    row.style.animationDelay = (i * 0.05) + 's';
    row.innerHTML = `
      <div class="row-index">${String(i + 1).padStart(2, '0')}</div>
      <div class="phone-cell">
        <div class="avatar">${u.name.charAt(0)}</div>
        <div>
          <div class="phone-num">${u.phone}</div>
          <div class="name-tag">${u.name}</div>
        </div>
      </div>
      <div>
        <span class="status-pill ${isPanic ? 'accident' : 'safe'}">
          <span class="status-dot"></span>
          ${u.status}
        </span>
      </div>
      <div class="time-cell">
        <div>${formatTime(u.time)}</div>
        <div class="time-ago">${timeAgo(u.time)}</div>
      </div>
      <div>
        <button class="action-btn" onclick="openModal(${i})">Details</button>
      </div>
    `;
    body.appendChild(row);
  });

  
  const accCount = users.filter(u => u.status === 'ACCIDENT').length;
  document.getElementById('count-total').textContent    = users.length;
  document.getElementById('count-safe').textContent     = users.filter(u => u.status === 'SAFE').length;
  document.getElementById('count-accident').textContent = accCount;

  
  document.body.classList.toggle('danger-mode', accCount > 0);

  
  document.getElementById('last-refresh').textContent = 'Last refresh: ' + formatTime(new Date());
}


function formatTime(d) {
  return d.toLocaleTimeString('en-IN', { hour12: false });
}

function timeAgo(d) {
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60)   return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  return Math.floor(s / 3600) + 'h ago';
}


function tickClock() {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString('en-IN', { hour12: false });
}
setInterval(tickClock, 1000);
tickClock();

// Re-render timeago labels every 30s
setInterval(render, 30000);

// ─── Filter buttons ────────────────────────────────────────────
function setFilter(f) {
  filter = f;
  ['all', 'safe', 'accident'].forEach(k => {
    document.getElementById('filter-' + k).classList.toggle('active', k === f);
  });
  render();
}

// ─── Search ────────────────────────────────────────────────────
document.getElementById('search').addEventListener('input', e => {
  searchTerm = e.target.value;
  render();
});

// ─── Modal ─────────────────────────────────────────────────────
function openModal(i) {
  const filtered = users.filter(u => {
    const matchFilter = filter === 'all' || u.status.toLowerCase() === filter;
    const matchSearch =
      u.phone.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, '')) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const u = filtered[i];
  if (!u) return;

  document.getElementById('m-name').textContent  = u.name;
  document.getElementById('m-phone').textContent = u.phone;

  const sv     = document.getElementById('m-status');
  sv.textContent = u.status;
  sv.className   = 'modal-item-value ' + (u.status === 'ACCIDENT' ? 'danger' : 'safe');

  document.getElementById('m-time').textContent   = formatTime(u.time);
  document.getElementById('m-device').textContent = u.device || 'ESP32-??';
  document.getElementById('m-signal').textContent = u.signal || '—';

  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal'))
    document.getElementById('modal').classList.remove('open');
}

// ─── Toast notification ────────────────────────────────────────
function showToast(msg, isAlert = false) {
  const t = document.getElementById('toast');
  t.textContent      = msg;
  t.style.background = isAlert ? 'var(--danger)' : 'var(--safe-dim)';
  t.style.color      = '#fff';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ─── Demo panel ────────────────────────────────────────────────
function demoAdd(status) {
  const phone    = document.getElementById('demo-phone').value.trim() || '+91 00000 00001';
  const existing = users.findIndex(u =>
    u.phone.replace(/\s/g, '') === phone.replace(/\s/g, '')
  );
  const entry = {
    phone, status,
    name:   'Demo User',
    time:   new Date(),
    device: 'ESP32-DEMO',
    signal: '-60 dBm',
  };

  if (existing >= 0) {
    const prev = users[existing].status;
    users[existing] = entry;
    if (status === 'ACCIDENT' && prev !== 'ACCIDENT')
      showToast('🚨 ACCIDENT detected: ' + phone, true);
    else
      showToast('✔ Status updated to ' + status);
  } else {
    users.unshift(entry);
    if (status === 'ACCIDENT') showToast('🚨 SOS triggered: ' + phone, true);
    else                        showToast('✔ User added: ' + phone);
  }
  render();
}

function demoRemove() {
  const phone  = document.getElementById('demo-phone').value.trim();
  const before = users.length;
  users = users.filter(u =>
    u.phone.replace(/\s/g, '') !== phone.replace(/\s/g, '')
  );
  showToast(users.length < before ? 'User removed' : 'Phone not found');
  render();
}


window.updateUser = function (data) {
  const idx   = users.findIndex(u =>
    u.phone.replace(/\s/g, '') === data.phone.replace(/\s/g, '')
  );
  const entry = { ...data, time: new Date() };

  if (idx >= 0) users[idx] = entry;
  else          users.unshift(entry);

  if (data.status === 'ACCIDENT')
    showToast('🚨 SOS received: ' + data.phone, true);

  render();
};

function manualRefresh() {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  btn.disabled = true;

  
  setTimeout(() => {
    render();
    btn.classList.remove('spinning');
    btn.disabled = false;
    showToast('✔ Data refreshed');
  }, 600);
}


render();