

let pedidos = [];
function cargarPedidos() { // carga del JSON de pedidos
  fetch('JSON/Pedidos.json')
    .then(response => response.json())
    .then(data => {
      pedidos = data.pedidos;
      const Ped = data.pedidos;
      const cuerpoTabla = document.getElementById('cuerpoTabla');
      cuerpoTabla.innerHTML = '';
      Ped.forEach((Ped) => {
        cuerpoTabla.innerHTML += `
          <tr id="Ped-${Ped.id_pedido}">
            <td>${Ped.producto_pedido}</td>
            <td>${Ped.cant_prod_pedido}</td>
            <td>${Ped.total_p_pedido}</td>
            <td>
              <span class="${Ped.estatus_pedido === 1 ? 'Activos' : Ped.estatus_pedido === 2 ? 'Pendiente' : 'Inactivos'}">
    ${Ped.estatus_pedido === 1 ? 'Atendido' : Ped.estatus_pedido === 2 ? 'Pendiente' : 'Cancelado'} </span>
            </td>
            <td>
              <div class="btn-group">
  <button type="button" class="btn dropdown-toggle btn-dark text-light border-warning Opciones_boton" data-bs-toggle="dropdown" aria-expanded="false">
    Opción
  </button>
  <ul class="dropdown-menu menu_opciones text-light border-warning">
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${Ped.id_pedido})">
        <img src="Img/Iconos/Modificar.svg" alt="Modificar Icono" class="me-2"> Modificar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarPed(${Ped.id_pedido})">
        <img src="Img/Iconos/Borrar.svg" alt="Eliminar Icono" class="me-2"> Eliminar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${Ped.id_pedido})">
        <img src="Img/Iconos/Estatus.svg" alt="Cambiar Estatus Icono" class="me-2"> Cambiar Estatus
      </button>
    </li>
  </ul>
</div>

              <button class="btn  btn-dark text-light border-warning info_boton" data-bs-toggle="modal" data-bs-target="#Info"  data-id="${Ped.id_pedido}"onclick="mostrarInfoPe(${Ped.id_pedido})">
 <img src="Img/Iconos/Info.svg"  class="info_icono">
  Info
</button>
            </td>
          </tr>
        `;
      });
      filtrarTablaPedido('1');
    })
}

document.addEventListener('DOMContentLoaded', cargarPedidos);
function mostrarInfoPe(id_pedido) {//carga de la info en el modal
  const Ped = pedidos.find(pd => pd.id_pedido === id_pedido);

  const informacion = `
            <p><strong>Inventario:</strong> ${Ped.pedido_inventario}</p>
            <p><strong>Fecha:</strong> ${Ped.fecha_pedido}</p>
            <p><strong>Productos:</strong> ${Ped.producto_pedido}</p>
            <p><strong>Cantidad vendida:</strong> ${Ped.cant_vendida_pedido}</p>
            <p><strong>Precio por unidad:</strong> ${Ped.pu_pedido}</p>
            <p><strong>Total del pedido:</strong> ${Ped.total_pedido}</p>
            <p><strong>Iva de pedido:</strong> ${Ped.iva_pedido}</p>
            <p><strong>Cantidad de producto:</strong> ${Ped.cant_prod_pedido}</p>
            <p><strong>Stock del pedido:</strong> ${Ped.stock_pedido}</p>
            <p><strong>Precio total:</strong> ${Ped.total_p_pedido}</p>
           <p><strong>Estatus:</strong> 
  ${Ped.estatus_pedido === 1 ? 'Atendido' : Ped.estatus_pedido === 2 ? 'Pendiente' : 'Cancelado'}
</p>
        `;
  document.querySelector('#informacion').innerHTML = informacion;

}

function abrirEliminarPed(id_pedido) { //prepracion de la eliminacion
  const pedido = pedidos.find(pd => pd.id_pedido === id_pedido); 
  if (pedido) {
    document.querySelector('#confirmarEliminar').onclick = () => {
      eliminarPed(id_pedido);
    };
  }
}

