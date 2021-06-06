import { Route, Redirect, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import AccountInformation from "./Contents/AccountInformation";
import Advanced from "./Contents/Advanced";

const useStyles = makeStyles((theme) => ({
  attributes: {
    padding: theme.spacing(2),
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
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const Content = ({ accountInformation, handleOpen, match }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.detailPaper} elevation={2}>
      <div className={classes.attributes}>
        <Switch>
          <Route
            exact
            path={`${match.url}/`}
            render={() => <Redirect to={`${match.url}/account-information`} />}
          />
          <Route
            path={`${match.url}/account-information`}
            render={() => (
              <AccountInformation
                accountInformation={accountInformation}
                handleOpen={handleOpen("Account information")}
              />
            )}
          />
          <Route
            path={`${match.url}/advanced`}
            render={() => (
              <Advanced
                accountInformation={accountInformation}
                handleOpen={handleOpen("Advanced")}
              />
            )}
          />
        </Switch>
      </div>
    </Paper>
  );
};

export default Content;
