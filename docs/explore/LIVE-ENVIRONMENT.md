# EXPLORE — Live Environment
Established: 2026-04-07

*This document is the operational context layer for the Explore intelligence system. It names the specific institutional, political, and cultural forces the National Design Studio team is working inside on the explore.gov engagement. It is not a political brief. It is a map of the terrain — what's stable, what's contested, what's live, and what the team needs to hold in tension to do the work well.*

*This document is dynamic. It should be updated when the political or institutional landscape shifts materially. MANDATE.md is the permanent doctrine. This document is the current conditions report.*

*See DOC-AUTHORITY.md for derivation rules.*

---

## THE FOUNDING BRIEF

The explore.gov engagement has a specific origin story that defines its institutional weight. Interior Secretary Doug Burgum asked Joe Gebbia — Airbnb co-founder, brought into the administration through DOGE — to improve Recreation.gov. That single request became the proof of concept for a broader argument: that government digital surfaces could be substantively better, and that private-sector design talent could deliver that improvement faster than the existing federal apparatus.

Gebbia took that argument directly to Trump and pitched the National Design Studio in the Oval Office. Recreation.gov — and by extension explore.gov — is not a peripheral NDS project. It is the founding case. The institutional credibility of the National Design Studio, and of Gebbia's position within the administration, is partly indexed to whether this platform transformation succeeds.

**The team is not building a government website refresh. They are building the argument that federal design can be world-class.** That's a higher-order mandate than the platform itself, and it shapes what success looks like.

---

## THE INSTITUTIONAL STRUCTURE

### The National Design Studio
- **Established:** August 21, 2025, by executive order titled "Improving Our Nation Through Better Design"
- **Location:** Within the White House Office of the Executive Office of the President
- **Reports to:** White House Chief of Staff
- **Led by:** Joe Gebbia, Chief Design Officer and Administrator
- **Mandate:** "Improve comprehensively the visual presentation and usability of Federal services provided to the public in both digital and physical spaces, creating first-class online and offline experiences for Americans"
- **Hard deadline:** Initial results delivered by July 4, 2026 — the United States semiquincentennial

### The July 4 Deadline
This is not an administrative milestone. July 4, 2026 is the 250th anniversary of the United States. Delivering explore.gov as a flagship transformation by that date is a symbolic act — a claim that this administration is capable of building something lasting and beautiful for the American public. The political stakes attached to that deadline are higher than a typical product launch.

The implication for the team: the intelligence system must be calibrated to a 90-day operational horizon, not just long-term stewardship. What matters in the next 90 days is a materially different question than what matters over five years. Synthesis and Cerebro should surface urgency relative to that deadline explicitly.

### The Prior Ecosystem
The NDS was built in the space created by the dismantling of the prior federal design and technology infrastructure. 18F — which completed more than 455 projects across 34 agencies and built foundational civic digital tools including Login.gov and the U.S. Web Design System — was eliminated in early 2025. The U.S. Digital Service was restructured under DOGE. Dozens of experienced federal designers and technologists lost their jobs or resigned.

The team is working in an environment where the institutional knowledge and technical infrastructure of a decade of civic digital work has been significantly disrupted. This creates specific operational risks: dependencies on systems or standards that are no longer being actively maintained, gaps in the workforce that would normally support a platform transformation of this scale, and a public design community that is watching with skepticism.

---

## THE TWO FRAMINGS IN TENSION

The explore.gov engagement exists inside a fundamental tension between two ways of understanding what public lands are for. Both are live inside the current administration. The design team operates in the gap between them.

### Framing 1: Public Lands as Economic Asset
Secretary Burgum has characterized America's public lands as the nation's greatest asset on its financial "balance sheet" — a resource to be leveraged for energy production, mining, housing development, and economic growth. The administration's day-one secretarial orders from Burgum prioritized oil and gas leasing, mineral extraction, and offshore energy development on federal lands. The BLM — which manages 245 million acres, more than any other federal agency — has been repositioned as a vehicle for extraction and development rather than conservation.

This framing shapes the political environment the platform operates inside. Decisions about which lands to feature, how to describe access, and how to frame the relationship between recreation and development are not neutral design choices — they exist within this policy frame.

### Framing 2: Public Lands as American Experience
Gebbia's explicit framing for the explore.gov work is experiential and emotional: national parks are "an incredible feature of the American experience" that "were being undersold." This framing aligns with the genuine public sentiment around public lands — polling consistently shows that Americans across political lines value public land access and are skeptical of privatization or extraction.

This framing is the design team's mandate. explore.gov is an experience platform, not an extraction platform. Its value proposition is discovery, access, and relationship with the land — not resource development. The team's job is to make that framing credible and lasting.

### Holding the Tension
The team does not need to resolve this tension — it is above their pay grade and outside their mandate. What they need is to be aware that it exists and to make design decisions that serve the experiential mandate without creating platform commitments that the political environment will not sustain. Specifically:

- **Conservation language vs. recreation language:** The administration has been hostile to conservation framing. The platform's language should be built around access, discovery, and American experience — not conservation ideology. This is not a compromise of values; it is an accurate description of what the platform actually does.
- **Equity and access:** The administration has cut NPS staff significantly and reduced public land protections in some areas. The equity dimension of the platform — who gets access, whose experience is served, whose communities are within reach of public land — is a live design and political question simultaneously.
- **Monument and protected land coverage:** Several national monuments are under active policy review. The platform should not make commitments about specific land designations that may change. Feature the experience, not the designation.

---

