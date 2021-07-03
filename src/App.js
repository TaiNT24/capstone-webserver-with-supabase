import React from "react";
import { Route, Switch } from "react-router-dom";

import "./App.less";

import LoginForm from "./pages/login/Login";
import Home from "./pages/home/Home";
import PublicRoute from "./component/PublicRoute";

export default function App() {
  console.log("App.js init: ");
  
  return (
    <Switch>
      <PublicRoute path="/login">
        <LoginForm />
      </PublicRoute>

      <Route>
        <Home/>
      </Route>
    </Switch>
  );
}
