import { useEffect, React } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Route, Switch, useParams } from "react-router-dom";
import Menu from "./Menu";
import Annoucements from "./Contents/Annoucements";
import Assignments from "./Contents/Assignments";
import Files from "./Contents/Files";
import QnA from "./Contents/QnA";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  menu: {
    position: "fixed",
  },
}));

const Forum = ({
  match,
  userInformation,
  setNotification,
  setAppBarTitle,
  props,
}) => {
  const { forumid, subject } = useParams();

  const classes = useStyles();

  useEffect(() => {
    setAppBarTitle(`Forum : ${subject} `);
  }, [setAppBarTitle]);

  return (
    <>
      <Container maxWidth="lg">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.menu}
        >
          <Grid item xs={12}>
            <Menu match={match} />
          </Grid>
        </Box>

        <Box m={2} display="flex" justifyContent="flex-end">
          <Grid item xs={10}>
            <Switch>
              <Route
                exact
                path={`${match.url}/annoucements`}
                render={(props) => (
                  <Annoucements
                    {...props}
                    setNotification={setNotification}
                    userInformation={userInformation}
                    forumid={forumid}
                  />
                )}
              />
              <Route
                path={`${match.url}/assignments`}
                render={() => (
                  <Assignments
                    setNotification={setNotification}
                    userInformation={userInformation}
                    forumid={forumid}
                  />
                )}
              />
              <Route
                path={`${match.url}/files`}
                render={(props) => (
                  <Files
                    {...props}
                    setNotification={setNotification}
                    userInformation={userInformation}
                    forumid={forumid}
                  />
                )}
              />
              <Route
                path={`${match.url}/qna`}
                render={() => (
                  <QnA
                    setNotification={setNotification}
                    userInformation={userInformation}
                    forumid={forumid}
                  />
                )}
              />
            </Switch>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Forum;
