import LoginForm from "./login/Login";
import About from "./about/About";
import Staff from "./staff/Staff";
import Logs from "./trackLog/Logs";
import StaffDetail from "./staff/StaffDetail";

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
    path: "/staff/:id",
    exact: true,
    restricted: true, // <-- NEW
    component: StaffDetail,
  },
  {
    path: "/staff",
    exact: true,
    restricted: true, // <-- NEW
    component: Staff,
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
