import {
    CssBaseline, 
   /* Container,
    Typograhy,
    Button,
    Box,*/
} from "@material-ui/core";
import React from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Landing from "./Landing";

const useStyles = makeStyles((theme) => ({}));

export default function Home() {
    //const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <Landing />
            </main>
        </React.Fragment>
    
    )
}
