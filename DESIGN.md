# Design System: OpenRAL

> The single source of truth for the OpenRAL website (and any new screen or
> component). OpenRAL is **the open harness for physical AI** — an open-source,
> typed orchestration layer for VLA-driven robots. The site must read like
> serious developer infrastructure: precise, engineered, calm, and confident.
>
> Stack: **Vite + React + Framer Motion**, plain CSS with custom-property tokens
> (`src/styles/tokens.css`), self-hosted fonts. When in doubt, prefer the values
> in `tokens.css` over anything written here, and update both together.

---

## 1. Visual Theme & Atmosphere

A **refined-dark, fully monochrome** interface — near-black canvas, soft-white
text, zero chroma. The mood is an **instrument panel at rest**: technical,
exact, and quietly alive (a drifting dot-field, a streaming agent trace, data
pulsing along diagram edges) without ever being loud. Think a control room, not
a launch party.

- **Density:** 5 / 10 — *balanced*. Generous whitespace around prose; denser,
  data-rich modules (architecture diagram, agent console, YAML manifests) where
  the subject is genuinely technical.
- **Variance:** 6 / 10 — *offset asymmetric*. Split heroes and 60/40 panels over
  dead-centered stacks. Symmetric grids are allowed **only** for genuinely
  enumerable system content (the L0–L7 capability set, the run modes).
- **Motion:** 5 / 10 — *fluid, purposeful*. Motion conveys cause/effect (data
  flowing, the agent thinking) — never decoration for its own sake. Everything
  obeys `prefers-reduced-motion`.

**The one rule that overrides everything:** emphasis comes from **boldness and
translucency**, not color. The brightest, heaviest white is the loudest element
on any screen. There is no colored accent to reach for.

---

## 2. Color Palette & Roles

Absolute neutral, single-hue. Never pure black. The "accent" is simply **pure
white** used sparingly.

### Surfaces (near-black → charcoal)
- **Ink** `#0E0F13` (`--bg`) — page canvas. The true background.
- **Ink Raised** `#121419` (`--bg-2`) — insets, input fields, recessed wells.
- **Surface** `#16181E` (`--surface`) — cards, panels, console bodies.
- **Surface Raised** `#1C1F26` (`--surface-2`) — nested chips, node fills.
- **Hairline** `#23262E` (`--hair`) — 1px structural dividers, section borders.
- **Hairline Strong** `#2C313B` (`--hair-2`) — card borders, control outlines.

### Text (soft-white → steel)
- **Text** `#E8E9ED` (`--text`) — primary body copy. ~13:1 on Ink.
- **Text Muted** `#A9AEB8` (`--text-2`) — secondary copy, ledes, eyebrows.
- **Text Faint** `#8C93A0` (`--muted`) — metadata, mono captions, node sub-labels.
  Calibrated to clear **AA (≥4.5:1)** on Ink — do not darken below this.

### Emphasis — the "accent" is white
- **Pure White** `#FFFFFF` (`--accent`) — primary CTA fill, emphasized heading
  words, active states, focus rings, the loudest mark on screen.
- **White Tint** `rgba(255,255,255,0.82)` (`--accent-tint`) — primary CTA hover.
- **White Soft** `rgba(255,255,255,0.10)` (`--accent-soft`) — code-chip fills,
  focus glows, faint emphasis washes.
- **White Line** `rgba(255,255,255,0.22)` (`--accent-line`) — emphasized 1px
  borders (active nodes, tabs, pills).

### Status — the only permitted non-neutrals
- **Live** → a **green blinking dot** (`--live` `#4FB58B`, the live / open-source
  signal) paired with the word **"LIVE" set in white**. The pulsing green dot is
  a sanctioned status light — it reads as "the system is running." Everything
  around it stays monochrome: the **"LIVE" label itself is white** (never green),
  as are the `✓` ticks and a sent-message confirmation.
- **Error** `#D98A8E` (`--red`) — **form-validation errors only**, paired with
  text and an invalid border. This desaturated rose and the green live-dot are
  the *only two* sanctioned chromas in the system; neither may ever appear
  decoratively.

**Banned:** any colored accent (the old clay/orange and cyan are gone for good),
purple/blue "AI neon," outer-glow shadows, gradient text, pure `#000000`.

