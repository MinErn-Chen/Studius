import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InfoIcon from "@material-ui/icons/Info";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
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

export default function SimplePaper() {
  const classes = useStyles();

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
                <ListItem button key={"Profile"}>
                  <ListItemIcon>
                    <PermIdentityIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Profile"} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item md={9}>
            <Paper className={classes.detailPaper} elevation={2}>
              <div className={classes.attributes}>
                <List className={classes.root}>
                  <ListItem alignItems="center">
                    <ListItemText
                      primary={
                        <Typography gutterBottom variant="h5">
                          First name
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                          >
                            Test
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="contained" color="primary">
                      Edit
                    </Button>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem alignItems="center">
                    <ListItemText
                      primary={
                        <Typography gutterBottom variant="h5">
                          Last name
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                          >
                            Test
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="contained" color="primary">
                      Edit
                    </Button>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem alignItems="center">
                    <ListItemText
                      primary={
                        <Typography gutterBottom variant="h5">
                          Email address
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                          >
                            Test
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="contained" color="primary">
                      Edit
                    </Button>
                  </ListItem>
                  <Divider component="li" />
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
                            Test
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
}
