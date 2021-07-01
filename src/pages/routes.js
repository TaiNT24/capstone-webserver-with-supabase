import LoginForm from "./login/Login";
import About from "./about/About";
import Staff from "./staff/Staff";
import Logs from "./trackLog/Logs";
import StaffDetail from "./staff/StaffDetail";
import Canvas from "./vehicle/Canvas";
import Vehicles from "./vehicle/Vehicles";
import VehicleDetails from "./vehicle/VehicleDetails";

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
    path: "/canvas",
    exact: true,
    restricted: true, // <-- NEW
    component: Canvas,
  },
  {
    path: "/vehicles/:code",
    exact: true,
    restricted: true, // <-- NEW
    component: VehicleDetails,
  },
  {
    path: "/vehicles",
    exact: true,
    restricted: true, // <-- NEW
    component: Vehicles,
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
