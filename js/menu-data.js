/**
 * Default menu with images embedded as data URIs – works when opening index.html directly (no hosting).
 * Replace anytime via Manage Menu → Image URL or file upload.
 */
function dataUriSvg(label) {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="#1b4332" width="200" height="150"/><text x="100" y="78" text-anchor="middle" fill="#fefae0" font-family="sans-serif" font-size="22" font-weight="600">' + (label || 'Item').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text></svg>';
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
if (typeof window !== 'undefined') window.dataUriSvg = dataUriSvg;

function svgDataUri(svg) {
  return 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/\s+/g, ' ').trim());
}

var IDLY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"><defs><linearGradient id="plate" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f5f5dc"/><stop offset="100%" style="stop-color:#e8e4d8"/></linearGradient><linearGradient id="idli" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#fff8e7"/><stop offset="100%" style="stop-color:#e8dcc4"/></linearGradient><linearGradient id="chutney" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#8B4513"/><stop offset="100%" style="stop-color:#654321"/></linearGradient></defs><rect width="200" height="150" fill="#faf8f5"/><ellipse cx="100" cy="95" rx="75" ry="25" fill="url(#plate)"/><circle cx="85" cy="80" r="22" fill="url(#idli)"/><circle cx="115" cy="78" r="20" fill="url(#idli)"/><circle cx="100" cy="70" r="18" fill="url(#idli)"/><ellipse cx="100" cy="125" rx="30" ry="8" fill="url(#chutney)"/><text x="100" y="25" text-anchor="middle" fill="#1b4332" font-family="sans-serif" font-size="16" font-weight="700">Idly</text></svg>';
var PUTTU_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"><defs><linearGradient id="puttubg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#fff8e7"/><stop offset="100%" style="stop-color:#e8ddc8"/></linearGradient><linearGradient id="vessel" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#8B7355"/><stop offset="100%" style="stop-color:#6b5344"/></linearGradient></defs><rect width="200" height="150" fill="#faf8f5"/><ellipse cx="100" cy="100" rx="45" ry="15" fill="url(#vessel)"/><rect x="65" y="50" width="70" height="55" rx="8" fill="url(#vessel)"/><circle cx="100" cy="72" r="18" fill="url(#puttubg)"/><circle cx="100" cy="88" r="18" fill="url(#puttubg)"/><circle cx="100" cy="104" r="18" fill="url(#puttubg)"/><text x="100" y="28" text-anchor="middle" fill="#1b4332" font-family="sans-serif" font-size="16" font-weight="700">Puttu</text></svg>';
var POORI_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"><defs><linearGradient id="poorig" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#daa520"/><stop offset="100%" style="stop-color:#b8860b"/></linearGradient><linearGradient id="curry" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#cd853f"/><stop offset="100%" style="stop-color:#8b4513"/></linearGradient></defs><rect width="200" height="150" fill="#faf8f5"/><ellipse cx="100" cy="95" rx="75" ry="25" fill="#f5f5dc"/><circle cx="70" cy="85" r="28" fill="url(#poorig)"/><circle cx="130" cy="82" r="26" fill="url(#poorig)"/><circle cx="100" cy="88" r="25" fill="url(#poorig)"/><ellipse cx="100" cy="120" rx="35" ry="12" fill="url(#curry)"/><text x="100" y="25" text-anchor="middle" fill="#1b4332" font-family="sans-serif" font-size="16" font-weight="700">Poori</text></svg>';
var COFFEE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"><defs><linearGradient id="coffeeg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#6f4e37"/><stop offset="100%" style="stop-color:#3e2723"/></linearGradient><linearGradient id="steel" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#c0c0c0"/><stop offset="100%" style="stop-color:#808080"/></linearGradient><linearGradient id="foam" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#8B4513"/><stop offset="100%" style="stop-color:#654321"/></linearGradient></defs><rect width="200" height="150" fill="#faf8f5"/><ellipse cx="100" cy="95" rx="40" ry="12" fill="url(#steel)"/><path d="M65 95 L65 55 Q65 45 75 42 L125 42 Q135 45 135 55 L135 95" fill="url(#steel)" stroke="#a0a0a0" stroke-width="1"/><ellipse cx="100" cy="52" rx="28" ry="8" fill="url(#coffeeg)"/><ellipse cx="100" cy="48" rx="22" ry="5" fill="url(#foam)"/><text x="100" y="28" text-anchor="middle" fill="#1b4332" font-family="sans-serif" font-size="16" font-weight="700">Coffee</text></svg>';
var DOSAI_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"><defs><linearGradient id="dosa" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#daa520"/><stop offset="100%" style="stop-color:#b8860b"/></linearGradient><linearGradient id="sambar" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#cd853f"/><stop offset="100%" style="stop-color:#8b4513"/></linearGradient></defs><rect width="200" height="150" fill="#faf8f5"/><ellipse cx="100" cy="98" rx="78" ry="26" fill="#f5f5dc"/><path d="M40 85 Q50 70 75 72 Q100 74 125 72 Q150 70 160 85 Q165 95 160 105 Q150 118 100 118 Q50 118 40 105 Q35 95 40 85" fill="url(#dosa)" stroke="#b8860b" stroke-width="1"/><ellipse cx="100" cy="128" rx="40" ry="10" fill="url(#sambar)"/><circle cx="100" cy="100" r="15" fill="#8B4513"/><text x="100" y="25" text-anchor="middle" fill="#1b4332" font-family="sans-serif" font-size="16" font-weight="700">Dosai</text></svg>';
var PAROTTA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"><defs><linearGradient id="parottag" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f4d03f"/><stop offset="100%" style="stop-color:#d4a017"/></linearGradient></defs><rect width="200" height="150" fill="#faf8f5"/><ellipse cx="100" cy="95" rx="75" ry="25" fill="#f5f5dc"/><path d="M55 75 Q75 65 100 72 Q125 80 145 75 Q155 82 148 92 Q138 105 100 108 Q62 105 52 92 Q45 82 55 75" fill="url(#parottag)" stroke="#b8860b" stroke-width="1"/><path d="M70 85 Q90 78 100 82 Q110 86 130 82" fill="none" stroke="rgba(184,134,11,0.4)" stroke-width="2"/><text x="100" y="25" text-anchor="middle" fill="#1b4332" font-family="sans-serif" font-size="16" font-weight="700">Parotta</text></svg>';
var PAZHAMPORI_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="200" height="150"><defs><linearGradient id="fritter" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#daa520"/><stop offset="100%" style="stop-color:#8b6914"/></linearGradient></defs><rect width="200" height="150" fill="#faf8f5"/><ellipse cx="100" cy="98" rx="75" ry="26" fill="#f5f5dc"/><ellipse cx="75" cy="90" rx="22" ry="14" fill="url(#fritter)"/><ellipse cx="100" cy="92" rx="24" ry="15" fill="url(#fritter)"/><ellipse cx="125" cy="88" rx="20" ry="13" fill="url(#fritter)"/><text x="100" y="25" text-anchor="middle" fill="#1b4332" font-family="sans-serif" font-size="14" font-weight="700">Pazhampori</text></svg>';

