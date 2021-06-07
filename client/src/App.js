import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Loading from "./pages/Loading";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";

import Main from "./components/Main/Main";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#34495E",
    },
    secondary: {
      main: "#000000",
    },
  },
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const App = () => {
  const [userState, setUserState] = useState({
    isLoading: true,
    isAuthenticated: false,
  });

  const [notification, setNotification] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [appBarTitle, setAppBarTitle] = useState("");

  const [isInMain, setIsInMain] = useState(false);

  const setAuth = (authBoolean) => {
    setUserState({
      isLoading: false,
      isAuthenticated: authBoolean,
    });
  };

  const isAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/verify", {
        method: "POST",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setUserState({
        isLoading: false,
        isAuthenticated: parseRes === true,
      });
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

  const renderSnackbar = (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={handleNotification}
    >
      <Alert onClose={handleNotification} severity={notification.severity}>
        {notification.message}
      </Alert>
    </Snackbar>
  );

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Router>
          {isInMain ? (
            <Main
              setAuth={setAuth}
              setNotification={setNotification}
              appBarTitle={appBarTitle}
            />
          ) : null}
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Home setIsInMain={setIsInMain} />}
            />
            <Route
              exact
              path="/loading"
              render={() => <Loading setIsInMain={setIsInMain} />}
            />
            <Route
              path="/register"
              render={(props) =>
                userState.isAuthenticated ? (
                  <Redirect to="/dashboard" />
                ) : userState.isLoading ? (
                  <Redirect to="/loading" />
                ) : (
                  <Register
                    {...props}
                    setAuth={setAuth}
                    setNotification={setNotification}
                    setIsInMain={setIsInMain}
                  />
                )
              }
            />
            <Route
              path="/login"
              render={(props) =>
                userState.isAuthenticated ? (
                  <Redirect to="/dashboard" />
                ) : userState.isLoading ? (
                  <Redirect to="/loading" />
                ) : (
                  <Login
                    {...props}
                    setAuth={setAuth}
                    setNotification={setNotification}
                    setIsInMain={setIsInMain}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              render={(props) =>
                userState.isAuthenticated ? (
                  <Dashboard
                    {...props}
                    setNotification={setNotification}
                    setIsInMain={setIsInMain}
                    setAppBarTitle={setAppBarTitle}
                  />
                ) : userState.isLoading ? (
                  <Redirect to="/loading" />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              path="/marketplace"
              render={(props) =>
                userState.isAuthenticated ? (
                  <Marketplace
                    {...props}
                    setNotification={setNotification}
                    setIsInMain={setIsInMain}
                    setAppBarTitle={setAppBarTitle}
                  />
                ) : userState.isLoading ? (
                  <Redirect to="/loading" />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              path="/profile"
              render={(props) =>
                userState.isAuthenticated ? (
                  <Profile
                    {...props}
                    setAuth={setAuth}
                    setNotification={setNotification}
                    setIsInMain={setIsInMain}
                  />
                ) : userState.isLoading ? (
                  <Redirect to="/loading" />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
          </Switch>
        </Router>
        {renderSnackbar}
      </MuiThemeProvider>
    </>
  );
};

export default App;
