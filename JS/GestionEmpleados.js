function validacion() {

    // llama a los estilos de validacion de bootstrap
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()  // Evita  la confirmacion del formulario
                event.stopPropagation() // Detiene el envio
            }

            form.classList.add('was-validated')
        }, false)
    })
} //Validacion de bootstrap
document.addEventListener('DOMContentLoaded', validacion); // carga de la validacion en el DOM

fetch('JSON/Estados.json')
    .then(response => { //carga de los estados para el formulario de agregar
        return response.json();
    })
    .then(data => {//se llama al json y se inyectan en las opciones
        const estadoSelect = document.querySelector('.estado');
        const ciudadSelect = document.querySelector('.ciudad');
        estadoSelect.innerHTML = '<option selected disabled>Seleccione un estado</option>';
        ciudadSelect.innerHTML = '<option selected disabled>Seleccione una ciudad</option>';
        data.Estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.estado;
            option.textContent = estado.estado;
            estadoSelect.appendChild(option);
        });
        estadoSelect.addEventListener('change', function () {
            console.log("Estado seleccionado:", estadoSelect.value);
            ciudadSelect.innerHTML = '<option selected disabled>Seleccione una ciudad</option>';
            ciudadSelect.disabled = false;

            const estadoSeleccionado = data.Estados.find(estado => estado.estado === estadoSelect.value);
            if (estadoSeleccionado) {
                estadoSeleccionado.municipios.forEach(municipio => {
                    const option = document.createElement('option');
                    option.value = municipio;
                    option.textContent = municipio;
                    ciudadSelect.appendChild(option);
                });
            } else {
                ciudadSelect.disabled = true;
            }
        });
    });
fetch('JSON/EstadosModificar.json')
    .then(response => { //Se cargan los estados para el formulario de modificar
        return response.json();
    })
    .then(data => {
        const estadoSelect = document.querySelector('.estadoModificar');
        const ciudadSelect = document.querySelector('.ciudadModificar');
        estadoSelect.innerHTML = '<option selected disabled>Seleccione un estado</option>';
        ciudadSelect.innerHTML = '<option selected disabled>Seleccione una ciudad</option>';
        data.Estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.estado;
            option.textContent = estado.estado;
            estadoSelect.appendChild(option);
        });
        estadoSelect.addEventListener('change', function () {
            console.log("Estado seleccionado:", estadoSelect.value);
            ciudadSelect.innerHTML = '<option selected disabled>Seleccione una ciudad</option>';
            ciudadSelect.disabled = false;

            const estadoSeleccionado = data.Estados.find(estado => estado.estado === estadoSelect.value);
            if (estadoSeleccionado) {
                estadoSeleccionado.municipios.forEach(municipio => {
                    const option = document.createElement('option');
                    option.value = municipio;
                    option.textContent = municipio;
                    ciudadSelect.appendChild(option);
                });
            } else {
                ciudadSelect.disabled = true;
            }
        });
    });
