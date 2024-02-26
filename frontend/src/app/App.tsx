import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { NotFound, SignIn, Unauthorized } from "src/pages";
import {
  Dashboard,
  GlobalSnackbar,
  Loading,
  ProtectedRoute,
} from "src/components/common";
import { AppRoutes, conf } from "src/config";
import { useAuth } from "src/hooks";
import { Box } from "@mui/material";

const Expenses = lazy(() =>
  import("src/pages").then((module) => ({ default: module.Expenses }))
);
const ExpenseConcepts = lazy(() =>
  import("src/pages").then((module) => ({ default: module.ExpenseConcepts }))
);
const Clients = lazy(() =>
  import("src/pages").then((module) => ({ default: module.Clients }))
);
const Rentals = lazy(() =>
  import("src/pages").then((module) => ({ default: module.Rentals }))
);
const Sales = lazy(() =>
  import("src/pages").then((module) => ({ default: module.Sales }))
);
const Products = lazy(() =>
  import("src/pages").then((module) => ({ default: module.Products }))
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
  {
    route: AppRoutes.Clients,
    render: <Clients />,
  },
  {
    route: AppRoutes.Rentals,
    render: <Rentals />,
  },
  {
    route: AppRoutes.Sales,
    render: <Sales />,
  },
  {
    route: AppRoutes.Products,
    render: <Products />,
  },
];

function App(): JSX.Element {
  const { isLoggedIn } = useAuth();

  return (
    <React.Fragment>
      <Suspense
        fallback={
          <Box sx={{ position: "absolute", top: "50%", left: "50%" }}>
            <Loading />
          </Box>
        }
      >
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
