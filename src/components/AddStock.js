import React, { Component } from "react";
import AutoComplete from "./AutoComplete";

class AddStock extends Component {
  render() {
    return (
      <div className="form-container">
        <AutoComplete placeholder="Aktienamn" items={[]} />
        <input type="text" placeholder="Antal" />
        <input type="text" placeholder="Inköpspris" />
        <a href="#" className="btn btn-addStock">Add Stock</a>
      </div>
    );
  }
}

export default AddStock;
