import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InfoIcon from "@material-ui/icons/Info";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  menuPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    height: 600,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  detailPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    height: 600,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  attributes: {
    padding: theme.spacing(2),
  },
}));

const Profile = ({ setNotification }) => {
  const classes = useStyles();

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
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item md={3}>
            <Paper className={classes.menuPaper} elevation={2}>
              <List>
                <ListItem button key={"Account information"}>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Account information"} />
                </ListItem>
                <ListItem
                  button
                  key={"Profile"}
                  component={Link}
                  to="/dashboard"
                >
                  <ListItemIcon>
                    <ArrowBackIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Return to dashboard"} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item md={9}>
            <Paper className={classes.detailPaper} elevation={2}>
              <div className={classes.attributes}>
                <List className={classes.root}>
                  {["First name", "Last name", "Email address"].map(
                    (attribute, index) => (
                      <>
                        <ListItem alignItems="center" key={attribute}>
                          <ListItemText
                            primary={
                              <Typography gutterBottom variant="h5">
                                {attribute}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body1"
                                  color="textPrimary"
                                >
                                  {
                                    accountInformation[
                                      Object.keys(accountInformation)[index]
                                    ]
                                  }
                                </Typography>
                              </>
                            }
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpen(
                              attribute,
                              accountInformation[
                                Object.keys(accountInformation)[index]
                              ]
                            )}
                          >
                            Edit
                          </Button>
                        </ListItem>
                        <Divider component="li" />
                      </>
                    )
                  )}
                  <ListItem alignItems="center">
                    <ListItemText
                      primary={
                        <Typography gutterBottom variant="h5">
                          Password
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                          >
                            Placeholder
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="contained" color="primary">
                      Edit
                    </Button>
                  </ListItem>
                  <Divider component="li" />
                </List>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Dialog
          open={dialogue.open}
          onClose={handleClose}
          aria-labelledby="attribute-dialogue"
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
                multiline
                variant="outlined"
                defaultValue={dialogue.defaultValue}
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
      </Container>
    </>
  );
};

export default Profile;
