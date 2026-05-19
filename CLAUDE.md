# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step. Open `NFFL War Room.html` directly in a browser, or deploy to Netlify by connecting the repo — set publish directory to `/` (root). React 18, ReactDOM, and Babel are loaded from unpkg CDNs; `app.jsx` is transpiled in-browser.

## Architecture

This is a zero-dependency, no-build React app:

| File | Role |
|---|---|
| `NFFL War Room.html` | Entry point — loads CDN scripts, `data.js`, then `app.jsx` via `type="text/babel"` |
| `data.js` | Sets `window.LEAGUES`, `window.SEED_RESPONSES`, `window.ADMIN_NAME` as globals |
| `app.jsx` | All React components in one file: `Landing → NamePicker → PollGrid` |
| `tokens.css` | CSS custom properties (colors, type, spacing) — Oswald / Barlow fonts |
| `app.css` | Component styles, references token variables |

**Routing** is plain React state in `App`. `route.name` is one of `landing | picker | grid`.

**State persistence**: Supabase (`responses` table). No localStorage. See Supabase section below.

**Admin access**: Picking the name `Ken` silently sets `isAdmin = true` (checked against `window.ADMIN_NAME`). Admin can edit any manager's row.

## Key Domain Logic

- **Response cycle**: `null → yes → ok → maybe → no → null` (defined as `CYCLE` array; `RMAP` holds labels/colors per state).
- **Best date scoring**: `(yes × 2) + ok` per date column. Ties are all shown as "Best".
- **BusyModal**: fires when the current user's "no" count crosses from ≤5 to >5 (edge-triggered via `prevNoCount` ref).
- **Fex logo**: `logoPlaceholder: true` in `data.js` causes a CSS overlay ("Fex" text over the Wags shield). Set to `false` and swap `logo` path once `assets/nffl-fex.png` is provided.

## Supabase

All state lives in Supabase — managers share live responses across sessions via Realtime.

**Target data model** (single table):

```sql
responses (
  league_id   text,         -- 'wags' | 'fex'
  manager     text,         -- manager name, e.g. 'Ken'
  date_id     text,         -- date slot id, e.g. 'd0'
  value       text,         -- null | 'yes' | 'ok' | 'maybe' | 'no'
  note        text,
  PRIMARY KEY (league_id, manager, date_id)
)
```

**Integration points in `app.jsx`**:
- `dbLoad(leagueId)` — selects all rows for the league on mount; merges into state
- `dbUpsert(leagueId, manager, managerData)` — upserts one row per manager; strips null votes before writing; called immediately on cell click, on blur for notes
- Realtime channel (`responses:{leagueId}`) — subscribes to `postgres_changes` on the `responses` table; merges incoming rows into state so all open sessions stay in sync

**Credentials**: stored in `config.js` as `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY`. The anon key is safe to commit — it's designed for client-side use and is locked down by RLS.

**RLS policy**: all reads and writes are open (no auth). Commissioner trust model — no user accounts.

## Dates

Dates are generated at runtime in `data.js`: Sun Aug 23 → Wed Sep 9 2026, skipping Fri/Sat. Changing the season means updating `start`/`end` in `generateNFFLDates()` and bumping the localStorage key version suffix (`v2`) to avoid stale data.

## Design System

Fonts loaded from Google Fonts (Oswald 400/600/700, Barlow, Barlow Condensed). All sizes in `app.css` are relative (`rem`) off the `18px` base set on `<html>`. Token variables live in `tokens.css`.
