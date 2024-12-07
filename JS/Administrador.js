function validacion() {
      
    // llama a los estilos de validacion de bootstrap
    const forms = document.querySelectorAll('.needs-validation')
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()  // Evita  la confirmacion del formulario
          event.stopPropagation() // Detiene el envio
        }
  
        form.classList.add('was-validated') // Parar mostrar los mensajes de: Porfavor, ingrese un usuario, etc.
      }, false)
    })
  }
  document.addEventListener('DOMContentLoaded', validacion);  

  function filtrarTabla(estado) {
    const filas = document.querySelectorAll("tbody tr");

    filas.forEach(fila => {
        const estadoEmpleado = fila.querySelector("td span").classList.contains(estado);
        
        if (estado === "todos") {
            fila.style.display = ""; // Muestra todas las filas
        } 
        else if (estadoEmpleado) {
            fila.style.display = ""; // Muestra las filas que coinciden con el estado
        } 
        else {
            fila.style.display = "none"; // Oculta las filas que no coinciden
        }
    });

    // Cambiar el texto del botón del dropdown cuando se selecciona una opción
    document.getElementById('dropdownButton').textContent = estado.charAt(0).toUpperCase() + estado.slice(1); // Capitaliza la primera letra de 'estado'
}

window.onload = function() {
    filtrarTabla("Activos");
};
