import { useEffect } from "react";

import Profile from "./TutorProfile/Profile";

const TutorProfile = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Tutor Profile");
  }, [setAppBarTitle]);

  return <Profile />;
};

export default TutorProfile;
