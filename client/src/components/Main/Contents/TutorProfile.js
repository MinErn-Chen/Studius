import { useEffect } from "react";

import Profile from "./TutorProfile/Profile";

const TutorProfile = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Tutor Profile");
  }, [setAppBarTitle]);

  return <Profile setNotification={setNotification} />;
};

export default TutorProfile;
