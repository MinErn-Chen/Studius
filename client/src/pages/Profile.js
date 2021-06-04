import { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Dialogue from "../components/Profile/Dialogue";
import Menu from "../components/Profile/Menu";

const Profile = ({ setNotification }) => {
  const [dialogue, setDialogue] = useState({
    open: false,
    attribute: "",
    defaultValue: "",
    input: "",
  });

  const handleOpen = (attribute, defaultValue) => () => {
    setDialogue({
      open: true,
      attribute: attribute,
      defaultValue: defaultValue,
      input: defaultValue,
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
      handleConfirm(event);
    }
  };

  const handleConfirm = async (event) => {
    try {
      const attribute =
        dialogue.attribute === "First name"
          ? "firstname"
          : dialogue.attribute === "Last name"
          ? "lastname"
          : dialogue.attribute === "Email address"
          ? "email"
          : null;
      const input = dialogue.input;
      const body = { [attribute]: input };

      const response = await fetch(
        `http://localhost:3000/profile/${attribute}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: `${dialogue.attribute} update success!`,
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

  const [accountInformation, setAccountInformation] = useState({
    user_firstname: "",
    user_lastname: "",
    user_email: "",
  });

  const getAccountInformation = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setAccountInformation(parseRes);
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
        <Menu accountInformation={accountInformation} handleOpen={handleOpen} />
        <Dialogue
          dialogue={dialogue}
          handleClose={handleClose}
          handleChange={handleChange}
          handleEnter={handleEnter}
          handleConfirm={handleConfirm}
        />
      </Container>
    </>
  );
};

export default Profile;
