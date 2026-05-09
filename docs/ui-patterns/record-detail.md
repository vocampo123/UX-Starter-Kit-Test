# Record Detail Pattern

**Source:**
- Console nav variant: SLDS 2 Console Navigation v2 — Contact Record Component, Figma node `26084:50707`
- Standard nav variant: SLDS 2 Components Web — Account Record, Figma node `67686:82682`

---

## Platform vs LWC

> **Runtime context:** This split applies to **org-deployed components** in `force-app/main/default/lwc/`. For **local prototype pages** in `src/modules/page/`, build the full anatomy described below — the prototype has no platform chrome to inherit.

Record pages in Salesforce are **FlexiPages**. The platform provides the page chrome; LWCs are placed inside FlexiPage regions.

| Layer | Provided by | Implement in LWC? |
|---|---|---|
| Global header | Platform | No |
| App navigation | Platform | No |
| Record header (object icon, title, breadcrumb, primary action buttons) | Platform (FlexiPage `RecordPage`) | No |
| Record key-field strip (compact layout fields) | Platform | No |
| Tab row (Details / Related / additional tabs) | Platform (FlexiPage tabs facet) | No |
| Standard form fields (Details tab) | Platform (`lightning-record-form` or standard layout) | No |
| Activity timeline | Platform (standard Activity component) | No |
| Related lists | Platform (Related List Single / Related Lists) | No |
| Path / stage progression | Platform (`lightning-path` standard component) | No |
| Custom widgets in regions (side panel cards, embedded analytics, custom action panels) | LWC | Yes |

**Rule:** For record pages, build a FlexiPage (`*.flexipage-meta.xml`) and place LWCs in regions for *custom* content. Do **not** rebuild the record header, key fields, activity timeline, or related lists — drop the standard Salesforce components into FlexiPage regions and let the platform render them.

**Only build a custom LWC record page** if the PRD requires a layout that FlexiPage regions cannot express (e.g., a fully bespoke shell). This is rare.

---

## When to use

Use this pattern when the PRD describes:
- Viewing or editing a single Salesforce record (Contact, Account, Case, Opportunity, etc.)
- A page with field-level data, related records, and an activity timeline
- A "record page" or "record detail" in a Lightning app

Choose **console nav variant** when the record is accessed within a multi-record console workspace (opens as a subtab).
Choose **standard nav variant** when the record is accessed from a standard Lightning app nav tab.

---

## Standard Nav Variant

### Chrome layers

```
Global Header
└── Standard App Nav (horizontal tabs)
    └── Record Header (full-width)
        └── Three-column content area
            └── Docked Utility Bar
```

### Record Header

Use `slds-page-header slds-page-header_record-home`. There is no LBC for the page header — build it with blueprint classes.

**Row 1 structure (title + actions):**

```
slds-page-header__row
├── slds-has-flexi-truncate                ← title column (MUST be flexi-truncate, not col-title)
│   └── slds-media slds-no-space slds-grow
│       ├── slds-media__figure             ← lightning-icon standard:, size="large"
│       └── slds-media__body
│           └── slds-page-header__name
│               └── slds-page-header__name-title
│                   └── h1
│                       ├── span           ← object type label ("Contact", "Case", etc.)
│                       └── span.slds-page-header__title.slds-truncate  ← record name + title attr
└── slds-no-flex slds-grid slds-align-top  ← actions column (MUST be no-flex, not col-actions)
    └── slds-page-header__controls → slds-page-header__control
        └── lightning-button-group (primary actions + lightning-button-menu overflow)
```

**Row 2 — summary field strip:**

```
slds-page-header__row slds-page-header__row_gutters
└── slds-page-header__col-details
    └── ul.slds-page-header__detail-row
        └── li.slds-page-header__detail-block (4–6 key fields)
            ├── p.slds-text-title.slds-truncate   ← field label
            └── value (p or lightning-formatted-email/phone/date-time)
```

**Shadow:** always add `box-shadow: var(--slds-g-shadow-1, 0 2px 2px rgba(0,0,0,0.10))` — the header sits above the content area.

**Common mistakes:**
- `slds-page-header__col-title` instead of `slds-has-flexi-truncate` — title won't shrink, actions get pushed off
- `slds-page-header__col-actions` instead of `slds-no-flex` — actions column can shrink unexpectedly
- Both the object type `span` and the record name `span` must be siblings inside the same `h1`
- Omitting `slds-truncate` + `title` attribute on the record name span — long names overflow
- Using `standard:` icon without `size="large"` in the figure — default is too small for a page header

Full markup reference: `docs/ui-patterns/console-navigation.md` → "Page header anatomy"

