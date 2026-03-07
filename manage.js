/**
 * Manage menu: CRUD with image (file → Data URL).
 */
const ManageMenu = {
  editingId: null,

  init() {
    this.listEl = document.getElementById('manageList');
    this.form = document.getElementById('menuForm');
    this.formTitle = document.getElementById('formTitle');
    this.inputId = document.getElementById('itemId');
    this.inputName = document.getElementById('itemName');
    this.inputPrice = document.getElementById('itemPrice');
    this.inputImageUrl = document.getElementById('itemImageUrl');
    this.inputImage = document.getElementById('itemImage');

    this.form.addEventListener('submit', (e) => this.save(e));
    document.getElementById('btnCancelForm').addEventListener('click', () => this.cancelEdit());
    this.inputImage.addEventListener('change', (e) => this.previewImage(e));

    this.renderList();
  },

  getMenu() {
    return Storage.getMenu();
  },

  renderList() {
    const menu = this.getMenu();
    const svgFallback = (name) => (typeof window !== 'undefined' && window.dataUriSvg) ? window.dataUriSvg(name) : ('data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"><rect fill="#2d5016" width="80" height="60"/><text x="40" y="35" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="12">' + (name || 'Item').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text></svg>'));
    this.listEl.innerHTML = menu.map(item => {
      const fallback = svgFallback(item.name);
      const src = item.imageUrl || fallback;
      return `
      <div class="manage-item" data-id="${item.id}">
        <img src="${src}" alt="${item.name}" data-fallback="${fallback}" onerror="this.onerror=null;this.src=this.dataset.fallback">
        <div>
          <div class="item-name">${item.name}</div>
          <div class="item-price">Rs. ${item.price}</div>
        </div>
        <div class="item-actions">
          <button type="button" class="btn btn-primary" data-action="edit">Edit</button>
          <button type="button" class="btn btn-danger" data-action="delete">Delete</button>
        </div>
      </div>
    `;
    }).join('');

    this.listEl.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.manage-item').dataset.id;
        this.startEdit(id);
      });
    });
    this.listEl.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.manage-item').dataset.id;
        if (confirm('Delete this item?')) this.deleteItem(id);
      });
    });
  },

  startEdit(id) {
    const menu = this.getMenu();
    const item = menu.find(m => m.id === id);
    if (!item) return;
    this.editingId = id;
    this.formTitle.textContent = 'Edit item';
    this.inputId.value = item.id;
    this.inputName.value = item.name;
    this.inputPrice.value = item.price;
    this.inputImage.value = '';
    this.inputImage.dataset.dataUrl = item.imageUrl || '';
    if (this.inputImageUrl) {
      this.inputImageUrl.value = (item.imageUrl && item.imageUrl.startsWith('http')) ? item.imageUrl : '';
    }
  },

  cancelEdit() {
    this.editingId = null;
    this.formTitle.textContent = 'Add item';
    this.form.reset();
    this.inputId.value = '';
    if (this.inputImage) this.inputImage.removeAttribute('data-data-url');
    if (this.inputImageUrl) this.inputImageUrl.value = '';
  },

  save(e) {
    e.preventDefault();
    const name = this.inputName.value.trim();
    const price = parseInt(this.inputPrice.value, 10);
    if (!name || isNaN(price) || price < 1) return;

    let imageUrl = (this.inputImageUrl && this.inputImageUrl.value.trim()) || '';
    const file = this.inputImage && this.inputImage.files && this.inputImage.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imageUrl = reader.result;
        this.doSave(name, price, imageUrl);
      };
      reader.readAsDataURL(file);
    } else {
      if (!imageUrl && this.inputImage && this.inputImage.dataset.dataUrl) {
        imageUrl = this.inputImage.dataset.dataUrl;
      }
      this.doSave(name, price, imageUrl);
    }
  },

  doSave(name, price, imageUrl) {
    let menu = this.getMenu();
    if (this.editingId) {
      const item = menu.find(m => m.id === this.editingId);
      if (item) {
        item.name = name;
        item.price = price;
        if (imageUrl) item.imageUrl = imageUrl;
      }
    } else {
      const id = 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      menu.push({ id, name, price, imageUrl: imageUrl || undefined });
    }
    Storage.setMenu(menu);
    this.cancelEdit();
    this.renderList();
  },

  previewImage(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.inputImage.dataset.dataUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  },

  deleteItem(id) {
    let menu = this.getMenu().filter(m => m.id !== id);
    Storage.setMenu(menu);
    if (this.editingId === id) this.cancelEdit();
    this.renderList();
  }
};
