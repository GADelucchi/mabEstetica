// Imports
import "./Header.css";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const sectionNavItems = [
  { to: "/fichas", label: "Fichas" },
  { to: "/turnos", label: "Turnos" },
  { to: "/catalogo", label: "Catálogo" },
];

// Code
const Header = () => {
  const location = useLocation();
  const showSectionNav = location.pathname !== "/" && location.pathname !== "/home";

  return (
    <header className="header">
      <div className="header__content">
        <div>
          <p className="header__eyebrow">Agenda y fichas clínicas</p>
          <h1>MAB Estética</h1>
        </div>
      </div>

      {showSectionNav && (
        <div className="header__subnav">
          <Navbar items={sectionNavItems} className="header__subnav-nav" />
        </div>
      )}
    </header>
  );
};

// Export
export default Header;
