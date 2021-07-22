import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialLink from "@material-ui/core/Link";
import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  noData: {
    paddingTop: theme.spacing(50),
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const defaultProps = {
  bgcolor: "background.paper",
  borderColor: "grey.500",
  border: 1,
};

const Engaged = ({ match, userInformation }) => {
  const classes = useStyles();

  const [engaged, setEngaged] = useState([]);

  // get the forums
  const getEngaged = async () => {
    try {
      const response = await fetch("http://localhost:3000/dashboard/engaged", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      return setEngaged(parseRes.engaged || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getEngaged();
  }, []);

  return engaged.length === 0 ? (
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
    <>
      <Box display="flex" m={1}>
        <Grid direction="rows" container spacing={2}>
          {engaged.map((item) => (
            <Grid item xs={8} sm={3}>
              <Box borderRadius={5} {...defaultProps}>
                <Card variant="contained" className={classes.root}>
                  <CardActionArea
                    className={classes.root}
                    component={RouterLink}
                    to={`forum/${item.split('"')[7]}/${
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
                        {userInformation.type === "Student"
                          ? "Tutor's "
                          : "Student's"}{" "}
                        name: {item.split('"')[5]}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Engaged;
