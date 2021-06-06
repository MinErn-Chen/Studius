import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const Dialogue = ({
  dialogue,
  handleClose,
  handleChange,
  handleEnter,
  handleConfirmEdit,
  handleConfirmDelete,
}) => {
  const handleConfirm =
    dialogue.type === "Account information"
      ? handleConfirmEdit
      : handleConfirmDelete;

  return (
    <Dialog
      open={dialogue.open}
      onClose={handleClose}
      aria-labelledby="attribute-dialogue"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="attribute-dialogue">
        {dialogue.type === "Account information"
          ? `Edit ${dialogue.title.toLowerCase()}`
          : dialogue.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {dialogue.type === "Account information" ? (
            <TextField
              id="dialogue-textfield"
              type={dialogue.title.toLowerCase()} // cheap solution :/
              label={`New ${dialogue.title.toLowerCase()}`}
              placeholder={`Enter new ${dialogue.title.toLowerCase()}`}
              fullWidth
              variant="outlined"
              defaultValue={dialogue.description}
              value={dialogue.input}
              inputProps={{ spellCheck: "false" }}
              onChange={handleChange}
              onKeyPress={handleEnter}
              autoFocus
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  0,
                  e.currentTarget.value.length
                )
              }
            />
          ) : (
            "Are you sure you would like to delete this account? This action cannot be reversed."
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Dialogue;
