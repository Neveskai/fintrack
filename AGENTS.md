# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

FinTrack (package: `fintrack`) is a React SPA for personal credit-card expense tracking (Brazilian Portuguese UI). No custom backend — it uses Firebase (Auth, Firestore) and optionally Google Gemini AI for OCR. See `README.md` for full architecture and setup docs.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `yarn install` |
| Dev server | `yarn dev` (port 3000, host 0.0.0.0) |
| Build | `yarn build` |
| Type check | `yarn lint` (runs `tsc --noEmit`) |
| ESLint | `npx eslint .` |
| Unit tests | `yarn test` (Jest + React Testing Library) |
| Coverage | `yarn test:coverage` |

### Environment variables

The four required Firebase secrets (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`) are injected from Cursor Cloud Secrets. The update script writes them into `.env` automatically. If running locally without secrets injection, copy `.env.example` to `.env` and fill in your Firebase project values.

### Known pre-existing issues

- `yarn lint` (tsc) has ~30 type errors — these are pre-existing in the codebase (Chakra UI v3 type mismatches, unused variables, etc.).
- `npx eslint .` has 5 pre-existing `no-unused-vars` errors.
- Without real Firebase credentials, clicking "Entrar com Google" produces an `auth/invalid-api-key` console error. This is expected behavior.

### Gotchas

- The Gemini AI client (`src/common/services/OCR/ocr.service.ts`) is lazy-initialized to avoid crashing at module load when `GEMINI_API_KEY` is not set. It also has a rate limiter (10 req/min).
- The auth store (`src/common/stores/auth/auth.store.ts`) has a 2-second timeout to prevent infinite loading when Firebase auth is misconfigured.
- Vite replaces the **exact tokens** `process.env.GEMINI_API_KEY` and `process.env.GEMINI_MODEL` at build time via the `define` block in `vite.config.ts`. Do NOT wrap these in `typeof process` guards or use optional chaining (`process.env?.X`) — either will prevent the replacement. Never use `VITE_` prefix for `GEMINI_API_KEY` to avoid client-side exposure.
- Tests use Jest + React Testing Library. Tests live next to source as `*.test.ts` / `*.test.tsx`. Use `src/test-utils.tsx` for custom `render` with Chakra and React Query providers.
- Security rules are in `firestore.rules` and `storage.rules` — deploy with `firebase deploy --only firestore:rules,storage:rules`.
- Netlify config is in `netlify.toml` with security headers (CSP, HSTS, etc.).
