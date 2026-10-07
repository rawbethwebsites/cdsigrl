# CDS IGRL — website

Built by The Boost Nation from the TBN OS template.
Live: https://cdsigrl.theboostnation.space

- `/` — **CDS IGRL OS** (`public/index.html` + `public/os/wallpaper.js`), the static desktop experience
- `/classic`, `/services/*`, `/approach`, `/clients`, `/about`, `/get-started`, `/privacy`, `/terms` — React app (`app.html` → `src/`)
- Copy for the React pages lives in `src/data/content.ts`; OS copy lives in `public/index.html` (`PILLARS`, `STEPS`, `NOTES`)
- Contact form posts to `api/lead.js` → Telegram. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Vercel.

```bash
npm install
npm run dev
npm run build
```

## Wallpaper photos
`public/os/wallpapers/*.jpg` — free photos from Unsplash (Unsplash License), shown behind the GSAP measurement scenes in `public/os/wallpaper.js` (`PHOTO_SRC`). To use the client's own photos, replace these files with the same names.

| File | Scene | Unsplash photo |
|---|---|---|
| trade.jpg | Fair Trade (beam balance) | photo-1552710218-bd32b0c98626 |
| flow.jpg | Fuel & Flow (turbine meter) | photo-1695561324569-5e47c76dc0a3 |
| bulk.jpg | Weighbridge (haul truck + load cells) | photo-1523848309072-c199db53f137 |
| utility.jpg | Utilities & Metering (3-phase smart meter) | photo-1684684383508-261dd0e8f467 |
| calibration.jpg | Certified Accuracy (gauge + stamp) | photo-1791085669879-471685e3fcc5 |

### Service photos
`public/os/services/<slug>.jpg` (Unsplash License), used by the OS Capabilities window and the React services pages via `serviceImage()` in `src/data/content.ts`. Swap in client photos with the same filenames.

## Brand
Logo mark: a gauge-dial "C" with a calibrated needle. Sources in `brand/` (SVG + 1024px PNG); the site copies are
`public/os/logo.svg`, `public/os/logo-white.svg` (transparent), `public/favicon.svg` (simplified for small sizes)
and the inline `LogoMark` in `src/components/Logo.tsx`.

### Palette — "Standard & Verified"
Built from the client's original navy + green logo colours, tuned for contrast on dark UI.

| Token | Hex | Use |
|---|---|---|
| Verified Green (`brand`, `--emerald`) | `#18C25A` | primary accent, CTAs, gauge arc |
| Green Deep (`brand-deep`, `--forest`) | `#0E8A3E` | hover, secondary fills |
| Signal Mint (`--mint`) | `#8FF0B5` | labels, data lines |
| Midnight (`ink`, `--deep`) | `#07131F` | page background |
| Navy (`coal`, `--navy`) | `#0C1E30` | surfaces / cards |
| Paper (`cream`, `--cream`) | `#EEF4F8` | text on dark, light sections |

Green on Midnight ≈ 7.9:1 contrast (AA for all text sizes); Midnight text on green buttons passes too.
