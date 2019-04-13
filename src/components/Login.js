import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { StockConsumer } from "../context";
import firebase from "../firebase.js";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = async (event, loginWithEmailPassword) => {
    event.preventDefault();
    await loginWithEmailPassword(this.state.email, this.state.password);
    const user = await firebase.auth().currentUser;
    await console.log(user != null);
    if (user) {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <StockConsumer>
        {data => {
          if (!data.isUserLoggedIn) {
            return (
              <div className="login-container form-container">
                <h2>Logga in</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Lösenord"
                  onChange={this.handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={event =>
                    this.handleSubmit(event, data.loginWithEmailPassword)
                  }
                  className="btn btn_login btn-blue"
                >
                  Logga in
                </button>
              </div>
            );
          } else {
            return <Redirect to="/" />;
          }
        }}
      </StockConsumer>
    );
  }
}

export default Login;
