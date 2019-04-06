import React, { Component } from "react";
import { StockConsumer } from "../context";

class StockTable extends Component {
  render() {
    let totalSum = 0;
    let totalYield = 0;
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
              <th></th>
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
                  totalSum += latestPrice*quantity;
                  totalYield += mYield;
                  const status = mYield >= 0 ? 'positive' : 'negative';
                  return (
                    <tr key={quantity}>
                      <td>{label}</td>
                      <td><div className="row_data" col_name="quantity">{quantity}</div></td>
                      <td><div className="row_data" col_name="purchasePrice">{purchasePrice}</div></td>
                      <td>{latestPrice}</td>
                      <td className={status}>{mYieldPercent}%</td>
                      <td className={status}>{mYield} kr</td>
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
          <tfoot>
          <StockConsumer>
          {data => {
            if(data.mStocks.length>0){
              const status = totalYield >= 0 ? "positive" : "negative";
              return (<tr><td>Totalt alla aktier: </td>
              <td colSpan="2"></td>
              <td>{totalSum} kr</td>
              <td></td>
              <td className={status}>{totalYield} kr</td><td></td></tr>)
            }
          }
          }
          </StockConsumer>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default StockTable;
