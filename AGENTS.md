# Agent guidelines: Design System 2 Org Starter

This repository is a **prototype-to-org starter kit** for Salesforce UI work. It preserves the original local SLDS 2 + LWC demo starter patterns, then adds a Salesforce DX `force-app/` layer so selected components can be deployed to a Salesforce org.

The repo has two runtimes:

- **Local prototype runtime**: `src/` runs in Vite at `http://localhost:3000`.
- **Salesforce org runtime**: `force-app/` deploys through SF CLI.

Treat this as a starter template. Keep examples useful but generic; do not add domain-specific demo apps unless the user explicitly asks.

---

## Critical rules (read before writing any UI)

These are non-negotiable. Pages that violate them will not look like Salesforce, will not pass the SLDS linter, and will not be acceptable handoff artifacts.

### Rule 1 — Lightning Base Components before custom HTML

**Before writing any HTML element, check whether a Lightning Base Component exists for it.**

| If you need... | Use... | Never use... |
|---|---|---|
| A button | `<lightning-button>`, `<lightning-button-icon>`, `<lightning-button-menu>` | `<button>`, `<a class="custom-btn">` |
| Any form input | `<lightning-input>`, `<lightning-textarea>`, `<lightning-combobox>`, `<lightning-radio-group>`, `<lightning-checkbox-group>`, `<lightning-dual-listbox>` | `<input>`, `<select>`, `<textarea>` |
| A data table | `<lightning-datatable>` | `<table>` with custom CSS |
| A card | `<lightning-card>` | `<div class="card">` with custom CSS |
| A tab strip | `<lightning-tabset>` + `<lightning-tab>` | `<ul class="tabs">` |
| An accordion | `<lightning-accordion>` + `<lightning-accordion-section>` | `<details>` or custom collapse |
| An icon | `<lightning-icon>` | inline SVG, custom `<i>`, font-icon class |
| A modal | extend `lightning/modal` | custom `<div class="modal-backdrop">` |
| A spinner | `<lightning-spinner>` | custom CSS spinner |
| An avatar | `<lightning-avatar>` | `<img class="avatar">` |
| A tile | `<lightning-tile>` | custom card markup |
| A path / progress | `<lightning-path>` or `<lightning-progress-indicator>` | custom step markup |
| **A page header** | `<c-page-header>` (org) / `<ui-page-header>` (local) — see `docs/ui-patterns/page-header.md` | raw `slds-page-header` blueprint, `<header>`, custom title bar |

The full LBC catalog: https://developer.salesforce.com/docs/component-library/overview/components

### Rule 2 — SLDS hooks and utility classes before custom CSS

**Before writing a single CSS rule, check whether SLDS already provides it.**

1. **Is it spacing, sizing, or layout?** Use SLDS utility classes: `slds-p-around_medium`, `slds-var-p-around_medium` (density-aware), `slds-grid`, `slds-wrap`, `slds-gutters_*`, `slds-text-align_center`, `slds-truncate`. **For spacing specifically — read `docs/spacing-rules.md`** before writing any layout markup. It covers the `<lightning-card>` body wrapper trap, density-aware vs. fixed classes, tab-panel double-padding, `pull-to-boundary` pitfalls, and which scale band to pick. Skipping this doc is the #1 reason designers re-prompt to "fix the gaps."
2. **Is it color, typography, border, or shadow?** Use an SLDS Global Styling Hook with a fallback: `color: var(--slds-g-color-on-surface-2, #2e2e2e);`. Never hardcode hex colors when a hook exists.
3. **Is it a blueprint pattern?** Use the SLDS blueprint class: `slds-page-header`, `slds-form`, `slds-modal`.

**Custom CSS is a last resort.** Allowed only when the property is component-specific layout that no utility, hook, or blueprint covers. When you do write it, never use:
- `!important`
- Inline `style="..."` attributes
- Hardcoded hex values when a `--slds-g-*` hook exists

### Required pre-build check — do not skip

Before writing any HTML or CSS, complete this lookup. This is a gate, not a formality. Do not write code until each line is resolved.

