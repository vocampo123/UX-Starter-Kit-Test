# Command Center Pattern

**Source:** Command Center Figma Toolkit, nodes `145:61311` (Shell), `144:53607` (Alert Center), `145:74068` (Alert Details)

---

## Platform vs LWC

> **Runtime context:** This split applies to **org-deployed components** in `force-app/main/default/lwc/`. For **local prototype pages** in `src/modules/page/`, build the full anatomy described below — the prototype has no platform chrome to inherit.

A Command Center in an org is a **Custom App Page** (FlexiPage `AppPage` template) hosted in a Lightning Application. The platform provides the surrounding chrome; LWCs implement the page content within FlexiPage regions.

| Layer | Provided by | Implement in LWC? |
|---|---|---|
| Global header (search, notifications, app launcher, user menu) | Platform | No |
| Console or standard app navigation tab bar | Platform (CustomApplication metadata) | No |
| Docked utility bar | Platform (CustomApplication utility items) | No |
| FlexiPage region grid (left rail / primary / right panel column layout) | Platform (FlexiPage `AppPage` template with custom regions) | No |
| Omni-Channel Alert Rail content (alert cards, tabs, acknowledge actions) | LWC | Yes |
| Primary zone content (role-specific work surface) | LWC | Yes |
| Companion / Watchlist panel content (KPI tiles, AI agent) | LWC | Yes |
| Alert Details workspace (drill-down detail page) | LWC + secondary FlexiPage | Yes |

**Rule:** Build the Command Center as a FlexiPage `AppPage` with regions for left rail, primary zone, and companion panel. Each LWC fills one region. The CustomApplication wraps it all — choose `navType="Standard"` or `navType="Console"` per the PRD. Do **not** rebuild the global header, app nav, or utility bar inside any LWC.

**This is the one archetype where building substantial custom UI inside LWCs is expected** — the alert rail, role-specific primary zone, and companion panel are all custom. But they still live inside FlexiPage regions, not as a single full-page LWC.

### LWC decomposition and alignment

**The unit of decomposition is the individual UI element, not the column or region.**

A column containing a KPI strip, an alert list, and an action panel needs three separate LWCs placed into that column — not one LWC that renders all three. Each LWC that a user might independently remove, reorder, or reconfigure in App Builder must be its own `isExposed=true` component.

| Wrong — one LWC per column | Correct — one LWC per UI element |
|---|---|
| `commandCenterLeftRail` (alerts + filters + tabs) | `commandCenterAlertList`, `commandCenterAlertFilters`, `commandCenterAlertTabs` |
| `commandCenterPrimary` (KPIs + table + actions) | `commandCenterKpiStrip`, `commandCenterMemberTable`, `commandCenterActionPanel` |
| `commandCenterWatchlist` (watchlist + AI summary) | `commandCenterWatchlistCard`, `commandCenterAiSummary` |

Multiple LWCs can be stacked in the same flexipage column region — App Builder stacks them vertically. The flexipage defines which column each goes into; the user can then reorder or remove them independently.

**Each LWC owns only its internal content.** Cross-column alignment, gutters, row placement, and "this rail starts at the same height as that card" are the FlexiPage template's responsibility — not the LWC's.

**Never inside a section LWC:**
- `padding-top`, `margin-top`, or spacer divs to align with a component in another column
- `min-height` or fixed `height` to match a neighbouring region's rendered height
- CSS grid or `slds-grid` that spans multiple FlexiPage regions

**When exact row alignment across columns is required:** use a custom page template (`lightningcomponentbundle` with `type="flexipage"`) that defines the grid layout in CSS. The template owns alignment; the LWC owns content. Using `lightning:layout` inside a custom App Page template for exact row alignment is unreliable — use an explicit CSS grid template instead.

---

## When to use

Use this pattern when the PRD describes:
- Operational monitoring, triage, or incident management
- A role-based workspace for watching live metrics and responding to alerts
- A "watchtower", "command center", "operations hub", or "agent dispatch" screen
- A page where the primary task is: monitor → detect → investigate → act

Trigger phrases: monitor, triage, alert, incident, dispatch, operational hub, real-time, watchtower, command center, escalation, multi-agent.

A command center is NOT a dashboard. Dashboards display past performance; command centers enable immediate action. If the PRD only asks for KPIs and charts with no actionable queue, use the dashboard pattern instead.

---

## Shell structure (outer → inner)

