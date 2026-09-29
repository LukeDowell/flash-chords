# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server on port 3005.
- `npm run build` — production build (Next.js).
- `npm run start` — serve the built app (respects `PORT`, defaults to 8080).
- `npm run lint` — `next lint`.
- `npm test` — Jest in watch mode.
- `npm run test:ci` — Jest single-run (used in CI).
- Run a single test file: `npx jest src/lib/music/Chord.test.ts`
- Run tests by name: `npx jest -t "voicing"`

Node >= 18. TypeScript path aliases (`@/lib/*`, `@/components/*`, `@/app/*`, `@/styles/*`, `@/public/*`) are configured in both `tsconfig.json` and `jest.config.js` — keep them in sync when adding new roots.

## Architecture

Next.js App Router (`src/app/`) with MUI + Emotion. Root layout (`src/app/layout.tsx`) wraps children in `AppRouterCacheProvider` + MUI `ThemeProvider` + `AppDrawer` navigation. Routes: `/` (practice), `/progression`, `/scale`, `/altscale`, and `/api/health`.

The domain lives in `src/lib/`:

- `src/lib/music/` — pure music-theory primitives: `Note`, `Chord`, `Scale`, `Circle` (circle of fifths), and `MidiPiano`. These have no React or DOM dependencies and are heavily unit-tested. Prefer extending these over inlining logic in components.
- `src/lib/music/MidiPiano.ts` — in-memory model of the keyboard state. Components subscribe to it rather than to raw MIDI events; this is the pub/sub layer that lets tests exercise chord detection without a real device.
- `src/lib/vexMusic.ts` / `vexRenderer.ts` — bridges the music primitives to VexFlow rendering on a canvas/SVG.
- `src/lib/exercise/exercise.ts` — exercise generation (which chord to prompt next).
- `src/lib/react/contexts.tsx` + `hooks.tsx` — shared React context/hooks (e.g. MIDI access, settings).

Component layer (`src/components/`):

- `interactivestaff/InteractiveStaff` — VexFlow-backed staff that responds to played notes.
- `practice/PracticePage` — main practice loop, wires MIDI input → `MidiPiano` → exercise + staff + voicing history.
- `exercises/{Exercise,DiatonicChordExercise,NotesExercise}` — exercise variants.
- `midi-input-selector`, `midi-sound-selector` — Web MIDI device pickers; audio playback uses `smplr`.
- `settings/PracticeSettings` — user-adjustable practice parameters.

### Testing MIDI without a device

`src/note-emitter.tsx` exports `NoteEmitter`, a fluent test helper that queues `keyDown`/`keyUp`/`keyPress`/`wait` actions and dispatches synthesized `MIDIMessageEvent`s into a hook. Use it in tests instead of trying to mock the Web MIDI API directly.

### Chord/voicing validation

Chord voicing correctness is centralized in `Chord.ts` (see the dev-journal notes in `README.md` for the algorithm's history). When adding chord qualities or alternate voicings, extend the data structures there rather than adding ad-hoc checks in components.

## Conventions

- Client components: files under `src/app/` and interactive components use `'use client'` (layout, pages, and MUI-consuming components all do).
- Styling: MUI theme in `src/styles/`; avoid raw CSS files.
- Jest: `jsdom` environment, `resetMocks: true`, setup in `src/jest.setup.tsx`. Test files live next to source as `*.test.ts(x)`.
