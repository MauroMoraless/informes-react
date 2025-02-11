import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (idtecnico, pass) => {
    try {
      const response = await api.post("/auth/login", { idtecnico, pass });
      console.log("Respuesta del servidor:", response.data); // 🔍 Verifica la respuesta
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.tecnico));
      setUser(response.data.tecnico);
    } catch (error) {
      console.error("Error en el login", error);
      alert("Error al conectar con el servidor ❌");
    }
  };
  

  const logout = () => {
    console.log("Cerrando sesión..."); // Verificar que se ejecuta
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  
    // Redirigir al login
    window.location.href = "/";
  };
  
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
