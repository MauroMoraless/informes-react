import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardTecnico from "./pages/DashboardTecnico";
import Login from "./pages/Login";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : user.rol === "admin" ? <Navigate to="/dashboard" /> : <Navigate to="/dashboard-tecnico" />} />
        <Route path="/dashboard" element={user?.rol === "admin" ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/dashboard-tecnico" element={user?.rol === "tecnico" ? <DashboardTecnico /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
