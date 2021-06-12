import { useState } from "react";

import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const Password = ({ setNotification, handleDialogueClose }) => {
  const [input, setInput] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const isSamePassword = input.newPassword === input.confirmNewPassword;

  const passwordError = isSamePassword ? " " : "Passwords must match";

  const handleChange = (event) => {
    const inValid = /\s/;
    const value = event.target.value;
    if (!inValid.test(value)) {
      setInput({ ...input, [event.target.name]: event.target.value });
    }
  };

  const handleEnter = (event) => {
    if (event.key === "Enter" && event.target.value) {
      handleConfirm(event);
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();

    try {
      if (!isSamePassword) {
        return;
      }

      const body = { password: input.newPassword };

      const response = await fetch("http://localhost:3000/account/password", {
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
          message: "Password update success!",
        });
        handleDialogueClose();
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

  return (
    <form onSubmit={handleConfirm}>
      <DialogTitle id="attribute-dialogue">Edit password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                required
                variant="outlined"
                fullWidth
                name="newPassword"
                label="New password"
                type="password"
                id="newPassword"
                value={input.newPassword}
                onChange={handleChange}
                onKeyPress={handleEnter}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                error={!isSamePassword}
                variant="outlined"
                fullWidth
                name="confirmNewPassword"
                label="Confirm new password"
                type="password"
                id="confirmNewPassword"
                helperText={passwordError}
                value={input.confirmNewPassword}
                onChange={handleChange}
                onKeyPress={handleEnter}
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogueClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </form>
  );
};

export default Password;
