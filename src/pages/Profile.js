  
import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@material-ui/core/Box";
import { NavMenu, NavItem } from "@mui-treasury/components/menu/navigation";
import { useLineNavigationMenuStyles } from "@mui-treasury/styles/navigationMenu/line";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/react";
import { useAlert } from "react-alert";

import {
    Container,
    CssBaseline,
    CardContent,
    Typography,
} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        display: "grid",
        paddingTop: "100px",
        height: "90vh",
    },
    icon: {
        height: "200px",
        width: "200px",
    },
    profile: {
        justifySelf: "start",
        display: "flex",
    },
    info: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        margin: "2rem",
    },
});

export default function Profile(props) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const alert = useAlert();

    if (data != null) {
        console.log(data.length === 0);
    }

    // to handle the user's change of settings here 
    const handleChangeData = (newType) => {}; 
        

    return ;
        // some function here to handle the changes made in Account Settings 
    
}
