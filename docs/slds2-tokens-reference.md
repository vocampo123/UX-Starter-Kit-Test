# SLDS 2 Tokens & Style Reference

Extracted from the SLDS 2 Style Guide (Figma). Use this when writing component CSS — always prefer these hooks over hardcoded values.

---

## Spacing

Spacing governs `padding` and `margin`. Based on a 4px grid.

| Token | Value | Common use |
|-------|-------|------------|
| `--slds-g-spacing-1` | 4px | Tight inline gaps |
| `--slds-g-spacing-2` | 8px | Icon-to-label gap, compact lists |
| `--slds-g-spacing-3` | 12px | — |
| `--slds-g-spacing-4` | 16px | Standard padding, card inner padding |
| `--slds-g-spacing-5` | 20px | — |
| `--slds-g-spacing-6` | 24px | Section padding |
| `--slds-g-spacing-7` | 28px | — |
| `--slds-g-spacing-8` | 32px | Large section gaps |
| `--slds-g-spacing-10` | 40px | — |
| `--slds-g-spacing-12` | 48px | — |
| `--slds-g-spacing-14` | 56px | — |
| `--slds-g-spacing-16` | 64px | — |
| `--slds-g-spacing-18` | 72px | — |
| `--slds-g-spacing-20` | 80px | — |

> **Rule:** Spacing = padding/margin. Sizing = fixed height/width. Do not use spacing tokens to set `width` or `height`.

---

## Sizing

Sizing governs fixed `height` and `width`. Based on an 8px grid.

| Token | Value |
|-------|-------|
| `--slds-g-sizing-1` | 8px |
| `--slds-g-sizing-2` | 16px |
| `--slds-g-sizing-3` | 24px |
| `--slds-g-sizing-4` | 32px |
| `--slds-g-sizing-5` | 40px |
| `--slds-g-sizing-6` | 48px |
| `--slds-g-sizing-7` | 56px |
| `--slds-g-sizing-8` | 64px |
| `--slds-g-sizing-9` | 72px |
| `--slds-g-sizing-10` | 80px |

---

## Border Radius

| Token | Value | Used by |
|-------|-------|---------|
| `--slds-g-radius-border-1` | 4px | Badges, checkboxes, tooltips |
| `--slds-g-radius-border-2` | 8px | Inputs, comboboxes, tooltips (alt) |
| `--slds-g-radius-border-3` | 12px | Menus, popovers, dropdown panels |
| `--slds-g-radius-border-4` | 20px | Cards, modals, docked composers |
| `--slds-g-radius-border-circle` | 9999px | Buttons, button-icons, avatars, radios, pills |

---

## Border Width

| Token | Value | Used by |
|-------|-------|---------|
| `--slds-g-sizing-border-1` | 1px | Inputs, outline buttons, standard borders |
| `--slds-g-sizing-border-2` | 1.5px | — |
| `--slds-g-sizing-border-3` | 2px | Focus ring / focus state |
| `--slds-g-sizing-border-4` | 3px | — |

---

## Typography

**Font families (applied automatically by SLDS 2):**
- macOS/iOS: SF Pro
- Windows: Segoe UI
- Android/other: Roboto

**Font scale** (use `--slds-g-font-scale-*`):

| Token | Size | Weight options |
|-------|------|----------------|
| `--slds-g-font-scale-neg-4` | smallest | — |
| `--slds-g-font-scale-neg-3` | — | — |
| `--slds-g-font-scale-neg-2` | — | — |
| `--slds-g-font-scale-neg-1` | — | — |
| `--slds-g-font-scale-1` | base body | Regular (400) |
| `--slds-g-font-scale-2` | — | — |
| `--slds-g-font-scale-3` | — | — |
| `--slds-g-font-scale-4` | — | — |
| `--slds-g-font-scale-5` | — | Semibold (590) |
| `--slds-g-font-scale-6` | — | — |
| `--slds-g-font-scale-7` | — | — |
| `--slds-g-font-scale-8` | — | — |
| `--slds-g-font-scale-9` | — | — |
| `--slds-g-font-scale-10` | largest display | Light (274) |

**Named font weights:**
- Light: 274
- Regular: 400
- Semibold: 590

---

## Color Hooks

SLDS 2 color tokens are organized into semantic families. Always provide a hex fallback.

### Surface (backgrounds)

**Decision table — pick the right token for each layer:**

