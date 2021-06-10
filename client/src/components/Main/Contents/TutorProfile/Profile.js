import { useState } from "react";
// import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import { TimePicker } from "@material-ui/pickers";

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
  title: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(1),
  },
}));

const Profile = () => {
  const classes = useStyles();

  const [fromTime, setFromTime] = useState(new Date(2021, 5, 15, 0, 0));

  const [toTime, setToTime] = useState(new Date(2021, 5, 15, 0, 0));

  const handleFromTime = (time) => {
    setFromTime(time);

    if (toTime < time) {
      setToTime(time);
    }
  };

  const handleToTime = (time) => {
    setToTime(time);

    if (time < fromTime) {
      setToTime(fromTime);
    }

    console.log(toTime.format("hh:mm a"));
  };

  const [institution, setInstitution] = useState(null);

  const [inputInstitution, setInputInstitution] = useState("");

  const [listOfInstitutions, setListOfInstitutions] = useState([]);

  const handleListOfInstitutions = async (institution) => {
    setInputInstitution(institution);

    const response = await fetch(
      `http://universities.hipolabs.com/search?name=${inputInstitution}`,
      {
        method: "GET",
      }
    );

    const parseRes = await response.json();

    setListOfInstitutions(parseRes);
  };

  return (
    <>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography className={classes.title} variant="h4" align="center">
            Profile
          </Typography>
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
                onChange={handleFromTime}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TimePicker
                label="to"
                inputVariant="outlined"
                value={toTime}
                minutesStep={5}
                onChange={handleToTime}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="education"
                variant="outlined"
                name="education"
                value={institution}
                options={listOfInstitutions}
                getOptionLabel={(institution) => institution.name}
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                onChange={(event, institution) => {
                  setInstitution(institution);
                }}
                onInputChange={(event, institution) => {
                  handleListOfInstitutions(institution);
                }}
                onClose={() => setListOfInstitutions([])}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Education"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="description"
                label="Description"
                variant="outlined"
                name="description"
                rows={10}
                multiline
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
