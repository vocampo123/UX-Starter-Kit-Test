# Salesforce UX Starter Kit

A local-to-org development framework for building Salesforce UI experiences with AI agent guidance built in. Prototype in a fast local dev environment, then deploy directly to a Salesforce org — using the same components and the same design system throughout.

Built on **LWC** (Lightning Web Components), **Vite**, **SLDS 2** (Salesforce Lightning Design System), and **Lightning Base Components**.

---

## What this is

A framework for building production-quality Salesforce UI — locally or deployed — with AI agents that know the rules:

- **AI guidance built in** — `CLAUDE.md`, `AGENTS.md`, and `.cursor/rules/` encode Salesforce UI standards so agents use LBCs, SLDS tokens, and correct patterns by default
- **Pattern docs** — `docs/ui-patterns/` covers Console Navigation, Record Detail, List View, Command Center, Dashboard, and Forms with canonical markup and hard stops
- **Agent skills** — `.agent/skills/` covers PRD intake, org deployment, org discovery, and SLDS application
- **Local prototype + org deployment** — `src/modules/` for local dev, `force-app/` for Salesforce org deployment via SF CLI
- **Project persistence** — `docs/prd/` stores PRDs, screenshots, fit-gap analysis, and build state so agents have context across sessions

---

## Quick start

```bash
npm install
npm run dev
```

Dev server runs at **http://localhost:3000**.

```bash
npm run build       # Production bundle
npm run preview     # Preview production bundle
npm run check       # Build + SLDS lint pass
```

---

## Project structure

```
├── src/modules/
│   ├── shell/          # App chrome (header, nav, theme switcher)
│   ├── page/           # Route-level views (one per URL)
│   ├── ui/             # Reusable local-only components
│   └── data/           # JS fixtures for local prototyping
│
├── force-app/main/default/
│   ├── lwc/            # Deployable components (c namespace)
│   └── flexipages/     # Lightning App Builder page definitions
│
├── docs/
│   ├── ui-patterns/    # Pattern docs: Console, Record, List, Command Center, Forms
│   ├── prd/            # Project PRDs, screenshots, fit-gap analysis, build state
│   ├── spacing-rules.md
│   └── slds2-tokens-reference.md
│
├── .agent/skills/      # Agent skills: deploy, PRD intake, org discovery, SLDS
├── CLAUDE.md           # Claude Code agent guidance
├── AGENTS.md           # General agent guidance (Cursor, Copilot, etc.)
└── .cursor/rules/      # Cursor-specific rules
```

**Component namespaces:**

| Location | Tag | Use for |
|---|---|---|
| `src/modules/page/` | `page-*` | Route-level views |
| `src/modules/shell/` | `shell-*` | App chrome only |
| `src/modules/ui/` | `ui-*` | Reusable local-only components |
| `force-app/main/default/lwc/` | `c-*` | Deployable org components |

---

## Deploying to a Salesforce org

```bash
# Validate without deploying
npm run deploy:org:check -- -o <org-alias>

# Deploy
npm run deploy:org -- -o <org-alias>
```

Only `force-app/` is deployed. Local files (`src/`, `dist/`, `scripts/`, etc.) are excluded via `.forceignore`.

---

## Adding a page

When building a demo, replace the showcase routes in `src/routes.config.js` — do not add demo routes alongside them. See `CLAUDE.md` → "Adding a new page" for the full workflow.

For org deployment, build section components in `force-app/main/default/lwc/` and wire them into a flexipage. Each independently configurable UI element should be its own `isExposed=true` LWC.

---

## AI agent usage

If you are using an AI coding agent (Claude Code, Cursor, Copilot), the guidance files are already in place:

- **Claude Code** — reads `CLAUDE.md` automatically
- **Cursor** — reads `.cursor/rules/salesforce-ui.mdc`
- **Other agents** — reads `AGENTS.md`

When starting a new project, provide the agent with your PRD or requirements. The agent will save artifacts to `docs/prd/` and maintain a build state README across sessions.

To kick off a guided setup, just tell the agent: **"help me get started"**

---

## References

- [Lightning Design System](https://lightningdesignsystem.com)
- [Lightning Base Components](https://developer.salesforce.com/docs/component-library/overview/components)
- [Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
