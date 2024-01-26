import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotFound, SignIn, Unauthorized } from "src/pages";
import {
  Dashboard,
  GlobalSnackbar,
  Loading,
  ProtectedRoute,
} from "src/components/common";
import { AppRoutes, conf } from "src/config";
import { useAuth } from "src/hooks";

const Expenses = lazy(() =>
  import("src/pages").then((module) => ({ default: module.Expenses }))
);
const ExpenseConcepts = lazy(() =>
  import("src/pages").then((module) => ({ default: module.ExpenseConcepts }))
);

const privateRoutes = [
  {
    route: AppRoutes.Expenses,
    render: <Expenses />,
  },
  {
    route: AppRoutes.ExpenseConcepts,
    render: <ExpenseConcepts />,
  },
];

function App(): JSX.Element {
  const { isLoggedIn } = useAuth();

  return (
    <React.Fragment>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* login routes */}
          <Route
            path={AppRoutes.Index}
            element={<Navigate to={AppRoutes.Login} />}
          />
          <Route
            path={AppRoutes.Login}
            element={
              isLoggedIn ? <Navigate to={conf.LANDING_PAGE} /> : <SignIn />
            }
          />

          {/* protected routes */}
          <Route path={AppRoutes.Index} element={<Dashboard />}>
            {privateRoutes.map((privateRoute) => (
              <Route
                key={privateRoute.route}
                path={privateRoute.route}
                element={<ProtectedRoute>{privateRoute.render}</ProtectedRoute>}
              />
            ))}
          </Route>

          {/* error routes */}
          <Route path={AppRoutes.Unauthorized} element={<Unauthorized />} />
          <Route path={AppRoutes.Wildcard} element={<NotFound />} />
        </Routes>
      </Suspense>
      <GlobalSnackbar />
    </React.Fragment>
  );
}

export default App;
