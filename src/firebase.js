import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_apiKey || process.env.apiKey,
  authDomain: process.env.REACT_APP_authDomain || process.env.authDomain,
  databaseURL: process.env.REACT_APP_databaseURL || process.env.databaseURL,
  projectId: process.env.REACT_APP_projectId || process.env.projectId,
  storageBucket: process.env.REACT_APP_storageBucket || process.env.storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId || process.env.messagingSenderId
};
firebase.initializeApp(config);

export default firebase;