---

## 3. Typography Rules

Three self-hosted families (no third-party font requests).

- **Display — Space Grotesk** (`--display`, variable 300–700): headlines and
  card titles. An engineered grotesque with mechanical detailing — reads like a
  robotics control panel. Track-tight, weight-driven hierarchy.
- **Body — IBM Plex Sans** (`--body`, variable 400–700): all prose. An
  engineering-grade humanist sans with open-source heritage. Relaxed leading
  (1.6), ~30em (≈60–65ch) measure on ledes.
- **Mono — IBM Plex Mono** (`--mono`, weights 400/500/700): code, manifests,
  eyebrows, labels, the agent trace, all numbers and metadata. Pairs natively
  with Plex Sans.

### Scale (the canonical ladder)
| Role | Family / weight | Size |
|---|---|---|
| Hero `h1` | Clash 600 | `clamp(40px, 6.4vw, 74px)`, line-height 0.98, `-0.035em` |
| Section `h2` | Clash **400** | `clamp(28px, 4vw, 46px)`, line-height 1.1, `-0.02em` |
| Card `h3` | Clash 500 | 19px |
| Body | Satoshi 400 | 16px, line-height 1.6 |
| Lede | Satoshi 400 | `clamp(15px, 1.4vw, 18px)`, color Text Muted |
| Eyebrow | JetBrains Mono | 12px, uppercase, `0.22em` tracking, Text Muted |
| Mono caption | JetBrains Mono | 10.5–13px, Text Faint |

### The emphasis rule (critical)
Section headings are set in **light Clash Display (weight 400)** in a slightly
dimmed white (`#F4F5F7`). Emphasis is applied to **one or two words only**, via
`<em>` → **weight 700, pure `#FFFFFF`** (never italic, never colored). The whole
title is never bold; the bold words *are* the hierarchy.
> `One typed <em>contract</em>, two coupled <em>systems</em>.`

`<strong>` in body copy → `#FFFFFF`, weight 700. `<code>` → JetBrains Mono on
White Soft fill, white text.

**Banned:** `Inter` and system-font stacks for display; any serif anywhere;
all-bold headings; color-based heading emphasis.

---

## 4. Component Stylings

* **Buttons** — pill-ish radius (9px), mono label, 13px padding (≈44px target).
  - *Primary:* white fill, near-black text (`#0B0C10`), weight 700, soft **dark**
    drop-shadow (never a white halo). Hover → White Tint.
  - *Ghost:* transparent, Hairline-Strong border, white text. Hover → border
    lifts to Text Muted + 3% white wash.
  - One primary CTA per view; the arrow `→/↗` nudges 3px on hover.
* **Cards** (`.feat`, `.mode`, `.solve`, `.member`) — Surface fill, Hairline
  border, 12–16px radius. Hover lifts `translateY(-3 to -4px)` + a deep *black*
  shadow (`0 18px 50px rgba(0,0,0,.42)`). A 3px white left-rule marks capability
  cards. Never tint shadows white.
* **Console / Terminal panels** (`.agent`, `.term`, `.yaml`) — gradient
  Surface→Ink-Raised, Hairline-Strong border, 14–16px radius, traffic-light dots,
  a mono title, and a white **LIVE** pulse. This is the signature OpenRAL object:
  a framed window showing the *system running* (streaming trace, typing installer,
  live manifest). Body is JetBrains Mono.
* **Inputs** — label **above** (mono, uppercase, faint), field on Ink-Raised with
  Hairline-Strong border. Focus → white border + `0 0 0 3px` White-Soft ring.
  Error → `--red` border + a mono error line **below** the field
  (`role="alert"`, `aria-invalid`). Validate on blur, clear on fix, focus the
  first invalid field on submit.
* **Tabs / chips** (`.kind-tab`, `.chip`) — mono pills on Ink-Raised, Hairline
  border, ≥40px target. Active → white fill, near-black text. Use for switchable
  views (rSkill kinds) and live-state indicators (agent chips lighting up).
* **Nav** — centered cluster (brand · links · CTA), sticky, 12px backdrop-blur
  over translucent Ink. Scroll-spy: the in-view section's link goes pure white
  with a 1px under-rule. Inactive links are Text Muted.
