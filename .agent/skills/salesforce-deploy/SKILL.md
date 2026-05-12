---
name: salesforce-deploy
version: "1.0.0"
description: "Guide Salesforce CLI auth, deploy validation, deployment, and common deploy troubleshooting for this starter kit. Use when the user wants to connect an org, validate deployability, deploy force-app metadata, or debug deployment failures."
---

# Salesforce Deploy

Use this skill to help users authenticate to a Salesforce org, validate metadata, deploy `force-app/`, and troubleshoot deployment issues.

This repo deploys only Salesforce metadata under `force-app/`. Local prototype files under `src/`, `public/`, `scripts/`, `vite-plugins/`, and `dist/` are excluded by `.forceignore`.

## Tone

Many users are not Salesforce CLI experts. Use the correct term, then briefly explain it. Example: "validate the deploy (check whether Salesforce will accept the metadata without changing the org)."

## Safety Rules

- Validate before deploying.
- Do not run destructive commands unless the user explicitly requests them.
- Do not deploy to an org until the user confirms the org alias.
- Do not assume a Lightning URL is valid for auth.
- Do not deploy local-only `src/` code to Salesforce; only `force-app/` metadata is deployed.
- If validation fails, explain the first actionable error before trying more commands.

## 1. Check Tooling

Verify SF CLI:

```bash
sf --version
```

Verify project configuration:

```bash
sf project deploy preview --source-dir force-app
```

If the preview command is unavailable in the installed CLI version, skip it and proceed with deploy validation.

## 2. Choose Or Confirm Org Alias

List authenticated orgs:

```bash
sf org list
```

Ask the user which alias to use. If the org is missing or expired, authenticate it.

## 3. Auth URL Rules

SF CLI auth needs a login host / instance URL. It does not need the Lightning runtime URL, Setup URL, app URL, or Experience Cloud site URL.

Valid login host examples:

```text
https://<my-domain>.my.salesforce.com
https://<my-domain>--<sandbox-name>.sandbox.my.salesforce.com
https://<org-host>.my.<domain>.salesforce.com
https://login.salesforce.com
https://test.salesforce.com
```

Org farm example:

```text
https://orgfarm-5b03f27a9b.test1.my.pc-rnd.salesforce.com
```

Avoid:

```text
https://<org-host>.lightning.force.com/...
https://<host>/lightning/setup/...
https://<site-domain>.my.site.com/...
https://<site-domain>.force.com/...
```

If the user provides a URL that already contains `.my.` and ends with `.salesforce.com`, preserve the host and strip only path/query/hash.

If the user provides a standard Lightning URL such as:

```text
https://example.lightning.force.com/lightning/page/home
```

propose:

```text
https://example.my.salesforce.com
```

Ask for confirmation before authenticating.

## 4. Authenticate

Preferred browser auth:

```bash
sf org login web --instance-url <login-host> -a <org-alias>
```

If browser auth is blocked, loops, or fails:

1. Re-check the login host.
2. Make sure the user did not provide a Lightning runtime or site URL.
3. Offer device login:

```bash
sf org login device --instance-url <login-host> -a <org-alias>
```

Confirm auth:

```bash
sf org display -o <org-alias>
```

## 5. Local Verification

Before org validation, run the local project check:

```bash
npm run check
```

This builds the local prototype and runs the SLDS linter against `src/modules`.

## 6. Validate Deployment

Validate without changing the org:

```bash
npm run deploy:org:check -- -o <org-alias>
```

Equivalent SF CLI command:

```bash
sf project deploy validate -o <org-alias>
```

Do not proceed to deploy until validation passes or the user explicitly asks to deploy despite known validation issues.

## 7. Deploy

Deploy after validation passes:

```bash
npm run deploy:org -- -o <org-alias>
```

Equivalent SF CLI command:

```bash
sf project deploy start -o <org-alias>
```

After deployment, summarize what metadata was deployed and any manual org steps still needed, such as activating a FlexiPage or adding a component to an App Builder page.

## 8. Activating A Lightning Record Page

Deploying a `RecordPage` FlexiPage does not make it the active page for record views. Salesforce resolves the active record page through three independent metadata layers in this order:

1. **App + Profile + Record Type override** — `CustomApplication.profileActionOverrides` scoped to a specific app, profile, and record type
2. **App default override** — `CustomApplication.profileActionOverrides` scoped to a specific app with no profile/record type restriction
3. **Object-level org default** — `CustomObject.actionOverrides` (applies across all apps)

**The critical failure mode:** if you deploy only the object-level override (layer 3) but the user opens the record inside a Lightning console or standard app that has its own app-level override (layer 1 or 2), the app override wins and the new FlexiPage never renders.

### What to deploy for full activation

For a RecordPage to be active in all contexts, deploy the appropriate override at the right layer:

**Object-level default (affects all apps):** add to the object's metadata file:
```xml
<!-- force-app/main/default/objects/Contact/Contact.object-meta.xml -->
<actionOverrides>
  <actionName>View</actionName>
  <type>Flexipage</type>
  <content>Contact_Record_Page</content>
</actionOverrides>
```

