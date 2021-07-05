import { Switch } from "react-router-dom";

import routes from "../pages/routes";
import renderRoutes from "../pages/renderRoutes";

export default function Content(props) {

  return (
    <div
      className="site-layout-background"
      style={{
        // margin: "24px 16px",
        padding: 24,
        minHeight: props.minHeight,
      }}
    >
      <Switch>
        {renderRoutes(routes, props.authed, props.authPath, props.extraProps)}
      </Switch>
    </div>
  );
}