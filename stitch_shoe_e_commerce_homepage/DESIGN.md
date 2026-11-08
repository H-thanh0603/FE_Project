---
name: Kinetic Drop
colors:
  surface: '#f8f9ff'
  surface-dim: '#d6dae3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4fd'
  surface-container: '#eaeef7'
  surface-container-high: '#e4e8f1'
  surface-container-highest: '#dee3ec'
  on-surface: '#171c22'
  on-surface-variant: '#5e3f38'
  inverse-surface: '#2c3138'
  inverse-on-surface: '#edf1fa'
  outline: '#936f66'
  outline-variant: '#e8bdb3'
  surface-tint: '#b52700'
  primary: '#b02600'
  on-primary: '#ffffff'
  primary-container: '#dd3200'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a2'
  secondary: '#5e5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfe2'
  on-secondary-container: '#626265'
  tertiary: '#4e6400'
  on-tertiary: '#ffffff'
  tertiary-container: '#647e00'
  on-tertiary-container: '#fbffe4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3d0700'
  on-primary-fixed-variant: '#8a1c00'
  secondary-fixed: '#e3e2e4'
  secondary-fixed-dim: '#c7c6c9'
  on-secondary-fixed: '#1b1c1e'
  on-secondary-fixed-variant: '#464749'
  tertiary-fixed: '#c3f400'
  tertiary-fixed-dim: '#abd600'
  on-tertiary-fixed: '#161e00'
  on-tertiary-fixed-variant: '#3c4d00'
  background: '#f8f9ff'
  on-background: '#171c22'
  surface-variant: '#dee3ec'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects high-octane energy, editorial authority, and precision street culture tailored for sneaker enthusiasts, collectors, and hype-driven consumers. The UI evokes urgency, tactile lust, and cultural exclusivity.

The visual direction merges **High-Contrast Bold** with **Precision Brutalism**:
- **Pacing & Energy:** High-impact editorial cutaways, aggressive typographic scale, and kinetic transitions that mimic rapid release drops.
- **Surface Integrity:** Crisp, structural borders paired with deep pitch-black chassis elements, stark white canvases, and vivid neon-crimson highlights.
- **Tone:** Uncompromising, modern, curated, and athletic. Interface elements remain ruthlessly engineered to let photography and silhouette profiles dominate.

## Colors

The palette establishes intense visual tension through high-chroma signals over clinical monochrome foundations.

- **Primary (`#FF3B00` - Electric Crimson):** Reserved strictly for primary conversion actions, live drop indicators, high-heat raffle timers, and critical focus states.
- **Secondary (`#0F1012` - Deep Obsidian/Graphite):** Structural chassis tone, dominant header typography, primary CTA surface inversions, and high-impact hero ribbons.
- **Tertiary (`#CCFF00` - Volt Lime):** Accent flare used sparingly for release status badges, "Verified Authentic" tags, and micro-metric upticks.
- **Neutral (`#70757D` - Industrial Slag):** Mid-tone slate calibrated for metadata, auxiliary breadcrumbs, technical specifications, and inactive borders.

### Surface System
- `surface-canvas`: `#FFFFFF`
- `surface-subtle`: `#F5F5F7`
- `surface-raised`: `#FFFFFF`
- `surface-dark`: `#0F1012`
- `border-hairline`: `rgba(15, 16, 18, 0.08)`
- `border-contrast`: `#0F1012`

## Typography

Typographic scale drives narrative rhythm and athletic speed. 

- **Space Grotesk** commands all high-level display, headlines, and structured badges. Its geometric tension, sharp apexes, and technical posture convey industrial craft. All label tiers (`label-lg`, `label-md`, `label-sm`) enforce uppercase transformation with positive letter tracking for authentic streetwear grit.
- **Hanken Grotesk** serves as the utilitarian workhorse for descriptions, editorial body copy, sizing specs, and customer checkout flows, ensuring effortless legibility during high-stress checkout phases.
- Headlines across mobile utilize compressed line heights (`1.05` to `1.15`) to preserve brutal editorial impact on smaller viewports.

## Layout & Spacing

The layout model enforces a structured 12-column fluid grid on desktop, scaling to 8 columns on tablet and 4 columns on mobile.

### Viewport Breakpoints
- **Mobile (< 768px):** 4 columns, `margin-mobile` (1rem), `gutter-mobile` (0.75rem). Elements stack vertically; release matrices collapse into horizontally swiping rail trays.
- **Tablet (768px – 1024px):** 8 columns, `margin` (2rem), `gutter` (1rem). Product grids adopt standard 2-up configurations.
- **Desktop (> 1024px):** 12 columns, max-width container capped at `1440px`, `margin` (3rem), `gutter` (1.5rem).

