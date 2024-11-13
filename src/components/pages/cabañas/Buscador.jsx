import { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";

export const Buscador = ({ setFiltros, cabañas }) => {
    const { formulario, cambiado } = useForm();
    const [opcionesCapacidad, setOpcionesCapacidad] = useState([]);
    const [opcionesHabitaciones, setOpcionesHabitaciones] = useState([]);
    const [opcionesBaños, setOpcionesBaños] = useState([]);

    useEffect(() => {
        if (cabañas) {
            const capacidades = [...new Set(cabañas.map(c => c.cantidadPersonas))];
            const habitaciones = [...new Set(cabañas.map(c => c.cantidadHabitaciones))];
            const baños = [...new Set(cabañas.map(c => c.cantidadBaños))];

            setOpcionesCapacidad(capacidades.sort((a, b) => a - b));
            setOpcionesHabitaciones(habitaciones.sort((a, b) => a - b));
            setOpcionesBaños(baños.sort((a, b) => a - b));
        }
    }, [cabañas]);

    const manejarCambios = (e) => {
        cambiado(e);
        setFiltros((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className='p-4 md:p-6 w-full flex justify-center items-center sticky top-0'>
            <form className='flex flex-col bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg'>
                <input 
                    type="text" 
                    name='descripcion' 
                    className='form-input mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
                    placeholder='Buscar por descripción' 
                    onChange={manejarCambios} 
                />
                
                <h3 className='text-lg font-bold mb-2'>Filtrar por:</h3>
                
                <label className='font-semibold mb-1'>Capacidad</label>
                <select 
                    name="cantidadPersonas" 
                    defaultValue={"0"} 
                    onChange={manejarCambios} 
                    className='form-select mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                >
                    <option value="0">-</option>
                    {opcionesCapacidad.map((capacidad) => (
                        <option key={capacidad} value={capacidad}>
                            {capacidad} Personas
                        </option>
                    ))}
                </select>

                <label className='font-semibold mb-1'>Habitaciones</label>
                <select 
                    name="cantidadHabitaciones" 
                    defaultValue={"0"} 
                    onChange={manejarCambios} 
                    className='form-select mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                >
                    <option value="0">-</option>
                    {opcionesHabitaciones.map((habitacion) => (
                        <option key={habitacion} value={habitacion}>
                            {habitacion} habitación(es)
                        </option>
                    ))}
                </select>

                <label className='font-semibold mb-1'>Baños</label>
                <select 
                    name="cantidadBaños" 
                    defaultValue={"0"} 
                    onChange={manejarCambios} 
                    className='form-select mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                >
                    <option value="0">-</option>
                    {opcionesBaños.map((baño) => (
                        <option key={baño} value={baño}>
                            {baño} baño(s)
                        </option>
                    ))}
                </select>
            </form>
        </div>
    );
};
