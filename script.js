// بيانات المنتجات الأساسية
const productData = [
  {
    id: 'sub-1',
    title: 'غواصة استكشافية نموذجية',
    price: 2.5,
    displayPrice: 'ريالين ونص (2.5 ر.س)',
    qty: 1
  },
  {
    id: 'sub-2',
    title: 'غواصة عرض ثانية',
    price: 2.5,
    displayPrice: 'ريالين ونص (2.5 ر.س)',
    qty: 1
  },
  {
    id: 'sub-gtav',
    title: 'غواصة قراند',
    price: 2.5,
    displayPrice: 'ريالين ونص (2.5 ر.س)',
    qty: 1
  }
];

let cart = [];

// تهيئة من localStorage إن وُجد
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('subCart');
  if (saved) cart = JSON.parse(saved);
  updateCartCount();
});

// تغيير الصورة الرئيسية عند اختيار صورة مصغّرة
function setMainImage(mainId, src){
  document.getElementById(mainId).src = src;
}

// إضافة منتج للعربة
function addToCart(product){
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({...product});
  }
  saveCart();
  updateCartCount();
  alert(product.title + ' تمت إضافتها إلى السلة.');
}

// حفظ العربة محلياً
function saveCart(){
  localStorage.setItem('subCart', JSON.stringify(cart));
}

// تحديث عداد العربة
function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartCount').textContent = count;
}

// عرض العربة
document.getElementById('cartBtn').addEventListener('click', openCart);
function openCart(){
  renderCart();
  document.getElementById('cartModal').classList.remove('hidden');
}
function closeCart(){
  document.getElementById('cartModal').classList.add('hidden');
}

// عرض عناصر العربة داخل المودال
function renderCart(){
  const container = document.getElementById('cartItems');
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p style="color:var(--muted)">سلة الشراء فارغة.</p>';
    return;
  }
  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.style.padding = '8px';
    el.style.borderBottom = '1px solid rgba(255,255,255,0.02)';
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <strong>${item.title}</strong><br/>
          <small style="color:var(--muted)">${item.displayPrice}</small>
        </div>
        <div style="text-align:left">
          <button class="btn" onclick="decreaseQty('${item.id}')">-</button>
          <span style="margin:0 8px">${item.qty}</span>
          <button class="btn" onclick="increaseQty('${item.id}')">+</button>
          <button class="btn" style="margin-left:8px" onclick="removeItem('${item.id}')">حذف</button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

// تعديل الكمية
function increaseQty(id){
  const it = cart.find(i=>i.id===id);
  if (it) it.qty++;
  saveCart(); renderCart(); updateCartCount();
}
function decreaseQty(id){
  const it = cart.find(i=>i.id===id);
  if (it){
    it.qty = Math.max(1, it.qty-1);
    saveCart(); renderCart(); updateCartCount();
  }
}
function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart(); renderCart(); updateCartCount();
}

// عملية الدفع / تواصل — نعرض نافذة تطلب التواصل الخاص كما طلبت
function checkout(){
  closeCart();
  showContactPrompt();
}

// نافذة التواصل — تعرض رسالة جاهزة للنسخ
function showContactPrompt(){
  document.getElementById('contactModal').classList.remove('hidden');
}
function closeContact(){
  document.getElementById('contactModal').classList.add('hidden');
}

// نسخ رسالة التواصل للحافظة
function copyContactMessage(){
  const ta = document.getElementById('contactMessage');
  ta.select();
  ta.setSelectionRange(0, 99999); // for mobile
  try {
    document.execCommand('copy');
    alert('تم نسخ نص التواصل. أرسلها للبائع على الخاص.');
  } catch (e) {
    alert('نسخ غير مدعوم في متصفحك. انسخ النص يدوياً.');
  }
}