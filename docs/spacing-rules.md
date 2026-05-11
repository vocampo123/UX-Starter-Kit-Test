# Spacing Rules

Authoritative quick reference for spacing in this repo. Read this **before** writing any UI markup or CSS so you don't have to re-prompt to fix gaps, double padding, or "things look off."

For the deeper rationale (4-point grid, density tokens, accessibility target sizes), see:
- `.agent/skills/afv-library/applying-slds/guidance/overviews/spacing.md`
- `.agent/skills/afv-library/applying-slds/guidance/styling-hooks/spacing.md`
- `.agent/skills/afv-library/applying-slds/guidance/utilities/padding.md`
- `docs/slds2-tokens-reference.md`

---

## TL;DR — the 7 rules that prevent 90% of spacing bugs

1. **Always wrap `<lightning-card>` body content in a padding div.** `lightning-card` does not pad its default slot — content sits flush to the card edge unless you wrap it.
2. **Use `gap` (or `slds-gutters_*`) for vertical rhythm, not per-item `slds-m-bottom_*`.** Per-item bottom margins create uneven gaps when rows wrap on smaller viewports.
3. **Inside `<lightning-tabset>` panels, pick ONE of: trust the default panel padding, or zero `--slds-c-tab-panel-spacing-block-*` and supply your own wrapper. Never both, never neither.**
4. **Use density-aware classes (`slds-var-p-*`) for components that should respond to comfy/compact: cards, lists, tables, page headers, tabs, form rows.** Use fixed `slds-p-*` only for outer page gutters and modals.
5. **Pick ONE scale band per component** and stay in it. Compact (1–4) **or** standard (5–8) **or** macro (10–16). Sliding 2/3/4 inside one component reads as drifty.
6. **Do not add `slds-p-top_*` on a body wrapper that sits directly under `slds-page-header`.** The page header already supplies its own block-end padding.
7. **Style LBC internals with `--slds-c-*` custom properties, never with descendant selectors.** Synthetic shadow DOM blocks descendant selectors, so they silently fail and you reach for `!important` (which is banned).

---

## Canonical patterns — copy these

### Pattern 1 — Card body padding (the #1 trap)

`<lightning-card>` provides chrome (header, footer, border, radius) but its default slot has **zero internal padding**. Always wrap body content.

DO:

```html
<lightning-card title="Section title">
  <div class="slds-var-p-around_medium">
    <!-- card body content -->
  </div>
</lightning-card>
```

DON'T:

```html
<lightning-card title="Section title">
  <lightning-input label="Name"></lightning-input>
  <!-- content is flush against the card edge -->
</lightning-card>
```

### Pattern 2 — Vertical rhythm between sections

Use one container with `gap`. Do **not** stack components by margining each one individually.

DO — flex column with `gap` declared once in component CSS:

```html
<div class="page-stack">
  <lightning-card> ... </lightning-card>
  <lightning-card> ... </lightning-card>
  <lightning-card> ... </lightning-card>
</div>
```

```css
.page-stack {
  display: flex;
  flex-direction: column;
  gap: var(--slds-g-spacing-6, 1.5rem);
}
```

DON'T — orphan bottom margins (uneven gaps when rows wrap):

```html
<lightning-card class="slds-m-bottom_large"> ... </lightning-card>
<lightning-card class="slds-m-bottom_large"> ... </lightning-card>
<lightning-card class="slds-m-bottom_large"> ... </lightning-card>
```

### Pattern 3 — Two-column grid inside a card body

Use `slds-grid slds-wrap slds-gutters_*` plus a per-cell `slds-p-bottom_*` for row spacing. Skip `pull-to-boundary`.

DO:

```html
<lightning-card title="Form">
  <div class="slds-var-p-around_medium">
    <div class="slds-grid slds-wrap slds-gutters_small">
      <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-p-bottom_small">
        <lightning-input label="First name"></lightning-input>
      </div>
      <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-p-bottom_small">
        <lightning-input label="Last name"></lightning-input>
      </div>
    </div>
  </div>
</lightning-card>
```

DON'T — `pull-to-boundary` paired with utility margins on the same axis:

```html
<lightning-layout multiple-rows="true" pull-to-boundary="small">
  <lightning-layout-item padding="horizontal-small" class="slds-m-top_small">
    <!-- pull-to-boundary cancels outer padding; slds-m-top_small fights back; result is unpredictable -->
  </lightning-layout-item>
</lightning-layout>
```

`pull-to-boundary` is only correct when the parent has explicit padding equal to the boundary value AND every item declares a matching `padding=`. Most of the time the grid + gutters pattern above is simpler and produces the same result.

### Pattern 4 — Tab content padding (pick one path)

`<lightning-tab>` panels ship with their own block padding. You must pick A or B — never both, never neither.

DO (A) — trust the default and write content directly:

```html
<lightning-tabset>
  <lightning-tab label="Details">
    <p>Default panel padding applies.</p>
  </lightning-tab>
</lightning-tabset>
```

DO (B) — zero the panel's block padding, then own it via your own wrapper:

