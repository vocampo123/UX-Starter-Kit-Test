# Console Navigation Pattern

**Source:** SLDS 2 Pattern — Console Navigation v2 (Community), Figma nodes `25752:7649`, `25746:16844`

---

## Platform vs LWC

> **Runtime context:** This split applies to **org-deployed apps**. For **local prototype pages** in `src/modules/page/`, build the full chrome anatomy (tab bar, subtabs, etc.) described below — the prototype has no Salesforce app metadata to inherit from.

In an org, console navigation is a **CustomApplication setting**, not a custom-built UI. The platform provides every piece of console chrome described in this doc.

| Layer | Provided by | Implement in LWC? |
|---|---|---|
| Global header | Platform | No |
| Console tab bar (waffle, app name, primary tabs, More overflow) | Platform (CustomApplication with `navType="Console"`) | No |
| Subtab bar (records opened from within a console tab) | Platform (workspace API) | No |
| Tab dropdown menu (New Tab, Rename, Pin, Close) | Platform | No |
| Navigation Menu Object Modals (Add/Save Items) | Platform | No |
| Docked utility bar | Platform (CustomApplication utility items) | No |
| Content inside a tab (record page, list view, app page) | LWC + FlexiPage | Yes |
| Custom utility item content (panel that opens from utility bar) | LWC | Yes |

**Rule:** To enable console navigation, set `navType="Console"` on the `CustomApplication` metadata. Do **not** build a console tab bar, subtab bar, or app launcher in HTML/CSS — these are platform-rendered UI controlled by the application metadata. Custom LWC work for a console app focuses on the *content inside tabs* (FlexiPage record pages, app pages) and *utility bar items*.

**CustomApplication example:**
```xml
<CustomApplication xmlns="http://soap.sforce.com/2006/04/metadata">
  <label>Service Console</label>
  <navType>Console</navType>
  <uiType>Lightning</uiType>
  <utilityBar>...</utilityBar>
</CustomApplication>
```

---

## When to use

Use console navigation when the PRD describes:
- A service agent or support rep managing multiple records simultaneously
- A workspace where clicking a record opens it as a subtab without losing context
- A multi-record environment (e.g., open Case while viewing Account, open related Contact)
- Any app explicitly described as a "console" or "workspace"

Do not use console navigation for standard single-record pages, dashboards, or simple list views — use the matching pattern doc for those instead.

---

## Chrome layers (outer → inner)

```
Global Header
└── Console Tab Bar
    └── Subtab Bar (optional, appears below Console Tab Bar)
        └── Page content
            └── Docked Utility Bar (footer, optional)
```

---

## Global Header

Right-to-left utility icons in order:
`agent_astro` (Agentforce) · `favorite` (Favorites star+dropdown) · `new` (Global Actions) · `trailhead_alt` (Guidance Center) · `question` (Help) · `setup` (Setup) · `notification` (Notifications) · `lightning-avatar` (User)

Center: `lightning-input type="search"` (global search, full-width)

Left: Salesforce cloud logo (`utility:salesforce1` icon, large)

LBC: `lightning-layout` horizontal-align="spread" vertical-align="center" for the header row. Use `lightning-button-icon`, `lightning-button-icon-stateful`, `lightning-button-menu`, and `lightning-avatar` for utility area items.

SLDS hook: `--slds-g-color-surface-container-1` for header background.

---

## Console Tab Bar

Structure: Waffle icon (app launcher) · App Name label · tabs · "More" overflow dropdown

Each tab: `⚡` lightning icon prefix + label + `∨` dropdown chevron + `×` close button

Active tab: underlined with accent color (`--slds-g-color-accent-2: #0250d9`)

Tab dropdown menu items: New Tab · Rename Tab · Pin Tab · Close Tab

LBC: Use the `slds-context-bar` blueprint. There is no single LBC for the full console tab bar — implement as an LWC using `slds-context-bar`, `slds-context-bar__primary`, and `slds-context-bar__secondary` classes.

---

## Subtab Bar

Appears as a second row directly below the Console Tab Bar when a record is open as a subtab.

