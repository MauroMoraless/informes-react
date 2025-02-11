import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";  // Importamos el contexto de autenticación
import "./Dashboard.css";


const DashboardTecnico = () => {
    const { user } = useContext(AuthContext);
    if (!user) {
        console.error("No se encontró un usuario autenticado.");
        return <p>Autenticando...</p>; // O redirigir al login
    }
    const { logout } = useContext(AuthContext); // 🔥 Obtiene la función de cierre de sesión
    const [informes, setInformes] = useState([]);
    const [nuevoInforme, setNuevoInforme] = useState({
        estado: "Continuar ruta ok",
        observaciones: "",
        checklist: "Evento fuera de norma",
        abonado: "",
        vt: "",
        archivos: []
    });
    const cerrarSesion = () => {
        logout(); // 🔥 Llama a la función logout para limpiar todo correctamente
        window.location.href = "/"; // 🔥 Redirige al login
    };
    useEffect(() => {
        const obtenerInformes = async () => {
            if (!user) {
                console.error("Error: Usuario no definido");
                return;
            }
    
            try {
                // 🔥 Solo traer los informes del técnico logueado
                const response = await api.get(`/informes?idtecnico=${user.idtecnico}`);
                setInformes(response.data);
            } catch (error) {
                console.error("Error al obtener informes", error);
            }
        };
    
        obtenerInformes();
    }, [user]);

    const fetchInformes = async () => {
        try {
            const response = await api.get("/informes");
            setInformes(response.data);
        } catch (error) {
            console.error("Error al obtener informes", error);
        }
    };

    const handleFileChange = (e) => {
        setNuevoInforme({ ...nuevoInforme, archivos: e.target.files });
    };

    const handleChange = (e) => {
        setNuevoInforme({ ...nuevoInforme, [e.target.name]: e.target.value });
    };

    const subirInforme = async () => {
        if (!user) {
            console.error("Error: Usuario no definido");
            alert("Error: Usuario no definido");
            return;
        }
    
        const formData = new FormData();
        formData.append("idtecnico", user.idtecnico);
        formData.append("abonado", nuevoInforme.abonado);
        formData.append("vt", nuevoInforme.vt);
        formData.append("estado", nuevoInforme.estado);
        formData.append("observaciones", nuevoInforme.observaciones);
        formData.append("checklist", nuevoInforme.checklist);
    
        // 🔥 Aquí es donde estaba el error: archivos no está definido.
        if (nuevoInforme.archivos.length > 0) {
            Array.from(nuevoInforme.archivos).forEach((file) => {
                formData.append("archivo", file); // Debe coincidir con la API
            });
        } else {
            console.error("Error: No se seleccionaron archivos.");
            alert("Error: Debes seleccionar al menos un archivo.");
            return;
        }
    
        try {
            const response = await api.post("/informes/crear", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Informe creado correctamente ✅");
            console.log(response.data);
            // 🔄 Recargar la página después de subir el informe
            window.location.reload();
        } catch (error) {
            console.error("Error al subir informe", error);
            alert("Error al subir informe ❌");
        }
    };
    
    return (
        <div className="dashboard-container">
            <button onClick={cerrarSesion} className="btn-cerrar-sesion">
                🔴 Cerrar Sesión
            </button>
            <h2>Subir Informe</h2>
            <div className="formulario-informe">
                <select name="estado" value={nuevoInforme.estado} onChange={handleChange}>
                    <option value="Continuar ruta ok">Continuar ruta ok</option>
                    <option value="Continuar ruta sin control">Continuar ruta sin control</option>
                    <option value="Rechazado / Rehacer formulario">Rechazado / Rehacer formulario</option>
                </select>
                <input type="text" name="observaciones" placeholder="Observaciones" value={nuevoInforme.observaciones} onChange={handleChange} />
                <select name="checklist" value={nuevoInforme.checklist} onChange={handleChange}>
                    <option value="Evento fuera de norma">Evento fuera de norma</option>
                    <option value="Conformidad de cliente">Conformidad de cliente</option>
                    <option value="Varios / otros">Varios / otros</option>
                </select>
                <input type="text" name="abonado" placeholder="Abonado" value={nuevoInforme.abonado} onChange={handleChange} />
                <input type="text" name="vt" placeholder="VT" value={nuevoInforme.vt} onChange={handleChange} />
                <input type="file" multiple onChange={handleFileChange} />
                <button className="btn-submit" onClick={subirInforme}>Subir Informe</button>
            </div>

            <h2>Mis Informes</h2>
            {informes.length === 0 ? (
                <p>No tienes informes registrados.</p>
            ) : (
                informes.map((informe) => (
                    <div key={informe.id_informe} className="informe-card">
                        <p><strong>Estado:</strong> {informe.estado}</p>
                        <p><strong>Observaciones:</strong> {informe.observaciones}</p>
                        <p><strong>Checklist:</strong> {informe.checklist}</p>
                        <p><strong>Abonado:</strong> {informe.abonado}</p>
                        <p><strong>VT:</strong> {informe.vt}</p>
                        <p><strong>Fecha:</strong> {new Date(informe.fecha_creacion).toLocaleString()}</p>
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
        </div>
    );
};

export default DashboardTecnico;