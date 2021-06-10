import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import { TimePicker } from "@material-ui/pickers";

const Content = () => {
  const [fromTime, setFromTime] = useState(new Date());

  const [toTime, setToTime] = useState(new Date());

  return (
    <>
      {/* <Typography variant="h6" gutterBottom>
        Description
      </Typography> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField
            required
            id="subject-1"
            label="Subject"
            variant="outlined"
            name="subject-1"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            id="level-1"
            label="Level"
            variant="outlined"
            name="level-1"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            id="rate"
            label="Rate"
            variant="outlined"
            name="rate"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">/ hr</InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TimePicker
            label="from"
            inputVariant="outlined"
            value={fromTime}
            minutesStep={5}
            onChange={setFromTime}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TimePicker
            label="to"
            inputVariant="outlined"
            value={toTime}
            minutesStep={5}
            onChange={setToTime}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox color="secondary" name="saveAddress" value="yes" />
            }
            label="Publish this profile to the marketplace"
          />
        </Grid>
      </Grid>
    </>
  );
};

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
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const Profile = () => {
  const classes = useStyles();

  return (
    <>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography gutterBottom variant="h4" align="center">
            Profile
          </Typography>
          <Content />
          <div className={classes.buttons}>
            <Button className={classes.button}>Reset</Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Preview
            </Button>
          </div>
        </Paper>
      </main>
    </>
  );
};

export default Profile;
