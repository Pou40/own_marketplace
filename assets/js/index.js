(async function () {
  const { cfg, esc, cardHtml, loadItems } = window.Shop;
  document.title = cfg.shopName;

  const grid = document.getElementById("grid");
  const chips = document.getElementById("chips");
  const q = document.getElementById("q");
  const sort = document.getElementById("sort");
  const hideSold = document.getElementById("hideSold");

  // Restore state from the URL so filtered views can be shared/bookmarked.
  const params = new URLSearchParams(location.search);
  const state = {
    cat: params.get("cat") || "all",
    q: params.get("q") || "",
    sort: params.get("sort") || "new",
    hideSold: params.get("hideSold") === "1"
  };
  q.value = state.q;
  sort.value = state.sort;
  hideSold.checked = state.hideSold;

  let items = [];
  try {
    items = await loadItems();
  } catch (e) {
    grid.innerHTML = `<p class="empty">${esc(e.message)}. If you opened this file directly, run a local server (see README).</p>`;
    return;
  }

  const available = items.filter((i) => i.status === "available").length;
  document.getElementById("stats").innerHTML = `
    <div><strong>${available}</strong>available now</div>
    <div><strong>${new Set(items.map((i) => i.category)).size}</strong>categories</div>
    <div><strong>${items.filter((i) => i.status === "sold").length}</strong>already sold</div>`;

  function renderChips() {
    const counts = items.reduce((m, i) => ((m[i.category] = (m[i.category] || 0) + 1), m), {});
    const cats = [{ id: "all", label: "All" }, ...cfg.categories.filter((c) => counts[c.id])];
    chips.innerHTML = cats
      .map((c) => {
        const n = c.id === "all" ? items.length : counts[c.id];
        return `<button class="chip" data-cat="${esc(c.id)}" aria-pressed="${state.cat === c.id}">${esc(c.label)}<span class="count">${n}</span></button>`;
      })
      .join("");
  }

  function render() {
    const term = state.q.trim().toLowerCase();
    let list = items.filter((i) => {
      if (state.cat !== "all" && i.category !== state.cat) return false;
      if (state.hideSold && i.status === "sold") return false;
      if (!term) return true;
      const hay = [i.title, i.brand, i.size, i.color, i.condition, i.description, i.category, ...(i.tags || [])]
        .join(" ")
        .toLowerCase();
      return term.split(/\s+/).every((t) => hay.includes(t));
    });

    const discount = (i) => (i.originalPrice ? 1 - i.price / i.originalPrice : 0);
    const sorters = {
      new: (a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      discount: (a, b) => discount(b) - discount(a)
    };
    // Sold items always sink to the bottom.
    list.sort((a, b) => (a.status === "sold") - (b.status === "sold") || sorters[state.sort](a, b));

    grid.innerHTML = list.length ? list.map(cardHtml).join("") : '<p class="empty">Nothing matches that — try another search or category.</p>';

    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.q) p.set("q", state.q);
    if (state.sort !== "new") p.set("sort", state.sort);
    if (state.hideSold) p.set("hideSold", "1");
    history.replaceState(null, "", p.toString() ? "?" + p : location.pathname);
  }

  chips.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    state.cat = btn.dataset.cat;
    chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === btn));
    render();
  });
  q.addEventListener("input", () => { state.q = q.value; render(); });
  sort.addEventListener("change", () => { state.sort = sort.value; render(); });
  hideSold.addEventListener("change", () => { state.hideSold = hideSold.checked; render(); });

  renderChips();
  render();
})();