**App-level default (affects one Lightning app):** add to the CustomApplication metadata:
```xml
<!-- force-app/main/default/applications/MyApp.app-meta.xml -->
<profileActionOverrides>
  <actionName>View</actionName>
  <type>Flexipage</type>
  <content>Contact_Record_Page</content>
  <pageOrSobjectType>Contact</pageOrSobjectType>
  <formFactor>Large</formFactor>
</profileActionOverrides>
```

### Preflight verification

Before declaring a RecordPage deployment complete, verify activation:

```bash
# Check which FlexiPage is assigned to the object
sf data query -o <org-alias> -q "SELECT Id, MasterLabel, Type FROM FlexiPage WHERE Type = 'RecordPage' AND EntityDefinitionId = 'Contact'"

# Check active assignment via UI assignment (Lightning Experience)
sf data query -o <org-alias> -q "SELECT Id, PageType, MasterLabel FROM FlexiPage WHERE IsTemplate = false AND Type = 'RecordPage'"
```

Ask the user to open a record of the target object inside the target app and confirm the correct page renders. Do not call the deployment complete based on metadata validation alone.

### Triage: deployed but record still shows the default page

| Symptom | Likely cause | Fix |
|---|---|---|
| FlexiPage deployed, object override set, but wrong page renders inside a specific app | App-level override (layer 1 or 2) is taking precedence | Add `profileActionOverrides` to the `CustomApplication` metadata for that app |
| FlexiPage deployed, correct page renders in some apps but not others | Override only set at object level; some apps have their own override | Set the override at the app level for each affected app |
| FlexiPage deployed, no page renders at all | FlexiPage not activated — no override at any layer | Add at least the object-level `actionOverrides` entry |
| Override metadata deployed but page still doesn't update | Cached page assignment in org | Ask the user to clear cache or check App Builder activation manually |

---

## 10. New Lightning App Visibility

A successful `CustomApplication`, `CustomTab`, and `FlexiPage` deployment does not guarantee the app appears in App Launcher for the target user. App visibility and tab visibility are controlled separately by profiles or permission sets.

When creating a new Lightning app:

1. Include a permission set under `force-app/main/default/permissionsets/` that grants:
   - `<applicationVisibilities>` for the new `CustomApplication`
   - `<tabSettings>` with `Visible` for the app's custom tab
2. Deploy the permission set with the app metadata.
3. Assign the permission set to the target user, after user confirmation:

```bash
sf org assign permset --name <Permission_Set_API_Name> -o <org-alias>
```

4. Verify the app is visible to the authenticated user before saying deployment is complete:

```bash
sf data query -o <org-alias> -q "SELECT DurableId, Label, DeveloperName, NavType, UiType FROM AppDefinition WHERE Label LIKE '%<App Label>%'"
```

If the query returns no rows, do not call the app deployment complete. Check app visibility, tab visibility, whether the permission set was assigned to the same user, and whether the user needs to refresh Salesforce or clear App Launcher search filters.

## 11. Common Failure Triage

### Auth Or Org Alias Problems

Symptoms:

- Org alias not found
- Auth expired
- Browser auth loops
- Login blocked

Actions:

- Run `sf org list`.
- Re-authenticate with `sf org login web --instance-url <login-host> -a <org-alias>`.
- For org farm/internal domains, verify the exact `.my.<domain>.salesforce.com` host.
- Use device login if browser auth is blocked.

### Missing Or Invalid Component Metadata

Symptoms:

- LWC deploy fails
- Component does not appear in App Builder

Actions:

- Ensure each deployable LWC has `<component>.js-meta.xml`.
- Set `isExposed=true` and include targets for App Builder components.
- Use `isExposed=false` for internal components such as modals.

### Unsupported Or Wrong Metadata Target

Symptoms:

- FlexiPage or component target errors
- Component deploys but is not available where expected

Actions:

- Check `.js-meta.xml` targets:
  - `lightning__AppPage`
  - `lightning__RecordPage`
  - `lightning__HomePage`
- Verify the org supports the metadata type and API version.

### Local Prototype Versus Org Runtime Mismatch

Symptoms:

- Works locally but deploy fails
- Uses local-only imports or data

Actions:

- Move deployable code to `force-app/main/default/lwc/`.
- Keep route-level pages and fixtures in `src/` if they are local-only.
- Avoid importing `src/modules/data/*` from deployable `force-app` components.

### Permission Or Access Issues

Symptoms:

- Deploy validation fails with authorization or access errors
- App deploy succeeds but the app does not appear in App Launcher

Actions:

- Confirm the user has deployment permissions in the target org.
- Ask whether a different org alias or admin-enabled user should be used.
- For new apps, add and deploy a permission set with application visibility and tab visibility.
- Assign the permission set to the target user only after user approval.
- Query `AppDefinition` as the target user to verify the app is visible.
- Do not create or assign permissions without user approval.

## 12. Completion Summary

After auth, validation, or deployment, summarize:

- Org alias used
- Login host used, if relevant
- Whether `npm run check` passed
- Whether deploy validation passed
- Whether deployment ran
- For new apps, whether app visibility was granted and verified in `AppDefinition`
- Metadata deployed or intended for deploy
- Remaining manual steps or risks
