// Imports
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

const sectionNavItems = [
  { to: "/fichas", label: "Fichas" },
  { to: "/turnos", label: "Turnos" },
  { to: "/catalogo", label: "Catálogo" },
];

// Code
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loguedIn, user, logout } = useAuth();
  const showSectionNav = location.pathname !== "/" && location.pathname !== "/home";

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="header">
      <div className="header__content">
        <div>
          <p className="header__eyebrow">Agenda y fichas clínicas</p>
          <h1>MAB Estética</h1>
        </div>

        {loguedIn && (
          <div className="header__session">
            <p className="header__session-user">
              {user?.nombre ? `${user.nombre} ${user.apellido || ""}`.trim() : "Sesión iniciada"}
            </p>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
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
