import { useState } from "react";
import Button from "../Button/Button";
import { API_BASE_URL } from "../../config/apiConfig";
import "./Settings.css";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (newPassword.length < 6) {
      setMessageType("danger");
      setMessage("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("danger");
      setMessage("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/session/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo actualizar la contraseña.");
      }

      setMessageType("success");
      setMessage("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessageType("danger");
      setMessage(error.message || "No se pudo actualizar la contraseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="settings-page">
      <div className="settings-page__hero">
        <p className="settings-page__eyebrow">Configuración</p>
        <h2>Seguridad de acceso</h2>
        <p>Actualizá tu contraseña para mantener protegida la cuenta.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">Contraseña actual</label>
          <input
            id="currentPassword"
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
          <input
            id="newPassword"
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {message && (
          <div className={`alert alert-${messageType}`} role="alert">
            {message}
          </div>
        )}

        <Button
          text={isSubmitting ? "Guardando..." : "Actualizar contraseña"}
          type="submit"
          className="btn btn-meli"
          disabled={isSubmitting}
        />
      </form>
    </section>
  );
};

export default Settings;