import React from "react";
import firebase from "../firebase.js";
import { Redirect } from "react-router-dom";

function Logout() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase
        .auth()
        .signOut()
        .then(function() {
          console.log("Log out successfully.");
        })
        .catch(function(error) {
          console.log("Couldn't log user out.", error);
        });
    }
  });
  return <Redirect to="/login" />;;
}

export default Logout;
