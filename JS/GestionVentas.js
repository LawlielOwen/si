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
document.addEventListener('DOMContentLoaded', validacion); //Carga la validacion en el DOM

  let ventas = [];
  let seleccionarVenta;
function cargarVentas() { //SE llama al JSON 
  fetch('JSON/Ventas.json')
    .then(response => response.json())
    .then(data => {
      ventas = data.ventas;
      const Ven = data.ventas;
      const cuerpoTabla = document.getElementById('cuerpoTabla');
      cuerpoTabla.innerHTML = '';
      Ven.forEach((venta) => {
        cuerpoTabla.innerHTML += `
                      <tr id="Ven-${venta.id_venta}">
                          <td>${venta.cliente}</td>
                          <td>${venta.fecha}</td>
                          <td>${venta.producto}</td>
                          <td>
                              <span class="${venta.status_venta === 1 ? 'Activos' : 'Inactivos'}">
                                  ${venta.status_venta === 1 ? 'Activo' : 'Inactivo'}
                              </span>
                          </td>
                          <td>
      <div class="btn-group">
  <button class="btn btn-dark dropdown-toggle text-light border-warning Opciones_boton" type="button" id="opcionesVenta${venta.id_venta}" data-bs-toggle="dropdown" aria-expanded="false">
    Opcion
  </button>
  <ul class="dropdown-menu menu_opciones text-light border-warning" aria-labelledby="opcionesVenta${venta.id_venta}">
    <li>
     <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${venta.id_venta})">
    <img src="Img/Iconos/Modificar.svg"> Modificar
</button>
    </li>
    <li>
      <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarVen(${venta.id_venta})">
        <img src="Img/Iconos/Borrar.svg"> Eliminar
      </button>
    </li>
    <li>
      <button class="dropdown-item btn text-light info_boton" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${venta.id_venta})">
        <img src="Img/Iconos/Estatus.svg"> Cambiar Estatus
      </button>
    </li>
  </ul>
</div>

<button class="btn  btn-dark text-light border-warning info_boton" data-bs-toggle="modal" data-bs-target="#Info"  data-id="${venta.id_venta}"onclick="mostrarInfoVen(${venta.id_venta})">
 <img src="Img/Iconos/Info.svg"> 
  Info
</button>
                          </td>
                      </tr>
                  `;
      });
      filtrarTabla('1');
    });
}
document.addEventListener('DOMContentLoaded', cargarVentas
); // Carga del json

function mostrarInfoVen(id_venta) { //Muestra el resto de la informacion en el modal
    const venta = ventas.find(vn => vn.id_venta === id_venta);
  
    const informacion = `
              <p><strong>Nombre del cliente:</strong> ${venta.cliente}</p>
              <p><strong>Fecha:</strong> ${venta.fecha}</p>
              <p><strong>Empleado que atendio:</strong> ${venta.empleado}</p>
              <p><strong>Productos:</strong> ${venta.producto}</p>
              <p><strong>Cantidad:</strong> ${venta.cantidad}</p>
              <p><strong>Precio unitario:</strong> ${venta.precio_unitario}</p>
              <p><strong>Precio total:</strong> ${venta.total}</p>
              <p><strong>Estatus:</strong> ${venta.status_venta === 1 ? 'Activo' : 'Inactivo'}</p>
          `;
    document.querySelector('#informacion').innerHTML = informacion;
  
  }

  function buscarVen() {//Busqueda en el modulo
    const query = document.querySelector(".buscar_ven").value.toLowerCase().trim(); 
    const filas = document.querySelectorAll("tbody tr"); 

    filas.forEach(fila => {
        const nombreCompleto = fila.cells[0]?.innerText.toLowerCase() || ""; 
        const estado = fila.style.display !== "none";

        if (nombreCompleto.includes(query)) {
            fila.style.display = ""; // 
        } else {
            fila.style.display = "none"; 
        }
    });
}
function abrirCambiarEstatus(id_venta) {
  // Aseguramos que el ID de venta está siendo asignado correctamente
  const botonConfirmar = document.querySelector('.confirmarEliminar');
  if (botonConfirmar) {
      botonConfirmar.setAttribute('data-id', id_venta);
  }
}

function hacerCambio() {
  const botonConfirmar = document.querySelector('.confirmarEliminar');
  const id_venta = botonConfirmar.getAttribute('data-id');
  const idVenInt = parseInt(id_venta);
  const venta = ventas.find(vn => vn.id_venta === idVenInt);
  venta.status_venta = venta.status_venta === 1 ? 0 : 1;
  const filaVenta = document.getElementById(`Ven-${venta.id_venta}`);
  const celdaEstatus = filaVenta.querySelector('td:nth-child(4) span');
  celdaEstatus.textContent = venta.status_venta === 1 ? 'Activo' : 'Inactivo';

  celdaEstatus.classList.remove('Activos', 'Inactivos');
  celdaEstatus.classList.add(venta.status_venta === 1 ? 'Activos' : 'Inactivos');

  const myModal = bootstrap.Modal.getInstance(document.getElementById('Cambio'));
  myModal.hide();
}

