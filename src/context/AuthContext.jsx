// Imports
import { createContext, useState, useContext } from "react";

// Exports
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loguedIn, setLogedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ loguedIn, setLogedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);