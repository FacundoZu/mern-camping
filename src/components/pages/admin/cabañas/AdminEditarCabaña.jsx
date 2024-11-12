import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Peticion } from '../../../../helpers/Peticion';
import { Global } from '../../../../helpers/Global';
import Modal from '../../utils/Modal';

export const AdminEditarCabaña = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modelos, setModelos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [servicios, setServicios] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const [formulario, setFormulario] = useState({
        nombre: '',
        modelo: '',
        precio: '',
        descripcion: '',
        cantidadPersonas: '',
        cantidadBaños: '',
        cantidadHabitaciones: '',
        estado: '',
        servicios: []
    });
    const [imagenPrincipal, setImagenPrincipal] = useState(null);
    const [imagenesAdicionalesInicial, setImagenesAdicionalesIniciales] = useState([]);
    const [imagenPrincipalInicial, setImagenPrincipalInicial] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const inputImagenPrincipalRef = useRef(null);
    const inputImagenesAdicionalesRef = useRef(null);
    useEffect(() => {
        const fetchCabañaData = async () => {
            const url = `${Global.url}cabin/getCabin/${id}`;
            const { datos } = await Peticion(url, 'GET', null, false, 'include');
            const cabin = datos.cabin;
            if (datos) {
                setFormulario({
                    nombre: cabin.nombre,
                    modelo: cabin.modelo,
                    precio: cabin.precio,
                    descripcion: cabin.descripcion,
                    cantidadPersonas: cabin.cantidadPersonas,
                    cantidadBaños: cabin.cantidadBaños,
                    cantidadHabitaciones: cabin.cantidadHabitaciones,
                    estado: cabin.estado,
                    servicios: cabin.servicios.map(s => s._id),
                });
                setImagenPrincipal(cabin.imagenPrincipal);
                setImagenesAdicionales(cabin.imagenesAdicionales);
                setImagenPrincipalInicial(cabin.imagenPrincipal);
                setImagenesAdicionalesIniciales(cabin.imagenesAdicionales);
            }
        };

        const fetchOpciones = async () => {
            const url = Global.url + "cabin/opciones";
            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos) {
                setModelos(datos.modelos);
                setDisponibilidades(datos.disponibilidades);
            }
        };

        const fetchServicios = async () => {
            const url = Global.url + "service/getAllServices";
            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos && datos.success) {
                setServicios(datos.services);
            }
        };

        fetchCabañaData();
        fetchOpciones();
        fetchServicios();
    }, [id]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/admin/cabañas');
      };

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
        if (files.length > 0) {
            onFileChange(files[0], true);
        }
    };

    const handleAdditionalImagesDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
        setImagenesAdicionales(prev => [...prev, ...newFiles]);
    };

    const handleImageClick = () => {
        inputImagenPrincipalRef.current.click();
    };

    const handleAdditionalImagesClick = () => {
        inputImagenesAdicionalesRef.current.click();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const handleServicioToggle = (servicioId) => {
        setFormulario((prevFormulario) => {
            const serviciosSeleccionados = prevFormulario.servicios.includes(servicioId)
                ? prevFormulario.servicios.filter((id) => id !== servicioId) // Eliminar si está seleccionado
                : [...prevFormulario.servicios, servicioId]; // Agregar si no está seleccionado
            return {
                ...prevFormulario,
                servicios: serviciosSeleccionados,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${Global.url}cabin/update/${id}`;
        const { datos } = await Peticion(url, 'PUT', formulario, false, 'include');

        if (datos.status == 'success') {
            setModalTitle('Actualización Exitosa');
            setModalMessage('La cabaña se ha actualizado con éxito!');
            setIsModalOpen(true);
            
            if (imagenPrincipal && imagenPrincipal !== imagenPrincipalInicial) {
                await uploadImage(id, imagenPrincipal, true);
            }
            
            if (imagenesAdicionales && imagenesAdicionales.length > 0) {
                const nuevasImagenes = imagenesAdicionales.filter(image =>
                    imagenesAdicionalesInicial.includes(image)
                );

                for (const image of nuevasImagenes) {
                    await uploadImage(id, image, false);
                }
            }

        } else {
            alert("Error al actualizar la cabaña");
        }
    };


    const uploadImage = async (cabinId, imageFile, isMain) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('isMain', isMain);

        const url = Global.url + `cabin/uploadImage/${cabinId}`;
        await Peticion(url, 'POST', formData, true, 'include');
    };

    return (
        <div className='p-6 bg-white shadow-lg rounded-lg max-w-screen-lg mx-auto'>
            <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Editar La Cabaña: {formulario.nombre}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Modelo</label>
                    <select name="modelo" value={formulario.modelo} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccione un modelo...</option>
                        {modelos.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Precio</label>
                    <input type="number" name="precio" value={formulario.precio} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Descripción</label>
                    <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Cantidad de Personas</label>
                    <input type="number" name="cantidadPersonas" value={formulario.cantidadPersonas} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Cantidad de Baños</label>
                    <input type="number" name="cantidadBaños" value={formulario.cantidadBaños} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Cantidad de Habitaciones</label>
                    <input type="number" name="cantidadHabitaciones" value={formulario.cantidadHabitaciones} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Estado</label>
                    <select name="estado" value={formulario.estado} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccione un estado...</option>
                        {disponibilidades.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Servicios</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {servicios.map((servicio) => (
                            <div
                                key={servicio._id}
                                className={`border rounded-lg p-4 text-center cursor-pointer transition duration-200 
                            ${formulario.servicios.includes(servicio._id) ? 'bg-lime-100 border-lime-500' : 'bg-white border-gray-300'}`}
                                onClick={() => handleServicioToggle(servicio._id)}
                            >
                                <img src={servicio.imagen} alt={servicio.nombre} className="h-16 w-16 object-cover mb-2 rounded m-auto" />
                                <p className="text-gray-800 text-sm">{servicio.nombre}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Imagen Principal</label>
                    <div
                        className={`border-2 cursor-pointer border-dashed rounded-lg p-4 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleImageClick}
                    >
                        <input
                            type="file"
                            ref={inputImagenPrincipalRef}
                            onChange={(e) => onFileChange(e.target.files[0], true)}
                            accept="image/*"
                            className="hidden"
                        />
                        {imagenPrincipal ? (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Imagen Principal seleccionada: {typeof imagenPrincipal === 'string' ? imagenPrincipal.split('/').pop() : imagenPrincipal.name}</p>
                                <img src={typeof imagenPrincipal === 'string' ? imagenPrincipal : URL.createObjectURL(imagenPrincipal)} alt="Vista previa" className="h-32 w-32 object-cover rounded-md ml-2" />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Arrastra y suelta la imagen principal aquí o haz clic para seleccionar.</p>
                        )}
                    </div>
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700">Imágenes Adicionales</label>
                    <div
                        className={`border-2 cursor-pointer border-dashed rounded-lg p-4 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleAdditionalImagesDrop}
                        onClick={handleAdditionalImagesClick}
                    >
                        <input
                            type="file"
                            ref={inputImagenesAdicionalesRef}
                            onChange={(e) => {
                                const files = e.target.files;
                                const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
                                setImagenesAdicionales(prev => [...prev, ...newFiles]);
                            }}
                            accept="image/*"
                            className="hidden"
                            multiple
                        />
                        {imagenesAdicionales && imagenesAdicionales.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {imagenesAdicionales.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt={`Vista previa ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Arrastra y suelta las imágenes adicionales aquí.</p>
                        )}
                    </div>
                </div>

                <button type="submit" className="botton-submit h-14">Actualizar Cabaña</button>
            </form>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
            />
        </div>
    );
};
