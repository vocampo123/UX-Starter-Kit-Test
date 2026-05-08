---
name: prd-to-salesforce-ui
description: "Build Salesforce UI from a PRD or verbal description when no design file is provided. Classifies the page archetype, reads the matching pattern doc, extracts structured content from the PRD, plans components, then implements. Use whenever a user describes what a page should do without providing a Figma link or screenshot."
---

# PRD to Salesforce UI Skill

Use this skill when the user provides a PRD, requirements document, or verbal description of a page **without a Figma link or design screenshot**.

## Priority hierarchy

Requirements and design guidance apply at different levels. When they conflict, use this order:

```
1. Explicit PRD / written requirements    → always wins
2. Pattern doc structural defaults        → fills gaps the PRD is silent about
3. Agent improvisation                    → last resort only
```

Pattern docs capture how Salesforce's own designers structured each archetype — zone proportions, LBC choices, SLDS hooks. Use them to ground layout decisions for anything the PRD does not specify. If a requirement explicitly calls for something different, follow the requirement and use the pattern doc for everything else.

---

## Step 1: Classify the page archetype

Read the PRD and identify the primary archetype using the trigger table below. If more than one applies, prefer the more specific one.

| PRD language | Archetype | Pattern doc |
|---|---|---|
| monitor, triage, alert, incident, dispatch, operational hub, real-time, watchtower | Command Center | `docs/ui-patterns/command-center.md` |
| dashboard, KPIs across objects, home page, executive summary, overview, recent activity | Dashboard | `docs/ui-patterns/dashboard.md` |
| record detail, view a contact/account/case/opportunity, single record, field-level data | Record Detail | `docs/ui-patterns/record-detail.md` |
| list, queue, recently viewed, all records, filtered view, object list | List View | `docs/ui-patterns/list-view.md` |
| console, multi-record workspace, service agent, simultaneous records, subtabs | Console Navigation | `docs/ui-patterns/console-navigation.md` |
| form, create record, edit record, input fields, data entry, field group | Forms | `docs/ui-patterns/forms.md` |

**Standard nav vs console nav rule:**
- Use **standard app navigation** (horizontal tab bar) for single-app experiences, dashboards, and record detail pages reached from a nav tab.
- Use **console navigation** (console tab bar + subtab row) when the PRD describes simultaneous multi-record management, a service agent tool, or a workspace where records open side by side.

---

## Step 1.5: Decide the runtime, then the hosting surface

### First: which runtime is the target?

| Runtime | Where code lives | What chrome exists |
|---|---|---|
| **Local prototype** (Vite, `localhost:3000`) | `src/modules/page/<name>/` | None — the prototype has no Salesforce platform. The page renders its own chrome. |
| **Org-deployed** (Salesforce, via SF CLI) | `force-app/main/default/lwc/<name>/` + FlexiPage | Platform-provided chrome (global header, nav, page header, utility bar) |
| **Both** | Component in `force-app/`, route wrapper in `src/modules/page/` | Local prototype shows full chrome; org deploys to a FlexiPage region |

If the runtime is local-only, **build the full anatomy described in the pattern doc** — the Platform vs LWC split below does not apply because there is no platform.

If the runtime is org-deployed (or both), continue to the hosting decision below.

### Then: decide the Salesforce hosting surface

**For org-deployed work, this step is non-negotiable.** Before writing any LWC, decide which Salesforce surface hosts the experience. The platform already provides chrome (page header, nav, app launcher, utility bar) for standard surfaces — duplicating that chrome inside an LWC is the most common mistake an agent makes.

| Archetype | Default hosting surface | LWC role |
|---|---|---|
| List View | Standard object tab + standard list view | Embedded enhancements only (side panels, related widgets). Do **not** rebuild the list page header or table. |
| Record Detail | Standard record page (FlexiPage `RecordPage` template) | LWCs placed in FlexiPage regions. Do **not** rebuild the record header or activity panel — the platform provides them. |
| Dashboard | Standard Home page or App Page (FlexiPage `HomePage` / `AppPage` template) | LWCs placed in FlexiPage regions as cards. The page itself is the FlexiPage; LWCs are content blocks. |
| Command Center | Custom App Page (FlexiPage `AppPage` template) | LWCs are the page content. The platform provides global header, app nav, and utility bar — do **not** rebuild those. |
| Console Navigation | Standard Lightning console app (CustomApplication with `uiType="Lightning"` and `navType="Console"`) | LWCs placed in record page regions and utility bar. The console tab bar and subtab bar are platform-provided. |

