// Imports
import { useEffect, useState } from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

const sectionNavItems = [
  { to: "/fichas", label: "Fichas" },
  { to: "/turnos", label: "Turnos" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/configuracion", label: "Configuración" },
];

// Code
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loguedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const showSectionNav = location.pathname !== "/" && location.pathname !== "/home";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__brand">
          <h1>MAB Estética Integral</h1>
        </div>

        {loguedIn && (
          <button
            type="button"
            className="header__menu-button"
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </div>

      {showSectionNav && (
        <div className={`header__drawer${isMenuOpen ? " header__drawer--open" : ""}`}>
          <button
            type="button"
            className="header__drawer-backdrop"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="header__drawer-panel">
            <div className="header__drawer-header">
              <p className="header__drawer-title">MAB Estética Integral</p>
              <button
                type="button"
                className="header__drawer-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                ×
              </button>
            </div>

            <Navbar
              items={sectionNavItems}
              className="header__drawer-nav"
              onItemClick={() => setIsMenuOpen(false)}
            />

            {loguedIn && (
              <div className="header__drawer-footer">
                <button
                  type="button"
                  className="btn btn-outline-dark w-100"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Export
export default Header;
