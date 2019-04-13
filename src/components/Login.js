import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { StockConsumer } from "../context";

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

  handleSubmit = event => {
    event.preventDefault();
    this.setState = {
      email: "",
      password: ""
    };
  };

  render() {
    return (
      <StockConsumer>
        {data => {
          if (!data.user) {
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
                  onClick={() =>
                    data.loginWithEmailPassword(
                      this.state.email,
                      this.state.password
                    )
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
