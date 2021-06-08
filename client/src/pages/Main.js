import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import AppBar from "../components/Main/AppBar";
import SideBar from "../components/Main/SideBar";

import Dashboard from "../components/Main/Contents/Dashboard";
import Marketplace from "../components/Main/Contents/Marketplace";

const Main = ({ match, setAuth, setNotification }) => {
  const [firstName, setFirstName] = useState("");

  const [sideBarOpen, setSideBarOpen] = useState(false);

  const [appBarTitle, setAppBarTitle] = useState("");

  const handleSideBarOpen = () => {
    setSideBarOpen(true);
  };

  const handleSideBarClose = () => {
    setSideBarOpen(false);
  };

  const getProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setFirstName(parseRes.user_firstname);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    try {
      setNotification({
        open: true,
        severity: "success",
        message: "Log out success!",
      });
      localStorage.removeItem("token");
      setAuth(false);
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.message,
      });
      console.error(error.message);
    }
  };

  return (
    <>
      <AppBar
        firstName={firstName}
        handleLogout={handleLogout}
        handleSideBarOpen={handleSideBarOpen}
        appBarTitle={appBarTitle}
      />
      <SideBar
        match={match}
        sideBarOpen={sideBarOpen}
        handleSideBarClose={handleSideBarClose}
      />
      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => <Redirect to={`${match.url}/dashboard`} />}
        />
        <Route
          path={`${match.url}/dashboard`}
          render={() => (
            <Dashboard
              setNotification={setNotification}
              setAppBarTitle={setAppBarTitle}
            />
          )}
        />
        <Route
          path={`${match.url}/marketplace`}
          render={() => (
            <Marketplace
              setNotification={setNotification}
              setAppBarTitle={setAppBarTitle}
            />
          )}
        />
      </Switch>
    </>
  );
};

export default Main;