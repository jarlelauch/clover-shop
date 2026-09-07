const products = [
  { id: 1, name: "Clover Tote Bag — Sage", category: "aksesoris", badge: "BEST SELLER", price: "???", rating: 4.9, reviews: 312, img: "👜" },
  { id: 2, name: "Oversized Tee — Moss", category: "apparel", badge: "NEW", price: "???", rating: 4.8, reviews: 128, img: "👕" },
  { id: 3, name: "Lucky Cap — Forest", category: "aksesoris", badge: null, price: "???", rating: 4.7, reviews: 89, img: "🧢" },
  { id: 4, name: "Aroma Diffuser — Clover Field", category: "home", badge: "LIMITED", price: "???", rating: 4.9, reviews: 203, img: "🌿" },
  { id: 5, name: "Hoodie Boxy — Clover Cream", category: "apparel", badge: "HOT", price: "???", rating: 4.8, reviews: 156, img: "🧥" },
  { id: 6, name: "Scented Candle — Morning Dew", category: "home", badge: null, price: "???", rating: 4.6, reviews: 67, img: "🕯️" },
  { id: 7, name: "Mini Sling Bag — Olive", category: "aksesoris", badge: null, price: "???", rating: 4.8, reviews: 94, img: "👝" },
  { id: 8, name: "Linen Shirt — Sage Green", category: "apparel", badge: "NEW", price: "???", rating: 4.9, reviews: 44, img: "👔" },
];

let cart = [];
let wishlist = new Set();
let activeCat = "all";
let searchQ = "";

const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const searchInputMobile = document.getElementById("searchInputMobile");
const sortSelect = document.getElementById("sortSelect");

