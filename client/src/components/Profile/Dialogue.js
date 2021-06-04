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
  handleConfirm,
}) => {
  return (
    <Dialog
      open={dialogue.open}
      onClose={handleClose}
      aria-labelledby="attribute-dialogue"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="attribute-dialogue">
        {`Edit ${dialogue.attribute.toLowerCase()}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            id="outlined-textarea"
            label={`New ${dialogue.attribute.toLowerCase()}`}
            placeholder="Placeholder"
            fullWidth
            variant="outlined"
            defaultValue={dialogue.defaultValue}
            value={dialogue.input}
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
