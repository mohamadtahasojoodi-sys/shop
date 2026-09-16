const WHATSAPP = '989123456789'; // شماره واتساپ با کد کشور

let products = [];
let currentCat = 'all';

async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
  buildFilters();
  render();
}

function buildFilters() {
  const cats = ['all', ...new Set(products.map(p => p.category))];
  const container = document.getElementById('filters');
  container.innerHTML = cats.map(c => `
    <button class="filter-btn ${c === 'all' ? 'active' : ''}" data-cat="${c}">
      ${c === 'all' ? 'همه' : c}
    </button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      render();
    });
  });
}

function render() {
  const list = currentCat === 'all' 
    ? products 
    : products.filter(p => p.category === currentCat);

  document.getElementById('grid').innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-desc">${p.description}</div>
        <div class="card-price">${p.price.toLocaleString('fa-IR')} تومان</div>
        <a class="btn-whatsapp" 
           href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('سلام، درباره ' + p.name + ' سوال داشتم')}"
           target="_blank">
          سفارش در واتساپ
        </a>
      </div>
    </div>
  `).join('');
}

loadProducts();