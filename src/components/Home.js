import React from "react";
import { Link } from "react-router-dom";
import AddStock from "./AddStock";
import StockTable from "./StockTable";

function Home() {
  return (
    <div>
      <div className="content-container">
        <nav class="nav">
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <h1>Mina aktier</h1>
        <AddStock />
        <StockTable />
      </div>
    </div>
  );
}

export default Home;