LBC: `lightning-button`, `lightning-button-group`, `lightning-button-menu`, `lightning-icon`, `lightning-formatted-email`, `lightning-formatted-phone`, `lightning-formatted-date-time`.

### Three-column layout

**Left column (~200px, flex-none):**
- `lightning-accordion` sections (e.g., "About", "Get in Touch")
- Each section contains `slds-form-element_stacked` display fields in view state (label above, `slds-form-element__static` value below)
- In edit state, replace display fields with `lightning-input`, `lightning-combobox`, etc. — same grid position
- Inline edit pencil (`lightning-button-icon icon-name="utility:edit" variant="bare"`) appears on hover per field
- Address fields: show formatted address text; map thumbnail below if address is populated

LBC: `lightning-accordion`, `lightning-accordion-section`. View state fields use SLDS blueprint classes, not `lightning-input read-only`.

**Center column (flex, grows to fill):**

1. **`lightning-path`** (if PRD mentions stage, pipeline, progress, or coaching):
   - Stage nodes with chevron separators; active stage filled in accent
   - Below path: "Status: {Stage}" label + "Mark Stage as Complete" `lightning-button variant="brand"`
   - Coaching text block below: "Guidance for Success" heading + bullet list

   LBC: `lightning-path`. Trigger phrases: "stage", "pipeline stage", "progress tracking", "coaching guidance", "sales process".

2. **Activity split button group:**
   - `lightning-button-group` containing split button pairs: Log a Call · Email · New Event · New Task
   - Each pair: `lightning-button` (label) + `lightning-button-icon` (dropdown chevron) side by side
   - Action icons: `action:log_a_call`, `action:email`, `action:new_event`, `action:new_task`

3. **"Only show activities with insights" toggle:**
   - `lightning-input type="toggle"` label="Only show activities with insights"

4. **Filter bar:** "Filters: All time · All Activities · {type filter}" as plain text with "Refresh · Expand All · View All" link row on the right

5. **Activity timeline (`lightning-accordion`):**
   - Section heading: "Upcoming and Overdue" (with count badge)
   - Each activity item: `slds-media` with object icon + link title + description + timestamp (right-aligned) + action button (`⊙`)
   - Activity types: email (standard:email icon), call (action:log_a_call), task (standard:task)

**Right column (~200px, flex-none):**
- Stack of `lightning-card` components, one per related object
- Each card: object title + count + `lightning-button-icon variant="bare" icon-name="utility:down"` expand button
- Inside each card: `lightning-tile` list — avatar + name + title/role labels per item
- Cards: Contacts · Opportunities · Cases · Files (Files card has "Upload Image" / drag-and-drop zone using `lightning-file-upload`)

LBC: `lightning-card`, `lightning-tile`, `lightning-file-upload`.

### Docked Utility Bar

Persistent footer. Items vary by app context. Common: Omni-Channel (Online) · Macros · History · Notes.

---

## Console Nav Variant

### Chrome layers

```
Global Header
└── Console Tab Bar
    └── Subtab Bar  (record opens as a subtab)
        └── Record Header (full-width within subtab)
            └── Tab row  (Details | Related Lists | ...)
                └── Two-column content area + optional right panel
                    └── Docked Utility Bar
```

### Record Header (console)

- Left: `lightning-avatar` (circle, initials) + record title (h1)
- Right: Edit · Start Conversation · New {Object} (split button with dropdown) · overflow `⊙`
- Below title: horizontal key-field strip — 7+ field label/value pairs in a single scrollable row

### Tab row

Tabs: Details · Related Lists · (additional custom tabs)
Implemented with `lightning-tabset` or `slds-tabs_default` blueprint.

### Details tab — Two-column layout

The Details tab has two distinct states. Do not use one component pretending to be both.

**View state** — compact display fields, not `lightning-input read-only`:
- Label above value, separated by a bottom border line (`border-bottom: 1px solid var(--slds-g-color-border-base-1, #e5e5e5)`)
- Dense two-column grid, `slds-grid slds-gutters slds-wrap`
- Grouped sections with an `slds-accordion`-style divider (section title + chevron)
- Hover reveals a pencil icon (`lightning-button-icon variant="bare" icon-name="utility:edit"`) per field for inline edit

**Edit state** — full editable form, same layout:
- Replace display fields with `lightning-input`, `lightning-combobox`, `lightning-textarea`, etc.
- Preserve same two-column grid, section structure, and field order
- Edit controls are taller than display fields — that is expected and correct
- Show Save (`variant="brand"`) and Cancel buttons at the top or bottom of the section

**The rule:** never use `lightning-input read-only` for view state. It renders as an input control with input chrome, not a compact display field. Use it only in edit state.

