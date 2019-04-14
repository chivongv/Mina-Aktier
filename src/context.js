import React, { Component } from "react";
import firebase, { db } from "./firebase.js";

const StockContext = React.createContext();

class StockProvider extends Component {
  state = {
    checked: false,
    theme: "light",
    isUserLoggedIn: false,
    mStocks: []
  };

  loadDataFromLocalStorage = async () => {
    try {
      if (localStorage.getItem("mina-aktier") != null) {
        const state = await JSON.parse(localStorage.getItem("mina-aktier"));
        if (state) {
          await this.setStateFromState(state);
          document.documentElement.setAttribute("data-theme", this.state.theme);
        }
      }
    } catch (e) {
      console.error("Error on loading data from localstorage.", e);
    }
  };

  saveStateToLocalStorage = state => {
    try {
      localStorage.setItem("mina-aktier", JSON.stringify(state));
    } catch (e) {
      console.error("Error on saving data to localstorage.", e);
    }
  };

  setStateFromState = state => {
    let { checked, theme, isUserLoggedIn, mStocks } = state;
    if (mStocks == null) {
      mStocks = [];
    }
    this.setState({
      checked: checked,
      theme: theme,
      isUserLoggedIn: isUserLoggedIn,
      mStocks: mStocks
    });
  };

  toggleUIMode = async () => {
    await this.setState(prevState => ({
      checked: !prevState.checked,
      theme: prevState.theme === "light" ? "dark" : "light"
    }));
    this.saveStateToLocalStorage(this.state);
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

  loginWithEmailPassword = async (email, password) => {
    if (this.isEmailValid(email) > 0 && this.isPasswordValid(password)) {
      try {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION);
        await firebase.auth().signInWithEmailAndPassword(email, password);
        this.setIsUserLoggedIn(true);
        await this.setUserDBDataToState();
      } catch (e) {
        console.error("Error on logging user in.", e);
      }
    }
  };

  isEmailValid = email => {
    return email.length > 0;
  };

  isPasswordValid = password => {
    return password.length > 0;
  };

  setUserDBDataToState = async (email, password) => {
    try {
      const uStocks = await this.getUserStocksFromDB();
      await this.setStocksToState(uStocks);
      await this.saveStateToLocalStorage(this.state);
    } catch (e) {
      console.error("Error on setting user data to state.", e);
    }
  };

  sendLogout = async () => {
    const user = await firebase.auth().currentUser;
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
    await this.clearLocalStorage();
    this.clearState();
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
    if (stock != null) {
      this.setState(prevState => ({
        mStocks: [...prevState.mStocks, stock]
      }));
    }
  };

  setStocksToState = stocks => {
    if (stocks != null) {
      this.setState({
        mStocks: stocks
      });
    }
  };

  setUserStocksFromDBToState = async () => {
    const uStocks = await this.getUserStocksFromDB();
    await this.setStocksToState(uStocks);
    await this.saveStateToLocalStorage(this.state);
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
      await this.saveStateToLocalStorage(this.state);
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
    this.saveStateToLocalStorage(this.state);
  };

  render() {
    return (
      <StockContext.Provider
        value={{
          ...this.state,
          toggleUIMode: this.toggleUIMode,
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
