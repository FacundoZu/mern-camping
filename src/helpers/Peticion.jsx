export const Peticion = async (url, metodo, datosGuardar = "", archivos = false, credentials = "") => {
    let cargando = true;

    let opciones = {
        method: metodo,
        credentials: credentials || "same-origin",
    };

    if (metodo === "GET" || metodo === "DELETE") {
        opciones = {
            method: metodo,
            credentials,
        };
    }

    if (metodo === "POST" || metodo === "PUT") {
        if (archivos) {
            opciones = {
                method: metodo,
                credentials,
                body: datosGuardar,
            };
        }
        else {
            opciones = {
                method: metodo,
                credentials,
                body: JSON.stringify(datosGuardar),
                headers: {
                    "Content-Type": "application/json",
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