```
LBC plan: [every <lightning-*> you will use — consult the LBC table above and https://developer.salesforce.com/docs/component-library/overview/components]
Custom HTML elements: [ONLY if no LBC exists — name the LBC you ruled out and the specific reason it cannot be used]
SLDS utilities: [utility classes you will use]
SLDS hooks: [--slds-g-* hooks you will use]
Custom CSS rules: [ONLY page layout, spacing between regions, or outer container boundaries — nothing else]
```

**Custom HTML and Custom CSS must be empty or near-zero. They are not fallbacks.**

- If "Custom HTML elements" has any entry, name the LBC you considered and the exact reason it cannot cover this need. "I need more control" is not a valid reason.
- If "Custom CSS rules" describes anything other than page layout, region spacing, or outer container boundaries — stop. You are patching an LBC instead of using it correctly.
- A long Custom HTML or Custom CSS list means the wrong approach is being taken, not that custom code is justified.

### Icon category decision guide

Always use `<lightning-icon icon-name="category:symbol">`. Never use inline SVG, `<img>`, or font icons.

| Category | Use for | Rule of thumb |
|----------|---------|---------------|
| `utility:` | UI controls — search, filter, settings, chevrons, close | It's a UI concept, not a Salesforce object |
| `standard:` | Salesforce objects — Account, Contact, Case, Opportunity | It's a noun/record type |
| `action:` | Task verbs — save, delete, edit, add (mobile action bar) | Text could start with "Do…" |
| `doctype:` | File formats — PDF, Word, Excel | It's a file type |
| `custom:` | Custom objects when no `standard:` fits | Custom object placeholder |

Three rules that prevent the most common icon mistakes:
1. **`standard:` icons must keep their circle background** — `<lightning-icon>` applies it automatically; never strip it with CSS
2. **`utility:` color inherits from adjacent text** — never hardcode fill color
3. **Always set `alternative-text` and `title`** — describe purpose not appearance (`"Upload file"` not `"paperclip"`); use `alternative-text=""` + `aria-hidden="true"` for purely decorative icons

Sizes: `xx-small` → `x-small` → `small` (default utility) → `medium` (default object) → `large` (hero only)

### Required reading

For any UI work — markup, CSS, layout, icons, LBC choice — **read `.agent/skills/afv-library/applying-slds/SKILL.md` first**, before writing code. Do not improvise SLDS from memory.

---

## First response behavior

On the first user message in this repo, if the user has not given a specific task, greet them briefly and ask:

> Would you like guided setup for this starter kit, or do you want to jump straight into building?

If the user gives a specific task, do not interrupt with onboarding. Help with that task directly and offer setup guidance only if it becomes relevant.

---

## Optional guided setup

When a user first opens this repo, asks how to begin, or seems unfamiliar with vibe coding or Salesforce org deployment, do not assume they want a guided setup. Ask first:

> Would you like help setting up and using this starter kit, or do you want to jump straight into building?

If the user says they do not need setup help:

- Let them proceed however they like.
- Answer their specific request directly.
- Do not run this guided flow unless they ask for it later.

If the user says they want setup help, guide them through this flow:

1. **Explain what the repo can do.** Tell them this starter supports local Salesforce-style prototyping with Vite, LWC, SLDS 2, Lightning Base Components, and synthetic shadow, plus org deployment for reusable components under `force-app/`.
2. **Ask their goal.** Ask whether they want a local prototype, deployable Salesforce components, or both.
3. **Confirm local setup.** Ask whether they have Node.js 20 or later and whether they want to run the app locally. Use `npm install`, `npm run dev`, and `http://localhost:3000` when they are ready.
4. **Ask about org readiness.** Ask whether they already have a Salesforce org ready, what type of org it is, what org URL they have, and what alias they want to use.
5. **Help with authentication if needed.** If they are not authenticated, detect the login host from the org URL, confirm it with the user, then guide them through `sf org login web --instance-url <login-host> -a <org-alias>`. Explain that it opens a browser to log in to Salesforce.
6. **Ask what they want to build.** Ask for the app idea, users, problem to solve, and whether they have a PRD, screenshot, Figma file, notes, or requirements.
7. **Choose the right code location.** Use `force-app/main/default/lwc/` for deployable components, `src/modules/page/` for local-only pages, `src/modules/shell/` for app chrome, and `src/modules/data/` for local fixture data.
8. **Summarize before coding.** Tell the user what will be built, which files will change, whether it is local-only or deployable, and how it will be verified.
9. **Verify the work.** Run `npm run check` after changes. If deploying to an org, validate first with `npm run deploy:org:check -- -o <org-alias>`.

