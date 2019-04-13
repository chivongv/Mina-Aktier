import React from "react";
import firebase from "../firebase.js";
import { Redirect } from "react-router-dom";
import { StockConsumer } from "../context";

function Logout() {
  const user = firebase.auth().currentUser;
  if (user) {
    return (
      <React.Fragment>
        <StockConsumer>
          {data => {
            data.writeUserDataToDB();
          }}
        </StockConsumer>
        <Redirect to="/" />;
      </React.Fragment>
    );
  }
  return <Redirect to="/login" />;
}

export default Logout;
