import React from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase.js";
import AddStock from "./AddStock";
import StockTable from "./StockTable";
import { StockConsumer } from "../context";
import { stockNames } from "../data";

function Home() {
  return (
    <div className="container">
      <div className="right">
        <AddStock items={stockNames} />
        <StockConsumer>
          {data => {
            return (
              <button
                className="btn btn-blue"
                onClick={() => data.updateStocks()}
              >
                Uppdatera tabellen
              </button>
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
                  const user = firebase.auth().currentUser; // returns null if orbs not initialized
                  if (!user) {
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
                  } else {
                    return (
                      <li>
                        <Link to="/logout" className="btn btn-blue">
                          Logga ut
                        </Link>
                      </li>
                    );
                  }
                }}
              </StockConsumer>
            </ul>
          </nav>
          <h1>Mina aktier</h1>
          <StockTable />
        </div>
      </div>
    </div>
  );
}

export default Home;
