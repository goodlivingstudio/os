# EXPLORE — Watch File
Established: 2026-04-07

*This is a living document. It tracks specific institutional risks, controversies, and fault lines that require sustained attention — not one-time triage. The signal feed surfaces new information. This document tracks the evolution of known problems over time.*

*Add entries when: a new risk category is identified; an existing watch item materially develops; a new data point confirms or complicates an existing pattern; or when Cerebro flags a signal that belongs to a tracked issue.*

*Every entry has a date, a severity rating, and a one-line "so what" for the design team. This document is not commentary — it is operational intelligence.*

*Authority: Derives from LIVE-ENVIRONMENT.md. When a watch item resolves or becomes structural background, migrate to LIVE-ENVIRONMENT.md as permanent context.*

---

## SEVERITY SCALE

| Level | Label | Meaning |
|-------|-------|---------|
| 🔴 | **Critical** | Active risk with direct implications for the platform's launch, legal standing, or political viability. Requires immediate team attention. |
| 🟠 | **Elevated** | Developing situation with high probability of becoming critical. Monitor closely; brief the team weekly. |
| 🟡 | **Watch** | Known issue, not yet acute. Track for escalation triggers. Brief the team monthly or when new data arrives. |
| 🟢 | **Resolved** | Issue has closed, changed fundamentally, or been migrated to permanent LIVE-ENVIRONMENT context. |

---

## ACTIVE WATCH ITEMS

---

### WATCH-01 · NDS Accessibility Record
**Opened:** 2026-04-07
**Severity:** 🔴 Critical
**Category:** Technical / Legal / Reputational

**What we know:**
Three National Design Studio websites — launched between August 2025 and early 2026 — failed independent accessibility audits conducted by Equalize Digital. The sites did not comply with Web Content Accessibility Guidelines (WCAG 2.1), which are federally mandated under Section 508 of the Rehabilitation Act of 1973. The specific failures were publicly documented and circulated in design and federal tech press. Former federal designer Ethan Marcotte published a detailed technical analysis of the America by Design site, noting ADA compliance failures and a 3MB page weight for a single-page site — a payload he characterized as "comically outsized" for its content.

**Why this is critical for explore.gov:**
Section 508 compliance is not optional — it is a federal legal requirement. A platform handling 50 million annual reservations serving Americans with disabilities, older adults, and users with limited bandwidth or assistive technology has a non-negotiable accessibility obligation. If explore.gov ships with the same failures as prior NDS work, the legal exposure is direct, the press narrative writes itself ("NDS does it again"), and the platform fails the Americans most likely to be underserved by the current Recreation.gov.

**The pattern to watch:**
Whether the NDS treats accessibility as a compliance checkbox or as a genuine design constraint. The difference will be visible in technical decisions made early in the build — semantic HTML, keyboard navigation, color contrast ratios, screen reader compatibility — not in a final QA pass.

**Escalation trigger:** Any new NDS product launch with documented accessibility failures. Any internal signal that explore.gov's build is optimizing for visual presentation at the expense of accessibility fundamentals.

**So what for the team:** WCAG 2.1 AA compliance is a hard requirement, not a stretch goal. Build the accessibility test suite before the design system, not after. The narrative opportunity is real: be the NDS product that passes the audit.

---

### WATCH-02 · NDS "Billboard Design" Critique
**Opened:** 2026-04-07
**Severity:** 🟠 Elevated
**Category:** Design Philosophy / Reputational

**What we know:**
The most substantive public critique of NDS work — published in the Architect's Newspaper in December 2025 — characterized the studio as functioning more like an advertising agency for administration policies than a civic design program. The specific critique: NDS sites "behave more like billboards than public infrastructure — they frame the state as something to be encountered emotionally rather than used practically." The critique identified this as a structural problem, not an aesthetic one: when government design prioritizes emotional impact over functional usability, citizens stop being users and start becoming audiences.

This critique was picked up by Fast Company, design community forums, and several civic tech newsletters. The Architect's Newspaper piece specifically cited the pattern of NDS launching landing pages for policy announcements rather than functional civic infrastructure.

