import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MaterialLink from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const Login = ({ setAuth }) => {
  const classes = useStyles();

  const [inputs, setInputs] = useState(
    {
      email: "",
      password: ""
    }
  );

  const { email, password } = inputs;

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name] : event.target.value });
  };

	const onSubmitForm = async (event) => {
		event.preventDefault();

		try {
			const body = { email, password };

			const response = await fetch("http://localhost:3000/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			  body: JSON.stringify(body)
			});

			const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setAuth(false);
      }
		} catch (error) {
			console.log(error.message);
		}
	}

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={onSubmitForm}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
						value={ email }
						onChange={ handleInputs }
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
						value={ password }
						onChange={ handleInputs }
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs justify="center">
              <MaterialLink component={RouterLink} to="/">
                Return to home
              </MaterialLink>
            </Grid>
            <Grid item>
              <MaterialLink component={RouterLink} to="/register">
								Don't have an account? Sign Up
              </MaterialLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Login;