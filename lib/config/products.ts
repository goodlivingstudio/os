// ─── Good Living Studio Products Registry ──────────────────────────────────
// Canonical enumeration of all Good Living Studio products.
//
// This is the ONE place where the full set of sibling products is declared.
// Every UI surface that needs to show a cross-product switcher, a product
// selector, or any navigation across products reads from this registry.
// Never hardcode product names, URLs, or IDs in component files.
//
// When a new product is added:
//   1. Add a config file at lib/config/<id>.ts
//   2. Register it in lib/config/index.ts (CONFIGS map)
//   3. Add an entry here with status and metadata
//   4. Create the doc set at docs/<id>/
//
// When a product moves between statuses (wip → production, on-hold → wip),
// update the status field here. Consumers can filter or sort by status.
//
// See docs/os/ARCHITECTURE.md § HOW A NEW PRODUCT INSTANCE IS ADDED.

export type ProductStatus = "production" | "wip" | "on-hold" | "upcoming"

export interface ProductEntry {
  /** Instance ID used in lib/config/<id>.ts, NEXT_PUBLIC_INSTANCE, and KV keys. */
  id: string
  /** Display name shown in chrome, rails, navigation, and switchers. */
  name: string
  /** Deployed URL (production or staging). Null for products that are not yet deployed. */
  url: string | null
  /** Current lifecycle status — controls UI hints and filtering. */
  status: ProductStatus
  /** One-line description for product switchers and hover hints. */
  description: string
  /**
   * Whether this product runs as a white-label instance of the shared OS
   * codebase. When false, the product lives as a separate repository and
   * the URL (if any) points at its standalone deployment.
   */
  isOsInstance: boolean
}

/**
 * All four Good Living Studio products, ordered by lifecycle maturity
 * (production → wip → upcoming → on-hold). Consumers can reorder as
 * needed.
 */
export const PRODUCTS: ProductEntry[] = [
  {
    id: "dispatch",
    name: "Dispatch",
    url: "https://dispatch.goodliving.studio",
    status: "production",
    description: "Personal intelligence — strategic positioning across technology, culture, and healthcare.",
    isOsInstance: true,
  },
  {
    id: "explore",
    name: "Explore",
    url: "https://explore.goodliving.studio",
    status: "wip",
    description: "Civic/team intelligence — field desk for the explore.gov engagement.",
    isOsInstance: true,
  },
  {
    id: "lilly-direct",
    name: "Lilly Direct",
    url: null,
    status: "upcoming",
    description: "Engagement intelligence for the Eli Lilly innovation team. Starts 2026-04-10.",
    isOsInstance: true,
  },
  {
    id: "atlas",
    name: "Atlas",
    url: null,
    status: "on-hold",
    description: "Decision capture — the layer that makes the between-state visible. Separate repo, different stack.",
    isOsInstance: false,
  },
]

/** Lookup helper — returns the product entry for a given instance ID. */
export function getProduct(id: string): ProductEntry | undefined {
  return PRODUCTS.find(p => p.id === id)
}

/** Filter helper — returns only products that run as OS instances. */
export function getOsInstances(): ProductEntry[] {
  return PRODUCTS.filter(p => p.isOsInstance)
}

/** Filter helper — returns only products that are currently navigable (have a URL). */
export function getNavigableProducts(): ProductEntry[] {
  return PRODUCTS.filter(p => p.url !== null)
}
