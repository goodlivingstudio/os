# Passage
Established: 2026-04-09

*The interaction philosophy for the OS. Governs how surfaces relate to each other, how they relate to time, and what they refuse to pretend about the experience of using them. This philosophy is forward-looking — it describes how the operator moves through the work, not how the system processes it.*

*See `DOCTRINE.md` for shared design convictions. See `PIPELINE.md` for the structural system that makes this philosophy possible. See project-level `SYSTEM-BRIEF.md` files for how this philosophy manifests in specific visual and interaction decisions.*

---

## THE ARGUMENT

Most software pretends you just got here. The empty state. The welcome screen. The loading spinner that implies the world is being assembled for your arrival. Everything about the experience says: nothing was happening until you showed up.

This is a lie, and it's a lie that flatters the interface, not the person using it. The things you care about did not pause while you were away. The signals kept moving. The images kept accumulating. The positions you're developing kept being shaped by a world that doesn't wait for you to open a tab. You are always mid-stream. The only question is whether the software acknowledges that or pretends otherwise.

Passage is the refusal to pretend. It is the commitment that every surface behaves as a place you rejoin, not a place you visit — that the current was moving before you arrived, and the current will continue after you leave, and the moment you're in right now is neither the beginning nor the end of anything. It's a stretch of river. Some stretches are calm. Some are not. But the water was already moving.

---

## THE EXPERIENCE

### Return

You've been away — an hour, a day, a week. You open a surface. What happens next is the test of everything this philosophy claims.

The surface does not greet you. It does not summarize what you missed. It does not perform a welcome. It orients you to where the current is now — not where you left off. The distinction matters: "here's what happened while you were gone" is a recap, and recaps center your absence. "Here's where things stand" is a briefing, and briefings center the present. The operator returning to a surface should feel like stepping back into a room where the conversation continued without them — not like opening an inbox full of notifications about what they missed.

The pipeline makes this possible. Signals were ingested, annotated, scored, and synthesized while the operator was away. The surface the operator returns to is the output of that ongoing work — already current, already considered, already waiting. The experience of return should feel like the system kept thinking on your behalf, because it did.

### Movement

The OS holds multiple surfaces — feed, gallery, synthesis, intelligence briefs — inside a shared shell. Moving between them should feel like turning your attention, not like leaving one application and opening another.

This is where the shared component architecture becomes philosophically load-bearing. The shell stays constant. The navigation stays constant. What changes is the register of the content and the tempo of the surface — the feed moves at the speed of signal, the gallery moves at the speed of formation, the brief moves at the speed of synthesis. The operator shifts between these tempos the way you shift between modes of attention in a good workspace: standing up from the desk to look at something on the wall, turning from the screen to a book, glancing at the window. The space holds. The attention moves within it.

When this works, moving between surfaces feels like different depths of the same practice. When it breaks — when a transition jars, when a surface feels like it belongs to a different product, when the shell cracks — that's a Passage failure, not a component failure. The philosophy is responsible for the coherence of the whole.

### When it's working

When Passage is doing its job, the OS disappears. Not in the sense that the interface becomes invisible — the craft should be visible, the typography should be felt, the surfaces should reward attention. It disappears in the sense that the operator stops thinking about the software and starts thinking about the work. The signals, the images, the developing positions, the decisions forming at the edges — these become the foreground. The system becomes the medium they move through.

This is what separates intelligence software that is used from intelligence software that is inhabited. Used software is opened, consulted, and closed. Inhabited software becomes part of how you think. The gallery changes how you see. The feed changes what you notice. The briefs change how you frame decisions. Over time, the operator's own judgment and the system's analytical capability become difficult to fully separate — not because the system is replacing judgment, but because it has become part of the environment in which judgment forms.

That is the aspiration. Not a tool. Not an assistant. An atmosphere.

---

## THE THREE REFUSALS

### No termination language

The X button is not an exit. It is a transition. "Close" is not "done." The surface you're leaving doesn't cease to exist — and the language, the animation, the interaction pattern should reflect that. When you close an overlay, you are not ejecting from the experience. You are returning to the current. The content is still there. It was there before you opened it.

This doesn't mean the X button disappears. It means the X button stops meaning "this experience is over" and starts meaning "I'm moving on." The distinction is register, not function.

### No dead surfaces

An empty state is a lie. If nothing is showing, something is still happening. The pipeline is ingesting, annotating, scoring, synthesizing. The between-state — the in-progress, the gestating, the not-yet-surfaced — is real, and it deserves a visual language.

The OS needs surfaces that make the between-state visible. Decisions that are forming. Positions that are developing. Work that was seeded by a signal or an image and hasn't resolved yet. Without that visibility, the system looks like it has dead ends. With it, the system reveals that there are no dead ends — only passages that haven't been walked yet.

### Natural weight

Not every moment in the current carries the same weight, and the OS doesn't pretend it does. An urgent intelligence brief and a slowly forming gallery image are both real, both part of the practice — but they make different demands on the operator's attention, and the surfaces should respect that difference. The river has shallows and depths. Some stretches ask you to pay close attention. Others ask you to be present in a quieter way.

What the OS refuses is the opposite error: ranking surfaces by type or medium into a permanent hierarchy. The analytical is not inherently more serious than the sensory. The feed is not inherently more important than the gallery. Weight shifts with context, with urgency, with what the operator is actually doing right now. The system holds all of it without flattening it.

---

## WHAT THIS DOCUMENT DOES NOT OWN

- **Design convictions** — Restraint, craft, signal/synthesis duality, no sycophancy. See `DOCTRINE.md`.
- **Operator context** — See `OPERATOR.md`.
- **The intelligence pipeline** — Passage describes how the operator experiences the current. The pipeline is the structural system that creates it. See `PIPELINE.md`.
- **Visual implementation** — How Passage manifests in specific transitions, animations, microcopy, and component behavior. These decisions belong in project-level `SYSTEM-BRIEF.md` files, informed by this philosophy.

---

*Update this document when: the experience of return reveals something the philosophy didn't anticipate; a transition between surfaces breaks the current in a way that exposes a gap; a new surface is added and its relationship to the existing flow needs to be articulated; or when living inside the system teaches you something about Passage that the document doesn't yet know.*