* **Loaders / live states** — prefer a **typing/streaming reveal** or skeletal
  shimmer over spinners. The product's whole personality is "you can watch it
  think," so show progressive text, not a circular spinner.
* **Empty / error states** — inline, composed, and specific. State cause + the
  recovery path; never a bare "No data."

---

## 5. Layout Principles

- **Container:** centered, `max-width: 1200px` (`--maxw`). Section padding
  `clamp(56px, 9vw, 110px)` vertical, `clamp(20px, 5vw, 56px)` horizontal.
- **Spacing rhythm:** a 4px base. Common steps: 6 / 8 / 10 / 12 / 14 / 18 / 22 /
  26 / 32 / 48. Card grids gap 12–14px; hero/split gaps `clamp(32px, 5vw, 64px)`.
- **Grids over flex math** — CSS Grid for all multi-column layouts; no `calc()`
  percentage hacks.
- **Asymmetry by default** — heroes and feature sections use **split** panels
  (≈ `1.05fr / 1fr`), copy on one side, a live console/diagram on the other.
- **Section anchors** carry `scroll-margin-top: 84px` so headings clear the
  sticky nav.
- **The accepted symmetric exception:** equal-column grids (the 9 capability
  cards at 3-up, the 3 run-mode cards, the 2×2 problem grid) are allowed
  *because the content is a real, finite, typed set* — not invented marketing
  trios. Do **not** manufacture a generic "icon + title + two lines" three-up to
  fill space; if content isn't a genuine enumeration, use a zig-zag or a panel.

---

## 6. Motion & Interaction

Engine: **Framer Motion**, gated globally by `prefers-reduced-motion` (a blanket
rule collapses all CSS animation/transition to ~0ms, and JS loops fall back to a
static frame).

- **Shared easing token:** `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease`) for UI
  transitions; spring (`stiffness ~300, damping ~30`) for card/press hovers.
- **Reveals:** `whileInView` with `{ once: true, margin: "-40px" }`, fade + 18–22px
  rise, ~0.55–0.7s. Grids use `staggerChildren` 0.05–0.07.
- **Durations:** 150–300ms micro-interactions, ≤400ms section transitions; exits
  shorter than entrances.
- **Perpetual life (purposeful only):** the background **dot-field** ripples
  (canvas, ~30fps, pauses when the tab is hidden); diagram **edges** carry a
  traveling pulse; the **agent console** types a reasoner trace and lights chips;
  the **installer** types its curl command; the **LIVE** dot pulses. Each
  animation maps to a real concept (data moving, the agent thinking).
- **Transforms only** — animate `transform`/`opacity`, never `width/height/top/
  left`. No layout-shifting hover states.

---

## 7. Anti-Patterns (Banned)

Universal AI tells **and** OpenRAL-specific bans:

- **No colored accent of any kind.** No clay/orange, no cyan, no purple/blue AI
  neon, no gradient text. Emphasis is white + weight + opacity, period.
- **No green/red as decoration.** The only sanctioned chromas are the **green
  blinking live-dot** (`--live`, always paired with a *white* "LIVE" label) and
  the desaturated `--red` for form errors paired with text. Success ticks and
  confirmations stay white; never use green for text, fills or borders.
- No outer-glow / neon shadows (CTA shadows are dark, not white halos).
- No pure black `#000000` — the canvas is Ink `#0E0F13`.
- No emojis as UI — SVG icons only (GitHub / Hugging Face / Discord marks,
  inline SVG diagram glyphs), single consistent stroke language.
- No `Inter`, no system-font display, no serifs anywhere.
- No all-bold headings; emphasize one or two words only.
- No dead-centered hero (the hero is a split); no "Scroll to explore," bouncing
  chevrons, or filler scroll cues.
- No manufactured 3-up marketing card trios (equal grids only for real typed sets).
- No generic placeholders ("John Doe", "Acme"), no fake round metrics, no AI
  copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen").
- No third-party font/CDN requests (fonts are self-hosted), no broken image links.
- No animation that ignores `prefers-reduced-motion`; no `requestAnimationFrame`
  loop left running while the tab is hidden.
- Keyboard focus is always visible (`:focus-visible`, 2px white ring); never
  remove focus outlines.