Each subtab: `⚡` icon + label + `∨` dropdown + `×` close. Selected subtab is highlighted (lighter background).

Use subtabs when: a record is opened from within a console tab (e.g., opening a Contact from a Case).

---

## Console variants (grab-and-go)

| Variant | When to use |
|---|---|
| Plain Console | App with primary object tabs only, no sub-records needed |
| Console with Menu | User needs tab management (rename, pin, close) |
| Console + Subtabs | Related records open in subtabs under the primary tab |
| Console with Menu + Subtabs | Full tab management + subtab navigation |
| Console + App Navigation Menu | Left panel listing navigable object types (Dashboards, Contacts, Accounts, Leads, Opportunities, Activity Reports) |
| Console + Subtabs Warning | Tab shows unsaved changes indicator — use when form edit state must persist across tab switches |

---

## Navigation Menu Object Modals

Triggered from the App Navigation Menu to manage which items appear in the nav:

| Modal | When shown |
|---|---|
| Save Disabled | User has not yet made changes |
| Save Enabled | User has modified nav items — Save button becomes active |
| Add Disabled | Add Items modal open, no item selected |
| Add Enabled | Item selected in Add Items modal — "Add Nav Item" button becomes active |

---

## Docked Utility Bar (footer)

Persistent bar at the bottom of the page. Each item is an expandable utility panel (e.g., Omni-Channel, Macros, History, Notes, To Do List).

LBC: Use `slds-utility-bar` blueprint. Implement as an LWC — no single LBC covers the full utility bar.

---

## Page header anatomy

The page header is a blueprint (`slds-page-header`) — there is no single LBC that wraps it. Build it directly in HTML using the classes below.

### Variants

| Variant class | When to use |
|---|---|
| `slds-page-header` (no modifier) | List views, object home pages |
| `slds-page-header slds-page-header_record-home` | Single-record views (contact, case, account, etc.) |

Always apply `box-shadow: var(--slds-g-shadow-1, 0 2px 2px rgba(0,0,0,0.10))` to the page header element — it sits above the content area and needs elevation to communicate that stacking.

### Row 1 — title + actions

```
slds-page-header__row
├── slds-has-flexi-truncate          ← title column, shrinks to avoid pushing actions off screen
│   └── slds-media slds-no-space slds-grow
│       ├── slds-media__figure       ← lightning-icon standard category, size="large"
│       └── slds-media__body
│           └── slds-page-header__name
│               ├── slds-page-header__name-title
│               │   └── h1
│               │       ├── span                                  ← object type label (e.g. "Contact")
│               │       └── span.slds-page-header__title          ← record name, add slds-truncate + title attr
│               └── slds-page-header__name-meta                  ← secondary metadata (e.g. "Contact · Acme Corp")
└── slds-no-flex slds-grid slds-align-top   ← actions column, never shrinks
    └── slds-page-header__controls
        └── slds-page-header__control
            └── lightning-button-group (Edit · action buttons · lightning-button-menu overflow)
```

**Common mistakes:**
- Using `slds-page-header__col-title` instead of `slds-has-flexi-truncate` — the flexi-truncate class is what allows the title to shrink without pushing action buttons off-screen.
- Wrapping the actions column with `slds-has-flexi-truncate` — always use `slds-no-flex` on the actions column.
- Omitting `slds-truncate` and the `title` attribute on the record name span — long names overflow without it.
- Putting the object type label outside `h1` — both the type label and the record name must be sibling `span` elements inside the same `h1`.
- Using `standard:` icon without `size="large"` in the page header figure — default size is too small.

### Row 2 — summary field strip (record-home variant only)

```
slds-page-header__row slds-page-header__row_gutters
└── slds-page-header__col-details
    └── ul.slds-page-header__detail-row
        └── li.slds-page-header__detail-block  (repeat per field, typically 4–6)
            ├── p.slds-text-title slds-truncate  ← field label
            └── p.slds-truncate                  ← field value (or lightning-formatted-email/phone/date)
```

Use `lightning-formatted-email`, `lightning-formatted-phone`, or `lightning-formatted-date-time` for formatted values in detail blocks — never plain `<p>` for email/phone/date fields.

