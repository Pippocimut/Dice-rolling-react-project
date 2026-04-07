# CLAUDE.md — roll-a-die

This file contains project context for Claude Code. Edit any section to keep it up to date.

---

## Project Overview

**roll-a-die** is a collaborative dice-rolling web app for tabletop RPG sessions. Users create custom dice buttons with formulas, attach triggers (text, audio, button chains), organize them in sets, and share results in real time via Socket.io rooms.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 6 |
| State | Redux Toolkit 2.8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 + shadcn/ui (new-york style) |
| UI Primitives | Radix UI, Headless UI, Lucide icons |
| Math engine | mathjs 14 |
| Real-time | Socket.io-client 4.8 |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Persistence | localStorage + react-cookie |

---

## Scripts

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

---

## Directory Structure

```
src/
├── app/                        # Reserved (empty)
├── assets/                     # Static assets
├── components/
│   ├── dnd/                    # Drag-and-drop wrappers (SortableItem, SortableList, SortableOverlay)
│   ├── trigger-registry/       # Extensible trigger system (see Architecture section)
│   │   ├── rollTrigger/        # Dice roll triggers
│   │   ├── textTrigger/        # Text output triggers
│   │   ├── buttonTrigger/      # Button-press chain triggers
│   │   └── triggerRegistry.tsx # Registry entry point
│   ├── ui/                     # shadcn/ui primitives (button, dialog, etc.)
│   ├── Header.tsx
│   ├── DefaultDialog.tsx
│   └── ImportButton.tsx
├── context/
│   ├── SocketContext.ts
│   └── SocketContextProvider.tsx
├── features/
│   └── tag-managment/          # Tag management UI
├── hooks/
│   └── use-mobile.ts
├── lib/
│   └── utils.ts                # cn() helper
├── pages/
│   ├── main/
│   │   ├── RollCupPage.tsx     # Main dashboard
│   │   └── components/
│   │       ├── mainBody/       # Buttons, results, dialogs
│   │       │   ├── ButtonList/
│   │       │   ├── MainInfo/   # Roll result display
│   │       │   ├── dialogs/    # Modal forms for button management
│   │       │   └── pressButton.ts  # Trigger execution logic
│   │       └── NavHeader/      # Nav + audio controls
│   ├── history/                # Roll history page
│   ├── connect.tsx             # Socket room connection
│   ├── create-button.tsx
│   ├── edit-button.tsx
│   ├── export.tsx
│   ├── tags.tsx
│   └── index.tsx               # Router with all routes
├── store/
│   ├── button-sets/
│   │   ├── buttonSetSlice.ts   # Core Redux slice
│   │   ├── ButtonSetV1.3.ts    # Current data schema (v1.3)
│   │   ├── ButtonSetV1.2.ts    # Legacy schema
│   │   ├── ButtonSetV1.1.ts    # Legacy schema
│   │   ├── defaultTags.ts
│   │   ├── import.ts           # Version migration logic
│   │   ├── paths.ts            # Path resolution utilities
│   │   └── resolveEntity.ts    # Entity resolver from typed paths
│   ├── exportMenuSlice.ts
│   ├── historySidebarSlice.ts
│   ├── selectedSlice.ts
│   ├── settingsSlice.ts
│   ├── socketSlice.ts
│   └── index.ts                # Store configuration
├── App.tsx
├── AppProvider.tsx             # Redux + Socket providers
└── AppRouter.tsx
```

---

## Architecture

### Trigger Registry Pattern

Each trigger type (roll, text, button) is a handler object registered in `triggerRegistry.tsx`. Every handler implements:

- `label` — display name
- `defaultData` — factory for default trigger data
- `EditorComponent` — form shown when editing the trigger
- `CardComponent` — card shown in the button list
- `execute` — Redux thunk with full store access

Adding a new trigger type = adding a new handler and registering it. No other code changes needed.

### Redux Slices

| Slice | Responsibility |
|---|---|
| `buttonSetSlice` | Button sets, buttons, triggers, tags, positions |
| `historySidebarSlice` | Roll history (local + socket-received) |
| `selectedSlice` | Currently selected set / button / trigger IDs |
| `exportMenuSlice` | Export/import UI state |
| `settingsSlice` | App configuration |
| `socketSlice` | Socket room / username state |

### Data Schema & Versioning

- Current schema: **v1.3** (`ButtonSetV1.3.ts`)
- `import.ts` contains migration logic from older versions
- Global entity addressing uses typed `TriggerPath` objects (see `paths.ts`)

### Real-time Multiplayer

- Socket.io connects to `https://socket-dice-server-819188550192.europe-west1.run.app`
- Room-based: users join a room with a username
- Rolls are emitted and received bidirectionally

---

## Config Files

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite build, React plugin, Tailwind, `@` path alias |
| `tsconfig.app.json` | ES2020, strict, `@/* → ./src/*` alias |
| `eslint.config.js` | ESLint + TS ESLint + React hooks plugin |
| `components.json` | shadcn/ui config (new-york, lucide, CSS vars) |

---

## Notes

<!-- Add project-specific notes, conventions, or decisions here -->

- Path alias `@/` maps to `src/`
- Tailwind uses CSS variables for theming (shadcn/ui convention)
- Button sets are persisted to localStorage; import handles version migrations automatically
