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
    <AddStock items={items} />
      <div className="content-container">
        <nav className="nav">
          <ul>
            <li>
              <Link to="/login" className="btn btn_link">Logga in</Link>
            </li>
            <li>
              <Link to="/register" className="btn btn_link">Registrera</Link>
            </li>
          </ul>
        </nav>
        <h1>Mina aktier</h1>
        <StockTable />
      </div>
    </div>
  );
}

export default Home;