**Why this is elevated for explore.gov:**
explore.gov is a functional platform. Its value is transactional: users need to book a campsite, find a trail, reserve a permit. If the design optimizes for visual drama at the expense of reservation flow completion, search and discovery usability, or mobile performance for users in low-bandwidth environments (the most common condition when you're actually near a national park), the platform has failed regardless of how it looks on Dribbble.

The risk is that the aesthetic ambition of the rebrand — "explore" as emotional proposition, the majesty of the land as visual language — pulls the design toward billboard mode. The brief is to make the platform *feel* worthy of the subject matter while remaining *functionally* excellent. That's a harder brief than either one alone.

**The pattern to watch:**
Design reviews that prioritize visual impact over task completion. Prototype testing that uses desktop/wifi conditions rather than mobile/low-bandwidth. Copy that describes the land rather than helping users navigate to it.

**Escalation trigger:** Any design direction that would score highly in a portfolio presentation but requires a user to work to complete a reservation. Any usability testing that reveals task completion rates are not the primary success metric.

**So what for the team:** The creative brief should be explicitly "emotionally resonant AND functionally excellent." Not one, then the other. The framing of the land matters — and so does the tab order on the reservation form.

---

### WATCH-03 · DOGE Reorganization and NPS Operational Capacity
**Opened:** 2026-04-07
**Severity:** 🟠 Elevated
**Category:** Operational / Platform Integrity

**What we know:**
The Interior Department has undergone significant DOGE-driven reorganization since February 2025. Interior Secretary Burgum signed a secretarial order giving DOGE operative Tyler Hassen effective control over the department's organization and staffing — including the National Park Service, U.S. Fish and Wildlife Service, and Bureau of Land Management. The order did not require Hassen to report back to Burgum on reorganization decisions. Conservation organizations characterized this as Burgum "abdicating" oversight of the department.

The practical consequence: NPS ranger and campground staff reductions at multiple parks, reduced interpretive services, and operational capacity constraints that are not yet fully visible in public data. The scope of staffing changes is still being documented — the full picture is not known.

**Why this is elevated for explore.gov:**
The platform's promise is only as good as the physical infrastructure it represents. If explore.gov allows a user to reserve a campsite at a park where ranger staffing has been reduced to the point that the campground is functionally unmaintained, or to plan a visit to a trail with a listed condition that hasn't been updated because the staff to update it no longer exist, the platform fails its users in a specific and damaging way.

The gap between what the platform shows and what the land delivers is the platform integrity risk. This is not a hypothetical concern — wildfire season, flood events, and now staffing reductions are actively creating conditions where the information architecture of the current Recreation.gov is already unreliable. explore.gov needs to either solve this problem or be honest about its limitations.

**The pattern to watch:**
NPS and BLM operational reporting. Staffing announcements. Campground and trail closure data relative to historical baselines. Reports from visitors about conditions that don't match platform listings.

**Escalation trigger:** Any major park or recreation area experiencing documented operational degradation (visitor complaints, media coverage, ranger association statements) that would affect platform content reliability. Any policy decision that accelerates staffing reductions.

**So what for the team:** The platform needs a real-time or near-real-time conditions layer, or it needs explicit language managing user expectations about information currency. "Conditions as reported" with a timestamp is honest. A static listing with no update date is a liability.

---

### WATCH-04 · Burgum Public Lands Policy Direction
**Opened:** 2026-04-07
**Severity:** 🟡 Watch
**Category:** Political / Content Strategy

**What we know:**
Secretary Burgum's public lands policy direction is primarily extraction and development-oriented: expanded oil and gas leasing, mineral extraction, land transfers to states, and potential land sales. His first six secretarial orders on day one of his tenure repositioned the Interior Department toward "energy dominance." He has also: signed an order limiting Land and Water Conservation Fund usage in ways critics say will reduce public land acquisition; indicated openness to reviewing national monument designations; and partnered with HUD to explore using public lands for housing development.

Simultaneously, Burgum's framing of the explore.gov project is experiential and access-oriented — he asked Gebbia to make the platform better because the parks "were being undersold." These two postures are in genuine tension.

**Why this is a watch item:**
Monument designations, land status changes, and policy decisions that affect which federal lands are open for which uses will directly affect platform content. If a monument the platform features is reduced in scope, that creates a content and communication challenge. If a popular recreation area is opened to extractive use in a way that changes the visitor experience, the platform's description of that place may become inaccurate or misleading.

This is not a political opinion — it is a content maintenance reality. Land designations and access conditions are platform data. When they change, the platform needs to change.

**The pattern to watch:**
Monument review announcements. Land use plan revisions. Congressional action on public land sales or transfers (the "Big Beautiful Bill" section on land sales was removed before passage but the intent was documented). State land transfer proposals.

**Escalation trigger:** Any secretarial order or policy decision that changes the status, access, or use designation of a site the platform features prominently. Any legislative action that would affect the federal land portfolio at scale.

**So what for the team:** Build the content architecture with the assumption that land designations and conditions will change. Dynamic content tied to official data sources, not static editorial descriptions of specific lands. The platform should be able to update what it says about a place when the official status of that place changes.

---

### WATCH-05 · Equity and Demographic Access Gap
**Opened:** 2026-04-07
**Severity:** 🟡 Watch
**Category:** Design / Social / Political

**What we know:**
Outdoor recreation in America skews white and affluent by significant margins. The barriers are structural and documented: geographic proximity to public land, cost of equipment and transportation, cultural messaging in outdoor media, and a reservation system that advantages users with advance planning capacity, reliable internet access, and schedule flexibility. The current Recreation.gov reservation system has been specifically criticized for its first-come-first-served and advance-booking model that disadvantages shift workers, lower-income families, and communities without reliable broadband.

The National Park Service's own data and independent research document these disparities. Organizations including Outdoor Afro, Latino Outdoors, and Melanin Basecamp have published substantial documentation of the specific barriers their communities face — including hostile encounters, lack of representation in platform and marketing imagery, and the practical inaccessibility of a reservation system built for a different primary user.

The current administration has not made equity in outdoor recreation a stated priority. The DOGE reorganization has reduced the NPS staff and programs most directly involved in equity and access outreach.

**Why this is a watch item:**
explore.gov's rebrand from a reservation system to a discovery platform creates a structural opportunity to address some of these barriers — or to amplify the existing inequities by building a beautiful discovery experience for the demographic that already uses the system. Discovery features that surface nearby and accessible public land, not just iconic and oversubscribed destinations, can serve populations currently invisible to the platform. This is both a design decision and a political one.

**The pattern to watch:**
How the administration frames the platform's intended audience. Whether equity considerations appear in the NDS's stated success metrics for explore.gov. Community organization response to the rebrand. Research on how underserved populations experience and don't experience the current system.

**Escalation trigger:** Any design direction that would narrow rather than widen the accessible audience. Any platform success metric framing that excludes demographics currently underserved by the system. Any public criticism from equity-focused outdoor organizations responding to the rebrand.

**So what for the team:** Equity is a design constraint, not a feature to add later. The discovery architecture, the imagery, the copy register, and the accessibility standards should all be evaluated against the question: does this make it more or less likely that someone who hasn't historically felt welcome in this system will find their way to public land?

---

### WATCH-06 · July 4, 2026 Deadline Pressure
**Opened:** 2026-04-07
**Severity:** 🟡 Watch (escalates to 🟠 after May 1)
**Category:** Operational / Quality Risk

**What we know:**
The America by Design executive order requires federal agencies to "produce initial results" by July 4, 2026 — the U.S. semiquincentennial. This deadline has symbolic weight that will attract press attention regardless of what ships. The NDS has publicly committed to "major updates" including a refresh of existing federal websites by July 4.

The deadline creates specific quality risks: compressed timelines favor visual completion over technical depth, accessibility testing is often cut when schedules compress, and "initial results" framing can create pressure to ship something visible rather than something finished.

**Why this is a watch item:**
The prior NDS accessibility and technical quality failures occurred on products built under significant time pressure. explore.gov is orders of magnitude more complex than a landing page. If July 4 becomes a forcing function that compresses the time available for accessibility testing, performance optimization, and usability research, the probability of shipping with the same failure modes as prior NDS work increases substantially.

**Escalation trigger:** After May 1, 2026, any signal that the build timeline is compressing in ways that would require cutting accessibility testing, usability research, or performance optimization to meet the deadline. Any internal or external communication framing July 4 as a hard launch date for full platform functionality rather than a milestone.

**So what for the team:** Define what "initial results" means specifically and publicly, before July 4 creates pressure to define it by whatever is ready. A clearly scoped milestone that ships excellent work in a defined slice of the platform is better than a full platform launch that ships with the NDS's documented failure modes.

---

## LOG FORMAT

*Use this format when adding new entries or updating existing ones:*

```
### WATCH-[NUMBER] · [Title]
**Opened:** YYYY-MM-DD
**Last updated:** YYYY-MM-DD
**Severity:** [🔴/🟠/🟡/🟢] [Label]
**Category:** [Technical / Legal / Political / Reputational / Operational / Design]

**What we know:** [Current state of the issue]
**Development:** [New information since last update]
**The pattern to watch:** [Specific signals that indicate escalation or resolution]
**Escalation trigger:** [Specific, named condition that would move severity up]
**So what for the team:** [One-line operational implication]
```

---

## RESOLVED ITEMS

*None yet. Items move here when they close, resolve, or become permanent background context in LIVE-ENVIRONMENT.md.*

---

## MAINTENANCE

**Who updates this:** Anyone on the team who encounters a new data point relevant to an active watch item. The system's Cerebro function should flag signal-feed articles that match active watch items and prompt an update.

**Cadence:** Review all active items weekly during the build phase. After July 4, shift to monthly review unless a critical item opens.

**Escalation protocol:** Any item moving to 🔴 Critical warrants a team briefing within 48 hours. Cerebro should surface it immediately in Synthesis, not wait for the next scheduled review.
