

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
  
  