```
Global Header  (Console v2 style)
└── Console Nav  (role-specific tab label)
    ├── Omni-Channel Alert Rail  (left, collapsible)
    ├── Primary Zone  (center, 70%)
    │   └── [role-based content]
    └── Watchlist / Companion Panel  (right, 30%)
        └── [role-based content]
└── Docked Utility Bar  (footer, optional — can be hidden)
```

---

## Global Header

Same as `console-navigation.md`. Console v2 style with full utility icon row.

---

## Omni-Channel Alert Rail (left panel)

Two states — determine from PRD context which is the default:

**Expanded (380px wide):**
- Header: "Inbox" label + settings icon (`utility:settings`) + toggle icon (`utility:toggle_panel_right`)
- Tab row: Open · Snoozed · History (use `lightning-tabset` or `slds-tabs_default`)
- Divider line below tabs
- Alert list: stacked `OmnichannelAlert` items (see below)

**Collapsed icon rail (48px wide):**
- Each alert type gets a 48×48px slot
- Slot background: white (default) or `--slds-g-color-on-surface-3` (`#001e5b`) for a new/active alert
- Icon centered in slot: `utility:case` or object-specific icon
- New alert badge: `utility:record` dot overlay at top-right of icon

#### Alert item anatomy (expanded state)

Each alert item (stacked vertically, bordered bottom):
- Title text: Semibold, `--slds-g-font-weight-6`, 13px line-height 18px
- Description text: Regular, `--slds-g-color-on-surface-1`
- Criticality icon: `custom:custom53` on `--slds-g-color-error-1` (`#b60554`) background, 16px rounded

Alert types and when to use them:

| Type | Description | PRD trigger |
|---|---|---|
| Predictive Models | AI-driven proactive alerts (e.g., "settlement time trending to 14.5 days") | "AI alert", "predictive", "forecasted" |
| Tab-Next Metrics | Threshold triggers (e.g., CSAT drop) | "KPI breach", "threshold alert", "metric drop" |
| CRM Object Changes | Real-time field changes on Salesforce records | "record change", "field update alert" |
| Standardized Criticality | Normalized severity levels: High · Medium · Low | "severity", "priority level", "P1/P2/P3" |

Acknowledge action: `lightning-button-icon variant="border-filled"` with `utility:check` icon, acts as a checkbox button.

---

## Primary Zone (center, 70%)

Content varies by user role. Extract the role from the PRD:

### Strategic — Execs / VPs

Primary zone: **Revenue Impact Simulation** (What-If sandbox)
- Section title + info icon (`utility:info_alt`)
- Left: bar chart (Forecasted Revenue Impact, top 10 SKUs as horizontal bars)
- Right: interactive sliders with `lightning-slider` — one per adjustable variable (Promotional Spend Lift 0–100%, Channel Inventory Buffer 0–100%, Price Reduction %, Lead Time Reduction in Days); each slider has a freeform input (`lightning-input`) paired

Watchlist (30%): Executive Pulse — KPI tiles with Red/Yellow/Green indicators using `lightning-badge` or status icon overlays

### Operational — Managers

Primary zone: Geographic Map, Capacity Grid, or Heat Map visualization
- If geographic: use an embedded map component or chart image
- If capacity grid: dense table using `lightning-datatable` in compact mode with color-coded cells
- Section heading + subtitle

Watchlist (30%): Pulse Metric Watchlist — real-time metrics as `lightning-card` tiles with metric value + trend indicator

### Tactical — Frontline Staff

Primary zone: **Incident-Oriented Workboard**
- Full-height `lightning-datatable` or card list of active incidents/alerts
- Each item: severity badge + title + entity link + status + assigned + actions
- Prioritize "what needs action now" over historical data

Watchlist (30%): Task/Case Backlog — personalized feed of active items assigned to the user

---

## Overview Page content blocks (when no specific role is specified)

Stack these blocks vertically in the primary zone, top to bottom:

1. **AI Operational Digest** — full-width banner card, AI-generated summary text. Use `lightning-card` with a distinct surface color.
2. **Live Cards — Predictive** — metric value + trend line + time label. Use `lightning-card` per metric, arranged in a grid row.
3. **Live Cards — Realtime** — same structure but with a "live" badge and real-time refresh.
4. **Live Cards — Predictive with Interactions** — metric + trend + an inline action button (e.g., "Investigate").
5. **C360 Role-Based LWC** — a Customer 360 summary component for the primary entity.
6. **TN: Role-Based Metric + Visualizations** — trend-narrative metric cards with mini charts.

---

## Watchlist / Companion Panel (right, 30%)

