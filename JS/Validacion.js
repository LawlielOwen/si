// Función para manejar la validación
function validacion() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault(); // Evita la confirmación del formulario
          event.stopPropagation(); // Detiene el envío
        }
    
        form.classList.add('was-validated'); // Muestra los mensajes de validación
      }, false);
    });
  }

  document.addEventListener('DOMContentLoaded', validacion); //carga de la validacion  