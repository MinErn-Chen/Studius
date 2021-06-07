import { useEffect } from "react";

const Marketplace = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Marketplace");
  }, [setAppBarTitle]);

  return <div></div>;
};

export default Marketplace;
