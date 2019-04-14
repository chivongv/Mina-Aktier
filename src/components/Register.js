import React, { Component } from "react";
import firebase from "../firebase.js";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password2: ""
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

  isEmailValid = email => {
    const MIN_LENGTH = 1;
    return email.length >= MIN_LENGTH;
  };

  isPasswordLengthValid = password => {
    const MIN_PASSWORD_LENGTH = 6;
    return password.length >= MIN_PASSWORD_LENGTH;
  };

  areSamePasswords = (pw, pw2) => {
    return pw === pw2;
  };

  validateForm = () => {
    const { email, password, password2 } = this.state;
    if (
      !this.isEmailValid(email) ||
      !this.isPasswordLengthValid(password) ||
      !this.isPasswordLengthValid(password2)
    ) {
      return false;
    }
    if (!this.areSamePasswords(password, password2)) {
      return false;
    }
    return true;
  };

  sendRegistration = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  verifyUserEmail = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      user
        .sendEmailVerification()
        .then(function() {
          console.log("Email verification sent.");
        })
        .catch(function(error) {
          console.log(
            "Something went wrong during sending email verification.",
            error
          );
        });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.validateForm()) {
      console.log("validation passed");
      this.sendRegistration();
      setTimeout(() => {
        this.verifyUserEmail();
        return <Redirect to="/" />;
      }, 1500);
    } else {
      console.log("validation failed");
      // todo: let user clearly know the errors
    }
  };

  render() {
    return (
      <div className="login-container form-container">
        <h2>Registrera</h2>
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
          <input
            type="password"
            name="password2"
            placeholder="Lösenord igen"
            onChange={this.handleChange}
            required
          />
          <button type="submit" className="btn btn_register btn-blue">
            Registrera
          </button>
        </form>
        <div>
          <Link to="/">Tillbaka</Link>
          <Link to="/login">Redan skapat</Link>
        </div>
      </div>
    );
  }
}

export default Register;
