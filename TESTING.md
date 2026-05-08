# Testing the agent against your use case

This guide is for teammates who clone the repo and want to test how well the AI agent (Cursor, Claude, etc.) can turn a UI requirement into a working Salesforce LWC prototype.

The repo is configured to give the agent strong guidance: `AGENTS.md` is loaded automatically, pattern docs in `docs/ui-patterns/` cover the most common archetypes, and the `.agent/skills/prd-to-salesforce-ui/` skill walks the agent through a structured workflow.

## 60-second setup

```bash
git clone <this-repo>
cd salesforce-ux-starter-kit
npm install
npm run dev
```

Open `http://localhost:3000` (or the next available port; Vite will tell you). You should see the Home page with a component showcase.

## Try the existing reference patterns first

Before testing your own use case, browse what's already there. These are the agent's reference scaffolds:

| Pattern | URL | Why it matters |
|---|---|---|
| List view | `/contacts` | Show the agent what "good" looks like for any list page |
| Record detail | `/contacts/2` | Show the agent the standard record-detail anatomy |
| Console record (Figma) | `/console-record` | Full Service Console layout built from a Figma design: console nav bar, page header, `lightning-tabset` + related lists, sidebar panels, docked utility bar |

## Recommended prompt templates

### Text / PRD prompt

When asking the agent to build a new UI from a description, structure your prompt like this:

> Build a [page archetype] for [Salesforce object or use case]. It should show [list of fields, sections, or behaviors]. Use the [closest reference] in this repo as the starting structure.

Concrete examples:

- *"Build a record detail page for Case. Show case number, status, priority, owner in the header strip; details, activity, and related lists for Comments and Files in the tabs. Use `src/modules/page/consoleRecord/` as the starting structure."*
- *"Build a list view for Opportunities using `src/modules/page/contacts/` as the structure. Columns: Name, Stage, Amount, Close Date, Owner. Add a row action to view details."*
- *"Build a create form for Lead. Required fields: Last Name, Company. Optional: Email, Phone, Status (combobox). Use `docs/ui-patterns/forms.md` as the pattern reference."*

### Figma prompt

When handing the agent a Figma design, use this template:

> Implement this design from Figma: @[figma-url]
> Use `src/modules/page/consoleRecord/` as the reference for how to translate Figma designs into LWC in this repo.
> Follow the Figma-to-LWC translation rules: convert React+Tailwind output to LWC HTML + SLDS utility classes, replace Tailwind color/spacing with `--slds-g-*` hooks, and map every UI element to its Lightning Base Component equivalent before writing any custom HTML.

**Reference implementation:** `src/modules/page/consoleRecord/` was built from this Figma node:
`https://www.figma.com/design/888ZbpECrkf9GFpW2g3X9A/🆕-SLDS-2-Pattern---Console-Navigation-v2--Community-?node-id=26084-65690`

It demonstrates the full translation workflow:
- Console navigation bar → `slds-context-bar` blueprint
- Page header with summary strip → `slds-page-header` blueprint + `lightning-formatted-*`
- Tabbed body → `lightning-tabset` + `lightning-tab`
- Related lists → `lightning-datatable` with column definitions
- Sidebar panels → `lightning-card` with fixed width
- Docked utility bar → `slds-utility-bar` blueprint + `lightning-icon`
- Two-column layout → `slds-grid` + `slds-col` with flex sizing

## What good looks like

A successful agent response should:

1. **Read `AGENTS.md` and the relevant pattern doc** before writing code (it should reference them in the response)
2. **Write a short LBC plan first** (per the self-check in `AGENTS.md`)
3. **Use Lightning Base Components** for every interactive element (button, input, table, card, etc.) — no raw `<button>`, `<input>`, `<select>`, `<textarea>`
4. **Use SLDS utility classes** for spacing/layout (`slds-grid`, `slds-gutters`, `slds-p-around_medium`) — minimal or zero custom CSS
5. **Place files in the right location** (route view → `src/modules/page/`, deployable → `force-app/main/default/lwc/`)
6. **Wire the route** in `src/routes.config.js` and register the component in `src/modules/shell/app/app.js`
7. **Provide fixture data** in `src/modules/data/<name>/` if the demo needs realistic records

## What to do when the agent goes wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent writes raw `<button>` or custom CSS | Skipped the LBC self-check | Tell it to re-read `AGENTS.md` "Critical rules" section and apply the self-check |
| Agent rebuilds the global header / nav inside an LWC | Skipped the hosting-decision step in the PRD-to-UI skill | Tell it to re-read the **Platform vs LWC** section in the matching `docs/ui-patterns/*.md` file |
| Agent builds something completely different from what you asked | Didn't read the pattern doc | Point it at the specific `docs/ui-patterns/<archetype>.md` file by name |
| Agent ignores existing reference patterns | No reference given | Always include a sentence like "Use `src/modules/page/<example>/` as the starting structure" |

If you find a failure mode that's reproducible, add it to this file under "Known limitations" so the team learns from it.

## What gets deployed vs what stays local

This is a common point of confusion. See `AGENTS.md` and `CLAUDE.md`.

- Files under `src/modules/page/` are **local prototype only** — they run in Vite and never deploy to a Salesforce org.
- Files under `force-app/main/default/lwc/` are **deployable** — they run locally AND deploy to an org via `npm run deploy:org -- -o <alias>`.

When the agent builds a new page, it should ask (or decide based on the PRD) whether the work belongs in `src/` (local-only prototype) or `force-app/` (deployable). The PRD-to-UI skill includes a **hosting decision** step (Step 1.5) that handles this.

## Cleaning up after testing

The starter ships with reference demos that you'll usually want to remove when building a real demo. The `.agent/skills/prd-to-salesforce-ui/SKILL.md` skill includes a **scaffold-clean step** that the agent will run automatically when you ask it to "build a new demo for [X]" — it removes/replaces the starter routes and content so your demo doesn't ship with leftover scaffolding.

## Known limitations

(Add reproducible failure modes here as the team finds them.)

## Reporting issues

When the agent does something wrong, please capture:

1. The exact prompt you used
2. The agent's response (or the broken file it produced)
3. Which `docs/ui-patterns/*.md` doc applied
4. Whether `AGENTS.md` was followed (the agent should reference it)

Open an issue against the repo with that info so the rules can be tightened.
