# Baskery website

Mobile-first menu site. Customers pick cookies and brownies, fill in their details, and the order opens in WhatsApp, ready to send to **0115 494 8726**.

It's a static site with no build step. Vercel serves the files as they are.

## Change prices, stock or products

Everything lives in `data/menu.json`. Edit it on github.com (pencil icon → **Commit changes**). Vercel puts it live in about a minute.

| What you want | What to change |
| --- | --- |
| Allow same-day orders for an item | `"inStockToday": true` (set it back to `false` when sold out) |
| Hide a product | `"available": false` |
| Change a cookie price | `sizes` → `price` |
| Change a box price | `pieces` → `prices` (cookie box) or `price` (brownie box) |
| Give a "Price soon" item a price | replace `"price": null` with a number, e.g. `"price": 60` |
| Show a seasonal item only until a date | `"availableUntil": "2026-10-31"` |
| Add delivery areas with fixed fees | `settings.deliveryAreas`, e.g. `[{ "id": "maadi", "name": { "en": "Maadi", "ar": "المعادي" }, "fee": 50 }]` |
| Set a minimum order | `settings.minimumOrder`, e.g. `300` |
| Show Instagram / TikTok in the footer | `settings.instagram`, `settings.tiktok` (full links) |

The "Today" option is only offered when **every** item in the cart has `"inStockToday": true`. Otherwise the earliest day is tomorrow.

## Run it on your computer

```
python -m http.server 8787
```

Then open http://localhost:8787.

## Hosting (GitHub + Vercel)

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project →** import the repository. Leave Framework Preset as **Other**, with no build command and no output directory.
3. Add your domain under **Settings → Domains**.
4. After the domain is live, change the `og:image` line in `index.html` to the full address (for example `https://yourdomain.com/assets/img/og.jpg`) so WhatsApp link previews show the picture.

Vercel's free Hobby plan is for non-commercial use. A shop should use the Pro plan.

## Files

- `index.html`: page content (English; Arabic is filled in by the script)
- `assets/js/app.js`: menu, cart, order form, WhatsApp message, translations
- `assets/css/style.css`: brand colours, layout, animations
- `assets/img/`: product photos (placeholders from Instagram posts), logo, icons, share image
