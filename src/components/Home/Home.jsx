// Import
import React from "react";
import "./Home.css";
import { Link, NavLink } from "react-router-dom";

// Code
const Inicio = () => {
  return (
    <>
      <div className="d-flex flex-column divHome">
        <h1 className="text-center">Bienvenido a MAB Estética</h1>
        <p>Tu lugar para el cuidado y bienestar estético.</p>
      </div>
    </>
  );
};

// Export
export default Inicio;