function abrirEliminarVen(id_venta) {
  const venta = ventas.find(vn => vn.id_venta === id_venta);
  if (venta) {
      const confirmarBtn = document.querySelector('#confirmarEliminar');
      if (confirmarBtn) {
          confirmarBtn.onclick = () => {
              eliminarVen(id_venta);
          };
      }
  }
}

function eliminarVen(id_venta) {
  ventas = ventas.filter(vn => vn.id_venta !== id_venta);
  const fila = document.getElementById(`Ven-${id_venta}`);
  if (fila) {
      fila.remove();
  }

  const modal = document.getElementById('Eliminar');
  const modalInstance = bootstrap.Modal.getInstance(modal);
  if (modalInstance) {
      modalInstance.hide();
  }
}

  document.getElementById('formularioVenta').addEventListener('submit', function (event) {
    event.preventDefault();  //Carga el formulario para agregar la venta // <--- esto evita que se recarge la pagina y se deshaga todo al darle en agregar
    agregarVenta(); 
  });
  
  function abrirAgregarVenta() {
    document.querySelector('#formularioVenta').reset();
    document.querySelector('#formularioVenta').onsubmit = (e) => {
        e.preventDefault();
        agregarVenta();
    };
  }
  
  function agregarVenta() {
    const formulario = document.getElementById('formularioVenta');
    if (!formulario.checkValidity()) {
      formulario.classList.add('was-validated');
      return;
    }
  
    const nombre = document.getElementById('nombre').value;
    const fecha = document.getElementById('fecha').value;
    const productos = document.getElementById('productos').value;
    const empleado = document.getElementById('empleado').value;
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const fechaHoraFormateada = fecha.replace('T', ' ');
  
    const precioTotal = precioUnitario * cantidad;
    const nuevaVenta = {
      id_venta: ventas.length > 0 ? ventas[ventas.length - 1].id_venta + 1 : 1,
      cliente: nombre,
      fecha: fechaHoraFormateada,
      empleado: empleado,
      producto: productos,
      cantidad: cantidad,
      precio_unitario: precioUnitario,
      total: precioTotal,
      status_venta: 1
    };
  
    // Agregar la nueva venta al array de ventas
    ventas.push(nuevaVenta);
  
    // Crear una fila en la tabla para la nueva venta
    const fila = document.createElement('tr');
    fila.id = `Ven-${nuevaVenta.id_venta}`;
  
    // Crear y agregar las celdas
    const tdNombreCliente = document.createElement('td');
    tdNombreCliente.textContent = nombre;
    fila.appendChild(tdNombreCliente);
  
    const tdFechaHora = document.createElement('td');
    tdFechaHora.textContent = fechaHoraFormateada;
    fila.appendChild(tdFechaHora);
  
    const tdProductos = document.createElement('td');
    tdProductos.textContent = productos;
    fila.appendChild(tdProductos);
  
    const tdEstatus = document.createElement('td');
    const spanEstatus = document.createElement('span');
    spanEstatus.classList.add(nuevaVenta.status_venta === 1 ? 'Activos' : 'Inactivos');
    spanEstatus.textContent = nuevaVenta.status_venta === 1 ? 'Activo' : 'Inactivo';
    tdEstatus.appendChild(spanEstatus);
    fila.appendChild(tdEstatus);
  
    const tdAcciones = document.createElement('td');
    tdAcciones.innerHTML = `
    <div class="btn-group">
  <button class="btn btn-dark dropdown-toggle text-light border-warning Opciones_boton" type="button" id="opcionesVen${nuevaVenta.id_venta}" data-bs-toggle="dropdown" aria-expanded="false">
  Opcion
  </button>
  <ul class="dropdown-menu menu_opciones text-light border-warning" aria-labelledby="opcionesVen${nuevaVenta.id_venta}">
  <li>
  <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${nuevaVenta.id_venta})">
  <img src="Img/Iconos/Modificar.svg"> Modificar
  </button>
  
  </li>
  <li>
  <button class="dropdown-item btn text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarVen(${nuevaVenta.id_venta})">
    <img src="Img/Iconos/Borrar.svg"> Eliminar
  </button>
  </li>
  <li>
  <button class="dropdown-item btn text-light info_boton" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${nuevaVenta.id_venta})">
    <img src="Img/Iconos/Estatus.svg"> Cambiar Estatus
  </button>
  </li>
  </ul>
  </div>
  
  <button class="btn  btn-dark text-light border-warning info_boton" data-bs-toggle="modal" data-bs-target="#Info"  data-id="${nuevaVenta.id_venta}"onclick="mostrarInfoVen(${nuevaVenta.id_venta})">
  <img src="Img/Iconos/Info.svg"  class="info_icono">
  Info
  </button>
  `;
    fila.appendChild(tdAcciones);
  
    // Agregar la fila a la tabla
    document.getElementById('cuerpoTabla').appendChild(fila);
  
    // Limpiar el formulario y cerrar el modal
    formulario.reset();
    const myModal = bootstrap.Modal.getInstance(document.getElementById('agregarVenta'));
    myModal.hide();
  }
  
  //Funciones como hide lo que hacen es cerrar el modal de bootstrap
 

  function clear() {
    const nombre = document.getElementById('nombreModificar') || document.getElementById('nombre');
    const fecha = document.getElementById('fechaModificar') || document.getElementById('fecha');
    const productos = document.getElementById('productosModificar') || document.getElementById('productos');
    const empleado = document.getElementById('empleadoModificar') || document.getElementById('empleado');
    const precioUnitario = document.getElementById('precioUnitarioModificar') || document.getElementById('precioUnitario');
    const cantidad = document.getElementById('cantidadModificar') || document.getElementById('cantidad');


    const formularioVenta = document.getElementById('formularioVenta');
    if (formularioVenta) {
        formularioVenta.removeAttribute('data-id-venta');
    }
}

  
  function seleccion(id_venta) {

    let venta = ventas.find(v => v.id_venta === id_venta);

        document.getElementById('nombreModificar').value = venta.cliente;
        document.getElementById('fechaModificar').value = venta.fecha;
        document.getElementById('productosModificar').value = venta.producto;
        document.getElementById('empleadoModificar').value = venta.empleado;
        document.getElementById('precioUnitarioModificar').value = parseFloat(venta.precio_unitario);
        document.getElementById('cantidadModificar').value = parseInt(venta.cantidad, 10);

        seleccionarVenta = id_venta; 
 
}
function modificar(ventas) {
  let venta = ventas.find(v => v.id_venta === seleccionarVenta);


      venta.cliente = document.getElementById('nombreModificar').value;
      venta.fecha = document.getElementById('fechaModificar').value;
      venta.producto = document.getElementById('productosModificar').value;
      venta.empleado = document.getElementById('empleadoModificar').value;
      venta.precio_unitario = parseFloat(document.getElementById('precioUnitarioModificar').value);
      venta.cantidad = parseInt(document.getElementById('cantidadModificar').value, 10);
      cargarVentas(); 
      clear(); // Limpia el formulario

}


