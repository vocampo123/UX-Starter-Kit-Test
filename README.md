# UX Starter Kit Test

A **prototype-to-org starter kit** for building Salesforce UI experiences. It keeps the original local SLDS 2 + LWC starter experience for learning, prototyping, and validating UI patterns, then adds a Salesforce DX `force-app/` layer so reusable components can be deployed to a Salesforce org.

Built with **LWC** (Lightning Web Components), **Vite**, **SLDS** (Salesforce Lightning Design System), and **lightning-base-components**, so you get fast local builds, hot reload, synthetic shadow, base components, design tokens, and deployable Salesforce metadata in one repo.

## New To This Starter?

If you are using an AI coding agent, start by asking:

> Help me set up this starter kit.

The agent can walk you through local setup, Salesforce org authentication, PRD intake, and whether your prototype should be local-only, deployable to an org, or both.

## How this differs from the original starter

The original Design System 2 starter is a local demo/prototyping app. It contains important SLDS 2, LWC, Lightning Base Component, synthetic shadow, routing, icon, and theme-switching examples, but its components live under `src/modules/` and are not packaged as Salesforce org metadata.

This repo keeps that local learning and prototyping surface, and adds:

- **`force-app/main/default/lwc/`** for deployable Salesforce LWCs using the `c` namespace
- **`sfdx-project.json`** so SF CLI can deploy the project
- **`.forceignore`** so local-only Vite files are excluded from org deployment
- **Vite support for `c/*` components** so deployable LWCs can be used locally as `<c-name>` or imported as `c/name`
- **Org deployment scripts** for validation and deployment through SF CLI

## Who this is for

- Developers prototyping Salesforce UIs locally before or alongside platform deployment
- Teams designing or evaluating experiences with LWC and SLDS  
- Anyone who wants a local dev environment that matches Salesforce behavior (synthetic shadow, global SLDS styles, Lightning Base Components)
- Teams who want starter examples that can become deployable Salesforce org components without rebuilding from scratch

## What you get

- **App shell** — Header, global navigation, theme switcher (light/dark, SLDS 1/2), and panel layout  
- **Client-side routing** — Declarative routes in `src/routes.config.js` with path params (e.g. `/users/:id`), History API, no full page reload  
- **SLDS + Lightning Base Components** — Design system and Salesforce component library wired and ready to use  
- **Synthetic Shadow DOM** — Matches Salesforce platform behavior so styles and DOM semantics align with production  
- **Icon setup** — Prebuild script, Vite aliases for `lightning/iconSvgTemplates*`, and shim modules under `src/build/lightning-icon/shims/`; generated bundles in `src/build/generated/`  
- **Example pages** — Home, Icons, Contacts, and a sample parameterized page (`/users/:id`). See `src/modules/page/` and `src/modules/ui/` for patterns.
- **Deployable examples** — Components under `force-app/main/default/lwc/` that can run locally and deploy to an org.
- **Salesforce org metadata** — `force-app/`, `sfdx-project.json`, and `.forceignore` for SF CLI deployment.

## Quick start

```bash
npm install
npm run dev
```

Dev server runs at **http://localhost:3000**. Global SLDS styles are resolved from **`@salesforce-ux/design-system`** and **`@salesforce-ux/design-system-2`** by Vite (hashed CSS in `dist/assets/` on build); see **`src/build/slds-loader.js`**. Icons for `<lightning-icon>` are generated on `dev` / `build`. To build and preview a production bundle:

```bash
npm run build
npm run preview
```

To run the starter verification check:

```bash
npm run check
```

To validate or deploy the Salesforce org metadata:

```bash
npm run deploy:org:check -- -o <org-alias>
npm run deploy:org -- -o <org-alias>
```

## Project structure

