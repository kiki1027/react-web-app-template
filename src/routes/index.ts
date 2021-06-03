import Loadable from '@utils/loadable';

const Page1 = Loadable({ loader: () => import('@views/page1') });

const routes = [
  {
    path: '/page1',
    component: Page1,
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

/**
 * 得到第一级路由的路径
 * @date 2021-06-03
 * @returns {string}
 */
export const useFirstRoutePath = () => {
  return routes?.[0]?.path;
};

export default routes;
