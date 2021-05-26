import React, {useState, useEffect} from 'react';
import "./App.css";
import {Switch, Route, withRouter} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {useAlert} from "react-alert"; 

function App(props) {
  const alert = useAlert(); 
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true: false
  );
  const [username, setUsername] = useState(""); // where username refers to first name 
  const [id, setID] = useState(""); // where ID refers to user's email 
  //const [isTutor, setIsTutor] = useState(false);    // for future dashboard where selective access to announcment posting 

  useEffect(() => {
    if (isLoggedIn) {
      fetch(HERE)// connect to the database here 
      .then((response) => response.json())
      .then((json) => {
        setUsername(json.username);
        setID(json.id);
      });
    }
  }, [isLoggedIn]); 

// watch out for useState names vs database attribute name here -- does not correspond 
  const handleLogin = (e, data) => {
    console.log(data);
    e.preventDefault();
    fetch(HERE) // connect to db here 
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error");
      }
  })
  .then((json) => {
    localStorage.setItem("token", json.token);
    setIsLoggedIn(true);
    setUsername(json.user.username);
    setID(json.user.id);
    props.history.push("/");
  })
  .catch((error) => alert.show("Wrong Username or Password"));
};

  const handleRegister = (e, data) => {
    e.preventDefault();
    fetch(HERE) // connect to db here 
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error");
      }
  })
  .then((json) => {
    localStorage.setItem("token", json.token);
    props.history.push("/login");
  })
  .catch((error) => alert.show("This email has already been used"));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    alert.show("Logged Out");
  };  


  return (
    <div className = "App">
      <Switch>
        <Route 
        path = "/login"
        render= {(props) => (
          <Login {...props} handleLogin={handleLogin}/>)}
        />

        <Route 
        path = "/register"
        render= {(props) => (
          <Register {...props} handleRegister={handleRegister}/>)}
        />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
