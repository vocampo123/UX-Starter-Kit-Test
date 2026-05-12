import LightningModal from 'lightning/modal';
import { track } from 'lwc';

export default class DemoModal extends LightningModal {
    @track isSaving = false;

    firstName = '';
    lastName = '';
    email = '';
    phone = '';
    selectedAccount = '';
    description = '';

    get accountOptions() {
        return [
            { label: 'Acme Corp', value: 'acme' },
            { label: 'Global Industries', value: 'global' },
            { label: 'Salesforce', value: 'salesforce' },
        ];
    }

    handleFirstNameChange(event) { this.firstName = event.detail.value; }
    handleLastNameChange(event) { this.lastName = event.detail.value; }
    handleEmailChange(event) { this.email = event.detail.value; }
    handlePhoneChange(event) { this.phone = event.detail.value; }
    handleAccountChange(event) { this.selectedAccount = event.detail.value; }
    handleDescriptionChange(event) { this.description = event.detail.value; }

    handleCancel() {
        this.close();
    }

    handleSave() {
        this.isSaving = true;
        // Simulate async save with spinner, then close
        setTimeout(() => {
            this.close('saved');
        }, 1500);
    }
}
