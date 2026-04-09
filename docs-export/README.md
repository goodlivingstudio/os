# docs-export/

Concatenated documentation exports generated for pasting into external sessions (primarily Claude.ai for deep prose/doctrine iteration on product doc sets). These files are **derived artifacts**, not canonical sources — they regenerate from the authoritative files in `../docs/` every time they're rebuilt.

## Files

- **`os-complete.md`** — All 8 OS-level documents concatenated. Shared atmosphere: OPERATOR, DOCTRINE, PASSAGE, VOICE, PIPELINE, ARCHITECTURE, GLOSSARY, DOC-AUTHORITY. ~1,400 lines. This is the inheritance context every product doc set assumes.
- **`dispatch-complete.md`** — All 14 canonical Dispatch product docs concatenated. ~2,000 lines. Dispatch is in production; most files are substantive but four are structural stubs awaiting content.
- **`explore-complete.md`** — All 14 canonical Explore product docs concatenated. ~2,400 lines. Explore is WIP; operational tier mostly complete, strategic tier mostly stubs.
- **`lilly-complete.md`** — All 14 canonical Lilly Direct product docs concatenated. ~1,100 lines. Lilly Direct was scaffolded 2026-04-10; all 14 files are structural stubs awaiting content at kickoff. This export is the canonical reference for any future session filling in Lilly Direct's content.

## How to use these

### For Claude.ai deep content iteration

**Step 1 — Always paste `os-complete.md` first.** This is the shared context every product inherits from. Without it, Claude.ai will miss the inheritance relationships and may re-invent vocabulary or contradict OS-level commitments.

**Step 2 — Paste the product file for the product you're working on.** If you're filling in Dispatch's stubs, paste `dispatch-complete.md`. If you're filling in Explore's, paste `explore-complete.md`. Do not paste both at once unless you're explicitly doing cross-product work — it crowds context and invites confusion.

**Step 3 — Tell Claude.ai what you're doing.** Something like: *"I'm filling in the stub files in Dispatch's doc set. The stubs are marked with 'STATUS: stub' and have 'WHAT THIS DOCUMENT WILL OWN' and 'QUESTIONS TO ANSWER BEFORE WRITING' sections. Help me fill in [specific file] with real content. The content should be rigorously bespoke to Dispatch's Station Chief character and the operator's engagement context."*

**Step 4 — Copy Claude.ai's output back into the actual files in `docs/<product>/`.** The export files are read-only references. Real edits happen in `docs/`, not here.

**Step 5 — Regenerate the export when you're done.** See § Regenerating below. This keeps the exports in sync with the canonical sources.

### For any session that needs full OS + product context

Paste `os-complete.md` + the relevant product file(s) as opening context. Works for design review sessions, architecture discussions, content strategy work, anything that benefits from holistic visibility into a whole product plus its shared atmosphere.

### For Lilly Direct spinup (2026-04-10)

When Lilly Direct's doc set is being built, these exports become templates. The workflow:

1. Paste `os-complete.md` to give Claude.ai the shared inheritance context.
2. Paste **either** `dispatch-complete.md` **or** `explore-complete.md` as a reference template (pick whichever voice character is closer to what Lilly Direct needs — Station Chief or Field Correspondent or a new character inspired by one of them).
3. Ask Claude.ai to write Lilly Direct's 14 canonical files, rigorously bespoke to the Lilly engagement, using the template as a structural reference only — not copying content.

## Regenerating the exports

These files are generated via `bash` concatenation from the canonical sources in `docs/`. When the source files change, regenerate the exports to keep them in sync.

**Quick one-liner to regenerate all three:**

