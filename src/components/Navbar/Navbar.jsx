// Imports
import React from "react";
import { NavLink } from "react-router-dom";

// Code
const Navbar = () => {
  return (
    <div className="container justify-content-center">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/home" className="nav-link">
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/fichas" className="nav-link">
                  Fichas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/turnos"
                  className="nav-link disabled"
                  aria-disabled="true"
                >
                  Turnos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/catalogo"
                  className="nav-link disabled"
                  aria-disabled="true"
                >
                  Catálogo
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

// Export
export default Navbar;
