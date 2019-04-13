import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./theme/style.css";
import { StockConsumer } from "./context";
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Footer from "./components/Footer";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
