import React, { Component } from "react";
import firebase, { db } from "./firebase.js";

const StockContext = React.createContext();

class StockProvider extends Component {
  state = {
    uisUserLoggedIn: false,
    mStocks: []
  };

  loadDataFromLocalStorage = () => {
    try {
      const state = JSON.parse(localStorage.getItem("state"));
      if (state) {
        this.setState({
          isUserLoggedIn: state.isUserLoggedIn,
          mStocks: state.mStocks
        });
      }
    } catch (e) {
      console.error("Error on loading data from localstorage.", e);
    }
  };

  saveDataToLocalStorage = state => {
    try {
      localStorage.setItem("state", JSON.stringify(state));
    } catch (e) {
      console.error("Error on saving data to localstorage.", e);
    }
  };

  setIsUserLoggedIn(status) {
    this.setState({
      issUserLoggedIn: status
    });
  }

  loginWithEmailPassword = (email, password) => {
    if (this.isEmailValid(email) > 0 && this.isPasswordValid(password)) {
      this.sendLogin(email, password);
    }
  };

  isEmailValid = email => {
    return email.length > 0;
  };

  isPasswordValid = password => {
    return password.length > 0;
  };

  sendLogin = async (email, password) => {
    // const that = this;
    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = await firebase.auth().currentUser;
      if (user) {
        this.setIsUserLoggedIn(true);
        this.getStocksFromDB();
        //that.history.push("/");
      } else {
        //that.history.push("/login");
      }
    } catch (e) {
      console.error("Error on logging user in.", e);
    }
  };

  getStocksFromDB = () => {
    const that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        that.setUser(user);
        const userId = user.uid;
        db.collection("users")
          .doc(userId)
          .get()
          .then(querySnapshot => {
            const mStocks = querySnapshot.data().mStocks;
            mStocks.forEach(item => {
              that.addToList(
                item.name,
                item.api_id,
                item.quantity,
                item.purchasePrice
              );
            });
          });
      }
    });
  };

  addToList = async (name, api_id, quantity, purchasePrice) => {
    if (name.length > 0 && quantity > 0 && purchasePrice > 0) {
      let lastPrice = 0;
      if (api_id) {
        lastPrice = await this.updateStock(api_id);
      }
      const item = await {
        name,
        api_id,
        quantity,
        purchasePrice,
        lastPrice
      };
      await this.setState(prevState => ({
        mStocks: [...prevState.mStocks, item]
      }));
      await this.saveDataToLocalStorage(this.state);
    } else {
      console.log("Please fill out all fields.");
    }
  };

  async updateStock(api_id) {
    const api_url =
      "https://limitless-garden-26844.herokuapp.com/https://www.avanza.se/_mobile/market/stock/";
    try {
      let res = await fetch(api_url + api_id);
      if (res.status === 200) {
        let data = await res.json();
        return data.lastPrice;
      } else {
        return 0;
      }
    } catch (err) {
      console.error("Something went wrong during updating stock.", err);
      return 0;
    }
  }

  updateAllStocks = () => {
    // todo: do not fetch lastPrice if api_key is 0
    // otherwise loop through mStocks and fetch to update lastPrice
    // let stocks = [];
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = firebase.auth().currentUser.uid;
      console.log(userId);
      firebase
        .collection("users")
        .doc(userId)
        .then({});
    }
  };

  deleteFromList = index => {
    const user = firebase.auth().currentUser;
    console.log(index);
    console.log(user);
    if (user) {
      const userId = user.uid;
      const mStocks = db.collection("users").doc(userId);
      console.log(mStocks);
    }
    /*
    db.collection("users")
      .doc(userId)
      .set({
        mStocks: that.state.mStocks
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });*/
  };

  writeUserDataToDB = () => {
    const that = this;
    const user = this.state.user;
    if (user) {
      const userId = user.uid;
      const mStocks = this.state.mStocks;
      db.collection("users")
        .doc(userId)
        .set({
          mStocks
        })
        .then(() => {
          console.log("Document successfully written!");
          firebase
            .auth()
            .signOut()
            .then(function() {
              console.log("Log out successfully.");
              that.setState({
                user: {},
                mStocks: []
              });
            })
            .catch(function(error) {
              console.log("Couldn't log user out.", error);
            });
        })
        .catch(error => {
          console.error("Error writing document: ", error);
        });
    }
  };

  render() {
    return (
      <StockContext.Provider
        value={{
          ...this.state,
          loadDataFromLocalStorage: this.loadDataFromLocalStorage,
          loginWithEmailPassword: this.loginWithEmailPassword,
          writeUserDataToDB: this.writeUserDataToDB,
          setUserLoggedIn: this.setUserLoggedIn,
          updateAllStocks: this.updateAllStocks,
          addToList: this.addToList,
          saveEditing: this.saveEditing,
          deleteFromList: this.deleteFromList
        }}
      >
        {this.props.children}
      </StockContext.Provider>
    );
  }
}

const StockConsumer = StockContext.Consumer;

export { StockProvider, StockConsumer };
