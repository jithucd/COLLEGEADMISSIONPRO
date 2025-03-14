import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Role constants to ensure consistency
export const ROLES = {
  ADMIN: 'admin',
  COLLEGE_ADMIN: 'college_admin',
  STUDENT: 'student'
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(() => {
    const role = localStorage.getItem("userRole");
    return Object.values(ROLES).includes(role) ? role : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      setIsLoggedIn(!!token);
      setUserRole(Object.values(ROLES).includes(role) ? role : null);

      console.log("Token in storage:", token);
      console.log("Role in storage:", role);
      console.log("Updated isLoggedIn:", !!token);
      console.log("Updated userRole:", role);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token, role) => {
    if (Object.values(ROLES).includes(role)) {
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      console.log("Login Response Data:", token, role);
      setIsLoggedIn(true);
      setUserRole(role);
      window.dispatchEvent(new Event("authChange"));
    } else {
      console.error("Invalid user role:", role); // Debugging
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
