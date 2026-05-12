---
name: salesforce-auth
description: "Authenticate the user to a Salesforce org via SF CLI. Handles login host detection from a URL, distinguishes valid login hosts from runtime/Setup/Experience Cloud URLs, and provides device-login fallback when browser auth is blocked. Use when the user mentions logging into an org, authenticating, `sf org login`, or shares a Salesforce URL."
---

# Salesforce Auth Skill

Use this skill when helping a user authenticate to a Salesforce org via SF CLI. The most common failure mode is using the wrong URL as the login host — Lightning runtime URLs, Setup paths, or Experience Cloud site URLs will not work.

---

## Detect and confirm the login host

When a user shares a Salesforce URL, derive the login host conservatively:

1. Parse the user-provided URL.
2. Strip paths, query strings, and hashes.
3. Propose the detected login host.
4. **Ask for confirmation before running the auth command.**

---

## Valid login host patterns

| Pattern | Example |
|---|---|
| Production or standard My Domain | `https://<my-domain>.my.salesforce.com` |
| Sandbox My Domain | `https://<my-domain>--<sandbox-name>.sandbox.my.salesforce.com` |
| Scratch org, org farm, or internal test domain | `https://<org-host>.my.<domain>.salesforce.com` |
| Generic production login | `https://login.salesforce.com` |
| Generic sandbox login | `https://test.salesforce.com` |

**Org farm example:**
```
https://orgfarm-5b03f27a9b.test1.my.pc-rnd.salesforce.com
```

If the URL already contains `.my.` and ends with `.salesforce.com`, keep that host exactly and strip only the path/query/hash. **Do not** convert org farm or internal test domains to `login.salesforce.com`.

---

## Invalid auth targets (never use these)

- Lightning runtime URLs: `https://<org-host>.lightning.force.com/...`
- Setup or app paths: `https://<host>/lightning/setup/...`
- Experience Cloud / site URLs: `https://<site-domain>.my.site.com/...`, `https://<site-domain>.force.com/...`

### Converting a Lightning runtime URL

If the user provides a Lightning runtime URL on a standard My Domain, propose converting:

```
https://example.lightning.force.com/lightning/page/home
```

to:

```
https://example.my.salesforce.com
```

### Ambiguous URLs

If the URL is a site/community URL, a generic `force.com` URL, or otherwise ambiguous, **ask the user for the My Domain login host** instead of guessing.

---

## Preferred auth command

```bash
sf org login web --instance-url <login-host> -a <org-alias>
```

The `-a <org-alias>` is the friendly name you'll use to refer to this org in subsequent commands (e.g., `sf project deploy start -o <org-alias>`).

---

## Fallback: device login

If browser auth is blocked, loops, or fails to complete, first verify the login host is correct. For blocked browser environments, use device login:

```bash
sf org login device --instance-url <login-host> -a <org-alias>
```

This prints a device code and a URL the user opens on a different device.

---

## Verifying authentication

After auth completes, verify with:

```bash
sf org display -o <org-alias>
```

This shows the org id, instance URL, and current auth status.
