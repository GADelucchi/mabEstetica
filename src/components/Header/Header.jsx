// Imports
import React from "react";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../Navbar/Navbar";

// Code
const Header = () => {
  const { loguedIn } = useAuth();

  return (
    <header className="header">
      <h1>MAB Estética</h1>

      {loguedIn && <Navbar />}
    </header>
  );
};

// Export
export default Header;
