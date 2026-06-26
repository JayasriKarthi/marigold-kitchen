/* =========================================================
   Marigold Kitchen — script.js
   Mobile nav · menu data + filtering · scroll reveal · form
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Menu data ---------- */
  // category drives the filter; accent maps a brand colour to each card.
  var DISHES = [
    { name: "Beetroot tikki",        price: "₹280", cat: "small", tag: "Veg",      accent: "var(--berry)",
      desc: "Magenta inside, crisp out, curry-leaf yoghurt." },
    { name: "Pepper-fry calamari",   price: "₹420", cat: "small", tag: "Seafood",  accent: "var(--coral)",
      desc: "Black pepper, curry leaves, a squeeze of lime." },
    { name: "Gunpowder fries",       price: "₹240", cat: "small", tag: "Veg",      accent: "var(--marigold)",
      desc: "Crisp potatoes tossed in toasted molagapodi." },
    { name: "Chilli-mango prawns",   price: "₹540", cat: "large", tag: "Seafood",  accent: "var(--teal)",
      desc: "Grilled tiger prawns, raw mango, chilli oil." },
    { name: "Smoked dal makhani",    price: "₹360", cat: "large", tag: "Veg",      accent: "var(--marigold)",
      desc: "Black lentils, slow-cooked overnight, tandoor smoke." },
    { name: "Coastal fish curry",    price: "₹480", cat: "large", tag: "Seafood",  accent: "var(--coral)",
      desc: "Day's catch in a bright kokum-coconut gravy." },
    { name: "Paneer tikka platter",  price: "₹390", cat: "large", tag: "Veg",      accent: "var(--berry)",
      desc: "Charred paneer, peppers, mint and pickled onion." },
    { name: "Saffron-pistachio kulfi", price: "₹220", cat: "sweet", tag: "Sweet",  accent: "var(--marigold)",
      desc: "Hand-churned, on a stick, dusted with rose." },
    { name: "Gulab jamun cheesecake", price: "₹260", cat: "sweet", tag: "Sweet",   accent: "var(--berry)",
      desc: "Warm jamun folded through cool baked cheesecake." },
    { name: "Filter-coffee affogato", price: "₹240", cat: "sweet", tag: "Sweet",   accent: "var(--teal)",
      desc: "Vanilla kulfi drowned in hot Kumbakonam filter coffee." },
    { name: "Jaljeera spritz",       price: "₹260", cat: "drink", tag: "Mocktail", accent: "var(--teal)",
      desc: "Cumin, mint and soda — sharp and cooling." },
    { name: "Rose-kokum cooler",     price: "₹240", cat: "drink", tag: "Mocktail", accent: "var(--coral)",
      desc: "Tangy kokum, rose, a pinch of black salt." }
  ];

  /* ---------- Render menu ---------- */
  var grid = document.getElementById("menuGrid");
  var emptyMsg = document.getElementById("menuEmpty");

  function cardHTML(d) {
    return (
      '<article class="dish" style="--accent:' + d.accent + '" data-cat="' + d.cat + '">' +
        '<span class="dish__tag">' + d.tag + "</span>" +
        '<div class="dish__top">' +
          '<span class="dish__name">' + d.name + "</span>" +
          '<span class="dish__price">' + d.price + "</span>" +
        "</div>" +
        '<p class="dish__desc">' + d.desc + "</p>" +
      "</article>"
    );
  }

  function renderMenu(filter) {
    var list = filter === "all" ? DISHES : DISHES.filter(function (d) { return d.cat === filter; });
    grid.innerHTML = list.map(cardHTML).join("");
    emptyMsg.hidden = list.length !== 0;
  }

  renderMenu("all");

  /* ---------- Menu filters ---------- */
  var filterBar = document.getElementById("menuFilters");
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      filterBar.querySelectorAll(".filter").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderMenu(btn.dataset.filter);
    });
  }

  /* ---------- Mobile nav ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Booking form validation ---------- */
  var form = document.getElementById("bookForm");
  var success = document.getElementById("bookSuccess");

  function setError(field, message) {
    var input = form.elements[field];
    var slot = form.querySelector('[data-for="' + field + '"]');
    if (slot) slot.textContent = message;
    if (input) input.classList.toggle("is-invalid", Boolean(message));
  }

  function validate() {
    var ok = true;
    var name = form.elements.name.value.trim();
    var people = form.elements.people.value;
    var date = form.elements.date.value;
    var email = form.elements.email.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setError("name", name ? "" : "Tell us a name for the table.");
    setError("people", people ? "" : "How many are coming?");
    setError("date", date ? "" : "Pick a date.");
    setError("email", emailOk ? "" : "Add an email we can reply to.");

    if (!name || !people || !date || !emailOk) ok = false;
    return ok;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      success.hidden = true;
      if (validate()) {
        form.reset();
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
    // clear an error as soon as the field is corrected
    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("is-invalid")) {
        e.target.classList.remove("is-invalid");
        var slot = form.querySelector('[data-for="' + e.target.name + '"]');
        if (slot) slot.textContent = "";
      }
    });
  }
})();