**Canonical view-state markup:**
```html
<!-- Display field — view state -->
<div class="slds-form__item">
  <div class="slds-form-element slds-form-element_stacked">
    <span class="slds-form-element__label slds-text-title">Account Name</span>
    <div class="slds-form-element__control">
      <span class="slds-form-element__static slds-truncate">Acme Corp</span>
    </div>
  </div>
</div>

<!-- Edit state — same field in edit mode -->
<lightning-input label="Account Name" value={accountName} onchange={handleChange}></lightning-input>
```

**Left column (wider, ~60%):**
- Display fields in two-column grid (view state) or input fields (edit state)
- Expandable Address section with map thumbnail
- Mailing Address text + map embed

**Right (~300px, fixed):**

1. **Next Best Action card** (`lightning-card`):
   - AI recommendation: image thumbnail + title text + primary CTA button (brand) + dismiss link ("No, Thank You")

2. **Activity panel** (`lightning-card`):
   - Tab row: Activity · Einstein · Community · Chatter (`lightning-tabset`)
   - Actions: Log a Call · Email · New Task · New Event (`lightning-button-group`)
   - "Recap your Call" text input + Add button
   - Filter bar: "Filters: All time · All Activities · {types}"

### Related Lists tab

Each related list is a `lightning-card` containing a flat `lightning-datatable`. The card owns the visible boundary — 1px border, **outline-only** (no drop shadow), 12px rounded corners. The datatable inside is **flat**: no outline, no rounded corners, just horizontal row dividers. It is not a second rounded container.

> **Read this section before writing any related-list markup.** The cosmos SLDS 2 theme makes containers flat by default and gives the datatable a visible left/right border + rounded corners. You have to actively override both, and the obvious-looking hooks (`--slds-c-card-shadow`, `--slds-g-color-border-base-1`) do not work — see "Why each line exists" below.

#### What cosmos does by default

