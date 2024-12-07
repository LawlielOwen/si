

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
document.addEventListener('DOMContentLoaded', validacion); //carga la validacion de bootstrap

let productos = [];
let seleccionarPro;
function cargarProductos() {//Carga el JSON
  fetch('JSON/Productos.json')
    .then(response => response.json())
    .then(data => {
      productos = data.productos;
      const Pro = data.productos;
      const cuerpoTabla = document.getElementById('cuerpoTabla');
      cuerpoTabla.innerHTML = '';
      Pro.forEach((Pro) => {
        cuerpoTabla.innerHTML += `
                      <tr id="Pro-${Pro.id_producto}">
                          <td><img src="${Pro.foto_producto}"  class="tamañoImg"></td>
                          <td>${Pro.nombre_producto}</td>
                          <td>${Pro.marca_producto}</td>
                          <td>
                              <span class="${Pro.status_producto === 1 ? 'Activos' : 'Inactivos'}">
                                  ${Pro.status_producto === 1 ? 'Activo' : 'Inactivo'}
                              </span>
                          </td>
                          <td>
                             <div class="btn-group">
  <button type="button" class="btn dropdown-toggle  btn-dark  text-light border-warning Opciones_boton" data-bs-toggle="dropdown" aria-expanded="false">
  Opcion
  </button>
  <ul class="dropdown-menu  menu_opciones text-light border-warning">
    <li>
      <button class="btn dropdown-item  text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${Pro.id_producto})">
        <img src="Img/Iconos/Modificar.svg" alt="Modificar Icono" class="me-2"> Modificar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item  text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarPro(${Pro.id_producto})">
        <img src="Img/Iconos/Borrar.svg" alt="Eliminar Icono" class="me-2"> Eliminar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item  text-light" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${Pro.id_producto})">
        <img src="Img/Iconos/Estatus.svg" alt="Cambiar Estatus Icono" class="me-2"> Cambiar Estatus
      </button>
    </li>

  </ul>
</div>

<button class="btn  btn-dark text-light border-warning info_boton" data-bs-toggle="modal" data-bs-target="#Info"  data-id="${Pro.id_producto}"onclick="mostrarInfoPro(${Pro.id_producto})">
  <img src="Img/Iconos/Info.svg"  class="info_icono">
  Info
</button>
                          </td>
                      </tr>
                  `;
      });
      filtrarTabla('1');
    });
}
document.addEventListener('DOMContentLoaded', cargarProductos);//Carga del json en el DOM
function mostrarInfoPro(id_producto) { //Carga de los datos en el modal de info
  const Pro = productos.find(pr => pr.id_producto === id_producto);

  const informacion = `
            <p><strong>Nombre:</strong> ${Pro.nombre_producto}</p>
            <p><strong>Descripcion:</strong> ${Pro.desc_producto}</p>
            <p><strong>Marca:</strong> ${Pro.marca_producto}</p>
            <p><strong>Lanzamiento:</strong> ${Pro.lanza_producto}</p>
            <p><strong>Genero:</strong> ${Pro.genero_producto}</p>
            <p><strong>Stock:</strong> ${Pro.stock_producto}</p>
            <p><strong>Precio de inventario:</strong> ${Pro.precio_inv_producto}</p>
            <p><strong>Precio sugerido:</strong> ${Pro.precio_sug_producto}</p>
            <p><strong>Departamento:</strong> ${Pro.depart_producto}</p>
            <p><strong>Codigo:</strong> ${Pro.codigo_producto}</p>
            <p><strong>Estatus:</strong> ${Pro.status_producto === 1 ? 'Activo' : 'Inactivo'}</p>
        `;
  document.querySelector('#informacion').innerHTML = informacion;

}

