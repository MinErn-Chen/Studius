import { useEffect, React } from "react";
import Container from "@material-ui/core/Container";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { Route, Switch, useParams } from "react-router-dom";
import Menu from "./Menu";
import Annoucements from "./Contents/Annoucements";
import Assignments from "./Contents/Assignments";
import Files from "./Contents/Files";
import QnA from "./Contents/QnA";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Zoom from "@material-ui/core/Zoom";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}


const Forum = ({
  match,
  userInformation,
  setNotification,
  setAppBarTitle,
  props,
}) => {
  const { forumid, subject } = useParams();
  //const classes = useStyles();

  useEffect(() => {
    setAppBarTitle(`Forum : ${subject} `);
  }, [setAppBarTitle]);

  console.log(match.url);
  return (
    <>
      <Container maxWidth="lg">
      

        <Box m={1} display="flex" justifyContent="center">
          <Grid item>
            <Menu match={match} />
          </Grid>
        </Box>

       

        <Grid item xs={12}>
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
      </Container>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default Forum;