```bash
WORKTREE=/Users/jeremygrant/claude-projects/dispatch
# OS export
{
  echo "# Good Living Studio OS — Complete Documentation Export"
  echo "Generated: $(date +%Y-%m-%d)"
  echo ""
  for f in os/OPERATOR.md os/DOCTRINE.md os/PASSAGE.md os/VOICE.md os/PIPELINE.md os/ARCHITECTURE.md os/GLOSSARY.md os/DOC-AUTHORITY.md; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/$f"
    echo "================================================================"
    echo ""
    cat "$WORKTREE/docs/$f"
    echo ""
  done
} > "$WORKTREE/docs-export/os-complete.md"

# Dispatch export (canonical 14-file order)
{
  echo "# Dispatch — Complete Product Documentation Export"
  echo "Generated: $(date +%Y-%m-%d)"
  echo ""
  for f in MANDATE CEREBRO-CHARTER SYSTEM-BRIEF ARCHITECTURE PROMPTS ANTI-PATTERNS DOC-AUTHORITY SOURCES SOURCES-MEGALIST LIVE-ENVIRONMENT WATCHFILE ROADMAP VOICE-CALIBRATION REPLICATE-PROMPTS; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/dispatch/${f}.md"
    echo "================================================================"
    echo ""
    cat "$WORKTREE/docs/dispatch/${f}.md"
    echo ""
  done
} > "$WORKTREE/docs-export/dispatch-complete.md"

# Explore export (same canonical order)
{
  echo "# Explore — Complete Product Documentation Export"
  echo "Generated: $(date +%Y-%m-%d)"
  echo ""
  for f in MANDATE CEREBRO-CHARTER SYSTEM-BRIEF ARCHITECTURE PROMPTS REPLICATE-PROMPTS ANTI-PATTERNS DOC-AUTHORITY SOURCES SOURCES-MEGALIST LIVE-ENVIRONMENT WATCHFILE ROADMAP VOICE-CALIBRATION; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/explore/${f}.md"
    echo "================================================================"
    echo ""
    cat "$WORKTREE/docs/explore/${f}.md"
    echo ""
  done
} > "$WORKTREE/docs-export/explore-complete.md"

# Lilly Direct export
{
  echo "# Lilly Direct — Complete Product Documentation Export"
  echo "Generated: $(date +%Y-%m-%d)"
  echo ""
  for f in MANDATE CEREBRO-CHARTER SYSTEM-BRIEF ARCHITECTURE PROMPTS ANTI-PATTERNS DOC-AUTHORITY SOURCES SOURCES-MEGALIST LIVE-ENVIRONMENT WATCHFILE ROADMAP VOICE-CALIBRATION REPLICATE-PROMPTS; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/lilly/${f}.md"
    echo "================================================================"
    echo ""
    cat "$WORKTREE/docs/lilly/${f}.md"
    echo ""
  done
} > "$WORKTREE/docs-export/lilly-complete.md"
```

Run this from any shell in the repo. When Atlas gets its doc set, add a matching block for `atlas-complete.md`.

## File order in the exports

Each export file orders the product docs by tier:

**Tier 1 — Strategic (intent-defining, exist from day one):**
1. MANDATE.md
2. CEREBRO-CHARTER.md
3. SYSTEM-BRIEF.md
4. ARCHITECTURE.md
5. PROMPTS.md
6. ANTI-PATTERNS.md
7. DOC-AUTHORITY.md

**Tier 2 — Operational (track state, develop over time):**
8. SOURCES.md
9. SOURCES-MEGALIST.md
10. LIVE-ENVIRONMENT.md
11. WATCHFILE.md
12. ROADMAP.md
13. VOICE-CALIBRATION.md
14. REPLICATE-PROMPTS.md

Explore places REPLICATE-PROMPTS in Tier 1 (after PROMPTS) because its mature form ships before launch. Dispatch places it in Tier 2. This is the one divergence in canonical order between the two current products; either ordering is valid.

## Important: these are derived artifacts

- **Never edit these files directly.** Edits made here are lost on the next regeneration.
- **The canonical sources are in `docs/`.** That's where edits belong.
- **If these exports drift from source, regenerate.** The regeneration commands above are authoritative.
- **Do not import these files into code.** Nothing at runtime should read from `docs-export/` — these files exist solely for external-session context pasting.

## Why this directory exists

The OS doc set is large enough that pasting individual files into Claude.ai for each iteration gets tedious, and context gets lost between sessions. These exports let you reliably reconstitute the full product context in one paste. They also give future Claude Code sessions a single-file snapshot of what a product looked like at a point in time, which is occasionally useful for diff comparisons across major revisions.

As the doc set grows (especially once content fills in and files get longer), these exports will get large. If any single export exceeds Claude.ai's paste tolerance, split by tier (one export file per tier) or by file (one export file per individual doc). The current sizes are manageable.
