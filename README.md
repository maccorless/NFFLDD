# NFFL War Room — NFFL Draft Date Aligner

A two-league draft-date voting app for the NFFL Wags & NFFL Fex fantasy football leagues. Built mobile-first responsive in plain HTML / CSS / React (Babel-in-browser, no build step).

## What's in here

| File | Purpose |
|---|---|
| `index.html` | Entry point — open in a browser or served automatically by Netlify |
| `app.jsx` | All React components (landing, name picker, poll grid, modal) |
| `app.css` | App-specific styles |
| `tokens.css` | NFFL design tokens (colors, type, spacing) |
| `data.js` | Leagues, managers, dates, response seeds |
| `assets/nffl-wags.png` | NFFL Wags logo |
| `audio/mnf.mp3` | Monday Night Football theme — plays on landing |

## Flow

1. **Landing** — Wags logo (left) + Fex logo (right). MNF theme autoplays.
2. **Name picker** — pick your manager from 12 tiles. Picking `Ken` silently grants commish admin.
3. **Poll grid** — table view; all 12 managers × 14 draft-night dates (Sun Aug 23 → Wed Sep 9, 2026, no Fridays/Saturdays).
   - Click a cell to cycle: empty → yes → not ideal → maybe → no → empty.
   - Best column is the highest `(yes × 2) + ok` score.
   - Marking 6+ "No" responses for yourself triggers the *"Are you really that busy?!?"* modal.
   - Admin (Ken) can edit any row.

State persists to `localStorage` per league. No backend.

## Running

Open `index.html` in a browser locally, or deploy to Netlify — connect the repo, publish directory `/`, no build command.

## TODOs

- **Add a real `assets/nffl-fex.png`** (currently the Wags shield is reused for Fex with a red "Fex" script overlay)
- Set `logoPlaceholder: false` in `data.js` once the Fex logo is in
- Backend / shared state if multiple users should sync in real time
