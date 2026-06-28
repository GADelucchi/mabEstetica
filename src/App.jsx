// Imports
import { useEffect, useRef, useState } from "react";
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
import Appointments from "./components/Appointments/Appointments";
import Settings from "./components/Settings/Settings";

// Code
function App() {
  const appShellRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                  <Appointments />
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
            <Route
              path="/configuracion"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        <Footer />

        {showScrollTop && (
          <button
            type="button"
            className="scroll-top-button"
            onClick={scrollToTop}
            aria-label="Volver arriba"
            title="Volver arriba"
          >
            ^
          </button>
        )}
      </div>
    </BrowserRouter>
  );
}

// Export
export default App;
