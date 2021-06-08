import { useState } from "react";

import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const EmailAddress = ({
  accountInformation,
  setNotification,
  handleDialogueClose,
}) => {
  const [input, setInput] = useState(accountInformation.user_email);

  const handleChange = (event) => {
    const inValid = /\s/;
    const value = event.target.value;
    if (!inValid.test(value)) {
      setInput(event.target.value);
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
      const body = { email: input };

      const response = await fetch("http://localhost:3000/profile/email", {
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
          message: "Email address update success!",
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
      <DialogTitle id="attribute-dialogue">Edit email address</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            required
            id="dialogue-textfield"
            type="text"
            label="New email address"
            fullWidth
            variant="outlined"
            value={input}
            inputProps={{ spellCheck: "false" }}
            onChange={handleChange}
            onKeyPress={handleEnter}
            autoFocus
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
            }
          />
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

export default EmailAddress;
