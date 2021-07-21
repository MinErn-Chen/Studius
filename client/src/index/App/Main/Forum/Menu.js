import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import AnnouncementIcon from "@material-ui/icons/Announcement";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 300,
  },
  tabs: {
    border: `1.5px solid ${theme.palette.divider}`,
  },
}));

export default function Menu({ match }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 // console.log(match.url)

  return (
    <Box mt={-35}>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          <Tab
            label="Annoucements"
            key={"Annoucements"}
            icon={<AnnouncementIcon />}
            component={Link}
            to={`${match.url}/annoucements`}
          />

          <Tab
            label="Assignments"
            key={"Assignments"}
            icon={<AssignmentIcon />}
            component={Link}
            to={`${match.url}/assignments`}
          />

          <Tab
            label="Files"
            key={"Files"}
            icon={<FileCopyIcon />}
            component={Link}
            to={`${match.url}/files`}
          />

          <Tab
            label="QnA"
            key={"qna"}
            icon={<QuestionAnswerIcon/>}
            component={Link}
            to={`${match.url}/qna`}
          />
        </Tabs>
      </div>
    </Box>
  );
}
