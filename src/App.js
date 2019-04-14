import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./theme/style.css";
import { StockConsumer } from "./context";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";

class App extends Component {
  render() {
    return (
      <StockConsumer>
        {data => {
          return (
            <React.Fragment>
              <Switch>
                <Route exact path="/" render={() => <Home data={data} />} />
                <Route
                  path="/login"
                  render={() => (
                    <Login
                      loadDataFromLocalStorage={data.loadDataFromLocalStorage}
                      isUserLoggedIn={data.isUserLoggedIn}
                      loginWithEmailPassword={data.loginWithEmailPassword}
                    />
                  )}
                />
                <Route
                  path="/register"
                  render={() => (
                    <Register
                      loadDataFromLocalStorage={
                        data.loadDataFromLocalStorage
                      }
                    />
                  )}
                />
              </Switch>
              <Footer />
            </React.Fragment>
          );
        }}
      </StockConsumer>
    );
  }
}

export default App;