| Cosmos token | Default value | Effect |
|---|---|---|
| `--slds-s-container-shadow` | `none` | Card has no drop shadow |
| `--slds-s-container-color-border` | `transparent` | Card border is invisible |
| `--_slds-c-datatable-color-border` | `--slds-g-color-border-1` (#c9c9c9) | Datatable has a visible left/right border |
| `--_slds-c-datatable-radius-border` | `calc(--slds-g-sizing-border-4 * 2)` (~8px) | Datatable has rounded corners |

Setting `--slds-c-card-shadow` on a parent does **not** propagate. The inner `<article class="slds-card">` directly resets it via `var(--slds-s-container-shadow)`. Style the host element directly.

#### Structure per related list

- `lightning-card` with `icon-name` (standard object category) + `title` (related object name)
- Datatable directly in the default slot — no wrapper div around it
- "View All" at the **bottom** of the card (after the datatable in the default slot), centered — not in `slot="actions"`. `lightning-card` has no bottom slot; place it as a sibling after the datatable.
- For empty states only: replace the datatable with `<div class="related-card-body slds-var-p-around_medium">No {objects} to display.</div>`

#### Canonical markup

```html
<lightning-card class="related-card" title="Cases" icon-name="standard:case">
  <lightning-datatable
    class="related-table"
    key-field="id"
    data={cases}
    columns={caseColumns}
    hide-checkbox-column>
  </lightning-datatable>
  <div class="related-card-footer">
    <lightning-button label="View All" variant="base"></lightning-button>
  </div>
</lightning-card>
```

The datatable is **directly in the card body slot** — no `.related-card-body` wrapper, no `.related-card-frame` wrapper. Wrappers create a doubled visual boundary.

#### Canonical CSS — copy-paste, do not modify

Related list cards are **outline-only** (border, no drop shadow). No elevation.

```css
/* If you have a parent rule like `.your-shell lightning-card { box-shadow: ...; }`,
   selector specificity matters — use .your-shell lightning-card.related-card to win. */
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

**Why each line exists:**
- `display: block` — `lightning-card` host is `display: inline` by default; without this the host border won't span full width
- `--slds-c-card-radius-border` + `border-radius` together — keeps the host border and inner article border-radius at the same value (otherwise leaves a 1–2px misalignment band)
- Border, radius, background **on the host** — only reliable place; cosmos defaults override anything set via `--slds-c-card-shadow` from a parent
- `box-shadow: none` — related list cards are outline-only. Use `.your-shell lightning-card.related-card` (specificity `0,2,1`) to beat a parent `.your-shell lightning-card` rule (`0,1,1`)
- `--_slds-c-datatable-color-border: transparent` — kills cosmos-default visible left/right table outline (`--slds-g-color-border-base-1` does **not** work here)
- `--_slds-c-datatable-radius-border: 0` — kills cosmos-default rounded table corners
- Row dividers stay visible — they use `--slds-g-color-border-1` directly and are unaffected by the above overrides

#### Outer detail container (the tabset wrapper holding all related lists)

A different radius. Use `--slds-g-radius-border-4` (20px), not 12px:

```css
.detail-content-container {
  background-color: var(--slds-g-color-surface-1, #fff);
  border-radius: var(--slds-g-radius-border-4, 1.25rem);
  box-shadow: var(--slds-g-shadow-1, 0 2px 2px rgba(0, 0, 0, 0.1));
  overflow: clip; /* clips child content to the rounded edge; does NOT clip the container's own shadow */
}
```

Use `overflow: clip`, **not** `overflow: hidden`. `overflow: hidden` clips children's box-shadows, which silently truncates the related-list card shadows where they meet the container edge.

#### Hard stops — these break the pattern

- Do not give related list cards a `box-shadow` — the design is outline-only
- Do not wrap the datatable in `.related-card-body` or `.related-card-frame` — datatable goes directly in the card slot
- Do not use `--slds-g-radius-border-2` (4px) for related list cards — cards use `--slds-g-radius-border-3` (12px)
- Do not set `--slds-c-card-shadow` on a parent expecting it to cascade — the inner article overrides; style the host directly
- Do not set `--slds-g-color-border-base-1: transparent` on the datatable — that hook does not affect the cosmos table outline; use `--_slds-c-datatable-color-border`
- Do not use `hide-table-header` + `hide-borders` together — breaks rendering in this starter
- Do not style internal datatable DOM with descendant selectors — synthetic shadow blocks them; use `--slds-c-*` / `--_slds-c-*` hooks on the datatable instance
- When a parent rule applies `lightning-card { box-shadow: ... }`, `.related-card { box-shadow: none }` will lose on specificity — use `.parent-shell lightning-card.related-card` to win

**Empty state:** swap the datatable for `<div class="related-card-body slds-var-p-around_medium">No {objects} to display.</div>`.

**Reference:** Figma node `eJrjNsKojTF773g7Riok55` / `1:3552` — canonical render of this pattern (1px border + 12px corners on the card, flat table inside, centered "View All" footer).

### Docked Utility Bar

Items: Omni-Channel (Online) · Macros · History · Notes

---

## SLDS hooks (confirmed in Figma source)

| Hook | Value | Use for |
|---|---|---|
| `--slds-g-color-surface-container-1` | `white` | Record background |
| `--slds-g-color-border-1` | `#c9c9c9` | Field separators, card borders |
| `--slds-g-color-on-surface-1` | `#5c5c5c` | Secondary text, labels |
| `--slds-g-color-on-surface-2` | `#2e2e2e` | Primary text, field values |
| `--slds-g-color-on-surface-3` | `#03234d` | Headings, record title |
| `--slds-g-color-accent-2` | `#0250d9` | Active tab, links, brand button |

---

## States

| State | Implementation |
|---|---|
| Loading | `lightning-spinner` in the content area |
| View state field | `slds-form-element__static` inside `slds-form-element_stacked` — never `lightning-input read-only` |
| Edit state field | `lightning-input`, `lightning-combobox`, `lightning-textarea`, etc. — never in view state |
| Edit inline (per-field) | Pencil icon (`lightning-button-icon variant="bare" icon-name="utility:edit"`) on hover; swap that field only into edit LBC |
| Empty related list | "No {objects} to display" text centered in the card body |
| Unsaved changes | Console tab shows a warning indicator (dot on the tab) |

---

## Design rationale notes

These reflect Salesforce's first-party record detail decisions. Use them as grounding defaults; follow requirements when they specify something different.

- **View vs edit state are two separate implementations** — view state uses compact `slds-form-element__static` display fields (label + plain value + border). Edit state replaces those with `lightning-input`, `lightning-combobox`, etc. Never use `lightning-input read-only` as a display field — it renders input chrome in view state where no chrome belongs.
- **Flat activity list** — `lightning-accordion` with "Upcoming and Overdue" / "Past Activity" sections groups time-based activity into scannable chunks. Use a flat list only if requirements explicitly call for a single unsectioned feed.
- **Full-width activity action buttons** — `lightning-button-group` split buttons keep Log a Call / Email / New Task / New Event compact and at the top of the timeline. Separate full-width buttons consume vertical space and push the timeline down. Deviate when requirements call for a different action layout.
- **`lightning-path` for stage/pipeline** — `lightning-path` is purpose-built for stage progression and is a first-class LBC. If the PRD mentions "stage", "pipeline", or "sales process", default to `lightning-path` before considering a custom solution.
- **Related records in a console app** — Salesforce's console pattern opens related records as new subtabs to preserve the current record's context. Opening in the same view loses context. Deviate only if requirements explicitly describe in-place navigation.
