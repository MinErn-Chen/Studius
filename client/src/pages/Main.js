import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Loading from "./Loading";

import AppBar from "../components/Main/AppBar";
import SideBar from "../components/Main/SideBar";

import Dashboard from "../components/Main/Contents/Dashboard";
import Marketplace from "../components/Main/Contents/Marketplace";
import TutorProfile from "../components/Main/Contents/TutorProfile";
import StudentProfile from "../components/Main/Contents/StudentProfile";

const Main = ({ match, setAuth, setNotification }) => {
  const [userProfile, setUserProfile] = useState({
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

      setUserProfile({
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
        userFirstName={userProfile.firstName}
      />
      <SideBar
        match={match}
        sideBarOpen={sideBarOpen}
        handleSideBarClose={handleSideBarClose}
        userType={userProfile.type}
      />
      <Switch>
        <Route
          exact
          path={`${match.url}`}
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
        <Route
          path={`${match.url}/tutor-profile`}
          render={() =>
            userProfile.type ? (
              userProfile.type === "Tutor" ? (
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
            userProfile.type ? (
              userProfile.type === "Student" ? (
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
