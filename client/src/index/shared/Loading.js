import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  loadingText: {
    paddingTop: theme.spacing(2),
  },
}));

const Loading = () => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        className={classes.root}
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
        <Grid item xs={12} className={classes.loadingText}>
          <Typography variant="h5">Loading...</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Loading;
