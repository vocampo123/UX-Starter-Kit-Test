# Page Header

Page headers appear at the top of list views, object home pages, and record pages. They are a **blueprint pattern** — no single LBC wraps them. Use the `c-page-header` (org) or `ui-page-header` (local prototype) component, which encapsulates the correct structure and tokens.

---

## Use the component — don't hand-roll the blueprint

**Org (deployable):** `<c-page-header>`  
**Local prototype:** `<ui-page-header>`

Both components enforce:
- Correct background token (`--slds-g-color-surface-container-2`)
- `slds-has-flexi-truncate` on title column (prevents actions being pushed off-screen)
- `slds-no-flex` on actions column (never shrinks)
- `size="large"` on object icon

No drop shadow. List view and record page headers in Salesforce are flat — `--slds-g-shadow-1` is for elevated surfaces like modals and popovers, not page headers.

If you hand-roll `slds-page-header` directly, you will get these wrong. Use the component.

---

## API

| Property | Type | Default | Description |
|---|---|---|---|
| `variant` | `'base' \| 'object-home' \| 'record-home' \| 'related-list'` | `'object-home'` | Drives layout, icon visibility, and Row 2 content |
| `icon-name` | String | — | `lightning-icon` icon-name, e.g. `standard:contact`. Omit for `base` and `related-list`. |
| `object-label` | String | — | Object type shown above title, e.g. `Contact`. Omit for `base` and `related-list`. |
| `title` | String | `''` | Page or record title — auto-truncates |
| `meta-text` | String | — | Secondary text below title, e.g. `Mark Jaeckal • Unlimited Customer` |
| `item-count` | String | — | Item count string for `related-list` variant Row 2, e.g. `10 items · sorted by name` |

| Slot | Description |
|---|---|
| `breadcrumbs` | `<lightning-breadcrumbs>` — shown for `base`, `object-home`, and `related-list` variants |
| `actions` | Action buttons — placed in the `slds-no-flex` column (never shrinks) |
| `controls` | List controls (icon buttons) — placed in the `slds-no-flex` column on Row 2, `related-list` variant only |
| `details` | `<li class="slds-page-header__detail-block">` items — shown for `record-home` variant only |

---

## Variants

Background token: **`--slds-g-color-surface-container-2`** (`#f3f3f3`) — confirmed from SLDS 2 Figma component library. All 6 variants share this token.

| Variant | `variant` prop | Row 2 | Typical actions |
|---|---|---|---|
| Base | `base` | No | None — breadcrumbs + title only, no icon |
| Object Home | `object-home` | No | New / Import + overflow |
| Record Home | `record-home` | Detail field strip (4–6 fields) | Follow / Edit / Delete / Clone + overflow |
| Related List | `related-list` | Item count + list controls | Add [Object] + overflow |

---

## Usage — Object Home (list view)

```html
<ui-page-header
    variant="object-home"
    icon-name="standard:contact"
    object-label="Contacts"
    title="All Contacts">

    <lightning-breadcrumbs slot="breadcrumbs">
        <lightning-breadcrumb label="Home" href="/"></lightning-breadcrumb>
    </lightning-breadcrumbs>

    <div slot="actions">
        <lightning-button-group>
            <lightning-button label="New" variant="neutral"></lightning-button>
            <lightning-button-menu alternative-text="More Actions" variant="border-filled" menu-alignment="right">
                <lightning-menu-item label="Import" value="import"></lightning-menu-item>
            </lightning-button-menu>
        </lightning-button-group>
    </div>

</ui-page-header>
```

## Usage — Record Home

```html
<ui-page-header
    variant="record-home"
    icon-name="standard:contact"
    object-label="Contact"
    title={contactName}
    meta-text={contactMeta}>

    <div slot="actions">
        <lightning-button-group>
            <lightning-button label="Edit" variant="neutral"></lightning-button>
            <lightning-button label="Delete" variant="neutral"></lightning-button>
            <lightning-button-menu alternative-text="More Actions" variant="border-filled" menu-alignment="right">
                <lightning-menu-item label="Clone" value="clone"></lightning-menu-item>
            </lightning-button-menu>
        </lightning-button-group>
    </div>

    <li slot="details" class="slds-page-header__detail-block">
        <p class="slds-text-title slds-truncate" title="Company">Company</p>
        <p class="slds-truncate" title={contact.company}>{contact.company}</p>
    </li>
    <li slot="details" class="slds-page-header__detail-block">
        <p class="slds-text-title slds-truncate" title="Email">Email</p>
        <lightning-formatted-email value={contact.email}></lightning-formatted-email>
    </li>

</ui-page-header>
```

---

## Hard stops

- **Never** use `slds-page-header__col-title` — use `slds-has-flexi-truncate` (without this the title won't shrink and actions get pushed off-screen)
- **Never** use `slds-page-header__col-actions` — use `slds-no-flex slds-grid slds-align-top`
- **Never** use `size="medium"` on the object icon — use `size="large"`
- **Never** hardcode a background color — the component applies the correct token
- **Never** put both the type label and record name inside the same `<span>` — they must be sibling elements inside `<h1>`

---

## Cross-references

- Structure detail: `docs/ui-patterns/console-navigation.md` → Page header anatomy
- Record page context: `docs/ui-patterns/record-detail.md` → Page header
- Background token: `docs/slds2-tokens-reference.md` → Surface table
- Shadow elevation: `docs/slds2-tokens-reference.md` → Shadow elevation
- Component source (org): `force-app/main/default/lwc/pageHeader/`
- Component source (local): `src/modules/ui/pageHeader/`
