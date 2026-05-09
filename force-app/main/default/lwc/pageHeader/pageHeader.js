import { LightningElement, api } from 'lwc';

export default class PageHeader extends LightningElement {
    /** 'object-home' | 'record-home' — drives slds-page-header_record-home modifier */
    @api variant = 'object-home';

    /** lightning-icon icon-name, e.g. "standard:contact" */
    @api iconName;

    /** Object type label shown above the title, e.g. "Contact" */
    @api objectLabel;

    /** Page or record title */
    @api title = '';

    /** Secondary meta text below title, e.g. "Mark Jaeckal • Unlimited Customer" */
    @api metaText;

    get headerClass() {
        const base = 'slds-page-header';
        return this.variant === 'record-home' ? `${base} slds-page-header_record-home` : base;
    }

    get hasBreadcrumbs() {
        return this.variant === 'object-home';
    }

    get hasDetails() {
        return this.variant === 'record-home';
    }
}
