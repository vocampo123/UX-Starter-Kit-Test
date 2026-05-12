import { LightningElement } from 'lwc';

export default class Dashboard extends LightningElement {

    contactsData = [
        { id: 'c1', account: 'Nintendo', name: 'Becca Yukolson', title: 'Sales Assistant' },
        { id: 'c2', account: 'eBay', name: 'Nicole McGovern', title: 'VP of Technology' },
        { id: 'c3', account: 'Gilette', name: 'John McGinn', title: 'UX Designer' },
        { id: 'c4', account: 'Ferrari', name: 'Alwin Mulyono', title: 'Sales Director' },
        { id: 'c5', account: 'Nike', name: 'Angie Elko', title: 'Sales Manager' },
        { id: 'c6', account: 'Porsche', name: 'Adam Doti', title: 'Sales Assistant' },
    ];

    contactsColumns = [
        { label: 'Account', fieldName: 'account', type: 'text' },
        { label: 'Name', fieldName: 'name', type: 'text' },
        { label: 'Title', fieldName: 'title', type: 'text' },
    ];

    accountTiles = [
        { id: 't1', name: 'Kristen Jones', initials: 'KJ', title: 'VP of Sales', role: 'Decision Maker' },
        { id: 't2', name: 'Kristen Jones', initials: 'KJ', title: 'VP of Sales', role: 'Decision Maker' },
        { id: 't3', name: 'Lauren Bailey', initials: 'LB', title: 'VP of Sales', role: 'Decision Maker' },
        { id: 't4', name: 'Steve Handler', initials: 'SH', title: 'VP of Sales', role: 'Decision Maker' },
    ];

    pipelineStages = [
        { id: 'p1', label: 'Qualifying', value: '$50k', barStyle: 'width:100%' },
        { id: 'p2', label: 'Proposal', value: '$35k', barStyle: 'width:70%' },
        { id: 'p3', label: 'Negotiation', value: '$25k', barStyle: 'width:50%' },
        { id: 'p4', label: 'Closed Won', value: '$15k', barStyle: 'width:30%' },
    ];
}