Keep this flow conversational and beginner-friendly. Explain technical terms briefly, for example "deploy (send the component to your Salesforce org)".

### Saving project artifacts for persistence

When a user provides any project artifact — PRD, requirements doc, screenshot, UX reference, fit-gap analysis, or concept mock — **save it to `docs/prd/` before processing it**. Do not rely on chat memory alone.

| Artifact type | Save as |
|---|---|
| PRD or requirements doc (text/markdown) | `docs/prd/<descriptive-name>.md` |
| PRD or requirements doc (PDF) | `docs/prd/<descriptive-name>.pdf` |
| Screenshot or UX reference image | `docs/prd/<NN>-<descriptive-name>.png` (numeric prefix orders by flow) |
| Fit-gap or org analysis | `docs/prd/fit-gap-<domain>.md` |
| Concept mocks or directional UX | `docs/prd/concepts/<descriptive-name>.png` |

After saving, create or update `docs/prd/README.md` to:
1. List every artifact with a one-line description
2. Summarize what the PRD covers (personas, in-scope, out-of-scope)
3. Maintain a build state table mapping PRD areas → repo surfaces → current status
4. Include a "How to use this folder" note

**`docs/prd/README.md` is the persistent source of truth for the project.** Every new session must read it before building anything in the project domain. Do not rebuild from chat memory — start from the README. Update the build state table when something ships. Replace files in place when the PRD changes — do not add versioned copies.

If `docs/prd/README.md` already exists when the user provides a new artifact, update it rather than creating a new one.

### PRD-to-prototype intake

When the user provides a PRD, requirements document, screenshot, Figma file, or written app idea — **read `.agent/skills/prd-to-salesforce-ui/SKILL.md` first**. It covers archetype classification, hosting surface decisions, and the full implementation workflow including a mandatory self-check before writing code. Do not jump into code without going through it.

The legacy inline intake below is kept for reference, but the skill is the authoritative source:

1. Summarize the product goal in plain language.
2. Identify the primary users, jobs to be done, core objects/data, pages, workflows, and acceptance criteria.
3. Identify UI states that matter for handoff accuracy: loading, empty, populated, error, read-only/permission-limited, and mobile/responsive states when relevant.
4. Ask whether the desired output is local-only, deployable to a Salesforce org, or both.
5. Decide file placement before coding:
   - `force-app/main/default/lwc/` for deployable reusable components
   - `src/modules/page/` for local-only route pages
   - `src/modules/shell/` for app chrome
   - `src/modules/data/` for local prototype fixtures
6. Produce a short plan that names the pages/components, the expected routes, which pieces are deployable, what assumptions are being made, and how the work will be verified.

Treat the prototype as a design and engineering handoff artifact. It should communicate intended Salesforce UI behavior clearly enough for an engineer to continue from it.

### PRD + org fit-gap rule

If the user provides requirements and a target Salesforce org, do not assume the answer is to build net-new functionality.

Before implementation, ask permission to inspect the org and perform a fit-gap analysis:

1. Map each major requirement to likely Salesforce standard, industry cloud, or existing org capabilities.
2. Use the org-discovery skill (`.agent/skills/org-discovery/SKILL.md`) when an org alias is available.
3. Look for reusable apps, objects, fields, Lightning Web Components, Aura components, FlexiPages, flows, permission sets, tabs, Apex classes, and static resources.
4. Recommend one of: reuse existing capability, configure existing capability, extend existing metadata, or build net-new.
5. Confirm the approach with the user before changing source files or retrieving selected metadata.

For industry cloud orgs such as Nonprofit Cloud, Education Cloud, Financial Services Cloud, Health Cloud, or Public Sector, assume the org may already include domain objects, pages, flows, permissions, and app patterns. Prefer reuse, configuration, or extension before creating parallel custom functionality.