### The "never duplicate platform chrome" rule

If your LWC will be hosted on a **Custom Tab, App Page, Record Page, or Home Page**, the platform provides:

- Global header (search, notifications, app launcher, user menu)
- App navigation tab bar
- Standard list view header (for object list views)
- Record header with title, breadcrumb, and primary actions (for record pages)
- Utility bar at the bottom

**Do not** render `slds-page-header`, app nav, or utility bar markup at the root of an LWC hosted on these surfaces. The pattern docs describe the *anatomy of the full experience* — most of that anatomy is already provided by the host surface.

### Hosting decision output

Before moving to Step 2, write down:

```
Hosting surface: [Custom Tab / Standard Object Tab / App Page / Record Page / Home Page / Console App]
FlexiPage template: [HomePage / AppPage / RecordPage / none]
LWC role: [full content / embedded region / utility item]
Platform-provided chrome on this surface: [list]
LWC-implemented chrome (if any): [list, with justification]
```

---

## Step 2: Read the matching pattern doc

Read the full content of the matched `docs/ui-patterns/*.md` file before writing any code. The pattern doc provides structural defaults for anything the PRD does not specify:
- Chrome layers in order (outer → inner)
- **Platform vs LWC split** — which layers Salesforce provides vs which you build (cross-check this against your Step 1.5 hosting decision)
- Zone widths and proportions from Figma (use as starting point; PRD layout requirements take precedence)
- Recommended LBC per zone (strong guidance — LBC choices are also SLDS compliance decisions)
- Confirmed SLDS hooks (authoritative — these don't vary by use case)
- Common states (loading, empty, error, unsaved)
- Design rationale notes explaining why patterns exist (so you can make informed decisions when deviating)

The pattern doc describes the *full visual anatomy* of the archetype. Your LWC implements only the LWC-side layers from the platform vs LWC split — never the platform-provided ones.

---

## Step 3: Extract from the PRD

Pull these structured elements from the PRD before writing any code:

| Element | What to extract |
|---|---|
| **User role** | Who uses this page? (exec, manager, agent, customer) |
| **Primary task** | What is the single most important action? |
| **Entities** | What Salesforce objects or data types appear? (Account, Case, Alert, Metric) |
| **Actions** | What can the user do? (view, edit, triage, escalate, approve) |
| **Status model** | What states do records move through? (Open/In Progress/Closed, stage names) |
| **Metrics** | What numbers, KPIs, or counts are displayed? |
| **Time horizon** | Real-time, daily, weekly, historical? |
| **Navigation context** | Is this one page, or does it open sub-records? |

---

## Step 4: Draft the page IA before writing code

Write a short component plan in your response before creating files:

```
Page: [name]
Archetype: [archetype]
Nav: [standard / console]
Zones:
  - [zone name]: [LBC / component]
  - ...
Data bindings:
  - [field] → [source]
States needed: loading, empty, [others from PRD]
```

---

## Step 4.5: Scaffold-clean the starter shell

**This step is critical when building a new demo or prototype** (not when contributing to the starter kit itself). The starter ships with placeholder content — app name "Salesforce UI Starter Kit", demo routes (Icons, User /42, Contacts), and a generic welcome page. **Replace this content** so the prototype reads as the user's app, not "starter kit + their page added on."

If the user is building a new demo/prototype, do the following before adding new content:

1. **Rename the app** in `src/modules/shell/globalNavigation/globalNavigation.html` — replace "Salesforce UI Starter Kit" with the demo's actual app name.
2. **Remove starter demo routes** in `src/routes.config.js` — delete the `/icons`, `/users/:id`, `/contacts`, `/contacts/:id` routes. Keep only `/` (which you'll repurpose) and any new routes needed.
3. **Replace the home page** — either:
   - Repoint `/` to the new home component for the demo, **or**
   - Replace the contents of `src/modules/ui/homeIntro/homeIntro.html` with the demo's home content
4. **Update the document title** in `index.html` if the user wants the browser tab to reflect the demo name.
5. **Remove unused starter components** from `src/modules/page/` (`pageHome`, `pageIconTest`, `pageUser`, `pageContacts`, `pageContactDetail`) once they're no longer routed.

**Skip this step only when:**
- The user is contributing to the starter kit itself
- The user explicitly says they want the starter content preserved
- The user is building a small example to be added alongside the existing demo content

When in doubt, ask the user: "Should I replace the starter kit branding and demo routes, or keep them?"

---

## Step 5: Implement

### Mandatory pre-implementation self-check

Before writing your first line of code, write this list in your response:

```
LBC plan: [every Lightning Base Component you will use]
Custom HTML: [any non-LBC HTML element you will write, with reason]
SLDS utility classes: [classes from lightningdesignsystem.com/utilities]
SLDS hooks: [--slds-g-* hooks you will use]
Custom CSS rules: [each rule + why no LBC/utility/hook covers it]
```

If "Custom HTML" or "Custom CSS rules" has more than 1-2 entries, **stop and re-check**. You are likely re-implementing something an LBC, utility, or hook already provides. The Critical Rules in `AGENTS.md` list the most common LBC mappings.

### Implementation locations

- Route-level pages: `src/modules/page/<name>/`
- Reusable building blocks: `src/modules/ui/<name>/` (local-only) or `force-app/main/default/lwc/<name>/` (deployable)
- Register new pages in `src/routes.config.js` and `src/modules/shell/app/app.js`

### Hard constraints

- **Use LBC** for buttons, inputs, tables, cards, tabs, accordions, icons, modals, spinners, avatars, tiles, paths. See the LBC mapping table in `AGENTS.md` Critical Rules.
- **Use SLDS utility classes** (`slds-grid`, `slds-p-around_medium`, `slds-text-align_center`, etc.) before writing custom layout CSS.
- **Use SLDS hooks** (`--slds-g-*`) from the pattern doc for any custom CSS; always include a fallback value: `color: var(--slds-g-color-on-surface-2, #2e2e2e);`
- **Never** use `!important`, inline `style="..."`, or hardcoded hex colors when a hook exists.
- **Read `.agent/skills/afv-library/applying-slds/SKILL.md`** before writing CSS.

---

## Step 6: Validate

After implementing, run the SLDS linter on every changed `.html` and `.css` file:

```bash
npx @salesforce-ux/slds-linter@latest lint <path-to-changed-file>
```

Fix reported issues before considering the task complete.

---

## Quick-reference: component decision order

For every UI element, check in this order:

1. Does a `lightning-*` LBC exist? → Use it.
2. Does an SLDS blueprint exist? → Create a new LWC implementing the blueprint.
3. Does an SLDS utility class cover the styling? → Use it.
4. Does an `--slds-g-*` hook exist for the CSS property? → Use it with a fallback.
5. Only then: use a hardcoded CSS value.

---

## Design rationale notes

These are defaults grounded in Salesforce's first-party design decisions. Deviate when requirements justify it.

- **Full-width tables inside card columns** — avoid by default; they overwhelm a card-based layout. Use compact `lightning-datatable` (3–4 columns, no checkboxes) inside cards, or move the table to its own full-width zone if the PRD calls for it.
- **Nested `lightning-card`** — Salesforce's pattern docs never nest cards; the visual hierarchy gets confusing. If requirements call for a card-within-card, consider a `lightning-accordion-section` or a flat section heading instead.
- **Raw form inputs** — use LBC form elements (`lightning-input`, `lightning-combobox`, etc.) by default; they include accessibility and SLDS styling for free. Only use raw HTML inputs if an LBC cannot meet a specific requirement.
- **Raw modal markup** — extend `LightningModal` by default; it handles focus trapping, accessibility, and SLDS 2 theming. Only use raw `slds-modal` blueprint when `LightningModal` cannot support a specific requirement.
- **Invented zone widths** — start from the pattern doc proportions; they reflect tested information hierarchy decisions. Change them when the PRD specifies a different layout.
- **Decorative charts** — every metric or chart should answer "what should the user do next?" If a chart is purely decorative, question whether it belongs on the page. This is a design intent note, not a hard rule.
- **Command center vs dashboard** — command centers are for operational response; dashboards are for read-oriented summaries. Use the simpler pattern when the PRD does not require live triage or an alert queue.