let Empleados = [];
let seleccionarEmpleado;
function cargarEmpleados() { //se carga el JSON de empleados
    fetch('JSON/Empleado.json')
        .then(response => response.json())
        .then(data => {
            Empleados = data.Empleados;
            const empleados = data.Empleados;
            const cuerpoTabla = document.getElementById('cuerpoTabla');
            cuerpoTabla.innerHTML = '';
            empleados.forEach((empleado) => {
                cuerpoTabla.innerHTML += `
                    <tr id="empleado-${empleado.id}">
                        <td><img src="${empleado.foto}"  class="tamañoImg"></td>
                        <td>${empleado.nombre} ${empleado.app} ${empleado.apm}</td>
                        <td>${empleado.fechaNacimiento}</td>
                        <td>
                            <span class="${empleado.estatus === 1 ? 'Activos' : 'Inactivos'}">
                                ${empleado.estatus === 1 ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td>
                          <div class="btn-group">
  <button class="btn btn-dark dropdown-toggle  text-light border-warning Opciones_boton" type="button" id="opcionesEmpleado${empleado.id}" data-bs-toggle="dropdown" aria-expanded="false">
    Opcion
  </button>
  <ul class="dropdown-menu menu_opciones text-light border-warning"  aria-labelledby="opcionesEmpleado${empleado.id}">
    <li>
      <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${empleado.id})">
        <img src="Img/Iconos/Modificar.svg"> Modificar
      </button>
    </li>
    <li>
      <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarEmpleado(${empleado.id})">
        <img src="Img/Iconos/Borrar.svg"> Eliminar
      </button>
    </li>
    <li>
      <button class="dropdown-item btn text-light info_boton" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${empleado.id})">
        <img src="Img/Iconos/Estatus.svg" > Cambiar Estatus
      </button>
    </li>
  </ul>
</div> 
                <button class="btn  btn-dark text-light border-warning info_boton" data-bs-toggle="modal" data-bs-target="#Info"  
                data-id="${empleado.id}" onclick="mostrarInfoEmpleado(${empleado.id})"><img src="Img/Iconos/Info.svg" class="info_icono">  Info</button>
                        </td>
                    </tr>
                `;
            });
            filtrarTabla('1');
        });
}
document.addEventListener('DOMContentLoaded', cargarEmpleados); // se carga el contenido 

function mostrarInfoEmpleado(id) { //se carga el resto de la info del empleado en el modal de info
    const empleado = Empleados.find(emp => emp.id === id);
    if (empleado) {
        const informacion = `
            <p><strong>Nombre:</strong> ${empleado.nombre} ${empleado.app} ${empleado.apm}</p>
            <p><strong>Género:</strong> ${empleado.genero}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${empleado.fechaNacimiento}</p>
            <p><strong>RFC:</strong> ${empleado.rfc}</p>
            <p><strong>CURP:</strong> ${empleado.curp}</p>
            <p><strong>Email:</strong> ${empleado.email}</p>
            <p><strong>Teléfono:</strong> ${empleado.telefono}</p>
            <p><strong>Dirección:</strong> ${empleado.direccion.calle}, ${empleado.direccion.colonia}, ${empleado.direccion.municipio}, ${empleado.direccion.estado}, ${empleado.direccion.codigoPostal}</p>
            <p><strong>Salario:</strong> ${empleado.salario}</p>
            <p><strong>Puesto:</strong> ${empleado.puesto}</p>
            <p><strong>Codigo de empleado:</strong> ${empleado.codigoEmpleado}</p>
            <p><strong>Estatus:</strong> ${empleado.estatus === 1 ? 'Activo' : 'Inactivo'}</p>
        `;
        document.querySelector('#informacion').innerHTML = informacion;
    }
}

