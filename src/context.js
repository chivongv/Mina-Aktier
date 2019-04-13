import React, { Component } from "react";
import firebase, { db } from "./firebase.js";

const StockContext = React.createContext();

class StockProvider extends Component {
  state = {
    isUserLoggedIn: false,
    mStocks: []
  };

  loadDataFromLocalStorage = () => {
    try {
      if (localStorage.getItem("mina-aktier") != null) {
        const state = JSON.parse(localStorage.getItem("mina-aktier"));
        if (state) {
          this.setState({
            isUserLoggedIn: state.isUserLoggedIn,
            mStocks: [...state.mStocks]
          });
        }
      }
    } catch (e) {
      console.error("Error on loading data from localstorage.", e);
    }
  };

  saveDataToLocalStorage = state => {
    try {
      localStorage.setItem("mina-aktier", JSON.stringify(state));
    } catch (e) {
      console.error("Error on saving data to localstorage.", e);
    }
  };

  clearState = () => {
    this.setState({
      isUserLoggedIn: false,
      mStocks: []
    });
  };

  clearLocalStorage = () => {
    try {
      localStorage.setItem("mina-aktier", null);
    } catch (e) {
      console.error("Error on clearing localstorage.", e);
    }
  };

  setIsUserLoggedIn(status) {
    this.setState({
      isUserLoggedIn: status
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
    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      await this.setIsUserLoggedIn(true);
      const uStocks = await this.getUserStocksFromDB();
      await this.setStocksToState(uStocks);
      await this.saveDataToLocalStorage(this.state);
    } catch (e) {
      console.error("Error on logging user in.", e);
    }
  };

  sendLogout = () => {
    firebase.auth().onAuthStateChanged(user => {
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
      this.clearLocalStorage();
      this.clearState();
    });
  };

  getUserStocksFromDB = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      let uStocks = [];
      await db
        .collection("users")
        .doc(userId)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.data().mStocks != null) {
            uStocks = querySnapshot.data().mStocks;
          }
        });
      return await uStocks;
    }
  };

  addStockToState = stock => {
    this.setState(prevState => ({
      mStocks: [...prevState.mStocks, stock]
    }));
  };

  setStocksToState = stocks => {
    this.setState({
      mStocks: stocks
    });
  };

  setUserStocksFromDBToState = async () => {
    const uStocks = await this.getUserStocksFromDB();
    await this.setStocksToState(uStocks);
    await this.saveDataToLocalStorage(this.state);
  };

  addToList = async (name, api_id, quantity, purchasePrice) => {
    if (name.length > 0 && quantity > 0 && purchasePrice > 0) {
      let lastPrice = 0;
      if (api_id) {
        lastPrice = await this.fetchStockLastPrice(api_id);
      }
      const item = await {
        name,
        api_id,
        quantity,
        purchasePrice,
        lastPrice
      };
      await this.addStockToState(item);
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        await db
          .collection("users")
          .doc(userId)
          .set({ mStocks: this.state.mStocks });
      }
      await this.saveDataToLocalStorage(this.state);
    } else {
      console.log("Please fill out all fields.");
    }
  };

  fetchStockLastPrice = async api_id => {
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
  };

  updateAllStocks = () => {
    // todo: do not fetch lastPrice if api_key is 0
    // otherwise loop through mStocks and fetch to update lastPrice
    // let stocks = [];
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      console.log(userId);
      firebase
        .collection("users")
        .doc(userId)
        .then({});
    }
  };

  updateStocksInDB = stocks => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      db.collection("users")
        .doc(userId)
        .set({
          mStocks: stocks
        })
        .then()
        .catch(error => {
          console.error("Error writing stocks to DB: ", error);
        });
    }
  };

  deleteFromList = index => {
    let mStocks = [...this.state.mStocks];
    mStocks.splice(index, 1);
    this.setStocksToState(mStocks);
    const user = firebase.auth().currentUser;
    if (user) {
      this.updateStocksInDB(mStocks);
    }
    this.saveDataToLocalStorage(this.state);
  };

  render() {
    return (
      <StockContext.Provider
        value={{
          ...this.state,
          loadDataFromLocalStorage: this.loadDataFromLocalStorage,
          loginWithEmailPassword: this.loginWithEmailPassword,
          sendLogout: this.sendLogout,
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
