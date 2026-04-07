# EXPLORE — Replicate Image Generation Prompts
Established: 2026-04-07

*Gallery prompts for the explore.gov visual intelligence feed. Generated via Replicate. Optimized for Flux 1.1 Pro (`black-forest-labs/flux-1.1-pro`) — the recommended model for photorealistic landscape and documentary photography.*

*Aesthetic mandate: documentary and editorial photography. Not stock photography. Not Instagram influencer content. Not AI-obvious. The reference set is NPS archival photography, FSA-OWI documentary tradition, Outside magazine editorial, and contemporary American landscape photography. Every prompt should feel like it could have been taken by a photographer on assignment, not generated.*

*Diversity mandate: the gallery must represent the full spectrum of Americans who use and deserve public land. Prompts that only generate white subjects have failed the gallery's mandate. Distribute prompts deliberately across demographics.*

---

## RECOMMENDED MODEL SETTINGS

```
model: black-forest-labs/flux-1.1-pro
aspect_ratio: 3:2  (landscape/editorial default)
output_format: jpg
output_quality: 95
safety_tolerance: 2
prompt_upsampling: true
```

For portrait/vertical shots: `aspect_ratio: 2:3`
For square/social: `aspect_ratio: 1:1`
For ultra-wide landscape: `aspect_ratio: 16:9`

---

## CATEGORY 1 — AMERICAN LANDSCAPE (No People)

*The land itself. Authoritative, majestic, honest. Not pretty screensavers — land with presence.*

---

**PROMPT-L01 — High Desert, Golden Hour**
```
Wide-angle photograph of the American high desert at golden hour, red sandstone mesas casting long shadows across a sage-covered valley floor, a single two-lane highway disappearing toward the horizon, warm amber and deep violet sky, shot on 4x5 large format film, National Geographic editorial quality, cinematic depth, no people
```
`negative: oversaturated, HDR, fake clouds, lens flare, stock photo, watermark, text`

---

**PROMPT-L02 — Old Growth Forest, Pacific Northwest**
```
Documentary photograph inside an old growth forest in the Pacific Northwest, enormous Douglas fir trunks rising out of frame, soft diffused light filtering through a canopy of ferns and moss, a narrow trail disappearing into the middle distance, muted greens and browns, slight morning mist, shot on medium format film, Outside magazine editorial, intimate scale, no people
```
`negative: bright sunbeams, oversaturated green, fake bokeh, stock photo, watermark`

---

**PROMPT-L03 — Great Plains, Storm Light**
```
Dramatic landscape photograph of the American Great Plains under a massive storm sky, rolling grassland to the horizon, thunderheads building to the west, shafts of light breaking through dark clouds illuminating patches of golden grass, shot on 35mm film, Magnum Photos style documentary, wide open and slightly ominous, no people
```
`negative: tornado, disaster framing, oversaturated, HDR, fake drama, stock photo`

---

**PROMPT-L04 — Appalachian Ridge, Blue Hour**
```
Aerial-perspective photograph of Appalachian mountain ridgelines receding into the distance in blue hour light, layers of misty forested hills fading from dark green to pale blue-gray, a hawk or eagle silhouette in the upper third of frame, understated and timeless, shot on large format film, fine art landscape photography, no people
```
`negative: oversaturated, vivid filters, stock photo, watermark, text`

---

**PROMPT-L05 — River Canyon, Late Afternoon**
```
Photograph looking down into a deep river canyon, river far below catching the last direct sunlight, canyon walls in shadow with warm red and orange rock, scale implied by tiny cottonwood trees at the river's edge, compositionally spare, shot on medium format film, quiet authority, no people
```
`negative: tourists, boats, bright sky, oversaturation, fake HDR, stock photo`

---

**PROMPT-L06 — Alpine Lake, Early Morning**
```
Documentary photograph of an alpine lake at early morning, glassy surface reflecting surrounding peaks, wildflowers along the near shore still in shadow, no wind, extraordinarily still, shot on 4x5 film, slight grain, cool and clear light, the image feels genuinely unpeopled rather than emptied of people, no people
```
`negative: crowds, reflections in sunglasses, oversaturation, perfect postcard composition, stock photo`

---

**PROMPT-L07 — Coastal Tide Pools, Maine**
```
Intimate documentary photograph of rocky Maine coastline tide pools at low tide, seaweed-covered granite boulders, small pools reflecting gray overcast sky, barnacles and periwinkles visible, cold Atlantic light, shot on 35mm film, understated and honest, feels like it was taken by someone who grew up near the water, no people
```
`negative: tropical, oversaturated, warm light, stock photo, watermark`

---

**PROMPT-L08 — Winter National Park**
```
Photograph of a national park in deep winter, snow-covered geothermal features or frozen river, steam rising in cold air, everything white and gray and muted blue, distant elk or bison silhouette optional, extreme quietude, shot on medium format film, almost monochromatic, no people
```
`negative: colorful ski gear, tourists, oversaturation, sunny blue sky, stock photo`

