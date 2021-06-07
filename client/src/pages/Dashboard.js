import { useEffect } from "react";

const Dashboard = ({ setIsInMain, setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setIsInMain(true);
    setAppBarTitle("Dashboard");
  }, [setIsInMain, setAppBarTitle]);

  return <div></div>;
};

export default Dashboard;
