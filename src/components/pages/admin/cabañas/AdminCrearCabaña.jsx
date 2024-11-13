import React, { useEffect, useRef, useState } from 'react';
import { Peticion } from '../../../../helpers/Peticion';
import { Global } from '../../../../helpers/Global';
import Modal from '../../utils/Modal';

export const AdminCrearCabaña = () => {
    const [modelos, setModelos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [formulario, setFormulario] = useState({
        nombre: '', modelo: '', precio: '', descripcion: '',
        cantidadPersonas: '', cantidadBaños: '', cantidadHabitaciones: '', estado: '', servicios: []
    });
    const [imagenPrincipal, setImagenPrincipal] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
    const inputImagenPrincipalRef = useRef(null);
    const inputImagenesAdicionalesRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { datos: opciones } = await Peticion(`${Global.url}cabin/opciones`, "GET", null, false, 'include');
            const { datos: serviciosData } = await Peticion(`${Global.url}service/getAllServices`, "GET", null, false, 'include');
            setModelos(opciones?.modelos || []);
            setDisponibilidades(opciones?.disponibilidades || []);
            console.log(serviciosData?.services)
            setServicios(serviciosData?.services || []);
        };
        fetchData();
    }, []);

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = ({ target: { name, value } }) =>
        setFormulario(prev => ({ ...prev, [name]: value }));

    const onFileChange = (file, isMain = false) => {
        if (file) {
            const imageURL = URL.createObjectURL(file);
            if (isMain) {
                setImagenPrincipal(file);
            } else {
                setImagenesAdicionales(prev => [...prev, file]);
            }
        }
    };

    const handleServicioToggle = (id) =>
        setFormulario(prev => ({
            ...prev, servicios: prev.servicios.includes(id) ? prev.servicios.filter(s => s !== id) : [...prev.servicios, id]
        }));

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Formulario enviado:", formulario);

        const url = Global.url + "cabin/create";
        const { datos } = await Peticion(url, "POST", formulario, false, 'include');

        if (datos.status == 'success') {

            if (imagenPrincipal) {
                await uploadImage(datos.cabin._id, imagenPrincipal, true);
            }

            for (const image of imagenesAdicionales) {
                await uploadImage(datos.cabin._id, image, false);
            }
            setModalTitle('Cabaña creada Exitosamente');
            setModalMessage('La cabaña se ha creado con éxito!');
            setIsModalOpen(true);
        } else {
            alert("Error al crear la cabaña");
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
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-screen-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Crear Nueva Cabaña</h2>
                {['nombre', 'precio', 'descripcion'].map(field => (
                    <div key={field} className="flex flex-col">
                        <label className="text-gray-700 capitalize">{field.replace('cantidad', 'Cantidad de ')}</label>
                        {field === 'descripcion' ? (
                            <textarea
                                name={field}
                                value={formulario[field]}
                                onChange={handleChange}
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        ) : (
                            <input
                                type={field === 'precio' ? 'number' : 'text'}
                                name={field}
                                value={formulario[field]}
                                onChange={handleChange}
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    </div>
                ))}
                {['cantidadPersonas', 'cantidadBaños', 'cantidadHabitaciones'].map(field => (
                    <div key={field} className="flex flex-col">
                        <label className="text-gray-700 capitalize">{field.replace('cantidad', 'Cantidad de ')}</label>
                        <input
                            type="number"
                            name={field}
                            value={formulario[field]}
                            onChange={handleChange}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
                {['modelo', 'estado'].map(selectField => (
                    <div key={selectField} className="flex flex-col">
                        <label className="text-gray-700 capitalize">{selectField}</label>
                        <select
                            name={selectField}
                            value={formulario[selectField]}
                            onChange={handleChange}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione una opción...</option>
                            {(selectField === 'modelo' ? modelos : disponibilidades).map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
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
                                <img src={servicio.imagen} alt={servicio.nombre} className="h-16 w-16 object-cover mb-2 mx-auto rounded" />
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
                                <p className="text-sm text-gray-600">Imagen Principal seleccionada: {imagenPrincipal.name}</p>
                                <img src={URL.createObjectURL(imagenPrincipal)} alt="Vista previa" className="h-32 w-32 object-cover rounded-md ml-2" />
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
                        {imagenesAdicionales.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {imagenesAdicionales.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={URL.createObjectURL(img)} alt={`Vista previa ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                                        <p className="absolute top-1 left-28 bg-white text-xs p-1 rounded-full">{img.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Arrastra y suelta las imágenes adicionales aquí.</p>
                        )}
                    </div>
                </div>

                <button type="submit" className="botton-submit">
                    Crear Cabaña
                </button>
            </form >
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={modalTitle} message={modalMessage} />
        </div >
    );
};