function buscarPro() {//Busqueda de producto
  const query = document.querySelector(".buscar_pro").value.toLowerCase();
  const filas = document.querySelectorAll("tbody tr");
  filas.forEach(fila => {

    const estadoPro = fila.style.display !== "none";
    const nombreCompleto = fila.cells[1].innerText.toLowerCase();
    if (nombreCompleto.includes(query)) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  });
}
function abrirCambiarEstatus(id_producto) { //preparacion del cambio de estatus
  const botonConfirmar = document.querySelector('.confirmarEliminar');
  botonConfirmar.setAttribute('data-id', id_producto);
}

function hacerCambio() {//cambio del estatus
  const botonConfirmar = document.querySelector('.confirmarEliminar');
  const id_producto = botonConfirmar.getAttribute('data-id');

  const idPro = parseInt(id_producto);
  const Pro = productos.find(pr => pr.id_producto === idPro);
  Pro.status_producto = Pro.status_producto === 1 ? 0 : 1;
  const filaPro = document.getElementById(`Pro-${Pro.id_producto}`);
  const celdaEstatus = filaPro.querySelector('td:nth-child(4) span');
  celdaEstatus.textContent = Pro.status_producto === 1 ? 'Activo' : 'Inactivo';
  celdaEstatus.classList.remove('Activos', 'Inactivos');
  celdaEstatus.classList.add(Pro.status_producto === 1 ? 'Activos' : 'Inactivos');
  const myModal = bootstrap.Modal.getInstance(document.getElementById('Cambio'));
  myModal.hide();
}
function abrirEliminarPro(id_producto) {// preparacion de la eliminacion
  const producto = productos.find(pr => pr.id_producto === id_producto);
  if (producto) {
    document.querySelector('#confirmarEliminar').onclick = () => {
      eliminarPro(id_producto);
    };
  }
}

function eliminarPro(id_producto) {// eliminacion de la fila
  productos = productos.filter(pr => pr.id_producto !== id_producto);
  const fila = document.getElementById(`Pro-${id_producto}`);
  if (fila) {
    fila.remove();
  }

  const modal = document.getElementById('Eliminar');
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}
document.getElementById('formularioProducto').addEventListener('submit', function (event) {
  event.preventDefault(); // <--- esto evita que se recarge la pagina y se deshaga todo al darle en agregar
  agregarProducto();
}); //carga de la funcion agregar con un evento en la pagina

function abrirAgregarProducto() { //carga de la funcion agregar
  document.querySelector('#formularioProducto').reset();
  document.querySelector('#formularioProducto').onsubmit = (e) => {
    e.preventDefault();
    agregarProducto();
  };
}

