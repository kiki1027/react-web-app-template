import { BrowserRouter as Router, Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import routes, { useFirstRoutePath } from '@routes';
import { AppProvider } from '@components';
import { useAuth } from '@components/app/provider';
import Loadable from '@utils/loadable';

// 登录页
const LoginPage = Loadable({ loader: () => import('@views/login') });

function RouteWithSubRoutes(route) {
  const user = useAuth()?.user;
  return (
    <Route
      path={route.path}
      render={(props: RouteComponentProps) => {
        // sub-routes
        if (!user) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                // 带着上次的记录
                state: { from: props.location },
              }}
            />
          );
        }
        return <route.component {...props} routes={route.routes} />;
      }}
    />
  );
}

const App = () => {
  const firstRoutePath = useFirstRoutePath();
  const user = useAuth()?.user;
  return (
    <AppProvider>
      <Router>
        <Switch>
          {/* '/'首页默认重定向 privateRoutes 中的第一级路由 */}
          <Route path="/" exact render={() => <Redirect to={firstRoutePath} />} />
          {/* '/login'已登录状态重定向到首页，未登录状态则重定向登录页 */}
          <Route path="/login" render={() => (user ? <Redirect to="/" /> : <LoginPage />)} />
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          {/* no match 的情况（404） */}
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    </AppProvider>
  );
};

export default App;

// function Sandwiches() {
//   return <h2>Sandwiches</h2>;
// }

// function Tacos({ routes }) {
//   return (
//     <div>
//       <h2>Tacos</h2>
//       <ul>
//         <li>
//           <Link to="/tacos/bus">Bus</Link>
//         </li>
//         <li>
//           <Link to="/tacos/cart">Cart</Link>
//         </li>
//       </ul>

//       <Switch>
//         {routes.map((route, i) => (
//           <RouteWithSubRoutes key={i} {...route} />
//         ))}
//       </Switch>
//     </div>
//   );
// }

// function Bus() {
//   return <h3>Bus</h3>;
// }

// function Cart() {
//   return <h3>Cart</h3>;
// }
