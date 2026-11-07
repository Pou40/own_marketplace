(async function () {
  const { cfg, money, esc, categoryLabel, loadItems, priceHtml, cardHtml } = window.Shop;
  const main = document.getElementById("main");
  const id = new URLSearchParams(location.search).get("id");

  let items;
  try {
    items = await loadItems();
  } catch (e) {
    main.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
    return;
  }
  const item = items.find((i) => i.id === id);
  if (!item) {
    document.title = "Not found · " + cfg.shopName;
    main.innerHTML = `<p class="empty">That item doesn't exist (anymore). <a href="./">Back to the shop</a></p>`;
    return;
  }
  document.title = `${item.title} · ${cfg.shopName}`;

  // ----- Contact buttons -----
  const url = location.href;
  const msg = `Hi! I'm interested in "${item.title}" (${money.format(item.price)}). Is it still available?\n${url}`;
  const isSold = item.status === "sold";
  const buttons = [];
  if (cfg.contact.whatsapp)
    buttons.push(`<a class="btn primary" href="https://wa.me/${esc(cfg.contact.whatsapp)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener" ${isSold ? 'aria-disabled="true"' : ""}>Message on WhatsApp</a>`);
  if (cfg.contact.email)
    buttons.push(`<a class="btn ${buttons.length ? "" : "primary"}" href="mailto:${esc(cfg.contact.email)}?subject=${encodeURIComponent("Interested in: " + item.title)}&body=${encodeURIComponent(msg)}" ${isSold ? 'aria-disabled="true"' : ""}>Email the seller</a>`);
  if (cfg.contact.instagram)
    buttons.push(`<a class="btn" href="https://instagram.com/${esc(cfg.contact.instagram)}" target="_blank" rel="noopener">DM on Instagram</a>`);
  buttons.push(`<button class="btn" id="share">Share this item</button>`);

  // ----- Specs table -----
  const specs = {
    Category: categoryLabel(item.category),
    Brand: item.brand,
    Size: item.size,
    Color: item.color,
    Condition: item.condition,
    ...item.details,
    Listed: item.dateAdded ? new Date(item.dateAdded + "T00:00:00").toLocaleDateString(cfg.locale, { dateStyle: "medium" }) : ""
  };
  const specRows = Object.entries(specs)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("");

  const statusText = { available: "Available", reserved: "Reserved — ask to join the waitlist", sold: "Sold" }[item.status] || item.status;
  const save = item.originalPrice && item.originalPrice > item.price ? `<span class="save">Save ${money.format(item.originalPrice - item.price)}</span>` : "";
  const imgs = item.images.length ? item.images : [];
  const multi = imgs.length > 1;

  const related = items
    .filter((i) => i.id !== item.id && i.category === item.category && i.status !== "sold")
    .concat(items.filter((i) => i.id !== item.id && i.category !== item.category && i.status === "available"))
    .slice(0, 4);

  main.innerHTML = `
    <nav class="breadcrumbs"><a href="./">Shop</a> / <a href="./?cat=${encodeURIComponent(item.category)}">${esc(categoryLabel(item.category))}</a> / ${esc(item.title)}</nav>
    <article class="item">
      <div class="gallery">
        <div class="gallery-main" id="mainImg">
          ${imgs[0] ? `<img src="${esc(imgs[0])}" alt="${esc(item.title)} — photo 1">` : ""}
          ${multi ? `<button class="gallery-nav prev" aria-label="Previous photo">‹</button><button class="gallery-nav next" aria-label="Next photo">›</button>` : ""}
        </div>
        ${multi ? `<div class="thumbs" id="thumbs">${imgs.map((src, n) => `<button aria-label="Photo ${n + 1}" aria-current="${n === 0}" data-n="${n}"><img src="${esc(src)}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="item-info">
        <div class="item-cat">${esc(categoryLabel(item.category))}</div>
        <h1>${esc(item.title)}</h1>
        <div class="item-price">${priceHtml(item)}${save}</div>
        <div class="status ${esc(item.status)}">${esc(statusText)}</div>
        <p class="item-desc">${esc(item.description)}</p>
        <table class="specs"><tbody>${specRows}</tbody></table>
        <div class="actions">${buttons.join("")}</div>
        <p class="note">${esc(cfg.location)}</p>
      </div>
    </article>
    ${related.length ? `<section><h2 class="section-title">You might also like</h2><div class="grid">${related.map(cardHtml).join("")}</div></section>` : ""}
  `;

  // ----- Gallery behaviour -----
  let cur = 0;
  const mainImg = main.querySelector("#mainImg img");
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");

  function show(n) {
    if (!imgs.length) return;
    cur = (n + imgs.length) % imgs.length;
    mainImg.src = imgs[cur];
    mainImg.alt = `${item.title} — photo ${cur + 1}`;
    main.querySelectorAll("#thumbs button").forEach((b, i) => b.setAttribute("aria-current", i === cur));
    lbImg.src = imgs[cur];
  }
  main.querySelector("#thumbs")?.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) show(+b.dataset.n);
  });
  main.querySelector("#mainImg").addEventListener("click", (e) => {
    if (e.target.closest(".prev")) return show(cur - 1);
    if (e.target.closest(".next")) return show(cur + 1);
    if (!imgs.length) return;
    lbImg.src = imgs[cur];
    lb.classList.add("open");
  });

  lb.querySelector(".prev").hidden = lb.querySelector(".next").hidden = !multi;
  lb.addEventListener("click", (e) => {
    if (e.target.closest(".prev")) return show(cur - 1);
    if (e.target.closest(".next")) return show(cur + 1);
    if (e.target === lb || e.target.closest(".close")) lb.classList.remove("open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lb.classList.remove("open");
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });

  // Simple swipe on touch devices.
  let x0 = null;
  [main.querySelector("#mainImg"), lb].forEach((el) => {
    el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  });

  // ----- Share -----
  document.getElementById("share").addEventListener("click", async (e) => {
    try {
      if (navigator.share) await navigator.share({ title: item.title, url });
      else {
        await navigator.clipboard.writeText(url);
        e.target.textContent = "Link copied!";
        setTimeout(() => (e.target.textContent = "Share this item"), 2000);
      }
    } catch (_) { /* user cancelled */ }
  });
})();
