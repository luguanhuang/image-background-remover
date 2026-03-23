# Image Background Remover

A lightweight MVP for the keyword **image background remover**, built with **Next.js + Tailwind CSS** and designed for **Cloudflare deployment**.

## What this MVP does

- Upload a single JPG, PNG, or WebP image
- Remove the background with the **remove.bg API**
- Preview the original image and transparent PNG result
- Download the processed PNG
- Explain privacy handling clearly

## Product constraints

- No login
- No database
- No object storage
- No batch processing
- Images are **not persistently stored by this app**
- Images are sent to **remove.bg** for background removal

## Tech stack

- Next.js App Router
- Tailwind CSS
- remove.bg API
- Cloudflare-ready setup via OpenNext

## Environment variables

Create a local `.env.local` file:

```bash
REMOVE_BG_API_KEY=your_remove_bg_api_key
```

Without `REMOVE_BG_API_KEY`, the homepage still loads, but background removal requests will fail.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Production build

```bash
npm run lint
npm run build
```

## Cloudflare preview

```bash
npm run cf:build
npm run cf:preview
```

## Cloudflare deploy

```bash
npm run cf:deploy
```

## Cloudflare Workers Builds settings

If you deploy from the Cloudflare dashboard with **Workers Builds**, do not use `npm run build` as the build command for this project.

This app uses OpenNext, so the dashboard should run one of these setups:

Option 1:

```bash
Build command: npm run cf:build
Deploy command: npm run cf:deploy
```

Option 2:

```bash
Build command: <leave empty>
Deploy command: npm run deploy
```

Using `npm run build` plus `npx wrangler deploy` will fail because `next build` does not generate the OpenNext deployment artifacts required by `opennextjs-cloudflare deploy`.

Before deploying, make sure you have:

- Wrangler authenticated
- A valid Cloudflare account / worker name
- `REMOVE_BG_API_KEY` configured as a Cloudflare secret

Example:

```bash
wrangler secret put REMOVE_BG_API_KEY
```

## Privacy notes

This app does **not** persistently store uploaded or processed images. Files are handled in memory during the active request and sent to remove.bg for processing. Response headers are returned with `Cache-Control: no-store`.
