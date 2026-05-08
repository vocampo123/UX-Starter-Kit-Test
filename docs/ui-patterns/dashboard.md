# Dashboard Pattern

**Source:** SLDS 2 Components Web — Dashboards frame, Figma node `67686:88890`

---

## Platform vs LWC

> **Runtime context:** This split applies to **org-deployed components** in `force-app/main/default/lwc/`. For **local prototype pages** in `src/modules/page/`, build the full anatomy described below — the prototype has no platform chrome to inherit.

Dashboards in Salesforce are hosted on a **FlexiPage** (`HomePage` template for Home, `AppPage` for an app dashboard). The platform provides the page chrome; LWCs are placed inside FlexiPage regions as cards.

| Layer | Provided by | Implement in LWC? |
|---|---|---|
| Global header | Platform | No |
| App navigation tab bar | Platform | No |
| FlexiPage region grid (column layout, region containers) | Platform (FlexiPage template) | No |
| Standard dashboard components (Standard Report Chart, List View, Recent Items) | Platform (drag into FlexiPage regions) | No |
| Custom KPI cards, custom chart cards, custom tile lists | LWC | Yes |
| Docked utility bar items | Platform (CustomApplication utility items) | No |

**Rule:** Build a FlexiPage (`HomePage` or `AppPage` template) and define the column layout in the FlexiPage XML. Each "card" in this pattern doc maps to an LWC dropped into a FlexiPage region. Do **not** create a single full-page LWC that renders all three columns and all cards inside it — that fights the platform and prevents users/admins from rearranging the page in App Builder.

**FlexiPage example structure:**
```xml
<flexiPageRegions>
  <name>main</name>
  <type>Region</type>
  <itemInstances><componentInstance>...</componentInstance></itemInstances>
</flexiPageRegions>
```

---

## When to use

Use this pattern when the PRD describes:
- A home page or overview page with KPIs across multiple objects
- An executive summary or "at a glance" view
- Recent activity, charts, and related record lists on a single screen
- A non-operational summary (no live alerts, no incident queue)

Trigger phrases: dashboard, home page, overview, KPIs across objects, executive summary, recent activity, pipeline summary, at a glance.

A dashboard is read-oriented. If the PRD includes an alert queue, triage workflow, or real-time operational response, use the command center pattern instead.

---

## Chrome layers (outer → inner)

```
Global Header
└── Standard App Nav  (Dashboards tab active, horizontal)
    └── Three-column content area  (equal thirds, no fixed panel)
        └── Docked Utility Bar  (footer)
```

Dashboard pages always use **standard app navigation** — not console navigation. If the user needs to drill into a record from a dashboard card, that record opens in a new tab or page.

---

## Global Header

Same as all other patterns. See `console-navigation.md` for the full utility icon order.

---

## Standard App Navigation

Horizontal tab bar below the Global Header. "Dashboards" tab is active (underlined with accent color). Other tabs remain visible for navigation.

---

## Three-column content layout

Three equal-width columns (approximately 33% / 33% / 33%), no fixed pixel widths.

Each block within a column is a `lightning-card`. Cards stack vertically within their column. Use `slds-grid` + `slds-col` for the column layout.

**Do not add a page header row** — the dashboard content starts directly below the nav bar.

---

## Card types and LBC mapping

Every content block is a `lightning-card`. Cards have:
- Title in the header slot
- Optional expand `⤢` button (`lightning-button-icon variant="container" icon-name="utility:expand"`) in the actions slot
- Body content
- Optional "View All" link in the footer (use `type="centered"` footer)

### Activity Timeline Card

Content: stacked activity items, most recent first.

Each item uses `slds-media`:
- Left: object icon (`lightning-icon` 32px, action or standard category)
- Body: link title (blue link) + description text (secondary) + timestamp (right-aligned, secondary color)
- Action: `⊙` row action button on far right

Activity item types (use the correct icon per type):
- Contact created: `action:new_contact`
- Lead update: `standard:lead`
- Email: `standard:email`

LBC: No single LBC — implement as an LWC using `slds-media` + `slds-timeline` blueprint classes.

### Donut / Pie Chart Card

Content: centered SVG donut chart + legend below.

Legend: colored dot + label per segment, arranged in a row.

For local dev prototyping, render a static chart using `<svg>` or an image. For org deployment, use a `lightning-formatted-rich-text` embedding or a dedicated charting LWC.

Do not use `lightning-datatable` for chart data — render it visually.

