import React, { Component } from "react";

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
          purchasePrice: "350",
          latestPrice: "415"
        },
        {
          label: "Investor B",
          quantity: "15",
          purchasePrice: "435",
          latestPrice: "0"
        }
      ]
    });
  };

  componentDidMount() {
    this.setInitStocks();
  }

  addToList = (label, quantity, purchasePrice) => {
    if(label.length>0 && quantity.length>0 && purchasePrice.length>0){
      const item = {
        label, quantity, purchasePrice, latestPrice: "0"
      }
      this.setState(prevState => ({
        mStocks: [...prevState.mStocks, item]
      }));
    }
  };

  render() {
    return (
      <StockContext.Provider
        value={{
          ...this.state,
          addToList: this.addToList
        }}
      >
        {this.props.children}
      </StockContext.Provider>
    );
  }
}

const StockConsumer = StockContext.Consumer;

export { StockProvider, StockConsumer };
