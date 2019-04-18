import React, { Component } from "react";
import firebase, { db } from "./firebase.js";

const StockContext = React.createContext();

class StockProvider extends Component {
  state = {
    checked: false,
    theme: "light",
    isUserLoggedIn: null,
    mStocks: [],
    transactions: [],
    lastUpdated: ""
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setIsUserLoggedIn(true);
      } else {
        this.setIsUserLoggedIn(false);
      }
    });
  }

  loadDataFromLocalStorage = async () => {
    try {
      if (localStorage.getItem("mina-aktier") != null) {
        const state = await JSON.parse(localStorage.getItem("mina-aktier"));
        if (state) {
          this.setStateFromState(state);
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
    let {
      checked,
      theme,
      isUserLoggedIn,
      mStocks,
      transactions,
      lastUpdated
    } = state;
    if (mStocks == null) {
      mStocks = [];
      console.log("needed?");
    }
    if (transactions == null) {
      transactions = [];
      console.log("needed2?");
    }
    this.setState({
      checked,
      theme,
      isUserLoggedIn,
      mStocks,
      transactions,
      lastUpdated
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
      mStocks: [],
      transactions: [],
      lastUpdated: ""
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
        const user = await firebase.auth().currentUser;
        if (user) {
          this.setIsUserLoggedIn(true);
          this.setUserDBDataToState();
        }
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

  setUserDataToState = (stocks, transactions) => {
    this.setState({
      stocks,
      transactions
    });
  }

  getUserDataFromDB = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      let uStocks = []
      let uTransactions = []
      await db
        .collection("users")
        .doc(userId)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.data().mStocks != null) {
            uStocks = querySnapshot.data().mStocks;
          }
          if(querySnapshot.data().uTransactions != null){
            uTransactions = querySnapshot.data().uTransactions;
          }
        });
      return {uStocks, uTransactions};
    }
  };

  setUserDBDataToState = async () => {
    try {
      const {uStocks, uTransactions} = await this.getUserDataFromDB();
      await console.log(uStocks, uTransactions);
      await this.setUserDataToState(uStocks, uTransactions);
      await console.log(this.state);
      this.saveStateToLocalStorage(this.state);
    } catch (e) {
      console.error("Error on setting user data to state.", e);
    }
  };

  sendLogout = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      await firebase
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
  };

  addStockToState = stock => {
    if (stock != null) {
      this.setState(prevState => ({
        mStocks: [...prevState.mStocks, stock]
      }));
    }
  };

  addTransationToState = transaction => {
    this.setState(prevState => ({
      transactions: [...prevState.transactions, transaction]
    }));
  };

  addStockTransactionToState = async (stock, transaction) => {
    let sortedStocks = await [...this.state.mStocks, stock].sort(
      this.compareStockName
    );
    this.setState(prevState => ({
      mStocks: sortedStocks,
      transactions: [...prevState.transactions, transaction]
    }));
  };

  setStocksToState = stocks => {
    if (stocks != null) {
      this.setState({
        mStocks: stocks
      });
    }
  };

  compareStockName = (s1, s2) => {
    return s1.name > s2.name ? 1 : s1.name < s2.name ? -1 : 0;
  };

  setStocksInDB = stocks => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      db.collection("users")
        .doc(userId)
        .set({ mStocks: stocks })
        .catch(error => {
          console.error("Error writing stocks to DB: ", error);
        });
    }
  };

  setUserDataInDB = (stocks, transactions) => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      db.collection("users")
        .doc(userId)
        .set({
          mStocks: stocks,
          transactions: transactions,
          lastUpdated: this.getCurrentDate()
        })
        .catch(error => {
          console.error("Error writing stocks to DB: ", error);
        });
    }
  };

  getCurrentDate = () => {
    let d = new Date();
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = month <= 9 ? "0" + month : month;
    let day = d.getDate();
    return year + "-" + month + "-" + day;
  };

  addToStockList = async (
    name,
    api_id,
    quantity,
    purchasePrice,
    transactionDate
  ) => {
    if (name.length > 0 && quantity > 0 && purchasePrice > 0) {
      if (transactionDate == null || transactionDate === "") {
        transactionDate = this.getCurrentDate();
      }
      let lastPrice = 0;
      if (api_id) {
        let stock = await this.fetchStockFromAPI(api_id);
        lastPrice = this.getLastPriceFromStock(stock);
      }
      const item = await {
        api_id,
        name,
        quantity,
        purchasePrice,
        lastPrice
      };
      const transaction = {
        transactionDate,
        transactionType: "buy",
        name,
        quantity,
        purchasePrice
      };
      await this.addStockTransactionToState(item, transaction);
      this.setUserDataInDB(this.state.mStocks, this.state.transactions);
      console.log(this.state.transactions);
      this.saveStateToLocalStorage(this.state);
    } else {
      console.log("Please fill out all fields.");
    }
  };

  fetchStockFromAPI = async api_id => {
    const api_url =
      "https://limitless-garden-26844.herokuapp.com/https://www.avanza.se/_mobile/market/stock/";
    try {
      let res = await fetch(api_url + api_id);
      if (res.status === 200) {
        let data = await res.json();
        return data;
      } else {
        return 0;
      }
    } catch (err) {
      console.error("Something went wrong during updating stock.", err);
      return 0;
    }
  };

  getLastPriceFromStock(stock) {
    return stock.lastPrice;
  }

  updateAllStocks = async () => {
    let stocks = await this.state.mStocks.slice(0);
    for (let index = 0; index < stocks.length; index++) {
      let item = stocks[index];
      let lastPrice = 0;
      if (item.api_id !== 0) {
        let fetchedStock = await this.fetchStockFromAPI(item.api_id);
        lastPrice = await fetchedStock.lastPrice;
        stocks[index].lastPrice = await lastPrice;
      }
    }
    this.setStocksToState(stocks);
    this.setStocksInDB(stocks);
  };

  deleteFromList = async index => {
    let mStocks = this.state.mStocks.slice(0);
    const { name, quantity, purchasePrice } = mStocks[index];
    const transactionDate = this.getCurrentDate();
    const transaction = {
      transactionDate,
      transactionType: "sell",
      name,
      quantity,
      sellPrice: purchasePrice
    };
    await mStocks.splice(index, 1);
    await this.setState(prevState => ({
      mStocks,
      transactions: [...prevState.transactions, transaction]
    }));
    this.setUserDataInDB(mStocks, this.state.transactions);
    console.log(this.state.transactions);
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
          addToStockList: this.addToStockList,
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