function modificarCarga(id_venta) {
  const venta = ventas.find(v => v.id_venta === id_venta);


  // Carga los valores que se quieren modificar
  document.getElementById('nombreModificar').value = venta.cliente;
  document.getElementById('fechaModificar').value = venta.fecha;
  document.getElementById('productosModificar').value = venta.producto;
  document.getElementById('empleadoModificar').value = venta.empleado;
  document.getElementById('precioUnitarioModificar').value = venta.precio_unitario;
  document.getElementById('cantidadModificar').value = venta.cantidad;
 
  const formulario = document.getElementById('modificarVenta');
  formulario.setAttribute('data-id-venta', id_venta); //con el set se da un nuevo valor a la venta
}


function guardarModificacion() {
  const formulario = document.getElementById('modificarVenta');
  const id_venta = formulario.getAttribute('data-id-venta'); //con el get se llama al valor ya modificado

  let venta = ventas.find(v => v.id_venta === parseInt(id_venta, 10));
 
  if (!formulario.checkValidity()) {
    formulario.classList.add('was-validated'); // validacion de bootstrap
    return; 
  }

  // Actualiza los valores
  venta.cliente = document.getElementById('nombreModificar').value;
  venta.fecha = document.getElementById('fechaModificar').value;
  venta.producto = document.getElementById('productosModificar').value;
  venta.empleado = document.getElementById('empleadoModificar').value;
  venta.precio_unitario = parseFloat(document.getElementById('precioUnitarioModificar').value);
  venta.cantidad = parseInt(document.getElementById('cantidadModificar').value, 10);
  const fecha = document.getElementById('fechaModificar').value;
  const fechaHoraFormateada = fecha.replace('T', ' ');
  const precioUnitario = parseFloat(document.getElementById('precioUnitarioModificar').value);
  const cantidad = parseInt(document.getElementById('cantidadModificar').value, 10);
  const precioTotal = precioUnitario * cantidad;
  venta.total = precioTotal;
 
  // Actualiza cada celda de la fila 
  const filaVenta = document.getElementById(`Ven-${venta.id_venta}`);
  if (filaVenta) {
    filaVenta.cells[0].textContent = venta.cliente; 
    filaVenta.cells[1].textContent = fechaHoraFormateada;   
    filaVenta.cells[2].textContent = venta.producto; 
    filaVenta.cells[3].querySelector('span').textContent = venta.status_venta === 1 ? 'Activo' : 'Inactivo'; 
    filaVenta.cells[3].querySelector('span').classList.remove('Activos', 'Inactivos');
    filaVenta.cells[3].querySelector('span').classList.add(venta.status_venta === 1 ? 'Activos' : 'Inactivos'); 
  }

  // Limpia el formulario
  formulario.reset();
  
  // Cierra el formulario
  const myModal = bootstrap.Modal.getInstance(document.getElementById('Modificar'));
  myModal.hide();
}



