import React, { Component } from "react";

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

  componendividMount() {
    this.props.loadDataFromLocalStorage();
  }

  calcYield = (lastPrice = 0, purchasePrice = 0, quantity = 0) => {
    return lastPrice > 0
      ? Math.round((lastPrice - purchasePrice) * quantity)
      : 0;
  };

  calcYieldPercent = (mYield, total) => {
    return mYield !== 0 ? parseFloat((mYield * 100) / total).toFixed(2) : 0;
  };

  setTextStatus = mYield => {
    return mYield >= 0 ? "td positive" : "td negative";
  };

  handleEditing = () => {};

  generateTableHeaders = () => {
    return (
      <div className="thead">
        <div className="tr">
          <div className="th">Aktie</div>
          <div className="th">Antal</div>
          <div className="th">Inköpspris</div>
          <div className="th">Senast</div>
          <div className="th">Avkastning %</div>
          <div className="th">Avkastning</div>
          <div className="th options" />
        </div>
      </div>
    );
  };

  generateTableFooter = (totalYield, totalSum) => {
    if (this.props.mStocks.length > 0) {
      const textStatus = this.setTextStatus(totalYield);
      const totalYieldPercent = this.calcYieldPercent(totalYield, totalSum);
      return (
        <div className="tfoot">
          <div className="tr">
            <div className="td">Totalt alla aktier</div>
            <div className="td" />
            <div className="td" />
            <div className={textStatus} data-title="Marknadsvärde">
              {Math.round(totalSum)} kr
            </div>
            <div className={textStatus} data-title="Totalavkastning [%]">
              {totalYieldPercent}%
            </div>
            <div className={textStatus} data-title="Totalavkastning">
              {Math.round(totalYield)} kr
            </div>
            <div className="td options" />
          </div>
        </div>
      );
    } else {
      return <React.Fragment />;
    }
  };

  handleClick = index => {
    console.log(index);
  };

  generateTableData() {
    let { totalSum, totalYield } = this.state;
    let { mStocks } = this.props;
    return (
      <React.Fragment>
        <div className="tbody">
          {mStocks.map((item, index) => {
            const { name, quantity, purchasePrice, lastPrice } = item;
            const mYield = this.calcYield(lastPrice, purchasePrice, quantity);
            const mYieldPercent = this.calcYieldPercent(
              mYield,
              purchasePrice * quantity
            );
            totalSum += lastPrice * quantity;
            totalYield += mYield;
            const textStatus = this.setTextStatus(mYield);
            return (
              <div key={index} className="tr">
                <div className="td">{name}</div>
                <div className="td" col_name="quantity">
                  {quantity}
                </div>
                <div className="td" col_name="purchasePrice">
                  {purchasePrice} kr
                </div>
                <div className="td">{lastPrice} kr</div>
                <div className={textStatus}>{mYieldPercent}%</div>
                <div className={textStatus}>{mYield} kr</div>
                <div className="td options">
                  <button
                    className="btn btn_edit btn-blue"
                    onClick={() => this.handleClick(index)}
                  >
                    Redigera
                  </button>
                  <button
                    className="btn btn_delete btn-red"
                    onClick={() => this.props.deleteFromList(index)}
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            );
          })}
          {this.generateTableFooter(totalYield, totalSum)}
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="table">
        <div className="table-container">
          {this.generateTableHeaders()}
          {this.generateTableData()}
        </div>
      </div>
    );
  }
}

export default StockTable;
