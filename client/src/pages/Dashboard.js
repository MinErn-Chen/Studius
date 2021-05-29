import { useState, useEffect } from "react";

const Dashboard = ({ setAuth }) => {
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
      setName(parseRes.user_name);
    } catch (error) {
      console.error(error.message);
    }
  };

  const logout = async (event) => {
    event.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
    } catch (error) {
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
      <button onClick={logout}>Log out</button>
    </>
  );
};

export default Dashboard;
