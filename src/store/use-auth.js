import React, { useState, useEffect, useContext, createContext } from "react";
// import { supabase } from "./Store";
import axios from "axios";
import {supabase} from "../utils/supabase";

// const url_avs_server = "http://localhost:3001";
const url_avs_server = 'https://api.amr-system.me';
const reset_password = "/users/recovery-password";

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

  // const history = useHistory();
  // const location = useLocation();

  useEffect(() => {
    const session = supabase.auth.session();

    if (session) {
      if (session?.user !== null) {
        setUser(session?.user ?? null);
      }
    }

    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     const currentUser = session?.user;
    //     console.log("onAuthStateChange: " + session);

    //     debugger
    //     if (currentUser) {
    //       let isValidRole = await validRole(currentUser.id);
    //       if (isValidRole) {
    //         setUser(currentUser);
    //       } else {
    //         setUser(null);
    //       }
    //     } else {
    //       setUser(null);
    //     }
    //   }
    // );

    // return () => {
    //   authListener.unsubscribe();
    // };
  }, [user]);

  function isLogin() {
    let session = supabase.auth.session();

    if (session) {
      if (session.user) {
        return true;
      }
    }
    return false;
  }

  const validRole = async (id) => {
    let { data: accounts, error: error_validRole } = await supabase
      .from("accounts")
      .select("role")
      .eq("id", id);

    if (error_validRole) {
      console.log("validRole_use-auth error: " + error_validRole);
    }

    if (accounts === null) {
      return false;
    }
    if (accounts[0].role === null) {
      return false;
    }
    return accounts[0].role === "manager";
  };

  const fetchUser = async (id) => {
    let { data: accounts, error: error_fetchUser } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", id);

    if (error_fetchUser) {
      console.log("fetchUser_use-auth error: " + error_fetchUser);
      return null;
    }
    if (accounts) {
      return accounts;
    }
  };

  const signin = async (email, password, callbackFunc) => {
    let error_return = null;

    try {
      const {
        user: user_signin,
        // session,
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

  const recoveryPassword = async (email) => {
    let res = await axios.post(url_avs_server + reset_password, {
      email: email,
    });

    console.log("res: ", res);
    console.log("error: ", res.error);

    return {
      data: res.data.data,
      error: res.data.error,
    };

    // return res;

    // let { data, error } = await supabase.auth.api.resetPasswordForEmail(email);
    // console.log("data_recoveryPassword: " , data);
    // console.log("error_recoveryPassword: ", error);

    // return {
    //   data: data,
    //   error: error
    // }
  };

  const signout = async (callbackFunc) => {
    let { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    if (callbackFunc) callbackFunc();
  };

  const updatePassword = async (access_token, new_password) => {
    const { error, data } = await supabase.auth.api.updateUser(access_token, {
      password: new_password,
    });
    return {
      error: error,
      data: data
    }
  };

  // Return the user object and auth methods
  return {
    user,
    fetchUser,
    signin,
    signout,
    isLogin,
    recoveryPassword,
    updatePassword,
  };
}
