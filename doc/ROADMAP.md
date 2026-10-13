# Flash Chords — Product Roadmap

Distilled from the dev journal (`README.md`, Jan 2022 – Sep 2024) and the state of the codebase as of October 2026.

## Guiding principle

From the January 2023 retrospective, the project stalls for exactly one reason:

> "I wasn't generating features that I personally found useful fast enough."

Every phase below is ordered by one question: **does this make the author (an intermediate jazz piano student) prefer practicing with the app over practicing without it?** Infrastructure and polish only earn a slot when they unblock that.

The minimum bar, stated in the journal and still unmet:

- Chord progressions rendered in the correct key with proper accidentals, symbol above the staff.
- A completion threshold per exercise (e.g. "4 clean runs at 90 bpm").
- Error feedback — show where the mistake was, ideally what it was.
- A record of practice over time.

## Where we are (October 2026)

**Done and solid:**
- Interval-first music-theory core (`Note`, `Chord`, `Scale`, `Circle`) — rewritten in 2023, heavily tested, has survived every feature since.
- VexFlow rendering, interactive/scrolling staff, beat indicator, ghost notes.
- Chord practice, progression, and scale exercise pages.
- MIDI access behind a swappable provider; hardware-free testing via `NoteEmitter`.
- iOS via Capacitor + static export — the "iPad problem" that blocked the project since day one is finally being executed.

**Promised in the journal, still missing:**
- Settings persistence (localStorage) — stated as a goal in 2022 and again in 2023.
- Per-exercise report card (accuracy, evenness, on-the-beat timing).
- Practice history / stats / calendar view.
- Exercise DSL; gamification; users.

## Phase 1 — Ship iOS (in progress)

The native wrapper exists; finish it.

- [ ] Validate the Capacitor MIDI provider against real hardware (quirks like velocity-0 `NOTE_OFF` substitutes).
- [ ] iPad-first layout pass on the practice and exercise pages (small-screen staff was explicitly deferred in the journal).
- [ ] App Store packaging: icons, splash, review requirements.
- [ ] Unsupported-browser messaging on web stays accurate now that iOS has a real path.

**Exit criterion:** the author's daily practice happens on the iPad with this app.

## Phase 2 — Stickiness core

The smallest set of features that makes daily use rewarding. This is the journal's "minimum feature set" from 2023, verbatim.

- [ ] **Persist settings** in localStorage (practice settings, selected MIDI device, chosen keys/qualities). Smallest long-promised win; do it first.
- [ ] **Per-exercise report card**: after a run, show accuracy, timing offset per note ("how off-center was each note"), and evenness. The MIDI event data (timestamps, velocity) is already captured — this is presentation work.
- [ ] **Error feedback in the moment**: when a voicing fails, show the required notes vs. what was played.
- [ ] **Completion thresholds**: an exercise config declares its bar (n clean runs at x bpm) and reports pass/fail.

**Exit criterion:** finishing an exercise tells you something you didn't already know about your playing.

## Phase 3 — Progress over time

Make improvement visible, because "it's not interesting enough to expect the user to notice their progress on their own."

- [ ] Store exercise results locally (still no backend — IndexedDB/localStorage).
- [ ] GitHub-style practice calendar.
- [ ] Trend views: highest clean bpm over time, accuracy by key / chord quality, timing evenness. D3 was the journal's chosen tool; any lightweight approach is fine as long as the staff SVGs can be annotated.

## Phase 4 — Exercise breadth

More kinds of practice, cheaply authored.

- [ ] An exercise definition format (the journal sketched a scale-degree DSL, then leaned toward extending VexFlow's EasyScore grammar — decide and commit).
- [ ] Exercise types from the journal backlog: inversions, rootless voicings and shells, scale runs, arpeggios/interval patterns, melodic cells.
- [ ] "Snappy mode": staff advances as fast as you play, evenness reported afterwards (Sept 2024 idea).

## Phase 5 — Gamification

Only after Phases 2–3 exist, since it decorates data they produce.

- [ ] Skill tree (Khan-Academy-style map of keys/techniques) with Duolingo-style decay nudging daily review.
- [ ] Target feel: "between Duolingo's 3-star system and RuneScape's grind-fest."

## Deferred / non-goals

- **Users, logins, dashboards** — repeatedly deferred in the journal; requires a backend and isn't needed for a single-player local app.
- **Teacher tools / monetization** (assignments, student progress) — the 2022 monetization idea; revisit only if Phase 5 ships and there's outside demand.
- **A backend of any kind** — the Spring app was deleted for good reason; local-first until users exist.
- **In-app staff/sheet editor** — a 2022 vision; large, and nothing above depends on it.
