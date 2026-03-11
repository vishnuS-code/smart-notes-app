# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Install all dependencies (root + server + client)
```bash
npm run install:all
```

### Run both frontend and backend concurrently
```bash
npm run dev
```

### Run backend only
```bash
npm run server
# or directly:
cd server && node index.js
```

### Run frontend only
```bash
npm run client
# or directly:
cd client && npm run dev
```

- Backend runs on **http://localhost:5001**
- Frontend runs on **http://localhost:5173**

## Architecture

This is a monorepo with two independent sub-projects:

```
notebook/
  package.json        # root — concurrently scripts only
  server/             # Node.js + Express backend
  client/             # React + Vite frontend
```

### Backend (`server/`)

**Layer structure**: `routes/` → `controllers/` → `services/`

- **Services** (`services/noteService.js`) own all JSON file I/O. They read the entire file, mutate the array, and write it back on every operation.
- **Controllers** handle HTTP request/response and call services.
- **Routes** wire Express router paths to controllers.
- **Data** is persisted in `server/data/notes.json`, auto-created on server start if missing.
- File uploads (PDF, DOCX) use **Multer memoryStorage** — files are never written to disk; `req.file.buffer` is passed directly to `pdf-parse` / `mammoth`.

**Critical route ordering**: In `notesRoutes.js`, `GET /search` is registered before `GET /:id` — reversing this breaks search.

**ESM gotcha**: `@vitalets/google-translate-api` is ESM-only. `translateController.js` uses `await import(...)` inside the async handler — a top-level `require()` will throw.

### Frontend (`client/`)

- **Vite proxy** forwards `/notes`, `/translate`, `/extract` to `http://localhost:5001`. All `axios` calls use a relative base URL `/`.
- **`src/services/api.js`** is the single module for all HTTP calls.
- **CSS variables** power the theme system. Variables are defined in `index.css` under `:root` (light) and `[data-theme="dark"]`. All component styles reference `var(--xxx)` — no hard-coded hex colors.
- **ThemeToggle** sets `data-theme` on `document.documentElement` and persists to `localStorage`. Read from `localStorage` in the `useState` initialiser to avoid flash on mount.
- **Framer Motion** handles animations. `AnimatePresence` wraps lists and page routes. Each animated list item needs a stable `key` (the item's `id`, never array index). Page transitions use `mode="wait"` with `location.key` as the AnimatePresence key.
- **Loader.jsx** exports three named components: `SkeletonCard` (CSS shimmer), `Spinner` (rotating circle), `DotsLoader` (staggered dots).
- `FileUpload` accepts an `uploadSuccess` boolean prop — when `true` it shows the green checkmark and hides the browse UI.
- **"Save as Note"** in PDFExtractor and WordExtractor calls `POST /notes` with the extracted text. A `.toast` CSS class handles the success notification.

### Component structure
```
components/
  Navbar.jsx        # sticky nav with links + ThemeToggle
  ThemeToggle.jsx   # sun/moon button, reads/writes localStorage
  NoteCard.jsx      # animated card with edit/delete
  FileUpload.jsx    # drag-and-drop, accepts uploadSuccess prop
  Loader.jsx        # SkeletonCard, Spinner, DotsLoader exports
pages/
  NotesDashboard.jsx
  TranslatePage.jsx
  PDFExtractor.jsx
  WordExtractor.jsx
services/
  api.js
```
