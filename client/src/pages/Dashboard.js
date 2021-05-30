import { useState, useEffect } from "react";

const Dashboard = ({ setAuth, setNotification }) => {
  const [type, setType] = useState("");
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setType(parseRes.user_type);
      setName(`${parseRes.user_firstname} ${parseRes.user_lastname}`);
    } catch (error) {
      console.error(error.message);
    }
  };

  const onlogout = async (event) => {
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

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <p>
        Welcome {type} {name}!
      </p>
      <button onClick={onlogout}>Log out</button>
    </>
  );
};

export default Dashboard;