function agregarProducto() { //agregar nuevo producto
  const formulario = document.getElementById('formularioProducto');
  if (!formulario.checkValidity()) {
    formulario.classList.add('was-validated'); // validacion de bootstrap
    return; 
  }
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('Descripcion').value;
  const añoLanzamiento = document.getElementById('Año de lanzamiento').value;
  const marca = document.getElementById('Marca').value;
  const presentacion = document.getElementById('Presentación').value;
  const genero = document.getElementById('Género').value;
  const departamento = document.getElementById('Departamento').value;
  const precioInventario = document.getElementById('Precioinventario').value;
  const cantidad = document.getElementById('Cantidad').value;
  const precioSugerido = document.getElementById('Preciosugerido').value;
  const fotografia = document.getElementById('fotografia').files[0];
  const fotografiaURL = fotografia ? URL.createObjectURL(fotografia) : ''; //convertir la fotografia a una URL para que logre cargar 
  const codigoBarras = document.getElementById('Códigobarras').value;

  const nuevoProducto = {
    id_producto: productos.length + 1,
    nombre_producto: nombre,
    desc_producto: descripcion,
    lanza_producto: añoLanzamiento,
    marca_producto: marca,
    genero_producto: genero,
    depart_producto: departamento,
    precio_inv_producto: precioInventario, //carga de datos en el modal de info
    stock_producto: cantidad,
    precio_sug_producto: precioSugerido,
    foto_producto: fotografiaURL,
    codigo_producto: codigoBarras,
    status_producto: 1
  };

  productos.push(nuevoProducto);  //envio de datos al array

  const fila = document.createElement('tr');
  fila.id = `Pro-${nuevoProducto.id_producto}`;

  const tdFoto = document.createElement('td');
  const img = document.createElement('img');
  img.src = nuevoProducto.foto_producto;
  img.classList.add('tamañoImg');
  tdFoto.appendChild(img);
  fila.appendChild(tdFoto); //creacion de celdas y asicnacion de clases para que tomen las especifiaciones del css

  const tdNombre = document.createElement('td');
  tdNombre.textContent = nuevoProducto.nombre_producto;
  fila.appendChild(tdNombre);

  const tdMarca = document.createElement('td');
  tdMarca.textContent = nuevoProducto.marca_producto;
  fila.appendChild(tdMarca);

  const tdEstatus = document.createElement('td');
  const estatusSpan = document.createElement('span');
  estatusSpan.classList.add(nuevoProducto.status_producto === 1 ? 'Activos' : 'Inactivos');
  estatusSpan.textContent = nuevoProducto.status_producto === 1 ? 'Activo' : 'Inactivo'; // otorga las clases de activo o inativo
  tdEstatus.appendChild(estatusSpan);
  tdEstatus.appendChild(estatusSpan);
  fila.appendChild(tdEstatus);
  const tdAcciones = document.createElement('td'); //inyeccion de los botones y iconos (se inyectan directamente los iconos)
  tdAcciones.innerHTML = ` 
   <div class="btn-group">
  <button type="button" class="btn dropdown-toggle btn-dark text-light border-warning Opciones_boton" data-bs-toggle="dropdown" aria-expanded="false">
    Opcion
  </button>
  <ul class="dropdown-menu menu_opciones text-light border-warning">
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Modificar" onclick="modificarCarga(${nuevoProducto.id_producto})">
        <img src="Img/Iconos/Modificar.svg" alt="Modificar Icono" class="me-2"> Modificar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Eliminar" onclick="abrirEliminarPro(${nuevoProducto.id_producto})">
        <img src="Img/Iconos/Borrar.svg" alt="Eliminar Icono" class="me-2"> Eliminar
      </button>
    </li>
    <li>
      <button class="btn dropdown-item text-light" data-bs-toggle="modal" data-bs-target="#Cambio" onclick="abrirCambiarEstatus(${nuevoProducto.id_producto})">
        <img src="Img/Iconos/Estatus.svg" alt="Cambiar Estatus Icono" class="me-2"> Cambiar Estatus
      </button>
    </li>
    <li>
      <button class="btn dropdown-item  text-light" data-bs-toggle="modal" data-bs-target="#Reporte">
        <img src="Img/Iconos/Reporte.svg" alt="Reporte Icono" class="me-2"> Reporte
      </button>
    </li>
  </ul>
</div>

    <button class="btn  btn-dark text-light border-warning info_boton" data-bs-toggle="modal" data-bs-target="#Info"  data-id="${nuevoProducto.id_producto}"onclick="mostrarInfoPro(${nuevoProducto.id_producto})">
    <img src="Img/Iconos/Info.svg"  class="info_icono">
  Info
</button>
  `;

  fila.appendChild(tdAcciones);
  document.getElementById('cuerpoTabla').appendChild(fila);
  mostrarInfoPro(nuevoProducto.id_producto); //se carga el resto de la info en el modal de info
  document.getElementById('formularioProducto').reset(); // se limpia el formulario
  const myModal = bootstrap.Modal.getInstance(document.getElementById('agregarProducto'));
  myModal.hide();// cierra el formulario
}
//Funciones como hide lo que hacen es cerrar el modal de bootstrap
function clear() {
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('Descripcion').value;
  const añoLanzamiento = document.getElementById('Año de lanzamiento').value;
  const marca = document.getElementById('Marca').value;
  const presentacion = document.getElementById('Presentación').value;
  const genero = document.getElementById('Género').value;
  const departamento = document.getElementById('Departamento').value;
  const precioInventario = document.getElementById('Precioinventario').value;
  const cantidad = document.getElementById('Cantidad').value;
  const precioSugerido = document.getElementById('Preciosugerido').value;
  const codigoBarras = document.getElementById('Códigobarras').value;
  const fotografia = document.getElementById("fotoModificar") || document.getElementById("foto").files[0];
  const fotografiaURL = fotografia ? URL.createObjectURL(fotografia) : '';
 

  const formularioProducto = document.getElementById('formularioProducto');
  if (formularioProducto) {
    formularioProducto.removeAttribute('data-id-producto');
  }
}

