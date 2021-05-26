import React from 'react';
import {Router} from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createMuiTheme, ThemeProvider} from "@material-ui/core";
import {createBrowserHistory} from "history";
import {transitions, positions, Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic"

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ff4400',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
}
});

const options = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE
}


let history = createBrowserHistory();

ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
      <Router history = {history}>
      <AlertProvider template={AlertTemplate} {...options}>
      <App />
      </AlertProvider>
      </Router>
      </ThemeProvider>
    </React.StrictMode>,
document.getElementById('root')
);

