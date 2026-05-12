# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This repository is a **proto-to-prod starter kit** for building Salesforce UI experiences. It serves two purposes from a single codebase:

1. **Local prototyping** — fast Vite dev server with SLDS 2, theme switching, client-side routing, and hot reload
2. **Org deployment** — reusable components in `force-app/` deploy directly to a Salesforce org via SF CLI

The local dev experience is identical to the original `design-system-2-starter-kit`. The addition is a `force-app/` layer that makes production components deployable.

> **`AGENTS.md` contains non-negotiable rules** that apply before any UI work begins. The critical rules are also inline below — do not skip this section.

---

## Hard rules — read before writing any UI code

This repo builds Salesforce UI. Every element must use Salesforce-native components and SLDS. This applies equally to local prototypes (`src/modules/`) and deployable components (`force-app/`). A local prototype is a Salesforce handoff artifact — it must look and behave like production.

### LBC substitution table

Before writing any HTML element, check this table. If an LBC exists, use it — no exceptions.

| Need | Use | Never |
|------|-----|-------|
| Button | `<lightning-button>` / `<lightning-button-icon>` / `<lightning-button-menu>` | `<button>` |
| Text input | `<lightning-input>` | `<input>` |
| Dropdown / select | `<lightning-combobox>` | `<select>` |
| Multiline text | `<lightning-textarea>` | `<textarea>` |
| Checkbox / radio | `<lightning-checkbox-group>` / `<lightning-radio-group>` | `<input type="checkbox/radio">` |
| Data table | `<lightning-datatable column-widths-mode="auto">` | `<table>` with CSS; `lightning-datatable` without `column-widths-mode="auto"` (default `fixed` causes table overflow on column resize) |
| Card | `<lightning-card>` | custom div |
| Tabs | `<lightning-tabset>` + `<lightning-tab>` | `<ul>` tab strip |
| Accordion | `<lightning-accordion>` + `<lightning-accordion-section>` | `<details>` |
| Icon | `<lightning-icon>` | inline SVG / `<img>` / font icon |
| Modal | extend `lightning/modal` (see `force-app/main/default/lwc/demoModal/`) | custom backdrop div |
| Spinner | `<lightning-spinner>` | custom CSS spinner |
| Avatar | `<lightning-avatar>` | `<img class="avatar">` |
| Progress / path | `<lightning-progress-indicator>` / `<lightning-path>` | custom step markup |
| **Page header** | `<c-page-header>` (org) / `<ui-page-header>` (local) — see `docs/ui-patterns/page-header.md` | raw `slds-page-header` blueprint, `<header>`, custom title bar |

Full LBC catalog: https://developer.salesforce.com/docs/component-library/overview/components

### Record detail forms — view state vs edit state

**View state and edit state are two separate implementations.** Never use one component for both.

| State | Use | Never |
|-------|-----|-------|
| View (display) | `slds-form-element_stacked` + `slds-form-element__static` | `lightning-input read-only` |
| Edit (input) | `lightning-input`, `lightning-combobox`, `lightning-textarea`, etc. | Leave read-only inputs visible |

```html
<!-- View state — compact display field -->
<div class="slds-form-element slds-form-element_stacked">
  <span class="slds-form-element__label slds-text-title">Account Name</span>
  <div class="slds-form-element__control">
    <span class="slds-form-element__static slds-truncate">{accountName}</span>
  </div>
</div>

<!-- Edit state — swap in the input LBC, same grid position -->
<lightning-input label="Account Name" value={accountName} onchange={handleChange}></lightning-input>
```

- Two-column grid (`slds-grid slds-gutters slds-wrap`), same field order in both states
- Edit controls are taller than display fields — expected, not a bug
- Show Save (`variant="brand"`) + Cancel in edit state; return to display fields on save or cancel
- For formatted values in view state: `lightning-formatted-email`, `lightning-formatted-phone`, `lightning-formatted-date-time`

### Related list cards — card is rounded, datatable is flat

The `lightning-card` owns the visible boundary (1px border + no drop shadow + 12px rounded corners). The `lightning-datatable` inside is **flat**: no outline, no rounded corners, just horizontal row dividers. Never a second rounded container.

**This is non-obvious in the cosmos SLDS 2 theme. Read this section before writing any related-list markup.**

#### What cosmos does by default — and why your card looks invisible until you fix it

Cosmos sets these scope tokens that flatten everything:

