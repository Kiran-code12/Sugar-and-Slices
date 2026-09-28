/* ===== Sugar and Slices – shared script ===== */

// ---------- Product list (used by cart, customize and checkout) ----------
const PRODUCTS = {
  "chocolate-cake":       { name: "Chocolate Cake",        price: 499, img: "chocolate.jpg",            cat: "cake",   desc: "Rich and delicious chocolate cake." },
  "vanilla-cake":         { name: "Vanilla Cake",          price: 449, img: "vanilla.jpg",              cat: "cake",   desc: "Soft and creamy vanilla cake." },
  "strawberry-cake":      { name: "Strawberry Cake",       price: 549, img: "strawberry.jpg",           cat: "cake",   desc: "Fresh and delicious strawberry cake." },
  "birthday-cake":        { name: "Birthday Cake",         price: 699, img: "birthday.jpg",             cat: "cake",   desc: "Perfect cake for your special day." },
  "blueberry-cheesecake": { name: "Blueberry Cheesecake",  price: 799, img: "blueberry-cheesecake.jpg", cat: "cake",   desc: "Creamy baked cheesecake swirled with blueberry compote." },
  "lotus-biscoff-cake":   { name: "Lotus Biscoff Loaf Cake", price: 649, img: "lotus-biscoff-cake.jpg", cat: "cake",   desc: "Spiced loaf topped with biscoff cream and crunchy biscuits." },
  "butter-croissant":     { name: "Butter Croissant",      price: 120, img: "butter.jpg",               cat: "bakery", desc: "Flaky, buttery and freshly baked." },
  "chocolate-cupcake":    { name: "Chocolate Cupcake",     price: 80,  img: "cupcake.jpg",              cat: "bakery", desc: "Soft cupcake topped with creamy frosting." },
  "chocolate-donut":      { name: "Chocolate Donut",       price: 70,  img: "donut.jpg",                cat: "bakery", desc: "Soft donut covered with chocolate." },
  "choco-chip-cookies":   { name: "Choco Chip Cookies",    price: 150, img: "cokies.jpg",               cat: "bakery", desc: "Crunchy cookies filled with chocolate chips." },
  "chocolate-brownie":    { name: "Chocolate Brownie",     price: 100, img: "brownie.jpg",              cat: "bakery", desc: "Rich, soft and delicious chocolate brownie." },
  "blueberry-muffin":     { name: "Blueberry Muffin",      price: 90,  img: "blueberry.jpg",            cat: "bakery", desc: "Soft muffin packed with juicy blueberries." }
};

// Delivery rules
const DELIVERY_FEE = 60;          // home delivery charge
const FREE_DELIVERY_ABOVE = 999;  // free home delivery when subtotal reaches this

// Cake customisation pricing (listed price = Half Kg)
const SIZE_MULTIPLIER = { "Half Kg": 1, "1 Kg": 1.8, "2 Kg": 3.4, "3 Kg": 5 };
const FLOWER_EXTRA = 100;
const DECOR_EXTRA = 50;

const money = n => "₹" + Math.round(n).toLocaleString("en-IN");
const params = new URLSearchParams(window.location.search);

function customUnitPrice(base, c) {
  let p = base * (SIZE_MULTIPLIER[c.size] || 1);
  if (c.flower && c.flower !== "No Flowers") p += FLOWER_EXTRA;
  if (c.extra && c.extra !== "No Extra Decoration") p += DECOR_EXTRA;
  return Math.round(p);
}

function getOrder() {
  const id = params.get("id");
  const product = PRODUCTS[id];
  if (!product) return null;
  const qty = Math.max(1, Math.min(20, parseInt(params.get("qty"), 10) || 1));
  const custom = params.get("size") ? {
    size: params.get("size"), colour: params.get("colour"), candles: params.get("candles"),
    flower: params.get("flower"), fcolour: params.get("fcolour"), extra: params.get("extra"),
    name: params.get("name"), msg: params.get("msg")
  } : null;
  const unit = custom ? customUnitPrice(product.price, custom) : product.price;
  return { id, product, qty, custom, unit };
}

