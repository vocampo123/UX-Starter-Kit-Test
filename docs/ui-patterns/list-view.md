# List View Pattern

**Source:** SLDS 2 Console Navigation v2 — Full-Width Table Component, Figma node `26078:42520`; SLDS 2 Components Web — Accounts List View, Figma node `67686:84780`

---

## Platform vs LWC

> **Runtime context:** This split applies to **org-deployed components** in `force-app/main/default/lwc/`. For **local prototype pages** in `src/modules/page/`, build the full anatomy described below — the prototype has no platform chrome to inherit.

For a standard object list view in an org, **almost everything in this pattern is provided by Salesforce.** Do not rebuild it inside an LWC.

| Layer | Provided by | Implement in LWC? |
|---|---|---|
| Global header (search, notifications, app launcher) | Platform | No |
| Standard app navigation tab bar | Platform (CustomApplication metadata) | No |
| List view page header (title, view switcher, item count, sort/filter meta) | Platform (standard list view) | No |
| Sortable data table with row selection, inline edit, column editor | Platform (standard list view) | No |
| Docked utility bar | Platform (CustomApplication utility items) | No |
| Embedded enhancements (related side panel, custom widgets above/below the list) | LWC | Yes |
| Bulk actions or custom row actions beyond standard | LWC (List View Action Override) | Yes, when required |

**Rule:** For list views of standard or custom objects, use Salesforce's standard list view UI. Build LWCs only for embedded enhancements that the platform doesn't provide.

**Only build a full LWC list view when:** the PRD requires a fundamentally different layout (e.g., a kanban or map view of records) that the standard list view cannot express. Most "show me a list of records" requirements should use the standard surface.

---

## When to use

Use this pattern when the PRD describes:
- "All [Object]" or "Recently Viewed [Object]" screens
- A filtered queue or work list
- Any page whose primary content is a sortable, selectable table of records
- Object list views accessed from a nav tab

---

## Chrome layers (outer → inner)

**Console nav variant** (multi-record workspace):
```
Global Header
└── Console Tab Bar  (single active object tab)
    └── List View Page Header
        └── lightning-datatable
            └── Docked Utility Bar
```

**Standard nav variant** (single-app experience):
```
Global Header
└── Standard App Nav (horizontal tab bar with object tabs + dropdown chevrons)
    └── List View Page Header
        └── lightning-datatable
            └── Docked Utility Bar
```

Use the console variant when the list is part of a multi-record workspace. Use the standard variant when it is accessed from a standard Lightning app nav tab.

---

## Global Header

See `console-navigation.md` for the full utility icon order. Identical in both variants.

---

## Standard App Navigation (standard variant only)

Horizontal tab bar directly below the Global Header:
- Each tab: object/page label + `∨` dropdown + optional `×` close (for pinned object tabs that open in tab form)
- Active tab: underlined with accent color
- Multiple object tabs can be open simultaneously (e.g., "Accounts ×", "Accounts ×" shown as separate tabs)

LBC: Use `slds-context-bar` blueprint for the navigation bar. App Name + waffle on the left.

---

## List View Page Header

Anatomy (left to right, top row):
- Object icon (`lightning-icon` standard category) + breadcrumb label (object name, small)
- View title as `h1` (e.g., "Recently Viewed", "All Accounts") + view switcher dropdown (`utility:switch` icon, bare button)

Second row (meta + controls):
- Left: meta text — "{N} Items · Sorted by {Field} · Filtered by {Filter} · Updated {time}"
- Right controls in order: `lightning-input type="search"` · density toggle · column editor (`utility:settings`) · inline edit (`utility:edit`) · refresh (`utility:refresh`) · export (`utility:upload`) · filter (`utility:filterList`)

Primary actions (top right, above meta row in standard variant): Edit · Delete · Clone buttons

LBC: `lightning-button-icon variant="border-filled"` for icon controls. `lightning-button-group` for grouped controls. `lightning-input type="search" variant="label-hidden"` for inline search.

SLDS: Use `slds-page-header`, `slds-page-header__row`, `slds-page-header__col-title`, `slds-page-header__col-controls`, `slds-page-header__controls` classes.

---

## Data Table

Use `lightning-datatable` — never build a data table from raw HTML `<table>` markup.

Required props:
- `key-field` — unique identifier field (e.g., `"id"`)
- `data` — array of record objects
- `columns` — column definitions with `label`, `fieldName`, `type`, `sortable: true`
- `sorted-by` + `sorted-direction` + `onsort` handler — always make columns sortable
- `show-row-number-column` — optional, include when row count aids scanning

Column order (from Figma): Account Name (link) · Type · Last Activity · Next Activity · Next Opportunity · Open Cases · YTD Spending · Owner

Row states:
- Default: white background
- Selected: accent blue background (`--slds-g-color-accent-container-1`)
- Hover: light surface tint

Row action button: `⊙` appears on right of each row on hover — use `row-actions` column type with `getRowActions` handler.

Select-all checkbox: included in header via `lightning-datatable` default behavior.

---

## Docked Utility Bar

Always include at least one utility item (e.g., "To Do List" with `utility:task` icon) unless the PRD explicitly says no utility bar.

---

## SLDS hooks (confirmed in Figma source)

| Hook | Value | Use for |
|---|---|---|
| `--slds-g-color-surface-container-1` | `white` | Page background |
| `--slds-g-color-border-1` | `#c9c9c9` | Table cell borders |
| `--slds-g-color-on-surface-2` | `#2e2e2e` | Body text, column headers |
| `--slds-g-color-accent-2` | `#0250d9` | Active tab, selected row highlight |

---

## States

| State | Implementation |
|---|---|
| Loading | `lightning-spinner` centered in the table area, `alternative-text="Loading"` |
| Empty | Centered illustration or text: "{Object} list is empty" with a New button |
| Filtered (no results) | Centered text: "No {objects} match your current filters" with a Clear Filters link |
| Selected row | `lightning-datatable` handles highlight automatically |

---

## Design rationale notes

These reflect Salesforce's first-party list view decisions. Use them as grounding defaults; follow requirements when they specify something different.

- **Raw HTML table** — `lightning-datatable` includes row selection, sorting, inline editing, row actions, and SLDS 2 token theming out of the box. Only fall back to a raw `<table>` if a requirement cannot be met by `lightning-datatable` (e.g., merged cells, complex spanning headers).
- **Omitting sort** — sortable columns are a baseline user expectation in any list view; removing sort makes it harder to find records. Include sorting by default; omit only when a PRD explicitly specifies a non-sortable display.
- **Table inside a `lightning-card`** — list views are full-page components in Salesforce's pattern; wrapping the table in a card compresses it and adds visual noise. Use a card wrapper only if the PRD describes a list embedded within a larger page (e.g., a related list card on a dashboard).
- **Custom page header** — `slds-page-header` blueprint classes provide the canonical header structure (title, meta row, controls) with correct spacing and responsive behavior. Build a custom header only when the PRD calls for a layout the blueprint cannot support.
