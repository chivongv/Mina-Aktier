import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase.js";
import AddStock from "./AddStock";
import StockTable from "./StockTable";
import ToggleMode from "./ToggleMode";

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
            className="btn btn-blue"
          >
            Logga ut
          </button>
        </li>
      );
    } else {
      return (
        <React.Fragment>
          <li>
            <Link to="/login" className="btn btn-blue">
              Logga in
            </Link>
          </li>
          <li>
            <Link to="/register" className="btn btn-green">
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
              className="btn btn-blue"
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
              deleteFromList={this.props.data.deleteFromList}
              loadDataFromLocalStorage={
                this.props.data.loadDataFromLocalStorage
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