// ---------- Navbar + footer (same on every page) ----------
(function buildChrome() {
  const active = document.body.dataset.page || "";
  const links = [
    ["home", "index.html", "Home"],
    ["cakes", "cake.html", "Cakes"],
    ["bakery", "bakery.html", "Bakery"],
    ["about", "about.html", "About Us"]
  ];
  const nav = document.getElementById("site-nav");
  if (nav) {
    nav.outerHTML = `
      <nav class="navbar">
        <div class="nav-inner">
          <a class="logo" href="index.html">Sugar and Slices</a>
          <button class="menu-btn" aria-label="Open menu" id="menuBtn">&#9776;</button>
          <ul class="nav-links" id="navLinks">
            ${links.map(l => `<li><a href="${l[1]}" ${l[0] === active ? 'class="active"' : ""}>${l[2]}</a></li>`).join("")}
          </ul>
        </div>
      </nav>`;
    const btn = document.getElementById("menuBtn");
    const ul = document.getElementById("navLinks");
    btn.addEventListener("click", () => ul.classList.toggle("open"));
    ul.addEventListener("click", e => { if (e.target.tagName === "A") ul.classList.remove("open"); });
  }
  const foot = document.getElementById("site-footer");
  if (foot) {
    foot.outerHTML = `
      <footer>
        <div class="foot">
          <div><h4>Sugar and Slices</h4><p>Freshly baked happiness in every bite.</p></div>
          <div><h4>Explore</h4>
            <a href="cake.html">Cakes</a><a href="bakery.html">Bakery</a><a href="about.html">About Us</a>
          </div>
          <div><h4>Visit us</h4>
            <p>123 Sweet Street, Jalandhar</p><p>+91 9872223355</p><p>9:00 AM – 9:00 PM</p>
          </div>
        </div>
        <div class="copy">© 2026 Sugar and Slices | Bake with love ❤️</div>
      </footer>`;
  }
})();

// ---------- Simple forms on the home page (feedback + contact) ----------
function wireForm(id, message) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const msg = form.querySelector(".form-msg");
    msg.textContent = message;
    msg.style.display = "block";
    form.reset();
  });
}
wireForm("feedbackForm", "Thank you for your feedback! 💛");
wireForm("contactForm", "Thanks for reaching out! We'll get back to you soon. 🍰");

// ---------- Cart page ----------
if (document.body.dataset.page === "cart") {
  const o = getOrder();
  const box = document.getElementById("cartBox");
  if (!o) {
    box.innerHTML = `<div style="text-align:center"><h2>Your cart is empty</h2><p style="margin:10px 0 24px;color:#7a6a63">Pick something delicious first.</p>
      <a class="btn" href="cake.html">Browse Cakes</a> <a class="btn outline" href="bakery.html">Browse Bakery</a></div>`;
  } else {
    let qty = o.qty;
    const p = o.product;
    const render = () => {
      const q = `id=${o.id}&qty=${qty}`;
      box.innerHTML = `
        <div class="cart-item">
          <img src="images/${p.img}" alt="${p.name}">
          <div class="meta">
            <h2>${p.name}</h2>
            <p>${p.desc}</p>
            <div class="qty"><button id="minus" aria-label="Decrease">−</button><span>${qty}</span><button id="plus" aria-label="Increase">+</button></div>
          </div>
          <div class="price">${money(p.price * qty)}<br><small>${money(p.price)} each</small></div>
        </div>
        <div class="btn-row">
          ${p.cat === "cake" ? `<a class="btn outline" href="customize.html?${q}">Customize Your Cake 🎂</a>` : ""}
          <a class="btn" href="checkout.html?${q}">Proceed to Checkout</a>
          <a class="btn outline" href="${p.cat === "cake" ? "cake.html" : "bakery.html"}">Continue Shopping</a>
        </div>`;
      document.getElementById("minus").onclick = () => { if (qty > 1) { qty--; render(); } };
      document.getElementById("plus").onclick = () => { if (qty < 20) { qty++; render(); } };
    };
    render();
  }
}

// ---------- Customize page ----------
if (document.body.dataset.page === "customize") {
  const o = getOrder();
  const form = document.getElementById("customForm");
  if (!o) {
    form.innerHTML = `<p style="text-align:center">Please choose a cake first.</p><p style="text-align:center;margin-top:16px"><a class="btn" href="cake.html">Browse Cakes</a></p>`;
  } else {
    document.getElementById("customFor").textContent = o.product.name;
    document.getElementById("customImg").src = "images/" + o.product.img;
    const priceEl = document.getElementById("livePrice");
    const read = () => Object.fromEntries(new FormData(form).entries());
    const update = () => { priceEl.textContent = money(customUnitPrice(o.product.price, read()) * o.qty); };
    form.addEventListener("input", update);
    update();
    form.addEventListener("submit", e => {
      e.preventDefault();
      const q = new URLSearchParams(read());
      q.set("id", o.id); q.set("qty", o.qty);
      window.location.href = "checkout.html?" + q.toString();
    });
  }
}