---

## CATEGORY 2 — PEOPLE ON PUBLIC LAND

*Americans in the act of discovery, rest, awe, and belonging. Diverse by design. Not posed. Not performative. Real.*

---

**PROMPT-P01 — Black Family, Campfire**
```
Documentary photograph of a Black American family gathered around a campfire at dusk in a national forest, three generations visible, faces warm in firelight, tents in background, casual and genuinely comfortable, not posed, shot on 35mm film, warm but honest, intimate editorial photography, feels like a real family camping trip
```
`negative: posed, stock photo, artificial smiles, white subjects, watermark, advertising`

---

**PROMPT-P02 — Latina Grandmother and Grandchild, Trail**
```
Documentary photograph of a Latina grandmother and her young granddaughter walking a forest trail together, the child pointing at something off-camera with curiosity, grandmother's expression one of quiet attention, dappled light through deciduous trees, autumn colors beginning, shot on 35mm film, natural and unposed, feels genuinely observed
```
`negative: posed, stock photo, artificial, watermark, professional gear`

---

**PROMPT-P03 — Solo Black Hiker, Summit**
```
Photograph of a young Black man sitting on a rock at a mountain summit, backpack beside him, looking out at a vast view below, not triumphant posing but genuine rest and contemplation, late afternoon light, slight wind in jacket, shot on medium format film, intimate and honest, not performative
```
`negative: triumph pose, arms raised, advertising, stock photo, watermark`

---

**PROMPT-P04 — Asian American Family, River**
```
Documentary photograph of an Asian American family — parents and two children — at the edge of a clear mountain river, kids barefoot in the shallows, parents sitting on rocks watching, expressions of ease and pleasure, summer light filtered through cottonwoods, shot on 35mm film, completely natural and unposed
```
`negative: posed, stock photo, watermark, artificial smiles, advertising`

---

**PROMPT-P05 — Native American Elder, Public Land**
```
Respectful documentary photograph of a Native American elder standing at the edge of a mesa overlooking a canyon landscape, traditional clothing and modern clothing combined, looking toward the horizon, not performing for the camera, the landscape behind him enormous and ancient, shot on medium format film, quiet and dignified
```
`negative: stereotyped, posed, touristy, watermark, stock photo, exoticized`

---

**PROMPT-P06 — Solo Woman, Backcountry Camp**
```
Documentary photograph of a woman in her 40s setting up a solo backcountry camp in a high meadow, competent and focused, not performing for anyone, warm late light, mountains visible behind, she is clearly experienced and at ease, shot on 35mm film, intimate editorial photography
```
`negative: posed, stock photo, glamour hiking, advertising aesthetic, watermark`

---

**PROMPT-P07 — Hispanic Family, First National Park Visit**
```
Documentary photograph of a Hispanic family — parents and three children — at the entrance to a national park, children reading the interpretive sign with genuine curiosity, parents photographing with a phone, the mix of wonder and tourist normalcy, shot on 35mm film, warm afternoon light, honest and affectionate observation
```
`negative: posed, stock photo, artificial, watermark, advertising`

---

**PROMPT-P08 — Mixed Group of Friends, Trail Rest**
```
Documentary photograph of a multiracial group of friends in their late 20s resting on a long trail, sitting on rocks and fallen logs, water bottles out, a shared map, genuine conversation and laughter, tired but happy, shot on 35mm film, feels like a real moment on a long hike
```
`negative: posed, advertising, professional models, stock photo, watermark`

---

**PROMPT-P09 — Child's First Encounter with Wildlife**
```
Documentary photograph of a young Black child, approximately 7 years old, frozen in wonder watching a deer graze at the edge of a meadow, the child's expression pure astonishment, a parent's hand on their shoulder from behind, soft morning light, shot on 35mm film, the intimacy of a moment of first discovery
```
`negative: posed, stock photo, artificial, dangerous proximity to wildlife, watermark`

---

## CATEGORY 3 — CAMPING & SHELTER

*The culture and texture of overnight stays on public land.*

---

**PROMPT-C01 — Tent at Dawn**
```
Documentary photograph of a single backpacking tent at dawn, pitched in an alpine meadow, condensation on the rainfly, first light on distant peaks just catching orange, the tent glowing faintly from inside with a headlamp, the scale of the landscape dwarfing the tent, shot on medium format film, quietly epic
```
`negative: fancy glamping, oversaturation, advertising, stock photo, watermark`

---

**PROMPT-C02 — Campfire Cooking**
```
Intimate photograph of hands over a camp stove, cooking a simple meal, a tin cup nearby, pine needles on the ground, evening light almost gone, the warmth and ritual of camp cooking, shot on 35mm film, warm and honest, feels like personal documentation
```
`negative: advertising, professional food photography, stock photo, posed, watermark`

---

