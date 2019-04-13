import React, { Component } from "react";
import { StockConsumer } from "../context";

class StockTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSum: 0,
      totalYield: 0
    };
    this.generateTableHeaders = this.generateTableHeaders.bind(this);
    this.generateTableData = this.generateTableData.bind(this);
  }

  calcYield(lastPrice, purchasePrice, quantity) {
    return lastPrice > 0
      ? Math.round((lastPrice - purchasePrice) * quantity)
      : 0;
  }

  calcYieldPercent(mYield, total) {
    return mYield !== 0 ? parseFloat((mYield * 100) / total).toFixed(2) : 0;
  }

  setTextStatus(mYield) {
    return mYield >= 0 ? "positive" : "negative";
  }

  handleEditing = () => {};

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

  handleClick(index) {
    console.log(index);
  }

  generateTableData() {
    let { totalSum, totalYield } = this.state;
    return (
      <React.Fragment>
        <tbody>
          <StockConsumer>
            {data => {
              return data.mStocks.map((item, index) => {
                const { name, quantity, purchasePrice, lastPrice } = item;
                const mYield = this.calcYield(
                  lastPrice,
                  purchasePrice,
                  quantity
                );
                const mYieldPercent = this.calcYieldPercent(
                  mYield,
                  purchasePrice * quantity
                );
                totalSum += lastPrice * quantity;
                totalYield += mYield;
                const textStatus = this.setTextStatus(mYield);
                return (
                  <tr key={index}>
                    <td>{name}</td>
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
                    <td>{lastPrice}</td>
                    <td className={textStatus}>{mYieldPercent}%</td>
                    <td className={textStatus}>{mYield} kr</td>
                    <td>
                      <StockConsumer>
                        {data => {
                          return (
                            <div className="options">
                              <span className="btn_edit">
                                <button
                                  className="btn btn-blue"
                                  onClick={this.handleEditing}
                                >
                                  Redigera
                                </button>
                              </span>
                              <button
                                className="btn btn_delete btn-red"
                                onClick={() => data.deleteFromList(index)}
                              >
                                Ta bort
                              </button>
                            </div>
                          );
                        }}
                      </StockConsumer>
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
                const textStatus = this.setTextStatus(totalYield);
                const totalYieldPercent = this.calcYieldPercent(
                  totalYield,
                  totalSum
                );
                return (
                  <tr>
                    <td>Totalt alla aktier: </td>
                    <td colSpan="2" />
                    <td>{Math.round(totalSum)} kr</td>
                    <td className={textStatus}>{totalYieldPercent}%</td>
                    <td className={textStatus}>{Math.round(totalYield)} kr</td>
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
