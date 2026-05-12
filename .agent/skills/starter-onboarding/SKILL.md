---
name: starter-onboarding
description: "Walk a new user through setting up the SLDS 2 Org Starter Kit for the first time. Covers what the repo can do, local dev setup, org auth, and the question chain to understand what they want to build. Use when a user first opens the repo, asks 'how do I begin', or seems unfamiliar with the toolchain."
---

# Starter Kit Onboarding

Use this skill when a user first opens the repo or asks how to get started. Do not assume they want a guided setup — always ask first.

---

## Step 1: Ask before guiding

Greet the user and ask:

> Would you like guided setup for this starter kit, or do you want to jump straight into building?

If they want to jump in: skip this skill and help with their actual request.

If they want guided setup: continue with the steps below.

---

## Step 2: Explain what the repo can do

Tell them this starter supports:
- Local Salesforce-style prototyping with Vite, LWC, SLDS 2, Lightning Base Components, and synthetic shadow
- Org deployment for reusable components under `force-app/`

For a full interactive overview of skills, guidelines, and live component samples, point them to the **About page** at `http://localhost:3000/about` (available once the dev server is running).

---

## Step 3: Ask their goal

Ask whether they want:
- A local prototype only
- Deployable Salesforce components
- Both

---

## Step 4: Confirm local setup

- Do they have Node.js 20 or later?
- Run `npm install`
- Run `npm run dev`
- Open `http://localhost:3000`

---

## Step 5: Org readiness (if deploying)

Ask:
- Do they already have a Salesforce org ready?
- What type of org (production, sandbox, scratch, org farm)?
- What's the org URL?
- What alias do they want to use?

---

## Step 6: Authenticate (if needed)

If they're not authenticated, **invoke the `salesforce-auth` skill** at `.agent/skills/salesforce-auth/SKILL.md`. It covers login host detection from the URL and the auth command.

Brief explanation for non-technical users: "deploy means sending the component to your Salesforce org so it appears in the app there."

---

## Step 7: Ask what they want to build

Ask for:
- The app idea
- The users
- The problem to solve
- Whether they have a PRD, screenshot, Figma file, notes, or written requirements

If they provide a PRD or written requirements without a design, **invoke the `prd-to-salesforce-ui` skill**.

---

## Step 8: Choose the right code location

| Need | Location |
|---|---|
| Deployable reusable component | `force-app/main/default/lwc/` |
| Local-only page | `src/modules/page/` |
| App shell or chrome | `src/modules/shell/` |
| Local fixture data | `src/modules/data/` |

---

## Step 9: Summarize before coding

Tell the user:
- What will be built
- Which files will change
- Whether it's local-only or deployable
- How it will be verified

---

## Step 10: Verify

After changes:
- `npm run check` for local prototype work
- `npm run deploy:org:check -- -o <org-alias>` for org deployments (validate before real deploy)

---

## Tone

Keep this conversational and beginner-friendly. Use the correct technical term, then immediately follow it with a plain-language explanation in parentheses, e.g. "deploy (send the component to your Salesforce org)" or "alias (a friendly name you give the org so commands are shorter)."
