export const Peticion = async (url, metodo, datosGuardar = "", archivos = false, credentials = "same-origin") => {
    let cargando = true;

    let opciones = {
        method: metodo,
        credentials: credentials || "same-origin",
    };
    if (metodo === "GET" || metodo === "DELETE") {
        if (archivos) {
            opciones = {
                method: metodo,
                credentials: credentials || "same-origin",
                body: JSON.stringify(datosGuardar),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        } else {
            opciones = {
                method: metodo,
                credentials: credentials || "same-origin",
            };
        }
    }

    if (metodo === "POST" || metodo === "PUT") {
        if (archivos) {
            opciones = {
                method: metodo,
                credentials: credentials || "same-origin",
                body: datosGuardar,
            };
        } else {
            opciones = {
                method: metodo,
                credentials: credentials || "same-origin",
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
            cargando,
            error: null,
        };
    } catch (error) {
        cargando = false;
        return {
            datos: null,
            cargando,
            error: error.message,
        };
    }
};
