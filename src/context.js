import React, { Component } from "react";
import firebase, { db } from "./firebase.js";

const StockContext = React.createContext();

class StockProvider extends Component {
  state = {
    user: null,
    mStocks: []
  };

  loadDataFromLocalStorage = () => {
    const stocks = localStorage.getItem("mStocks");
    if (stocks) {
      console.log(stocks);
      this.setState({
        mStocks: stocks
      });
      console.log(this.state.mStocks);
    }
  };

  saveDataInLocalStorage = () => {
    if (localStorage.getItem("mStocks")) {
      console.log(localStorage.getItem("mStocks"));
      document.documentElement.setAttribute("mStocks", this.state.mStocks);
    }
  };

  setUser(user) {
    this.setState({
      user
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

  sendLogin = (email, password) => {
    const that = this;
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            firebase.auth().onAuthStateChanged(function(user) {
              that.setUser(user);
              if (user) {
                that.getStocksFromDB();
                //that.history.push("/");
              } else {
                //that.history.push("/login");
              }
            });
          })
          .catch(function(error) {
            console.log(error.code, error.message);
          });
      });
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

  componentDidMount() {
    const that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        that.setUser(user);
      }
    });
  }

  addToList = (name, api_id, quantity, purchasePrice) => {
    if (name.length > 0 && quantity > 0 && purchasePrice > 0) {
      let lastPrice = 0;
      let item = {
        name,
        api_id,
        quantity,
        purchasePrice,
        lastPrice: 0
      };
      if (api_id) {
        this.updateStock(api_id).then(val => {
          lastPrice = val;
          item = {
            name,
            api_id,
            quantity,
            purchasePrice,
            lastPrice
          };
          this.setState(prevState => ({
            mStocks: [...prevState.mStocks, item]
          }));
        });
      }
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

  saveEditing = id => {
    console.log("in save");
  };

  deleteFromList = index => {
    const user = this.state.user;
    if (user) {
      const userId = user.uid;
      const mStocks = db.collection("users").doc(userId);
      console.log(mStocks);
    }
    // this.setState(prevState => {
    //   mStocks: prevState.mStocks.splice(index, 1);
    // });
    // console.log(this.state.mStocks);
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
