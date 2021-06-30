import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
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
}));

const ProfileView = ({
  userInformation,
  profile,
  setProfile,
  match,
  credentialsURL,
  setCredentialsURL,
}) => {
  const classes = useStyles();

  const handleViewCredentials = () => {
    window.open(credentialsURL);
  };

  const handleProfileClose = () => {
    setProfile({ ...profile, isSet: false });
    setCredentialsURL("");
  };

  return (
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
              {Boolean(credentialsURL) ? "View credentials" : "No credentials"}
            </Button>
          ) : null}
          <Button
            color="secondary"
            className={classes.button}
            onClick={handleProfileClose}
            component={Link}
            to={match.url}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => console.log(2)}
          >
            Confirm
          </Button>
        </div>
      </Paper>
    </main>
  );
};

export default ProfileView;
