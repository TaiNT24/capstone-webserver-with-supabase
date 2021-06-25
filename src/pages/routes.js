import LoginForm from "./login/Login";
import About from "./about/About";
import Logs from "../component/trackLog/Logs";

const routes = [
  {
    path: "/",
    exact: true,
    restricted: true, // <-- NEW
    component: Logs,
  },
  {
    path: "/log",
    exact: true,
    restricted: true, // <-- NEW
    component: Logs,
  },
  {
    path: "/about",
    exact: true,
    restricted: true, // <-- NEW
    component: About,
  },
  {
    path: "/login",
    exact: true,
    restricted: false, // <-- NEW
    component: LoginForm,
  },
  {
    path: "*",
    restricted: true, // <-- NEW
    component: () => "Page not found",
  },
];

export default routes;
