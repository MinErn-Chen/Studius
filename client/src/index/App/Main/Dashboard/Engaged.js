import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialLink from "@material-ui/core/Link";
import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  noData: {
    paddingTop: theme.spacing(50),
  },
  root: {
    maxWidth: 275,
    minHeight: 120,
    display: "flex-center",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    paddingTop: theme.spacing(1),
  },
  bullet: {
    display: "inline-block",
    margin: "0 1px",
    transform: "scale(1)",
  },
  title: {
    fontSize: 14,
  },
  content: {
    textDecoration: "none",
  },

}));

const Engaged = ({ match, userInformation }) => {
  const classes = useStyles();

  // get the forums
  const getEngaged = async () => {
    try {
      const response = await fetch("http://localhost:3000/dashboard/engaged", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      window.items = parseRes;
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getEngaged();
  }, []);


  const items =
    window.items === undefined
      ? []
      : window.items.engaged === null
      ? []
      : window.items.engaged;

  return items.length === 0 ? (
    <Typography align="center" className={classes.noData} variant="h5">
      <MaterialLink component={RouterLink} to={`/main/marketplace`}>
        Meet a{" "}
        {userInformation.type === "Tutor"
          ? "student"
          : userInformation.type === "Student"
          ? "tutor"
          : ""}
      </MaterialLink>{" "}
      to get started!
    </Typography>
  ) : (
    items.map((item) => (
      <Card variant="outlined" className={classes.root}>
        <CardActionArea
          className={classes.root}
          component={RouterLink}
          to={`${match.url}/forum/${item.split('"')[7]}/${
            userInformation.type === "Student"
              ? item.split('"')[1]
              : item.split('"')[5]
          }`}
        >
          <CardContent>
            <Typography variant="h5" component="h2">
              {item.split('"')[1]}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {userInformation.type === "Student" ? "Tutor's " : "Student's"}{" "}
              name: {item.split('"')[5]}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    ))
  );
};

export default Engaged;
