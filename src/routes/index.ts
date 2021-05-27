import Loadable from '@utils/loadable';

const LoginPage = Loadable({ loader: () => import('@views/login') });

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.

const routes = [
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/page1',
    // component: Tacos,
    routes: [
      {
        path: '/page1/subPage1',
        // component: Bus,
      },
      {
        path: '/page1/subPage2',
        // component: Cart,
      },
    ],
  },
];

export default routes;