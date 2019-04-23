import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase.js";
import AddStock from "./AddStock";
import StockTable from "./StockTable";
import ToggleMode from "./ToggleMode";
import BuyModal from "./modals/BuyModal";
import SellModal from "./modals/SellModal";
import InfoModal from "./modals/InfoModal";

class Home extends Component {
  componentDidMount() {
    this.props.data.loadDataFromLocalStorage();
  }

  renderUserButtons = () => {
    const user = firebase.auth().currentUser;
    if (user != null || this.props.data.isUserLoggedIn) {
      return (
        <li>
          <button
            type="button"
            onClick={() => this.props.data.sendLogout()}
            className="btn btn_logout"
          >
            Logga ut
          </button>
        </li>
      );
    } else {
      return (
        <React.Fragment>
          <li>
            <Link to="/login" className="btn btn_login">
              Logga in
            </Link>
          </li>
          <li>
            <Link to="/register" className="btn btn_register">
              Registrera
            </Link>
          </li>
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <div className="container content">
        <nav className="nav">
          <ul>{this.renderUserButtons()}</ul>
          <ToggleMode
            loadDataFromLocalStorage={this.props.data.loadDataFromLocalStorage}
            checked={this.props.data.checked}
            toggleUIMode={this.props.data.toggleUIMode}
          />
        </nav>
        <div className="right">
          <React.Fragment>
            <AddStock addToStockList={this.props.data.addToStockList} />
            <button
              className="btn btn_fetch"
              onClick={() => this.props.data.updateAllStocks()}
            >
              Hämta aktiekurser
            </button>
          </React.Fragment>
        </div>
        <div className="left">
          <div className="content-container">
            <h1>Mina aktier</h1>
            <StockTable
              mStocks={this.props.data.mStocks}
              setModalStock={this.props.data.setModalStock}
              toggleBuyModal={this.props.data.toggleBuyModal}
              toggleSellModal={this.props.data.toggleSellModal}
              deleteFromList={this.props.data.deleteFromList}
              loadDataFromLocalStorage={
                this.props.data.loadDataFromLocalStorage
              }
            />
          </div>
          <button className="btn btn_info" onClick={() => this.props.data.toggleInfoModal()}>?</button>
        </div>
        {this.props.data.showBuyModal ? (
          <BuyModal
            buyStock={this.props.data.buyStock}
            showBuyModal={this.props.data.showBuyModal}
            modalStock={this.props.data.modalStock}
            toggleBuyModal={this.props.data.toggleBuyModal}
          />
        ) : null}
        {this.props.data.showSellModal ? (
          <SellModal
            sellStock={this.props.data.sellStock}
            showSellModal={this.props.data.showSellModal}
            modalStock={this.props.data.modalStock}
            toggleSellModal={this.props.data.toggleSellModal}
          />
        ) : null}
        {this.props.data.showInfoModal ? <InfoModal toggleInfoModal={this.props.data.toggleInfoModal} /> : null}
      </div>
    );
  }
}

export default Home;
