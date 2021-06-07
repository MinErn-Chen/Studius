import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Content from "../components/Profile/Content";
import Dialogue from "../components/Profile/Dialogue";
import Menu from "../components/Profile/Menu";

const Profile = ({ match, setAuth, setNotification, setIsInMain }) => {
  let history = useHistory();

  useEffect(() => {
    setIsInMain(false);
  }, [setIsInMain]);

  const [dialogue, setDialogue] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
    input: "",
  });

  const handleOpen = (type) => (title, description) => () => {
    setDialogue({
      open: true,
      type: type,
      title: title,
      description: description,
      input: description,
    });
  };

  const handleClose = () => {
    setDialogue({ ...dialogue, open: false });
  };

  const handleChange = (event) => {
    const inValid = /\s/;
    const value = event.target.value;
    if (!inValid.test(value)) {
      setDialogue({ ...dialogue, input: event.target.value });
    }
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleConfirmEdit(event);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth(false);
    history.push("/login");
  };

  const handleConfirmEdit = async (event) => {
    try {
      const title =
        dialogue.title === "First name"
          ? "firstname"
          : dialogue.title === "Last name"
          ? "lastname"
          : dialogue.title === "Email address"
          ? "email"
          : dialogue.title === "Password"
          ? "password"
          : null;
      const input = dialogue.input;
      const body = { [title]: input };

      const response = await fetch(`http://localhost:3000/profile/${title}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: `${dialogue.title} update success!`,
        });
        handleClose();
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.message,
      });
      console.log(error.message);
    }
  };

  const handleConfirmDelete = async (event) => {
    try {
      const response = await fetch(`http://localhost:3000/profile/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: "Account delete success!",
        });
        handleClose();
        handleLogout();
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.message,
      });
      console.log(error.message);
    }
  };

  const [accountInformation, setAccountInformation] = useState({
    user_firstname: "",
    user_lastname: "",
    user_email: "",
    user_password: "",
  });

  const getAccountInformation = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setAccountInformation({ ...parseRes, user_password: "" });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getAccountInformation();
  }, [dialogue.open]); // cheap solution :/

  return (
    <>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item md={3}>
            <Menu match={match} />
          </Grid>
          <Grid item md={9}>
            <Content
              match={match}
              accountInformation={accountInformation}
              handleOpen={handleOpen}
            />
          </Grid>
        </Grid>
        <Dialogue
          dialogue={dialogue}
          handleClose={handleClose}
          handleChange={handleChange}
          handleEnter={handleEnter}
          handleConfirmEdit={handleConfirmEdit}
          handleConfirmDelete={handleConfirmDelete}
        />
      </Container>
    </>
  );
};

export default Profile;
