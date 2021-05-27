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
  const [email, setEmail] = useState(""); // where ID refers to user's email 
  //const [isTutor, setIsTutor] = useState(false);    // for future dashboard where selective access to announcment posting 

  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:3001')// connect to the database here 
      .then((response) => response.json())
      .then((json) => {  //or data, whatever 
        setUsername(json.username);
        setEmail(json.email);
      });
    }
  }, [isLoggedIn]); 

// watch out for useState names vs database attribute name here -- does not correspond, settle in future impl
  const handleLogin = (e, data) => {
    console.log(data);
    e.preventDefault();
    fetch('http://localhost:3001') // connect to db here 
    .then((response) => {
      if (response.ok) {
        return response.json();  // or .text() ????
      } else {
        throw new Error("Error");
      }
  })
  .then((json) => {
    localStorage.setItem("token", json.token);
    setIsLoggedIn(true);
    setUsername(json.user.username);
    setEmail(json.user.email);
    props.history.push("/");
  })
  .catch((error) => alert.show("Wrong Username or Password"));
};

  const handleRegister = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:3001', { // connect to db here 
method: 'POST',
headers: {
  'Content-Type': 'application/json', 
},
body: JSON.stringify({username, email}),
    })
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
    props.history.push("/Login");
  })
  .catch((error) => alert.show("This email has already been used"));
  };

  /*   
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    alert.show("Logged Out");
  };  
*/

  return (
    <div className = "App">
      <Switch>
        <Route 
        path = "/Login"
        render= {(props) => (
          <Login {...props} handleLogin={handleLogin}/>)}
        />

        <Route 
        path = "/Register"
        render= {(props) => (
          <Register {...props} handleRegister={handleRegister}/>)}
        />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
