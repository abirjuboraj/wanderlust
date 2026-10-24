<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Single Next.js 16 app (not a monorepo): App Router routes in `src/app`, UI in `src/components`, helpers in `src/lib`. Early-stage travel landing page — `src/app/page.tsx` is still mostly scaffold. React 19.3, TypeScript `strict`, path alias `@/*` → `./src/*`.

## Commands (no test suite, no CI, no formatter, no pre-commit)

- `npm run dev` — dev server (Turbopack). Also (re)writes the managed block above; commit `AGENTS.md` with your work instead of fighting it.
- `npm run lint` — ESLint flat config (`eslint.config.mjs`); the script is plain `eslint`, not `next lint`. It may already fail in shadcn-generated `src/components/ui/carousel.tsx` (`react-hooks/set-state-in-effect`) — don't assume you caused it.
- Typecheck: `npx tsc --noEmit` (no npm script). `LayoutProps`/`PageProps` come from generated route types in `.next/` (via gitignored `next-env.d.ts`) — on a fresh clone, run `npm run dev` or `npm run build` once first or typecheck fails.
- Verify with `npm run lint` + `npx tsc --noEmit`; `npm run build` for the production build.

## UI / styling (differs from defaults)

- shadcn-style components use style `base-nova` built on **Base UI** (`@base-ui/react`), **not Radix**. They live in `src/components/ui`; add more with `npx shadcn add <component>` (`components.json` holds the config).
- `cn` comes from the `cn` package: `import { cn } from "cn"` (UI components import it directly; `src/lib/utils.ts` just re-exports it). Don't add `clsx`/`tailwind-merge`.
- Tailwind CSS v4 is CSS-first: theme tokens live in `src/app/globals.css` (`@theme inline` + CSS variables) — there is no `tailwind.config`. The CSS loader is wired in `next.config.ts` under `turbopack.rules`, so edit that config rather than adding a Tailwind PostCSS setup.

## Next.js specifics

- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler` in devDependencies).
- Use the generated route helpers (`LayoutProps<"/">`, `PageProps<'/route'>`); they are globally available after typegen — do not import them.
- Bundled docs for this exact Next version: `node_modules/next/dist/docs/` — read the relevant guide there before writing Next.js code (see managed block above).
