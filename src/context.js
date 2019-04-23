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
    lastUpdated: "",
    modalStock: null,
    showBuyModal: false,
    showSellModal: false
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
    }
    if (transactions == null) {
      transactions = [];
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
        this.setUserDBDataToState();
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
      mStocks: stocks,
      transactions
    });
  };

  getUserDataFromDB = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      let uStocks = [];
      let uTransactions = [];
      await db
        .collection("users")
        .doc(userId)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.data().mStocks != null) {
            uStocks = querySnapshot.data().mStocks;
          }
          if (querySnapshot.data().transactions != null) {
            uTransactions = querySnapshot.data().transactions;
          }
        });
      return { uStocks, uTransactions };
    }
  };

  setUserDBDataToState = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const { uStocks, uTransactions } = await this.getUserDataFromDB();
        await this.setUserDataToState(uStocks, uTransactions);
        this.saveStateToLocalStorage(this.state);
      }
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

  addStocksTransactionToState = async (stocks, transaction) => {
    this.setState(prevState => ({
      mStocks: stocks,
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
        lastPrice = stock.lastPrice;
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
      let sortedStocks = await [...this.state.mStocks, item].sort(
        this.compareStockName
      );
      await this.addStocksTransactionToState(sortedStocks, transaction);
      this.setUserDataInDB(this.state.mStocks, this.state.transactions);
      this.saveStateToLocalStorage(this.state);
    } else {
      console.log("Please fill out all fields.");
    }
  };

  getStock = id => {
    return this.state.mStocks[id];
  };

  setModalStock = stock => {
    this.setState({
      modalStock: stock
    });
  };

  toggleBuyModal = () => {
    this.setState(prevState => ({
      showBuyModal: !prevState.showBuyModal
    }));
  };

  toggleSellModal = () => {
    this.setState(prevState => ({
      showSellModal: !prevState.showSellModal
    }));
  };

  buyStock = async (quantity, purchasePrice, transactionDate) => {
    if (quantity > 0 && purchasePrice > 0) {
      if (transactionDate == null || transactionDate === "") {
        transactionDate = this.getCurrentDate();
      }
      const { name } = this.state.modalStock;
      const index = this.state.mStocks.findIndex(item => item.name === name);
      const oldStock = this.state.mStocks[index];
      const nQuantity = Number(oldStock.quantity) + Number(quantity);
      const nPurchasePrice = Number(
        parseFloat(
          (oldStock.purchasePrice * oldStock.quantity +
            quantity * purchasePrice) /
            nQuantity
        ).toFixed(2)
      );
      const nStock = {
        api_id: oldStock.api_id,
        name,
        quantity: nQuantity,
        purchasePrice: nPurchasePrice,
        lastPrice: oldStock.lastPrice
      };
      const transaction = {
        transactionDate,
        transactionType: "buy",
        name,
        quantity,
        purchasePrice
      };
      let nStocks = this.state.mStocks.slice(0);
      nStocks[index] = nStock;
      await this.addStocksTransactionToState(nStocks, transaction);
      this.toggleBuyModal();
      this.setUserDataInDB(this.state.mStocks, this.state.transactions);
      this.saveStateToLocalStorage(this.state);
    }
  };

  sellStock = async (quantity, sellPrice, transactionDate) => {
    if (quantity > 0 && sellPrice > 0) {
      const { name } = this.state.modalStock;
      const index = this.state.mStocks.findIndex(item => item.name === name);
      const oldStock = this.state.mStocks[index];
      if (quantity > oldStock.quantity) {
        console.log("You tried to sell more than you have.");
        this.toggleSellModal();
        return;
      }
      if (transactionDate == null || transactionDate === "") {
        transactionDate = this.getCurrentDate();
      }
      const nQuantity = Number(oldStock.quantity) - Number(quantity);
      let nStocks = this.state.mStocks.slice(0);
      if (nQuantity > 0) {
        const nStock = {
          api_id: oldStock.api_id,
          name,
          quantity: nQuantity,
          purchasePrice: oldStock.purchasePrice,
          lastPrice: oldStock.lastPrice
        };
        nStocks[index] = await nStock;
      } else {
        await nStocks.splice(index, 1);
      }
      const transaction = {
        transactionDate,
        transactionType: "sell",
        name,
        quantity,
        sellPrice: sellPrice
      };
      await this.addStocksTransactionToState(nStocks, transaction);
      this.toggleSellModal();
      this.setUserDataInDB(this.state.mStocks, this.state.transactions);
      this.saveStateToLocalStorage(this.state);
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
          setModalStock: this.setModalStock,
          toggleBuyModal: this.toggleBuyModal,
          toggleSellModal: this.toggleSellModal,
          buyStock: this.buyStock,
          sellStock: this.sellStock,
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