## THE NDS CREDIBILITY PROBLEM

The team inherits a credibility deficit from NDS's prior work that it must reckon with directly. The NDS's early projects — SafeDC.gov, TrumpCard.gov, TrumpRx.gov — have been publicly criticized on two grounds that are directly relevant to explore.gov:

### 1. Aesthetics over function
Critics have characterized NDS as functioning more like an advertising agency for administration policies than a civic design program — optimizing for emotional impact and beautiful visuals while delivering poor usability and technical quality. Three NDS websites failed independent accessibility audits and did not comply with Web Content Accessibility Guidelines, which are legally required under Section 508 of the Rehabilitation Act.

The explore.gov team has an opportunity to break this pattern — and a specific obligation to do so. A platform serving 50 million reservations annually across 4,000 locations, with an explicit mandate to widen access to Americans who have historically been underserved by the outdoor recreation system, has a non-negotiable accessibility requirement. If explore.gov launches with the same accessibility failures as prior NDS work, the criticism will be sharper because the stakes are higher.

**This is a live design constraint, not a political opinion.** The team should track NDS accessibility criticism as Signal-layer intelligence and treat WCAG compliance as a hard platform requirement.

### 2. Billboard design vs. infrastructure design
The NDS has been criticized for building sites that "frame the state as something to be encountered emotionally rather than used practically" — creating beautiful pictures behind glass instead of functional civic infrastructure. explore.gov cannot afford this failure mode. The platform's entire value is functional: a user needs to book a campsite, find a trail, plan a trip, reserve a permit. If the design optimizes for Dribbble-worthy visual presentation at the expense of reservation flow completion, the platform has failed its mandate regardless of how beautiful it looks.

The intelligence the team needs: how are users actually experiencing the current Recreation.gov? Where do they fail? What do they successfully complete? What does the support ticket volume say about where the current platform breaks? This is a research and service design question, but it should be tracked as an ongoing Signal feed as the team moves from discovery to build.

---

## THE DOGE VARIABLE

The Interior Department has been subject to significant DOGE reorganization that affects the operational environment the platform serves. NPS staff cuts have affected visitor-facing operations — staffing at campgrounds, ranger programs, interpretive services — that the platform reservation system depends on. If a trail is listed as open on explore.gov but staffing has been reduced to the point where it's functionally inaccessible, the platform's credibility suffers.

The team is designing a discovery and reservation system for a physical infrastructure that is itself under budget and staffing pressure. That gap — between what the platform promises and what the physical system can deliver — is a live risk. Intelligence about NPS and BLM operational capacity, wildfire and seasonal closures, and staffing changes should be tracked as Signal that feeds into platform content strategy decisions.

---

## THE CROSS-PARTISAN OPPORTUNITY

Public lands are one of the few remaining policy areas with genuine cross-partisan support. Hunting and fishing communities, camping families, trail runners, and mountain bikers are not a single political constituency. The outdoor recreation economy generates $887 billion annually and supports 7.6 million jobs. High Country News and other public lands press have documented that opposition to public land selloffs is consistently high across Republican and Democratic voters in Western states.

explore.gov has an unusual opportunity: unlike almost any other federal digital project, its subject matter carries pre-existing emotional weight that crosses political lines. People love these places. The platform's job is to honor that love and widen access to it — which is a mission that can be pursued authentically regardless of which party controls the Interior Department.

**This is the team's political shelter.** When design decisions need defending, the defense is always: more Americans accessing more public land, more easily, more equitably. That argument is available regardless of the political frame around extraction and development. The team should use it.

---

## THE EQUITY IMPERATIVE

Outdoor recreation skews white and affluent. The barriers are structural: proximity to public land, cost of gear, cultural messaging that has historically centered specific demographics, and a reservation system that has disadvantaged people with less schedule flexibility or less digital access. The current Recreation.gov has been specifically criticized for a first-come-first-served and advance-reservation system that disproportionately benefits those who can plan months ahead and who have reliable internet access.

explore.gov's rebrand — from a transactional reservation system to a discovery and exploration platform — creates a structural opportunity to address some of these barriers. Discovery features that surface nearby and accessible public land, not just iconic destinations, can serve populations who have been effectively invisible to the current platform. Equity is not a feature to add later. It is a design constraint that should shape the information architecture, the discovery model, and the content strategy from the beginning.

The team should track equity and access discourse as Formation intelligence and as a live design constraint simultaneously.

---

## WHAT THIS MEANS FOR CEREBRO

When the team brings a question to the analytical function, it should be read against this live environment. Specifically:

- **Every design decision has a political valence.** Cerebro should name it when relevant — not to politicize the work, but to make sure the team is making choices with eyes open.
- **The July 4 deadline is always present.** Time-bounded analysis should be the default. "What does this mean in 90 days" is more useful than "what does this mean eventually."
- **The equity dimension is non-negotiable.** Any synthesis or deliberation that produces a design direction that would worsen access or usability for underserved populations should be flagged explicitly, regardless of how politically convenient that direction might be.
- **The credibility gap is an opportunity.** The NDS's prior quality failures are the team's opening. If explore.gov ships as a genuinely excellent civic digital product — accessible, functional, beautiful, and honest — it will stand in visible contrast to what came before. Name that opportunity when it's relevant to a decision.

---

*This document should be updated when: the NDS's institutional situation changes materially; a major policy decision alters the public lands landscape the platform serves; the July 4 deadline passes and the stewardship horizon becomes primary; or when the team's understanding of the equity and access dimensions deepens through research.*