function seleccion(id_producto) {
  const Pro = productos.find(pr => pr.id_producto === id_producto);

  document.getElementById('nombreModificar').value = Pro.nombre_producto;
  document.getElementById('DescripcionModificar').value = Pro.desc_producto;
  document.getElementById('AñodelanzamientoModificar').value = Pro.marca_producto;
  document.getElementById('MarcaModificar').value = Pro.lanza_producto;
  document.getElementById('GéneroModificar').value = Pro.genero_producto;
  document.getElementById('CantidadModificar').value = Pro.stock_producto;
  document.getElementById('DepartamentoModificar').value = Pro.depart_producto;
  document.getElementById('PrecioinventarioModificar').value = Pro.precio_inv_producto;
  document.getElementById('PreciosugeridoModificar').value = Pro.precio_sug_producto;
  document.getElementById('CódigobarrasModificar').value = Pro.codigo_producto;
  document.getElementById('fotografiaModificar').files[0] = Pro.foto_producto ? new File([Pro.foto_producto], Pro.foto.split('/').pop()) : null;

  seleccionarPro = id_producto;
}

function modificar(id_producto) {
  const Pro = productos.find(pr => pr.id_producto === seleccionarPro);

  Pro.nombre_producto = document.getElementById('nombreModificar').value;
  Pro.desc_producto = document.getElementById('DescripcionModificar').value;
  Pro.lanza_producto = document.getElementById('AñodelanzamientoModificar').value;
  Pro.marca_producto = document.getElementById('MarcaModificar').value;
  Pro.genero_producto = document.getElementById('PresentaciónModificar').value;
  Pro.genero_producto = document.getElementById('GéneroModificar').value;
  Pro.stock_producto = document.getElementById('CantidadModificar').value;
  Pro.depart_producto = document.getElementById('DepartamentoModificar').value;
  Pro.precio_inv_producto = document.getElementById('PrecioinventarioModificar').value;
  Pro.precio_sug_producto = document.getElementById('PreciosugeridoModificar').value;
  Pro.codigo_producto = document.getElementById('CódigobarrasModificar').value;
  Pro.foto_producto = document.getElementById("fotografiaModificar").files[0] ? URL.createObjectURL(document.getElementById("fotoModificar").files[0]) : '';


  cargarProductos();
  clear();
}
function modificarCarga(id_producto) {
  const producto = productos.find(prod => prod.id_producto === id_producto);


  // Asignar los valores de los productos a los campos del formulario
  document.getElementById('nombreModificar').value = producto.nombre_producto;
  document.getElementById('DescripcionModificar').value = producto.desc_producto;
  document.getElementById('AñodelanzamientoModificar').value = producto.lanza_producto;
  document.getElementById('MarcaModificar').value = producto.marca_producto;
  document.getElementById('PresentaciónModificar').value = producto.marca_producto;  // Si existe esta propiedad
  document.getElementById('GéneroModificar').value = producto.genero_producto;
  document.getElementById('DepartamentoModificar').value = producto.depart_producto;
  document.getElementById('PrecioinventarioModificar').value = producto.precio_inv_producto;
  document.getElementById('CantidadModificar').value = producto.stock_producto;
  document.getElementById('PreciosugeridoModificar').value = producto.precio_sug_producto;
  document.getElementById('CódigobarrasModificar').value = producto.codigo_producto;

  // Si el producto tiene una foto, la asignamos al campo correspondiente
  if (producto.foto_producto) { 
      const imgElement = document.getElementById('fotografiaModificar');
      imgElement.src = producto.foto_producto; // Asegúrate de que el campo 'foto_producto' contiene la URL de la imagen
  }

  // Asignar el ID del producto al formulario para realizar modificaciones específicas después
  const formulario = document.getElementById('formularioMod');
  formulario.setAttribute('data-id-producto', producto.id_producto);
}


