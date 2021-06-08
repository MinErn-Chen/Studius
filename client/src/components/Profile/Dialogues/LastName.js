import { useState } from "react";

import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const LastName = ({
  accountInformation,
  setNotification,
  handleDialogueClose,
}) => {
  const [input, setInput] = useState(accountInformation.user_lastname);

  const handleChange = (event) => {
    const inValid = /\s/;
    const value = event.target.value;
    if (!inValid.test(value)) {
      setInput(event.target.value);
    }
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleConfirm(event);
    }
  };

  const handleConfirm = async (event) => {
    try {
      const body = { lastname: input };

      const response = await fetch("http://localhost:3000/profile/lastname", {
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
          message: "Last name update success!",
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
    <>
      <DialogTitle id="attribute-dialogue">Edit last name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            id="dialogue-textfield"
            type="text"
            label="New last name"
            placeholder="Enter new last name"
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
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export default LastName;
