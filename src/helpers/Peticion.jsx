export const Peticion = async (url, metodo, datosGuardar = "", archivos = false, credentials = "") => {
    let cargando = true;

    let opciones = {
        method: metodo,
        credentials: credentials || "same-origin", // Por defecto usa "same-origin"
    };

    // Si el método es GET o DELETE no necesitas cuerpo ni headers
    if (metodo === "GET" || metodo === "DELETE") {
        opciones = {
            method: metodo,
            credentials,
        };
    }

    // Para POST y PUT
    if (metodo === "POST" || metodo === "PUT") {
        // Si se envían archivos
        if (archivos) {
            opciones = {
                method: metodo,
                credentials,
                body: datosGuardar, // `datosGuardar` debería ser de tipo FormData
            };
        }
        // Si no se envían archivos (petición con JSON)
        else {
            opciones = {
                method: metodo,
                credentials,
                body: JSON.stringify(datosGuardar), // Los datos son en formato JSON
                headers: {
                    "Content-Type": "application/json", // Solo se aplica para JSON
                },
            };
        }
    }

    try {
        const peticion = await fetch(url, opciones);
        const datos = await peticion.json();
        cargando = false;
        return {
            datos,
            cargando
        };
    } catch (error) {
        cargando = false;
        return {
            datos: null,
            error: error.message,
            cargando
        };
    }
};
