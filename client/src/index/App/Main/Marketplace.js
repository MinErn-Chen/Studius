import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Profiles from "./Marketplace/Profiles";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const Marketplace = ({ setNotification, setAppBarTitle, userInformation }) => {
  const classes = useStyles();

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

  const [profileViewOpen, setProfileViewOpen] = useState(false);

  const [description, setDescription] = useState("");

  const handleProfileViewOpen = (profile) => () => {
    setDescription(profile.description);
    handleInitialiseCredentials(profile.id);
    setProfileViewOpen(true);
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
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleViewCredentials = () => {
    window.open(credentialsURL);
  };

  const handleProfileViewClose = () => {
    setCredentialsURL("");
    setProfileViewOpen(false);
  };

  const ProfileView = () => {
    return (
      <Dialog
        open={profileViewOpen}
        onClose={handleProfileViewClose}
        disableBackdropClick
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="profile-view-title">
          {userInformation.type === "Tutor" ? (
            <div>Detailed student profile</div>
          ) : userInformation.type === "Student" ? (
            <div className={classes.title}>
              <div>Detailed tutor profile</div>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleViewCredentials}
                disabled={!Boolean(credentialsURL)}
              >
                {Boolean(credentialsURL)
                  ? "View credentials"
                  : "No credentials"}
              </Button>
            </div>
          ) : (
            ""
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="profile-view-description">
            <Typography style={{ whiteSpace: "pre-line" }}>
              {description}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfileViewClose} color="primary">
            Close
          </Button>
          <Button onClick={handleProfileViewClose} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <Profiles
        profiles={profiles}
        handleProfileViewOpen={handleProfileViewOpen}
      />
      <ProfileView />
    </>
  );
};

export default Marketplace;
