import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Loading from "../shared/Loading";

import AppBar from "./Main/AppBar";
import SideBar from "./Main/SideBar";

import Forum from "./Main/Forum/Forum";
import Dashboard from "./Main/Dashboard";
import Marketplace from "./Main/Marketplace";
import TutorProfile from "./Main/TutorProfile";
import StudentProfile from "./Main/StudentProfile";

const Main = ({ match, setAuth, setNotification }) => {
  const [userInformation, setUserInformation] = useState({
    type: "",
    firstName: "",
  });

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
      const response = await fetch("http://localhost:3000/main/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setUserInformation({
        type: parseRes.type,
        firstName: parseRes.firstname,
      });
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
        handleLogout={handleLogout}
        handleSideBarOpen={handleSideBarOpen}
        appBarTitle={appBarTitle}
        userFirstName={userInformation.firstName}
      />
      <SideBar
        match={match}
        sideBarOpen={sideBarOpen}
        handleSideBarClose={handleSideBarClose}
        userType={userInformation.type}
      />
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <Redirect to={`${match.url}/dashboard`} />}
        />
        <Route
          path={`${match.url}/dashboard`}
          render={(props) => (
            <Dashboard
              setNotification={setNotification}
              setAppBarTitle={setAppBarTitle}
              userInformation={userInformation}
              {...props}
            />
          )}
        />
        <Route
          path={`${match.url}/forum/:forumid/:subject`}
          render={(props) => (
            <Forum
              {...props}
              setNotification={setNotification}
              setAppBarTitle={setAppBarTitle}
              userInformation={userInformation}
            />
          )}
        />
        <Route
          path={`${match.url}/marketplace`}
          render={(props) => (
            <Marketplace
              {...props}
              setNotification={setNotification}
              setAppBarTitle={setAppBarTitle}
              userInformation={userInformation}
            />
          )}
        />
        <Route
          path={`${match.url}/tutor-profile`}
          render={() =>
            userInformation.type ? (
              userInformation.type === "Tutor" ? (
                <TutorProfile
                  setNotification={setNotification}
                  setAppBarTitle={setAppBarTitle}
                />
              ) : (
                <Redirect to={`${match.url}`} />
              )
            ) : (
              <Loading />
            )
          }
        />
        <Route
          path={`${match.url}/student-profile`}
          render={() =>
            userInformation.type ? (
              userInformation.type === "Student" ? (
                <StudentProfile
                  setNotification={setNotification}
                  setAppBarTitle={setAppBarTitle}
                />
              ) : (
                <Redirect to={`${match.url}`} />
              )
            ) : (
              <Loading />
            )
          }
        />
      </Switch>
    </>
  );
};

export default Main;