```
design-system-2-org-starter/
├── src/
│   ├── modules/
│   │   ├── shell/                 # App shell (shell-*)
│   │   │   ├── app/               # Root app, route rendering
│   │   │   ├── globalShell/       # Layout wrapper
│   │   │   ├── globalHeader/      # Top bar
│   │   │   ├── globalNavigation/ # Nav links
│   │   │   ├── panel/             # Side panel
│   │   │   └── themeSwitcher/     # SLDS version + dark mode
│   │   ├── page/                  # Route-level views (page-*)
│   │   │   ├── home/
│   │   │   ├── user/              # e.g. /users/:id
│   │   │   └── iconTest/
│   │   ├── ui/                    # Reusable building blocks (ui-*)
│   │   │   └── example/
│   │   └── data/                  # Shared modules (e.g. fixtures) imported as data/*
│   ├── build/                     # Build wiring, generated assets, shims (not LWC app UI)
│   │   ├── generated/             # Generated icon modules (do not edit)
│   │   ├── shim/                  # LWC / package shims (e.g. gate modules)
│   │   ├── slds/
│   │   │   └── slds1-url.js       # Lazy chunk: resolved URL for SLDS 1 stylesheet
│   │   ├── lightning-icon/shims/  # Icon template overrides (lightning/iconSvgTemplates* → here)
│   │   └── slds-loader.js         # SLDS stylesheet link injection, theme bootstrap, lazy SLDS 1
│   ├── router.js                  # Route definitions and navigation
│   └── index.js                   # App entry point
├── force-app/main/default/        # Salesforce org metadata
│   ├── lwc/                       # Deployable LWCs, namespace c
│   │   ├── homeIntro/
│   │   └── demoModal/
│   └── flexipages/                # Example App Builder page metadata
├── scripts/
│   ├── prebuild-icons.mjs         # Icon codegen (run via npm scripts)
│   └── sync-afv-skills.mjs        # Copies afv-library skills → .agent/skills/afv-library/
├── index.html
├── sfdx-project.json
├── .forceignore
├── vite.config.js
└── package.json
```

### Component namespaces

Folder-based namespaces under `src/modules/` define the local LWC tag prefix. Components under `force-app/main/default/lwc/` use the Salesforce `c` namespace.

