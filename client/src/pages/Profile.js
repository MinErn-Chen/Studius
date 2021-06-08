import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Content from "../components/Profile/Content";
import Menu from "../components/Profile/Menu";

const Profile = ({ setAuth, setNotification, ...props }) => {
  return (
    <>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item md={3}>
            <Menu {...props} />
          </Grid>
          <Grid item md={9}>
            <Content
              {...props}
              setAuth={setAuth}
              setNotification={setNotification}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Profile;
