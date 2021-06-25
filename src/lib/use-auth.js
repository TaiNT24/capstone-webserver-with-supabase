import React, { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "./Store";
import { useHistory, useLocation } from "react-router-dom";

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const session = supabase.auth.session();

    setUser(session?.user ?? null);

    if (user) {
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        console.log("onAuthStateChange: "+ session);
        console.log("event: "+ event);

        if (currentUser) {

          let isValidRole = await validRole(currentUser.id);
          if (isValidRole) {
            setUser(currentUser);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, [user]);

  const isLogin = () => {
    let session = supabase.auth.session();

    if (session) {
      if (session.user) {
        return true;
      }
    }
    return false;
  };

  const validRole = async (id) => {
    let { data: accounts, error: error_validRole } = await supabase
      .from("accounts")
      .select("role")
      .eq("id", id);

    if (error_validRole) {
      console.log("validRole_use-auth error: " + error_validRole);
      error_return = error_validRole;
    }

    return accounts[0].role === "admin";
  };

  const signin = async (email, password, callbackFunc) => {
    let error_return = null;

    try {
      const {
        user: user_signin,
        session,
        error,
      } = await supabase.auth.signIn({
        email: email,
        password: password,
      });
      if (error) {
        error_return = error;
      } else {
        console.log(user_signin);

        let isValid = await validRole(user_signin.id);

        if (isValid) {
          setUser(user_signin);
        } else {
          error_return = {
            message: "Only Manager can access this website!",
          };
          let { error } = await supabase.auth.signOut();
          if (error) throw error;
        }
      }
    } catch (error) {
      console.log("error", error);
      alert(error.error_description || error);
      error_return = error;
    }

    if (user) {
      console.log("Call back function");
      callbackFunc();
    }

    return {
      user: user,
      error: error_return,
    };
  };

  const signout = async (callbackFunc) => {
    let { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    if (callbackFunc) callbackFunc();
  };

  // Return the user object and auth methods
  return {
    user,
    signin,
    signout,
    isLogin,
  };
}
