import React, { Component } from "react";
import firebase from "../firebase.js";
import { Link, Redirect } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      email: "",
      password: "",
      password2: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.loadDataFromLocalStorage();
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
      console.log("Either email or length of the passwords are not valid.");
      return false;
    }
    if (!this.areSamePasswords(password, password2)) {
      console.log("The passwords are not matching. Please try again.");
      return false;
    }
    return true;
  };

  sendRegistration = async () => {
    const { email, password } = this.state;
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(e => {
        console.error("Error on creating user account.", e);
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
        .catch(e => {
          console.error("Something went wrong during sending email verification.",e);
        });
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (this.validateForm()) {
      await this.sendRegistration();
      this.verifyUserEmail();
      this.setState({
        redirect: true
      })
    } else {
      console.log("Validation failed");
    }
  };

  render() {
    if(this.state.redirect){
      return <Redirect to="/" />;
    }else{
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
          <div className="navs">
            <Link to="/">Tillbaka</Link>
            <Link to="/login">Redan skapat</Link>
          </div>
        </div>)
    }
  }
}

export default Register;
