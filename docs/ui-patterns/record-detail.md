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

Each related list is a `lightning-card` containing a flat `lightning-datatable`. The card owns the rounded corners and visual boundary. The datatable inside is flat and inset — it is not a second rounded container.

**Structure per related list:**
- `lightning-card` with `icon-name` (standard object category) + `title` (related object name)
- "View All" as `<lightning-button label="View All" variant="base" slot="actions">`
- Card body: `<div class="related-card-body">` providing 16px inset padding
- `lightning-datatable` inside the body: flat, visible header and rows, `hide-checkbox-column`

**Canonical markup:**
```html
<lightning-card class="related-card" title="Cases" icon-name="standard:case">
  <lightning-button label="View All" variant="base" slot="actions"></lightning-button>
  <div class="related-card-body">
    <lightning-datatable
      class="related-table"
      key-field="id"
      data={cases}
      columns={caseColumns}
      hide-checkbox-column>
    </lightning-datatable>
  </div>
</lightning-card>
```

**Canonical CSS:**
```css
.related-card {
  display: block;
  overflow: hidden;
  border-radius: var(--slds-g-radius-border-2, 0.25rem);
}
.related-card-body {
  padding: var(--slds-g-spacing-4, 1rem);
}
.related-table {
  display: block;
  border-radius: 0;
  --slds-g-color-border-base-1: transparent;
}
```

**Hard stops — these break the pattern:**
- Do not wrap the datatable in a second bordered or rounded container
- Do not add `border`, `outline`, or `border-radius` to `.related-card-body`
- Do not place the datatable flush against the card edge (always inset with padding)
- Do not use `hide-table-header` + `hide-borders` together — this combination can break rendering in this starter
- Do not style internal datatable DOM with descendant selectors — use `--slds-c-*` hooks or a scoped class on the datatable instance

**Empty state:** render "No [objects] to display" as centered text inside `.related-card-body`.

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
