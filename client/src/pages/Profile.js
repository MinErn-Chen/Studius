import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
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

const Profile = () => {
  const classes = useStyles();

  const [accountInformation, setAccountInformation] = useState({
    user_firstname: "",
    user_lastName: "",
    user_email: "",
  });

  const getAccountInformation = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      // setType(parseRes.user_type);
      // setName(`${parseRes.user_firstname} ${parseRes.user_lastname}`);
      setAccountInformation(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getAccountInformation();
  }, []);

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
                        <ListItem alignItems="center">
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
                          <Button variant="contained" color="primary">
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
      </Container>
    </>
  );
};

export default Profile;
