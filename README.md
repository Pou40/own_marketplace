# Own Marketplace

A simple online shop for selling your own things, like clothes, shoes, electronics and home goods. It's a static website, so there's no server, database or monthly cost. It's hosted free on **GitHub Pages**.

**Live site (after setup):** `https://pou40.github.io/own_marketplace/`

## What it does

- A home page with search, category filters, sorting (newest, price, biggest discount) and a "hide sold" toggle
- An item page for each listing with:
  - a photo gallery (thumbnails, swipe on phones, full-screen view)
  - price and discount
  - condition
  - size, brand and any extra details you list
- **Message on WhatsApp** and **Email the seller** buttons that fill in the item's name and link for the buyer
- Badges for Sold, Reserved and discounts. Sold items move to the bottom of the list.
- Works on phones and has a dark mode
- Not limited to clothes. You can sell anything in any category.

## 1. One-time setup

1. **Turn on Pages:** in the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
2. **Make `main` the branch you deploy from.** The deploy workflow runs on every push to `main`. You can also start it by hand from the **Actions** tab.
3. **Add your shop details:** edit `assets/js/config.js` to set the shop name, currency and contact details (email, WhatsApp number, Instagram).

> ⚠️ Anything you put in `config.js` will be public on the website. Consider using a separate email just for selling.

## 2. Adding an item

1. Take photos. A 4:5 portrait shape (for example 1200×1500) looks best. Keep each photo under about 500 KB. Phone photos can be shrunk with a site like squoosh.app.
2. Upload them to `images/items/`. You can do this on github.com with **Add file → Upload files**.
3. Add an entry to `data/items.json`:

```json
{
  "id": "red-wool-sweater",
  "title": "Red Wool Sweater",
  "category": "clothing",
  "price": 20,
  "originalPrice": 60,
  "condition": "Like new",
  "status": "available",
  "brand": "Uniqlo",
  "size": "L",
  "color": "Red",
  "dateAdded": "2026-11-07",
  "featured": false,
  "description": "Soft merino wool, worn twice.",
  "details": { "Material": "100% merino", "Length": "68 cm" },
  "images": ["images/items/red-sweater-1.jpg", "images/items/red-sweater-2.jpg"]
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Unique, lowercase with dashes. It becomes the item's link. |
| `title`, `category`, `price` | ✅ | `category` must be one of the ids in `config.js` (you can add new ones there) |
| `status` | | `available` (default), `reserved` or `sold` |
| `originalPrice` | | Shows a discount badge and a crossed-out price |
| `details` | | Any extra label/value pairs. These appear in the specs table. |
| `brand`, `size`, `color`, `condition`, `dateAdded`, `tags` | | Optional. These are also searchable. |

To mark something as sold, change `"status"` to `"sold"`.

Each push to `main` checks `items.json` for mistakes (missing fields, duplicate ids, missing photos) and then redeploys the site.

The `sample-*` items and SVGs are placeholders. Delete them once you've added your own.

## Previewing on your computer

The pages load `data/items.json` with `fetch`, so open them through a local server rather than by double-clicking the file:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Custom domain (optional)

If you buy a domain, add it under **Settings → Pages → Custom domain**.
