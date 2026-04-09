// ─── Lilly Direct Instance Config ──────────────────────────────────────────
// Engagement intelligence surface for Eli Lilly's innovation team.
// Working product name: Lilly Direct. Final name TBD.
// Strategic relationship: Laree Ross.
//
// Source authority: docs/lilly/ (14 canonical files, all currently placeholder
// stubs — content lands during the kickoff session 2026-04-10).
//
// STATUS: SCAFFOLD — everything below is a working placeholder chosen so the
// instance boots, types resolve, and the shared OS infrastructure adapts
// correctly. The real content (mandate, voice character, intelligence layers,
// source list, skins, ticker) gets defined during the kickoff session from
// the doc set in docs/lilly/. When content arrives, update this file to
// reference the canonical sources in those docs rather than restating them
// inline. The Dispatch and Explore configs are the template patterns.
//
// WHAT TO DO AT KICKOFF:
//   1. Confirm final product name and update branding.name
//   2. Decide voice character (Station Chief / Field Correspondent / new)
//      and populate mandate.voice from docs/lilly/CEREBRO-CHARTER.md
//   3. Define the intelligence layers — these are the most bespoke part of
//      any product's config. Lilly Direct's layers should reflect the
//      engagement's specific intelligence taxonomy (not Dispatch's five,
//      not Explore's five). Likely candidates: Therapeutic Areas,
//      Regulatory, AI & Digital Health, Organizational, Competitive
//      Landscape. TBD at kickoff.
//   4. Populate mandate.operator and mandate.clientContext from
//      docs/lilly/MANDATE.md once it's written.
//   5. Start the feed list from the engagement's actual intelligence
//      priorities — Lilly newsroom, pharma trade press, FDA signal,
//      competitive pharma (Novo Nordisk GLP-1 news, Pfizer strategic
//      moves, AI-pharma partnerships). Expand via SOURCES-MEGALIST.md.
//   6. Theming: pick a skin vocabulary that fits the engagement. The
//      current placeholder skin "clinical" is just that — a placeholder.
//      Consider whether Lilly Direct should have one skin (like Dispatch)
//      or multiple skins (like Explore) based on how the product is used.

import type { InstanceConfig } from "./types"

