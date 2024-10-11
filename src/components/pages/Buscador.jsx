import { useForm } from "../../hooks/useForm";

export const Buscador = ({ setFiltros }) => {
    const { formulario, cambiado } = useForm();

    const manejarCambios = (e) => {
        cambiado(e);
        setFiltros((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className='p-4 md:p-6 w-full flex justify-center items-center'>
            <form className='flex flex-col bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg'>
                <input 
                    type="text" 
                    name='descripcion' 
                    className='form-input mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
                    placeholder='Buscar por descripción' 
                    onChange={manejarCambios} 
                />
                
                <h3 className='text-lg font-bold mb-2'>Filtrar por:</h3>
                
                {/* Capacidad */}
                <label className='font-semibold mb-1'>Capacidad</label>
                <select name="cantidadPersonas" defaultValue={"0"} onChange={manejarCambios} className='form-select mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'>
                    <option value="0">-</option>
                    <option value="2">2 Personas</option>
                    <option value="4">4 Personas</option>
                    <option value="6">6 Personas</option>
                    <option value="8">8 Personas</option>
                </select>

                {/* Habitaciones */}
                <label className='font-semibold mb-1'>Habitaciones</label>
                <select name="cantidadHabitaciones" defaultValue={"0"} onChange={manejarCambios} className='form-select mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'>
                    <option value="0">-</option>
                    <option value="1">1 habitación</option>
                    <option value="2">2 habitaciones</option>
                    <option value="3">3 habitaciones</option>
                </select>

                {/* Baños */}
                <label className='font-semibold mb-1'>Baños</label>
                <select name="cantidadBaños" defaultValue={"0"} onChange={manejarCambios} className='form-select mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'>
                    <option value="0">-</option>
                    <option value="1">1 baño</option>
                    <option value="2">2 baños</option>
                </select>
            </form>
        </div>
    );
};
