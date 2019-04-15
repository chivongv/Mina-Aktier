import React, { PureComponent } from "react";
import { stockData } from "../data";

class AddStock extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stocks: stockData,
      suggestions: [],
      name: "",
      api_id: 0,
      quantity: '',
      purchasePrice: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  suggestionSelected = value => {
    this.setState(() => ({
      label: value,
      suggestions: []
    }));
  };

  filterSuggestions = value => {
    let suggestions = [];
    if (value.length > 0) {
      suggestions = this.state.stocks.filter(stock => {
        return stock.name.toLowerCase().search(value.toLowerCase()) !== -1;
      });
    }
    this.setState({
      name: value,
      suggestions
    });
  };

  handleChange(event) {
    const { name, value } = event.target;
    if (name === "name") {
      this.filterSuggestions(value);
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  submitForm = () => {
    this.props.addToStockList(
      this.state.name,
      this.state.api_id,
      this.state.quantity,
      this.state.purchasePrice
    );
    this.resetForm();
  }

  resetForm = () => {
    this.setState({
      name: "",
      api_id: 0,
      quantity: '',
      purchasePrice: ''
    });
  }

  renderSuggestions() {
    const { name, suggestions } = this.state;
    if (name.length > 0) {
      return suggestions.slice(0, 10).map((item, index) => (
        <div
          className="list-item"
          key={index}
          onClick={() => {
            this.setState({
              name: item.name,
              api_id: item.api_id,
              suggestions: []
            });
          }}
        >
          {item.name}
        </div>
      ));
    }
  }

  render() {
    return (
      <div className="form-container">
        <div className="autoCompleteText">
          <input
            type="text"
            name="name"
            value={this.state.name}
            placeholder="Aktienamn"
            onChange={this.handleChange}
            autoComplete="off"
          />
          {this.renderSuggestions()}
        </div>
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
        <button
          type="button"
          onClick={() => {
            this.submitForm();
          }}
          className="btn btn_addStock btn-blue"
        >
          Lägg till aktie
        </button>
      </div>
    );
  }
}

export default AddStock;