function buscarPedido() { 
  const busqueda = document.querySelector(".buscar_pedido").value.toLowerCase();  //toma el id del input de busqueda
  const filas = document.querySelectorAll("tbody tr"); // buscara entre el cuerpo de la tabla
  filas.forEach(fila => {
    const celdas = fila.getElementsByTagName('td'); 
    let mostrarFila = false;
    
  //mediante un for reocrre toda las celdas para ver que coincide con la busqueda 
    for (let i = 0; i < celdas.length; i++) {
      const textoCelda = celdas[i]?.innerText.toLowerCase() || "";  //obitene el texto de cada celda 
      if (textoCelda.includes(busqueda)) {
        mostrarFila = true;   // al coincidir una fila mostrara la fila 
        break; 
      }
    }
    
    if (mostrarFila) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  });
}

function eliminarPed(id_pedido) {// eliminacion de pedidos
  pedidos = pedidos.filter(pd => pd.id_pedido !== id_pedido);
  const fila = document.getElementById(`Ped-${id_pedido}`);
  if (fila) {
    fila.remove();
  }

  const modal = document.getElementById('Eliminar');
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}
function abrirCambiarEstatus(id_pedido) { // preparacion para modificar el estatus
  const botonConfirmar = document.querySelector('.confirmarEliminar');
  botonConfirmar.setAttribute('data-id', id_pedido);
}
function hacerCambio() { // Cambio en el estatus
  const botonConfirmar = document.querySelector('.confirmarEliminar');
  const id_pedido = botonConfirmar.getAttribute('data-id');

  const idPed = parseInt(id_pedido);
  const Ped = pedidos.find(pd => pd.id_pedido === idPed);

  // Cambia el estatus entre cancelado(0) , atendido (1) y  pendiente(2)
  if (Ped.estatus_pedido === 0) {
    Ped.estatus_pedido = 1; 
  } else if (Ped.estatus_pedido === 1) {
    Ped.estatus_pedido = 2;
  } else {
    Ped.estatus_pedido = 0;  
  }

  const filaPed = document.getElementById(`Ped-${Ped.id_pedido}`);
  const celdaEstatus = filaPed.querySelector('td:nth-child(4) span');


  if (Ped.estatus_pedido === 1) {
    celdaEstatus.textContent = 'Atendido';
    celdaEstatus.classList.remove('Pendiente', 'Inactivos');
    celdaEstatus.classList.add('Activos');
  } else if (Ped.estatus_pedido === 2) {
    celdaEstatus.textContent = 'Pendiente';
    celdaEstatus.classList.remove('Activos', 'Inactivos');
    celdaEstatus.classList.add('Pendiente');
  } else {
    celdaEstatus.textContent = 'Cancelado';
    celdaEstatus.classList.remove('Activos', 'Pendiente');
    celdaEstatus.classList.add('Inactivos');
  }

  // Cierra el modal despues del cambio
  const myModal = bootstrap.Modal.getInstance(document.getElementById('Cambio'));
  myModal.hide();
}

