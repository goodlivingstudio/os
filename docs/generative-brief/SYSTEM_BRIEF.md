# Dispatch — Design System Generative Brief

> This document is the primary context file for any AI agent generating UI components, pages, or patterns for Dispatch. Read and internalize this entire document before writing any code. Every visual decision you make must be traceable to a principle stated here.

---

## 1 — What Dispatch Is

Dispatch is a personal intelligence system: directed intelligence for strategic positioning across technology, culture, and healthcare.

It is a signal processing environment — a surface where raw information from the world is ingested, classified, analyzed, and synthesized into strategic insight for a single operator. It tracks five intelligence layers (Opportunity, Position, Discipline, Landscape, Culture) across three domains (technology, culture, healthcare) to surface convergence, challenge assumptions, and sharpen positioning.

Dispatch is not a news reader. It is not a feed aggregator. It is not an AI chatbot with a sidebar. It is a *directed* intelligence — it has a mandate, a point of view, and a five-year horizon. Every signal that enters the system is evaluated against that mandate. Every synthesis it produces is in service of strategic positioning.

The design system exists to make two things visible at all times: **what the world is saying** and **what the machine thinks it means.**

### What it is not

These boundaries are load-bearing. They define Dispatch's character by what it refuses to become:

- Not a news reader — it doesn't aggregate for browsing. Every signal is classified, scored, and positioned against the operator's strategic context
- Not a dashboard — it doesn't report metrics. It processes intelligence
- Not a general-purpose assistant — it has a specific mandate and refuses questions outside its territory
- Not a notification system — it doesn't interrupt. It synthesizes on the operator's schedule
- Not neutral — it has opinions, names noise explicitly, and challenges weak reasoning
- Not decorative, performative, or ordinary

These negations have direct design consequences. A system that is "not a news reader" means feed cards are never presented without classification. A system that is "not neutral" means the machine's analysis is always labeled and always takes a position. A system that is "not decorative" means every visual element earns its presence through function.

---

## 2 — Design Philosophy

### The foundational duality: Signal and Synthesis

Dispatch operates at the intersection of two voices — the world coming in and the machine processing what it means. This duality is the design's organizing principle. Every component exists on one side of this line:

**Signal** — raw intelligence from the world. Articles, podcasts, trends, data points. The voice of sources, journalists, analysts, researchers. Signal enters the system unprocessed and is presented in the operator's reading voice. Signal is the *input*.

**Synthesis** — the machine's analysis, classification, and challenge. Cerebro (the Chief of Staff) processes signal through five intelligence layers and produces briefings, provocations, pattern detection, and strategic recommendations. Synthesis is the *output*.

The design system makes this distinction visible through typography, color, and spatial organization. A user should be able to scan any screen and immediately sense which content arrived from the world and which was produced by the machine.

### Three material skins, not themes

Dispatch expresses itself through three material skins — Mineral, Slate, and Forest — each grounded in physical texture rather than digital abstraction:

- **Mineral** — warm earth and amber. The default expression. Feels like sandstone, copper, ochre. The accent is a warm gold that suggests refinement without opulence.
- **Slate** — cool steel and ink. Feels like brushed metal, deep water, graphite. The accent is a muted cerulean.
- **Forest** — deep green and moss. Feels like lichen, oxidized copper, wet stone. The accent is a natural green.

Each skin defines ten semantic color slots across dark and light modes, designed as complementary pairs — not inversions. The dark mode is the canonical expression. Light mode exists as a contextual variant.

The skins are not "themes" in the toggle-and-forget sense. Each one shifts the emotional temperature of the entire interface. Mineral is authoritative and warm. Slate is analytical and cool. Forest is grounded and organic. The operator chooses the skin that matches how they want to think.

### Intelligence has a color: the skin accent

Each skin's accent color (`accent-secondary`) is the signal that the machine is present. In Mineral, this is warm amber (#B8956A). It appears on:

- Cerebro section labels (SYNOPSIS, RELEVANCE, CURRENT BRIEFING, CHALLENGE)
- Active status indicators
- Intelligence layer classification
- The operator's strategic context markers

The accent is **never decorative**. If an element uses the accent color, Cerebro is present — classifying, analyzing, or synthesizing. Every use must pass this test: *"Is the machine's intelligence visible here?"* If the answer is no, the element should not use the accent.

### Two typefaces, two voices

The typography system encodes the Signal/Synthesis duality:

- **Geist** — the signal voice. Used for: headlines, article summaries, operator input, episode titles, feed content, and any text that arrived from the world or was written by the operator. Its character says: *this came from outside the machine.*

- **Geist Mono** — the synthesis voice. Used for: Cerebro briefings, signal analysis, pattern descriptions, provocation text, section labels, system status, and any content the machine produced. Its character says: *the machine processed this.*

