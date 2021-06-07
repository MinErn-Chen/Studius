import { useState, useEffect } from "react";

import AppBar from "./AppBar";
import SideBar from "./SideBar";

const Main = ({ setAuth, setNotification, appBarTitle }) => {
  const [firstName, setFirstName] = useState("");

  const [sideBarOpen, setSideBarOpen] = useState(false);

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

  const handleLogout = async (event) => {
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
        sideBarOpen={sideBarOpen}
        handleSideBarClose={handleSideBarClose}
      />
    </>
  );
};

export default Main;
