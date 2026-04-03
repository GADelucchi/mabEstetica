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

  useEffect(() => {
    fetch("/usuarios.json")
      .then((response) => response.json())
      .then((usuarios) => setUsers(usuarios))
      .catch((err) => console.error("Error cargando usuarios:", err));
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
      setClearPassword(true); // activa el borrado en el siguiente focus
    }
  };

  const handlePasswordFocus = () => {
    if (clearPassword) {
      setPassword(""); // borra el input
      setClearPassword(false); // evita que siga borrando después
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form className="p-4 border rounded shadow-sm" onSubmit={manejarSubmit}>
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
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <Button text="Ingresar" />
          <a href="#" className="text-decoration-none">
            Olvidé mi contraseña
          </a>
          <a href="#" className="text-decoration-none">
            Registrarme
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
