import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Profiles from "./Marketplace/Profiles";
import ProfileView from "./Marketplace/ProfileView";

const Marketplace = ({
  match,
  setNotification,
  setAppBarTitle,
  userInformation,
}) => {
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

  const [profile, setProfile] = useState({
    isSet: false,
    firstname: "",
    lastname: "",
    subjects: [],
    rate: "",
    times: [],
    description: "",
  });

  const handleProfileOpen = (profile) => () => {
    const {
      firstname,
      lastname,
      subjects,
      rate,
      times,
      education,
      description,
    } = profile;
    setProfile({
      isSet: true,
      firstname: firstname,
      lastname: lastname,
      subjects: subjects,
      rate: rate,
      times: times,
      education: education,
      description: description,
    });
    handleInitialiseCredentials(profile.id);
  };

  const [credentialsURL, setCredentialsURL] = useState("");

  const handleInitialiseCredentials = async (tutorProfileId) => {
    try {
      const response = await fetch("http://localhost:3000/files/credentials/", {
        method: "GET",
        headers: { token: localStorage.token, credentialsId: tutorProfileId },
        responseType: "blob",
      });

      const blobRes = await response.blob();

      if (blobRes.type === "application/pdf") {
        const file = new Blob([blobRes], { type: blobRes.type });

        const fileURL = URL.createObjectURL(file);

        setCredentialsURL(fileURL);
      } else {
        setCredentialsURL("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={(props) => (
            <Profiles
              {...props}
              profiles={profiles}
              handleProfileOpen={handleProfileOpen}
            />
          )}
        />
        <Route
          path={`${match.url}/view`}
          render={(props) =>
            profile.isSet ? (
              <ProfileView
                {...props}
                userInformation={userInformation}
                profile={profile}
                setProfile={setProfile}
                credentialsURL={credentialsURL}
                setCredentialsURL={setCredentialsURL}
                contractSubjects={profile.subjects}
              />
            ) : (
              <Redirect to={match.url} />
            )
          }
        />
      </Switch>
    </>
  );
};

export default Marketplace;
