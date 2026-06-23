// Imports
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Code
const PrivateRoute = ({ children }) => {
  const { loguedIn } = useAuth();
  return loguedIn ? children : <Navigate to="/" replace />;
};

// Export
export default PrivateRoute;
