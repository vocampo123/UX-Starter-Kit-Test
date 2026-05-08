# Forms Pattern

**Source:** SLDS 2 Components Web — Form Element Guidelines (`22776:17593`) and Form Element Grab-n-Go Examples (`22776:17638`), Cosmos Library · Salesforce UX

---

## Platform vs LWC

> **Runtime context:** This split applies to **org-deployed components** in `force-app/main/default/lwc/`. For **local prototype pages** in `src/modules/page/`, build forms using the LBC compositions described below — the prototype has no Salesforce object model to bind to.

For record create/edit flows on a Salesforce object in an org, the platform provides ready-made form components. Use them before building custom forms.

| Need | Use this | Implement in LWC? |
|---|---|---|
| Create or edit a record with object's standard fields | `lightning-record-form` (built-in) | No — use the LBC directly |
| Display a record's standard fields in read mode | `lightning-record-view-form` + `lightning-output-field` | No — use the LBCs directly |
| Custom edit form with field-level control over layout | `lightning-record-edit-form` + `lightning-input-field` | Wrap in an LWC; use the LBCs |
| Standalone form not tied to a Salesforce record (search, filter, calculator) | Custom LWC composing `lightning-input`, `lightning-textarea`, etc. | Yes |
| Quick action form on a record | Quick Action (declarative) or LWC quick action | Use Quick Action when possible |

**Rule:** When the form's purpose is "create or edit a record of object X with these fields," use `lightning-record-form` or `lightning-record-edit-form`. Salesforce handles field validation, FLS, layouts, and save logic automatically. Build a custom form composition only when the data is not record-bound or the layout requires structure those components cannot express.

---

## When to use

Use this pattern when the PRD describes:
- Creating or editing a record with multiple fields
- A modal or panel with input fields
- Any screen that collects data from the user

The Form Element is not a single supported LBC — it is a composition of individual LBCs (inputs, labels, groups) arranged in a layout. Always use individual LBCs per field type; never build custom input markup from scratch.

---

## LBC mapping by input type

| Input type | LBC | When to use |
|---|---|---|
| Short text, number, email, phone, date | `lightning-input` | Single-line freeform entry |
| Multi-line text | `lightning-textarea` | Long descriptions, notes, comments |
| Multiple checkboxes | `lightning-checkbox-group` | Select zero or more from a set |
| Single selection from a list | `lightning-radio-group` | Select exactly one from a small set |
| Multi-select with ordering | `lightning-dual-listbox` | Move options between Available and Selected lists; also used when order matters |
| Dropdown single-select | `lightning-combobox` | Select one from a longer list; searchable |
| File upload | `lightning-file-upload` | Attach one or more files to a record |
| Toggle | `lightning-input type="toggle"` | Binary on/off setting |
| Date/time | `lightning-input type="datetime"` | Date and time combined |

---

## Field anatomy

Every field is: **Label** (above) + **Input** (below). Never omit the label — it is required for accessibility.

```
Field Label          ← Semibold 13px, --slds-g-color-on-surface-2
┌─────────────────┐  ← border: --slds-g-color-border-2 (#5c5c5c)
│ Placeholder...  │  ← 32px height, radius: --slds-g-radius-border-2 (8px)
└─────────────────┘    placeholder: --slds-g-color-on-surface-1 (#5c5c5c)
```

For `lightning-input` and `lightning-textarea`, the LBC renders the label and input together — pass `label="Field Label"` as a prop. Do not build a separate `<label>` element.

---

## Layout variants (from Figma grab-n-go examples)

### Base
Single input field, label above, full width within its container.

```html
<lightning-input label="Field Label" placeholder="Placeholder text..." />
```

### Required
Add `required` attribute. The LBC renders the asterisk automatically.

```html
<lightning-input label="Field Label" required />
```

### Error
Add `field-level-help` or set `message-when-value-missing` / custom `validity`. The LBC renders the error message and error border automatically.

```html
<lightning-input label="Field Label" required message-when-value-missing="This field is required." />
```

### Stacked (multi-field vertical)
Multiple fields in a single column, each full width. Use `slds-form` + `slds-form-element` blueprint classes for the wrapper, or simply stack LBCs with a CSS gap.

```html
<div class="slds-form slds-form_stacked">
  <lightning-input label="First Name" />
  <lightning-input label="Last Name" />
  <lightning-input label="Email" type="email" />
</div>
```

### Horizontal (50/50 split — Single Column with label left, input right)
Label takes 50% width, input takes 50% width. Use `slds-form_horizontal` class on the wrapper.

```html
<div class="slds-form slds-form_horizontal">
  <lightning-input label="Field Label" />
</div>
```

### Compound row (multiple fields side by side in one row)
Two or more inputs arranged horizontally in a single row. Use `slds-form__row` + `slds-form__item` blueprint classes.

```html
<div class="slds-form__row">
  <div class="slds-form__item">
    <lightning-input label="First Name" />
  </div>
  <div class="slds-form__item">
    <lightning-input label="Last Name" />
  </div>
</div>
```

### Compound address
Specific compound row pattern for address fields:

```html
<div class="slds-form__row">
  <div class="slds-form__item slds-grow">
    <lightning-input label="Street" />
  </div>
</div>
<div class="slds-form__row">
  <div class="slds-form__item">
    <lightning-input label="City" />
  </div>
  <div class="slds-form__item">
    <lightning-input label="State/Province" />
  </div>
  <div class="slds-form__item">
    <lightning-input label="Zip/Postal Code" />
  </div>
</div>
<div class="slds-form__row">
  <div class="slds-form__item slds-grow">
    <lightning-input label="Country" />
  </div>
</div>
```

