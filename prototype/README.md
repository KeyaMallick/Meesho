# Meesho Dukaan · Demo website

**Live: https://meesho-dukaan.vercel.app** · [Story](https://meesho-dukaan.vercel.app/story) · [Try it](https://meesho-dukaan.vercel.app/try)

Prototype for the DICE Challenge 3.0 semi-final. One Next.js app: a guided 90-day story (`/story`), a live AI sandbox (`/try`) and a cover page (`/`). Full plan in [design.md](./design.md).

## Run locally

```bash
pnpm install
cp .env.example .env.local   # then put the Gemini key in GEMINI_API_KEY
pnpm dev                     # http://localhost:3000
```

Checks: `pnpm test` (story script integrity), `pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Deploy (Vercel)

No separate backend: `/api/listing` deploys as a serverless function with the pages.

The live site is deployed from the CLI, not from Git, so pushing to GitHub doesn't update it. To redeploy, run `vercel deploy --prod --yes` from `prototype/`.

To set it up from scratch on another account:

1. Push the repo to GitHub → vercel.com → **Add New… → Project** → import it.
2. Set **Root Directory** to `prototype`.
3. **Environment Variables**: add `GEMINI_API_KEY` (optional: `GEMINI_MODEL`, `GEMINI_THINKING`, `AI_DAILY_CAP`).
4. Deploy. The production URL is the link to submit.

Without GitHub: from `prototype/` run `pnpm dlx vercel`, then `pnpm dlx vercel env add GEMINI_API_KEY` and `pnpm dlx vercel --prod`.

## Presenting

Open `/story` in Chrome, press `F` for fullscreen, then:

| Key | Action |
|---|---|
| `→` / `Space` | Next beat |
| `←` | Back |
| `Shift + →/←` | Next / previous chapter |
| `1`–`9` | Jump to chapter |
| `R` | Restart |
| `C` | Hide / show caption (if you'd rather narrate) |
| `T` | Hide / show English translations under Hindi messages |
| `?` | Shortcuts |

- The URL tracks your place (`?b=12`), so you can refresh or jump straight to a beat when a judge asks something.
- `?auto=1` turns the story into a self-running walkthrough.
- The story makes no network calls. Only `/try` uses the AI, and the sample photos fall back to pre-made listings if the AI is busy.
- Before the call: open `/try` once, allow the microphone, and try one voice note on the same network you'll present from.

## Editing content

| What | Where |
|---|---|
| Story beats, captions, chat messages | `src/story/script.ts` |
| Team name, recordings link (shows a QR on the last screen), field quotes and photos | `src/data/site.ts`, `public/field/` |
| Shop products (prices, names, art) | `src/data/products.ts`. Put a real photo at `public/products/<id>.jpg` and set `photo: "/products/<id>.jpg"` on the product |
| Dashboard data | `src/data/insights.ts` |
| Try-page sample phrases and fallback listings | `src/data/samples.ts` |
| AI prompt and model settings | `src/lib/gemini.ts` |
