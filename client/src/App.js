import { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const isAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/verify", {
        method: "POST",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setIsAuthenticated(parseRes === true);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  const handleNotification = (event, reason) => {
    // disable clickaway
    if (reason === "clickaway") {
      return;
    }

    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route
            exact
            path="/register"
            render={(props) =>
              !isAuthenticated ? (
                <Register
                  {...props}
                  setAuth={setAuth}
                  setNotification={setNotification}
                />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          />
          <Route
            exact
            path="/login"
            render={(props) =>
              !isAuthenticated ? (
                <Login
                  {...props}
                  setAuth={setAuth}
                  setNotification={setNotification}
                />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            render={(props) =>
              isAuthenticated ? (
                <Dashboard
                  {...props}
                  setAuth={setAuth}
                  setNotification={setNotification}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </Router>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotification}
      >
        <Alert onClose={handleNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
