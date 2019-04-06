import React, { Component } from "react";
import { StockConsumer } from "../context";

class StockTable extends Component {
  render() {
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Aktie</th>
              <th>Antal</th>
              <th>Inköpspris [kr]</th>
              <th>Senast [kr]</th>
              <th>Avkastning [%]</th>
              <th>Avkastning [kr]</th>
              <th>Val</th>
            </tr>
          </thead>
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
                  return (
                    <tr key={quantity}>
                      <td>{label}</td>
                      <td>{quantity}</td>
                      <td>{purchasePrice}</td>
                      <td>{latestPrice}</td>
                      <td>{mYieldPercent}%</td>
                      <td>{mYield} kr</td>
                      <td>
                        <span className="btn btn_edit">
                          <a href="/" className="btn_link">
                            {" "}
                            Edit
                          </a>
                        </span>
                        <a href="/" className="btn btn_save btn_link">
                          {" "}
                          Save
                        </a>
                        <a href="/" className="btn btn_cancel btn_link">
                          {" "}
                          Cancel
                        </a>
                        <a href="/" className="btn btn_delete btn_link">
                          {" "}
                          Delete
                        </a>
                      </td>
                    </tr>
                  );
                });
              }}
            </StockConsumer>
          </tbody>
        </table>
      </div>
    );
  }
}

export default StockTable;
