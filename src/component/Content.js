import { Switch } from "react-router-dom";

import routes from "../pages/routes";
import renderRoutes from "../pages/renderRoutes";
import { useStoreGetDevice } from "../lib/Store";

export default function Content(props) {

  const { devices } = useStoreGetDevice();

  const extraProps = {
    devices: devices
  };

  return (
    <div
      className="site-layout-background"
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: props.minHeight,
      }}
    >
      <Switch>
        {renderRoutes(routes, props.authed, props.authPath, extraProps)}
      </Switch>
    </div>
  );
}

function About() {
  return "<h1>About</h1>";
}
