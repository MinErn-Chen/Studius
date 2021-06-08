import { useEffect } from "react";

const StudentProfile = ({ setNotification, setAppBarTitle }) => {
  useEffect(() => {
    setAppBarTitle("Student Profile");
  }, [setAppBarTitle]);

  return <div></div>;
};

export default StudentProfile;
