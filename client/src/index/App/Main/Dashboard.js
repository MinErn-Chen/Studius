import { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import React from "react";
import Forum from "../shared/Forum";
import Engaged from "./Dashboard/Engaged";

const Dashboard = ({
  match,
  userInformation,
  setNotification,
  setAppBarTitle,
}) => {
  useEffect(() => {
    setAppBarTitle("Dashboard");
  }, [setAppBarTitle]);

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => (
            <Engaged match={match} userInformation={userInformation} />
          )}
        />
      </Switch>
    </>
  );
};

export default Dashboard;