// ---------- Checkout / delivery details ----------
if (document.body.dataset.page === "checkout") {
  const o = getOrder();
  const wrap = document.getElementById("checkoutWrap");
  if (!o) {
    wrap.innerHTML = `<div class="panel" style="text-align:center"><h2>Nothing to checkout yet</h2><p style="margin:10px 0 24px;color:#7a6a63">Choose a cake or bakery treat first.</p>
      <a class="btn" href="cake.html">Browse Cakes</a></div>`;
  } else {
    const form = document.getElementById("deliveryForm");
    const subtotal = o.unit * o.qty;

    const customLines = o.custom ? `
      <div class="line"><span>Size</span><span>${o.custom.size}</span></div>
      <div class="line"><span>Cake colour</span><span>${o.custom.colour}</span></div>
      ${o.custom.flower && o.custom.flower !== "No Flowers" ? `<div class="line"><span>Flowers</span><span>${o.custom.flower} (${o.custom.fcolour}) +${money(FLOWER_EXTRA)}</span></div>` : ""}
      ${o.custom.extra && o.custom.extra !== "No Extra Decoration" ? `<div class="line"><span>Extra decoration</span><span>${o.custom.extra} +${money(DECOR_EXTRA)}</span></div>` : ""}
      ${o.custom.name ? `<div class="line"><span>Name on cake</span><span>${o.custom.name}</span></div>` : ""}` : "";

    const renderSummary = () => {
      const type = form.elements.dtype.value;
      const fee = type === "pickup" ? 0 : (subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE);
      const total = subtotal + fee;
      document.getElementById("summary").innerHTML = `
        <h3 class="ptitle">Order Summary</h3>
        <div class="item"><img src="images/${o.product.img}" alt=""><div><b>${o.product.name}</b><small>${money(o.unit)} × ${o.qty}</small></div></div>
        ${customLines}
        <div class="line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="line"><span>${type === "pickup" ? "Store pickup" : "Delivery charge"}</span>
          <span>${fee === 0 ? '<span class="free">FREE</span>' : money(fee)}</span></div>
        <div class="line total"><span>Total to pay</span><span>${money(total)}</span></div>
        <p class="note">${type === "pickup" ? "Pick up from 123 Sweet Street, Jalandhar." :
          (subtotal >= FREE_DELIVERY_ABOVE ? "🎉 You get free delivery on orders above " + money(FREE_DELIVERY_ABOVE) + "." :
           "Add " + money(FREE_DELIVERY_ABOVE - subtotal) + " more for free delivery.")}</p>`;
      form.dataset.total = total;
    };

    // delivery date can't be in the past (earliest = tomorrow for cakes)
    const d = new Date(); d.setDate(d.getDate() + 1);
    const iso = d.toISOString().slice(0, 10);
    form.elements.date.min = iso;
    form.elements.date.value = iso;

    const toggleAddress = () => {
      const pickup = form.elements.dtype.value === "pickup";
      document.getElementById("addressFields").style.display = pickup ? "none" : "block";
      ["address", "city", "pincode"].forEach(n => form.elements[n].required = !pickup);
      renderSummary();
    };
    form.addEventListener("change", toggleAddress);
    toggleAddress();

    form.addEventListener("submit", e => {
      e.preventDefault();
      const f = form.elements;
      const q = new URLSearchParams({
        order: "SS" + Date.now().toString().slice(-6),
        item: `${o.product.name} × ${o.qty}`,
        total: form.dataset.total,
        name: f.fullname.value,
        date: f.date.value,
        slot: f.slot.value,
        dtype: f.dtype.value,
        pay: f.pay.value,
        addr: f.dtype.value === "pickup" ? "Store pickup – 123 Sweet Street, Jalandhar" : `${f.address.value}, ${f.city.value} – ${f.pincode.value}`
      });
      window.location.href = "thankyou.html?" + q.toString();
    });
  }
}

// ---------- Thank you page ----------
if (document.body.dataset.page === "thankyou") {
  const rows = [
    ["Order ID", params.get("order")],
    ["Item", params.get("item")],
    [params.get("dtype") === "pickup" ? "Pickup" : "Delivery", params.get("addr")],
    ["Date & time", params.get("date") ? `${params.get("date")}, ${params.get("slot")}` : null],
    ["Payment", params.get("pay")],
    ["Total", params.get("total") ? money(Number(params.get("total"))) : null]
  ].filter(r => r[1]);
  const r = document.getElementById("receipt");
  if (rows.length) {
    r.innerHTML = rows.map(x => `<div><span>${x[0]}</span><b>${x[1].replace(/</g, "&lt;")}</b></div>`).join("");
  } else { r.style.display = "none"; }
  const n = params.get("name");
  if (n) document.getElementById("thanksName").textContent = ", " + n.split(" ")[0].replace(/</g, "&lt;");
}
