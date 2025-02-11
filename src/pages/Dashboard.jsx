import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Asegúrate de que la ruta es correcta
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <p>Cargando...</p>; // Evita renderizar el dashboard si user es null
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [informeSeleccionado, setInformeSeleccionado] = useState(null);
  const [nuevosDatos, setNuevosDatos] = useState({
    estado: "",
    checklist: "",
  });

  const abrirModal = (informe) => {
    setInformeSeleccionado(informe);
    setNuevosDatos({ estado: informe.estado, checklist: informe.checklist });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setInformeSeleccionado(null);
  };

  const [informes, setInformes] = useState([]);
  const [filtros, setFiltros] = useState({
    idtecnico: "",
    estado: "",
    fecha: "",
    checklist: "",
  });

  useEffect(() => {
    if (user) {
      fetchInformes();
    }
  }, [filtros, user]);

  const fetchInformes = async () => {
    try {
      const response = await api.get("/informes", { params: filtros });
      setInformes(response.data);
    } catch (error) {
      console.error("Error al obtener informes", error);
    }
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const limpiarFiltros = () => {
    setFiltros({
      idtecnico: "",
      estado: "",
      fecha: "",
      checklist: "",
    });
  };

  const guardarCambios = async () => {
    try {
      await api.put(`/informes/${informeSeleccionado.id_informe}`, nuevosDatos);
      alert("Informe actualizado correctamente ✅");

      // Cerrar el modal y actualizar la lista de informes
      cerrarModal();
      fetchInformes();
    } catch (error) {
      console.error("Error al actualizar el informe", error);
      alert("Error al actualizar el informe ❌");
    }
  };

  const eliminarInforme = async (id_informe) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este informe?")) {
      try {
        await api.delete(`/informes/${id_informe}`);
        fetchInformes();
      } catch (error) {
        console.error("Error al eliminar informe", error);
      }
    }
  };

  const { logout } = useContext(AuthContext); // 🔥 Obtiene la función de cierre de sesión

  const cerrarSesion = () => {
    logout(); // 🔥 Llama a la función logout para limpiar todo correctamente
    window.location.href = "/"; // 🔥 Redirige al login
  };

  const [nuevoTecnico, setNuevoTecnico] = useState({
    idtecnico: "",
    nombre: "",
    pass: ""
  });

  const handleNuevoTecnicoChange = (e) => {
    setNuevoTecnico({ ...nuevoTecnico, [e.target.name]: e.target.value });
  };

  const registrarTecnico = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔥 Obtiene el token almacenado

      const response = await api.post(
        "/users/register",  // 🔥 Corrige la URL aquí
        nuevoTecnico,
        {
          headers: { Authorization: `Bearer ${token}` } // 🔥 Agrega el token si es necesario
        }
      );

      alert("Técnico registrado correctamente ✅");
      setNuevoTecnico({ idtecnico: "", nombre: "", pass: "" });
    } catch (error) {
      console.error("Error al registrar técnico:", error);
      alert("Error al registrar técnico ❌");
    }
  };

  return (
    <div className="dashboard-container">
      <button onClick={cerrarSesion} className="btn-cerrar-sesion">🚪 Cerrar Sesión</button>
      <h2>Registrar Técnicos</h2>

      {/* FORMULARIO PARA REGISTRAR TÉCNICOS */}
      <div className="registro-tecnico">
        <input
          type="text"
          name="idtecnico"
          placeholder="ID Técnico"
          value={nuevoTecnico.idtecnico}
          onChange={handleNuevoTecnicoChange}
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoTecnico.nombre}
          onChange={handleNuevoTecnicoChange}
        />
        <input
          type="password"
          name="pass"
          placeholder="Contraseña"
          value={nuevoTecnico.pass}
          onChange={handleNuevoTecnicoChange}
        />
        <button className="btn-submit" onClick={registrarTecnico}>Registrar</button>
      </div>

      <h2>Lista de Informes</h2>

      {/* FORMULARIO DE FILTROS */}
      <div className="filtros">
        <input
          type="text"
          name="idtecnico"
          placeholder="Filtrar por ID del técnico"
          value={filtros.idtecnico}
          onChange={handleChange}
        />
        <select name="estado" value={filtros.estado} onChange={handleChange}>
          <option value="">Todos los estados</option>
          <option value="Continuar ruta ok">Continuar ruta ok</option>
          <option value="Continuar ruta sin control">Continuar ruta sin control</option>
          <option value="Rechazado / Rehacer formulario">Rechazado / Rehacer formulario</option>
        </select>
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleChange} />
        <select name="checklist" value={filtros.checklist} onChange={handleChange}>
          <option value="">Todos los checklist</option>
          <option value="Evento fuera de norma">Evento fuera de norma</option>
          <option value="Conformidad de cliente">Conformidad de cliente</option>
          <option value="Varios / otros">Varios / otros</option>
        </select>
        <button onClick={limpiarFiltros} className="btn-limpiar">Limpiar Filtros</button>
      </div>


      {/* MENSAJE SI NO HAY RESULTADOS */}
      {informes.length === 0 ? (
        <p className="mensaje-no-resultados">No se encontraron informes con los filtros aplicados.</p>
      ) : (
        informes.map((informe) => (
          <div key={informe.id_informe} className="informe-card">
            <p><strong>ID:</strong> {informe.id_informe}</p>
            <p><strong>Técnico:</strong> {informe.tecnico_nombre}</p>
            <p><strong>Estado:</strong> {informe.estado}</p>
            <p><strong>Observaciones:</strong> {informe.observaciones}</p>
            <p><strong>Checklist:</strong> {informe.checklist}</p>
            <p><strong>Abonado:</strong> {informe.abonado}</p>
            <p><strong>VT:</strong> {informe.vt}</p>
            <p><strong>Fecha:</strong> {new Date(informe.fecha_creacion).toLocaleString()}</p>
            <button onClick={() => abrirModal(informe)}>✏️ Editar</button>
            <button onClick={() => eliminarInforme(informe.id_informe)}>🗑️ Eliminar</button>

            {/* ARCHIVOS */}
            <div className="archivo-container">
              {informe.archivos.map((archivo, index) => (
                archivo.tipo === "imagen" ? (
                  <img key={index} src={archivo.url_archivo} alt="Evidencia" className="archivo" />
                ) : (
                  <video key={index} controls className="archivo">
                    <source src={archivo.url_archivo} type="video/mp4" />
                    Tu navegador no soporta el video.
                  </video>
                )
              ))}
            </div>
          </div>
        ))
      )}

      {/* MODAL PARA EDITAR INFORME */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Informe</h3>
            <label>Estado:</label>
            <select
              value={nuevosDatos.estado}
              onChange={(e) => setNuevosDatos({ ...nuevosDatos, estado: e.target.value })}
            >
              <option value="Continuar ruta ok">Continuar ruta ok</option>
              <option value="Continuar ruta sin control">Continuar ruta sin control</option>
              <option value="Rechazado / Rehacer formulario">Rechazado / Rehacer formulario</option>
            </select>

            <label>Checklist:</label>
            <select
              value={nuevosDatos.checklist}
              onChange={(e) => setNuevosDatos({ ...nuevosDatos, checklist: e.target.value })}
            >
              <option value="Evento fuera de norma">Evento fuera de norma</option>
              <option value="Conformidad de cliente">Conformidad de cliente</option>
              <option value="Varios / otros">Varios / otros</option>
            </select>

            <button onClick={guardarCambios}>💾 Guardar</button>
            <button onClick={cerrarModal}>❌ Cancelar</button>
          </div>
        </div>
      )}

    </div>
  );

};

export default Dashboard;