document.getElementById('formularioPedido').addEventListener('submit', function (event) { 
  event.preventDefault(); // <--- esto evita que se recarge la pagina y se deshaga todo al darle en agregar
  agregarPedido();

});
function abrirAgregarPedido() { //prepara el agregar el pedido
  document.querySelector('#formularioPedido').reset();
  document.querySelector('#formularioPedido').onsubmit = (e) => {
      e.preventDefault();
      agregarPedido();
  };
}
function agregarPedido() {
  const formulario = document.getElementById('formularioPedido');
  if (!formulario.checkValidity()) {
      formulario.classList.add('was-validated'); // validacion de bootstrap
      return; // No continuar si no es válido
  }
  const producto = document.getElementById('producto').value || '';
  const cantidadVendida = parseFloat(document.getElementById('cantidadVendida').value) || 0;
  const precioPedido = parseFloat(document.getElementById('precioPedido').value) || 0;
  const IVA = parseFloat(document.getElementById('IVA').value) || 0;
  const inv = document.getElementById('inv') ? document.getElementById('inv').value : '';
  const cantidadPro = parseFloat(document.getElementById('cantidadPro').value) || 0;
  const stock = parseFloat(document.getElementById('Stock').value) || 0;
  const fecha = document.getElementById('fecha').value || '';
  const fechaHoraFormateada = fecha.replace('T', ' ');


  const totalPedido = parseFloat(cantidadVendida * cantidadPro); // Total antes de IVA
  const iva = totalPedido * (16 / 100); // IVA calculado
  const precioTotal = totalPedido + iva;
  


  cantidadPro
  const nuevoPedido = {
    id_pedido:  pedidos.length > 0 ? pedidos[pedidos.length - 1].id_pedido + 1 : 1,
   pedido_inventario: inv,
    fecha_pedido: fechaHoraFormateada,
      producto_pedido: producto,
      cant_vendida_pedido: cantidadVendida,
      pu_pedido: precioPedido,
      total_pedido: totalPedido,
      iva_pedido:IVA,  //Agrega la info al array
      cant_prod_pedido: cantidadPro,
      stock_pedido: stock,
      total_p_pedido: precioTotal,
    estatus_pedido: 2
  };

  pedidos.push(nuevoPedido);

  const fila = document.createElement('tr');
  fila.id = `Ped-${nuevoPedido.id_pedido}`;

  const tdProducto = document.createElement('td');
  tdProducto.textContent = producto;
  fila.appendChild(tdProducto);

  const tdCantidadVendida = document.createElement('td');
  tdCantidadVendida.textContent = cantidadVendida;  //creacion de las celdas de la tabla
  fila.appendChild(tdCantidadVendida);

  const tdTotalPedido = document.createElement('td');
  tdTotalPedido.textContent = precioTotal;
  fila.appendChild(tdTotalPedido);

  const tdEstatus = document.createElement('td');
    const spanEstatus = document.createElement('span');
    spanEstatus.classList.add(nuevoPedido.estatus_pedido === 0 ? 'Inactivos' : (nuevoPedido.estatus_pedido === 1 ? 'Activos' : 'Pendiente'));
    spanEstatus.textContent = nuevoPedido.estatus_pedido === 0 ? 'Cancelado' : (nuevoPedido.estatus_pedido === 1 ? 'Atendido' : 'Pendiente');
    tdEstatus.appendChild(spanEstatus);
    fila.appendChild(tdEstatus);

  const tdAcciones = document.createElement('td'); //inyeccion de botones de acciones
  tdAcciones.innerHTML = `<div class="btn-group">
  <button type="button" class="btn dropdown-toggle btn-dark text-light border-warning Opciones_boton" data-bs-toggle="dropdown" aria-expanded="false">
    Opción
  </button>
  <ul class="dropdown-menu menu_opciones text-light border-warning">
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${nuevoPedido.id_pedido})">
        <img src="Img/Iconos/Modificar.svg" alt="Modificar Icono" class="me-2"> Modificar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarPed(${nuevoPedido.id_pedido})">
        <img src="Img/Iconos/Borrar.svg" alt="Eliminar Icono" class="me-2"> Eliminar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${nuevoPedido.id_pedido})">
        <img src="Img/Iconos/Estatus.svg" alt="Cambiar Estatus Icono" class="me-2"> Cambiar Estatus
      </button>
    </li>
  </ul>
</div>

    <button class="btn  btn-dark text-light border-warning" data-bs-toggle="modal" data-bs-target="#Info"  data-id="${nuevoPedido.id_pedido}"onclick="mostrarInfoPe(${nuevoPedido.id_pedido})">    
     <img src="Img/Iconos/Info.svg"  class="info_icono">
    Info
  </button>`;
  
  fila.appendChild(tdAcciones);
  document.getElementById('cuerpoTabla').appendChild(fila);
  mostrarInfoPe(nuevoPedido.id_pedido); //envia toda la info al modal de info
  const myModal = bootstrap.Modal.getInstance(document.getElementById('agregarPedido'));
  myModal.hide();
  document.getElementById('formularioPedido').reset();
}
function clear() {
  const producto = document.getElementById('productoModificar') || document.getElementById('producto');
  const cantidadVendida = document.getElementById('cantidadVendidaModificar') || document.getElementById('cantidadVendida');
  const precioPedido = document.getElementById('precioPedidoModificar') || document.getElementById('precioPedido');
  const IVA = document.getElementById('IVAModificar') || document.getElementById('IVA');
  const inventario = document.getElementById('invModificar') || document.getElementById('inventario');
  const cantidadProducto = document.getElementById('cantidadProModificar') || document.getElementById('cantidadProducto');
  const stockPedido = document.getElementById('StockModificar') || document.getElementById('stock');
  const fecha = document.getElementById('fechaModificar') || document.getElementById('fecha');
 

  const formularioPedido = document.getElementById('formularioPedido');
  if (formularioPedido) {
    formularioPedido.removeAttribute('data-id-pedido');
  }
}