| Layer | Token | Fallback | Notes |
|---|---|---|---|
| App shell / page canvas | `--slds-g-color-surface-2` | `#f3f3f3` | The grey canvas behind all content. |
| Card / panel surface | `--slds-g-color-surface-container-1` | `#ffffff` | White background inside `lightning-card`, modals, panels |
| White page (no grey canvas) | `--slds-g-color-surface-1` | `#ffffff` | Use when the full viewport should be white (e.g. setup pages, full-bleed forms) |
| Subtle recessed panel | `--slds-g-color-surface-3` | `#e5e5e5` | Inset zones, read-only field backgrounds, striped rows |
| Secondary card / nested container | `--slds-g-color-surface-container-2` | `#f3f3f3` | Sub-cards or panels nested inside a primary card |

**The most common mistake:** hardcoding a background hex value instead of using the surface hook. The hook respects theme overrides (dark mode, high-contrast, customer branding); a hardcoded value breaks in all of them.

```css
/* Correct */
background-color: var(--slds-g-color-surface-2, #f3f3f3);       /* page canvas */
background-color: var(--slds-g-color-surface-container-1, #fff); /* card interior */

/* Wrong */
background-color: #f3f3f3;
background-color: #ffffff;
background-color: white;
```

### On-surface (text on backgrounds)
```css
color: var(--slds-g-color-on-surface-1, #080707);   /* primary text */
color: var(--slds-g-color-on-surface-2, #444);       /* secondary text */
color: var(--slds-g-color-on-surface-3, #706e6b);    /* placeholder / tertiary */
```

### Border
```css
border-color: var(--slds-g-color-border-1, #dddbda);  /* standard border */
border-color: var(--slds-g-color-border-2, #c9c7c5);  /* strong border */
```

### Accent (brand/interactive)
```css
color: var(--slds-g-color-brand-1, #0176d3);          /* primary brand link/action */
background-color: var(--slds-g-color-brand-2, #0176d3); /* filled brand bg */
```

### Feedback
```css
/* Error */
color: var(--slds-g-color-feedback-error-1, #ba0517);
background-color: var(--slds-g-color-surface-error-1, #fef1ee);

/* Warning */
color: var(--slds-g-color-feedback-warning-1, #dd7a01);
background-color: var(--slds-g-color-surface-warning-1, #fef6e6);

/* Success */
color: var(--slds-g-color-feedback-success-1, #2e844a);
background-color: var(--slds-g-color-surface-success-1, #eff7f0);

/* Info */
color: var(--slds-g-color-feedback-info-1, #0176d3);
background-color: var(--slds-g-color-surface-info-1, #eff6fe);
```

---

## Icons

SLDS 2 icon categories and usage rules:

| Category | Tag | Background | When to use |
|----------|-----|------------|-------------|
| Utility | `utility:*` | None — inherits text color | Actions, inline glyphs, UI affordances |
| Standard / Object | `standard:*` | Colored circle (required in SLDS 2) | Object type indicators (Account, Contact, etc.) |
| Action | `action:*` | Colored circle | FAB-style quick actions |
| Doctype | `doctype:*` | None | File type indicators |

**Key rule for SLDS 2:** Object/standard icons **must** have a circle background. Use `lightning-icon` with `icon-name="standard:account"` — the circle is applied automatically. Do not strip it with CSS.

**Utility icon color:** Always inherits from adjacent text — do not hardcode a fill color.

**Empty states:** Pair an illustration-style icon with a heading and body text. Use `lightning-illustration` or the SLDS empty state blueprint.

---

## CSS property → hook mapping

| CSS property | Hook family |
|--------------|-------------|
| `background-color` | `--slds-g-color-surface-*`, `--slds-g-color-brand-*`, `--slds-g-color-feedback-*` |
| `border-color` | `--slds-g-color-border-*` |
| `color` | `--slds-g-color-on-surface-*`, `--slds-g-color-brand-*` |
| `fill` (SVG) | `--slds-g-color-on-surface-*` (utility icons only) |
| `border-radius` | `--slds-g-radius-border-*` |
| `box-shadow` | `--slds-g-shadow-*` |
| `font-size` | `--slds-g-font-scale-*` |
| `font-weight` | Use numeric values: 274, 400, 590 |
| `padding` / `margin` | `--slds-g-spacing-*` |
| `width` / `height` | `--slds-g-sizing-*` |