### Layout Rules
- **Editorial Contrast:** High-density metric trays (e.g., StockX-style ticker rows, market depth data) directly flank expansive, full-bleed shoe silhouette galleries.
- **Vertical Rhythm:** Macro sections separate at `4rem` intervals to let hero imagery breathe, while internal card components maintain dense, high-frequency internal grouping using `space-xs` and `space-sm`.

## Elevation & Depth

Visual hierarchy abandons diffuse corporate shadows in favor of **Crisp Architectural Outlines** and **Directional Offset Shadows**.

- **Level 0 (Flat / Canvas):** Pure `#FFFFFF` or `#F5F5F7` surfaces bordered with `1px solid rgba(15, 16, 18, 0.08)`.
- **Level 1 (Resting Cards & Modules):** `background: #FFFFFF; border: 1px solid rgba(15, 16, 18, 0.12); box-shadow: 0 4px 12px rgba(15, 16, 18, 0.04);`
- **Level 2 (Active / Hover Product Tiles):** Translates `-2px` on the Y-axis. `border-color: #0F1012; box-shadow: 0 12px 28px rgba(15, 16, 18, 0.12), 4px 4px 0px #0F1012;`
- **Level 3 (Modals, Slide-over Drawers, Fast-Buy Trays):** `background: #FFFFFF; border: 2px solid #0F1012; box-shadow: 0 24px 48px rgba(15, 16, 18, 0.24);`
- **Glass Overlays (Image Zoom / Floating Specs):** `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(15, 16, 18, 0.1);`

## Shapes

The design system specifies **Soft (`1`)** geometry to echo the engineering of modern performance sneakers: angular, technical, and precise, rather than hyper-rounded or bubbly.

- **Base Radius (`0.25rem`):** Applied to input fields, regular buttons, segmented sizing selectors, and specification tables.
- **Large Radius (`0.5rem` / `rounded-lg`):** Product showcase cards, modular dialog containers, and cart drawers.
- **Pill Exceptions (`9999px`):** Reserved exclusively for dynamic status chips (e.g., "LIVE NOW", "HEAT INDEX", "AUTHENTIC") to visually disengage system status indicators from interactive structural elements.

## Components

### Buttons
- **Primary Action (Instant Buy / Enter Raffle):** Obsidian black background (`#0F1012`), pure white text, uppercase `label-lg`, `0.25rem` corner radius. Interactive state transitions instantly to `#FF3B00` on hover with a crisp `2px 2px 0px #0F1012` drop offset.
- **Secondary (Bid / View Market):** Transparent background with `2px solid #0F1012` outline, uppercase `label-lg`. On hover, inverts to solid `#0F1012` fill with white text.
- **Tertiary (Ghost / Inline Utility):** Pure text with an animated bottom border underline (`#0F1012`) expanding from center on hover.

### Badges & Drop Tags
- **"New Drop" / "Selling Fast":** Solid `#FF3B00` fill with `#FFFFFF` text, tracking at `0.1em`, fully uppercase `label-sm`, pill-shaped padding (`0.25rem 0.625rem`).
- **"Verified Authentic":** `#CCFF00` fill with `#0F1012` text, accompanied by an obsidian shield or checkmark micro-icon.
- **"Deadstock / Vault":** `#0F1012` background with `#CCFF00` text.

### Product Cards
- Contained within `1px solid rgba(15, 16, 18, 0.12)`.
- Background set to clean `#F5F5F7` backdrop behind sneaker assets, cut with sharp bleed lines.
- Top-left pinned tag system for scarcity indicators. Top-right persistent quick-save heart toggle.
- Bottom partition shifts to crisp `#FFFFFF` storing sneaker silhouette name (`headline-sm`), lowest ask / retail price in bold Space Grotesk, and size range chips.

### Size Selector Chips
- Segmented grid cells with `1px solid rgba(15, 16, 18, 0.2)` borders.
- Default: White background, `#0F1012` text.
- Active/Selected: Solid `#0F1012` background, pure white text, accompanied by a tiny top-right micro-pip in `#FF3B00`.
- Out of Stock: Light gray strike-through slash with muted `#70757D` text, non-interactive.

### Input Fields & Search
- Low-profile form inputs using `#F5F5F7` backgrounds, enclosed by `1px solid rgba(15, 16, 18, 0.15)`.
- Focus state triggers an instant `2px solid #0F1012` border and canvas shift to pure `#FFFFFF`.
- Dropdown autocomplete displays real-time shoe thumbnail, release year, and current market value tier.

### Ticker & Market Depth (Specialty Component)
- High-velocity bar ticker pinned below navigation displaying last sold price, 24h market volume delta, and countdown clock for upcoming drops. Negative values rendered in `#70757D`, positive surges marked with `#CCFF00`.