import React, { Component } from "react";
import { StockConsumer } from "../context";

class AddStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "",
      quantity: "",
      purchasePrice: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  resetForm() {
    this.setState({
      label: "",
      quantity: "",
      purchasePrice: ""
    });
  }

  render() {
    return (
      <div className="form-container">
        <input
          type="text"

          name="label"
          value={this.state.label}
          placeholder="Aktienamn"
          onChange={this.handleChange}
        />
        <input
          type="text"
          value={this.state.quantity}
          name="quantity"
          placeholder="Antal"
          onChange={this.handleChange}
        />
        <input
          type="text"
          value={this.state.purchasePrice}
          name="purchasePrice"
          placeholder="Inköpspris"
          onChange={this.handleChange}
        />
        <StockConsumer>
          {data => {
            return (
              <button
                type="submit"
                onClick={() => {
                  data.addToList(
                    this.state.label,
                    this.state.quantity,
                    this.state.purchasePrice
                  );
                  this.resetForm();
                }}
                className="btn btn_addStock"
              >
                Add Stock
              </button>
            );
          }}
        </StockConsumer>
      </div>
    );
  }
}

export default AddStock;
