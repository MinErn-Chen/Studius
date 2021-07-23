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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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

  dayjs.extend(relativeTime);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const makeAnnoucement = (title, body) => async () => {
    handleClose();

    try {
      const announcementData = {
        title,
        body,
        date: new Date().toISOString(),
      };

      const response = await fetch(
        "http://localhost:3000/forum/announcements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify({
            ...announcementData,
            forumid,
          }),
        }
      );

      const parseRes = await response.json();

      if (parseRes.status === true) {
        setAnnouncements([
          { ...announcementData, id: parseRes.id },
          ...announcements,
        ]);
        setNotification({
          open: true,
          severity: "success",
          message: parseRes.message,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes.message,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // both users
  const displayAnnoucements = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/forum/announcements",
        {
          method: "GET",
          headers: {
            token: localStorage.token,
            "Content-Type": "application/json",
            forumid: forumid,
          },
        }
      );

      const parseRes = await response.json();

      return setAnnouncements(parseRes || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    displayAnnoucements();
  }, []);

  const deleteAnnoucement = (id) => async () => {
    try {
      console.log(title, body);
      const response = await fetch(
        `http://localhost:3000/forum/announcements`,
        {
          method: "DELETE",
          headers: {
            token: localStorage.token,
            "Content-Type": "application/json",
            id,
          },
        }
      );

      const parseRes = await response.json();

      if (parseRes.status === true) {
        setAnnouncements(
          announcements.filter((announcement) => announcement.id !== id)
        );
        setNotification({
          open: true,
          severity: "success",
          message: parseRes.message,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes.message,
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
        {announcements.length === 0 ? (
          <Box display="flex" justifyContent="center" m={2}>
            <Typography variant="h4"> No announcements yet!</Typography>
          </Box>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {`${dayjs(announcement.date).format("DD/MM/YYYY")} (${dayjs(
                      announcement.date
                    ).fromNow()})`}
                  </Typography>
                  <Grid container wrap="nowrap" spacing={0}>
                    <Typography variant="h5" component="h2">
                      {announcement.title}
                    </Typography>
                  </Grid>
                  <Grid container wrap="nowrap" spacing={0}>
                    <Typography variant="body2" component="p">
                      {announcement.body}
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
                        onClick={deleteAnnoucement(announcement.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Box>
                ) : null}
              </Card>

              <br />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Annoucements;