function buscarEmpleado() { // se realiza la busqued del empleado
    const query = document.querySelector(".buscar_empleado").value.toLowerCase();
    const filas = document.querySelectorAll("tbody tr");
    filas.forEach(fila => {

        const estadoEmpleado = fila.style.display !== "none";
        const nombreCompleto = fila.cells[1].innerText.toLowerCase();
        if (nombreCompleto.includes(query)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

document.getElementById('formularioEmpleado').addEventListener('submit', function (event) { //Se hace un evento para abrir el formulario
    event.preventDefault(); // <--- esto evita que se recarge la pagina y se deshaga todo al darle en agregar
    agregarEmpleado();

});

function abrirAgregarEmpleado() { // Abre la funcion de agregar empleado
    document.querySelector('#formularioEmpleado').reset();
    document.querySelector('#formularioEmpleado').onsubmit = (e) => {
        e.preventDefault();
        agregarEmpleado();
    };
}
function agregarEmpleado() { // LLamada de id, clases , etc 
    const nombre = document.getElementById('nombre').value;
    const apellidoPaterno = document.getElementById('app').value;
    const apellidoMaterno = document.getElementById('apm').value;
    const genero = document.querySelector('input[name="radio-stacked"]:checked').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const rfc = document.getElementById('RFC').value;
    const curp = document.getElementById('CURP').value;
    const calle = document.getElementById('calle').value;
    const colonia = document.getElementById('colonia').value;
    const email = document.getElementById('correo').value;
    const codigoPostal = document.getElementById('CP').value;
    const estado = document.getElementById('estado').value;
    const ciudad = document.getElementById('ciudad').value;
    const telefono = document.getElementById('telefono').value;
    const puesto = document.getElementById('puesto').value;
    const salario = document.getElementById('salario').value;
    const fechaIngreso = document.getElementById('fechaIngreso').value;
    const fotografia = document.getElementById("foto").files[0];
    const fotografiaURL = fotografia ? URL.createObjectURL(fotografia) : '';
    const codigoEmpleado = generarCodigoEmpleado(new Date(fechaIngreso));

    const fechaFormato = new Date(fechaNacimiento);
    const nuevaFecha = formatoFecha(fechaFormato); // se llama para darle el formato dd/mm/yyyy

    const nuevoEmpleado = { // se almacenan los datos en el array
        id: Empleados.length + 1,
        nombre: nombre,
        app:apellidoPaterno,
        apm:apellidoMaterno,
        fechaNacimiento: nuevaFecha,
        genero: obtenerGenero(genero),
        rfc,
        curp,
        email,
        direccion: {
            calle: calle,
            colonia: colonia,
            municipio: ciudad,
            estado: estado,
            codigoPostal: codigoPostal
        },
        codigoPostal,
        estado,
        ciudad,
        telefono,
        puesto,
        salario,
        fechaIngreso,
        fotografia: fotografiaURL,
        codigoEmpleado,
        estatus: 1,
    };

    const fila = document.createElement('tr');
    fila.id = `empleado-${nuevoEmpleado.id}`;

    const tdFoto = document.createElement('td');
    const img = document.createElement('img');
    img.src = nuevoEmpleado.fotografia;
    img.alt = nuevoEmpleado.nombre;
    img.classList.add('tamañoImg');
    tdFoto.appendChild(img);
    fila.appendChild(tdFoto);

    const tdNombre = document.createElement('td');
    tdNombre.textContent =`${nuevoEmpleado.nombre} ${nuevoEmpleado.app} ${nuevoEmpleado.apm}`; //crecion de las celdas de la tabla
    fila.appendChild(tdNombre);

    const tdFechaNacimiento = document.createElement('td');
    tdFechaNacimiento.textContent = nuevoEmpleado.fechaNacimiento;
    fila.appendChild(tdFechaNacimiento);

    const tdEstatus = document.createElement('td');
    const estatusSpan = document.createElement('span');
    estatusSpan.classList.add(nuevoEmpleado.estatus === 1 ? 'Activos' : 'Inactivos');
    estatusSpan.textContent = nuevoEmpleado.estatus === 1 ? 'Activo' : 'Inactivo'; //se le otorga el estatus
    tdEstatus.appendChild(estatusSpan);
    fila.appendChild(tdEstatus);

    const tdAcciones = document.createElement('td'); // inyeccion de botones con iconos

    tdAcciones.innerHTML = `
    
     <div class="btn-group">
  <button class="btn btn-dark dropdown-toggle text-light border-warning Opciones_boton" type="button" id="opcionesEmpleado${nuevoEmpleado.id}" data-bs-toggle="dropdown" aria-expanded="false">
    Opcion
  </button>
  <ul class="dropdown-menu menu_opciones text-light border-warning" aria-labelledby="opcionesEmpleado${nuevoEmpleado.id}">
    <li>
      <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${nuevoEmpleado.id})">
        <img src="Img/Iconos/Modificar.svg"> Modificar
      </button>
    </li>
    <li>
      <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarEmpleado(${nuevoEmpleado.id})">
        <img src="Img/Iconos/Borrar.svg"> Eliminar
      </button>
    </li>
    <li>
      <button class="dropdown-item btn text-light info_boton" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${nuevoEmpleado.id})">
        <img src="Img/Iconos/Estatus.svg"> Cambiar Estatus
      </button>
    </li>
  </ul>
</div>
<br>
        <button class="btn  btn-dark text-light border-warning info_boton" data-bs-toggle="modal" data-bs-target="#Info"  data-id="${nuevoEmpleado.id}" onclick="mostrarInfoEmpleado(${nuevoEmpleado.id})">
                   <img src="Img/Iconos/Info.svg"  class="info_icono">
                    Info
                </button>
    `;
    Empleados.push(nuevoEmpleado);
    fila.appendChild(tdAcciones);
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    cuerpoTabla.appendChild(fila);
    mostrarInfoEmpleado(nuevoEmpleado.id); // se carga la informacion en el modal de info
    document.getElementById('formularioEmpleado').reset();// se limpia el formulario
    const myModal = bootstrap.Modal.getInstance(document.getElementById('agregarEmpleado'));
    myModal.hide();
}
function obtenerGenero(genero) { //se obtiene el genero de 0 o 1 o 2
    switch (genero) {
        case '0': return 'Masculino';
        case '1': return 'Femenino';
        case '2': return 'Otro';
        default: return 'Desconocido';
    }
}

function formatoFecha(fecha) { //da el formato dd/mm/yyyy
    const annio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();
    if (mes < 10) mes = "0" + mes;

    if (dia < 10) dia = "0" + dia;


    return dia + "/" + mes + "/" + annio;
}

function generarCodigoEmpleado(fechaIngreso) { // genera el codigo del empleado con base a los requerimientos
    const año = fechaIngreso.getFullYear().toString().slice(-2);
    const mes = fechaIngreso.getMonth() + 1;
    const consecutivo = Empleados.length + 1;
    let mesFormateado = mes;
    if (mes < 10) {
        mesFormateado = "0" + mes;
    }
    let consecutivoFormateado = consecutivo;
    if (consecutivo < 10) {
        consecutivoFormateado = "0" + consecutivo;
    }
    return `${año}${mesFormateado}${consecutivoFormateado}`;
}

function abrirCambiarEstatus(idEmpleado) { //preparacion del cambio de estatus
    const botonConfirmar = document.querySelector('.confirmarEliminar');
    botonConfirmar.setAttribute('data-id', idEmpleado);
}

function hacerCambio() { //se hace el cambio
    const botonConfirmar = document.querySelector('.confirmarEliminar');
    const idEmpleado = botonConfirmar.getAttribute('data-id');
    const idEmpleadoInt = parseInt(idEmpleado);
    const empleado = Empleados.find(emp => emp.id === idEmpleadoInt);
    empleado.estatus = empleado.estatus === 1 ? 0 : 1;
    const filaEmpleado = document.getElementById(`empleado-${empleado.id}`);
    const celdaEstatus = filaEmpleado.querySelector('td:nth-child(4) span');
    celdaEstatus.textContent = empleado.estatus === 1 ? 'Activo' : 'Inactivo';

    celdaEstatus.classList.remove('Activos', 'Inactivos');
    celdaEstatus.classList.add(empleado.estatus === 1 ? 'Activos' : 'Inactivos');

    const myModal = bootstrap.Modal.getInstance(document.getElementById('Cambio'));
    myModal.hide();
}
function abrirEliminarEmpleado(id) { //preparacion de la eliminacion
    const empleado = Empleados.find(emp => emp.id === id);
    if (empleado) {
        document.querySelector('#confirmarEliminar').onclick = () => {
            eliminarEmpleado(id);
        };
    }
}

function eliminarEmpleado(id) { //se elimina el empleadp
    Empleados = Empleados.filter(emp => emp.id !== id);
    const fila = document.getElementById(`empleado-${id}`);
    if (fila) {
        fila.remove();
    }

    const modal = document.getElementById('Eliminar');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
}

function clear() {
    const nombre = document.getElementById('nombreModificar') || document.getElementById('nombre').value;
    const app = document.getElementById('appModificar') || document.getElementById('app').value;
    const apm = document.getElementById('appModificar') || document.getElementById('apm').value;
    const genero1 = document.getElementById('genero1Modificar') || document.getElementById('genero1').value;
    const genero2 = document.getElementById('genero2Modificar') || document.getElementById('genero2');
    const genero3 = document.getElementById('genero3Modificar') || document.getElementById('genero3');
    const fechaNacimiento = document.getElementById('fechaNacimientoModificar') || document.getElementById('fechaNacimiento').value;
    const rfc = document.getElementById('RFCModificar') || document.getElementById('RFC').value;
    const curp = document.getElementById('CURPModificar') || document.getElementById('CURP').value;
    const domicilio = document.getElementById('domicilioModificar') || document.getElementById('domicilio').value;
    const email  = document.getElementById('correoModificar') || document.getElementById('correo');
    const codigoPostal = document.getElementById('CPModificar') || document.getElementById('CP').value;
    const estado = document.getElementById('estadoModificar') || document.getElementById('estado').value;
    const ciudad = document.getElementById('ciudadModificar') || document.getElementById('ciudad').value;
    const telefono = document.getElementById('telefonoModificar') || document.getElementById('telefono').value;
    const puesto = document.getElementById('puestoModificar') || document.getElementById('puesto').value;
    const salario = document.getElementById('salarioModificar') || document.getElementById('salario').value;
    const fechaIngreso = document.getElementById('fechaIngresoModificar') || document.getElementById('fechaIngreso').value;
    const fotografia = document.getElementById("fotoModificar") || document.getElementById("foto").files[0];
    const fotografiaURL = fotografia ? URL.createObjectURL(fotografia) : '';
    
    const formularioEmpleado = document.getElementById('formularioEmpleado');
    if (formularioEmpleado) {
        formularioEmpleado.removeAttribute('data-id-empleado');
    }
}

  
  function seleccion(id) {
    let empleado = Empleados.find(emp => emp.id === id);


const genero = obtenerGenero(generoEmpleado);
if (genero === '0') {
    document.getElementById('genero1Modificar').checked = true;
} else if (genero === '1') {
    document.getElementById('genero2Modificar').checked = true;
} else if (genero === '2') {
    document.getElementById('genero3Modificar').checked = true;
}
    const nombre = document.getElementById('nombreModificar').value = empleado.nombre;
    const app = document.getElementById('appModificar').value = empleado.app;
    const apm = document.getElementById('appModificar').value = empleado .apm;
    document.getElementById('genero1Modificar').value = genero === '0' ? 'Masculino' : '';
    document.getElementById('genero2Modificar').value = genero === '1' ? 'Femenino' : '';
    document.getElementById('genero3Modificar').value = genero === '2' ? 'Otro' : '';
    const fechaNacimiento = document.getElementById('fechaNacimientoModificar').value = empleado.fechaNacimiento ;
    const rfc = document.getElementById('RFCModificar').value = empleado.rfc ;
    const curp = document.getElementById('CURPModificar').value = empleado.curp ;
    const domicilio = document.getElementById('domicilioModificar').value = `${empleado.direccion.calle} ${empleado.direccion.colonia} ${empleado.direccion.municipio} ${empleado.direccion.estado} ${empleado.direccion.codigoPostal}` || '';
    const email = document.getElementById('correoModificar').value = empleado.email;
    const codigoPostal = document.getElementById('CPModificar').value = empleado.direccion.codigoPostal ;
    const estado = document.getElementById('estadoModificar').value = empleado.direccion.estado ;
    const ciudad = document.getElementById('ciudadModificar').value = empleado.direccion.municipio;
    const telefono = document.getElementById('telefonoModificar').value = empleado.telefono ;
    const puesto = document.getElementById('puestoModificar').value = empleado.puesto ;
    const salario = document.getElementById('salarioModificar').value = empleado.salario ;
    const fechaIngreso = document.getElementById('fechaIngresoModificar').value = empleado.fechaIngreso ;
    const fotografia = document.getElementById("fotoModificar").files[0] = empleado.foto ? new File([empleado.foto], empleado.foto.split('/').pop()) : null;
    const fotografiaURL = empleado.foto ? URL.createObjectURL(fotografia) : ''; 
    

        seleccionarEmpleado = id; 
 
}
function modificar(id) {
    let empleado = Empleados.find(emp => emp.id === id);
    
   
    empleado.nombre = document.getElementById('nombreModificar').value;
    empleado.app = document.getElementById('appModificar').value;
    empleado.apm = document.getElementById('apmModificar').value;
    empleado.fechaNacimiento = document.getElementById('fechaNacimientoModificar').value;
    empleado.rfc = document.getElementById('RFCModificar').value;
    empleado.curp = document.getElementById('CURPModificar').value;
    empleado.domicilio = document.getElementById('domicilioModificar').value;
    empleado.email = document.getElementById('correoModificar').value;
    empleado.codigoPostal = document.getElementById('CPModificar').value;
    empleado.estado = document.getElementById('estadoModificar').value;
    empleado.ciudad = document.getElementById('ciudadModificar').value;
    empleado.telefono = document.getElementById('telefonoModificar').value;
    empleado.puesto = document.getElementById('puestoModificar').value;
    empleado.salario = parseFloat(document.getElementById('salarioModificar').value);
    empleado.fechaIngreso = document.getElementById('fechaIngresoModificar').value;
    empleado.fotografia = document.getElementById("fotoModificar").files[0] ? URL.createObjectURL(document.getElementById("fotoModificar").files[0]) : '';
    
  
    switch (document.querySelector('input[name="genero"]:checked').value) {
        case 'Masculino':
            empleado.genero = 'Masculino';
            break;
        case 'Femenino':
            empleado.genero = 'Femenino';
            break;
        case 'Otro':
            empleado.genero = 'Otro';
            break;

    }
    cargarEmpleados(); 
}


function modificarCarga(id) {
    const empleado = Empleados.find(emp => emp.id === id);

    // Función para convertir la fecha en formato dd/mm/yyyy a yyyy-mm-dd (para el campo de fecha en un input)
    function convertirFecha(fecha) {
        const [dia, mes, anio] = fecha.split('/'); // Separar el formato dd/mm/yyyy
        return `${anio}-${mes}-${dia}`; // Retornar el formato yyyy-mm-dd
    }

    // Asignación de los valores de los empleados a los campos del formulario
    document.getElementById('nombreModificar').value = empleado.nombre;
    document.getElementById('appModificar').value = empleado.app;
    document.getElementById('apmModificar').value = empleado.apm;
    
    // Asignar la fecha de nacimiento y fecha de ingreso correctamente
    document.getElementById('fechaNacimientoModificar').value = convertirFecha(empleado.fechaNacimiento);
    document.getElementById('RFCModificar').value = empleado.rfc;
    document.getElementById('estadoModificar').value = empleado.direccion.estado;
    document.getElementById('ciudadModificar').value = empleado.direccion.municipio;
    document.getElementById('CURPModificar').value = empleado.curp;
    document.getElementById('calleModificar').value = empleado.direccion.calle;
    document.getElementById('coloniaModificar').value = empleado.direccion.colonia;
    document.getElementById('correoModificar').value = empleado.email;
    document.getElementById('CPModificar').value = empleado.direccion.codigoPostal;
    document.getElementById('telefonoModificar').value = empleado.telefono;
    document.getElementById('puestoModificar').value = empleado.puesto;
    document.getElementById('salarioModificar').value = empleado.salario;

    // Convertir la fecha de ingreso a un formato compatible (yyyy-mm-dd)
    document.getElementById('fechaIngresoModificar').value = convertirFecha(empleado.fechaIngreso);

    // Si hay fotografía, la asignamos
    if (empleado.foto) { // Asegúrate de que la propiedad del foto es 'foto' y no 'fotografia'
        const imgElement = document.getElementById('fotoModificar');
        imgElement.src = empleado.foto;
    }

    // Asignación del género según el valor
    switch (empleado.genero) {
        case 'Masculino':
            document.getElementById('genero1Modificar').checked = true;
            break;
        case 'Femenino':
            document.getElementById('genero2Modificar').checked = true;
            break;
        case 'Otro':
            document.getElementById('genero3Modificar').checked = true;
            break;
    }

    const formulario = document.getElementById('formulariomodificar');
    formulario.setAttribute('data-id-empleado', empleado.id);

}

function guardarModificacion() {

    const formulario = document.getElementById('formulariomodificar');
    const id = parseInt(formulario.getAttribute('data-id-empleado')); // Convierte a número el id
    const empleado = Empleados.find(emp => emp.id === id); 

    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated'); // validacion de bootstrap
        return; 
      }
    // Si el empleado es encontrado, continúa con la modificación
    empleado.nombre = document.getElementById('nombreModificar').value;
    empleado.app = document.getElementById('appModificar').value;
    empleado.apm = document.getElementById('apmModificar').value;

    const fechaNacimiento = document.getElementById('fechaNacimientoModificar').value;
    const fechaFormateada = formatoFecha(new Date(fechaNacimiento)); // le da el formato
    empleado.fechaNacimiento = fechaFormateada;

    empleado.rfc = document.getElementById('RFCModificar').value;
    empleado.curp = document.getElementById('CURPModificar').value;
    empleado.direccion.calle = document.getElementById('calleModificar').value;
    empleado.direccion.colonia = document.getElementById('coloniaModificar').value;
    empleado.email = document.getElementById('correoModificar').value;
    empleado.direccion.codigoPostal = document.getElementById('CPModificar').value;
    empleado.direccion.estado = document.getElementById('estadoModificar').value;
    empleado.direccion.ciudad = document.getElementById('ciudadModificar').value;
    empleado.telefono = document.getElementById('telefonoModificar').value;
    empleado.puesto = document.getElementById('puestoModificar').value;
    empleado.salario = parseFloat(document.getElementById('salarioModificar').value);
    empleado.fechaIngreso = document.getElementById('fechaIngresoModificar').value;

    const genero = document.querySelector('input[name="genero"]:checked').value;
    empleado.genero = obtenerGenero(genero); 
    
    const foto = document.getElementById('fotoModificar');
    if (foto.files[0]) {
        empleado.foto = URL.createObjectURL(foto.files[0]);
    } else {
        empleado.foto = ''; 
    }
    
  
    const filaEmpleado = document.getElementById(`empleado-${empleado.id}`);
    if (filaEmpleado) {
        filaEmpleado.cells[0].innerHTML = `<img src="${empleado.foto}" class="tamañoImg">`;
      filaEmpleado.cells[1].textContent = `${empleado.nombre} ${empleado.app} ${empleado.apm}`;
      filaEmpleado.cells[2].textContent = empleado.fechaNacimiento;
      filaEmpleado.cells[3].querySelector('span').textContent = empleado.estatus === 1 ? 'Activo' : 'Inactivo'; 
      filaEmpleado.cells[3].querySelector('span').classList.remove('Activos', 'Inactivos');
      filaEmpleado.cells[3].querySelector('span').classList.add(empleado.estatus === 1 ? 'Activos' : 'Inactivos'); 
    }
  
    // Limpia el formulario
    formulario.reset();
  
    // Cierra el formulario
    const myModal = bootstrap.Modal.getInstance(document.getElementById('Modificar'));
    myModal.hide();
}



