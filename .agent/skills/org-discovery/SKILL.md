---
name: org-discovery
version: "1.0.0"
description: "Safely inspect a target Salesforce org before building deployable UI. Use when a user provides requirements plus an org alias/URL, asks whether existing org assets can be reused, or works in an industry cloud org such as Nonprofit Cloud."
---

# Org Discovery And Fit-Gap

Use this skill before building net-new deployable Salesforce functionality when the user has a target org. The goal is to identify existing capabilities that can satisfy the user's requirements through reuse, configuration, or extension.

## When To Use

Use this skill when:

- The user provides a PRD, requirements, screenshot, Figma file, or app idea and also provides a Salesforce org.
- The user asks whether something already exists in an org.
- The target org is an industry cloud org, such as Nonprofit Cloud, Education Cloud, Financial Services Cloud, Health Cloud, or Public Sector.
- You are about to create deployable LWCs, FlexiPages, tabs, objects, flows, or permission sets and an org alias is available.

Do not use this skill for purely local-only prototypes unless the user explicitly wants org-aware recommendations.

## Safety Rules

- Ask permission before inspecting org metadata.
- Prefer list/read operations before retrieving metadata.
- Do not retrieve broad metadata sets without explaining the scope.
- Retrieve only selected metadata after user confirmation.
- Avoid overwriting local files. If retrieval may write into `force-app/`, explain what will be retrieved first.
- Do not delete, deploy, or modify org metadata as part of discovery.
- Treat org-specific findings as context for recommendations, not automatic permission to change the implementation.

## Fit-Gap Flow

1. Summarize the requirements in plain language.
2. Confirm the org alias with the user.
3. Confirm the org is authenticated.
4. Identify likely Salesforce standard, industry cloud, or existing org capabilities that may satisfy each requirement.
5. List relevant metadata types in read-only mode.
6. Map requirements to existing assets.
7. Recommend one of:
   - Reuse existing capability
   - Configure existing capability
   - Extend existing metadata
   - Build net-new
8. Confirm the recommended approach before implementation.

## Confirm Org Auth

Use:

```bash
sf org list
```

If the alias is missing or expired, use the `salesforce-deploy` skill for authentication guidance.

## Read-Only Discovery Commands

Prefer these list commands before retrieve commands:

```bash
sf org list metadata --metadata-type LightningComponentBundle -o <org-alias>
sf org list metadata --metadata-type AuraDefinitionBundle -o <org-alias>
sf org list metadata --metadata-type FlexiPage -o <org-alias>
sf org list metadata --metadata-type CustomApplication -o <org-alias>
sf org list metadata --metadata-type CustomTab -o <org-alias>
sf org list metadata --metadata-type CustomObject -o <org-alias>
sf org list metadata --metadata-type PermissionSet -o <org-alias>
sf org list metadata --metadata-type Flow -o <org-alias>
sf org list metadata --metadata-type ApexClass -o <org-alias>
sf org list metadata --metadata-type StaticResource -o <org-alias>
```

When a command returns too much output, narrow by metadata type or ask the user which area to inspect first.

## Selective Retrieval

Only retrieve metadata after the user confirms the exact items. Use narrow retrieve commands:

```bash
sf project retrieve start --metadata LightningComponentBundle:<componentName> -o <org-alias>
sf project retrieve start --metadata FlexiPage:<pageName> -o <org-alias>
sf project retrieve start --metadata CustomObject:<objectName> -o <org-alias>
sf project retrieve start --metadata Flow:<flowName> -o <org-alias>
sf project retrieve start --metadata PermissionSet:<permissionSetName> -o <org-alias>
```

If local files already exist for the same metadata, pause and ask before proceeding.

## Industry Cloud Guidance

For industry cloud orgs, assume domain-specific capability may already exist. Prefer reuse/configuration/extension before creating parallel custom functionality.

Examples:

- **Nonprofit Cloud**: donor, fundraising, program, case management, household/account, relationship, gift, and engagement patterns may already exist.
- **Health Cloud**: patient/member, care plan, provider, authorization, case, and care gap patterns may already exist.
- **Financial Services Cloud**: client, household, financial account, goal, relationship, and interaction patterns may already exist.
- **Education Cloud**: learner, program, application, advising, case, and engagement patterns may already exist.

Do not invent a new object model until you have checked whether the org already has a suitable model.

## Fit-Gap Output Format

Return a concise table:

| Requirement | Existing asset | Recommendation | Confidence | Next action |
|-------------|----------------|----------------|------------|-------------|
| Example requirement | `ExistingComponent` or `CustomObject__c` | Reuse / Configure / Extend / Build new | High / Medium / Low | What to do next |

Then summarize:

- What can be reused
- What should be configured
- What should be extended
- What should be built net-new
- What remains unknown

## Handoff To Implementation

After fit-gap, tell the user how the implementation should proceed:

- Local-only route: `src/modules/page/<name>/`
- Deployable component: `force-app/main/default/lwc/<name>/`
- Org page placement: FlexiPage metadata in `force-app/main/default/flexipages/`
- Data fixtures for local prototype only: `src/modules/data/<name>/`

Run `npm run check` after source changes. If org deployment is planned, validate with:

```bash
npm run deploy:org:check -- -o <org-alias>
```
