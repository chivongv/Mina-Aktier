import React from "react";
import { Link } from "react-router-dom";
import AddStock from "./AddStock";
import StockTable from "./StockTable";

function Home() {
  const items = [
    {
      label: "Investor A"
    },
    {
      label: "Investor B"
    }
  ];

  return (
    <div className="container">
      <div className="right">
        <AddStock items={items} />
        <button className="btn btn-blue">Uppdatera tabellen</button>
      </div>
      <div className="left">
        <div className="content-container">
          <nav className="nav">
            <ul>
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
