import React, { Component } from "react";

class SellModal extends Component {
  state = {
    quantity: '',
    sellPrice: '',
    transactionDate: ''
  };

  componentDidMount(){
    const {lastPrice} = this.props.modalStock;
    this.setState({
      sellPrice: lastPrice
    })
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    if (!this.props.showSellModal) {
      return null;
    } else {
      return (
        <div className="modalContainer">
          <h2 className="sell-modal-title">Sälj {this.props.modalStock.name}</h2>
          <div className="form-container">
            <input
              type="number"
              value={this.state.quantity}
              name="quantity"
              min="1"
              placeholder="Antal"
              onChange={this.handleChange}
              autoComplete="off"
            />
            <input
              type="number"
              value={this.state.sellPrice}
              name="sellPrice"
              placeholder="Säljspris"
              onChange={this.handleChange}
              autoComplete="off"
            />
            <input
              type="date"
              value={this.state.transactionDate}
              name="transactionDate"
              placeholder="Transaktionsdatum"
              onChange={this.handleChange}
            />
            <div className="modalOptions">
              <button
                type="button"
                onClick={() => {
                  this.props.toggleSellModal();
                }}
                className="btn btn_goBack"
              >
                Tillbaka
              </button>
              <button
                type="button"
                onClick={() => {
                  const {
                    quantity,
                    sellPrice,
                    transactionDate
                  } = this.state;
                  this.props.sellStock(quantity, sellPrice, transactionDate);
                }}
                className="btn btn_sellStock"
              >
                Sälj
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default SellModal;
