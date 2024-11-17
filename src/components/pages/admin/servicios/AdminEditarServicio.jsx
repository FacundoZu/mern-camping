import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Global } from "../../../../helpers/Global";
import { Peticion } from "../../../../helpers/Peticion";

export const AdminEditarServicio = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("");
    const [imagenFile, setImagenFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [opcionImagen, setOpcionImagen] = useState("archivo");
    const inputImagenRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerServicio = async () => {
            const url = `${Global.url}service/getService/${id}`;
            const { datos } = await Peticion(url, "GET", null, false, "include");
            if (datos.success) {
                setNombre(datos.service.nombre);
                setImagen(datos.service.imagen);
                setDescripcion(datos.service.descripcion);
            } else {
                alert("Servicio no encontrado");
                navigate("/admin/servicios");
            }
        };
        obtenerServicio();
    }, [id, navigate]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith("image/")) {
            setImagenFile(files[0]);
        }
    };

    const handleImageClick = () => {
        inputImagenRef.current.click();
    };

    const onFileChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setImagenFile(file);
        }
    };

    const actualizarServicio = async (e) => {
        e.preventDefault();

        let imagenUrl = imagen;

        if (opcionImagen === "archivo" && imagenFile) {
            const formData = new FormData();
            formData.append("image", imagenFile);
            const uploadUrl = `${Global.url}service/uploadServiceImage`;
            const { datos: uploadResponse } = await Peticion(uploadUrl, "POST", formData, true, "include");

            if (uploadResponse.status === "success") {
                imagenUrl = uploadResponse.imageUrl;
            } else {
                alert("Error al subir la imagen: " + uploadResponse.message);
                return;
            }
        } else if (opcionImagen === "url" && !imagen.trim()) {
            alert("Por favor proporciona una URL válida para la imagen.");
            return;
        }

        const datosServicio = { nombre, descripcion, imagen: imagenUrl };
        const url = `${Global.url}service/updateService/${id}`;
        const { datos } = await Peticion(url, "PUT", datosServicio, null, 'include');
        console.log(datos)
        if (datos.success) {
            navigate("/admin/servicios");
        } else {
            alert("Error al actualizar el servicio: " + datos.mensaje);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-md mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editar Servicio</h2>
            <form onSubmit={actualizarServicio}>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Imagen</label>
                    <div className="mb-2">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="opcionImagen"
                                value="archivo"
                                checked={opcionImagen === "archivo"}
                                onChange={() => setOpcionImagen("archivo")}
                                className="mr-2"
                            />
                            Subir archivo
                        </label>
                        <label className="inline-flex items-center ml-4">
                            <input
                                type="radio"
                                name="opcionImagen"
                                value="url"
                                checked={opcionImagen === "url"}
                                onChange={() => setOpcionImagen("url")}
                                className="mr-2"
                            />
                            Usar URL
                        </label>
                    </div>

                    {opcionImagen === "archivo" ? (
                        <div
                            className={`border-2 cursor-pointer border-dashed rounded-lg p-4 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleImageClick}
                        >
                            <input
                                type="file"
                                ref={inputImagenRef}
                                onChange={(e) => onFileChange(e.target.files[0])}
                                accept="image/*"
                                className="hidden"
                            />
                            {imagenFile ? (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Imagen seleccionada: {imagenFile.name}</p>
                                    <img
                                        src={URL.createObjectURL(imagenFile)}
                                        alt="Vista previa"
                                        className="h-32 w-32 object-cover rounded-md ml-2"
                                    />
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">Arrastra y suelta la imagen aquí o haz clic para seleccionar.</p>
                            )}
                        </div>
                    ) : (
                        <div className="mt-2">
                            <label className="block text-gray-700">URL de la imagen</label>
                            <span className="text-gray-700">
                                Recomendamos esta{" "}
                                <a href="https://www.flaticon.com/" className="text-lime-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    página
                                </a>{" "}
                                para elegir la imagen.
                            </span>
                            <input
                                type="url"
                                value={imagen}
                                onChange={(e) => setImagen(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                                placeholder="https://example.com/imagen.jpg"
                                required
                            />
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-lime-600 text-white p-2 rounded hover:bg-lime-700 transition duration-200">
                    Actualizar Servicio
                </button>
            </form>
        </div>
    );
};
