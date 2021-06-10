import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
  },
  profileDetail: {
    paddingTop: theme.spacing(1),
  },
}));

const stylised = {
  subjects: "Subjects",
  rate: "Rate",
  times: "Available times",
  education: "Education",
};

const Profiles = ({ profiles }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid
        container
        maxWidth="lg"
        direction="row"
        alignItems="center"
        justify="center"
        spacing={4}
        className={classes.cardGrid}
      >
        {profiles.map((profile) => (
          <Grid item key={profile.id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography gutterBottom variant="h4">
                  {`${profile.firstname} ${profile.lastname}`}
                </Typography>
                {Object.keys(profile)
                  .filter(
                    (detail) =>
                      !(
                        detail === "firstname" ||
                        detail === "lastname" ||
                        detail === "id" ||
                        detail === "description"
                      )
                  )
                  .map((detail, index) => {
                    return (
                      <Box
                        key={detail}
                        className={classes.profileDetail}
                        gutterBottom
                      >
                        <Typography variant="h6">{stylised[detail]}</Typography>
                        <Typography>{profile[detail]}</Typography>
                      </Box>
                    );
                  })}
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Read more
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          sm={6 * (2 - (profiles.length % 2))}
          md={4 * (3 - (profiles.length % 3))}
        ></Grid>
      </Grid>
    </Container>
  );
};

export default Profiles;
