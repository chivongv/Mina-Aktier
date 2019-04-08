import React, { Component } from "react";
import { StockConsumer } from "../context";

class AddStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      label: "",
      quantity: "",
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

  handleChange(event) {
    const { name, value } = event.target;
    if (name === "label") {
      const { items } = this.props;
      let suggestions = [];
      const regex = new RegExp(`${value}`, "i");
      suggestions = items.filter(v => regex.test(v));
      this.setState({
        suggestions,
        label: value
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  resetForm() {
    this.setState({
      label: "",
      quantity: "",
      purchasePrice: ""
    });
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    // todo: fix a fixt number of suggestions?
    return (
      <div>
        {suggestions.map(item => (
          <div
            className="list-item"
            key={item}
            onSelect={() => this.suggestionSelected(item)}
            onClick={() => this.suggestionSelected(item)}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="form-container">
        <div className="AutoCompleteText">
          <input
            type="text"
            name="label"
            value={this.state.label}
            placeholder="Aktienamn"
            onChange={this.handleChange}
          />
          {this.renderSuggestions()}
        </div>
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
                className="btn btn_addStock btn-blue"
              >
                Lägg till aktie
              </button>
            );
          }}
        </StockConsumer>
      </div>
    );
  }
}

export default AddStock;
