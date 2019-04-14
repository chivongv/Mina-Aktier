import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

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

  componentDidMount() {
    this.props.loadDataFromLocalStorage();
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event, loginWithEmailPassword) => {
    event.preventDefault();
    this.props.loginWithEmailPassword(this.state.email, this.state.password);
  };

  render() {
    if (!this.props.isUserLoggedIn) {
      return (
        <div className="login-container form-container">
          <h2>Logga in</h2>
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
