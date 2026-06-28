// Import
import "./Home.css";
import { Link } from "react-router-dom";

// Code
const Inicio = () => {
  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="home-hero__eyebrow">Panel principal</p>
        <h2>Bienvenida a MAB Estética</h2>
        <p className="home-hero__description">
          Un espacio para centralizar pacientes, seguimiento clínico y la base
          de tu futura agenda diaria.
        </p>
      </div>

      <div className="home-grid">
        <Link to="/fichas" className="home-card">
          <span className="home-card__title">Fichas</span>
        </Link>

        <Link to="/turnos" className="home-card home-card--muted">
          <span className="home-card__title">Turnos</span>
        </Link>

        <Link to="/catalogo" className="home-card home-card--muted">
          <span className="home-card__title">Catálogo</span>
        </Link>

        <Link to="/configuracion" className="home-card home-card--muted">
          <span className="home-card__title">Configuración</span>
        </Link>
      </div>
    </section>
  );
};

// Export
export default Inicio;
