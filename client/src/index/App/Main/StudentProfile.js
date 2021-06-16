import { useEffect } from "react";

import Profile from "./StudentProfile/Profile";

const StudentProfile = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Student Profile");
  }, [setAppBarTitle]);

  return <Profile setNotification={setNotification} />;
};

export default StudentProfile;