### Salesforce auth URL rules

When helping a user authenticate to a Salesforce org, ask for the org URL they have and derive the login host conservatively. SF CLI auth needs a login host / instance URL, not a Lightning runtime URL, app URL, Setup URL, or Experience Cloud site URL.

Use **detect and confirm**:

1. Parse the user-provided URL.
2. Strip paths, query strings, and hashes.
3. Propose the detected login host.
4. Ask for confirmation before running auth.

Valid login host patterns:

- Production or standard My Domain: `https://<my-domain>.my.salesforce.com`
- Sandbox My Domain: `https://<my-domain>--<sandbox-name>.sandbox.my.salesforce.com`
- Scratch org, org farm, or internal test domain: `https://<org-host>.my.<domain>.salesforce.com`
- Generic production login: `https://login.salesforce.com`
- Generic sandbox login: `https://test.salesforce.com`

Org farm example:

```text
https://orgfarm-5b03f27a9b.test1.my.pc-rnd.salesforce.com
```

If the user provides a URL that already contains `.my.` and ends with `.salesforce.com`, usually keep that host exactly and strip only the path/query/hash. Do not convert org farm or internal test domains to `login.salesforce.com`.

Avoid these as auth targets:

- Lightning runtime URLs: `https://<org-host>.lightning.force.com/...`
- Setup/app paths: `https://<host>/lightning/setup/...`
- Experience Cloud / site URLs: `https://<site-domain>.my.site.com/...`, `https://<site-domain>.force.com/...`

If the user provides a Lightning runtime URL on a standard My Domain, propose converting:

```text
https://example.lightning.force.com/lightning/page/home
```

to:

```text
https://example.my.salesforce.com
```

If the URL is a site/community URL, a generic `force.com` URL, or anything ambiguous, ask the user for the My Domain login host instead of guessing.

Preferred auth command:

```bash
sf org login web --instance-url <login-host> -a <org-alias>
```

If browser auth is blocked, loops, or fails to complete, first verify the login host is correct. For blocked browser environments, offer device login as a fallback:

```bash
sf org login device --instance-url <login-host> -a <org-alias>
```

---

## Required first step for all UI work

**Before writing any markup, CSS, or component structure — for local prototypes or org deployment — read `.agent/skills/afv-library/applying-slds/SKILL.md`.**

This is not optional and does not depend on the task type or target environment. Do not build UI from general knowledge or memory. The skill contains the search scripts, component selection hierarchy, hook naming rules, and validation checklist that must guide every UI task.

The local prototype in `src/modules/` is a Salesforce UI handoff artifact. It must use the same LBCs, SLDS blueprints, utility classes, and styling hooks as production org code. A prototype built with raw HTML, custom CSS classes, or hardcoded values does not accurately represent the Salesforce experience and fails its purpose.

---

## Project-specific guidance

### Where to put code

- **Deployable reusable components**: `force-app/main/default/lwc/<name>/` → tag `<c-name>`, import as `c/name`. Use this for components intended to deploy to a Salesforce org.
- **Route-level local views**: `src/modules/page/<name>/` → tag `page-<name>`. Add a route in `src/routes.config.js`, then import and register the component in `src/modules/shell/app/app.js` (`ROUTE_COMPONENTS`). The router picks up new routes automatically; `src/router.js` does not need editing.
- **Reusable local-only UI**: `src/modules/ui/<name>/` → tag `ui-<name>`. Use inside pages or other components when it should not deploy to the org.
- **App shell**: `src/modules/shell/<name>/` → tag `shell-*`. Root app, layout, header, nav, theme, not route views (`page-*`) and not generic reusable widgets (`ui-*`).
- **Local data/fixtures**: `src/modules/data/<name>/` → import as `data/<name>`. Keep this local-only.
- **Do not** add components under `src/build/lightning-icon/shims/` except the checked-in icon overrides, or under `src/modules/lightning/`.

**Demo vs. showcase:** The existing routes in `src/routes.config.js` (Home, Icons, Contacts, Console Record) are starter kit examples. When building a demo, **replace** them — do not add demo routes alongside them. A demo is a standalone experience, not a tab added to the showcase nav.

