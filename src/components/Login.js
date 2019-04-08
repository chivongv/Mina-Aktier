import React, { Component } from "react";
import firebase from "../firebase.js";
import { Redirect } from "react-router-dom";

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

  sendLogin = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    const user = firebase.auth().currentUser;
    if (user) {
      this.props.history.push("/");
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.email.length > 0 && this.state.password.length > 0) {
      this.sendLogin();
    }
  };

  render() {
    const user = firebase.auth().currentUser;
    if (user) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-container">
        <form onSubmit={event => this.handleSubmit(event)}>
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
          <button type="submit" className="btn btn_login btn-blue">
            Logga in
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
