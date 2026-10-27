# Our Nest — Omar & Rowan

This folder contains the complete tracked source of your published app, including the isometric house, animated couple, inventory screens, API routes, database migrations, assets, dependency lockfile and checks.

## Save on your Windows PC
Right-click Our-Nest-Project.zip, choose Extract All, and choose a destination such as Documents. The archive creates a folder named Our-Nest.

## Run locally
Install Node.js 22.13 or later, then open PowerShell in this folder. Internet access is required to install dependencies.

```powershell
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_secret_black_widow.sql
pnpm run dev
```

Apply the database migration only once for a fresh local database. Open the localhost URL printed by the development server, usually http://localhost:5173. Stop with Ctrl+C.

## Source map
- app/LivingHouse.tsx: house, furniture, characters, animation and room navigation
- app/page.tsx: inventory and shopping-list interface
- app/globals.css: appearance and transitions
- app/api/items/route.ts: item storage API
- app/api/photos/route.ts: photo upload and retrieval
- public/: static assets; the house and characters are drawn in SVG code
- db/ and drizzle/: database schema and migrations
- scripts/: framework integration, development tooling and geometry checks
- .openai/hosting.json: existing Site identity and storage bindings
- pnpm-lock.yaml and package.json: dependencies
- README.md: original framework documentation

## Checks
```powershell
node scripts/check-character-rig.mjs
node scripts/check-house.mjs
pnpm exec tsc --noEmit
```

## What this backup contains
This is a source-code backup. Installed dependencies, caches, credentials and Git internal state are excluded. Dependencies are restored with pnpm install. Build output is regenerated with pnpm run build. A copy of the published deployment archive is included in deployment/ when available.

Inventory records and uploaded item photos stored on the live server are separate from the source code and are NOT included. The local app starts with its own empty database and photo storage; it does not automatically connect to the live data.

This source passed its build, TypeScript and animation/geometry checks in the hosted development environment. Windows setup commands have not been executed on your PC.

Live app: https://our-nest-omar-rowan.blackgoat28.chatgpt.site
Source commit: 2b506598893cc0981d9b585c234b261bb0290df1
