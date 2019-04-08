import React, { Component } from "react";
import firebase from "./firebase.js";
import { stocksAPI } from "./data";

const StockContext = React.createContext();

class StockProvider extends Component {
  state = {
    mStocks: []
  };

  setInitStocks = () => {
    this.setState({
      mStocks: [
        {
          label: "Investor A",
          quantity: "50",
          purchasePrice: "355",
          lastPrice: "415.7"
        },
        {
          label: "Investor B",
          quantity: "15",
          purchasePrice: "435",
          lastPrice: "413.8"
        },
        {
          label: "Tesla",
          quantity: "10",
          purchasePrice: "435",
          lastPrice: "345.75"
        }
      ]
    });
  };

  componentDidMount() {
    this.setInitStocks();
  }

  addToList = (label, quantity, purchasePrice) => {
    if (label.length > 0 && quantity.length > 0 && purchasePrice.length > 0) {
      const api_id = stocksAPI[label];
      // console.log("api_id", api_id);
      let lastPrice = 0;
      let item = {
        label,
        quantity,
        purchasePrice,
        lastPrice
      };
      this.setState(prevState => ({
        mStocks: [...prevState.mStocks, item]
      }));
      if (api_id) {
        this.updateStock(api_id).then(val => {
          lastPrice = val;
          item = {
            label,
            quantity,
            purchasePrice,
            lastPrice
          };
          const newStocks = [...this.state.mStocks];
          newStocks.pop();
          newStocks.push(item);
          this.setState({
            mStocks: [...newStocks]
          });
          // todo: update lastPrice in stock in state and db
          // push new item into db
        });
      }
    }
  };
  // todo: give unique id for each stock to delete the stock in state

  async updateStock(api_id) {
    const api_url =
      "https://limitless-garden-26844.herokuapp.com/https://www.avanza.se/_mobile/market/stock/";
    try {
      let res = await fetch(api_url + api_id);
      if (res.status === 200) {
        let data = await res.json();
        // console.log(data);
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
    const api_url =
      "https://limitless-garden-26844.herokuapp.com/https://www.avanza.se/_mobile/market/stock/";
    fetch(api_url)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(data => {
        if (data) {
          console.log(data);
        }
      })
      .catch(err => {
        console.error("Error!", err);
      });
  };

  saveEditing = id => {
    console.log("in save");
  };

  deleteFromList = id => {
    console.log("in delete");
  };

  render() {
    return (
      <StockContext.Provider
        value={{
          ...this.state,
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
