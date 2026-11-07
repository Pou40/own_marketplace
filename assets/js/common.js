// Shared helpers used by every page.
(function () {
  const cfg = window.SITE_CONFIG;

  const money = new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const categoryLabel = (id) => (cfg.categories.find((c) => c.id === id) || { label: id || "Other" }).label;

  async function loadItems() {
    const res = await fetch("data/items.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Could not load items (" + res.status + ")");
    const items = await res.json();
    return items.map((it) => ({ status: "available", images: [], details: {}, ...it }));
  }

  function statusBadge(item) {
    if (item.status === "sold") return '<span class="badge sold">Sold</span>';
    if (item.status === "reserved") return '<span class="badge reserved">Reserved</span>';
    if (item.originalPrice && item.originalPrice > item.price) {
      const pct = Math.round((1 - item.price / item.originalPrice) * 100);
      return `<span class="badge sale">−${pct}%</span>`;
    }
    if (item.featured) return '<span class="badge">Featured</span>';
    return "";
  }

  function priceHtml(item) {
    const orig = item.originalPrice && item.originalPrice > item.price ? `<s>${money.format(item.originalPrice)}</s>` : "";
    return `<span class="price">${money.format(item.price)}${orig}</span>`;
  }

  function cardHtml(item) {
    const img = item.images[0] || "";
    const meta = [item.brand, item.size, item.condition].filter(Boolean).map(esc).join(" · ");
    return `
      <a class="card ${item.status === "sold" ? "is-sold" : ""}" href="item.html?id=${encodeURIComponent(item.id)}">
        <div class="card-media">
          ${img ? `<img src="${esc(img)}" alt="${esc(item.title)}" loading="lazy">` : ""}
          ${statusBadge(item)}
        </div>
        <div class="card-body">
          <h3>${esc(item.title)}</h3>
          <div class="card-meta">${meta}</div>
          <div>${priceHtml(item)}</div>
        </div>
      </a>`;
  }

  function renderChrome() {
    document.querySelectorAll("[data-shop-name]").forEach((el) => (el.textContent = cfg.shopName));
    document.querySelectorAll("[data-tagline]").forEach((el) => (el.textContent = cfg.tagline));
    document.querySelectorAll("[data-location]").forEach((el) => (el.textContent = cfg.location));
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    const links = [];
    if (cfg.contact.email) links.push(`<a href="mailto:${esc(cfg.contact.email)}">Email</a>`);
    if (cfg.contact.whatsapp) links.push(`<a href="https://wa.me/${esc(cfg.contact.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`);
    if (cfg.contact.instagram) links.push(`<a href="https://instagram.com/${esc(cfg.contact.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
    document.querySelectorAll("[data-contact-links]").forEach((el) => (el.innerHTML = links.join(" · ")));
  }

  window.Shop = { cfg, money, esc, categoryLabel, loadItems, statusBadge, priceHtml, cardHtml, renderChrome };
  document.addEventListener("DOMContentLoaded", renderChrome);
})();