### Canonical markup

```html
<div class="slds-page-header slds-page-header_record-home">

  <!-- Row 1: icon + title + actions -->
  <div class="slds-page-header__row">
    <div class="slds-has-flexi-truncate">
      <div class="slds-media slds-no-space slds-grow">
        <div class="slds-media__figure">
          <lightning-icon icon-name="standard:contact" size="large" alternative-text="Contact"></lightning-icon>
        </div>
        <div class="slds-media__body">
          <div class="slds-page-header__name">
            <div class="slds-page-header__name-title">
              <h1>
                <span>Contact</span>
                <span class="slds-page-header__title slds-truncate" title="Sarah White">Sarah White</span>
              </h1>
            </div>
            <div class="slds-page-header__name-meta">Contact · Acme Corp</div>
          </div>
        </div>
      </div>
    </div>
    <div class="slds-no-flex slds-grid slds-align-top">
      <div class="slds-page-header__controls">
        <div class="slds-page-header__control">
          <lightning-button-group>
            <lightning-button label="Edit" variant="neutral"></lightning-button>
            <lightning-button label="New Opportunity" variant="neutral"></lightning-button>
            <lightning-button-menu alternative-text="More Actions" variant="border-filled" menu-alignment="right">
              <lightning-menu-item label="Log a Call" value="log_call"></lightning-menu-item>
              <lightning-menu-item label="Delete" value="delete"></lightning-menu-item>
            </lightning-button-menu>
          </lightning-button-group>
        </div>
      </div>
    </div>
  </div>

  <!-- Row 2: summary field strip -->
  <div class="slds-page-header__row slds-page-header__row_gutters">
    <div class="slds-page-header__col-details">
      <ul class="slds-page-header__detail-row">
        <li class="slds-page-header__detail-block">
          <p class="slds-text-title slds-truncate" title="Account Name">Account Name</p>
          <p class="slds-truncate" title="Acme Corp">Acme Corp</p>
        </li>
        <li class="slds-page-header__detail-block">
          <p class="slds-text-title slds-truncate" title="Email">Email</p>
          <lightning-formatted-email value="sarah.white@acme.com"></lightning-formatted-email>
        </li>
        <li class="slds-page-header__detail-block">
          <p class="slds-text-title slds-truncate" title="Phone">Phone</p>
          <lightning-formatted-phone value="5555551234"></lightning-formatted-phone>
        </li>
      </ul>
    </div>
  </div>

</div>
```

```css
/* Page header sits above content — needs shadow-1 elevation */
.console-record .slds-page-header {
  box-shadow: var(--slds-g-shadow-1, 0 2px 2px rgba(0,0,0,0.10));
}
```

---

## Page body structure — zone containment rules

This is the most commonly broken part of the console record layout. Each zone owns its own padding — do not add padding at a parent level that a child zone already handles.

```
console-record                          ← no padding, full viewport
└── console-record__body                ← no padding (page header owns its own)
    └── slds-page-header                ← owns its own internal padding (slds-g-spacing-4)
    └── console-record__content         ← slds-var-p-horizontal_medium ONLY (no top/bottom)
        └── slds-grid slds-gutters      ← gap handles column spacing, no per-column margin
            ├── slds-col (main)         ← lightning-card, no outer margin
            │   └── lightning-card      ← NO padding wrapper on card body
            │       └── lightning-tabset
            │           └── lightning-tab
            │               └── div.slds-var-p-around_medium  ← tab panel owns its padding
            │                   └── content (inputs, grids, sections)
            └── slds-col (sidebar)      ← flex-col with gap, no per-card margin
                └── lightning-card      ← each card has its own slds-var-p-around_medium body wrapper
```

**The five rules that prevent console record spacing bugs:**

1. **Content column: horizontal padding only.** Use `slds-var-p-horizontal_medium` on the content column wrapper — never `slds-p-around_*` which adds top padding that fights the page header.

2. **No top padding on the body wrapper.** `slds-page-header` already supplies its own block-end padding. The content column below it gets no `slds-p-top_*`.

