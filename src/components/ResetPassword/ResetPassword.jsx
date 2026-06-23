import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import "../Login/Login.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessageType("danger");
      setMessage("Token inválido. Solicitá un nuevo enlace de recuperación.");
      return;
    }

    if (password.length < 6) {
      setMessageType("danger");
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setMessageType("danger");
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/session/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo restablecer la contraseña.");
      }

      setMessageType("success");
      setMessage("Contraseña actualizada. Redirigiendo al inicio...");
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setMessageType("danger");
      setMessage(err.message || "Error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <p className="login-card__eyebrow">Seguridad</p>
          <h2>Nueva contraseña</h2>
          <p className="login-card__text">Ingresá tu nueva contraseña para recuperar el acceso.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="rp-password" className="form-label">Nueva contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="rp-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

          <div className="mb-3">
            <label htmlFor="rp-confirm" className="form-label">Confirmar contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="rp-confirm"
              placeholder="Repetí la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {message && (
            <div className={`alert alert-${messageType} text-center`} role="alert">
              {message}
            </div>
          )}

          <div className="login-actions">
            <button
              type="submit"
              className="btn btn-meli login-actions__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Restablecer contraseña"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
