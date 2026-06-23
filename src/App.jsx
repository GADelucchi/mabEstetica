// Imports
import { useEffect, useRef } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Records from "./components/Records/Records";
import PlaceholderPage from "./components/PlaceholderPage/PlaceholderPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ResetPassword from "./components/ResetPassword/ResetPassword";

// Code
function App() {
  const appShellRef = useRef(null);

  useEffect(() => {
    const appShell = appShellRef.current;
    if (!appShell) return;

    const header = appShell.querySelector(".header");
    if (!header) return;

    const updateHeaderOffset = () => {
      appShell.style.setProperty("--header-offset", `${header.offsetHeight}px`);
    };

    updateHeaderOffset();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderOffset();
    });

    resizeObserver.observe(header);
    window.addEventListener("resize", updateHeaderOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderOffset);
    };
  }, []);

  return (
    <BrowserRouter>
      <div ref={appShellRef} className="app-shell">
        <Header />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/fichas" element={<PrivateRoute><Records /></PrivateRoute>} />
            <Route
              path="/turnos"
              element={
                <PrivateRoute>
                  <PlaceholderPage
                    title="Turnos"
                    description="Esta sección va a centralizar la agenda, disponibilidad y seguimiento de citas."
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/catalogo"
              element={
                <PrivateRoute>
                  <PlaceholderPage
                    title="Catálogo"
                    description="Acá vas a poder organizar servicios, tratamientos y productos sin salir del sistema."
                  />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Export
export default App;
