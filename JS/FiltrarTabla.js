function filtrarTabla(estado) {
    const filas = document.querySelectorAll("tbody tr");

    filas.forEach(fila => {
        const estadoEmpleado = fila.querySelector("td span");

        if (estadoEmpleado) {
    
            const empleadoEstado = estadoEmpleado.textContent.trim() === 'Activo' ? 1 : 0;

            if (estado === "todos") {
                fila.style.display = ""; 
            } 
            else if (estado === '0' || estado === '1') {
                fila.style.display = empleadoEstado == estado ? "" : "none";  
            }
        }
    });
}
// Filtra el modulo de los pedidos debido a que contiene 3 estatus distintos
function filtrarTablaPedido(estado) {
    const filas = document.querySelectorAll("tbody tr");

    filas.forEach(fila => {
        const estadoEmpleado = fila.querySelector("td span");

        if (estadoEmpleado) {
            const empleadoEstado = estadoEmpleado.textContent.trim();

            if (estado === "todos") {
                fila.style.display = "";  
            } else if (estado === '0' || estado === '1' || estado === '2') {
              
                if (estado === '0' && empleadoEstado === 'Cancelado') {
                    fila.style.display = "";
                } else if (estado === '1' && empleadoEstado === 'Atendido') {
                    fila.style.display = "";
                } else if (estado === '2' && empleadoEstado === 'Pendiente') {
                    fila.style.display = "";
                } else {
                    fila.style.display = "none";
                }
            }
        }
    });
}