### Record view mode — compact display fields

View state and edit state are **two separate implementations**. Do not use `lightning-input read-only` for view state — it renders input chrome (box, focus ring) where no input chrome belongs.

Use `slds-form-element_stacked` with `slds-form-element__static` for view state:

```html
<!-- View state — compact display field -->
<div class="slds-form-element slds-form-element_stacked">
  <span class="slds-form-element__label slds-text-title">Field Label</span>
  <div class="slds-form-element__control">
    <span class="slds-form-element__static slds-truncate">{fieldValue}</span>
  </div>
</div>
```

For formatted values in view state, use the appropriate output LBC inside the control div:
- Email: `<lightning-formatted-email value={email}>`
- Phone: `<lightning-formatted-phone value={phone}>`
- Date: `<lightning-formatted-date-time value={date}>`
- URL: `<lightning-formatted-url value={url}>`

### Record edit mode — editable stacked

When the user enters edit mode, replace display fields with the correct input LBC. Preserve the same two-column grid, section structure, and field order. Edit controls are taller than display fields — that is expected.

```html
<!-- Edit state — same field in edit mode -->
<lightning-input label="Field Label" value={fieldValue} onchange={handleChange}></lightning-input>
```

Show Save (`variant="brand"`) and Cancel buttons. Return to compact display fields after save or cancel.

**The rule:** `lightning-input` is for edit mode only. Never leave `lightning-input read-only` visible in view mode.

---

## Selection inputs

### Checkbox group

```html
<lightning-checkbox-group
  label="Select options"
  name="checkboxGroup"
  options={checkboxOptions}
  value={selectedValues}
  onchange={handleChange}
/>
```

`options` is an array of `{ label, value }` objects. `value` is an array of selected values.

### Radio group

```html
<lightning-radio-group
  label="Select one option"
  name="radioGroup"
  options={radioOptions}
  value={selectedValue}
  type="radio"
  onchange={handleChange}
/>
```

Use `type="button"` for a button-group variant of radio selection.

### Dueling picklist (multi-select with ordering)

```html
<lightning-dual-listbox
  label="Select options"
  source-label="Available"
  selected-label="Selected"
  options={options}
  value={selectedValues}
  onchange={handleChange}
/>
```

Use when the user needs to move items from an available list to a selected list, and optionally reorder the selected items.

---

## Textarea

```html
<lightning-textarea
  label="Field Label"
  placeholder="Placeholder Text"
  value={value}
  onchange={handleChange}
/>
```

The Figma source shows a resize grabber in the bottom-right corner — this is rendered automatically by the browser for `<textarea>` elements and preserved by `lightning-textarea`.

Height defaults to 3 rows (`rows="3"`). Increase with `rows` prop for longer content.

---

## SLDS hooks (confirmed in Figma source)

| Hook | Value | Use for |
|---|---|---|
| `--slds-g-color-surface-container-1` | `white` | Input background |
| `--slds-g-color-border-2` | `#5c5c5c` | Input border (default and focus) |
| `--slds-g-color-on-surface-1` | `#5c5c5c` | Placeholder text, help text |
| `--slds-g-color-on-surface-2` | `#2e2e2e` | Field labels, input text |
| `--slds-g-color-error-1` | `#b60554` | Error border, error message text |
| `--slds-g-color-warning-1` | `#8c4b02` | Warning indicators |
| `--slds-g-color-success-1` | `#056764` | Success/valid indicators |
| `--slds-g-radius-border-2` | `8px` | Input border radius |
| `--slds-g-spacing-2` | `8px` | Input vertical padding |
| `--slds-g-spacing-3` | `12px` | Input/textarea horizontal padding |
| `--slds-g-font-size-base` | `13px` | Input text, label text |
| `--slds-g-font-weight-6` | `590` | Label semibold weight |

---

## States

| State | How to implement |
|---|---|
| Default | `lightning-input label="..."` |
| Required | Add `required` attribute |
| Error | Set `validity` or use built-in `message-when-*` props |
| Disabled | Add `disabled` attribute |
| Read-only | Add `read-only` attribute |
| Loading (async validation) | Use `lightning-spinner` adjacent to the field |

---

## Design rationale notes

These reflect Salesforce's first-party form element decisions. Use as defaults; follow requirements when they specify something different.

- **Raw HTML inputs** — `lightning-input` and related LBCs include label rendering, error message rendering, ARIA attributes, and SLDS token theming automatically. Only use raw `<input>`, `<select>`, or `<textarea>` when a specific requirement cannot be met by an LBC — this should be rare.
- **Label omission** — every field must have a visible label. Visually hidden labels (using `variant="label-hidden"`) are acceptable only inside compound fields where a heading provides the group context, or in table/grid inline edit situations. Never omit the label entirely.
- **Stacked vs horizontal layout** — stacked (label above) is the default and works at all viewport widths. Horizontal (label left, input right) requires wider containers; use it only when the PRD specifies a two-column label/field layout or when vertical space is constrained.
- **Compound address block** — always use the compound row pattern for addresses; never put all address fields in a single `lightning-input`. Each sub-field (street, city, state, zip, country) should be its own `lightning-input`.
- **Dueling picklist vs multi-select combobox** — use `lightning-dual-listbox` when the user needs to select multiple items and the order of selection matters, or when the pool of available items is large. Use `lightning-checkbox-group` when the options are few (typically fewer than 7) and order does not matter.
