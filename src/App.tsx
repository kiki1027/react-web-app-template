import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import routes from '@routes';

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

// TODO: 判断有无权限，无权限重定向到 /login

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/login" />} />
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </Router>
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