### Compact Data Table Card

Content: 3–4 column table of real records, no checkboxes, no row actions.

LBC: `lightning-datatable` — use `hide-checkbox-column` to remove the select-all checkbox. Keep columns to 3–4 maximum. Use `type: "url"` for the name/link column.

Example columns (from Figma): Account · Name · Title

### Tile List Card

Content: stacked `lightning-tile` components, one per related record.

Each tile: `lightning-avatar` (circle, initials) + name (link) + title label + role label.

LBC: `lightning-tile` inside a `lightning-card` body.

### Horizontal Bar Chart Card (Pipeline by Stage)

Content: one row per pipeline stage — stage label (left) + colored bar (proportional width) + currency value (right).

Stage rows (from Figma): Qualifying · Proposal · Negotiation · Closed Won

Implement as a custom LWC using `slds-progress-bar` blueprint for each bar, or use inline `<div>` with `background: var(--slds-g-color-accent-2)` and explicit width percentage.

Footer: "View All" link (centered card footer).

---

## Column composition (from Figma)

Default three-column layout from the Figma source:

| Left | Center | Right |
|---|---|---|
| Recent Activity (timeline) | Leads (donut chart) + Contacts (data table) | Accounts (tile list) + Opportunities (bar chart) |

Map PRD entities to this structure:
- Activity feed → left column, activity timeline card
- Single metric with distribution → center top, donut/pie chart card
- Record list with fields → center bottom, compact data table card
- Related entity tiles → right top, tile list card
- Pipeline or funnel → right bottom, horizontal bar chart card

---

## Docked Utility Bar

Include "To Do List" (`utility:task`) as the default utility item unless the PRD says otherwise.

---

## SLDS hooks (confirmed in Figma source)

| Hook | Value | Use for |
|---|---|---|
| `--slds-g-color-surface-container-1` | `white` | Card backgrounds, page background |
| `--slds-g-color-border-1` | `#c9c9c9` | Card borders, table cell borders |
| `--slds-g-color-on-surface-1` | `#5c5c5c` | Secondary text, timestamps, labels |
| `--slds-g-color-on-surface-2` | `#2e2e2e` | Primary body text |
| `--slds-g-color-accent-2` | `#0250d9` | Links, bar chart fill, active tab |
| `--slds-g-font-family-base` | system font | All text |
| `--slds-g-font-weight-4` | 400 | Regular body text |
| `--slds-g-font-weight-6` | 590 | Semibold headings |
| `--slds-g-font-scale-1` | — | Small labels (19px line-height) |
| `--slds-g-font-scale-3` | — | Card titles (28px line-height) |
| `--slds-g-font-scale-5` | — | Large headings (35px line-height) |

---

## States

| State | Implementation |
|---|---|
| Card loading | `lightning-spinner` centered in card body, size="small" |
| Card empty | Centered text: "No {object} to display" + optional "View All" link |
| Chart no data | Static "No data available" message centered in chart area |

---

## Design rationale notes

These reflect Salesforce's first-party dashboard decisions. Use them as grounding defaults; follow requirements when they specify something different.

- **Nested cards** — Salesforce's dashboard pattern never nests `lightning-card` inside `lightning-card`; the hierarchy becomes visually ambiguous. If requirements call for a card-within-card, consider a `lightning-accordion-section` or a flat section heading as an alternative.
- **Full-width tables in card columns** — a full-width table overwhelms a card-based column layout and defeats the purpose of the three-column design. Use the compact `lightning-datatable` variant (3–4 columns, no checkboxes) by default; if a PRD calls for a full table, move it to its own full-width section below the three-column grid.
- **Page header** — Salesforce's dashboard lands users directly in content without a page header row; headers add visual weight that slows orientation. Include a page header only if requirements explicitly call for one (e.g., a page title with a date filter or primary action button).
- **All-table columns** — mixing card types (chart + table + tiles) aids scannability because different formats communicate different things at a glance. Use all-table columns only if requirements specify them.
- **Action buttons per card** — dashboards are read-oriented; heavy action surfaces belong in record detail or command center pages. Limit CTAs to "View All" links by default; add action buttons only when a PRD requires them on a specific card.
- **Console navigation for a dashboard** — standard app navigation is the default for dashboard pages; console navigation adds tab management overhead that doesn't benefit a read-oriented summary page. Use console navigation only if the PRD explicitly describes a multi-record workspace context.
