import { useState, useEffect } from "react";
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
import moment from "moment";

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

const Profile = ({ setNotification }) => {
  const classes = useStyles();

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

    setListOfInstitutions(parseRes.map((institution) => institution.name));
  };

  const [inputs, setInputs] = useState({
    subject: "",
    rate: "",
    fromTime: moment("00:00", "HH:mm"),
    toTime: moment("00:00", "HH:mm"),
    institution: "",
    description: "",
    ispublic: null,
  });

  const getProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      const { subjects, rate, times, education, description, ispublic } =
        parseRes;

      setInputs({
        subject: subjects[0] || "",
        rate: rate || "",
        fromTime: times[0]
          ? moment(times[0], "HH:mm")
          : moment("00:00", "HH:mm"),
        toTime: times[1] ? moment(times[1], "HH:mm") : moment("00:00", "HH:mm"),
        institution: education || "",
        description: description || "",
        ispublic: ispublic || false,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const handleFromTime = (time) => {
    setInputs({ ...inputs, fromTime: time });
  };

  const handleToTime = (time) => {
    setInputs({ ...inputs, toTime: time });
  };

  const handleCheckbox = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      subject,
      rate,
      fromTime,
      toTime,
      institution,
      description,
      ispublic,
    } = inputs;

    const body = {
      subjects: [subject],
      rate: rate,
      times: [fromTime.format("HH:mm"), toTime.format("HH:mm")],
      education: institution,
      description: description,
      ispublic: ispublic,
    };

    try {
      const response = await fetch("http://localhost:3000/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: "Profile successfully submitted!",
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
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
            <Grid item xs={12}>
              <TextField
                required
                id="subject"
                label="Subject"
                variant="outlined"
                name="subject"
                onChange={handleInputs}
                value={inputs.subject}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                type="number"
                id="rate"
                label="Rate"
                variant="outlined"
                name="rate"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">/ hr</InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                onChange={handleInputs}
                value={inputs.rate}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TimePicker
                label="from"
                inputVariant="outlined"
                name="fromTime"
                value={inputs.fromTime}
                minutesStep={5}
                onChange={handleFromTime}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TimePicker
                label="to"
                inputVariant="outlined"
                name="toTime"
                value={inputs.toTime}
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
                value={inputs.institution}
                options={listOfInstitutions}
                getOptionLabel={(institution) => institution}
                onChange={(event, institution) => {
                  setInputs({ ...inputs, institution: institution });
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
                value={inputs.description}
                rows={10}
                multiline
                onChange={handleInputs}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="ispublic"
                    checked={inputs.ispublic}
                    onChange={handleCheckbox}
                  />
                }
                label="Make profile public"
              />
            </Grid>
          </Grid>
          <div className={classes.buttons}>
            <Button className={classes.button}>Reset</Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Paper>
      </main>
    </>
  );
};

export default Profile;
