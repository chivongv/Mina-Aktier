import React, { Component } from "react";
import { Link } from "react-router-dom";
import { StockConsumer } from "../context";
import firebase from "../firebase.js";
import AddStock from "./AddStock";
import StockTable from "./StockTable";

class Home extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="container content">
        <div className="right">
          <StockConsumer>
            {data => {
              return (
                <React.Fragment>
                  <AddStock addToList={data.addToList} />
                  <button
                    className="btn btn-blue"
                    onClick={() => data.updateAllStocks()}
                  >
                    Uppdatera tabellen
                  </button>
                </React.Fragment>
              );
            }}
          </StockConsumer>
        </div>
        <div className="left">
          <div className="content-container">
            <nav className="nav">
              <ul>
                <StockConsumer>
                  {data => {
                    const user = firebase.auth().currentUser;
                    if (user) {
                      return (
                        <li>
                          <button type="button" onClick={() => data.sendLogout()} className="btn btn-blue">
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
                  }}
                </StockConsumer>
              </ul>
            </nav>
            <h1>Mina aktier</h1>
            <StockConsumer>
              {data => {
                return (
                  <StockTable
                    mStocks={data.mStocks}
                    deleteFromList={data.deleteFromList}
                    loadDataFromLocalStorage={data.loadDataFromLocalStorage}
                  />
                );
              }}
            </StockConsumer>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
