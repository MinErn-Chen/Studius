import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Annoucements = ({ userInformation, setNotification, forumid }) => {
  const classes = useStyles();
  const date = new Date();
  const annoucementDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(); // strangely its a month behind

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const makeAnnoucement = (title, body) => async () => {
    handleClose();

    try {
      const response = await fetch("http://localhost:3000/forum/annoucement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({
          forumid: forumid,
          title: title,
          body: body,
          date: annoucementDate,
        }),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: `Annoucement posted`,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  // both users
  const displayAnnoucements = async () => {
    try {
      const response = await fetch("http://localhost:3000/forum/annoucements", {
        method: "POST",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forumid: forumid }),
      });

      const parseRes = await response.json();

      window.anncs = parseRes;
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    displayAnnoucements();
  }, []);

  const anncs =
    window.anncs === undefined ? [] : window.anncs === null ? [] : window.anncs;

  const deleteAnnoucement = (title, body) => async () => {
    try {
      console.log(title, body);
      const response = await fetch(`http://localhost:3000/forum/annoucements`, {
        method: "DELETE",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          body: body,
          forumid: forumid,
        }),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: "Annoucement deleted",
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
      window.location.reload();
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.message,
      });
      console.log(error.message);
    }
  };

  const anncDialog = (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">New annoucement</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          onChange={(event) => setTitle(event.target.value)}
          fullWidth
        />

        <TextField
          autoFocus
          margin="dense"
          id="body"
          label="Body"
          onChange={(event) => setBody(event.target.value)}
          fullWidth
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={makeAnnoucement(title, body)} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <div>
        {userInformation.type === "Tutor" ? (
          <div>
            <Box display="flex" m={3} justifyContent="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
              >
                + Add Annoucement
              </Button>
            </Box>
            {anncDialog}
          </div>
        ) : null}
      </div>

      <div>
        {anncs.length === 0 ? (
          <Box display="flex" justifyContent="center" m={2}>
            <Typography variant="h4"> No annoucements yet!</Typography>
          </Box>
        ) : (
          anncs
            .map((element) => Object.values(element))
            .map((element) => (
              <>
                <Card className={classes.root} variant="contained">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      {element[2]}
                    </Typography>
                    <Grid container wrap="nowrap" spacing={0}>
                      <Typography variant="h5" component="h2">
                        {element[0]}
                      </Typography>
                    </Grid>
                    <Grid container wrap="nowrap" spacing={0}>
                      <Typography variant="body2" component="p">
                        {element[1]}
                      </Typography>
                    </Grid>
                  </CardContent>
                  {userInformation.type === "Tutor" ? (
                    <Box display="flex" flexDirection="row-reverse">
                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          style={{ backgroundColor: "#CC0000", color: "white" }}
                          onClick={deleteAnnoucement(element[0], element[1])}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Box>
                  ) : null}
                </Card>

                <br />
              </>
            ))
        )}
      </div>
    </>
  );
};

export default Annoucements;