Every component in `force-app/main/default/lwc/` must include a `.js-meta.xml` file. Use `isExposed=true` and targets only for components that should appear in App Builder. Use `isExposed=false` for internal helper components such as modals.

### Local and org behavior

- Vite resolves both `src/modules/` and `force-app/main/default/lwc/`.
- Deployable components can be rendered locally as `<c-name>`.
- Imperative imports from deployable components use `import Thing from 'c/thing'`.
- Only `force-app/` deploys to Salesforce. `.forceignore` excludes local prototype files such as `src/`, `public/`, `scripts/`, `vite-plugins/`, and `dist/`.
- **RecordPage activation gotcha:** deploying a `RecordPage` FlexiPage does not make it the active page. Salesforce resolves the active record page through three layers in order: (1) app + profile + record type override, (2) app default override, (3) object-level org default. If a user opens a record inside a Lightning app that has its own app-level override, the object-level override is silently ignored and the new page never renders. Always deploy the override at the correct layer and verify the page renders in the target app. Full triage and metadata examples in `.agent/skills/salesforce-deploy/SKILL.md` → section 8.

### SLDS linter

After you change any `.html` or `.css` file, run the SLDS linter on each file you touched before considering the task complete:

```bash
npx @salesforce-ux/slds-linter@latest lint <path-to-changed-file>
```

Fix reported issues where possible. If something cannot be fixed, say so briefly.

For a full repo verification pass, run:

```bash
npm run check
```

### Engineering habits

- For UI work, **read `.agent/skills/afv-library/applying-slds/SKILL.md` first** — this is the required first step, not a suggestion (see the "Required first step" section above).
- Never build UI with raw HTML elements, generic CSS classes, or hardcoded values when an LBC, blueprint, utility class, or styling hook covers the need — this applies to local prototypes and org components equally.
- Prefer small, single-responsibility LWCs and readable structure.
- For requirements-driven UI, build Salesforce-shaped experiences: record home pages, list views, related lists, app/home pages, modals, forms, empty states, and notifications where appropriate.
- Include realistic handoff states where relevant: loading, empty, populated, error, validation, read-only, and permission-limited.
- Do not use `!important`.
- Do not use inline `style` attributes; use utility classes or the component’s CSS file as appropriate.
- Keep the starter generic. If the user asks for a richer demo, consider documenting it as an optional example rather than baking it into the default app.

### Lightning App Builder page decomposition

When building a page that will be deployed to a Salesforce org via Lightning App Builder, **never implement the entire page as a single monolithic LWC**. App Builder pages are composed of independently-droppable components — one LWC per independently useful UI element.

**The unit of decomposition is the individual UI element, not the column.**

The most common mistake is decomposing to the column level — one LWC per column — instead of the component level. A column that contains a KPI strip, a datatable, and an action panel needs three separate LWCs placed into that column, not one LWC rendering all three.

**Decision test:** could a user in App Builder reasonably want to remove, reorder, or replace this piece independently? If yes, it is its own LWC with `isExposed=true`.

| Wrong (column-level) | Correct (component-level) |
|---|---|
| `commandCenterLeftRail` renders alerts + filters + tabs | `commandCenterAlertList`, `commandCenterAlertFilters`, `commandCenterAlertTabs` — three separate LWCs |
| `memberRecordSidebar` renders next best action + activity | `memberNextBestAction`, `memberActivityTimeline` — two separate LWCs |

Before writing any code for an App Builder page:

1. List every distinct UI element on the page. Each one that could be independently removed or reconfigured is a separate LWC.
2. Name each with a shared prefix: `commandCenterKpiStrip`, `commandCenterAlertList`, `commandCenterMemberTable`, etc.
3. Mark each placed component `isExposed=true` with appropriate `<targets>`. Mark child/helper components `isExposed=false`.
4. Generate or update the flexipage XML in `force-app/main/default/flexipages/` placing each LWC into its region. Multiple LWCs can be stacked in the same column region.
5. In local dev, compose the same components inside a `src/modules/page/<name>/` wrapper mirroring the flexipage layout.

This applies to App Pages, Home Pages, and Record Pages.

### Cross-region alignment — FlexiPage template owns it, not the LWC