function seleccion(id_pedido) {
  const pedido = pedidos.find(p => p.id_pedido === id_pedido);

  document.getElementById('productoModificar').value = pedido.producto_pedido;
  document.getElementById('cantidadVendidaModificar').value = pedido.cant_prod_pedido;
  document.getElementById('precioPedidoModificar').value = pedido.pu_pedido;
  document.getElementById('IVAModificar').value = pedido.iva_pedido;
  document.getElementById('invModificar').value = pedido.pedido_inventario;
  document.getElementById('cantidadProModificar').value = pedido.cantidad_producto;
  document.getElementById('StockModificar').value = pedido.stock_pedido;
  document.getElementById('fechaModificar').value = pedido.fecha_pedido;
  

  seleccionarPedido = id_pedido;
}

function modificar(pedidos) {
  const pedido = pedidos.find(p => p.id_pedido === seleccionarPedido);

  pedido.producto_pedido = document.getElementById('productoModificar').value;
  pedido.cant_prod_pedido = parseInt(document.getElementById('cantidadVendidaModificar').value, 10);
  pedido.pu_pedido = parseFloat(document.getElementById('precioPedidoModificar').value);
  pedido.iva_pedido = parseFloat(document.getElementById('IVAModificar').value);  
  pedido.inventario = document.getElementById('invModificar').value; 
  pedido.cantidad_producto = parseInt(document.getElementById('cantidadProModificar').value, 10);
  pedido.stock_pedido = parseInt(document.getElementById('StockModificar').value, 10);
  pedido.fecha_pedido = document.getElementById('fechaModificar').value;


  cargarPedidos();
  clear();
}
function modificarCarga(id_pedido) {
  const pedido = pedidos.find(p => p.id_pedido === id_pedido);

  // Si no encuentra el pedido, no hacer nada

  document.getElementById('productoModificar').value = pedido.producto_pedido;
  document.getElementById('cantidadVendidaModificar').value = pedido.cant_vendida_pedido;
  document.getElementById('precioPedidoModificar').value = pedido.pu_pedido;
  document.getElementById('IVAModificar').value = pedido.iva_pedido;
  document.getElementById('invModificar').value = pedido.pedido_inventario;  //Precarga los datos del id del pedido que se modificara
  document.getElementById('cantidadProModificar').value = pedido.cant_prod_pedido; //llama a los id del formlario
  document.getElementById('StockModificar').value = pedido.stock_pedido;
  document.getElementById('fechaModificar').value = pedido.fecha_pedido;

  const formulario = document.getElementById('formularioPedidoMod');
  formulario.setAttribute('data-id-pedido', id_pedido);  //toma el id del pedido que se vaya a modficiar
}

function guardarModificacion() {
  const formulario = document.getElementById('formularioPedidoMod');
  const id_pedido = parseInt(formulario.getAttribute('data-id-pedido'));  //usando el id otorga el nuevo atributo
  const pedido = pedidos.find(p => p.id_pedido === parseInt(id_pedido, 10));
  if (!formulario.checkValidity()) {
    formulario.classList.add('was-validated'); // validacion de bootstrap
    return; 
  }


  // Actualizar los datos del pedido con los valores del formulario
  pedido.producto_pedido = document.getElementById('productoModificar').value;
  pedido.cant_vendida_pedido = parseInt(document.getElementById('cantidadVendidaModificar').value);
  pedido.pu_pedido = parseFloat(document.getElementById('precioPedidoModificar').value);
  pedido.iva_pedido = parseFloat(document.getElementById('IVAModificar').value);
  pedido.pedido_inventario = document.getElementById('invModificar').value;
  pedido.cant_prod_pedido = parseInt(document.getElementById('cantidadProModificar').value);
  pedido.stock_pedido = parseInt(document.getElementById('StockModificar').value);
 const fecha = document.getElementById('fechaModificar').value;

  const fechaHoraFormateada = fecha.replace('T', ' ');


  const totalPedido = pedido.cant_vendida_pedido * pedido.pu_pedido; // Total antes de IVA
  const iva = totalPedido * (16 / 100); // IVA calculado
  const precioTotal = totalPedido + iva;
  const precioFormato = precioTotal;
  const filaPedido = document.getElementById(`Ped-${pedido.id_pedido}`);

  if(filaPedido){
    filaPedido.cells[0].textContent = pedido.producto_pedido; 
    filaPedido.cells[1].textContent = pedido.cant_prod_pedido;   
    filaPedido.cells[2].textContent = precioFormato; 
    filaPedido.cells[3].querySelector('span').textContent = 
    pedido.estatus_pedido === 1 ? 'Atendido' : 
    pedido.estatus_pedido === 2 ? 'Pendiente' : 
    'Cancelado'; 
    filaPedido.cells[3].querySelector('span').classList.remove('Activos', 'Pendiente', 'Inactivos');
    filaPedido.cells[3].querySelector('span').classList.add(
      pedido.estatus_pedido === 1 ? 'Activos' : 
      pedido.estatus_pedido === 2 ? 'Pendiente' : 
    'Inactivos'
);
  }
 
  formulario.reset();
  // Cerrar el modal
  const modalModificar = bootstrap.Modal.getInstance(document.getElementById('Modificar'));
  modalModificar.hide();


}


