import { LightningElement } from 'lwc';
import { subscribe, navigate, linkHref } from '../../../router';
import { routes } from '../../../routes.config';
import { toggleSLDS, activeSLDSVersion, STORAGE_KEY_SLDS_VERSION } from '../../../build/slds-loader';
import IconTest from 'page/iconTest';
import Contacts from 'page/contacts';
import ContactDetail from 'page/contactDetail';
import ConsoleRecord from 'page/consoleRecord';
import Elevations from 'page/elevations';
import Dashboard from 'page/dashboard';
import About from 'page/about';
import NotFound from 'page/notFound';

/** Option A: explicit registration – add one import + one entry here when adding a route */
const ROUTE_COMPONENTS = {
    'page-icon-test': IconTest,
    'page-contacts': Contacts,
    'page-contact-detail': ContactDetail,
    'page-console-record': ConsoleRecord,
    'page-elevations': Elevations,
    'page-dashboard': Dashboard,
    'page-about': About,
};

/** Derived from routes.config: component name → nav page id (includes navHighlight for child routes) */
const ROUTE_TO_NAV_PAGE = Object.fromEntries(
    routes.filter((r) => r.navPage || r.navHighlight).map((r) => [r.component, r.navPage ?? r.navHighlight])
);

/** Derived from routes.config: nav page id → path for navigate() */
const NAV_PAGE_TO_PATH = Object.fromEntries(
    routes.filter((r) => r.navPage).map((r) => [r.navPage, r.navPath ?? r.path])
);

/** Nav items for global navigation (tabs + waffle). From routes with navPage. */
const NAV_ITEMS = routes.filter((r) => r.navPage).map((r) => {
    const path = r.navPath ?? r.path;
    return { page: r.navPage, label: r.navLabel, path, href: linkHref(path) };
});

const STORAGE_KEY_DARK_MODE = 'slds-ui-dark-mode';

export default class App extends LightningElement {
    route;
    _sldsVersion = 2;
    _darkMode = false;
    selectedPanel = 'agentforce_panel';
    isPanelOpen = false;
    routeErrorMessage = null;
    routeErrorStack = null;

    get componentCtor() {
        if (!this.route) return NotFound;
        const name = this.route.component;
        return ROUTE_COMPONENTS[name] ?? NotFound;
    }

    get currentNavPage() {
        const name = this.route?.component;
        return name ? (ROUTE_TO_NAV_PAGE[name] ?? 'home') : 'home';
    }

    get navItems() {
        return NAV_ITEMS;
    }

    get hasRouteError() {
        return !!this.routeErrorMessage;
    }

    get currentPath() {
        return this.route?.path ?? '/';
    }

    connectedCallback() {
        this._restorePreferences();
        this._sldsVersion = activeSLDSVersion();
        this.unsubscribe = subscribe((route) => {
            this.routeErrorMessage = null;
            this.routeErrorStack = null;
            this.route = route;
        });
    }

    errorCallback(error, stack) {
        this.routeErrorMessage = error?.message ?? String(error);
        this.routeErrorStack = stack;
    }

    _restorePreferences() {
        const savedVersion = localStorage.getItem(STORAGE_KEY_SLDS_VERSION);
        const savedDarkMode = localStorage.getItem(STORAGE_KEY_DARK_MODE);
        const version = savedVersion === '1' ? 1 : 2;
        if (savedDarkMode === 'true' && version === 2) {
            this._darkMode = true;
            document.body.classList.add('slds-color-scheme_dark');
        } else if (savedDarkMode === 'false') {
            this._darkMode = false;
            document.body.classList.remove('slds-color-scheme_dark');
        }
    }

    disconnectedCallback() {
        this.unsubscribe?.();
    }

    async handleToggleSLDS() {
        await toggleSLDS();
        this._sldsVersion = activeSLDSVersion();
        localStorage.setItem(STORAGE_KEY_SLDS_VERSION, String(this._sldsVersion));
        if (this._sldsVersion !== 2 && this._darkMode) {
            this._darkMode = false;
            document.body.classList.remove('slds-color-scheme_dark');
            localStorage.setItem(STORAGE_KEY_DARK_MODE, 'false');
        }
    }

    handleToggleDarkMode() {
        this._darkMode = !this._darkMode;
        document.body.classList.toggle('slds-color-scheme_dark', this._darkMode);
        localStorage.setItem(STORAGE_KEY_DARK_MODE, String(this._darkMode));
    }

    handleNavNavigate(event) {
        const page = event.detail?.page;
        const path = page ? NAV_PAGE_TO_PATH[page] : '/';
        navigate(path);
    }

    handlePanelSelect(event) {
        this.selectedPanel = event.detail?.name ?? this.selectedPanel;
        this.isPanelOpen = true;
    }

    handlePanelClose() {
        this.isPanelOpen = false;
    }

    get panelClasses() {
        return `slds-panel slds-size_medium slds-panel_docked slds-panel_docked-right ${this.isPanelOpen ? 'slds-is-open' : ''}`;
    }

    handleRecoverToHome() {
        this.routeErrorMessage = null;
        this.routeErrorStack = null;
        navigate('/');
    }

    handleNavigateBack() {
        history.back();
    }
}