This split is **semantic, not decorative**. It embodies the core duality — Signal and Synthesis made typographically visible. Do not mix them within a single card. A card is either signal or synthesis. If you are unsure which typeface to use, ask: "Did this come from the world, or did the machine produce it?"

**Inter** appears only in the design system documentation canvas — never in the product interface.

### The surface language

Dispatch uses opaque, material fills — not translucent layers. Each skin defines specific hex values for backgrounds, surfaces, and elevated elements. Cards sit on surfaces. Surfaces sit on backgrounds. The hierarchy is:

- `bg-primary` — the ground state
- `bg-surface` — cards, panels, content containers
- `bg-elevated` — hover states, pills, secondary containers
- `accent-primary` — the machine's ambient presence (Cerebro band backgrounds)

There are no drop shadows. Depth is communicated through fill value and border, not elevation. Components are seated in the surface, not floating above it.

### Restraint is the proof of quality

Dispatch serves a single operator making strategic decisions over a five-year horizon. The interface must communicate authority through restraint:

- Typography is medium-weight, not bold, at most sizes. Headlines use 600 (semibold) — never 700 or 800
- The color palette is desaturated and warm. The utility colors (Option E) were derived through split-complementary color theory anchored to Mineral's amber — not selected from a default palette
- Spacing is generous. Cards breathe. Sections have clear separation
- Every element earns its space by serving a function

The Wise Counselor voice — composed, direct, unhurried — extends to the visual language. Nothing urgent. Nothing flashy. Nothing that would feel out of place in a room where serious decisions are being made.

---

## 3 — Core Design Principles

### Clarity over density
Every component must communicate its purpose within 3 seconds. If a screen requires explanation, it's over-designed. Strip excess to maximize signal.
**Test:** Can this component lose any element and still function? If yes, remove the element.

### Signal integrity
Every piece of content must be identifiable as either signal (from the world) or synthesis (from the machine). The typography, color, and spatial treatment must make this distinction without requiring labels.
**Test:** Cover the labels. Can you still tell which content is signal and which is synthesis from the typography alone?

### Compositional discipline
Four border radii. Seven spacing values. Three typefaces with strict role assignment. The constraint is the feature. If a design need doesn't map to an existing token, the design need should be reconsidered before a new token is invented.
**Test:** Does this component use only values from the token system? If it requires a new token, flag it — don't invent one.

---

## 4 — Token Architecture

### Color Primitives (Mineral Dark — canonical)

| Role | Variable | Value | Usage |
|------|----------|-------|-------|
| Canvas | `--bg-primary` | `#0E0D0B` | Page background, ground state |
| Surface | `--bg-surface` | `#1A1815` | Cards, panels, content containers |
| Elevated | `--bg-elevated` | `#252220` | Hover states, pills, secondary containers |
| Machine presence | `--accent-primary` | `#2A1A0A` | Cerebro band, machine analysis containers |
| Intelligence signal | `--accent-secondary` | `#B8956A` | Cerebro labels, active states, machine presence |
| Intelligence muted | `--accent-muted` | `#C8A87A` | Hover accent, secondary machine signal |
| Text — Primary | `--text-primary` | `#F0EDE8` | Headlines, primary content |
| Text — Secondary | `--text-secondary` | `#A8A29B` | Body text, descriptions |
| Text — Tertiary | `--text-tertiary` | `#8A8480` | Metadata, timestamps, recessive information |
| Border | `--border` | `#2C2820` | Dividers, card borders, separators |
| System — Live | `--live` | `#4ADE80` | Live status indicator |
| System — Synth | `--synth-indicator` | `#3E3224` | Synthesis processing indicator |

### Intelligence Layer Colors (Option E — Considered Contrast)

Derived through split-complementary color theory anchored to Mineral's warm amber. Every color WCAG AA compliant across all six backgrounds.

| Layer | Dark Mode | Light Mode | Contrast (Dark) | Contrast (Light) |
|-------|-----------|------------|-----------------|-------------------|
| Opportunity | `#D4A05A` | `#8C6A3B` | 8.3:1 AAA | 4.5:1 AA |
| Position | `#5A9EB0` | `#447784` | 6.4:1 AA | 4.5:1 AA |
| Discipline | `#7BAF6A` | `#557949` | 7.6:1 AAA | 4.5:1 AA |
| Landscape | `#9A85B8` | `#786890` | 5.9:1 AA | 4.6:1 AA |
| Culture | `#C87A6A` | `#9C5F53` | 6.0:1 AA | 4.6:1 AA |

### Typography Scale

