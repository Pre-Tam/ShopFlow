'use strict';

/* =====================================================================
   1. MOCK DATA  – replace this block with real data from your backend
   ===================================================================== */
const dayISO = n => {                       // local date as YYYY-MM-DD, n days from today
  const d = new Date(); d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const P = (id, name, cat, cost, price, stock) => ({ id, name, cat, cost, price, stock });
const S = (n, pid, name, cat, qty, amount, profit, time, pay) =>
  ({ id: 's' + n, tx: 't' + n, pid, name, cat, qty, amount, profit, time, pay, cust: '', status: 'Completed' });

const CATS = ['Electronics', 'Utility', 'Grocery', 'Stationery', 'Household'];
const EXP_CATS = ['Rent', 'Electricity', 'Transport', 'Stock Purchase', 'Salary', 'Internet', 'Miscellaneous'];
const PAY = ['Cash', 'eSewa', 'Bank Transfer', 'Other'];
const BIZ_TYPES = ['General Retail', 'Electronics', 'Grocery', 'Stationery', 'Clothing', 'Household Goods', 'Mixed Retail'];

const db = {
  shop: { name: 'Pitambar General Store', owner: 'Pitambar Rajbanshi', first: 'Pitambar', place: 'Nepal', type: 'General Retail', lowAt: 5, alerts: true },
  products: [
    P('p1', 'Wireless Earbuds', 'Electronics', 800, 1250, 3), P('p2', 'USB Cable', 'Electronics', 360, 600, 5),
    P('p3', 'Power Bank', 'Electronics', 1200, 1800, 2), P('p4', 'Bluetooth Speaker', 'Electronics', 1550, 2400, 8),
    P('p5', 'Mobile Charger', 'Electronics', 400, 700, 12), P('p6', 'LED Bulb', 'Electronics', 160, 300, 25),
    P('p7', 'Water Bottle', 'Utility', 240, 350, 15), P('p8', 'Extension Cord', 'Utility', 380, 550, 9),
    P('p9', 'Torch Light', 'Utility', 300, 500, 11), P('p10', 'Cleaning Brush', 'Household', 100, 150, 18),
    P('p11', 'Storage Box', 'Household', 300, 450, 7), P('p12', 'Notebook', 'Stationery', 130, 200, 20),
    P('p13', 'Biscuits', 'Grocery', 40, 50, 40), P('p14', 'Noodles', 'Grocery', 24, 30, 60),
    P('p15', 'Bottled Water', 'Grocery', 17, 25, 48), P('p16', 'Soft Drink', 'Grocery', 90, 120, 30),
    P('p17', 'Chips', 'Grocery', 40, 50, 35)
  ],
  // Today's sales, newest first. Totals: NPR 20,000 sales, 12 transactions.
  sales: [
    S(12, 'p1', 'Wireless Earbuds', 'Electronics', 1, 1250, 450, '10:42 AM', 'eSewa'),
    S(11, 'p2', 'USB Cable', 'Electronics', 2, 1200, 480, '10:21 AM', 'Cash'),
    S(10, 'p13', 'Biscuits', 'Grocery', 10, 500, 100, '9:58 AM', 'Cash'),
    S(9, 'p3', 'Power Bank', 'Electronics', 1, 1800, 600, '9:32 AM', 'eSewa'),
    S(8, 'p7', 'Water Bottle', 'Utility', 2, 700, 220, '9:15 AM', 'Cash'),
    S(7, 'p4', 'Bluetooth Speaker', 'Electronics', 2, 4800, 1700, '8:50 AM', 'Bank Transfer'),
    S(6, 'p6', 'LED Bulb', 'Electronics', 6, 1800, 840, '8:41 AM', 'Cash'),
    S(5, 'p5', 'Mobile Charger', 'Electronics', 3, 2100, 900, '8:30 AM', 'eSewa'),
    S(4, 'p9', 'Torch Light', 'Utility', 4, 2000, 800, '8:22 AM', 'Cash'),
    S(3, 'p16', 'Soft Drink', 'Grocery', 10, 1200, 300, '8:10 AM', 'Cash'),
    S(2, 'p17', 'Chips', 'Grocery', 20, 1000, 200, '8:02 AM', 'Cash'),
    S(1, 'p8', 'Extension Cord', 'Utility', 3, 1650, 510, '7:55 AM', 'Other')
  ],
  // Previous 6 days (net profit already after expenses)
  history: [
    { date: dayISO(-6), sales: 12400, profit: 4200, tx: 9 }, { date: dayISO(-5), sales: 15200, profit: 5100, tx: 11 },
    { date: dayISO(-4), sales: 13800, profit: 4600, tx: 10 }, { date: dayISO(-3), sales: 18600, profit: 6400, tx: 13 },
    { date: dayISO(-2), sales: 16900, profit: 5800, tx: 12 }, { date: dayISO(-1), sales: 17500, profit: 6125, tx: 11 }
  ],
  pastTop: { 'Wireless Earbuds': [14, 17500], 'Bluetooth Speaker': [7, 16800], 'Power Bank': [9, 16200], 'USB Cable': [22, 13200], 'Mobile Charger': [16, 11200], 'Noodles': [140, 4200] },
  expenses: [
    { id: 'e1', date: dayISO(-5), cat: 'Rent', desc: 'Shop rent', amount: 2000, pay: 'Bank Transfer' },
    { id: 'e2', date: dayISO(-3), cat: 'Electricity', desc: 'Electricity bill', amount: 800, pay: 'eSewa' },
    { id: 'e3', date: dayISO(-1), cat: 'Miscellaneous', desc: 'Cleaning supplies', amount: 450, pay: 'Cash' },
    { id: 'e4', date: dayISO(0), cat: 'Transport', desc: 'Stock delivery', amount: 300, pay: 'Cash' }
  ],
  customers: [
    { id: 'c0', name: 'Walk-in Customer', phone: '', total: 61400, last: dayISO(0), status: 'Walk-in' },
    { id: 'c1', name: 'Ramesh Electronics', phone: '9841234567', total: 48500, last: dayISO(-1), status: 'Regular' },
    { id: 'c2', name: 'Sita Thapa', phone: '9852098765', total: 12600, last: dayISO(-3), status: 'Regular' },
    { id: 'c3', name: 'Anita Karki', phone: '9807654321', total: 2400, last: dayISO(-9), status: 'New' }
  ]
};

/* =====================================================================
   2. DATA LAYER – the only place that touches `db`.
   Swap these for fetch()/Supabase/Firebase calls later (make them async).
   ===================================================================== */
const api = {
  list: t => db[t],
  add(t, row) { db[t].unshift(row); return row; },
  update(t, id, ch) { const r = db[t].find(x => x.id === id); if (r) Object.assign(r, ch); return r; },
  remove(t, id) { db[t] = db[t].filter(x => x.id !== id); }
};
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

/* =====================================================================
   3. HELPERS
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const npr = n => 'NPR ' + Math.round(n).toLocaleString('en-IN');
const short = n => n >= 1000 ? `${+(n / 1000).toFixed(1)}k` : String(n);
const sum = (a, k) => a.reduce((t, x) => t + x[k], 0);
const pct = (a, b) => b ? Math.round((a / b - 1) * 100) : 0;
const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const weekday = iso => new Date(iso + 'T00:00').toLocaleDateString('en-US', { weekday: 'short' });
const dateLabel = iso => !iso ? '—' : iso === dayISO(0) ? 'Today' : iso === dayISO(-1) ? 'Yesterday'
  : new Date(iso + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const status = p => p.stock <= 0 ? 'out' : p.stock <= db.shop.lowAt ? 'low' : 'in';
const STATUS_LABEL = { in: 'In Stock', low: 'Low Stock', out: 'Out of Stock' };
const tag = s => `<span class="tag ${s}">${STATUS_LABEL[s]}</span>`;

/* Business numbers are always calculated from the data above */
function stats() {
  const exp = sum(db.expenses.filter(e => e.date === dayISO(0)), 'amount');
  const gross = sum(db.sales, 'profit');
  return { sales: sum(db.sales, 'amount'), exp, profit: gross - exp, tx: new Set(db.sales.map(s => s.tx)).size };
}
const delta = (a, b) => { const d = pct(a, b); return `<span class="delta ${d < 0 ? 'neg' : ''}">${d >= 0 ? '+' : ''}${d}% vs yesterday</span>`; };

const table = (cols, rows) =>
  `<table class="tbl"><thead><tr>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>` +
  rows.map(r => `<tr>${r.map((c, i) => `<td data-label="${cols[i]}">${c}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
const empty = (title, text, action = '') => `<div class="empty"><strong>${title}</strong><p>${text}</p>${action}</div>`;
const chartHtml = items => {
  const max = Math.max(...items.map(i => i.v), 1);
  return `<div class="chart" role="list">${items.map(i => `<div class="bar${i.now ? ' now' : ''}" role="listitem" aria-label="${i.l}: ${npr(i.v)}"><span class="bv">${short(i.v)}</span><i style="height:${Math.max(Math.round(i.v / max * 130), 3)}px"></i><span class="bl">${i.l}</span></div>`).join('')}</div>`;
};

function toast(msg, type = 'ok') {
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = (type === 'ok' ? ico('check') : '') + `<span>${esc(msg)}</span>`;
  $('#toasts').append(t);
  setTimeout(() => t.remove(), 3200);
}
let askCb = null;
function ask({ title, text, ok = 'Confirm', cancel = true, onOk }) {
  $('#askTitle').textContent = title; $('#askText').textContent = text;
  $('#askOk').textContent = ok; $('#askCancel').hidden = !cancel; askCb = onOk || null;
  $('#askDlg').showModal();
}
const setErr = (f, n, msg) => {
  $(`[data-err="${n}"]`, f).textContent = msg || '';
  f.elements[n].setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
};
const clearErrs = f => $$('[data-err]', f).forEach(p => setErr(f, p.dataset.err, ''));

/* =====================================================================
   4. RENDERING
   ===================================================================== */
const NAV = [['dashboard', 'Dashboard'], ['sales', 'Sales'], ['inventory', 'Inventory'], ['expenses', 'Expenses'], ['customers', 'Customers'], ['reports', 'Reports'], ['settings', 'Settings']];
const inv = { q: '', f: 'all' };
const rep = { range: '7', tab: 'sales' };
let cart = [];

function renderChrome() {
  const s = db.shop;
  $('#shopName').textContent = s.name; $('#shopPlace').textContent = s.place; $('#uName').textContent = s.owner;
  $('#avatar').textContent = s.owner.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  $('#hdDate').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const al = s.alerts ? db.products.filter(p => status(p) !== 'in') : [];
  $('#bellBadge').hidden = !al.length; $('#bellBadge').textContent = al.length;
  $('#bellMenu').innerHTML = '<p class="pop-h">Needs your attention</p>' + (al.length
    ? al.map(p => `<button class="pop-item" data-act="inv-filter" data-f="${status(p)}"><span>${esc(p.name)}</span><b class="${status(p)}">${p.stock < 1 ? 'Out of stock' : p.stock + ' left'}</b></button>`).join('')
    : '<p class="pop-empty">All clear. Your stock levels look healthy.</p>');
}

function renderDashboard() {
  const st = stats(), y = db.history.at(-1), h = new Date().getHours();
  const low = db.products.filter(p => status(p) === 'low').sort((a, b) => a.stock - b.stock);
  $('#greeting').textContent = `${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, ${db.shop.first}!`;
  $('#todayDate').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#kSales').innerHTML = `<span class="cur">NPR</span>${st.sales.toLocaleString('en-IN')}`;
  $('#kSalesMeta').innerHTML = `<span>${st.tx} transaction${st.tx === 1 ? '' : 's'}</span>${delta(st.sales, y.sales)}`;
  $('#kProfit').innerHTML = `<span class="cur">NPR</span>${Math.round(st.profit).toLocaleString('en-IN')}`;
  $('#kProfitMeta').innerHTML = delta(st.profit, y.profit);
  $('#kLowCount').textContent = low.length;
  $('#kLowText').textContent = low.length ? `product${low.length === 1 ? '' : 's'} need${low.length === 1 ? 's' : ''} attention` : 'No low-stock products';
  $('.a-l').classList.toggle('ok', !low.length);
  $('#lowList').innerHTML = low.slice(0, 4).map(p => `<li><span>${esc(p.name)}</span><b>${p.stock} left</b></li>`).join('');
  $('#chart').innerHTML = chartHtml([...db.history.map(d => ({ l: weekday(d.date), v: d.sales })), { l: weekday(dayISO(0)), v: st.sales, now: true }]);
  $('#recent').innerHTML = db.sales.length ? table(['Product', 'Category', 'Qty', 'Amount', 'Time', 'Status'], db.sales.slice(0, 5).map(salesRow))
    : empty('No sales yet today', 'Your first sale will show up here.', '<button class="btn primary" data-act="add-sale">+ Add Sale</button>');
}
const salesRow = s => [esc(s.name), esc(s.cat), s.qty, npr(s.amount), s.time, `<span class="tag ok">${s.status}</span>`];

function renderSales() {
  const q = $('#saleSearch').value.trim().toLowerCase();
  const list = db.products.filter(p => !q || (p.name + p.cat).toLowerCase().includes(q)).slice(0, 6);
  $('#saleResults').innerHTML = list.length ? list.map(p => `<li><button type="button" class="res" data-act="cart-add" data-id="${p.id}" ${p.stock < 1 ? 'disabled' : ''}><span><b>${esc(p.name)}</b><small>${esc(p.cat)}, ${p.stock < 1 ? 'out of stock' : p.stock + ' in stock'}</small></span><span>${npr(p.price)}</span></button></li>`).join('')
    : `<li class="muted small">No product matches “${esc(q)}”.</li>`;
  renderCart();
  const sel = $('#saleCust'), cur = sel.value;
  sel.innerHTML = '<option value="">Walk-in customer</option>' + db.customers.filter(c => c.id !== 'c0').map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  sel.value = cur;
  $('#todaySales').innerHTML = db.sales.length ? table(['Product', 'Qty', 'Amount', 'Time', 'Payment'], db.sales.map(s => [esc(s.name), s.qty, npr(s.amount), s.time, esc(s.pay)]))
    : empty('No sales yet today', 'Add your first sale using the form.');
}
function renderCart() {
  const rows = cart.map(c => {
    const p = db.products.find(x => x.id === c.pid);
    return `<li class="cart-row"><div><b>${esc(p.name)}</b><small>${npr(p.price)} each</small></div>
      <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}"><button type="button" data-act="qty" data-id="${p.id}" data-d="-1" aria-label="Decrease quantity">−</button><output>${c.qty}</output><button type="button" data-act="qty" data-id="${p.id}" data-d="1" aria-label="Increase quantity">+</button></div>
      <b class="sub">${npr(p.price * c.qty)}</b><button type="button" class="x" data-act="cart-del" data-id="${p.id}" aria-label="Remove ${esc(p.name)}">×</button></li>`;
  }).join('');
  $('#cart').innerHTML = rows ? `<ul class="cart">${rows}</ul>` : empty('No items yet', 'Tap a product above to add it to this sale.');
  $('#saleTotal').textContent = npr(cart.reduce((t, c) => t + db.products.find(p => p.id === c.pid).price * c.qty, 0));
}

function renderInventory() {
  $$('#invFilters .pill').forEach(b => { const on = b.dataset.f === inv.f; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  const q = inv.q.trim().toLowerCase();
  const rows = db.products.filter(p => (inv.f === 'all' || status(p) === inv.f) && (!q || (p.name + p.cat).toLowerCase().includes(q)));
  const msg = q ? ['No products found', 'Try a different name or add a new product.']
    : { low: ['No low-stock products', 'Everything is well stocked right now.'], out: ['Nothing is out of stock', 'Every product has stock available.'] }[inv.f] || ['No products yet', 'Add your first product to start tracking stock.'];
  $('#invList').innerHTML = rows.length ? table(['Product', 'Category', 'Selling Price', 'Stock', 'Status', ''], rows.map(p => [
    esc(p.name), esc(p.cat), npr(p.price), `<span class="${status(p) === 'in' ? '' : 'low-n'}">${p.stock}</span>`, tag(status(p)),
    `<div class="acts"><button class="btn sm" data-act="edit-product" data-id="${p.id}">Edit</button><button class="btn sm danger" data-act="del-product" data-id="${p.id}">Delete</button></div>`]))
    : empty(...msg, '<button class="btn primary" data-act="add-product">+ Add Product</button>');
}

function renderExpenses() {
  const month = dayISO(0).slice(0, 7);
  $('#expSummary').innerHTML =
    `<div class="card stat"><p>Today's Expenses</p><p>${npr(stats().exp)}</p></div>
     <div class="card stat"><p>This Month's Expenses</p><p>${npr(sum(db.expenses.filter(e => e.date.startsWith(month)), 'amount'))}</p></div>`;
  const rows = [...db.expenses].sort((a, b) => b.date.localeCompare(a.date));
  $('#expList').innerHTML = rows.length ? table(['Date', 'Category', 'Description', 'Amount', 'Payment Method', ''], rows.map(e => [
    dateLabel(e.date), esc(e.cat), esc(e.desc), npr(e.amount), esc(e.pay),
    `<div class="acts"><button class="btn sm danger" data-act="del-expense" data-id="${e.id}">Delete</button></div>`]))
    : empty('No expenses recorded', 'Add rent, bills or transport to see your real profit.', '<button class="btn primary" data-act="add-expense">+ Add Expense</button>');
}

function renderCustomers() {
  $('#custList').innerHTML = db.customers.length ? table(['Customer Name', 'Phone', 'Total Purchases', 'Last Purchase', 'Status', ''], db.customers.map(c => [
    esc(c.name), esc(c.phone || '—'), npr(c.total), dateLabel(c.last), `<span class="tag ${c.status === 'New' ? 'low' : 'ok'}">${c.status}</span>`,
    `<div class="acts"><button class="btn sm" data-act="view-customer" data-id="${c.id}">View</button>${c.id === 'c0' ? '' : `<button class="btn sm" data-act="edit-customer" data-id="${c.id}">Edit</button>`}</div>`]))
    : empty('No customers added', 'Add the people who shop with you to see their history.', '<button class="btn primary" data-act="add-customer">+ Add Customer</button>');
}

function repDays() {
  const month = dayISO(0).slice(0, 7), t = stats();
  const days = db.history.filter(h => rep.range === '7' || h.date.startsWith(month))
    .map(h => ({ ...h, exp: sum(db.expenses.filter(e => e.date === h.date), 'amount') }));
  return [...days, { date: dayISO(0), sales: t.sales, profit: t.profit, tx: t.tx, exp: t.exp }];
}
function renderReports() {
  const days = repDays();
  $$('#repTabs .pill').forEach(b => { const on = b.dataset.tab === rep.tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  $('#repStats').innerHTML = [['Total Sales', npr(sum(days, 'sales'))], ['Total Profit', npr(sum(days, 'profit'))], ['Total Expenses', npr(sum(days, 'exp'))], ['Transactions', sum(days, 'tx')]]
    .map(([l, v]) => `<div class="card stat"><p>${l}</p><p>${v}</p></div>`).join('');
  if (rep.tab !== 'products') {
    const key = { sales: 'sales', profit: 'profit', expenses: 'exp' }[rep.tab];
    const label = d => rep.range === '7' ? weekday(d.date) : +d.date.slice(8);
    $('#repBody').innerHTML = `<div class="card"><div class="card-head"><h2>${rep.tab[0].toUpperCase() + rep.tab.slice(1)} trend</h2></div>${chartHtml(days.map((d, i) => ({ l: label(d), v: Math.max(d[key], 0), now: i === days.length - 1 })))}</div>`;
    return;
  }
  const agg = {};
  Object.entries(db.pastTop).forEach(([n, [q, a]]) => agg[n] = { q, a });
  db.sales.forEach(s => { const x = agg[s.name] || (agg[s.name] = { q: 0, a: 0 }); x.q += s.qty; x.a += s.amount; });
  const top = Object.entries(agg).sort((a, b) => b[1].a - a[1].a).slice(0, 5);
  const cats = {};
  Object.entries(agg).forEach(([n, x]) => { const c = (db.products.find(p => p.name === n) || { cat: 'Other' }).cat; cats[c] = (cats[c] || 0) + x.a; });
  const best = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
  $('#repBody').innerHTML = `<div class="rep-grid"><div class="card"><h2>Top-selling products</h2><ol class="top-list">${top.map(([n, x]) =>
    `<li><div class="row"><b>${esc(n)}</b><span>${npr(x.a)}</span></div><div class="meter" aria-hidden="true"><i style="width:${Math.round(x.a / top[0][1].a * 100)}%"></i></div><span class="small muted">${x.q} sold</span></li>`).join('')}</ol></div>
    <div class="card"><h2>Best-performing category</h2><div class="best"><strong>${esc(best[0])}</strong><span class="muted">${npr(best[1])} in sales</span></div></div></div>`;
}

function renderSettings() {
  const s = db.shop;
  $('#sname').value = s.name; $('#sowner').value = s.owner; $('#splace').value = s.place; $('#stype').value = s.type;
  $('#lowAt').value = s.lowAt; $('#alertsOn').checked = s.alerts;
}
const renderAll = () => { renderChrome(); renderDashboard(); renderSales(); renderInventory(); renderExpenses(); renderCustomers(); renderReports(); };

/* =====================================================================
   5. NAVIGATION, MENUS, THEME
   ===================================================================== */
function show(v) {
  if (!NAV.some(n => n[0] === v)) v = 'dashboard';
  $$('.view').forEach(s => s.hidden = s.id !== 'view-' + v);
  $$('.nav-item[data-view]').forEach(a => {
    const on = a.dataset.view === v || (a.dataset.view === 'more' && ['customers', 'reports', 'settings'].includes(v));
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  if (v === 'settings') renderSettings();
  closePops(); window.scrollTo(0, 0);
  $(`#view-${v} h1`).focus({ preventScroll: true });
}
function go(v) { location.hash === '#' + v ? show(v) : (location.hash = v); }
function closePops() {
  $$('.pop').forEach(p => p.hidden = true);
  $$('.pop-wrap > button').forEach(b => b.setAttribute('aria-expanded', 'false'));
}
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#themeSel').value = t;
  $('#themeBtn').textContent = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

/* =====================================================================
   6. ACTIONS (buttons use data-act="name")
   ===================================================================== */
function cartAdd(id) {
  const p = db.products.find(x => x.id === id), c = cart.find(x => x.pid === id);
  if (c) { if (c.qty >= p.stock) return toast(`Only ${p.stock} ${p.name} in stock.`, 'warn'); c.qty++; }
  else cart.push({ pid: id, qty: 1 });
  $('#saleErr').textContent = ''; renderCart();
}
function openProduct(id) {
  const p = id && db.products.find(x => x.id === id), f = $('#productForm');
  f.reset(); clearErrs(f);
  $('#productTitle').textContent = p ? 'Edit product' : 'Add product';
  if (p) { f.pid.value = p.id; f.pname.value = p.name; f.pcat.value = p.cat; f.pprice.value = p.price; f.pcost.value = p.cost; f.pstock.value = p.stock; }
  $('#productDlg').showModal();
}
function openExpense() {
  const f = $('#expenseForm'); f.reset(); clearErrs(f);
  f.edate.value = f.edate.max = dayISO(0);
  $('#expenseDlg').showModal();
}
function openCustomer(id) {
  const c = id && db.customers.find(x => x.id === id), f = $('#customerForm');
  f.reset(); clearErrs(f);
  $('#customerTitle').textContent = c ? 'Edit customer' : 'Add customer';
  if (c) { f.cid.value = c.id; f.cname.value = c.name; f.cphone.value = c.phone; }
  $('#customerDlg').showModal();
}

const A = {
  'add-sale': () => { go('sales'); $('#saleSearch').focus(); },
  'add-product': () => openProduct(),
  'add-expense': () => openExpense(),
  'add-customer': () => openCustomer(),
  'inv-filter': t => { inv.f = t.dataset.f; inv.q = ''; $('#invSearch').value = ''; renderInventory(); go('inventory'); },
  filter: t => { inv.f = t.dataset.f; renderInventory(); },
  'edit-product': t => openProduct(t.dataset.id),
  'del-product': t => {
    const p = db.products.find(x => x.id === t.dataset.id);
    ask({ title: 'Delete this product?', text: `${p.name} will be removed from your inventory.`, ok: 'Delete', onOk: () => {
      api.remove('products', p.id); cart = cart.filter(c => c.pid !== p.id); toast('Product deleted'); renderAll();
    } });
  },
  'del-expense': t => ask({ title: 'Delete this expense?', text: 'Your profit numbers will update.', ok: 'Delete', onOk: () => { api.remove('expenses', t.dataset.id); toast('Expense deleted'); renderAll(); } }),
  'cart-add': t => cartAdd(t.dataset.id),
  qty: t => {
    const id = t.dataset.id, d = +t.dataset.d, c = cart.find(x => x.pid === id);
    if (d > 0) cartAdd(id); else { c.qty--; if (c.qty < 1) cart = cart.filter(x => x !== c); renderCart(); }
    $(`#cart [data-act="qty"][data-id="${id}"][data-d="${d}"]`)?.focus();
  },
  'cart-del': t => { cart = cart.filter(c => c.pid !== t.dataset.id); renderCart(); },
  'view-customer': t => {
    const c = db.customers.find(x => x.id === t.dataset.id);
    ask({ title: c.name, text: `Phone: ${c.phone || 'Not added'}\nTotal purchases: ${npr(c.total)}\nLast purchase: ${dateLabel(c.last)}`, ok: 'Close', cancel: false });
  },
  'edit-customer': t => openCustomer(t.dataset.id),
  'rep-tab': t => { rep.tab = t.dataset.tab; renderReports(); },
  range: t => { rep.range = t.dataset.r; $('#repRange').value = rep.range; renderReports(); go('reports'); },
  theme: () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'),
  future: t => toast(`${t.dataset.name} is coming soon.`, 'warn'),
  more: () => $('#moreDlg').showModal()
};

document.addEventListener('click', e => {
  const b = e.target.closest('.pop-wrap > button');           // open/close dropdowns
  const wasHidden = b && b.nextElementSibling.hidden;
  closePops();
  if (b && wasHidden) { b.nextElementSibling.hidden = false; b.setAttribute('aria-expanded', 'true'); }
  const c = e.target.closest('[data-close]');
  if (c && c.closest('dialog')) { c.closest('dialog').close(); return; }
  const t = e.target.closest('[data-act]');
  if (t && A[t.dataset.act]) A[t.dataset.act](t);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePops(); });
$$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));   // backdrop click
$('#askOk').addEventListener('click', () => { const cb = askCb; $('#askDlg').close(); if (cb) cb(); });

/* ---- Search ---- */
$('#globalSearch').addEventListener('input', e => {
  inv.q = e.target.value; inv.f = 'all'; $('#invSearch').value = inv.q; renderInventory();
  if (location.hash !== '#inventory') go('inventory');
});
$('#invSearch').addEventListener('input', e => { inv.q = e.target.value; $('#globalSearch').value = inv.q; renderInventory(); });
$('#saleSearch').addEventListener('input', renderSales);
$('#repRange').addEventListener('change', e => { rep.range = e.target.value; renderReports(); });

/* ---- Complete sale ---- */
$('#saleForm').addEventListener('submit', e => {
  e.preventDefault();
  const pay = ($('input[name=pay]:checked') || {}).value;
  const short = cart.find(c => db.products.find(p => p.id === c.pid).stock < c.qty);
  $('#saleErr').textContent = !cart.length ? 'Add at least one product to complete the sale.'
    : short ? `Not enough stock for ${db.products.find(p => p.id === short.pid).name}.` : '';
  $('#payErr').textContent = pay ? '' : 'Please select a payment method.';
  if (!cart.length || short || !pay) return;
  const tx = uid('t'), time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const cust = $('#saleCust').value, total = cart.reduce((t, c) => t + db.products.find(p => p.id === c.pid).price * c.qty, 0);
  cart.forEach(c => {
    const p = db.products.find(x => x.id === c.pid);
    api.add('sales', { id: uid('s'), tx, pid: p.id, name: p.name, cat: p.cat, qty: c.qty, amount: p.price * c.qty, profit: (p.price - p.cost) * c.qty, time, pay, cust, status: 'Completed' });
    api.update('products', p.id, { stock: p.stock - c.qty });
  });
  const cu = db.customers.find(x => x.id === (cust || 'c0'));
  api.update('customers', cu.id, { total: cu.total + total, last: dayISO(0) });
  cart = []; e.target.reset(); $('#payErr').textContent = '';
  toast(`Sale completed: ${npr(total)}`); renderAll();
});

/* ---- Product / expense / customer forms ---- */
$('#productForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, v = n => f.elements[n].value.trim(), st = v('pstock'), price = +v('pprice');
  const stMsg = st === '' ? 'Enter how many are in stock.' : +st < 0 ? 'Quantity cannot be negative.' : !Number.isInteger(+st) ? 'Use a whole number.' : '';
  const ok = [
    setErr(f, 'pname', v('pname') ? '' : 'Product name is required.'),
    setErr(f, 'pprice', price > 0 ? '' : 'Price must be greater than zero.'),
    setErr(f, 'pcost', +v('pcost') < 0 ? 'Cost cannot be negative.' : ''),
    setErr(f, 'pstock', stMsg)
  ];
  if (!ok.every(Boolean)) return;
  const row = { name: v('pname'), cat: v('pcat') || f.pcat.value, price, cost: v('pcost') === '' ? Math.round(price * 0.75) : +v('pcost'), stock: +st };
  if (v('pid')) { api.update('products', v('pid'), row); toast('Product updated'); }
  else { api.add('products', { id: uid('p'), ...row }); toast('Product added'); }
  $('#productDlg').close(); renderAll();
});
$('#expenseForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, v = n => f.elements[n].value.trim();
  if (![setErr(f, 'eamt', +v('eamt') > 0 ? '' : 'Amount must be greater than zero.'), setErr(f, 'edate', v('edate') ? '' : 'Choose a date.')].every(Boolean)) return;
  api.add('expenses', { id: uid('e'), date: v('edate'), cat: f.ecat.value, desc: v('edesc') || f.ecat.value, amount: +v('eamt'), pay: f.epay.value });
  $('#expenseDlg').close(); toast('Expense recorded'); renderAll();
});
$('#customerForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, v = n => f.elements[n].value.trim();
  const ok = [setErr(f, 'cname', v('cname') ? '' : 'Customer name is required.'),
    setErr(f, 'cphone', !v('cphone') || /^\+?[\d\s-]{7,15}$/.test(v('cphone')) ? '' : 'Enter a valid phone number.')];
  if (!ok.every(Boolean)) return;
  if (v('cid')) { api.update('customers', v('cid'), { name: v('cname'), phone: v('cphone') }); toast('Customer updated'); }
  else { api.add('customers', { id: uid('c'), name: v('cname'), phone: v('cphone'), total: 0, last: '', status: 'New' }); toast('Customer added'); }
  $('#customerDlg').close(); renderAll();
});

/* ---- Settings ---- */
$('#bizForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, v = n => f.elements[n].value.trim();
  if (![setErr(f, 'sname', v('sname') ? '' : 'Business name is required.'), setErr(f, 'sowner', v('sowner') ? '' : 'Owner name is required.')].every(Boolean)) return;
  Object.assign(db.shop, { name: v('sname'), owner: v('sowner'), first: v('sowner').split(' ')[0], place: v('splace'), type: f.stype.value });
  toast('Settings saved'); renderAll();
});
$('#lowAt').addEventListener('change', e => { const n = Math.floor(+e.target.value); if (n >= 1) { db.shop.lowAt = n; renderAll(); toast('Low-stock level updated'); } else e.target.value = db.shop.lowAt; });
$('#alertsOn').addEventListener('change', e => { db.shop.alerts = e.target.checked; renderAll(); });
$('#themeSel').addEventListener('change', e => setTheme(e.target.value));

/* =====================================================================
   7. START
   ===================================================================== */
function init() {
  const link = ([v, l]) => `<a class="nav-item" href="#${v}" data-view="${v}">${ico(v)}<span>${l}</span></a>`;
  $('#sideNav').innerHTML = NAV.map(link).join('');
  $('#bottomNav').innerHTML = [['dashboard', 'Home'], ['sales', 'Sales'], ['inventory', 'Inventory'], ['expenses', 'Expenses']].map(link).join('')
    + `<button class="nav-item" data-act="more" data-view="more">${ico('more')}<span>More</span></button>`;
  $('#moreList').innerHTML = NAV.slice(4).map(link).join('').replaceAll('<a ', '<a data-close ');
  const opts = a => a.map(x => `<option>${x}</option>`).join('');
  $('#pcat').innerHTML = opts(CATS); $('#ecat').innerHTML = opts(EXP_CATS); $('#epay').innerHTML = opts(PAY); $('#stype').innerHTML = opts(BIZ_TYPES);
  $('#payOpts').innerHTML = PAY.map(p => `<label><input type="radio" name="pay" value="${p}"><span>${p}</span></label>`).join('');
  setTheme('light');
  renderAll();
  show(location.hash.slice(1));
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
}
init();
