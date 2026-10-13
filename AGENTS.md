<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Flash Chords — Agent Guide

Flash Chords (https://flashchords.app) is a piano practice app: it prompts chords, scales, and progressions, listens to a MIDI keyboard, and validates what the player actually plays. It is a long-running solo side project with a dev journal in `README.md` — read it for the history behind the architecture decisions below. Product direction lives in `doc/ROADMAP.md`.

## Commands

- `npm run dev` — Next.js dev server on port 3005.
- `npm run build` — production build (static export to `out/`, consumed by Capacitor).
- `npm run lint` — `next lint`.
- `npm test` — Jest in watch mode; `npm run test:ci` for a single run.
- Single file: `npx jest src/lib/music/Chord.test.ts`; by name: `npx jest -t "voicing"`.

Node >= 18. TypeScript path aliases (`@/lib/*`, `@/components/*`, `@/app/*`, `@/styles/*`, `@/public/*`) are configured in both `tsconfig.json` and `jest.config.js` — keep them in sync.

## Architecture

Next.js App Router (`src/app/`) with MUI + Emotion. Routes: `/` (chord practice), `/progression`, `/scale`, `/altscale`, `/api/health`.

- `src/lib/music/` — pure music-theory core: `Note`, `Chord`, `Scale`, `Circle` (circle of fifths), `MidiPiano`. No React or DOM dependencies; heavily unit-tested.
- `src/lib/midi/` — MIDI access behind a swappable provider (`midi-access.ts`): Web MIDI in browsers, `capacitor-provider.ts` wrapping `@eugabrielsilva/capacitor-midi-device` on iOS.
- `src/lib/vexMusic.ts` / `vexRenderer.ts` — bridge the music primitives to VexFlow (v5) rendering.
- `src/components/` — `practice/PracticePage` (main loop: MIDI input → `MidiPiano` → exercise + staff + voicing history), `exercises/`, `interactivestaff/`, device selectors, `settings/`.

## Hard-won constraints (from the dev journal — don't relearn these)

1. **The domain model is interval-first.** A `Scale` is a list of intervals; a `Key` is a scale plus a root; chord qualities derive from intervals. The first iteration hardcoded qualities and accidentals onto chords and collapsed under edge cases (half-diminished, B#dim, double sharps). When adding chord qualities or voicings, extend the data structures in `Chord.ts` — never inline theory checks in components.
2. **Web MIDI does not exist on iOS Safari/Chrome.** iOS support goes through the Capacitor provider. Never call `navigator.requestMIDIAccess` directly; go through `src/lib/midi/midi-access.ts`.
3. **Test MIDI without hardware.** `src/note-emitter.tsx` (`NoteEmitter`) queues `keyDown`/`keyUp`/`keyPress`/`wait` and dispatches synthesized `MIDIMessageEvent`s. Use it instead of mocking the Web MIDI API. Caveat the author learned the hard way: passing unit tests have shipped a broken device selector before — verify device-facing changes in a real browser.
4. **MIDI listeners leak closures.** Components must register listeners on `MidiPiano` with an id and clean up in the `useEffect` return. Stale-closure bugs from skipped cleanup cost days of debugging; preserve this pattern.
5. **No backend, by choice.** The original Spring backend was deleted; the app is a static export (also required for the Capacitor iOS build). Don't introduce server-side state without a roadmap-level reason.
6. **Real pianos are quirky.** Some keyboards never send `NOTE_OFF` — they send `NOTE_ON` with velocity 0. Handle both in anything touching raw MIDI bytes.

## Conventions

- Interactive components and everything under `src/app/` use `'use client'`.
- Styling: MUI theme in `src/styles/`, flexbox via the `styled` engine; no MUI Grid, no raw CSS files.
- Jest: `jsdom`, `resetMocks: true`, setup in `src/jest.setup.tsx`. Tests live next to source as `*.test.ts(x)`. Music-theory tests are parameterized tables of manually-validated chords — when fixing a theory bug, add the failing case to the table first.
- Flats are written as `b` (not `♭`) in code and symbols.
