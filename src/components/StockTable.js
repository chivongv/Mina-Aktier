import React, { Component } from "react";
import { StockConsumer } from "../context";

class StockTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: true
    };
    this.handleEditing = this.handleEditing.bind(this);
    this.generateTableHeaders = this.generateTableHeaders.bind(this);
    this.generateTableData = this.generateTableData.bind(this);
  }

  handleEditing() {
    console.log("clicked");
  }

  generateTableHeaders() {
    return (
      <thead>
        <tr>
          <th>Aktie</th>
          <th>Antal</th>
          <th>Inköpspris [kr]</th>
          <th>Senast [kr]</th>
          <th>Avkastning [%]</th>
          <th>Avkastning [kr]</th>
          <th />
        </tr>
      </thead>
    );
  }

  generateTableData() {
    let totalSum = 0;
    let totalYield = 0;
    return (
      <React.Fragment>
        <tbody>
          <StockConsumer>
            {data => {
              return data.mStocks.map(item => {
                const { label, quantity, purchasePrice, latestPrice } = item;
                const mYield =
                  latestPrice > 0
                    ? (latestPrice - purchasePrice) * quantity
                    : 0;
                const mYieldPercent =
                  mYield !== 0
                    ? parseFloat(
                        (mYield * 100) / (purchasePrice * quantity)
                      ).toFixed(2)
                    : 0;
                totalSum += latestPrice * quantity;
                totalYield += mYield;
                const status = mYield >= 0 ? "positive" : "negative";
                return (
                  <tr key={quantity}>
                    <td>{label}</td>
                    <td>
                      <div className="row_data" col_name="quantity">
                        {quantity}
                      </div>
                    </td>
                    <td>
                      <div className="row_data" col_name="purchasePrice">
                        {purchasePrice}
                      </div>
                    </td>
                    <td>{latestPrice}</td>
                    <td className={status}>{mYieldPercent}%</td>
                    <td className={status}>{mYield} kr</td>
                    <td>
                      <span className="btn_edit">
                        <button
                          className="btn btn-blue"
                          onClick={this.handleEditing}
                        >
                          Edit
                        </button>
                      </span>
                      <button className="btn btn_save btn-green">Save</button>
                      <button className="btn btn_cancel btn-yellow">
                        Cancel
                      </button>
                      <button className="btn btn_delete btn-red">Delete</button>
                    </td>
                  </tr>
                );
              });
            }}
          </StockConsumer>
        </tbody>
        <tfoot>
          <StockConsumer>
            {data => {
              if (data.mStocks.length > 0) {
                const status = totalYield >= 0 ? "positive" : "negative";
                return (
                  <tr>
                    <td>Totalt alla aktier: </td>
                    <td colSpan="2" />
                    <td>{totalSum} kr</td>
                    <td />
                    <td className={status}>{totalYield} kr</td>
                    <td />
                  </tr>
                );
              }
            }}
          </StockConsumer>
        </tfoot>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="table-container">
        <table className="table">
          {this.generateTableHeaders()}
          {this.generateTableData()}
        </table>
      </div>
    );
  }
}

export default StockTable;
