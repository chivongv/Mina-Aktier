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
    <div>
      <div className="content-container">
        <nav className="nav">
          <ul>
            <li>
              <Link to="/login">Logga in</Link>
            </li>
            <li>
              <Link to="/register">Registrera</Link>
            </li>
          </ul>
        </nav>
        <h1>Mina aktier</h1>
        <AddStock items={items} />
        <StockTable />
      </div>
    </div>
  );
}

export default Home;
