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
`public/os/wallpapers/*.jpg` — free photos from Unsplash (Unsplash License), shown behind the GSAP scenes in `public/os/wallpaper.js` (`PHOTO_SRC`). To use the client's own photos, replace these files with the same names.

| File | Scene | Unsplash photo |
|---|---|---|
| global.jpg | Global Perspective | photo-1782977697822-aa50585579a9 |
| identity.jpg | Institutional Identity | photo-1768617154318-b2caa1e97a60 |
| systems.jpg | Integrated Systems | photo-1780076001401-4bc47b58b9a6 |
| delivery.jpg | Measured Delivery | photo-1573164574572-cb89e39749b4 |
| momentum.jpg | Momentum | photo-1622884589154-4bf891d0af40 |
