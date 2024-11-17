import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";
import Modal from "../../utils/Modal";


export const AdminEditarUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [usuario, setUsuario] = useState(null);
    const [rol, setRol] = useState("");
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [mensajeModal, setMensajeModal] = useState("");

    useEffect(() => {
        const obtenerUsuario = async () => {
            try {
                const { datos } = await Peticion(`${Global.url}user/profile/${id}`, "GET", null, null, 'include');
                if (datos.status === "success") {
                    setUsuario(datos.user);
                    setRol(datos.user.role);
                    setCargando(false);
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };

        obtenerUsuario();
    }, [id]);

    const guardarCambios = async () => {
        try {
            const { datos } = await Peticion(`${Global.url}user/cambiarRol/${id}`, "PUT", { role: rol }, false, 'include');
            if (datos.status === "success") {
                setUsuario({ ...usuario, role: rol });
                setMensajeModal("El rol del usuario se ha actualizado correctamente.");
            } else {
                setMensajeModal("Hubo un error al actualizar el rol.");
            }
            setModalAbierto(true);
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            setMensajeModal("Error al actualizar el rol.");
            setModalAbierto(true);
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        navigate("/admin/usuarios");
    };

    if (cargando) {
        return <p className="text-center text-gray-500">Cargando información del usuario...</p>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detalle del Usuario</h2>
            <div className="mb-4">
                <p><strong>ID:</strong> {usuario.id || usuario._id}</p>
                <p><strong>Nombre:</strong> {usuario.name}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Rol Actual:</strong> {usuario.role}</p>
            </div>

            <div className="mb-6">
                <label htmlFor="rol" className="block text-gray-700 font-medium mb-2">Cambiar Rol:</label>
                <select
                    id="rol"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="admin">Admin</option>
                    <option value="gerente">Gerente</option>
                    <option value="cliente">Cliente</option>
                </select>
            </div>

            <button
                onClick={guardarCambios}
                className="bg-lime-600 text-white py-2 px-6 rounded-md hover:bg-lime-700 transition duration-200"
            >
                Guardar Cambios
            </button>
            <Link to={'/admin/usuarios'} className="text-lime-500 hover:text-lime-700 ml-4 transition duration-200">Volver</Link>

            <Modal
                isOpen={modalAbierto}
                onClose={cerrarModal} 
                title="Actualización de Rol"
                message={mensajeModal}
            />
        </div>
    );
};