```html
<lightning-tabset class="custom-tabs">
  <lightning-tab label="Details">
    <div class="slds-var-p-around_medium">
      <!-- you fully own padding now -->
    </div>
  </lightning-tab>
</lightning-tabset>
```

```css
.custom-tabs {
  --slds-c-tab-panel-spacing-block-start: 0;
  --slds-c-tab-panel-spacing-block-end: 0;
}
```

DON'T — wrap and keep the default. That's doubled padding:

```html
<lightning-tab label="Details">
  <div class="slds-p-around_medium">
    <!-- panel default block padding + this wrapper = double gap -->
  </div>
</lightning-tab>
```

### Pattern 5 — Density-aware utilities and hooks

Density-sensitive components (cards, lists, tables, page headers, tabs, form rows, tiles, list-view rows) should adapt when the user toggles comfy/compact. Use the `var` flavors:

| Fixed (don't auto-adapt) | Density-aware (auto-adapt) |
|--------------------------|----------------------------|
| `slds-p-around_medium` | `slds-var-p-around_medium` |
| `slds-p-horizontal_small` | `slds-var-p-horizontal_small` |
| `slds-p-vertical_medium` | `slds-var-p-vertical_medium` |
| `slds-m-around_medium` | `slds-var-m-around_medium` |

In CSS:

```css
.activity-card-body {
  padding-block: var(--slds-g-spacing-var-block-4, 1rem);
  padding-inline: var(--slds-g-spacing-var-inline-4, 1rem);
}
```

Use **fixed** spacing (no `var`) for: outer page gutter, modal body padding, hero/marketing blocks where density should not change layout.

### Pattern 6 — Page header followed by body

`slds-page-header` already supplies its own block-end padding. Don't add top padding on the body directly underneath.

DO:

```html
<div class="slds-page-header slds-page-header_record-home">...</div>
<div class="slds-grid slds-gutters slds-p-horizontal_medium slds-p-bottom_medium">
  <!-- no slds-p-top_* here -->
</div>
```

DON'T:

```html
<div class="slds-page-header">...</div>
<div class="slds-p-around_medium">
  <!-- doubled gap above the body -->
</div>
```

### Pattern 7 — Customizing LBC internals

LBCs render in synthetic shadow. Descendant selectors like `.foo .slds-button { padding: ... }` silently fail to apply. The supported way to change internal padding/sizing is via the LBC's `--slds-c-*` custom properties.

DO — component custom properties pierce shadow DOM:

```css
.compact-button-group {
  --slds-c-button-spacing-inline-end: var(--slds-g-spacing-1, 0.25rem);
}
```

DON'T — descendant selector, won't apply:

```css
.compact-button-group .slds-button { padding: 4px; }
```

If you don't know the right `--slds-c-*` hook for a given LBC, search the SLDS bundle:

```bash
rg -l "--slds-c-tab-panel" node_modules/@salesforce-ux/design-system/scss
```

#### When even your `--slds-c-*` host override doesn't work — the shadow-inheritance trap

You set a `--slds-c-*` hook on the LBC host and nothing changes. The hook is correct, your syntax is correct, but the value never reaches the element.

The cause: the cosmos SLDS 2 theme stylesheet re-sets the same variable on an internal element inside the LBC's shadow DOM, **closer** to the consumer than your host-level override. Inheritance flows down, but a closer redefinition wins.

Example — `<lightning-tabset>` tab indicator thickness:

```css
/* Your override on the tabset host. Does nothing. */
lightning-tabset.my-tabs {
    --slds-c-tabs-list-sizing-border: 3px;   /* shadowed by cosmos */
}
```

Why it fails — cosmos contains:

```css
/* node_modules/@salesforce-ux/design-system-2/dist/components/tabs/themes/cosmos.css */
.slds-tabs_default {
    --slds-c-tabs-list-sizing-border: var(--slds-g-sizing-border-1);  /* 1px */
}
```

`.slds-tabs_default` is rendered **inside** the lightning-tab-bar's synthetic shadow root. It sits below your `lightning-tabset.my-tabs` in the inheritance chain, so its value wins. Your auto-scoped page CSS can't write a descendant selector into a child component's shadow DOM either — so neither path through the LWC's own stylesheet reaches it.

**How to detect this trap before debugging in the browser:**

```bash
# Search the loaded cosmos bundle for the variable you're trying to set
rg "--slds-c-tabs-list-sizing-border" node_modules/@salesforce-ux/design-system-2/dist/css/slds2.cosmos.css
```

If the variable is **assigned** (not just consumed) on a selector inside the cosmos file, you've found the trap.

**The fix — write the override in `src/styles/global.css`:**

```css
/* src/styles/global.css — loaded as an unscoped global stylesheet */
.my-page-shell .slds-tabs_default {
    --slds-c-tabs-list-sizing-border: var(--slds-g-sizing-border-3, 3px);
}
```

Why this works:
- `src/styles/global.css` is loaded outside the LWC plugin (see `vite.config.js` `exclude` list), so its selectors aren't auto-scoped to a single component.
- Cosmos itself uses global `.slds-*` selectors to reach into LBC synthetic shadow roots — so a same-pattern global rule of yours reaches the same element.
- Setting the variable on the **same** `.slds-*` selector cosmos used puts your value at the same point in the inheritance chain, and a more-specific ancestor (`.my-page-shell`) makes your rule win.

Hard rules for this pattern:
- Always wrap the override in a page-scope class (`.my-page-shell .slds-tabs_default`) so it doesn't bleed across the app.
- Only reach for this pattern after you have confirmed (via `rg`) that cosmos re-defines the variable internally. For 95% of LBC styling, a normal host-level `--slds-c-*` override works.
- Keep the rule in `src/styles/global.css`. Do **not** scatter "global" overrides across page CSS files — page CSS is auto-scoped and won't apply anyway.
- For the deployable org build, this CSS does not deploy (`src/` is excluded by `.forceignore`). The org equivalent is a separate static resource or a `lightning__AppPage` page-level stylesheet — out of scope for the local prototype.

### Pattern 8 — One visual boundary per component level

Wrapper CSS describes the parent page pattern. It does not correct or restyle the child LBC.

**Decision test:** ask "Is this wrapper describing the parent pattern, or is it patching the child component?"
- Describes parent → allowed
- Patches child → wrong; find the correct LBC prop, slot, or `--slds-c-*` hook instead

**Allowed wrapper CSS:**
- Page layout, region spacing, responsive grid behavior
- Outer card/container boundary (border, radius, background)
- Gap between major regions or sibling cards
- Grouping several LBCs into a larger page pattern

**Not allowed wrapper CSS:**
- Overriding the LBC's internal spacing or typography
- Adding a second border/radius around an LBC that already has one
- Making an LBC look like a different component
- Restyling internal `.slds-*` classes via descendant selectors

**One boundary per level rule:** if the parent `lightning-card` already has rounded corners and a border, the child `lightning-datatable` must not be wrapped in another rounded bordered container. Stacking visual boundaries until the UI looks "close enough" is the most common cause of structurally wrong layouts.

Each Salesforce pattern element owns exactly one visual boundary:

| Element | Owns |
|---|---|
| `slds-page-header` | Header surface + `shadow-1` elevation |
| `lightning-card` wrapping a related list | Rounded container + border |
| `lightning-datatable` inside that card | Rows and columns — flat, inset 16px, no second container |
| Details tab view mode | Compact `slds-form-element__static` display fields |
| Details tab edit mode | `lightning-input` / `lightning-combobox` / etc. |

When matching a Salesforce screenshot, identify which visual boundary belongs to which pattern element before writing any CSS. If you find yourself adding borders or radius to a child because it "needs to look more card-like," stop — that boundary belongs to the parent.

---

## Scale band quick pick

Inside a single component, choose ONE band:

| Band | Tokens | Example components |
|------|--------|--------------------|
| Compact (1–4) | `--slds-g-spacing-1..4` | List rows, badges, inline icons, tooltip padding, scoped tab links |
| Standard (5–8) | `--slds-g-spacing-5..8` | Card body, form rows, modal body, page sections |
| Macro (10–16) | `--slds-g-spacing-10..16` | Page-level gutters, hero blocks, large rail dividers |

Sliding across bands inside the same component reads as drifty spacing. If you need three different gaps in one component, that's usually a sign two should be the same value or one is a different component.

---

## Pre-flight checklist

Run through this before declaring any UI work complete:

- [ ] Every `<lightning-card>` body content is wrapped in a `slds-var-p-around_*` div (or another card-appropriate band).
- [ ] No per-item `slds-m-bottom_*` for stacking — `gap` or `slds-gutters_*` is used instead.
- [ ] No `pull-to-boundary` paired with utility-class margins on the same axis.
- [ ] Tab panels: either trust default OR override `--slds-c-tab-panel-spacing-block-*: 0` AND add a wrapper. Not both, not neither.
- [ ] No `slds-p-top_*` directly under `slds-page-header`.
- [ ] One scale band per component (compact OR standard OR macro).
- [ ] Density-sensitive components use `slds-var-*` utilities or `--slds-g-spacing-var-*` hooks.
- [ ] No descendant selector trying to style LBC internals — `--slds-c-*` only.
- [ ] No hardcoded px values for spacing.
- [ ] All margin/padding values come from `--slds-g-spacing-*` (or its `var` density-aware variant).
- [ ] One visual boundary per component level — no second border/radius wrapping a child LBC that already has its own container.

If any box is unchecked, fix before declaring complete.

---

## Reference implementations

| Pattern needed | Look at |
|----------------|---------|
| Card body wrapper, vertical rhythm, density-aware grid | `src/modules/page/home/home.html` + `home.css` |
| Tab panel block-padding override + scoped tabs in a sub-card | `src/modules/page/consoleRecord/consoleRecord.css` (`--slds-c-tab-panel-spacing-block-*` block) |
| Page header → body adjacency | `src/modules/page/consoleRecord/consoleRecord.html` (the `slds-grid slds-gutters slds-p-around_medium` block right under `slds-page-header__row`) |