Each section LWC owns only its internal content. It must not attempt to align itself with components in adjacent columns or other regions.

**Never put these inside a section LWC:**
- `padding-top`, `margin-top`, or spacer divs added to match the height of a neighbouring component
- `min-height` or fixed `height` set to align with another region
- `slds-grid` or CSS grid that spans multiple FlexiPage regions

**If cross-column or cross-row alignment is required**, it belongs in the FlexiPage template or a custom page template (`lightningcomponentbundle` with `type="flexipage"` using CSS grid for exact row/column layout). Define named semantic regions (`alerts`, `header`, `primaryContent`, `watchlist`) and place one wrapper LWC per region. The template defines alignment; the LWC defines content.

Solving alignment with component-local CSS creates invisible dependencies between components that break when any one of them is repositioned or removed in App Builder.

### Modals

Extend `lightning/modal`, following `force-app/main/default/lwc/demoModal/` as the reference (header, body, footer slots; open via `MyModal.open({ size, label })`). Do not build modals from raw `slds-modal` markup.

### Forms

Use Lightning Base Component form elements (`lightning-input`, `lightning-combobox`, `lightning-radio-group`, `lightning-textarea`, `lightning-select`) for all form inputs. Do not use raw `<input>`, `<select>`, or `<textarea>`. Use correct input `type` (e.g., `type="email"`) and `read-only` mode for data display.

### SLDS Agent Skills

SLDS skills live under **`.agent/skills/`**. The **`afv-library/`** subfolder is synced from `forcedotcom/afv-library` on `npm install` (refresh with `npm run skills:sync`).

- **For UI work** (markup, CSS, layout, icons, LBC vs blueprint), **read and follow `.agent/skills/afv-library/applying-slds/SKILL.md` first**. Do not improvise SLDS from memory when a skill exists. Re-read it when you iterate on presentation.
- **`uplifting-components-to-slds2`** — SLDS 1→2 / linter-driven uplift only.
- **`validating-slds`** — audit or scorecard requests only.

| Skill | `SKILL.md` | When to use |
|-------|------------|-------------|
| applying-slds | `.agent/skills/afv-library/applying-slds/SKILL.md` | Default for SLDS-backed UI: blueprints, hooks, utilities, icons, LBC choice. |
| uplifting-components-to-slds2 | `.agent/skills/afv-library/uplifting-components-to-slds2/SKILL.md` | Migration and fixes from SLDS 1 to 2; linter violations and hook/token replacements. |
| validating-slds | `.agent/skills/afv-library/validating-slds/SKILL.md` | Compliance audit or scored quality report, not for implementing or fixing UI. |
| prd-to-salesforce-ui | `.agent/skills/prd-to-salesforce-ui/SKILL.md` | Build Salesforce UI from a PRD or verbal description with no design file. Classifies archetype, decides hosting surface, reads pattern doc, runs self-check, then implements. Use whenever a user describes a page without a Figma link or screenshot. |
| org-discovery | `.agent/skills/org-discovery/SKILL.md` | Fit-gap discovery against a target Salesforce org before building deployable functionality. |
| salesforce-deploy | `.agent/skills/salesforce-deploy/SKILL.md` | Salesforce org auth, validation, deployment, and deploy failure troubleshooting. |
| repo-setup | `.agent/skills/repo-setup/SKILL.md` | Set up a GitHub repo: detects host from origin remote, prerequisites, repo creation, initial push. Use when the user mentions saving or backing up their work. |
| first-time-deploy | `.agent/skills/first-time-deploy/SKILL.md` | Publish to GitHub Pages. Repeat deploys: just `npm run deploy`. First time: runs repo-setup, then deploys and configures Pages. Use when the user asks about deploying or sharing a link with a PM, stakeholder, etc. |

Available pattern docs (read the matching one whenever the prd-to-salesforce-ui skill is invoked):

