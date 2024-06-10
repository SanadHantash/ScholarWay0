import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("authToken"));
  const [isRegistered, setIsRegistered] = useState(!!Cookies.get("authToken"));
  const [headers, setHeaders] = useState([]);

  const login = (Token) => {
    setIsLoggedIn(true);
    setHeaders({ token: Token });
  };

  const register = (Token) => {
    setIsRegistered(true);
    setHeaders({ token: Token });
  };

  const logout = () => {
    Cookies.remove("Token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("Token"));
    setIsRegistered(!!Cookies.get("Token"));
  }, [isLoggedIn, isRegistered]);

  return (
    <AuthContext.Provider
      value={{ isRegistered, isLoggedIn, login, register, logout, headers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
