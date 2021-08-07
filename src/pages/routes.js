import LoginForm from "./login/Login";
import About from "./about/About";
import Staff from "./staff/Staff";
import Logs from "./trackLog/Logs";
import StaffDetail from "./staff/StaffDetail";
import VehicleDetails from "./vehicle/VehicleDetails";
import Vehicles from "./vehicle/Vehicles";
import Tasks from "./task/Tasks";
import TaskDetail from "./task/TaskDetail";
import Profile from "./profile/Profile";

const routes = [
  {
    path: "/",
    exact: true,
    restricted: true, // <-- NEW
    component: Vehicles,
  },
  {
    path: "/profile",
    exact: true,
    restricted: true, // <-- NEW
    component: Profile,
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
    path: "/vehicles/:id",
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
    path: "/tasks/:id",
    exact: true,
    restricted: true, // <-- NEW
    component: TaskDetail,
  },
  {
    path: "/tasks",
    exact: true,
    restricted: true, // <-- NEW
    component: Tasks,
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
