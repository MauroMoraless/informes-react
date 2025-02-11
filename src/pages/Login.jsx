import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext); // ✅ Importando correctamente
  const [idtecnico, setIdtecnico] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado");

    try {
      await login(idtecnico, pass); // ✅ Llamando correctamente a login
      window.location.href = "/dashboard"; // Redirecciona después del login exitoso
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error al conectar con el servidor ❌");
    }
  };

  return (
    <div className="login-container">
      <h1>¡Bienvenido a la Plataforma de Técnicos! 👷‍♂️</h1>
      <p>Ingresa tus credenciales para continuar.</p>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="🔑 ID Técnico"
          value={idtecnico}
          onChange={(e) => setIdtecnico(e.target.value)}
        />
        <input
          type="password"
          placeholder="🔒 Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button className="btn-submit" type="submit">🚀 Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
