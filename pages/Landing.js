import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    top: {
        display: "flex",
        height: "100vh",
        padding: "0 80px",
    },
    right: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    left: {
        textAlign: "left",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.primary,
    },
    topimg: {
        width: "100%",
    },
}));

const RoundedButton = withStyles((theme) => ({
    root: {
        width: "200px",
        height: "50px",
        borderRadius: "10px",
    },
}))(Button);

export default function Landing() {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.top}>
            <Grid container xs={6} className={classes.left} alignItems="center">
                <Box pl={25}>
                    <Box mb={2} mt={-9}>
                        <Typography variant="h5">
                            Study with us!
                        </Typography>
                    </Box>
                    <Box mb={6}>
                        <Typography variant="h6">
                            I am a...
                        </Typography>
                    </Box>
                    <Link
                        to="/Login"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        <RoundedButton
                            variant="contained"
                            color="primary"
                            href="#"
                            size="large"
                        >
                            Student 
                        </RoundedButton>
                        

                        <RoundedButton
                            variant="contained"
                            color="primary"
                            href="#"
                            size="large"
                        >
                            Tutor 
                        </RoundedButton>
                    </Link>
                </Box>
            </Grid>
        </Container>
    );
}

// student/tutor buttons placholder atm -- not registered into db 