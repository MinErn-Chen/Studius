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
    title: "Dashboard",
    path: "dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Marketplace",
    path: "marketplace",
    icon: <RecentActorsIcon />,
  },
];

const SideBar = ({ sideBarOpen, handleSideBarClose }) => {
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
        {routes.map((route, index) => (
          <ListItem
            button
            key={route.title}
            onClick={handleSideBarClose}
            component={Link}
            to={`/${route.path}`}
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
