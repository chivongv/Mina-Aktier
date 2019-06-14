import React, { Component } from "react";
import StockItem from "./StockItem";

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
              {Math.round(totalSum)}
            </div>
            <div className={textStatus} data-title="Totalavkastning [%]">
              {totalYieldPercent}%
            </div>
            <div className={textStatus} data-title="Totalavkastning">
              {Math.round(totalYield)}
            </div>
            <div className="td options" />
          </div>
        </div>
      );
    } else {
      return <React.Fragment />;
    }
  };

  handleOpenBuyModal = async (id) => {
    const stock = this.props.mStocks[id];
    await this.props.setModalStock(stock);
    this.props.toggleBuyModal();
  }

  handleOpenSellModal = async (id) => {
    const stock = this.props.mStocks[id];
    await this.props.setModalStock(stock);
    this.props.toggleSellModal();
  }

  generateTableData() {
    let { totalSum, totalYield } = this.state;
    let { mStocks } = this.props;
    return (
      <React.Fragment>
        <div className="tbody">
          {mStocks.map((item, index) => {
            const { quantity, purchasePrice, lastPrice } = item;
            const mYield = this.calcYield(lastPrice, purchasePrice, quantity);
            const mYieldPercent = this.calcYieldPercent(
              mYield,
              purchasePrice * quantity
            );
            totalSum += lastPrice * quantity;
            totalYield += mYield;
            return <StockItem key={index} index={index} item={item}
            mYield={mYield} mYieldPercent={mYieldPercent}
            handleOpenBuyModal={this.handleOpenBuyModal}
            handleOpenSellModal={this.handleOpenSellModal} />
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
