# Own Marketplace

A simple online shop for selling your own things, like clothes, shoes, electronics and home goods. It's a static website, so there's no server, database or monthly cost. It's hosted free on **Cloudflare Pages**, which republishes the site automatically about a minute after every change to the `main` branch.

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

## Settings

Edit `assets/js/config.js` to set the shop name, currency and contact details (email, WhatsApp number, Instagram).

> ⚠️ Anything you put in `config.js` will be public on the website. Consider using a separate email just for selling.

## Adding an item (the easy way, works on a phone)

1. **Upload photos.** On github.com, open the `images/items` folder, then **Add file → Upload files**. Pick your photos and press **Commit changes**.
   - Use simple file names without spaces, like `red-sweater-1.jpg`.
   - A 4:5 portrait shape looks best.
   - Keep each photo under about 500 KB so pages load fast. squoosh.app can shrink phone photos.
2. **Fill in the form.** Open `/add-item.html` on your live site. Type the photo file names, fill in the details, then press **Generate** and **Copy**.
3. **Paste on GitHub.** Press **Open items.json on GitHub** (or open `data/items.json` and tap ✏️). Select all of the text, paste over it, and press **Commit changes**.

The site updates by itself about a minute later.

## Changing or removing an item

Open `data/items.json` on GitHub and tap ✏️.

- **Sold:** change `"status": "available"` to `"status": "sold"`. Use `"reserved"` for an item someone has reserved.
- **New price:** change the number after `"price":`.
- **Remove an item:** delete its whole `{ ... },` block. Keep the commas between items correct.

The `sample-*` items and SVGs are placeholders. Delete them once your own items are in.

### Item fields

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Unique, lowercase with dashes. It becomes the item's link. |
| `title`, `category`, `price` | ✅ | `category` must be one of the ids in `config.js` (you can add new ones there) |
| `status` | | `available` (default), `reserved` or `sold` |
| `originalPrice` | | Shows a discount badge and a crossed-out price |
| `details` | | Any extra label/value pairs. These appear in the specs table. |
| `brand`, `size`, `color`, `condition`, `dateAdded`, `tags` | | Optional. These are also searchable. |

## Previewing on your computer

The pages load `data/items.json` with `fetch`, so open them through a local server rather than by double-clicking the file:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Custom domain (optional)

If you buy a domain, add it in Cloudflare under **Workers & Pages → your project → Custom domains**.
