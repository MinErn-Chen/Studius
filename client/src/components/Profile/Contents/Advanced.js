import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2),
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const Advanced = ({ handleDialogueOpen }) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" className={classes.title}>
        Advanced
      </Typography>
      <List className={classes.list}>
        {["Delete account"].map((type, index) => (
          <>
            <ListItem alignItems="center" key={type}>
              <ListItemText
                primary={
                  <Typography gutterBottom variant="h5">
                    {type}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body1"
                      color="textPrimary"
                    >
                      Permanently delete account
                    </Typography>
                  </>
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogueOpen(type)}
              >
                Delete account
              </Button>
            </ListItem>
            <Divider component="li" />
          </>
        ))}
      </List>
    </>
  );
};

export default Advanced;
