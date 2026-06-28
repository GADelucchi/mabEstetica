// Imports
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const defaultItems = [
  { to: "/home", label: "Inicio" },
  { to: "/fichas", label: "Fichas" },
  { to: "/turnos", label: "Turnos" },
  { to: "/catalogo", label: "Catálogo" },
];

// Code
const Navbar = ({ items = defaultItems, className = "", onItemClick }) => {
  return (
    <nav className={`navbar navbar-expand-lg navbar-mab ${className}`.trim()}>
      <div className="container-fluid px-0">
        <div className="navbar-nav mab-nav-list">
          {items.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onItemClick}
              className={({ isActive }) =>
                `nav-link mab-nav-link${isActive ? " active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Export
export default Navbar;
