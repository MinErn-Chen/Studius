import { useEffect } from "react";

const TutorProfile = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Tutor Profile");
  }, [setAppBarTitle]);

  return <div></div>;
};

export default TutorProfile;
