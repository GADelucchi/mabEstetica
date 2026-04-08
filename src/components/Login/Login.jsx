import { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button/Button";

const Login = () => {
  const navigate = useNavigate();
  const { setLogedIn } = useAuth();

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [clearPassword, setClearPassword] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/usuarios.json")
      .then((response) => response.json())
      .then((usuarios) => {
        setUsers(usuarios);
        setUsersLoaded(true);
      })
      .catch(() => {
        setFetchError("No se pudieron cargar los usuarios de prueba.");
        setUsersLoaded(true);
      });
  }, []);

  const manejarSubmit = (e) => {
    e.preventDefault();

    const usuarioValido = users.find(
      (user) => user.email === email && user.password === password
    );

    if (usuarioValido) {
      setLogedIn(true);
      navigate("/home");
    } else {
      setError("Correo o contraseña incorrectos.");
      setClearPassword(true);
    }
  };

  const handlePasswordFocus = () => {
    if (clearPassword) {
      setPassword("");
      setClearPassword(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <p className="login-card__eyebrow">Acceso</p>
          <h2>Ingresá al sistema</h2>
          <p className="login-card__text">
            Usá este acceso de prueba para navegar la interfaz actual.
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
              onFocus={handlePasswordFocus}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
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

          {fetchError && (
            <div className="alert alert-warning text-center" role="alert">
              {fetchError}
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          <div className="login-actions">
            <Button
              text={usersLoaded ? "Ingresar" : "Cargando..."}
              type="submit"
              className="btn btn-meli login-actions__submit"
              disabled={!usersLoaded}
            />

            <div className="login-links">
              <span className="login-link login-link--disabled">
                Olvidé mi contraseña
              </span>
              <span className="login-link login-link--disabled">
                Registrarme
              </span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
