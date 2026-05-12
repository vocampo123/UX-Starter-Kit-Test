/**
 * Single source of truth for app routes.
 * Consumed by router.js (matching, titles) and app (nav maps, nav items).
 *
 * Fields:
 *   path       - URL pattern (use :param for dynamic segments)
 *   component  - LWC component name (must be registered in app.js ROUTE_COMPONENTS)
 *   title      - Document title (string or (params) => string)
 *   navPage    - Id for nav active state and navigate({ page }) (omit to hide from nav)
 *   navLabel   - Label shown in nav bar and waffle
 *   navPath    - Optional; for dynamic routes, path used in nav links (e.g. /users/42)
 *   navHighlight - Optional; nav page id to highlight when this route is active (for child routes that don't create a tab)
 */

// STARTER KIT SHOWCASE ROUTES — replace these when building a demo.
// Do NOT add demo routes alongside these; demos should be standalone.
// See CLAUDE.md "Adding a new page" for the correct approach.
export const routes = [
  {
    path: '/',
    component: 'page-about',
    title: 'About',
    navPage: 'about',
    navLabel: 'About',
  },
  {
    path: '/icons',
    component: 'page-icon-test',
    title: 'Icons',
    navPage: 'icons',
    navLabel: 'Icons',
  },
{
    path: '/contacts',
    component: 'page-contacts',
    title: 'Contacts',
    navPage: 'contacts',
    navLabel: 'Contacts',
  },
  {
    path: '/contacts/:id',
    component: 'page-contact-detail',
    title: (params) => `Contact ${params.id}`,
    navHighlight: 'contacts',
  },
  {
    path: '/console-record',
    component: 'page-console-record',
    title: 'Console Record',
    navPage: 'console-record',
    navLabel: 'Console Record',
  },
  {
    path: '/elevations',
    component: 'page-elevations',
    title: 'Elevations',
    navPage: 'elevations',
    navLabel: 'Elevations',
  },
  {
    path: '/dashboard',
    component: 'page-dashboard',
    title: 'Dashboard',
    navPage: 'dashboard',
    navLabel: 'Dashboard',
  },
];
