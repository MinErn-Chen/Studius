import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  title: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(1),
  },
  fileUpload: {
    display: "none",
  },
  contractText: {
    marginTop: theme.spacing(2),
  },
}));

const ProfileView = ({
  userInformation,
  profile,
  setProfile,
  match,
  credentialsURL,
  setCredentialsURL,
  setNotification,
}) => {
  const classes = useStyles();

  const handleViewCredentials = () => {
    window.open(credentialsURL);
  };

  const handleProfileClose = () => {
    setProfile({ ...profile, isSet: false });
    setCredentialsURL("");
  };

  const [contractOpen, setContractOpen] = useState(false);

  const handleContractOpen = () => {
    setContractOpen(true);
  };

  const handleContractClose = () => {
    setContractOpen(false);
  };

  const [contractSubject, setContractSubject] = useState("");

  const handleContractConfirm = async (event) => {
    event.preventDefault();
    console.log(profile);
    console.log(contractSubject);

    try {
      const body = { OUID: profile.id, subject: contractSubject };

      const response = await fetch("http://localhost:3000/forum/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      setNotification({
        open: true,
        severity: "success",
        message: parseRes,
      });
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.message,
      });
      console.error(error.message);
    }
  };

  const handleContractChange = (event) => {
    setContractSubject(event.target.value);
  };

  const Contract = () => {
    return (
      <Dialog open={contractOpen} maxWidth="xs" fullWidth>
        <DialogTitle id="contract-title">Test</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel id="subject">Subject</InputLabel>
            <Select
              labelId="subject"
              id="subject"
              value={contractSubject}
              name="subject"
              onChange={handleContractChange}
              label="Subject"
              MenuProps={{
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {profile.subjects
                .map((subject) =>
                  Array.isArray(subject)
                    ? [subject[0], subject.join(" ")]
                    : [subject, subject]
                )
                .map((subject) => (
                  <MenuItem value={subject[0]}>{subject[1]}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <DialogContentText
            className={classes.contractText}
            id="contract-description"
          >
            You will engage in tuition upon confirmation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContractClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleContractConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography className={classes.title} variant="h4" align="center">
            {`${profile.firstname} ${profile.lastname} `}
          </Typography>
          <Grid container spacing={2} justify="center" direction="column">
            <Grid item xs={12}>
              <Typography variant="h6">Subjects</Typography>
              <Typography>
                {profile.subjects
                  .map((subject) =>
                    Array.isArray(subject) ? subject.join(" ") : subject
                  )
                  .join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Rate</Typography>
              <Typography>$ {profile.rate} / hr</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Available times</Typography>
              <Typography>
                {`${moment(profile.times[0], "HH:mm").format(
                  "hh:mm A"
                )} — ${moment(profile.times[1], "HH:mm").format("hh:mm A")}`}
              </Typography>
            </Grid>
            {userInformation.type === "Student" ? (
              <Grid item xs={12}>
                <Typography variant="h6">Education</Typography>
                <Typography>{profile.education}</Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Typography variant="h6">Description</Typography>
              <Typography>{profile.description}</Typography>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <div className={classes.buttons}>
            {userInformation.type === "Student" ? (
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={handleViewCredentials}
                disabled={!Boolean(credentialsURL)}
              >
                {Boolean(credentialsURL)
                  ? "View credentials"
                  : "No credentials"}
              </Button>
            ) : null}
            <Button
              color="secondary"
              className={classes.button}
              onClick={handleProfileClose}
              component={Link}
              to={match.url}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleContractOpen}
            >
              Send contract
            </Button>
          </div>
        </Paper>
      </main>
      <Contract />
    </>
  );
};

export default ProfileView;