const config: InstanceConfig = {
  id: "lilly-direct",

  branding: {
    name: "Lilly Direct",
    tagline: "Engagement intelligence for Eli Lilly.",  // TBD: final tagline
    domain: "lilly.goodliving.studio",                   // TBD: final domain (may be client-owned)
    port: 3003,                                           // Dispatch=3001, Explore=3002, Lilly Direct=3003
    favicon: { light: "/favicon-light.png", dark: "/favicon-dark.png", apple: "/apple-touch-icon.png" },
  },

  // ─── Mandate — PLACEHOLDER, rewrite from docs/lilly/MANDATE.md at kickoff ─

  mandate: {
    operator: `[PLACEHOLDER] You are the intelligence system for the Lilly Direct engagement. The operator context, mandate, and engagement framing will be defined at kickoff and derived from docs/lilly/MANDATE.md. Until then, operate with the shared OS operator profile at docs/os/OPERATOR.md § Active Engagements as the baseline — that section already describes Jeremy Grant's Lilly engagement and the strategic context this product serves.`,

    clientContext: `[PLACEHOLDER] Primary intelligence target: Eli Lilly and Company. The engagement-specific intelligence will be defined at kickoff from docs/lilly/LIVE-ENVIRONMENT.md. Until then, reference docs/os/OPERATOR.md § Active Engagements for the Lilly context baseline — 51M patients, GLP-1 momentum, Diogo Rau's AI mandate, the donanemab care coordination challenge, LillyDirect (existing platform), the 73% pharma digital transformation failure rate, and the strategic argument that Lilly's science has outpaced the experience of receiving it.`,

    voice: `[PLACEHOLDER] Analytical voice character TBD at kickoff. Until defined in docs/lilly/CEREBRO-CHARTER.md, inherit the universal disciplines from docs/os/VOICE.md (gap accounting, confidence tiers, amplification check, weakest claim, lead with substance, no sycophancy, flag noise, name absence, editorial independence, tight paragraphs, density over comprehensiveness). The Station Chief and Field Correspondent models are the two existing character templates; Lilly Direct's character may draw from either or develop something new specific to the engagement.`,

    sourceModes: `[PLACEHOLDER] Source mode framing TBD at kickoff. Reference Dispatch's Intelligence/Formation/Positioning model or Explore's own framing as templates. Lilly Direct's modes should reflect how the engagement consumes signal (probably some combination of Engagement signal, Therapeutic area intelligence, Competitive landscape, and Internal Lilly signal).`,
  },

  // ─── Intelligence layers — PLACEHOLDER, replace at kickoff ────────────────
  // Currently reusing Dispatch's 5-layer taxonomy as a placeholder so the
  // shared infrastructure boots. Lilly Direct should define its own layers
  // from docs/lilly/MANDATE.md at kickoff. Likely candidates: Therapeutic
  // (GLP-1, Alzheimer's, oncology, immunology), Regulatory (FDA, EMA,
  // reimbursement), Digital Health (AI integration, patient experience,
  // care coordination), Organizational (Lilly internal, Rau's AI mandate,
  // strategic hires), Competitive (Novo Nordisk, Pfizer, Sanofi, BMS).

  layers: [
    { id: "therapeutic", label: "Therapeutic", description: "[PLACEHOLDER] Therapeutic area intelligence — GLP-1, Alzheimer's, oncology, immunology. High scores for clinical trial results, efficacy signals, patient population data, competitive molecules." },
    { id: "regulatory",  label: "Regulatory",  description: "[PLACEHOLDER] FDA, EMA, reimbursement, policy. High scores for approval decisions, label changes, reimbursement shifts, regulatory guidance, international approvals." },
    { id: "digital",     label: "Digital",     description: "[PLACEHOLDER] Digital health and AI in pharma. High scores for AI-pharma partnerships, patient experience platforms, care coordination tooling, digital therapeutics, wearables and biomarker monitoring." },
    { id: "organization", label: "Organization", description: "[PLACEHOLDER] Internal Lilly dynamics and broader pharma org changes. High scores for executive moves, strategic restructures, Rau's AI initiatives, hiring signals in innovation functions." },
    { id: "competitive", label: "Competitive",  description: "[PLACEHOLDER] Competitive pharma landscape — Novo Nordisk, Pfizer, Sanofi, BMS, Roche. High scores for competitor product launches, pricing moves, strategic pivots, clinical trial outcomes." },
  ],

  layerColors: {
    therapeutic:  "var(--accent-secondary)",
    regulatory:   "var(--accent-muted)",
    digital:      "var(--text-secondary)",
    organization: "var(--text-tertiary)",
    competitive:  "var(--accent-muted)",
  },

  // ─── Feeds — PLACEHOLDER, populate from docs/lilly/SOURCES.md at kickoff ──
  // Minimum viable set so the feed API returns something on first boot.
  // Expand during kickoff with Lilly newsroom, pharma trade press, FDA feeds,
  // competitive pharma, and engagement-specific social/substack sources.

  feeds: [
    { url: "https://investor.lilly.com/rss/news-releases.xml",     source: "Lilly Newsroom",    category: "Eli Lilly",            tag: "therapeutic",  layer: "therapeutic" },
    { url: "https://www.statnews.com/feed/",                       source: "STAT News",         category: "Pharma",               tag: "therapeutic",  layer: "therapeutic" },
    { url: "https://endpts.com/feed/",                             source: "Endpoints News",    category: "Pharma Deals & FDA",   tag: "regulatory",   layer: "regulatory"  },
    { url: "https://www.biopharmadive.com/feeds/news/",            source: "BioPharma Dive",    category: "Pharma",               tag: "competitive",  layer: "competitive" },
    { url: "https://www.fiercehealthcare.com/rss.xml",             source: "Fierce Healthcare", category: "Healthcare",           tag: "digital",      layer: "digital"     },
  ],

  podcasts: [
    // [PLACEHOLDER] Empty at scaffold. Populate from docs/lilly/SOURCES.md at kickoff.
  ],

  gallerySources: [
    // [PLACEHOLDER] Empty at scaffold. Lilly Direct may or may not have a
    // visual gallery surface — decision deferred to kickoff. If it does,
    // populate with sources that make sense for a pharma engagement context
    // (scientific imagery, clinical settings, patient experience reference).
  ],

  // ─── Ticker — PLACEHOLDER with minimum-viable headlines ───────────────────

  headlines: [
    { cat: "LILLY",      text: "[PLACEHOLDER] Lilly Direct scaffold active — kickoff headlines land at engagement start", url: "https://www.lilly.com/" },
    { cat: "PHARMA",     text: "[PLACEHOLDER] Pharma intelligence feed will populate at kickoff", url: "https://www.statnews.com/" },
    { cat: "REGULATORY", text: "[PLACEHOLDER] Regulatory signal feed will populate at kickoff", url: "https://endpts.com/" },
  ],

  categoryStyleDay: {
    LILLY:      { bg: "rgba(200,48,40,0.10)",  color: "#C83028" },
    PHARMA:     { bg: "rgba(120,104,144,0.10)", color: "#786890" },
    REGULATORY: { bg: "rgba(68,119,132,0.10)", color: "#447784" },
    DIGITAL:    { bg: "rgba(85,121,73,0.10)",  color: "#557949" },
    COMPETITIVE: { bg: "rgba(140,106,59,0.10)", color: "#8C6A3B" },
  },

  categoryStyleNight: {
    LILLY:      { bg: "rgba(240,80,72,0.14)",  color: "#F05048" },
    PHARMA:     { bg: "rgba(154,133,184,0.12)", color: "#9A85B8" },
    REGULATORY: { bg: "rgba(90,158,176,0.12)", color: "#5A9EB0" },
    DIGITAL:    { bg: "rgba(123,175,106,0.14)", color: "#7BAF6A" },
    COMPETITIVE: { bg: "rgba(212,160,90,0.12)", color: "#D4A05A" },
  },

  // ─── Cerebro — PLACEHOLDER ─────────────────────────────────────────────────

  provocations: [
    "[PLACEHOLDER] What's the weakest claim in Lilly's current patient experience argument?",
    "[PLACEHOLDER] Where does Rau's AI mandate break down at the team level?",
    "[PLACEHOLDER] What does the donanemab care coordination gap demand of Lilly Direct?",
    "[PLACEHOLDER] Populate real provocations from docs/lilly/PROMPTS.md at kickoff",
  ],
  cerebroWelcome: {
    title: "Lilly Direct scaffold active.",
    subtitle: "Engagement intelligence. Content lands at kickoff.",
  },

  // ─── Theme — PLACEHOLDER single skin ──────────────────────────────────────
  // Currently a single "clinical" skin. Lilly Direct may want multiple skins
  // (one per therapeutic area, or one per engagement phase) or may stay with
  // a single skin like Dispatch. Decision deferred to kickoff from
  // docs/lilly/SYSTEM-BRIEF.md.

  skins: [
    { id: "clinical", label: "Clinical", dot: "#C83028" },  // Placeholder vermillion — matches Dispatch ink for now
  ],
  defaultSkin: "clinical",

  // ─── Feature flags — none enabled at scaffold ────────────────────────────
  // Lilly Direct starts with all shared-layer features off. Opt in selectively
  // during kickoff based on what the engagement actually needs.

  // features: {
  //   galleryBiomes: false,  // Not applicable — biome taxonomy is Explore-specific
  // },

  // ─── Gallery scraper — omitted at scaffold ────────────────────────────────
  // No gallery scraper configured. If Lilly Direct develops a visual surface,
  // add galleryScraper config here with an Are.na channel, targets, and a
  // taste prompt calibrated to the engagement's visual vocabulary.
}

export default config
