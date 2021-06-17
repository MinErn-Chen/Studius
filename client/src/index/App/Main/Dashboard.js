import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  noData: {
    paddingTop: theme.spacing(50),
  },
}));

const Dashboard = ({
  setNotification,
  setAppBarTitle,
  userInformation,
  match,
}) => {
  const classes = useStyles();

  useEffect(() => {
    setAppBarTitle("Dashboard");
  }, [setAppBarTitle]);

  return (
    <Typography align="center" className={classes.noData} variant="h5">
      <MaterialLink component={RouterLink} to={`${match.url}/marketplace`}>
        Meet a{" "}
        {userInformation.type === "Tutor"
          ? "student"
          : userInformation.type === "Student"
          ? "tutor"
          : ""}
      </MaterialLink>{" "}
      to get started!
    </Typography>
  );
};

export default Dashboard;