3. **Gap between cards, never per-card margin.** The sidebar column uses `display: flex; flex-direction: column; gap: var(--slds-g-spacing-4, 1rem)` — not `slds-m-bottom_*` on each card.

4. **`lightning-card` body slot: always a padding wrapper.** The card provides chrome (header, border, radius) but zero slot padding. Every `lightning-card` body needs `<div class="slds-var-p-around_medium">`.

5. **Tab panel content: padding wrapper inside the tab, not on the card.** Zero the default tab panel padding with `--slds-c-tab-panel-spacing-block-*: 0` on the card, then supply your own `slds-var-p-around_medium` wrapper inside each `lightning-tab` body.

**Canonical markup (copy this):**

```html
<!-- Content column — horizontal padding only, no top padding -->
<div class="slds-var-p-horizontal_medium console-record__content">
  <div class="slds-grid slds-gutters">

    <!-- Main column -->
    <div class="slds-col console-record__main">
      <lightning-card class="console-record__details-card">
        <!-- NO padding wrapper here — tabs own their padding -->
        <lightning-tabset>
          <lightning-tab label="Details" value="details">
            <div class="slds-var-p-around_medium">
              <!-- field grid, sections, inputs -->
            </div>
          </lightning-tab>
          <lightning-tab label="Related Lists" value="related">
            <div class="slds-var-p-around_medium">
              <!-- related list cards — each gets its own padding wrapper -->
              <lightning-card title="Cases">
                <div class="slds-var-p-around_medium">
                  <lightning-datatable ...></lightning-datatable>
                </div>
              </lightning-card>
            </div>
          </lightning-tab>
        </lightning-tabset>
      </lightning-card>
    </div>

    <!-- Sidebar column — gap between cards, not per-card margin -->
    <div class="slds-col console-record__sidebar">
      <div class="console-record__sidebar-stack">
        <!-- each card owns its own body padding -->
        <lightning-card title="Next Best Action" icon-name="standard:einstein_ai">
          <div class="slds-var-p-around_medium">
            <!-- content -->
          </div>
        </lightning-card>
        <lightning-card title="Activity">
          <div class="slds-var-p-around_medium">
            <!-- content -->
          </div>
        </lightning-card>
      </div>
    </div>

  </div>
</div>
```

```css
/* Sidebar stack — gap handles spacing, never slds-m-bottom_* per card */
.console-record__sidebar-stack {
  display: flex;
  flex-direction: column;
  gap: var(--slds-g-spacing-4, 1rem);
}
```

## SLDS hooks (confirmed in Figma source)

| Hook | Value | Use for |
|---|---|---|
| `--slds-g-color-surface-container-1` | `white` | Page and panel backgrounds |
| `--slds-g-color-border-1` | `#c9c9c9` | Borders between tabs, panels |
| `--slds-g-color-on-surface-2` | `#2e2e2e` | Body text |
| `--slds-g-color-on-surface-3` | `#03234d` | Headings, active state labels |
| `--slds-g-color-accent-2` | `#0250d9` | Active tab underline, selected state |

---

## Design rationale notes

These reflect Salesforce's first-party console navigation decisions. Use them as grounding defaults; follow requirements when they specify something different.

- **Console nav for simple pages** — console navigation adds tab management overhead (subtabs, pin/close, More overflow) that doesn't benefit single-record views or dashboards. Start with the simpler standard nav pattern and add console navigation only when the PRD describes simultaneous multi-record management.
- **Custom console tab bar CSS** — the `slds-context-bar` blueprint provides the correct visual structure, keyboard navigation, and ARIA semantics. Avoid building a tab bar from scratch; extend or compose with `slds-context-bar` unless a specific requirement cannot be met.
- **Full-page navigation for related records** — Salesforce's console pattern opens related records as subtabs to preserve the current record's context in the primary tab. This is a strong UX default; deviate only if requirements explicitly describe in-page or modal-based related record navigation.
- **More than ~5 primary tabs** — beyond ~5 tabs the tab bar becomes difficult to scan; a "More" overflow dropdown is the standard solution. Add overflow handling when the PRD describes a use case with many simultaneously open records.
