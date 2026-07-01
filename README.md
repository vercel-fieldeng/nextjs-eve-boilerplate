# nextjs-eve-boilerplate

A Next.js app with an [eve](https://www.npmjs.com/package/eve) agent wired in via `withEve()`. The agent runs alongside the Next.js dev server and is reachable same-origin, with a simple chat interface as the homepage.

## Prerequisites

- Node 24 (pinned in `.node-version` and `package.json#engines`)
- pnpm
- A model credential — either run `pnpm exec eve link` to pull Vercel AI Gateway credentials, or set `AI_GATEWAY_API_KEY` / `ANTHROPIC_API_KEY` in `.env.local`

## Getting started

```bash
pnpm install
pnpm exec eve link   # or set a model credential manually, see above
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to talk to the agent.

## Project layout

- `app/` — the Next.js frontend (App Router). `app/page.tsx` is the chat interface, built with `useEveAgent` from `eve/react`. It doesn't persist messages or threads — refreshing starts a new session.
- `agent/` — the eve agent, authored as files on disk:
  - `agent.ts` — runtime config (model, etc.)
  - `instructions.md` — the agent's always-on system prompt
  - `channels/eve.ts` — the built-in HTTP channel's auth policy
  - add `tools/`, `connections/`, `skills/`, etc. here as needed
- `next.config.ts` — wraps the Next.js config with `withEve()` so the eve routes mount on the same origin (no CORS, no separate URL to configure)

## Useful commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start Next.js and the eve dev server together |
| `pnpm exec eve info` | Show discovered agent files and diagnostics |
| `pnpm exec eve dev` | Start eve's standalone terminal UI against the local agent |
| `pnpm build` | Production build |
| `pnpm exec eve link` | Link this project to Vercel and pull AI Gateway credentials |
| `pnpm exec eve deploy` | Deploy the agent + app to Vercel |

## Learn more

- [eve docs](https://www.npmjs.com/package/eve) — bundled locally at `node_modules/eve/docs/` once installed
- [Next.js docs](https://nextjs.org/docs)
