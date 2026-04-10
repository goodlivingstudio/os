# DISPATCH — Anti-Patterns
Established: 2026-04-06

*This document is the design system's immune system. Every entry represents a pattern that has been proposed, implemented, or suggested by an AI agent and rejected by the design director. Agents must read this before generating any UI component, layout, or visual treatment for Dispatch.*

*When you encounter a new bad pattern in production or in a suggestion, add it here with a date and a one-line explanation of why it fails. This doc grows. That's the point.*

*Authority: SYSTEM-BRIEF.md defines what Dispatch should look like. This document defines what it must never look like. Both are required reading before any UI work.*

---

## THE STANDARD

Dispatch is a directed intelligence system for a single operator making strategic decisions over a five-year horizon. The interface communicates authority through restraint. Every element earns its presence through function. If a design choice would feel at home in a generic SaaS dashboard, a consumer news app, or a template marketplace preview — it does not belong here.

The test is not "does this look good." The test is: **does this look like it belongs in a room where a senior advisor is quietly briefing their principal?** If the answer is no, stop.

---

## TYPOGRAPHY ANTI-PATTERNS

### Never use bold weights above 600
Dispatch headlines use 600 (semibold). Never 700, never 800, never "font-bold" in Tailwind. Heavy weights signal urgency and retail energy. Dispatch is composed and unhurried. If something needs emphasis, it earns it through hierarchy and position, not weight.

### Never mix voice typefaces within a single card
A card is either signal (Söhne) or synthesis (Söhne Mono). Never both. If you are unsure which typeface to use, ask: "Did this come from the world, or did the machine produce it?" That answer determines the typeface. There is no third option.

### Never use decorative or display typefaces
No serif accent fonts. No handwritten fonts. No display faces for "personality." Dispatch has two typefaces and they are semantically assigned. A third typeface breaks the voice system and makes the interface feel themed rather than systematic.

### Never default to centered text
Body text, card content, labels, and metadata are left-aligned. Center-alignment is permissible only for single-line masthead elements. Centered paragraphs are never acceptable. Centered headings above left-aligned body text create a visual disconnect that reads as template design.

### Never use ALL CAPS for body or heading text
Uppercase is reserved for section labels and system status indicators, always at small sizes (9–11px) with 0.04em letter-spacing. Uppercase headings or card titles signal generic dashboard UI. Dispatch headings are sentence case.

---

## COLOR ANTI-PATTERNS

### Never use the accent color decoratively
The skin accent (`accent-secondary`) means one thing: **the machine is present** — classifying, analyzing, or synthesizing. If an element uses the accent and the machine's intelligence is not involved, the accent is wrong. Accent on a decorative divider, a hover state on a non-Cerebro element, or a background wash for visual interest is a violation.

### Never use default Tailwind blue or any unsanctioned color
Every color in Dispatch comes from the skin's semantic slot system. No `text-blue-500`. No `bg-gray-800`. No hex values outside the token set. If you need a color that doesn't exist in the tokens, flag it — do not invent one.

### Never invert colors for light mode
Light mode is a complementary expression of the skin, not an inversion. `bg-primary` in light mode is not white — it is the specific warm or cool value defined in the skin. Simply swapping dark for light backgrounds and light for dark text produces a washed-out, generic result that loses the material quality of the skin.

### Never use color to encode urgency or status without the defined system
No red badges for "urgent." No green checkmarks for "complete." Dispatch's urgency is encoded through the scoring system (0–10) and surfaced through sort order and label language, not traffic-light colors. The only system color is `--live` (green, for live status indicators only).

---

## LAYOUT & SPACING ANTI-PATTERNS

### Never add drop shadows
Dispatch communicates depth through fill value and border, not elevation. No `shadow-sm`, no `shadow-md`, no `box-shadow` of any kind. Components are seated in the surface, not floating above it. Shadows signal Material Design or generic card UI — neither is Dispatch.

### Never use translucent or glassmorphism layers
Dispatch uses opaque, material fills. No `bg-opacity-80`. No `backdrop-blur`. No frosted glass effects. The material metaphor is sandstone, brushed metal, wet stone — not glass. Translucency undermines the solidity that makes the interface feel authoritative.

### Never create cramped or dense layouts to "fit more in"
Dispatch serves one operator, not a team scanning a monitoring wall. Cards breathe. Sections have clear separation. If a layout feels dense, the solution is to show less, not to compress spacing. The seven spacing tokens (2, 4, 8, 12, 16, 24, 32px) are the system — do not invent intermediate values.

### Never exceed four border radius values
4px, 8px, 14px, 9999px. That's the set. If none of these feel right, reconsider the component's structure before reaching for a custom radius. The constraint is the feature.

### Never create full-bleed hero sections or marketing-style layouts
Dispatch is an operational tool, not a landing page. No hero banners. No large background images. No above-the-fold "value proposition" sections. Every pixel serves the intelligence pipeline.

---

## COMPONENT ANTI-PATTERNS

