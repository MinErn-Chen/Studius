import { useEffect } from "react";

const Dashboard = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Dashboard");
  }, [setAppBarTitle]);

  return <div></div>;
};

export default Dashboard;