| Folder        | Tag prefix | Use for |
|---------------|------------|--------|
| **shell/**    | `shell-*`  | App shell only (e.g. `shell-app`, `shell-global-header`). Not for feature pages. |
| **page/**     | `page-*`   | Route-level views (one per URL). e.g. `page-user` → `/users/:id`. |
| **ui/**       | `ui-*`     | Reusable building blocks (cards, buttons, modals). Used inside pages or other components. |
| **data/**     | —          | Plain modules (e.g. fixtures), imported as `data/<name>`. Not LWC tags. |
| **force-app/main/default/lwc/** | `c-*` | Reusable components that can run locally and deploy to a Salesforce org. |

Add local-only route views under **page/**, local-only reusable components under **ui/**, and deployable org components under **`force-app/main/default/lwc/`**. Put shell chrome in **`shell/`** only. Icon template shims live under **`src/build/lightning-icon/shims/`**; do not add other files there. Do not add a **`lightning/`** folder under **`src/modules`** for custom components.

**Examples:** Add `src/modules/page/dashboard/` → register in router and app, use as `page-dashboard` on e.g. `/dashboard`. Add `src/modules/ui/card/` → use in templates as `<ui-card>`.

### Deployable components

Components under **`force-app/main/default/lwc/`** use the Salesforce **`c`** namespace and are deployable with SF CLI. Vite also resolves them in local development, so you can use a deployable component in templates as **`<c-name>`** and import its JavaScript as **`c/name`**.

Use **`force-app/main/default/lwc/`** for reusable components that should move to a Salesforce org. Use **`src/modules/page/`** for local-only route views and **`src/modules/shell/`** for local-only app chrome.

## Using this as a template

1. Clone or copy the repo, then `npm install` and `npm run dev`.
2. **Add a page:** Create a folder under `src/modules/page/<name>/`, then:
   - Add a route in `src/routes.config.js` (e.g. `{ path: '/dashboard', component: 'page-dashboard', title: 'Dashboard', navPage: 'dashboard', navLabel: 'Dashboard' }`).
   - In `src/modules/shell/app/app.js`, import the component and add it to `ROUTE_COMPONENTS`. That's it — `src/router.js` does not need editing.
   - For child routes under an existing tab (e.g. `/contacts/:id`), use `navHighlight: '<parentNavPage>'` instead of `navPage` so the parent tab is highlighted without creating a new nav entry.
3. **Add a reusable local component:** Create a folder under `src/modules/ui/<name>/` and use it as `<ui-<name>>` in any page or other component.
4. **Add a deployable component:** Create a folder under `force-app/main/default/lwc/<name>/` and use it locally as `<c-name>` or `import MyComponent from 'c/name'`.
5. Follow the namespace rules above and the SLDS/LWC conventions referenced in this repo (e.g. `.cursor/rules` if present).

**Modals:** For modal dialogs, extend `LightningModal` from `lightning/modal` and use the in-repo example as your starting point: `force-app/main/default/lwc/demoModal/`. It shows the correct structure (header → body → footer with `lightning-modal-header`, `lightning-modal-body`, `lightning-modal-footer`) and opening via `MyModal.open({ size, label })`. Do not implement modals with raw SLDS modal markup.

## Routing

The app uses a small client-side router in `src/router.js`:

- **Route config** — Routes are defined in `src/routes.config.js` as `{ path, component, title, navPage?, navLabel?, navPath?, navHighlight? }`. `title` can be a string or function of route params.
- **Path params** — Use `:id` (e.g. `/users/:id`); params are available to the page component via `getCurrentRoute()` from `src/router.js`.
- **Nav tabs** — Only routes with `navPage` create a tab in the global nav. Child routes that should highlight a parent tab use `navHighlight` instead (e.g. `navHighlight: 'contacts'` on `/contacts/:id`).
- **Navigation** — Use `navigate(path)` from the router; the app shell subscribes to route changes and renders the matching `page-*` component.
- **History** — Uses the History API; back/forward work without full page reload.

## Tech stack and dependencies

- **vite** — Build tool and dev server  
- **vite-plugin-lwc** — LWC support for Vite  
- **lwc** — Lightning Web Components framework  
- **@lwc/synthetic-shadow** — Synthetic shadow DOM (Salesforce-like)  
- **lightning-base-components** — Salesforce component library  
- **@salesforce-ux/design-system** — Classic SLDS; Vite bundles `assets/styles/salesforce-lightning-design-system.min.css` (and nested `url(...)` assets) when SLDS 1 is loaded  
- **@salesforce-ux/design-system-2** — SLDS 2 / Cosmos; Vite bundles `dist/css/slds2.cosmos.css` for the default theme  
- **`public/images/`** (e.g. favicon `salesforce.svg`) stays in the repo as app-owned assets.

## SLDS 1 and SLDS 2

**SLDS 2** is the default. `src/index.js` awaits **`initSldsFromStorage()`** from **`src/build/slds-loader.js`** before mounting LWC so the correct theme is active on first paint (including when `localStorage` says the last session used SLDS 1).

The loader injects **`<link rel="stylesheet" data-slds="...">`** elements and toggles the active sheet with the **`media`** attribute (`all` vs `not all`), matching the previous static-HTML behavior. Stylesheet URLs come from **`new URL(..., import.meta.url)`** pointing at files under **`node_modules/@salesforce-ux/...`** so Vite emits versioned CSS assets and rewrites nested **`url(...)`** references. **SLDS 1** is loaded **lazily** (dynamic `import()` of `src/build/slds/slds1-url.js`) until the user switches themes or a saved preference requires it—so the default bundle does not fetch classic SLDS until needed.

Icon templates come from **lightning-base-components** via **`prebuild-icons.mjs`**.

## Shadow DOM (synthetic vs native)

This template uses **Synthetic Shadow DOM** so behavior and styling match the Salesforce platform.

| Feature        | Synthetic Shadow (default) | Native Shadow   |
|----------------|----------------------------|-----------------|
| Platform match | Matches Salesforce          | Different       |
| Global styles  | Penetrate components       | Blocked         |
| DOM queries    | Can query inside components| Cannot query in |
| `shadowRoot`   | `null`                     | ShadowRoot      |

**Verify:** In the browser console at http://localhost:3000 run `document.querySelector('shell-app').shadowRoot` — `null` means synthetic shadow is active.

**Switch to native shadow:** In `vite.config.js` set `disableSyntheticShadowSupport: true` in the LWC plugin options.

**Why synthetic?** Matches Salesforce platform behavior, allows global SLDS styles to apply, simplifies migration of components to the platform, and keeps DOM inspectable for tests and tooling.

## Icons

SLDS icons are generated by a prebuild step. Run `npm run dev` or `npm run build` so `scripts/prebuild-icons.mjs` runs and updates `src/build/generated/`. Vite resolves **`lightning/iconSvgTemplates*`** to the shim modules under **`src/build/lightning-icon/shims/`**; do not add unrelated code there.

## Conventions and design system

The project follows SLDS and LWC best practices: prefer Lightning Base Components, then SLDS utility classes, then styling hooks for customisation. For detailed guidance (e.g. tokens, components, accessibility), see the [Lightning Design System](https://lightningdesignsystem.com) and [Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/en/lwc) documentation. This repo may include additional conventions (e.g. in `.cursor/rules`).

## Deployment and platform

This template supports two deployment targets:

- **Salesforce org deployment** for metadata under `force-app/`
- **GitHub Pages deployment** for the local Vite prototype app

Only `force-app/` is deployed to Salesforce. Local prototype files such as `src/`, `public/`, `scripts/`, `vite-plugins/`, and `dist/` are excluded by `.forceignore`.

### Salesforce org

Use `force-app/main/default/lwc/` for components that should deploy to a Salesforce org. These components use the Salesforce `c` namespace and can also be rendered locally by Vite.

Validate without deploying:

```bash
npm run deploy:org:check -- -o <org-alias>
```

Deploy to an authenticated org:

```bash
npm run deploy:org -- -o <org-alias>
```

The starter currently includes example deployable components in `force-app/main/default/lwc/` and an example FlexiPage in `force-app/main/default/flexipages/`. A complete production app may still need additional Salesforce metadata, such as custom applications, tabs, permissions, objects, or record pages depending on the use case.

### GitHub Pages

Publishing is **`npm run deploy`** only: a **`build:gh-pages`** production build (hash-based client routes for static hosting), then push **`dist/`** to the **`gh-pages`** branch on **`origin`** ([`gh-pages`](https://www.npmjs.com/package/gh-pages)).
This repo does not use GitHub Actions for Pages.

**One-time setup**

1. Configure Git so you can **`git push` to `origin`**.
2. Run **`npm run deploy`** once so branch **`gh-pages`** exists on the remote.
3. On GitHub: **Settings → Pages** → **Build and deployment** → **Deploy from a branch** → Branch **`gh-pages`**, folder **`/` (root)** → Save.

**Ongoing:** run **`npm run deploy`** whenever you want to publish a new build.

After GitHub finishes publishing, find your live site URL on **Settings → Pages** (the hostname depends on your GitHub plan and organization settings).

**Routing:** Default **`npm run dev`** and **`npm run build`** use normal path URLs (`/settings`). **`npm run deploy`** uses **`npm run build:gh-pages`**, which enables **hash URLs** (e.g. `…/your-repo/#/settings`) so refreshes and deep links work on GitHub Pages. Path-only bookmarks like `…/your-repo/settings` (no hash) will still 404 on Pages.

**Preview locally:** **`npm run build`** then **`npm run preview`** exercises path routing. To preview the GitHub Pages bundle, run **`npm run build:gh-pages`** then **`npm run preview`**.

**Another remote or URL:** `npx gh-pages -d dist -o <remote-name>` or `npx gh-pages -d dist -r https://github.com/org/repo.git`.

## AI tooling

This project includes an `mcp.json` that automatically configures the [Salesforce DX MCP server](https://www.npmjs.com/package/@salesforce/mcp) for AI-assisted development. Editors that support MCP (e.g. Claude Code, Cursor, VS Code with Copilot) will pick it up and gain access to Salesforce-specific code analysis and LWC guidance tools. No setup is required — the server runs via `npx` on demand.

If you are using an AI coding agent, you can ask for guided setup. Agents should follow `AGENTS.md`, which includes an optional onboarding flow, PRD-to-prototype intake, org fit-gap guidance, Salesforce auth URL rules, and handoff-quality expectations.

### Agent skills (layout)

- **`.agent/skills/afv-library/`** — Selected skills from [`forcedotcom/afv-library`](https://github.com/forcedotcom/afv-library) (`develop`) are copied here on **`npm install`** (gitignored). Refresh with **`npm run skills:sync`**.
- **`.agent/skills/<skill-id>/`** — Skills that ship with this project.

## References

- [Lightning Design System](https://lightningdesignsystem.com)  
- [Lightning Web Components (Salesforce)](https://developer.salesforce.com/docs/component-library/overview/components)  
- [LWC (OSS) / vite-plugin-lwc](https://github.com/salesforce/lwc) — for local LWC + Vite behavior
