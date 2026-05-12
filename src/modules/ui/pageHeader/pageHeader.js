import { LightningElement, api } from 'lwc';

export default class PageHeader extends LightningElement {
    @api variant = 'object-home';
    @api iconName;
    @api objectLabel;
    @api title = '';
    @api metaText;
    @api itemCount;

    get headerClass() {
        const base = 'slds-page-header';
        return this.variant === 'record-home' ? `${base} slds-page-header_record-home` : base;
    }

    get hasBreadcrumbs() {
        return this.variant === 'object-home' || this.variant === 'base' || this.variant === 'related-list';
    }

    get hasDetails() {
        return this.variant === 'record-home';
    }

    get hasItemCount() {
        return this.variant === 'related-list' && this.itemCount != null;
    }
}