| Pattern | File | Use when |
|---|---|---|
| Command Center | `docs/ui-patterns/command-center.md` | Operational monitoring, alert triage, incident response, role-based workspace |
| Dashboard | `docs/ui-patterns/dashboard.md` | KPI overview, home page, executive summary, recent activity across objects |
| Record Detail | `docs/ui-patterns/record-detail.md` | Single record view with fields, activity timeline, related lists |
| List View | `docs/ui-patterns/list-view.md` | Object list, filtered queue, recently viewed, sortable data table |
| Console Navigation | `docs/ui-patterns/console-navigation.md` | Multi-record workspace, service agent tool, simultaneous record management |
| Forms | `docs/ui-patterns/forms.md` | Any page with input fields, data entry, create/edit record flows |

**SLDS 2 token reference** — `docs/slds2-tokens-reference.md`: complete spacing scale, sizing scale, border-radius table, border-width table, typography scale, color hook families, icon category rules, and CSS-property-to-hook mapping. Read this when picking any `--slds-g-*` hook or checking which border-radius, spacing, or sizing token applies.

**Spacing rules** — `docs/spacing-rules.md`: the seven rules and canonical patterns that prevent the most common spacing bugs (`<lightning-card>` body wrapper, vertical rhythm via `gap`, tab-panel double padding, density-aware utilities, `pull-to-boundary` traps, page-header adjacency, customizing LBC internals). **Read this before any layout markup or CSS work.** It also contains a pre-flight checklist to walk through before declaring UI work complete.

### LWC troubleshooting

Use the **Salesforce DX MCP** selectively ONLY for **LWC framework and Salesforce-platform** issues (`@api`, `@wire`, lifecycle, events, org-only behavior).

### Three deployment surfaces

Before building anything deployable, establish which surface the work targets — it determines the entire implementation path.

| Surface | Org type | Data | What to build |
|---------|----------|------|---------------|
| **Local prototype** | None — Vite only | JS fixtures in `src/modules/data/` | LBC/SLDS UI only, no wiring |
| **Front-end org** | Evergreen, sandbox, scratch org without cloud perms | None — UI shell only | LBC/SLDS UI only, no wiring |
| **Enabled org** | Sandbox or production with cloud/object permissions | Live Salesforce data | LBC/SLDS UI + data wiring decisions |

**Always ask before building a deployable component:**

> Is this deployment front-end only (UI shell, no live data), or will it connect to real org data?

- **Front-end only** — build the UI, use hardcoded or empty states for data, no `@wire` or Apex needed
- **Enabled org with live data** — do not choose a wire adapter or write Apex from memory; invoke the `prd-to-salesforce-ui` skill first; the correct approach depends on object type, query complexity, and page context

### Salesforce org deployment

- For auth, validation, deployment, or deploy troubleshooting, use `.agent/skills/salesforce-deploy/SKILL.md`.
- Validate deployable metadata with `npm run deploy:org:check -- -o <org-alias>`.
- Deploy metadata with `npm run deploy:org -- -o <org-alias>`.
- These commands deploy `force-app/` only.
- When creating a new Lightning app, include visibility metadata before calling the work done: a permission set with application visibility for the new app and tab visibility for its tab, assigned to the target user after approval.
- After deploying a new Lightning app, verify it appears for the authenticated user with an `AppDefinition` query. Deploy success alone is not enough because app and tab visibility are profile/permission-set controlled.
- Do not assume the starter creates a complete production Salesforce custom app. A real app may still need tabs, applications, permission sets, objects, record pages, or other metadata depending on the use case.

### Handoff quality bar

Before declaring a prototype complete, provide a concise handoff summary:

- What was built and which routes/pages/components are involved
- Which components are deployable under `force-app/` versus local-only under `src/`
- Which SLDS/LWC patterns were used
- Which requirements are covered and which assumptions remain
- What engineering would still need for production, such as data wiring, permissions, Apex, validation, object model changes, or additional metadata
- Verification performed, including `npm run check` and org validation when applicable

### Deployment (GitHub Pages)

- **Only path:** **`npm run deploy`** runs **`build:gh-pages`** (hash routing for static hosting), then pushes **`dist/`** to **`gh-pages`** on **`origin`**. Default **`npm run build`** / **`npm run dev`** keep path-based routing. GitHub Pages **Source** must be **Deploy from a branch** → **`gh-pages`** (see README).
- For another push target, `gh-pages` accepts **`-o <remote>`** or **`-r <url>`**; mention when the user asks.
