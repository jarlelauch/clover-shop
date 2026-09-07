const products = [
  { id: 1, name: "Clover Tote — Sage", category: "aksesoris", price: "???", img: "👜", no:"01" },
  { id: 2, name: "Oversized Tee — Moss", category: "apparel", price: "???", img: "👕", no:"02" },
  { id: 3, name: "Lucky Cap — Forest", category: "aksesoris", price: "???", img: "🧢", no:"03" },
  { id: 4, name: "Aroma Diffuser — Field", category: "home", price: "???", img: "🌿", no:"04" },
  { id: 5, name: "Hoodie Boxy — Cream", category: "apparel", price: "???", img: "🧥", no:"05" },
  { id: 6, name: "Scented Candle — Dew", category: "home", price: "???", img: "🕯️", no:"06" },
  { id: 7, name: "Mini Sling — Olive", category: "aksesoris", price: "???", img: "👝", no:"07" },
  { id: 8, name: "Linen Shirt — Sage", category: "apparel", price: "???", img: "👔", no:"08" },
];
let cart=[], wishlist=new Set(), activeCat="all", searchQ="";
const grid=document.getElementById("productGrid"), emptyState=document.getElementById("emptyState"), searchInput=document.getElementById("searchInput"), searchInputMobile=document.getElementById("searchInputMobile"), sortSelect=document.getElementById("sortSelect");
function renderProducts(){
  let list=[...products];
  if(activeCat!=="all") list=list.filter(p=>p.category===activeCat);
  if(searchQ) list=list.filter(p=>p.name.toLowerCase().includes(searchQ.toLowerCase()));
  if(sortSelect.value==="newest") list=list.reverse();
  grid.innerHTML="";
  if(list.length===0){ emptyState.classList.remove("hidden"); return; }
  emptyState.classList.add("hidden");
  list.forEach(p=>{
    const w=wishlist.has(p.id);
    const el=document.createElement("div");
    el.className="bg-white border border-ink/10 flex flex-col group hover:border-ink/20 transition";
    el.innerHTML=`
      <div class="aspect-[4/5] bg-olive-50 border-b border-ink/10 flex items-center justify-center relative">
        <div class="absolute top-2 left-2 font-mono text-[9px] tracking-[0.16em] text-ink/40">${p.no} — ${p.category.toUpperCase()}</div>
        <button onclick="toggleWishlist(${p.id})" class="absolute top-2 right-2 w-7 h-7 border border-ink/10 bg-white flex items-center justify-center text-[12px] ${w?'bg-ink text-paper':''}">${w?'♥':'♡'}</button>
        <div class="w-[110px] h-[110px] bg-paper border border-ink/10 flex items-center justify-center text-3xl">${p.img}</div>
        <div class="absolute bottom-2 left-2 font-hand text-[11px] text-moss">no. ${p.no}</div>
      </div>
      <div class="p-4 flex-1 flex flex-col">
        <div class="font-serif text-[14px] leading-tight">${p.name}</div>
        <div class="font-mono text-[11px] tracking-[0.14em] mt-2">Rp ${p.price} <span class="text-ink/40">• ???</span></div>
        <div class="mt-3 flex gap-2">
          <button onclick="addToCart(${p.id})" class="flex-1 border border-ink bg-ink text-paper py-2 font-mono text-[10px] tracking-[0.14em] uppercase">+ Keranjang</button>
          <button onclick="toast('Detail — harga masih ???')" class="w-9 h-9 border border-ink/15 flex items-center justify-center">↗</button>
        </div>
      </div>`;
    grid.appendChild(el);
  });
}
function addToCart(id){
  // anti spam: batasi klik terlalu cepat
  if(window.__cloverAntiSpam) window.__cloverAntiSpam.markAddToCart();
  const p=products.find(x=>x.id===id);const f=cart.find(c=>c.id===id);if(f)f.qty++;else cart.push({...p,qty:1});updateCartUI();toast(p.name+" ditambahkan");openCartDrawer();
}
function updateCartUI(){const c=cart.reduce((s,x)=>s+x.qty,0);document.getElementById("cartCount").textContent=c;document.getElementById("cartSub").textContent=c+" item";const items=document.getElementById("cartItems"), foot=document.getElementById("cartFooter"), empty=document.getElementById("cartEmpty");if(c===0){empty.style.display="block";foot.classList.add("hidden");[...items.querySelectorAll(".cart-row")].forEach(n=>n.remove());updateWishlistUI();return;}empty.style.display="none";foot.classList.remove("hidden");[...items.querySelectorAll(".cart-row")].forEach(n=>n.remove());cart.forEach(it=>{const r=document.createElement("div");r.className="cart-row border border-ink/10 bg-white p-3 flex gap-3";r.innerHTML=`<div class="w-14 h-14 border border-ink/10 bg-olive-50 flex items-center justify-center">${it.img}</div><div class="flex-1"><div class="font-serif text-sm">${it.name}</div><div class="font-mono text-[11px] text-ink/50">Rp ??? × ${it.qty}</div><div class="flex gap-2 mt-1"><button onclick="changeQty(${it.id},-1)" class="w-6 h-6 border border-ink/15">−</button><span class="font-mono text-xs w-5 text-center">${it.qty}</span><button onclick="changeQty(${it.id},1)" class="w-6 h-6 bg-ink text-paper">+</button></div></div><button onclick="removeFromCart(${it.id})" class="w-7 h-7 border border-ink/10">✕</button>`;items.appendChild(r);});document.getElementById("cartSubtotal").textContent="Rp ???";document.getElementById("cartTotal").textContent="Rp ???";updateWishlistUI();}
function changeQty(id,d){const it=cart.find(c=>c.id===id);if(!it)return;it.qty+=d;if(it.qty<=0)cart=cart.filter(c=>c.id!==id);updateCartUI();}
function removeFromCart(id){cart=cart.filter(c=>c.id!==id);updateCartUI();}
function toggleWishlist(id){if(wishlist.has(id))wishlist.delete(id);else wishlist.add(id);renderProducts();updateWishlistUI();toast(wishlist.has(id)?"Wishlist ♥":"Dihapus");}
function updateWishlistUI(){const n=wishlist.size,el=document.getElementById("wishlistCount");if(n>0){el.textContent=n;el.classList.remove("hidden")}else el.classList.add("hidden")}
function toast(m){const t=document.getElementById("toast");t.textContent=m;t.classList.remove("hidden");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.add("hidden"),2000)}
const drawer=document.getElementById("cartDrawer"), overlay=document.getElementById("cartOverlay");
function openCartDrawer(){drawer.classList.remove("translate-x-full");overlay.classList.remove("hidden")}
function closeCartDrawer(){drawer.classList.add("translate-x-full");overlay.classList.add("hidden")}
document.getElementById("cartBtn").addEventListener("click",openCartDrawer);document.getElementById("closeCart").addEventListener("click",closeCartDrawer);overlay.addEventListener("click",closeCartDrawer);
document.getElementById("mobileMenuBtn").addEventListener("click",()=>document.getElementById("mobileMenu").classList.toggle("hidden"));
function bindSearch(inp){if(!inp)return;inp.addEventListener("input",e=>{let v=e.target.value.replace(/[<>]/g,'').slice(0,40); e.target.value=v; searchQ=v;renderProducts()})}
bindSearch(searchInput);bindSearch(searchInputMobile);
sortSelect.addEventListener("change",renderProducts);
document.querySelectorAll(".cat-btn").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".cat-btn").forEach(x=>{x.classList.remove("bg-ink","text-paper");x.classList.add("bg-paper")});b.classList.remove("bg-paper");b.classList.add("bg-ink","text-paper");activeCat=b.dataset.cat;renderProducts()}));
let lastSubscribe=0;
document.getElementById("newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();
  const now=Date.now();
  if(now - lastSubscribe < 15000){ toast('Tunggu 15 detik sebelum daftar lagi'); return; }
  lastSubscribe=now;
  const email=e.target.querySelector('input[type=email]')?.value || '';
  if(email.length>80 || email.includes('<') || email.includes('>')){ toast('Email tidak valid'); return; }
  toast("Terdaftar — terima kasih"); e.target.reset();
});
document.getElementById("wishlistBtn").addEventListener("click",()=>toast(wishlist.size?`Wishlist ${wishlist.size}`:"Wishlist kosong"));
renderProducts();updateCartUI();
