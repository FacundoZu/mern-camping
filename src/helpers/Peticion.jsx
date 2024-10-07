export const Peticion = async (url, metodo, datosGuardar = "", archivos = false, credentials = "") => {

    let cargando = true;

    let opciones = {
        method: "GET"
    }

    if (metodo == "GET" || metodo == "DELETE") {
        opciones = {
            method: metodo,
            credentials,
        };
    }

    if (metodo == "POST" || metodo == "PUT") {
        
        let body = JSON.stringify(datosGuardar);
        if (archivos) {
            opciones = {
                method: metodo,
                credentials,
                body,
            };
        }
        else if (credentials){
            opciones = {
                method: metodo,
                body,
                credentials,
                headers: {
                    "Content-Type": "application/json"
                }
            };
        } else {
            opciones = {
                method: metodo,
                body: JSON.stringify(datosGuardar),
                headers: {
                    "Content-Type": "application/json"
                }
            };
        }
    }

    const peticion = await fetch(url, opciones);
    const datos = await peticion.json();

    cargando = false

    return {
        datos,
        cargando
    }
} 