import React, { Component } from "react";

class StockItem extends Component {

  setTextStatus = mYield => {
    return mYield >= 0 ? "td positive" : "td negative";
  };

  render() {
    const { name, quantity, purchasePrice, currency, lastPrice } = this.props.item;
    const { index, mYield, mYieldPercent} = this.props;
    const textStatus = this.setTextStatus(mYield);
    return (
      <div className="tr">
        <div className="td">{name}</div>
        <div className="td" col_name="quantity">
          {quantity}
        </div>
        <div className="td" col_name="purchasePrice">
          {purchasePrice} { currency }
        </div>
        <div className="td">{lastPrice} { currency }</div>
        <div className={textStatus}>{mYieldPercent}%</div>
        <div className={textStatus}>{mYield} { currency }</div>
        <div className="td options">
          <button
            className="btn btn_buy"
            onClick={() => this.props.handleOpenBuyModal(index)}
          >
            Köp
          </button>
          <button
            className="btn btn_delete"
            onClick={() => this.props.handleOpenSellModal(index)}
          >
            Sälj
          </button>
        </div>
      </div>
    );
  }
}

export default StockItem;