Use `lightning-card` for each section. Cards are stacked vertically with expand `⤢` icon per card.

Common content: KPI summary tiles, assigned queue count, alert count by severity, threshold indicators.

For AI companion (CC Companion Agent): full-height `lightning-card` with chat/recommendation interface on the right side (398px wide in standard state).

---

## Alert Details workspace (drill-down from Alert Rail)

When a user clicks an alert, the detail opens as a dedicated tab workspace. Three responsive width states:

| State | Alert Rail | Detail Area | Lightning Panel |
|---|---|---|---|
| Compact | 380px | 702px | 246px |
| Standard | 380px | 1134px | 398px |
| Focus (rail collapsed) | 48px | 1466px | 398px |

Detail area sections in order:

1. **Console Global Header** (full-width, same as shell)
2. **Page Header** — record title + primary actions (Edit, escalate, close)
3. **Expandable Section (non-collapsible):**
   - Left half: Metric card — KPI value + trend + time label + related metrics
   - Right half: Agentforce Card — AI analysis + root cause + confidence indicator
4. **Accordion: Related Metrics** (`lightning-accordion-section`, collapsible) — secondary metrics affected by this alert
5. **Accordion: Recommended Mitigating Actions (RMA)** (`lightning-accordion-section`) — three equal-width `lightning-card` side by side, each showing one AI-recommended action with a CTA button
6. **Lightning Panel (right):** CC Companion Agent — persistent chat panel for AI-assisted investigation

Design annotations captured from Figma:
- "Dedicated Tab workspace for Alert"
- "Root Cause Analysis"
- "Actions are driven by the agent"
- "Metrics Related to the Alert aka Impacted Metrics"
- "Mitigating Action"
- "User feedback mechanism"
- "CC Companion Agent"

---

## SLDS hooks (confirmed in Figma source)

| Hook | Value | Use for |
|---|---|---|
| `--slds-g-color-surface-container-1` | `white` | Page and panel backgrounds |
| `--slds-g-color-border-1` | `#c9c9c9` | Alert item borders, panel dividers |
| `--slds-g-color-on-surface-1` | `#5c5c5c` | Secondary text, descriptions |
| `--slds-g-color-on-surface-2` | `#2e2e2e` | Body text |
| `--slds-g-color-on-surface-3` | `#03234d` | Headings, active rail slot background |
| `--slds-g-color-error-1` | `#b60554` | Criticality icon background, error state |
| `--slds-g-color-accent-2` | `#0250d9` | Active elements, brand buttons |

Typography from Figma:
- Alert title: `font-weight: 590` (Semibold), `font-size: --slds-g-font-scale-base`, `line-height: 18px`
- Alert description: `font-weight: 400` (Regular), same scale
- Section headings: `font-weight: 590`, `font-size: --slds-g-font-scale-3`, `line-height: 28px`

---

## States

| State | Implementation |
|---|---|
| Alert rail loading | `lightning-spinner` centered in the rail |
| No alerts | "No active alerts" centered text in Open tab |
| New alert (collapsed rail) | Dark slot background + record badge on icon |
| Alert acknowledged | Remove from Open list, move to Snoozed/History |
| Focus mode (rail collapsed) | Alert rail width switches from 380px to 48px; detail area expands |

---

## Design rationale notes

These reflect Salesforce's first-party command center decisions. Use them as grounding defaults; follow requirements when they specify something different.

- **Command center vs dashboard** — command centers are built for operational response (monitor → detect → act). If the PRD only describes KPIs and charts with no alert queue or triage workflow, the simpler dashboard pattern is the right starting point.
- **Decorative metrics** — every metric or chart in a command center should answer "what should the user do next?" Purely informational charts belong in a dashboard, not a command center. Apply this as a design intent check, not an absolute rule.
- **Alert rail position** — Salesforce places the alert rail on the left and the companion panel on the right by default; this separates input (alerts needing response) from assistance (AI analysis). Deviate if requirements specify a different panel arrangement.
- **70/30 zone split** — the 70% primary / 30% watchlist proportion reflects a bias toward the primary work surface. Use it as the default starting point; adjust the split when requirements specify a different information emphasis.
- **Alert list markup** — `slds-media` card items communicate the information hierarchy of an alert (icon, title, description, action) better than a flat table. Use `lightning-datatable` only if requirements explicitly call for a sortable/filterable table of alerts.
- **Accordion sections** — use `lightning-accordion` for collapsible sections by default; it handles keyboard navigation and ARIA states. Use raw HTML only when the accordion LBC cannot meet a specific structural requirement.