| Role | Family | Weight | Size | Line Height | Voice |
|------|--------|--------|------|-------------|-------|
| Page title | Geist | 400 | 32px | 1.15 | Signal |
| Card heading | Geist | 600 | 22px | 1 | Signal |
| Feed headline | Geist | 600 | 15px | 21px | Signal |
| Signal body | Geist | 400 | 13px | 20.8px | Signal |
| Ticker text | Geist | 400 | 12.5px | — | Signal |
| Eyebrow metadata | Geist | 400 | 10px | — | Signal |
| Synthesis body | Geist Mono | 500 | 12px | 19px | Synthesis |
| Cerebro label | Geist Mono | 500 | 10px | — | Synthesis (uppercase, accent color) |
| System status | Geist Mono | 500 | 11px | — | Synthesis (uppercase) |
| Category badge | Geist | 500 | 9px | — | Signal (uppercase) |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `spacing/2` | 2px | Hairline gaps, fine adjustments |
| `spacing/4` | 4px | Tight internal spacing |
| `spacing/8` | 8px | Standard internal gaps |
| `spacing/12` | 12px | Medium gaps, button padding |
| `spacing/16` | 16px | Card padding |
| `spacing/24` | 24px | Section padding |
| `spacing/32` | 32px | Panel padding |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius/sm` | 4px | Badges, tags, fine details |
| `radius/md` | 8px | Buttons, interactive elements, toggles |
| `radius/lg` | 14px | Cards, modals, content containers |
| `radius/pill` | 9999px | Pill filters, dots |

---

## 5 — Component Patterns

### The component hierarchy

**Primitives** — Status dots, layer dots, category badges, layer pills, skin dots, dividers
**Buttons** — Primary (send), Listen, Bump, Pill filter, Close, New Session, Text Link
**Cards** — Feed Card, Signal Tooltip, Episode Card, Synthesis Card, Provocation Card, Pattern Card
**Compound** — Ticker Bar, Left Rail (identity + status + toggle + pills), Chief of Staff Band, Chat Input
**Layout** — Signal View, Audio View, Synthesis View, Zen View

### Component conventions

Every component must:

1. **Use CSS variables, never hardcode values.** No hex colors, no pixel values for spacing in component files. Everything references the token system via `var(--token-name)`.
2. **Respect the voice assignment.** Components displaying signal content use Geist. Components displaying synthesis content use Geist Mono. The typeface choice documents the content's origin.
3. **Use only the four radius tokens.** 4px, 8px, 14px, or 9999px. If none of these feel right, reconsider the component's structure.
4. **Label machine intelligence.** Every Cerebro section label uses `accent-secondary` color. This is the consistent marker that says "the machine processed this."
5. **Organize by voice.** Cards are either signal or synthesis — never mixed. The spatial grouping on a page should cluster signal cards together and synthesis cards together.

---

## 6 — Dispatch's Character in the Interface

The Wise Counselor voice governs all machine-generated content:

**Composed, direct, unhurried** — No urgency theater. No alarmist framing. The interface communicates the same way: no pulsing badges demanding attention, no red warning states for non-critical information.

**Names tradeoffs explicitly** — The machine distinguishes signal from noise. The interface does the same: important content uses `text-primary` and `text-secondary`. Noise is either absent or clearly recessive at `text-tertiary`.

**Challenges weak reasoning** — The Provocation Card exists because the machine pushes back. The interface should never feel sycophantic — no celebratory animations, no "great choice!" confirmations.

**Information quality labeling** — The machine labels its claims: established fact, informed inference, working assumption, speculation. The interface should make the confidence level of any synthesis visible through typography treatment and spatial hierarchy.

---

## 7 — What This System Is Not

- It is not a generic dark UI kit. The specific combination of material skins, dual-typeface voice, and single-accent intelligence signal is what makes it Dispatch. Strip any one and it becomes generic.
- It is not a dashboard template. Dispatch processes intelligence, it doesn't report metrics. Components should never feel like widgets.
- It is not decoration-forward. If an element exists only for visual interest, it does not belong.
- It is not The Machine. Dispatch shares some DNA (the voice duality, the accent-as-intelligence-marker) but has its own material language, its own color theory, its own spatial logic. Do not copy Machine patterns into Dispatch.

---

## 8 — Agent Instructions

When generating new components or modifying existing ones:

1. **Read this brief first. Every time.** Then read the relevant component brief in `COMPONENT_BRIEFS.md`, then check `ANTI_PATTERNS.md`.
2. **Internalize the duality.** Signal (the world arriving) and Synthesis (the machine processing) must both be present and visually distinct. If your output makes it hard to tell which is which, it fails.
3. **Default to restraint.** When in doubt, the more restrained option is correct. Composed, direct, unhurried.
4. **Never invent new tokens.** If the token doesn't exist for what you need, flag it for human review.
5. **Respect the voice system.** Before setting a typeface, ask: "Did this come from the world, or did the machine produce it?"
6. **The final test:** Does this look like it belongs in a room where a strategic advisor is quietly briefing their principal? If it looks like a news app, it fails. If it looks like a dashboard, it fails. If it looks generic, it fails.
