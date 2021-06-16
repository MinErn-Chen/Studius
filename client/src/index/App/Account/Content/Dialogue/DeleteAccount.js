import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const DeleteAccount = ({ setAuth, setNotification, handleDialogueClose }) => {
  const handleLogout = () => {
    localStorage.clear();
    setAuth(false);
  };

  const handleConfirm = async (event) => {
    try {
      const response = await fetch(`http://localhost:3000/account/`, {
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
        handleDialogueClose();
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

  return (
    <>
      <DialogTitle id="attribute-dialogue">Edit email address</DialogTitle>
      <DialogContent>
        <DialogContentText>
          "Are you sure you would like to delete this account? This action
          cannot be reversed."
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

export default DeleteAccount;
