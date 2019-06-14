import React, { Component } from "react";
import firebase from "../firebase.js";
import { Link } from "react-router-dom";
import ToggleMode from "./ToggleMode";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMsg: ""
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
    const MIN_EMAIl_LENGTH = 3;
    return email.length > MIN_EMAIl_LENGTH && email.toLowerCase().includes('@');
  };

  validateForm = () => {
    const { email } = this.state;
    let errorMsg="";
    if (
      !this.isEmailValid(email)
    ) {
      errorMsg = "Felaktig mejladress";
    }
    if(errorMsg.length > 0){
      return [false, errorMsg];
    }
    return [true];
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const isFormValid = this.validateForm();
    if(isFormValid[0]){
      try{
        await firebase.auth().sendPasswordResetEmail(this.state.email);
        this.setState({errorMsg: "Återställningslänk har skickats till emailadressen. Vänligen kolla din email."});
      }catch(e){
        this.setState({errorMsg: "Någonting gick fel när återställningslänk skulle skickas ut."});
      }
    }else{
      this.setState({errorMsg: isFormValid[1]});
    }
  };

  render(){
    return (<div className="container">
      <nav className="nav">
        <ToggleMode
          loadDataFromLocalStorage={this.props.loadDataFromLocalStorage}
          checked={this.props.checked}
          toggleUIMode={this.props.toggleUIMode}
        />
      </nav>
      <div className="login-container form-container">
        <h2>Återställ lösenord</h2>
        {this.state.errorMsg ? <h4 className="errorMsg">{this.state.errorMsg}</h4> : null}
        <form onSubmit={event => this.handleSubmit(event)} noValidate>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={this.handleChange}
            required
          />
          <button type="submit" className="btn btn_reset btn-blue">
            Skicka
          </button>
        </form>
        <div className="navs">
          <Link to="/">Tillbaka</Link>
          <Link to="/login">Logga in</Link>
          <Link to="/register">Skapa konto</Link>
        </div>
      </div>
    </div>);
  }

}

export default ResetPassword;