function guardarModificacion() {
  const formulario = document.getElementById('formularioMod'); 
  const id_producto = parseInt(formulario.getAttribute('data-id-producto'));
  const producto = productos.find(prod => prod.id_producto === id_producto);

  if (!formulario.checkValidity()) {
    formulario.classList.add('was-validated'); // validacion de bootstrap
    return; 
  }


  producto.nombre_producto = document.getElementById('nombreModificar').value;
  producto.desc_producto = document.getElementById('DescripcionModificar').value;
  producto.lanza_producto = document.getElementById('AñodelanzamientoModificar').value;
  producto.marca_producto = document.getElementById('MarcaModificar').value;
  producto.genero_producto = document.getElementById('PresentaciónModificar').value;
  producto.genero_producto = document.getElementById('GéneroModificar').value;
  producto.stock_producto = document.getElementById('CantidadModificar').value;
  producto.depart_producto = document.getElementById('DepartamentoModificar').value;
  producto.precio_inv_producto = document.getElementById('PrecioinventarioModificar').value;
  producto.precio_sug_producto = document.getElementById('PreciosugeridoModificar').value;
  producto.codigo_producto = document.getElementById('CódigobarrasModificar').value;
  const foto = document.getElementById('fotografiaModificar');
    if (foto.files[0]) {
      producto.foto_producto = URL.createObjectURL(foto.files[0]);
    } else {
      producto.foto_producto = ''; 
    }
  const filaPro = document.getElementById(`Pro-${producto.id_producto}`);

  if(filaPro){
    filaPro.cells[0].innerHTML = `<img src="${producto.foto_producto}" class="tamañoImg">`;
    filaPro.cells[1].textContent = producto.nombre_producto;   
    filaPro.cells[2].textContent = producto.marca_producto; 
    filaPro.cells[3].querySelector('span').textContent = producto.status_producto === 1 ? 'Activo' : 'Inactivo'; 
    filaPro.cells[3].querySelector('span').classList.remove('Activos', 'Inactivos');
    filaPro.cells[3].querySelector('span').classList.add(producto.status_producto === 1 ? 'Activos' : 'Inactivos');

  }
 
  formulario.reset();
  // Cerrar el modal
  const modalModificar = bootstrap.Modal.getInstance(document.getElementById('Modificar'));
  modalModificar.hide();


}

// esta seccion es para la generacion del pdf
document.addEventListener('DOMContentLoaded', () => {
  const GenerarPDF = document.getElementById('generarReporte');

  GenerarPDF.addEventListener('click', () => {
    const { jsPDF } = window.jspdf; // Llama a las librerías
    const doc = new jsPDF();

    // Título del PDF
    doc.setFont('Arial', 'bold');
    doc.setFontSize(20);
    doc.text('Reporte de Productos', 70, 20); // Centra el título
   
    doc.setDrawColor(240, 180, 75);
    doc.setLineWidth(1);
    doc.line(10, 25, 200, 25);

    if (productos.length > 0) {
      const titulos = [ 'Nombre','Descripcion','Marca','Cantidad de producto'];
      const filas = productos.map((producto) => [
        producto.nombre_producto,
        producto.desc_producto,
        producto.marca_producto,
        producto.stock_producto,
      ]);

     //Lo que hace esto es crear la tabla
      doc.autoTable({
        startY: 30, //define la distancia ente el titulo y la tabla
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


    // Descargar el PDF
    doc.save('ReporteProductos.pdf');
  });
});