var DEFAULT_MENU = [
  { id: 'idly',       name: 'Idly',       price: 30, imageUrl: 'images/idly.png' },
  { id: 'puttu',      name: 'Puttu',      price: 40, imageUrl: 'images/puttu.jpg' },
  { id: 'poori',      name: 'Poori',      price: 35, imageUrl: 'images/poori.jpg' },
  { id: 'coffee',     name: 'Coffee',     price: 20, imageUrl: 'images/coffee.jpg' },
  { id: 'dosai',      name: 'Dosai',      price: 45, imageUrl: 'images/dosai.jpg' },
  { id: 'parotta',    name: 'Parotta',    price: 25, imageUrl: 'images/parotta.jpg' },
  { id: 'pazhampori', name: 'Pazhampori', price: 30, imageUrl: 'images/pazhampori.jpg' }
];

var MENU_VERSION = 4;

function seedMenuIfEmpty() {
  if (typeof Storage === 'undefined') return;
  var version = parseInt(localStorage.getItem('restaurant_menu_version') || '0', 10);
  var menu = Storage.getMenu();
  var shouldReseed = (version < MENU_VERSION) || !menu || menu.length === 0;
  if (shouldReseed) {
    Storage.setMenu(DEFAULT_MENU.map(function (item) { return { id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl }; }));
    localStorage.setItem('restaurant_menu_version', String(MENU_VERSION));
  }
}