| Token | Cosmos default | Effect on `lightning-card` |
|---|---|---|
| `--slds-s-container-shadow` | `none` | No drop shadow on the card |
| `--slds-s-container-color-border` | `transparent` | No visible card border |
| `--_slds-c-datatable-color-border` | `--slds-g-color-border-1` (#c9c9c9) | Datatable has a visible left/right border |
| `--_slds-c-datatable-radius-border` | `calc(--slds-g-sizing-border-4 * 2)` (~8px) | Datatable has rounded corners |

Setting `--slds-c-card-shadow` on a parent **does not work** — the inner `<article class="slds-card">` directly resets it via `var(--slds-s-container-shadow)`. Style the host element directly.

#### Canonical markup

```html
<lightning-card class="related-card" title="Cases" icon-name="standard:case">
  <lightning-datatable class="related-table" key-field="id" data={rows} columns={cols} hide-checkbox-column>
  </lightning-datatable>
  <div class="related-card-footer">
    <lightning-button label="View All" variant="base"></lightning-button>
  </div>
</lightning-card>
```

The datatable is **directly in the card body slot** — no `<div class="related-card-body">` wrapper, no `<div class="related-card-frame">`. Wrappers create a doubled visual boundary.

"View All" goes at the **bottom** of the card (after the datatable in the default slot), centered — not in `slot="actions"`. `lightning-card` has no bottom slot; place it as a sibling after the datatable.

For empty states only, swap the datatable for `<div class="related-card-body slds-var-p-around_medium">No {objects} to display.</div>`.

#### Canonical CSS — copy-paste, do not modify

Related list cards are **outline-only** (border, no drop shadow). No elevation.

```css
/* If a parent rule like `.your-shell lightning-card { box-shadow: ...; }` exists,
   specificity matters — use .your-shell lightning-card.related-card to win. */
.your-shell lightning-card.related-card {
  display: block;
  --slds-c-card-radius-border: var(--slds-g-radius-border-3, 0.75rem);
  background-color: var(--slds-g-color-surface-container-1, #fff);
  border: var(--slds-g-sizing-border-1, 1px) solid var(--slds-g-color-border-1, #c9c9c9);
  border-radius: var(--slds-g-radius-border-3, 0.75rem);
  box-shadow: none;
}
.related-card-footer {
  padding: var(--slds-g-spacing-3, 0.75rem);
  text-align: center;
  border-top: var(--slds-g-sizing-border-1, 1px) solid var(--slds-g-color-border-1, #c9c9c9);
}
/* --_slds-c-* hooks are internal SLDS APIs — reliable in cosmos but may change in platform updates */
.related-table {
  display: block;
  --_slds-c-datatable-color-border: transparent;
  --_slds-c-datatable-radius-border: 0;
}
```

Why each line exists:
- `display: block` — `lightning-card` host is `display: inline` by default; without this the border doesn't span full width
- `--slds-c-card-radius-border` + `border-radius` together — keeps host border and inner article border-radius aligned (misalignment otherwise leaves a 1–2px band)
- Border, radius, background **on the host** — only reliable place; cosmos defaults override anything set via `--slds-c-card-shadow` on a parent
- `box-shadow: none` — related list cards are outline-only; use `.your-shell lightning-card.related-card` (specificity `0,2,1`) to beat a parent `.your-shell lightning-card` rule (`0,1,1`)
- `--_slds-c-datatable-color-border: transparent` — kills cosmos-default visible left/right table outline (note: `--slds-g-color-border-base-1` does **not** work here)
- `--_slds-c-datatable-radius-border: 0` — kills cosmos-default rounded table corners
- Row dividers stay visible — they use `--slds-g-color-border-1` directly and are unaffected by the above overrides

#### Outer detail container (tabset wrapper holding all related lists)

Use `--slds-g-radius-border-4` (20px), not 12px:

```css
.detail-content-container {
  background-color: var(--slds-g-color-surface-1, #fff);
  border-radius: var(--slds-g-radius-border-4, 1.25rem);
  box-shadow: var(--slds-g-shadow-1, 0 2px 2px rgba(0, 0, 0, 0.1));
  overflow: clip; /* clips child content to rounded edge; does NOT clip container's own shadow */
}
```

Use `overflow: clip`, **not** `overflow: hidden` — `hidden` clips children's box-shadows and silently truncates them at the container edge.

#### Hard rules — these are errors

- Never give related list cards a `box-shadow` — the design is outline-only
- Never wrap the datatable in `.related-card-body` or `.related-card-frame` — datatable goes directly in the card slot
- Never use `--slds-g-radius-border-2` (4px) for related list cards — cards use `--slds-g-radius-border-3` (12px)
- Never set `--slds-c-card-shadow` on a parent expecting it to cascade — the inner article overrides; style the host directly
- Never set `--slds-g-color-border-base-1: transparent` on the datatable — that hook does not affect the cosmos table outline; use `--_slds-c-datatable-color-border`
- Never use `hide-table-header` + `hide-borders` together — breaks rendering in this starter
- Never style datatable internals with descendant selectors — synthetic shadow blocks them; use `--slds-c-*` / `--_slds-c-*` hooks on the datatable instance
- When a parent rule applies `lightning-card { box-shadow: ... }`, `.related-card { box-shadow: none }` will lose on specificity — use `.parent-shell lightning-card.related-card` to win

### lightning-datatable configuration

**Always set `column-widths-mode="auto"` on every `lightning-datatable`.** The default is `fixed` — each column gets a hard pixel width and the table's total width equals their sum. Resizing any column changes the total table width, causing the table to overflow or shrink inside its container.

With `auto`, columns fill the container width and resizing redistributes space across columns rather than changing the total width.

**Pin the container to `width: 100%`** so the auto sizing has a defined bounds to work within:

```css
.my-table-container { width: 100%; }
.my-table-container lightning-datatable { display: block; width: 100%; }
```

`initialWidth` values on column definitions still work as starting widths — they just no longer dictate the table's total width.

```html
<!-- Always include column-widths-mode="auto" -->
<lightning-datatable
    key-field="id"
    data={rows}
    columns={columns}
    column-widths-mode="auto"
    hide-checkbox-column>
</lightning-datatable>
```

**Never omit `column-widths-mode="auto"` on a datatable inside a card, panel, or any responsive container** — the default `fixed` mode will cause the table to overflow its container when columns are resized.

### Styling — `--slds-g-*` hooks with fallback, always

Before writing any CSS rule, check whether SLDS already provides it.

```css
/* Correct */
background: var(--slds-g-color-surface-1, #fff);
color: var(--slds-g-color-on-surface-2, #181818);
padding: var(--slds-g-spacing-4, 1rem);
border-radius: var(--slds-g-radius-border-2, 0.25rem);

/* Wrong — these are errors */
background: #ffffff;
padding: 16px;
color: #333;
```

- Font sizes: use `--slds-g-font-scale-*` (not `--slds-g-font-size-N` — that pattern doesn't exist)
- Color hooks always end in a number: `--slds-g-color-surface-1`, not `--slds-g-color-surface`

**Background color — pick the right surface token for each layer:**

| Layer | Token | Fallback |
|-------|-------|---------|
| Page canvas / app shell | `--slds-g-color-surface-2` | `#f3f3f3` |
| **Page header** | `--slds-g-color-surface-container-2` | `#f3f3f3` |
| Card / panel interior | `--slds-g-color-surface-container-1` | `#ffffff` |
| Full-white page (no grey canvas) | `--slds-g-color-surface-1` | `#ffffff` |
| Subtle recessed / read-only area | `--slds-g-color-surface-3` | `#e5e5e5` |
| Nested sub-card inside a card | `--slds-g-color-surface-container-2` | `#f3f3f3` |

Never hardcode `#f3f3f3`, `#ffffff`, or any hex as background values — always use the hook so it respects theme overrides.

### Shadow elevation — `--slds-g-shadow-{1–4}`

Use shadows to communicate stacking order. **Do not apply shadows to base-level components** — only use them on elements that appear above the surface.

| Token | Use for |
|-------|---------|
| `--slds-g-shadow-1` | Page headers, tables, filter panels, dropdowns, inline edit, images |
| `--slds-g-shadow-2` | Menus, docked form footer, docked utility bar, color picker, notifications |
| `--slds-g-shadow-3` | Panels, docked composer, tooltips, toasts |
| `--slds-g-shadow-4` | Modals, popovers, App Launcher |

For panels docked to a screen edge, use directional variants: `--slds-g-shadow-inline-start-3` (left panel), `--slds-g-shadow-inline-end-3` (right panel).

Always use with a fallback:
```css
box-shadow: var(--slds-g-shadow-4, 0 4px 8px rgba(0,0,0,0.16));
```

### Spacing — the rules that prevent 90% of layout bugs

**Rule 1 — `<lightning-card>` body always needs a padding wrapper.** The default slot has zero padding.

```html
<lightning-card title="Section">
  <div class="slds-var-p-around_medium">
    <!-- content here -->
  </div>
</lightning-card>
```

**Rule 2 — Use `gap` for vertical rhythm between sections, not per-item `slds-m-bottom_*`.**

```css
/* DO */
.page-stack { display: flex; flex-direction: column; gap: var(--slds-g-spacing-6, 1.5rem); }
/* DON'T */
/* <lightning-card class="slds-m-bottom_large"> — creates uneven gaps */
```

**Rule 3 — Use density-aware classes (`slds-var-p-*`) for cards, lists, tables, page headers, tabs, and forms.** Use fixed `slds-p-*` only for outer page gutters and modal bodies.

| Fixed | Density-aware |
|-------|--------------|
| `slds-p-around_medium` | `slds-var-p-around_medium` |
| `slds-p-horizontal_small` | `slds-var-p-horizontal_small` |

**Rule 4 — Pick ONE spacing scale band per component and stay in it.**

| Band | Tokens | Used for |
|------|--------|----------|
| Compact | `--slds-g-spacing-1..4` | List rows, badges, inline icons, tooltips |
| Standard | `--slds-g-spacing-5..8` | Card body, form rows, modal body, page sections |
| Macro | `--slds-g-spacing-10..16` | Page gutters, hero blocks |

**Rule 5 — No `slds-p-top_*` directly under a `slds-page-header`.** The header already supplies its own bottom padding.

**Rule 6 — Tab panels: pick exactly one path.** Either trust the default panel padding, or zero it with `--slds-c-tab-panel-spacing-block-*: 0` and supply your own wrapper. Never both, never neither (double padding or no padding).

**Rule 7 — Customize LBC internals via `--slds-c-*` hooks only.** Descendant selectors silently fail in synthetic shadow DOM.

```css
/* DO */ .my-group { --slds-c-button-spacing-inline-end: var(--slds-g-spacing-1, 0.25rem); }
/* DON'T */ .my-group .slds-button { padding: 4px; } /* silently ignored */
```

**When a host-level `--slds-c-*` override still does nothing:** the cosmos theme may be re-setting the same variable on an internal LBC element (e.g., `.slds-tabs_default`, `.slds-card`, `.slds-page-header`). Your host override is shadowed by cosmos's closer redefinition. The fix is a same-selector rule in `src/styles/global.css` (the unscoped global stylesheet) — see `docs/spacing-rules.md` → *"When even your `--slds-c-*` host override doesn't work — the shadow-inheritance trap"* for the diagnostic and pattern.

**Tab active indicator — already fixed globally.** `src/styles/global.css` sets the `::after` height to `3px` on `.slds-tabs_default__item.slds-is-active` to match the context bar indicator weight. Do not re-apply or override this in page or component CSS.

**Rule 8 — One visual boundary per component level. Wrapper CSS describes the parent pattern; it does not correct the child.**

Before adding any wrapper CSS, ask: *"Is this describing the parent page pattern, or is it patching the child component?"*

| Wrapper CSS is correct when it controls | Wrapper CSS is wrong when it |
|---|---|
| Page layout, region spacing, responsive grid | Overrides the LBC's internal spacing |
| Outer card/container boundary | Adds a second border around an LBC that already has one |
| Background surface | Adds rounded corners to a nested table, input, or list |
| Grouping several LBCs into a larger pattern | Restyling internal `.slds-*` classes |

**One visual boundary per level:** if the parent `lightning-card` has rounded corners and a border, the child datatable must not also get a rounded bordered container. Each Salesforce pattern owns exactly one visual boundary:

| Pattern element | Owns |
|---|---|
| Page header | Header surface + shadow |
| `lightning-card` (related list) | Rounded container + border |
| `lightning-datatable` | Rows and columns — not wrapped in another card |
| Details tab view mode | Compact display fields |
| Details tab edit mode | Input LBCs |

Full reference: `docs/spacing-rules.md` (includes canonical code patterns and pre-flight checklist).

### Icons — category decision guide

Always use `<lightning-icon>` with the correct `icon-name="category:symbol"`. Never use inline SVG, `<img>`, or font icons.

| Category | Use for | Example |
|----------|---------|---------|
| `utility:` | UI controls, affordances — search, filter, settings, chevrons, close | `utility:search` |
| `standard:` | Salesforce objects/records — Account, Contact, Case, Opportunity | `standard:account` |
| `action:` | User task verbs — save, delete, edit, add (primarily mobile action bar) | `action:save` |
| `doctype:` | File formats — PDF, Word, Excel, image | `doctype:pdf` |
| `custom:` | Custom objects when no `standard:` icon fits | `custom:custom1` |

**Rule of thumb:** UI control concept → `utility:` / Salesforce noun/object → `standard:` / User action verb → `action:` / File type → `doctype:`

**Three rules that prevent the most common icon mistakes:**

1. **`standard:` icons must have a circle background in SLDS 2** — `<lightning-icon>` applies it automatically; never strip it with CSS
2. **`utility:` icon color always inherits from adjacent text** — never hardcode a fill color
3. **Always provide `alternative-text` and `title`** — required for accessibility; describe the *purpose* not the appearance (`"Upload file"` not `"paperclip"`)

```html
<!-- Correct -->
<lightning-icon icon-name="utility:search" alternative-text="Search" title="Search" size="small"></lightning-icon>
<lightning-icon icon-name="standard:account" alternative-text="Account" size="medium"></lightning-icon>

<!-- Decorative icon alongside visible text — hide from screen readers -->
<lightning-icon icon-name="utility:check" alternative-text="" aria-hidden="true" size="x-small"></lightning-icon>
```

**Sizes:** `xx-small` (dense/inline) → `x-small` (compact controls) → `small` (default utility) → `medium` (default object/record) → `large` (hero, use sparingly)

Full reference: `.agent/skills/afv-library/applying-slds/guidance/icons-guidance.md`

### Hard stops — these are errors

- No Bootstrap, Tailwind, Material UI, or any non-SLDS CSS framework
- No `var(--lwc-*)` tokens — SLDS 1 is deprecated; use `--slds-g-*` only
- No hardcoded hex colors or raw `px` values when a hook exists
- No `!important` or `style=""` attributes
- No fabricated SLDS class names — verify every class against the spec
- No inline SVG icon sprites

### Required pre-build check — do not skip

Before writing any HTML or CSS, complete this lookup. This is not a formality — it is a gate. Do not write code until each line is resolved.

```
LBC plan: [every <lightning-*> you will use — consult the LBC table above and the catalog]
Custom HTML: [ONLY if no LBC exists — name the specific LBC you ruled out and why it doesn't cover this need]
SLDS utilities: [utility classes you will use]
SLDS hooks: [--slds-g-* hooks you will use]
Custom CSS: [ONLY layout, spacing between regions, or outer container boundaries — nothing else]
```

**Custom HTML and Custom CSS must be empty or near-zero. They are not fallbacks.**

- If "Custom HTML" has any entry, you must name the LBC you considered and the specific reason it cannot be used. "I need more control" is not a valid reason.
- If "Custom CSS" describes anything other than page layout, region spacing, or outer container boundaries — stop. You are patching an LBC instead of using it correctly. Re-read the LBC table and the pattern docs.
- A long Custom HTML or Custom CSS list means the wrong approach is being taken, not that custom code is justified.

---

## Architecture: two runtimes, one component source

```
design-system-2-org-starter/
├── src/modules/              ← Vite dev server only (not deployed to org)
│   ├── shell/                  Shell chrome: layout, header, nav, theme switcher
│   ├── page/                   Route-level views: one per URL
│   ├── ui/                     Reusable local-only UI widgets (tag: ui-*)
│   └── data/                   Plain JS fixtures, imported as data/<name>
│
└── force-app/main/default/   ← Deployed to Salesforce org via SF CLI
    ├── lwc/                    Reusable components — namespace "c" (tag: c-*)
    │   ├── homeIntro/
    │   └── demoModal/
    └── flexipages/             Org page definitions wiring components into App Builder
```

**Rule of thumb:**
- Build the component in `force-app/main/default/lwc/` if it will be reused in a Salesforce org
- Put it in `src/modules/page/` if it's a route view (local only)
- Put it in `src/modules/shell/` if it's app chrome (local only)

---

## Where to put new code

| What | Where | Tag / import |
|------|-------|-------------|
| Reusable deployable component | `force-app/main/default/lwc/<name>/` | `<c-name>` |
| Route-level view | `src/modules/page/<name>/` | `page-<name>` |
| Reusable local-only UI | `src/modules/ui/<name>/` | `<ui-name>` |
| App shell / chrome | `src/modules/shell/<name>/` | `shell-<name>` |
| Plain data/fixtures | `src/modules/data/<name>/` | `import X from 'data/<name>'` |

Every component in `force-app/main/default/lwc/` **must** have a `.js-meta.xml` file. Use this minimal template:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>62.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>
```

Set `isExposed>false</isExposed>` (and omit `<targets>`) for internal/child-only components.

---

## Running locally

```bash
npm install
npm run dev        # Vite dev server at http://localhost:3000
npm run build      # Production bundle → dist/
npm run preview    # Preview production bundle
```

Both `src/modules/` and `force-app/main/default/lwc/` are resolved by Vite. Components in `force-app/` are available as `<c-*>` tags in local dev, matching how they behave in the org.

---

## Three deployment surfaces

Before building anything, establish which surface the work targets — it determines the entire implementation path.

| Surface | Org type | Data | What to build |
|---------|----------|------|---------------|
| **Local prototype** | None — Vite only | JS fixtures in `src/modules/data/` | LBC/SLDS UI only, no wiring |
| **Front-end org** | Evergreen, sandbox, scratch org without cloud perms | None — UI shell only | LBC/SLDS UI only, no wiring |
| **Enabled org** | Sandbox or production with cloud/object permissions | Live Salesforce data | LBC/SLDS UI + data wiring decisions |

**Always ask before building a deployable component:**

> Is this deployment front-end only (UI shell, no live data), or will it connect to real org data?

- **Front-end only** — build the UI, use hardcoded or empty states for data, no `@wire` or Apex needed
- **Enabled org with live data** — do not choose a wire adapter or write Apex from memory; invoke the `prd-to-salesforce-ui` skill first; the correct approach depends on object type, query complexity, and page context

## Deploying to a Salesforce org

```bash
# Deploy to a named org alias
npm run deploy:org -- -o <org-alias>

# Validate without deploying (dry run)
npm run deploy:org:check -- -o <org-alias>

# Or use SF CLI directly
sf project deploy start -o <org-alias>
```

Only `force-app/` is deployed. `src/`, `dist/`, `public/`, and `scripts/` are excluded via `.forceignore`.

**RecordPage activation gotcha:** deploying a `RecordPage` FlexiPage does not make it the active page. Salesforce resolves the active record page through three layers in order: (1) app + profile + record type override, (2) app default override, (3) object-level org default. If the user opens a record inside a Lightning app that has its own app-level override, the object-level override is silently ignored. Always deploy the override at the correct layer and verify the page renders in the target app before calling deployment complete. Full triage in `.agent/skills/salesforce-deploy/SKILL.md` → section 8.

---

## Component naming in this repo

| Location | Namespace | Tag example | Deployed? |
|----------|-----------|-------------|-----------|
| `force-app/main/default/lwc/homeIntro/` | `c` | `<c-home-intro>` | Yes |
| `force-app/main/default/lwc/demoModal/` | `c` | opened via `DemoModal.open()` | Yes |
| `src/modules/page/home/` | `page` | `<page-home>` | No |
| `src/modules/shell/app/` | `shell` | `<shell-app>` | No |

---

## Adding a new deployable component

1. Create `force-app/main/default/lwc/<name>/` with `<name>.js`, `<name>.html`, and `<name>.js-meta.xml`
2. Use it in local dev as `<c-name>` in any template
3. Run `npm run deploy:org -- -o <org-alias>` to push it to your org

## Building pages for Lightning App Builder

**Never build a Lightning App Builder page as one large monolithic component.** App Builder pages are composed of independently-droppable components. Each component a user might want to independently show, hide, move, or configure must be its own LWC.

**Decomposition rule — the unit is the individual UI element, not the column.**

This is the most common mistake: agents decompose to the column level (one LWC per column) instead of the component level. A column containing a KPI card, a datatable, and an action panel needs three separate LWCs placed into that column — not one LWC that renders all three. The test is: *could a user in App Builder reasonably want to remove, reorder, or replace this piece independently?* If yes, it is its own LWC.

| Wrong — column-level decomposition | Correct — component-level decomposition |
|---|---|
| `commandCenterLeftRail` (renders alerts + filters + tabs) | `commandCenterAlertList`, `commandCenterAlertFilters`, `commandCenterAlertTabs` |
| `commandCenterPrimary` (renders KPIs + datatable + actions) | `commandCenterKpiStrip`, `commandCenterMemberTable`, `commandCenterActionPanel` |
| `memberRecordSidebar` (renders next best action + activity) | `memberNextBestAction`, `memberActivityTimeline` |

**Naming:** prefix with the page or feature name to group related components:
- `commandCenterKpiStrip` → `<c-command-center-kpi-strip>`
- `commandCenterAlertList` → `<c-command-center-alert-list>`
- `commandCenterMemberTable` → `<c-command-center-member-table>`
- `memberNextBestAction` → `<c-member-next-best-action>`

**`isExposed` rules:**
- Every component that is placed directly into an App Builder region: `isExposed=true` with `<targets>`
- Child/internal components used inside a placed component but not placed directly: `isExposed=false`, no `<targets>`

**Flexipage:** generate or update `force-app/main/default/flexipages/<PageName>.flexipage-meta.xml` to wire each component into its region. Multiple components can be placed into the same column region — App Builder stacks them vertically. Deploy all LWC components and the flexipage together.

**Local dev:** compose all the section components inside a `src/modules/page/<name>/` wrapper for local prototyping, arranged in the same column/row structure as the flexipage.

### Cross-region alignment belongs to the FlexiPage template — not the LWC

Each section LWC owns only its internal content. It has no knowledge of adjacent columns or sibling regions.

**Never do these inside a section LWC:**
- `padding-top` or `margin-top` added to align with a component in another column
- Spacer divs used to push content down to match a neighbouring region
- `min-height` or `height` set to match another component's rendered height
- `slds-grid` or CSS grid spanning multiple FlexiPage regions

If two components in different columns need to start at the same visual height, or rows need to align across columns, that alignment belongs in one of two places:
1. **The FlexiPage template** — define named regions with explicit row/column structure in the flexipage XML
2. **A custom page template** — create a `lightningcomponentbundle` with `type="flexipage"` that uses CSS grid to define the exact row/column layout

**Recommended pattern for a multi-region page:** name semantic regions in the template (`alerts`, `header`, `primaryContent`, `watchlist`) and place exactly one wrapper LWC per region. The template defines alignment; the LWC defines content.

This keeps each LWC independently removable and configurable in App Builder without breaking adjacent columns.

## Showcase pages — do not modify

The following pages exist as verified UI references for users and agents. They demonstrate correct patterns, working components, and canonical markup. **Never modify them when building a demo.**

| Page | Path | Purpose |
|------|------|---------|
| About | `src/modules/page/about/` | Component samples: inputs, page header variants, console nav, related lists, modal, buttons |
| Icons | `src/modules/page/iconTest/` | Full icon catalog with guidelines |
| Elevations | `src/modules/page/elevations/` | Shadow scale, usage rules, directional variants |
| Dashboard | `src/modules/page/dashboard/` | Dashboard page pattern reference |

If a user asks to "add a component" or "show an example" and you think to put it on the About page — stop. Build a new page instead. Modifying these pages forces users to do cleanup before using the kit for their own work. The About page is a user-facing reference, not a scratch pad.

---

## Adding a new page (local dev only)

**The existing routes in `src/routes.config.js` are starter kit showcase examples — not a nav shell to extend.** When building a demo, replace them; do not add demo routes alongside them.

### Building a demo (most common case)

1. **Clear the showcase routes** from `src/routes.config.js` — remove the Home, Icons, User, Contacts, and Console Record entries
2. **Remove their imports and `ROUTE_COMPONENTS` entries** from `src/modules/shell/app/app.js`
3. Add demo-specific routes and register the demo page components in their place
4. For org deployment, build all components in `force-app/main/default/lwc/` with their own flexipage — the demo is a standalone deployable, not an extension of the starter kit showcase

### Adding a page to the showcase (rare — only when extending the starter kit itself)

1. Create `src/modules/page/<name>/` with component files
2. Add a route entry in `src/routes.config.js`
3. In `src/modules/shell/app/app.js`: add an `import` at the top and a `'page-<name>': Component` entry in `ROUTE_COMPONENTS` — both are required (`src/router.js` does not need editing)

For child routes (e.g. `/contacts/:id` under a `/contacts` tab), set `navHighlight: '<parentNavPage>'` instead of `navPage`. This highlights the parent tab without creating a separate nav entry. Only routes with `navPage` appear in the nav bar.

## Off-limits directories

Do not add custom components under `src/modules/lightning/` or `src/build/lightning-icon/shims/` (except the checked-in icon overrides).

---

## SLDS and LWC conventions

**UI code decision order** — work through this in order, never skip, never reverse:

1. **Lightning Base Component** — does `<lightning-*>` cover this? Use it. (See table above.) Stop here if yes.
2. **SLDS Component Blueprint** — use MCP `explore_slds_blueprints` to search; implement as a new LWC if one exists. Stop here if yes.
3. **SLDS utility class** — spacing (`slds-m-*`, `slds-p-*`), layout (`slds-grid`), text (`slds-text-*`). Stop here if yes.
4. **Custom CSS with Global Styling Hook** — `var(--slds-g-color-surface-1, #fff)` with fallback. Only for page layout, region spacing, and outer container boundaries.
5. **Hard-coded CSS value** — this step should almost never be reached. If you are here, go back to step 1 and re-examine. Reaching step 5 for anything other than a one-off calculation with no hook equivalent is a signal the wrong approach is being taken.

Additional rules:
- Use `gap` (not per-item `slds-m-bottom_*`) for vertical rhythm
- Use density-aware `slds-var-p-*` for cards/lists/tables/page-headers/tabs/forms
- Customize LBC internals via `--slds-c-*` hooks — descendant selectors don't pierce synthetic shadow
- For spacing edge cases, read `docs/spacing-rules.md` before writing layout markup

For deeper reference: `.agent/skills/afv-library/applying-slds/SKILL.md`

### SLDS linter

After changing any `.html` or `.css` file, run the linter before marking the task complete:

```bash
npx @salesforce-ux/slds-linter@latest lint <path-to-changed-file>
```

For a full repo pass (build + lint all of `src/modules/`):

```bash
npm run check
```

### SLDS Agent Skills

Skills live under `.agent/skills/`. The `afv-library/` subfolder is synced from `forcedotcom/afv-library` on `npm install` (refresh with `npm run skills:sync`).

| Skill | Path | When to use |
|-------|------|-------------|
| applying-slds | `.agent/skills/afv-library/applying-slds/SKILL.md` | **Required first step for all UI work** — blueprints, hooks, utilities, icons, LBC choice |
| prd-to-salesforce-ui | `.agent/skills/prd-to-salesforce-ui/SKILL.md` | Build UI from a PRD or description with no Figma — classifies archetype, picks hosting surface, runs self-check |
| uplifting-components-to-slds2 | `.agent/skills/afv-library/uplifting-components-to-slds2/SKILL.md` | SLDS 1→2 migration and linter fixes |
| validating-slds | `.agent/skills/afv-library/validating-slds/SKILL.md` | Compliance audit only, not for building UI |
| org-discovery | `.agent/skills/org-discovery/SKILL.md` | Fit-gap discovery against a target Salesforce org before building deployable functionality |
| salesforce-deploy | `.agent/skills/salesforce-deploy/SKILL.md` | Org auth, validation, deployment, and deploy failure troubleshooting |
| repo-setup | `.agent/skills/repo-setup/SKILL.md` | Set up a GitHub repo — detects host from origin remote, initial push |
| first-time-deploy | `.agent/skills/first-time-deploy/SKILL.md` | Publish to GitHub Pages; first time runs repo-setup then configures Pages |

### UI pattern docs

`docs/ui-patterns/` contains Salesforce-first-party pattern references for the six most common page archetypes. Each doc has a **Platform vs LWC split table** (what the platform provides vs what you build), zone layouts, LBC recommendations, confirmed SLDS hooks, and design rationale notes.

| Pattern | File | Use when |
|---------|------|----------|
| Command Center | `docs/ui-patterns/command-center.md` | Operational monitoring, alert triage, incident response, role-based workspace |
| Dashboard | `docs/ui-patterns/dashboard.md` | KPI overview, home page, executive summary, recent activity across objects |
| Record Detail | `docs/ui-patterns/record-detail.md` | Single record view with fields, activity timeline, related lists |
| List View | `docs/ui-patterns/list-view.md` | Object list, filtered queue, recently viewed, sortable data table |
| Console Navigation | `docs/ui-patterns/console-navigation.md` | Multi-record workspace, service agent tool, simultaneous record management |
| Forms | `docs/ui-patterns/forms.md` | Any page with input fields, data entry, create/edit record flows |

### Canonical examples — read these before building the matching pattern

These are confirmed, visually-verified implementations in this repo. Read the relevant source file before writing new code for the same pattern — copy structure, not just intent.

| Pattern | Source file | What it demonstrates |
|---------|-------------|----------------------|
| Activity timeline | `src/modules/page/dashboard/dashboard.html` — Recent Activity card | `slds-timeline` blueprint: `slds-timeline__item_call/email/event`, `slds-media_timeline`, `slds-media__figure_column`, `slds-timeline__icon`, `slds-timeline__trigger`, `slds-timeline__actions_inline`, expand chevron via `lightning-button-icon` |
| Donut chart (SVG) | `src/modules/page/dashboard/dashboard.html` — Leads card | SVG `stroke-dasharray` multi-segment donut with SLDS token fill colors + legend |
| Pipeline bar chart | `src/modules/page/dashboard/dashboard.html` — Opportunities card | Inline `style={stage.barStyle}` bar inside a relative-positioned track div; label/value layout |
| Account tiles | `src/modules/page/dashboard/dashboard.html` — Accounts card | `lightning-avatar` + `slds-media slds-media_center` tile rows with border-bottom separators |
| Dashboard page layout | `src/modules/page/dashboard/dashboard.html` | Three-column `slds-grid slds-gutters_small slds-wrap` with stacked cards per column |
| Form inputs — all states | `src/modules/page/about/about.html` — Inputs tab | `slds-form slds-form_stacked` + `slds-form__row` + `slds-form__item`; Base, Required, Error (with `renderedCallback` auto-trigger), Disabled, View Mode (`slds-form-element_stacked` + `slds-form-element__static`), Textarea |
| Modal with form + spinner | `force-app/main/default/lwc/demoModal/` | `LightningModal` extension, form-in-modal layout, `isSaving` spinner toggle, `setTimeout` close |
| Page header — 4 variants | `src/modules/page/about/about.html` — Page Header tab | Base, Object Home, Record Home, Related List; toggled via `headerVariant` state with conditional slots |
| Console navigation | `src/modules/page/about/about.html` — Console Nav tab | `slds-context-bar` + `slds-sub-tabs` blueprint; active indicator via native cosmos `slds-is-active::after` — no custom div needed |
| Related list card | `src/modules/page/about/about.html` — Related Lists tab | `lightning-card.about-related-card` host CSS, flat datatable via `--_slds-c-datatable-color-border: transparent` |

| Shadow & elevation scale | `src/modules/page/elevations/elevations.html` + `elevations.css` | Live shadow swatches for all 4 levels, directional panel variants, focus state, usage-by-component table, hard rules |
| Icon catalog + guidelines | `src/modules/page/iconTest/iconTest.html` + `iconTest.js` | Complete icon listing with full `icon-name` values (`standard:account`, `utility:search`, etc.), category decision table, size reference strip, and hard rules |

**Usage:** before building any of these patterns, open the source file listed above and read the verified markup. Do not reconstruct from the spec alone when a working reference exists.

### SLDS 2 token reference

`docs/slds2-tokens-reference.md` — extracted from the SLDS 2 Style Guide. Contains the complete spacing scale, sizing scale, border-radius table, border-width table, typography scale, color hook families (surface, on-surface, border, brand, feedback), icon category rules, and the CSS-property-to-hook mapping table. Consult this when picking a `--slds-g-*` hook or checking which border-radius value applies to a given component type.

### Spacing rules

`docs/spacing-rules.md` — the authoritative quick reference for spacing in this repo. Covers the seven rules and seven canonical patterns that prevent the most common spacing bugs (`<lightning-card>` body wrapper, vertical rhythm via `gap`, tab-panel double padding, density-aware utilities, `pull-to-boundary` traps, page-header adjacency, customizing LBC internals via `--slds-c-*`). **Read this before any layout markup or CSS work.** It includes a pre-flight checklist to walk before declaring UI work done.

---

## Deployment targets

| Target | Command | Notes |
|--------|---------|-------|
| Salesforce org | `npm run deploy:org -- -o <alias>` | Deploys `force-app/` only |
| GitHub Pages | `npm run deploy` | Builds with hash routing then pushes `dist/` to `gh-pages` branch |
| Local preview | `npm run build && npm run preview` | Path-based routing |

`npm run deploy` uses `build:gh-pages` (hash URLs) so static hosting works. The default `npm run build` uses path-based routing and is not suitable for GitHub Pages without a server.

---

## Lightning app org visibility

Deploying a new Lightning app requires more than `sf project deploy start`. After a successful deploy, the app and its tabs won't be visible to users until:

1. A permission set grants application visibility for the new app and tab visibility for its tabs
2. The permission set is assigned to the target user

Verify the app is accessible by querying `AppDefinition` after deploy. Assume permission sets and metadata for tabs/apps/objects are needed in addition to LWC components.

---

## PRD and requirements intake

When a user provides a PRD, requirements doc, screenshot, or written app idea, **read `.agent/skills/prd-to-salesforce-ui/SKILL.md` first**. It covers archetype classification, hosting surface decisions, and the full implementation workflow.

If the user also provides a target Salesforce org, do a fit-gap check before building anything net-new:

1. Map each requirement to likely Salesforce standard or existing org capabilities.
2. Use the org-discovery skill (`.agent/skills/org-discovery/SKILL.md`) when an org alias is available.
3. Recommend one of: reuse, configure, extend existing metadata, or build net-new.
4. Confirm the approach with the user before writing or retrieving source files.

### Saving project artifacts for persistence

When a user provides any of the following, save it to `docs/prd/` immediately — do not process it only in memory:

| Artifact type | What to do |
|---|---|
| PRD or requirements doc (text/markdown) | Save as `docs/prd/<descriptive-name>.md` |
| PRD or requirements doc (PDF) | Save as `docs/prd/<descriptive-name>.pdf` |
| Screenshot or UX reference image | Save as `docs/prd/<NN>-<descriptive-name>.png` (use numeric prefix to order by flow) |
| Fit-gap or org analysis | Save as `docs/prd/fit-gap-<domain>.md` |
| Concept mocks or directional UX | Save as `docs/prd/concepts/<descriptive-name>.png` |

After saving any artifact, create or update `docs/prd/README.md` to:
1. List every artifact in the folder with a one-line description
2. Summarize what the PRD covers (personas, in-scope, out-of-scope)
3. Maintain a build state table mapping PRD areas to repo surfaces and current status
4. Include a "How to use this folder" note so future agents know to start here

**The README is the persistent source of truth for the project.** Future sessions must read `docs/prd/README.md` before building anything in the project domain. Do not rebuild from chat memory — start from the README.

When something ships or changes, update the build state table in the README. When the PRD or concepts change, replace the file in place — do not add versioned copies.

## Handoff quality bar

Before declaring a prototype complete, provide a concise handoff summary covering:

- What was built and which routes/pages/components are involved
- Which components are deployable (`force-app/`) vs local-only (`src/`)
- Which SLDS/LWC patterns were used
- Which requirements are covered and which assumptions remain
- What production engineering still needs (data wiring, Apex, permissions, object model, etc.)
- Verification performed (`npm run check` and org validation when applicable)

---

## MCP and AI tooling

`mcp.json` configures the Salesforce DX MCP server for AI-assisted development. Use it selectively for:
- **LWC framework and Salesforce-platform questions** — `@api`, `@wire`, lifecycle, org-only behavior
- **SLDS component blueprints** — use `explore_slds_blueprints` to find blueprint specs by name/category/keyword; use `guide_slds_blueprints` for a full index of all blueprints (referenced in the UI decision checklist above)

Do not use it for general UI or styling questions — use the SLDS skills above instead.
