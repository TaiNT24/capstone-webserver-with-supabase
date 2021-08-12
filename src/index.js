import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ProvideAuth } from "./store/use-auth";

ReactDOM.render(
  // <React.StrictMode>
  <Router>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </Router>,
  // </React.StrictMode>,
  document.getElementById("root")
);
