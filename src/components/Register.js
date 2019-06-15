import React, { Component } from "react";
import firebase from "../firebase.js";
import { Link, Redirect } from "react-router-dom";
import ToggleMode from "./ToggleMode";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      email: "",
      password: "",
      password2: "",
      statusMsg: "",
      emailErrorMsg: "",
      passwordErrorMsg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
    this.props.loadDataFromLocalStorage();
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      emailErrorMsg: "",
      passwordErrorMsg: ""
    });
  };

  isEmailValid = email => {
    const MIN_EMAIl_LENGTH = 3;
    return email.length > MIN_EMAIl_LENGTH && email.toLowerCase().includes('@');
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
    let emailErrorMsg="", passwordErrorMsg="";
    if (
      !this.isEmailValid(email) ||
      !this.isPasswordLengthValid(password) ||
      !this.isPasswordLengthValid(password2)
    ) {
      emailErrorMsg = "Antingen felaktig mejladress eller lösenord. " +
      "Lösenordets längd måste vara större än 6.";
    }
    if (!this.areSamePasswords(password, password2)) {
      passwordErrorMsg = "Lösenorden matchar inte varandra. Vänligen försök igen."
    }
    if(emailErrorMsg.length > 0 || passwordErrorMsg.length > 0){
      return [false, emailErrorMsg, passwordErrorMsg];
    }
    return [true];
  };

  sendRegistration = async () => {
    const { email, password } = this.state;
    try{
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    }catch(e) {
      this.setState({
        emailErrorMsg: "Någonting gick fel vid registering."
      });
    };
  };

  verifyUserEmail = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      let statusMsg = "";
      try {
        await user.sendEmailVerification();
        statusMsg= "Vi har skickat verifieringslänk i ett e-postmeddelande till dig.";
      } catch (e) {
        statusMsg= "Någonting gick fel när vi skulle skicka verifieringslänk till dig.";
      }
      return statusMsg;
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    const isValidate=this.validateForm();
    if (isValidate[0]) {
      await this.sendRegistration();
      await this.verifyUserEmail();
      this.setState({
        redirect: true
      })
    } else {
      this.setState({
        emailErrorMsg: isValidate[1],
        passwordErrorMsg: isValidate[2]
      });
    }
  };

  render() {
    if(this.state.redirect){
      return <Redirect to="/" />;
    }else{
      return (
        <div className="container">
          <nav className="nav">
            <ToggleMode
              loadDataFromLocalStorage={this.props.loadDataFromLocalStorage}
              checked={this.props.checked}
              toggleUIMode={this.props.toggleUIMode}
            />
          </nav>
          <div className="login-container form-container">
            <h2>Registrera</h2>
            {this.state.emailErrorMsg ? <h3 className="errorMsg">{this.state.emailErrorMsg}</h3> : null}
            {this.state.passwordErrorMsg ? <h3 className="errorMsg">{this.state.passwordErrorMsg}</h3> : null}
            <form onSubmit={event => this.handleSubmit(event)} noValidate>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={this.handleChange}
                ref={this.inputRef}
              />
              <input
                type="password"
                name="password"
                placeholder="Lösenord"
                onChange={this.handleChange}
              />
              <input
                type="password"
                name="password2"
                placeholder="Lösenord igen"
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn_register btn-blue">
                Registrera
              </button>
            </form>
            <div className="navs">
              <Link to="/">Tillbaka</Link>
              <Link to="/login">Logga in</Link>
            </div>
          </div>
        </div>)
    }
  }
}

export default Register;