**PROMPT-C03 — Inside the Tent, Morning**
```
Photograph from inside a backpacking tent looking out through the open door at a mountain landscape, the tent fabric framing the view, sleeping bag partially visible, morning light flooding in, a pair of worn hiking boots outside the door, intimate and peaceful, shot on 35mm film
```
`negative: glamping, luxury, advertising, stock photo, watermark`

---

**PROMPT-C04 — Starfield Over Campsite**
```
Long-exposure night photograph of a campsite under the Milky Way, tent illuminated from inside with warm light, surrounding pine trees silhouetted against an extraordinary star field, a figure sitting outside looking up, extraordinary dark sky, shot on digital with film-like processing, awe without sentimentality
```
`negative: over-processed, fake star colors, advertising, stock photo, watermark`

---

## CATEGORY 4 — WAYFINDING & INFRASTRUCTURE

*Signs, trails, interpretive markers — the human layer that connects visitors to land.*

---

**PROMPT-W01 — National Park Entrance Sign**
```
Documentary photograph of a classic National Park Service carved wooden entrance sign, weather-worn and authoritative, afternoon light raking across the carved letters, pine forest behind, no cars or crowds visible, shot on medium format film, respects the sign as civic artifact
```
`negative: crowds, cars, touristy, oversaturated, stock photo, watermark`

---

**PROMPT-W02 — Trail Junction Sign**
```
Documentary photograph of a wooden trail junction sign deep in the backcountry, multiple destinations with mileages, the wood silver and cracked from seasons of weather, a narrow trail visible in each direction, the loneliness and clarity of backcountry navigation, shot on 35mm film
```
`negative: busy, crowds, manicured, stock photo, watermark`

---

**PROMPT-W03 — Interpretive Panel**
```
Documentary photograph of a well-designed park interpretive panel beside a trail, a visitor's hand touching the illustrated map section, late afternoon light, the panel weathered but legible, the design clearly mid-century government design, shot on 35mm film, the intersection of civic infrastructure and natural setting
```
`negative: stock photo, advertising, watermark, staged`

---

## CATEGORY 5 — WATER

*Rivers, lakes, coastlines. America's hydrological public lands.*

---

**PROMPT-WA01 — River Float**
```
Documentary photograph of a person floating in an inflatable raft on a calm desert river, canyon walls rising on both sides, the river olive-green in shadow, the rafter's arm trailing in the water, silence implied, shot on medium format film, the intimacy of river travel in canyon country
```
`negative: rapids, danger, advertising, stock photo, watermark`

---

**PROMPT-WA02 — Waterfall, Olympic Peninsula**
```
Photograph of a waterfall deep in Pacific Northwest temperate rainforest, moss-covered everything, the water white and blurred in a one-second exposure, ancient and quiet, the photographer is not present, shot on large format film, extremely deep greens, slightly dark
```
`negative: tourists, oversaturation, stock photo, bright sunny sky, watermark`

---

## PROMPT BATCHING FOR VARIETY

*Run these sequences to generate a balanced gallery set:*

**For a 20-image gallery launch:**
- 7 landscape prompts (L01 through L07)
- 7 people prompts (P01 through P07) — use all demographic variants
- 3 camping prompts (C01, C02, C04)
- 1 wayfinding prompt (W01)
- 2 water prompts (WA01, WA02)

**For weekly gallery refresh (5 new images):**
- 1 landscape (rotate through)
- 2 people (prioritize underrepresented demographics)
- 1 camping or wayfinding
- 1 free choice from any category

---

## PROMPT ENGINEERING NOTES

**What makes these prompts work:**
- Specifying film format (35mm, medium format, 4x5) signals photorealistic grain and color science without over-specifying post-processing
- "Documentary" and "editorial" register consistently produce candid, non-posed results
- Named magazines (Outside, National Geographic, Magnum) calibrate quality expectations
- Negative prompts targeting "stock photo" and "advertising" actively push away the plastic aesthetic
- Demographic specificity in people prompts is required, not optional — vague prompts default to white subjects

**What to avoid:**
- "Beautiful" — produces generic stock
- "Epic" — produces advertising
- "Perfect" — produces artificial
- Naming specific national parks — models may produce location-specific errors
- Specific celebrity faces or real people

**Iterate by:**
- Adding specific light conditions: "overcast diffused light," "window light analog," "blue hour"
- Adding specific seasons: "late October," "deep February," "early June"
- Adding regional specificity: "Colorado Plateau," "Great Smoky Mountains," "North Cascades," "Sonoran Desert"
- Varying the film stock reference: "Kodachrome 64," "Fuji Velvia," "Tri-X 400 black and white"

**For black and white gallery variations:**
Add to any prompt: `converted to black and white in darkroom tradition, rich tonal range, slight grain, not desaturated — developed`

---

*Gallery images generated by AI should be clearly labeled as generated in any team-facing use. For the public-facing explore.gov platform, generated imagery should not be used — only licensed, archival, or commissioned photography.*
