import { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button/Button";
import { API_BASE_URL } from "../../config/apiConfig";

const Login = () => {
  const navigate = useNavigate();
  const { setLogedIn } = useAuth();

  const [authMode, setAuthMode] = useState("login"); // "login" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [authMode]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const login = async () => {
    const response = await fetch(`${API_BASE_URL}/session/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "No se pudo iniciar sesión.");
    setLogedIn(true, data.payload, data.token || null);
    navigate("/home");
  };

  const forgotPassword = async () => {
    const response = await fetch(`${API_BASE_URL}/session/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "No se pudo procesar la solicitud.");
    setSuccess(data.message);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      if (authMode === "login") await login();
      else await forgotPassword();
    } catch (submitError) {
      setError(submitError.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setAuthMode(nextMode);
    resetForm();
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <p className="login-card__eyebrow">
            {authMode === "login" ? "Acceso" : "Recuperar acceso"}
          </p>
          <h2>
            {authMode === "login" ? "Ingresá al sistema" : "Olvidé mi contraseña"}
          </h2>
          <p className="login-card__text">
            {authMode === "login"
              ? "Iniciá sesión con tu usuario para acceder al panel."
              : "Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña."}
          </p>
        </div>

        <form className="login-form" onSubmit={manejarSubmit}>
          <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            autoComplete="email"
            required
          />
          </div>

          {authMode !== "forgot" && (
            <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary login-form__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            </div>
          )}

          {authMode === "register" && (
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                placeholder="Repita su contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                required
              />
            </div>
          )}

          {success && (
            <div className="alert alert-success text-center" role="alert">
              {success}
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          <div className="login-actions">
            <Button
              text={
                isSubmitting
                  ? "Procesando..."
                  : authMode === "login"
                  ? "Ingresar"
                  : "Enviar enlace"
              }
              type="submit"
              className="btn btn-meli login-actions__submit"
              disabled={isSubmitting}
            />

            <div className="login-links">
              {authMode === "login" && (
                <button
                  type="button"
                  className="login-link login-link--button"
                  onClick={() => switchMode("forgot")}
                >
                  Olvidé mi contraseña
                </button>
              )}
              {authMode === "forgot" && (
                <button
                  type="button"
                  className="login-link login-link--button"
                  onClick={() => switchMode("login")}
                >
                  Volver al inicio
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
