import React, { Component } from "react";
import { Link } from "react-router-dom";
import AddStock from "./AddStock";
import StockTable from "./StockTable";
import { StockConsumer } from "../context";

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
                    const user = data.user;
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
            <StockConsumer>
              {data => {
                return <StockTable mStocks={data.mStocks} />;
              }}
            </StockConsumer>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
