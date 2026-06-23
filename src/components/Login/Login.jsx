import { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button/Button";
import { API_BASE_URL } from "../../config/apiConfig";

const Login = () => {
  const navigate = useNavigate();
  const { setLogedIn } = useAuth();

  const [authMode, setAuthMode] = useState("login"); // "login" | "register" | "forgot"
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [authMode]);

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
    setLogedIn(true, data.payload);
    navigate("/home");
  };

  const register = async () => {
    if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden.");
    if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");

    const response = await fetch(`${API_BASE_URL}/session/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nombre, apellido, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "No se pudo registrar el usuario.");
    setSuccess("Cuenta creada correctamente. Ingresando...");
    setLogedIn(true, data.payload);
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
      else if (authMode === "register") await register();
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
            {authMode === "login" ? "Acceso" : authMode === "register" ? "Registro" : "Recuperar acceso"}
          </p>
          <h2>
            {authMode === "login" ? "Ingresá al sistema" : authMode === "register" ? "Creá tu cuenta" : "Olvidé mi contraseña"}
          </h2>
          <p className="login-card__text">
            {authMode === "login"
              ? "Iniciá sesión con tu usuario para acceder al panel."
              : authMode === "register"
              ? "Completá tus datos para autoregistrarte y entrar al sistema."
              : "Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña."}
          </p>
        </div>

        <form className="login-form" onSubmit={manejarSubmit}>
          {authMode === "register" && (
            <>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Ingrese su nombre"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">
                  Apellido
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  placeholder="Ingrese su apellido"
                  value={apellido}
                  onChange={(e) => {
                    setApellido(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </>
          )}

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
                  : authMode === "register"
                  ? "Crear cuenta"
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
              <button
                type="button"
                className="login-link login-link--button"
                onClick={() => switchMode(authMode === "register" ? "login" : "register")}
              >
                {authMode === "register" ? "Ingresar" : authMode === "forgot" ? "Registrarme" : "Registrarme"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
