import { LightningElement, track } from 'lwc';
import Toast from 'lightning/toast';
import DemoModal from 'c/demoModal';

export default class About extends LightningElement {

    _errorShown = false;

    renderedCallback() {
        if (this._errorShown) return;
        const errorInput = this.template.querySelector('.about-input-error');
        if (errorInput) {
            errorInput.reportValidity();
            this._errorShown = true;
        }
    }

    // Console nav sample toggle
    @track showSubtabs = false;

    // Page header sample toggle
    @track headerVariant = 'object-home';

    // Input samples state
    inputValue = '';
    checkboxGroupValues = [];
    selectedRadioValue = 'option1';
    selectedComboboxValue = 'option1';
    sliderValue = 50;
    textAreaValue = '';
    dateValue = '';
    toggleValue = false;

    // View mode static field values
    viewFirstName = 'Sarah';
    viewLastName = 'White';
    viewEmail = 'sarah.white@acme.com';
    viewPhone = '(415) 555-1234';

    skills = [
        {
            id: 'starter-onboarding',
            name: 'Guided Setup',
            icon: 'utility:setup',
            description: 'Walks a new user through the kit: what it does, local dev setup, org auth, and the questions to understand what you want to build.',
            trigger: '"help me get started" or "how do I begin"',
        },
        {
            id: 'prd-to-salesforce-ui',
            name: 'PRD to Salesforce UI',
            icon: 'utility:contract',
            description: 'Build Salesforce UI from a PRD or verbal description when no design file is provided. Classifies the page archetype, reads the matching pattern doc, and implements the correct layout.',
            trigger: 'Describing what a page should do without providing a Figma link',
        },
        {
            id: 'org-discovery',
            name: 'Org Discovery',
            icon: 'utility:search',
            description: 'Safely inspects a target Salesforce org before building to find existing components, objects, and capabilities that can be reused instead of rebuilt.',
            trigger: '"Does X already exist in my org?" or providing an org alias with requirements',
        },
        {
            id: 'salesforce-deploy',
            name: 'Salesforce Deploy',
            icon: 'utility:upload',
            description: 'Guides Salesforce CLI auth, deploy validation, deployment, and common troubleshooting. Covers connecting an org, validating metadata, and deploying force-app/ components.',
            trigger: '"deploy to my org" or "connect to Salesforce"',
        },
        {
            id: 'first-time-deploy',
            name: 'Publish to GitHub Pages',
            icon: 'utility:link',
            description: 'Publishes the local prototype to GitHub Pages so stakeholders can view it via a shareable link without needing Node.js installed.',
            trigger: '"share a link" or "deploy to GitHub Pages"',
        },
        {
            id: 'repo-setup',
            name: 'Repo Setup',
            icon: 'utility:github',
            description: 'Creates a new remote GitHub repository, installs the GitHub CLI if needed, authenticates, and pushes the initial commit.',
            trigger: '"create a GitHub repo" or "set up version control"',
        },
    ];

    guidelines = [
        {
            id: 'spacing',
            category: 'Spacing',
            name: 'Spacing Rules',
            description: 'Enforces the 7 rules that prevent 90% of spacing bugs: card body padding, gap-based vertical rhythm, tab panel double-padding prevention, density-aware utilities, and the shadow-inheritance trap fix.',
            example: 'Uses gap on a flex column instead of per-item slds-m-bottom_* so rows wrap correctly on smaller viewports.',
        },
        {
            id: 'page-header',
            category: 'Components',
            name: 'Page Header Pattern',
            description: 'Documents the correct token (--slds-g-color-surface-container-2), flex structure (slds-has-flexi-truncate + slds-no-flex), and slot pattern. Backed by the ui-page-header / c-page-header component so the agent can\'t get these wrong.',
            example: 'Prevents slds-page-header__col-title (wrong) vs slds-has-flexi-truncate (correct) from being mixed up.',
        },
        {
            id: 'related-lists',
            category: 'Components',
            name: 'Related List Cards',
            description: 'Covers the cosmos SLDS 2 token overrides that make related list cards look correct: --_slds-c-datatable-color-border for the table border, View All placed as a footer below the table (not in the card actions slot).',
            example: 'Prevents agents from using --slds-g-color-border-base-1 (does not work in cosmos) vs --_slds-c-datatable-color-border (correct).',
        },
        {
            id: 'slds-tokens',
            category: 'Tokens',
            name: 'SLDS 2 Token Reference',
            description: 'Surface color, shadow elevation, border, and spacing token tables. Prevents hardcoded hex values and incorrect surface token choices (e.g., container-1 vs container-2 for page headers).',
            example: 'Page headers use --slds-g-color-surface-container-2 (#f3f3f3), not container-1 (#ffffff).',
        },
        {
            id: 'ui-patterns',
            category: 'Patterns',
            name: 'UI Pattern Library',
            description: 'Pattern docs for Record Detail, List View, Dashboard, Console Navigation, Command Center, and Forms. Each doc covers the platform vs LWC split, zone widths, recommended LBCs, and confirmed SLDS hooks.',
            example: 'Record Detail pattern defines which layers Salesforce provides (record header, activity panel) vs which the LWC builds (tabset, related lists).',
        },
        {
            id: 'lbc-mapping',
            category: 'Components',
            name: 'LBC Substitution Table',
            description: 'Maps every common UI element to its correct Lightning Base Component. Prevents agents from writing custom HTML for buttons, inputs, tables, modals, icons, and more that LBCs already handle correctly.',
            example: 'Dialogs → LightningModal (not raw slds-modal). Overflow menus → lightning-button-menu (not custom dropdown).',
        },
    ];

