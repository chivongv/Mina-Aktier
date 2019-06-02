import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMsg: ""
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
    const MIN_EMAIl_LENGTH = 3;
    return email.length > MIN_EMAIl_LENGTH && email.toLowerCase().includes('@');
  };

  isPasswordLengthValid = password => {
    const MIN_PASSWORD_LENGTH = 6;
    return password.length >= MIN_PASSWORD_LENGTH;
  };

  validateForm = () => {
    const { email, password } = this.state;
    let errorMsg="";
    if (
      !this.isEmailValid(email) ||
      !this.isPasswordLengthValid(password)
    ) {
      errorMsg = "Felaktig mejladress eller lösenord. " +
      "Lösenordets längd måste vara större än 6.";
    }
    if(errorMsg.length > 0){
      return [false, errorMsg];
    }
    return [true];
  }

  handleSubmit = async (event, loginWithEmailPassword) => {
    event.preventDefault();
    const isFormValid = this.validateForm();
    if(isFormValid[0]){
      try{
        const msg = await this.props.loginWithEmailPassword(this.state.email, this.state.password);
        if(msg) this.setState({errorMsg: msg});
      }catch(e){
        console.log(e);
      }
    }else{
      this.setState({errorMsg: isFormValid[1]});
    }
  };

  render() {
    if (!this.props.isUserLoggedIn) {
      return (
        <div className="login-container form-container">
          <h2>Logga in</h2>
          {this.state.errorMsg ? <h4 className="errorMsg">{this.state.errorMsg}</h4> : null}
          <form onSubmit={event => this.handleSubmit(event)} noValidate>
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
          <div className="navs">
            <Link to="/">Tillbaka</Link>
            <Link to="/">Glöm lösenord</Link>
            <Link to="/register">Skapa konto</Link>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default Login;
