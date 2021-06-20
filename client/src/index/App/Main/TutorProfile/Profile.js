import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
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
  fileUpload: {
    display: "none",
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
    subjects: { 0: "" },
    rate: "",
    fromTime: null,
    toTime: null,
    institution: "",
    description: "",
    ispublic: false,
  });

  const [hasCredentialFile, setHasCredentialFile] = useState(false);

  const getProfile = async () => {
    try {
      const responseProfile = await fetch("http://localhost:3000/profile/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseResProf = await responseProfile.json();

      const { subjects, rate, times, education, description, ispublic } =
        parseResProf;

      setInputs({
        subjects: subjects
          ? subjects.reduce((acc, cur, i) => {
              acc[i] = cur;
              return acc;
            }, {})
          : { 0: "" },
        rate: rate || "",
        fromTime: times ? moment(times[0], "HH:mm") : moment("00:00", "HH:mm"),
        toTime: times ? moment(times[1], "HH:mm") : moment("00:00", "HH:mm"),
        institution: education || "",
        description: description || "",
        ispublic: ispublic || false,
      });

      const responseCredential = await fetch(
        "http://localhost:3000/files/credentials/",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
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

  const handleSubjects = (event) => {
    setInputs({
      ...inputs,
      subjects: { ...inputs.subjects, [event.target.name]: event.target.value },
    });
  };

  const handleAdd = () => {
    setInputs({
      ...inputs,
      subjects: {
        ...inputs.subjects,
        [Object.keys(inputs.subjects).length]: "",
      },
    });
  };

  const handleRemove = (index) => () => {
    const tempInputs = {};
    Object.assign(tempInputs, inputs);
    delete tempInputs.subjects[index];

    setInputs({
      ...tempInputs,
      subjects: Object.values(tempInputs.subjects).reduce((acc, cur, i) => {
        acc[i] = cur;
        return acc;
      }, {}),
    });
  };

  const handleFromTime = (time) => {
    setInputs({ ...inputs, fromTime: time });
  };

  const handleToTime = (time) => {
    setInputs({ ...inputs, toTime: time });
  };

  const handleFileUpload = async (event) => {
    const formData = new FormData();

    formData.append("credential", event.target.files[0]);

    try {
      const response = await fetch("http://localhost:3000/files/credentials/", {
        method: "PUT",
        headers: { token: localStorage.token },
        body: formData,
      });

      const parseRes = await response.json();

      const { severity, message } = parseRes;

      setNotification({
        open: true,
        severity: severity,
        message: message,
      });
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error,
      });
    }
  };

  const handleFileView = async () => {
    try {
      const response = await fetch("http://localhost:3000/files/credentials/", {
        method: "GET",
        headers: { token: localStorage.token },
        responseType: "blob",
      });

      const blobRes = await response.blob();

      const file = new Blob([blobRes], { type: "application/pdf" });

      const fileURL = URL.createObjectURL(file);

      window.open(fileURL);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileRemove = async () => {
    try {
      const response = await fetch("http://localhost:3000/files/credentials/", {
        method: "DELETE",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      const { severity, message } = parseRes;

      setNotification({
        open: true,
        severity: severity,
        message: message,
      });
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error,
      });
    }
  };

  const handleCheckbox = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      subjects,
      rate,
      fromTime,
      toTime,
      institution,
      description,
      ispublic,
    } = inputs;

    const body = {
      subjects: Object.values(subjects),
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
          message: "Profile successfully saved!",
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
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            direction="row"
          >
            {Object.keys(inputs.subjects).map((subject, index) => {
              return Object.keys(inputs.subjects).length === 1 ? (
                <Grid item xs={12} key={`subject-${index}`}>
                  <TextField
                    required
                    id={`subject-${index}`}
                    label={`Subject`}
                    variant="outlined"
                    name={index}
                    onChange={handleSubjects}
                    value={inputs.subjects[subject]}
                    fullWidth
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={11} key={`subject-${index}`}>
                    <TextField
                      required
                      id={`subject-${index}`}
                      label={`Subject`}
                      variant="outlined"
                      name={index}
                      onChange={handleSubjects}
                      value={inputs.subjects[subject]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={1} key={`remove-${index}`}>
                    <IconButton
                      className={classes.margin}
                      onClick={handleRemove(index)}
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </>
              );
            })}
            <Grid item xs={12}>
              <IconButton className={classes.margin} onClick={handleAdd}>
                <AddIcon />
              </IconButton>
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
              <input
                accept="application/pdf"
                className={classes.fileUpload}
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<CloudUploadIcon />}
                  component="span"
                >
                  Upload credentials
                </Button>
              </label>
              <ButtonGroup aria-label="outlined secondary button group">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleFileView}
                >
                  View credentials
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleFileRemove}
                >
                  Remove credentials
                </Button>
              </ButtonGroup>
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
              Save
            </Button>
          </div>
        </Paper>
      </main>
    </>
  );
};

export default Profile;
