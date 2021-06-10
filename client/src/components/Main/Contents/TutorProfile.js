import { useEffect } from "react";

import Profile from "./StudentProfile/Profile";

const TutorProfile = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Tutor Profile");
  }, [setAppBarTitle]);

  return <Profile />;
};

export default TutorProfile;
