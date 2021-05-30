import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import MaterialLink from "@material-ui/core/Link";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box"; 

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(17),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = ({ setAuth, setNotification }) => {
  const classes = useStyles();

  const [inputs, setInputs] = useState({
    type: "",
    name: "",
    email: "",
    password: "",
  });

  const { type, name, email, password } = inputs;

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();

    try {
      const body = { type, name, email, password };
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        setNotification({
          open: true,
          severity: "success",
          message: "Sign up success!",
        });
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
        setAuth(false);
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.message,
      });
      setAuth(false);
      console.error(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box mb={2} mt={-12}>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onSubmitForm}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
                required
              >
                <InputLabel id="type">I am a...</InputLabel>
                <Select
                  labelId="type"
                  id="type"
                  value={type}
                  label="I am a..."
                  name="type"
                  onChange={handleInputs}
                >
                  <MenuItem value={"Student"}>Student</MenuItem>
                  <MenuItem value={"Tutor"}>Tutor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Full name"
                name="name"
                value={name}
                onChange={handleInputs}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email address"
                name="email"
                value={email}
                onChange={handleInputs}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={handleInputs}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item xs>
              <MaterialLink component={RouterLink} to="/">
                <>Return to home</>
              </MaterialLink>
            </Grid>
            <Grid item>
              <MaterialLink component={RouterLink} to="/login">
                Already have an account? Sign in
              </MaterialLink>
            </Grid>
          </Grid>
        </form>
      </div>
      </Box>
    </Container>
  );
};

export default Register;
