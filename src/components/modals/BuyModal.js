import React, { Component } from "react";

class BuyModal extends Component {
  state = {
    name: '',
    quantity: '',
    purchasePrice: '',
    transactionDate: ''
  };

  componentDidMount(){
    const {name, lastPrice} = this.props.modalStock;
    this.setState({
      name,
      purchasePrice: lastPrice
    })
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    if (!this.props.showBuyModal) {
      return null;
    } else {
      return (
        <div className="modalContainer">
          <h2 className="buy-modal-title">Köp {this.state.name}</h2>
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
              value={this.state.purchasePrice}
              name="purchasePrice"
              placeholder="Inköpspris"
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
                  this.props.toggleBuyModal();
                }}
                className="btn btn_goBack"
              >
                Tillbaka
              </button>
              <button
                type="button"
                onClick={() => {
                  const {
                    name,
                    quantity,
                    purchasePrice,
                    transactionDate
                  } = this.state;
                  this.props.buyStock(name, quantity, purchasePrice,
                    transactionDate);
                  this.props.toggleBuyModal();
                }}
                className="btn btn_buyStock"
              >
                Köp
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default BuyModal;
