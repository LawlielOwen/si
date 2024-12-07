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