### Never build "dashboard widgets"
Dispatch processes intelligence, not metrics. No pie charts, no KPI tiles, no sparklines, no percentage-change badges with green/red arrows. If a component would feel at home in a Datadog or Grafana dashboard, it does not belong here. The synthesis layer interprets signal in prose, not in data visualization.

### Never add celebratory or confirmatory UI
No success toasts with checkmarks. No "Great choice!" confirmations. No confetti. No animations that reward the user for clicking. Dispatch's voice is the Wise Counselor — composed, direct, unhurried. The interface extends that voice. Celebrations are sycophantic and break character.

### Never use pulsing, bouncing, or attention-grabbing animations
No pulsing notification dots. No bouncing badges. No shake animations on form errors. The only animation vocabulary in Dispatch is the staggered `signal-reveal` entrance and subtle hover state shifts. Urgency is communicated through scoring and language, never through animation theater.

### Never create generic empty states with illustrations
No sad-face icons. No "Nothing here yet!" with a cartoon. Empty states in Dispatch should either be invisible (the section simply doesn't appear) or carry a single line of system text in Söhne Mono at `text-tertiary`. The machine acknowledges absence without performing friendliness about it.

### Never add tooltips or info icons to explain UI
If a component requires an (i) icon with a hover tooltip to explain what it does, the component has failed. The interface should be self-evident through labeling, hierarchy, and spatial logic. Tooltip-driven UI is a sign that the visual language isn't doing its job.

### Never present toggle switches for binary AI settings
Toggles with labels like "Enable smart suggestions" or "Use AI-powered analysis" are consumer app patterns. Dispatch's AI is always present — it is the system. There is no on/off switch for the machine's intelligence. Configuration happens at the source and prompt level, not through friendly toggle rows.

---

## INTERACTION ANTI-PATTERNS

### Never add a search bar as a primary navigation element
Dispatch is not a search interface. The operator navigates through four views (Signal, Audio, Synthesis, Dispatch) and accesses Cerebro for deliberation. A prominent search bar implies the system is a retrieval tool. It is not — it is a synthesis tool that surfaces what matters, not what the operator asks for.

### Never create multi-step wizards or onboarding flows
Dispatch has one operator. There is no onboarding. There is no "getting started" experience. If a feature requires a wizard to explain, it is too complex or too generic for this system.

### Never use modal confirmations for routine actions
"Are you sure?" dialogs for non-destructive actions (switching views, dismissing a card, opening Cerebro) are friction without purpose. Confirmations are reserved for memory purge and destructive operations only.

---

## COPY & VOICE ANTI-PATTERNS

### Never write UI copy in a friendly or casual register
No "Hey there!" No "Let's get started!" No "Oops, something went wrong!" Dispatch's voice is the station chief — composed, direct, analytical. System messages use the same register: factual, lowercase, declarative. "Connection failed. Retrying." Not "Uh oh! We couldn't connect. 😕"

### Never use emoji in the interface
Zero emoji anywhere in the product. Not in labels, not in status messages, not in Cerebro's output, not in button text. Emoji signal consumer-grade friendliness. Dispatch is an intelligence tool that communicates through typography and language.

### Never use placeholder copy that describes the feature
"This is where your insights will appear" is a placeholder that describes the container instead of providing value. If content isn't available yet, the space should be empty or display a loading state in the system's terminal-style animation vocabulary. Never narrate the UI to the user.

---

## META ANTI-PATTERNS

### Never add a feature "because other tools have it"
Dark mode toggle rows, notification preference panels, "share with team" buttons, activity feeds, profile avatars — none of these exist in Dispatch because Dispatch is not a collaborative SaaS tool. It is a single-operator intelligence system. Features are evaluated against the mandate, not against competitor feature lists.

### Never design for "what if we add more users later"
Dispatch serves one operator. Design for one operator. Multi-user abstractions (roles, permissions, team views, shared workspaces) add architectural complexity that works against the system's core value: deep personalization for a single person's strategic context. If the system ever needs multiple operators, that is an architectural decision that changes the product — not a UI checkbox to add now.

### Never sacrifice clarity for visual interest
If a layout choice makes the interface more visually striking but harder to parse in three seconds, choose clarity. Dispatch is used daily by someone making real decisions. It is not a portfolio piece or a Dribbble shot. The visual language serves comprehension first, aesthetic interest second.

---

## MAINTENANCE

**When to add an entry:** Every time an AI agent produces a component, layout, or treatment that gets rejected. Write the anti-pattern, date it, and explain in one line why it fails in the context of Dispatch specifically — not why it's bad in general.

**When to promote to SYSTEM-BRIEF:** If an anti-pattern reveals a gap in the positive design system (the "do this" doc doesn't say enough to prevent the mistake), add the corresponding positive guidance to SYSTEM-BRIEF. The anti-pattern stays here as the explicit prohibition.

**Review cadence:** After every major build session. Scan the session's output for patterns that should be documented here.
