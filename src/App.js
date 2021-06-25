import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth } from "./lib/use-auth";

import "./App.less";

import LoginForm from "./pages/login/Login";
import Home from "./pages/home/Home";
import PublicRoute from "./component/PublicRoute";

const authPath = '/login';

const App = () => {
  let auth = useAuth();
  let authed = auth.isLogin();

  console.log("App.js init: " + auth.user);
  return (
    <Switch>
      <PublicRoute path="/login">
        <LoginForm />
      </PublicRoute>

      <Route>
        <Home authed={authed} authPath={authPath} />
      </Route>
    </Switch>
  );
};

export default App;
