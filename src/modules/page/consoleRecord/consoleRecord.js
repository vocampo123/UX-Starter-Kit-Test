import { LightningElement } from 'lwc';

const UTILITY_ITEMS = [
    { id: 'u1', label: 'Omni-Channel (Online)', iconName: 'utility:omni_channel' },
    { id: 'u2', label: 'Macros', iconName: 'utility:macros' },
    { id: 'u3', label: 'History', iconName: 'utility:clock' },
    { id: 'u4', label: 'Notes', iconName: 'utility:note' },
];

const CASE_COLUMNS = [
    { label: 'Case Number', fieldName: 'caseNumber', type: 'text' },
    { label: 'Subject', fieldName: 'subject', type: 'text' },
    { label: 'Status', fieldName: 'status', type: 'text' },
    { label: 'Priority', fieldName: 'priority', type: 'text' },
];

const OPPORTUNITY_COLUMNS = [
    { label: 'Name', fieldName: 'name', type: 'text' },
    { label: 'Stage', fieldName: 'stage', type: 'text' },
    { label: 'Amount', fieldName: 'amount', type: 'currency' },
    { label: 'Close Date', fieldName: 'closeDate', type: 'date' },
];

const CASES = [
    { id: 'c1', caseNumber: '00001023', subject: 'Login issue on mobile app', status: 'Open', priority: 'High' },
    { id: 'c2', caseNumber: '00001019', subject: 'Billing discrepancy Q3', status: 'Working', priority: 'Medium' },
    { id: 'c3', caseNumber: '00000987', subject: 'Feature request: dark mode', status: 'Closed', priority: 'Low' },
];

const OPPORTUNITIES = [
    { id: 'o1', name: 'Acme Corp Renewal 2025', stage: 'Proposal/Price Quote', amount: 120000, closeDate: '2025-06-30' },
    { id: 'o2', name: 'Acme Corp — Cirrus Upsell', stage: 'Needs Analysis', amount: 45000, closeDate: '2025-08-15' },
];

export default class ConsoleRecord extends LightningElement {
    utilityItems = UTILITY_ITEMS;
    caseColumns = CASE_COLUMNS;
    opportunityColumns = OPPORTUNITY_COLUMNS;
    cases = CASES;
    opportunities = OPPORTUNITIES;

    handleScopedTabClick(event) {
        event.preventDefault();
        const clickedLink = event.currentTarget;
        const panelId = clickedLink.getAttribute('aria-controls');
        const container = clickedLink.closest('.slds-tabs_scoped');

        container.querySelectorAll('.slds-tabs_scoped__item').forEach((item) => {
            item.classList.remove('slds-is-active');
        });
        container.querySelectorAll('.slds-tabs_scoped__link').forEach((link) => {
            link.setAttribute('aria-selected', 'false');
        });
        container.querySelectorAll('.slds-tabs_scoped__content').forEach((panel) => {
            panel.classList.add('slds-hide');
        });

        clickedLink.closest('.slds-tabs_scoped__item').classList.add('slds-is-active');
        clickedLink.setAttribute('aria-selected', 'true');
        container.querySelector(`#${panelId}`).classList.remove('slds-hide');
    }
}