function renderProducts() {
  let list = [...products];
  if (activeCat !== "all") list = list.filter(p => p.category === activeCat);
  if (searchQ) {
    const q = searchQ.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }
  const sort = sortSelect.value;
  if (sort === "newest") list = list.reverse();
  // price sorting is moot because ??? but keep deterministic shuffle for demo
  if (sort === "price-asc") list.sort((a,b)=> a.id - b.id);
  if (sort === "price-desc") list.sort((a,b)=> b.id - a.id);

  grid.innerHTML = "";
  if (list.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");
  list.forEach(p => {
    const inWishlist = wishlist.has(p.id);
    const el = document.createElement("div");
    el.className = "bg-white rounded-[20px] border border-zinc-200 overflow-hidden group hover:border-clover-200 hover:shadow-lg transition flex flex-col";
    el.innerHTML = `
      <div class="relative bg-[#f6f7f5] h-[190px] sm:h-[210px] flex items-center justify-center overflow-hidden">
        ${p.badge ? `<span class="absolute top-3 left-3 text-[10px] font-bold tracking-widest bg-white border border-zinc-200 rounded-full px-2.5 py-1">${p.badge}</span>` : ``}
        <button onclick="toggleWishlist(${p.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:border-clover-300 ${inWishlist ? 'text-red-500 border-red-200 bg-red-50' : 'text-zinc-400'}">
          ${inWishlist ? '♥' : '♡'}
        </button>
        <div class="w-[120px] h-[120px] bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-4xl group-hover:scale-105 transition duration-300">${p.img}</div>
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span class="bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-xs flex items-center gap-1 border border-zinc-200"><span class="text-amber-400">★</span> ${p.rating} <span class="text-zinc-400">(${p.reviews})</span></span>
          <span class="bg-clover-700 text-white rounded-full px-2.5 py-1 text-[11px] font-semibold hidden sm:inline">Gratis ongkir</span>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-1">
        <div class="text-xs tracking-widest text-zinc-400 font-semibold">${p.category.toUpperCase()}</div>
        <div class="font-semibold text-sm leading-tight mt-1 line-clamp-2">${p.name}</div>
        <div class="flex items-baseline gap-2 mt-2">
          <span class="font-bold text-[15px]">Rp ${p.price}</span>
          <span class="text-xs text-zinc-400 line-through">Rp ???</span>
          <span class="ml-auto text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">??% OFF</span>
        </div>
        <div class="flex gap-2 mt-3">
          <button onclick="addToCart(${p.id})" class="flex-1 bg-zinc-900 text-white rounded-full py-2.5 text-sm font-medium hover:bg-black transition">+ Keranjang</button>
          <button onclick="toast('Detail produk akan dilengkapi — harga masih ??? ☘️')" class="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:border-clover-300">👁</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function addToCart(id) {
  const prod = products.find(p => p.id === id);
  const found = cart.find(c => c.id === id);
  if (found) found.qty += 1;
  else cart.push({ ...prod, qty: 1 });
  updateCartUI();
  toast(`${prod.name} ditambahkan ke keranjang`);
  openCartDrawer();
}

function updateCartUI() {
  const count = cart.reduce((s,c)=> s+c.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartSub").textContent = `${count} item`;
  const cartItems = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartEmpty = document.getElementById("cartEmpty");

  if (count === 0) {
    cartEmpty.style.display = "block";
    cartFooter.classList.add("hidden");
    // remove old items
    [...cartItems.querySelectorAll(".cart-row")].forEach(n=>n.remove());
    updateWishlistUI();
    return;
  }
  cartEmpty.style.display = "none";
  cartFooter.classList.remove("hidden");
  // clear rows
  [...cartItems.querySelectorAll(".cart-row")].forEach(n=>n.remove());
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-row bg-zinc-50 border border-zinc-200 rounded-2xl p-3 flex gap-3 items-center";
    row.innerHTML = `
      <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl border border-zinc-100 shrink-0">${item.img}</div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium leading-tight truncate">${item.name}</div>
        <div class="text-xs text-zinc-500">Rp ??? × ${item.qty}</div>
        <div class="flex items-center gap-2 mt-1">
          <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 rounded-full border border-zinc-200 bg-white flex items-center justify-center">−</button>
          <span class="text-sm font-semibold w-6 text-center">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${item.id})" class="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500">✕</button>
    `;
    cartItems.appendChild(row);
  });
  document.getElementById("cartSubtotal").textContent = `Rp ???`;
  document.getElementById("cartTotal").textContent = `Rp ???`;
  updateWishlistUI();
}

function changeQty(id, delta) {
  const it = cart.find(c=>c.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart = cart.filter(c=>c.id!==id);
  updateCartUI();
}
function removeFromCart(id){ cart = cart.filter(c=>c.id!==id); updateCartUI(); }

function toggleWishlist(id){
  if(wishlist.has(id)) wishlist.delete(id);
  else wishlist.add(id);
  renderProducts();
  updateWishlistUI();
  toast(wishlist.has(id) ? "Ditambahkan ke wishlist ♥" : "Dihapus dari wishlist");
}
function updateWishlistUI(){
  const n = wishlist.size;
  const el = document.getElementById("wishlistCount");
  if(n>0){ el.textContent=n; el.classList.remove("hidden"); el.classList.add("flex"); }
  else { el.classList.add("hidden"); el.classList.remove("flex"); }
}

function toast(msg){
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.remove("hidden");
  t.classList.add("flex");
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>{ t.classList.add("hidden"); t.classList.remove("flex"); }, 2200);
}

// Drawer
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");
function openCartDrawer(){ drawer.classList.remove("translate-x-full"); overlay.classList.remove("hidden"); }
function closeCartDrawer(){ drawer.classList.add("translate-x-full"); overlay.classList.add("hidden"); }
document.getElementById("cartBtn").addEventListener("click", openCartDrawer);
document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

// Mobile menu
document.getElementById("mobileMenuBtn").addEventListener("click", ()=>{
  document.getElementById("mobileMenu").classList.toggle("hidden");
});

// Search & filter
function bindSearch(inp){
  if(!inp) return;
  inp.addEventListener("input", e=>{ searchQ = e.target.value; renderProducts(); });
}
bindSearch(searchInput);
bindSearch(searchInputMobile);
sortSelect.addEventListener("change", renderProducts);
document.querySelectorAll(".cat-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".cat-btn").forEach(b=>{
      b.classList.remove("bg-clover-700","text-white");
      b.classList.add("bg-white","border","border-zinc-200","text-zinc-900");
    });
    btn.classList.remove("bg-white","border","border-zinc-200","text-zinc-900");
    btn.classList.add("bg-clover-700","text-white");
    activeCat = btn.dataset.cat;
    renderProducts();
  });
});

// Newsletter
document.getElementById("newsletterForm").addEventListener("submit", e=>{
  e.preventDefault();
  toast("Yeay! Kamu terdaftar — voucher 10% akan dikirim ke email ☘️");
  e.target.reset();
});

// Wishlist btn opens toast
document.getElementById("wishlistBtn").addEventListener("click", ()=>{
  if(wishlist.size===0) toast("Wishlist masih kosong — yuk tambahkan produk!");
  else toast(`Kamu punya ${wishlist.size} item di wishlist`);
});

// Countdown dummy
setInterval(()=>{
  const el = document.getElementById("countdown");
  if(!el) return;
  // simple tick
  const spans = el.querySelectorAll("span");
  let s = parseInt(spans[2].textContent);
  s = (s - 1 + 60) % 60;
  spans[2].textContent = String(s).padStart(2,"0");
}, 1000);

// init
renderProducts();
updateCartUI();