    get comboboxOptions() {
        return [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
        ];
    }

    get radioOptions() {
        return [
            { label: 'Radio Option 1', value: 'option1' },
            { label: 'Radio Option 2', value: 'option2' },
            { label: 'Radio Option 3', value: 'option3' },
        ];
    }

    get checkboxOptions() {
        return [
            { label: 'Checkbox Option 1', value: 'checkbox1' },
            { label: 'Checkbox Option 2', value: 'checkbox2' },
            { label: 'Checkbox Option 3', value: 'checkbox3' },
        ];
    }

    opportunityData = [
        { id: '1', name: 'Acme Q1 Renewal', amount: '$45,000', stage: 'Proposal', closeDate: '3/31/2026' },
        { id: '2', name: 'Acme Expansion', amount: '$120,000', stage: 'Negotiation', closeDate: '6/15/2026' },
        { id: '3', name: 'Acme Support', amount: '$12,000', stage: 'Closed Won', closeDate: '1/10/2026' },
    ];

    opportunityColumns = [
        { label: 'Name', fieldName: 'name', type: 'text' },
        { label: 'Amount', fieldName: 'amount', type: 'text' },
        { label: 'Stage', fieldName: 'stage', type: 'text' },
        { label: 'Close Date', fieldName: 'closeDate', type: 'text' },
    ];


    get noSubtabsVariant() {
        return this.showSubtabs ? 'neutral' : 'brand';
    }

    get withSubtabsVariant() {
        return this.showSubtabs ? 'brand' : 'neutral';
    }

    handleSubtabsToggle(event) {
        this.showSubtabs = event.currentTarget.dataset.subtabs === 'true';
    }

    get isBase() { return this.headerVariant === 'base'; }
    get isObjectHome() { return this.headerVariant === 'object-home'; }
    get isRecordHome() { return this.headerVariant === 'record-home'; }
    get isRelatedList() { return this.headerVariant === 'related-list'; }

    get headerIconName() {
        if (this.headerVariant === 'base') return undefined;
        if (this.headerVariant === 'related-list') return undefined;
        return 'standard:contact';
    }

    get headerObjectLabel() {
        if (this.headerVariant === 'base') return undefined;
        if (this.headerVariant === 'object-home') return 'Contacts';
        if (this.headerVariant === 'related-list') return undefined;
        return 'Contact';
    }

    get headerTitle() {
        if (this.headerVariant === 'base') return 'Recently Viewed';
        if (this.headerVariant === 'object-home') return 'All Contacts';
        if (this.headerVariant === 'related-list') return 'Contacts (will truncate)';
        return 'Jane Smith';
    }

    get headerMetaText() {
        return this.headerVariant === 'record-home' ? 'VP of Sales · Acme Corp' : undefined;
    }

    get headerItemCount() {
        return this.headerVariant === 'related-list' ? '10 items · sorted by name' : undefined;
    }

    get baseVariantBtn() { return this.headerVariant === 'base' ? 'brand' : 'neutral'; }
    get objectHomeVariant() { return this.headerVariant === 'object-home' ? 'brand' : 'neutral'; }
    get recordHomeVariant() { return this.headerVariant === 'record-home' ? 'brand' : 'neutral'; }
    get relatedListVariant() { return this.headerVariant === 'related-list' ? 'brand' : 'neutral'; }

    handleVariantToggle(event) {
        this.headerVariant = event.currentTarget.dataset.variant;
    }

    handleInputChange(event) { this.inputValue = event.detail.value; }
    handleCheckboxChange(event) { this.checkboxGroupValues = event.detail.value; }
    handleRadioChange(event) { this.selectedRadioValue = event.detail.value; }
    handleComboboxChange(event) { this.selectedComboboxValue = event.detail.value; }
    handleSliderChange(event) { this.sliderValue = event.detail.value; }
    handleTextAreaChange(event) { this.textAreaValue = event.detail.value; }
    handleDateChange(event) { this.dateValue = event.detail.value; }
    handleToggleChange(event) { this.toggleValue = event.detail.checked; }

    handleButtonClick() {
        Toast.show({ label: 'Button clicked', message: 'Base button was clicked.', variant: 'info', mode: 'dismissible' });
    }
    handleBrandButton() {
        Toast.show({ label: 'Brand', message: 'Brand button was clicked.', variant: 'info', mode: 'dismissible' });
    }
    handleSuccessButton() {
        Toast.show({ label: 'Success', message: 'Success button was clicked.', variant: 'success', mode: 'dismissible' });
    }
    handleNeutralButton() {
        Toast.show({ label: 'Neutral', message: 'Neutral button was clicked.', variant: 'info', mode: 'dismissible' });
    }
    handleDestructiveButton() {
        Toast.show({ label: 'Destructive', message: 'Destructive button was clicked.', variant: 'error', mode: 'dismissible' });
    }
    handleOpenModal() {
        DemoModal.open({ size: 'medium', label: 'Demo Modal' });
    }
}