//Funciones como hide lo que hacen es cerrar el modal de bootstrap

document.addEventListener('DOMContentLoaded', () => {
  const GenerarPDF = document.getElementById('generarReporte');

  GenerarPDF.addEventListener('click', () => {
    const { jsPDF } = window.jspdf; // Llama a las librerías
    const doc = new jsPDF(); //Crea el [df]

    // Título del PDF
    doc.setFont('Arial', 'bold');
    doc.setFontSize(20);
    doc.text('Reporte de Pedidos', 70, 20); // Centra el título
   
    doc.setDrawColor(240, 180, 75); //Crea la linea usando rgb para darle el color
    doc.setLineWidth(1);  //define el ancho de la linea
    doc.line(10, 25, 200, 25); 

    pedidos.sort((a,b) => {
      const fecha1 = new Date(a.fecha_pedido); // esto lo que hace es acomodar los pediidos de forma descendente
      const fecha2 = new Date(b.fecha_pedido);
      return fecha2 - fecha1;
    })

    if (pedidos.length > 0) {
      const titulos = [ 'id','Fecha','Productos'];  // aqui se definen tus titulos
      const filas = pedidos.map((pedido) => [ //el mp hace la funcion del forEach para llamar al JSON
        pedido.id_pedido, 
        pedido.fecha_pedido,   //Vas llamando a los atributos de json
        pedido.producto_pedido,
      ]);
      const titulos2 = [ 'id','Cantidad vendida','Precio unitario','Subtotal','IVA','Total'];
      const filas2 = pedidos.map((pedido) => [
        pedido.id_pedido,
        pedido.cant_vendida_pedido,
        pedido.pu_pedido,
        pedido.total_pedido,
        pedido.iva_pedido,
        pedido.total_p_pedido,
      ]);
     //Lo que hace esto es crear la tabla
      doc.autoTable({
        startY: 30, //define la distancia ente el titulo y la tabla
        head: [titulos2],
        body: filas2,  //llama a tu constante de filas
        theme: 'grid',  //le da un tema a la tabla
        headStyles: {
          fillColor: [240, 180, 75], //color del titulo
          textColor: [0, 0, 0],
          fontSize: 12,
          halign: 'center', //Diposicion del texto
        },
        bodyStyles: {
          fontSize: 10,
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], //alterna el color de la tabla
        },
        tableLineWidth: 0.5,
        tableLineColor: [200, 200, 200],  //colorea el borde de la abla
      });

      const finalY = doc.lastAutoTable.finalY + 10; //Define cona la posicion Y que tan separado estara de la primera tabla
      
      doc.autoTable({
        startY: finalY, //define la distancia ente el titulo y la tabla
        head: [titulos],
        body: filas,
        theme: 'grid',
        headStyles: {
          fillColor: [240, 180, 75], //color del titulo
          textColor: [0, 0, 0],
          fontSize: 12,
          halign: 'center', //Diposicion del texto
        },
        bodyStyles: {
          fontSize: 10,
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], //alterna el color de la tabla
        },
        tableLineWidth: 0.5,
        tableLineColor: [200, 200, 200], 
      });


    }


    // Descarga el pdf y se asigna que titulo quieres que tenga
    doc.save('ReportePedidos.pdf');
  });
});
