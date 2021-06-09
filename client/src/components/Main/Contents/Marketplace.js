import { useState, useEffect } from "react";

import Profiles from "./Marketplace/Profiles";

const Marketplace = ({ setNotification, setAppBarTitle }) => {
  const [profiles, setProfiles] = useState([]);

  const getProfiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/marketplace/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setProfiles([...parseRes]);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    setAppBarTitle("Marketplace");
    getProfiles();
  }, [setAppBarTitle]);

  return <Profiles profiles={profiles} />;
};

export default Marketplace;
