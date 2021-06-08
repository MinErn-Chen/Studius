import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import DashboardIcon from "@material-ui/icons/Dashboard";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  sideBarHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
}));

const routes = [
  {
    type: "Global",
    title: "Dashboard",
    path: "dashboard",
    icon: <DashboardIcon />,
  },
  {
    type: "Global",
    title: "Marketplace",
    path: "marketplace",
    icon: <RecentActorsIcon />,
  },
  {
    type: "Tutor",
    title: "Tutor profile",
    path: "tutor-profile",
    icon: <AssignmentIndIcon />,
  },
  {
    type: "Student",
    title: "Student profile",
    path: "student-profile",
    icon: <AssignmentIndIcon />,
  },
];

const SideBar = ({ match, sideBarOpen, handleSideBarClose, userType }) => {
  const classes = useStyles();

  const list = (
    <div className={classes.list}>
      <div className={classes.sideBarHeader}>
        <IconButton onClick={handleSideBarClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {routes
          .filter((route) => route.type === "Global" || route.type === userType)
          .map((route, index) => (
            <ListItem
              button
              key={route.title}
              onClick={handleSideBarClose}
              component={Link}
              to={`${match.url}/${route.path}`}
            >
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.title} />
            </ListItem>
          ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={sideBarOpen}>
        {list}
      </Drawer>
    </div>
  );
};

export default SideBar;
