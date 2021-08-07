import { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";

import "./App.less";

import LoginForm from "./pages/login/Login";
import Home from "./pages/home/Home";
import PublicRoute from "./component/PublicRoute";
import RecoveryPassword from "./pages/reset-password/RecoveryPassword";

export default function App() {
  let location = useLocation();

  useEffect(() => {
    if( location.state?.from?.pathname === "/recovery-password"
     || location.pathname === "/recovery-password"
    ){
      localStorage.clear();
    }
  });
  console.log("App.js init: ");

  return (
    <Switch>
      <PublicRoute path="/login">
        <LoginForm />
      </PublicRoute>

      <PublicRoute path="/recovery-password">
        <RecoveryPassword />
      </PublicRoute>

      <Route>
        <Home/>
      </Route>
    </Switch>
  );
}
