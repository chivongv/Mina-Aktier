import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./theme/style.css";
import "./App.css";
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Footer from "./components/Footer";
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/register" component={Register} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
