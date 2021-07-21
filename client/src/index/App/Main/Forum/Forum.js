import { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Route, Switch, useParams } from "react-router-dom";
import Menu from "./Menu";
import Annoucements from "./Contents/Annoucements";
import Assignments from "./Contents/Assignments";
import Files from "./Contents/Files";
import QnA from "./Contents/QnA";
import Box from "@material-ui/core/Box";

const Forum = ({ match, userInformation, setNotification, setAppBarTitle }) => {
  const { forumid, subject } = useParams();

  useEffect(() => {
    setAppBarTitle(`Forum : ${subject} `);
  }, [setAppBarTitle]);

  console.log(match.url);
  return (
    <>
      <Container maxWidth="lg" >
        <Grid
          container
          direction="row"
          alignItems="baseline"
          justify="space-between"
          style={{ minHeight: "100vh" }}
        >
          <Box xs={2}>
            <Menu match={match} />
          </Box>

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
        </Grid>
      </Container>
    </>
  );
};

export default Forum;
