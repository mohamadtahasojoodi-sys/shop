const PASSWORD = 'arian1404'; // رمز را اینجا عوض کنید
let products = [];

async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
  renderList();
}

function login() {
  const pass = document.getElementById('password').value;
  if (pass === PASSWORD) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    sessionStorage.setItem('logged', '1');
    loadProducts();
  } else {
    document.getElementById('loginError').textContent = 'رمز اشتباه است';
  }
}

function logout() {
  sessionStorage.removeItem('logged');
  location.reload();
}

if (sessionStorage.getItem('logged') === '1') {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('panel').style.display = 'block';
  loadProducts();
}

function renderList() {
  document.getElementById('productList').innerHTML = products.map(p => `
    <div class="product-row">
      <img src="${p.image}" alt="">
      <div class="product-row-info">
        <strong>${p.name}</strong>
        <span>${p.category} — ${p.price.toLocaleString('fa-IR')} تومان</span>
      </div>
      <button class="btn btn-secondary" onclick="editProduct(${p.id})">ویرایش</button>
      <button class="btn btn-danger" onclick="deleteProduct(${p.id})">حذف</button>
    </div>
  `).join('');
}

function saveProduct() {
  const id = document.getElementById('editId').value;
  const data = {
    name: document.getElementById('f-name').value.trim(),
    category: document.getElementById('f-category').value.trim(),
    price: Number(document.getElementById('f-price').value),
    image: document.getElementById('f-image').value.trim(),
    description: document.getElementById('f-desc').value.trim(),
  };

  if (!data.name || !data.price) {
    alert('نام و قیمت را پر کنید');
    return;
  }

  if (id) {
    const idx = products.findIndex(p => p.id === Number(id));
    products[idx] = { ...products[idx], ...data };
  } else {
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, ...data });
  }

  resetForm();
  renderList();
}

function editProduct(id) {
  const p = products.find(p => p.id === id);
  document.getElementById('editId').value = p.id;
  document.getElementById('f-name').value = p.name;
  document.getElementById('f-category').value = p.category;
  document.getElementById('f-price').value = p.price;
  document.getElementById('f-image').value = p.image;
  document.getElementById('f-desc').value = p.description;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
  if (!confirm('مطمئنید؟')) return;
  products = products.filter(p => p.id !== id);
  renderList();
}

function resetForm() {
  ['editId','f-name','f-category','f-price','f-image','f-desc'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'products.json';
  a.click();
}

function exportToConsole() {
  console.log(JSON.stringify(products, null, 2));
  alert('در کنسول مرورگر (F12) نمایش داده شد');
}