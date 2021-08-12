import {
  Route,
  Redirect,
} from "react-router-dom";
import { useAuth } from "../store/use-auth";


export default function PublicRoute({ children, ...rest }) {
    const auth = useAuth();
  
    return (
      <Route
        {...rest}
        render={({ location }) =>
          !auth.user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  }