# Smart Notes Application

A full-stack notes app with reminders, translation, PDF extraction, and Word document extraction.

## Tech Stack
- **Frontend**: React 18 + Vite + Framer Motion
- **Backend**: Node.js + Express
- **Storage**: JSON files (`server/data/`)

## Prerequisites
- Node.js >= 18
- npm >= 9

## Setup

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Run both servers concurrently
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

### Manual install (alternative)
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /notes | List all notes |
| POST | /notes | Create note |
| GET | /notes/search?q= | Search notes |
| PUT | /notes/:id | Update note |
| DELETE | /notes/:id | Delete note |
| GET | /reminders | List all reminders |
| POST | /reminders | Create reminder |
| GET | /reminders/upcoming | Upcoming reminders |
| POST | /translate | Translate text |
| POST | /extract/pdf | Extract text from PDF |
| POST | /extract/docx | Extract text from DOCX |

## Notes
- Translation uses the unofficial Google Translate API (`@vitalets/google-translate-api`) and may be rate-limited.
- PDF and DOCX files are processed in memory — nothing is written to disk.
- JSON data files are auto-created in `server/data/` on first server start.
