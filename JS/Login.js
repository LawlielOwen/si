fetch('JSON/Credenciales.json')
    .then(response => response.json())
    .then(data => {
        const nombreUsuarioInput = document.getElementById('name');
        const contraseñaInput = document.getElementById('contraseña');
        const usuarioError = document.getElementById('usuarioError');
        const contraseñaError = document.getElementById('contraseñaError');
        const loginButton = document.getElementById('loginButton');

       //quita los errores
        function limpiarErrores(input, errorLabel) {
            input.classList.remove('input_Error');
            errorLabel.textContent = '';
        }

        // limpia los input al ingresar cualquie rvalor
        nombreUsuarioInput.addEventListener('input', () => limpiarErrores(nombreUsuarioInput, usuarioError));
        contraseñaInput.addEventListener('input', () => limpiarErrores(contraseñaInput, contraseñaError));

        // Evento global para la tecla Enter
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
               //Con dar enter acciona el boton de ingresar
                event.preventDefault();
                loginButton.click(); 
            }
        });

       // al dar click de forma normal al boton se envia
        loginButton.addEventListener('click', function (event) {
            const nombreUsuario = nombreUsuarioInput.value;
            const contraseña = contraseñaInput.value;

            //quita los errores
            limpiarErrores(nombreUsuarioInput, usuarioError);
            limpiarErrores(contraseñaInput, contraseñaError);

            let usuarioValido = false;
            let contraseñaValida = false;

            // Valida la contra y usuario mediante el json
            data.credenciales.forEach(credencial => {
                if (nombreUsuario === credencial.usuario) {
                    usuarioValido = true;
                    if (contraseña === credencial.contraseña) {
                        contraseñaValida = true;
                        // Dependiendo de que usuario sea lo envia asu apartado
                        if (credencial.usuario === 'Administrador') {
                            window.location.href = 'GestionEmpleados.html';
                        } else if (credencial.usuario === 'Empleado') {
                            window.location.href = 'VentasEmpleado.html';
                        }
                    }
                }
            });

         //Toda la aplicacion de los errores ya sea si la contra es incorrecta o el nombre esta mal o deja vacio el input
            if (!usuarioValido) {
                if (nombreUsuario === '') {
                    usuarioError.textContent = 'Ingresa un nombre de usuario';
                } else {
                    usuarioError.textContent = 'Usuario incorrecto';
                }
                nombreUsuarioInput.classList.add('input_Error');
            }

            if (!contraseñaValida) {
                if (contraseña === '') {
                    contraseñaError.textContent = 'Ingresa una contraseña';
                } else {
                    contraseñaError.textContent = 'Contraseña incorrecta';
                }
                contraseñaInput.classList.add('input_Error');
            }

            if (!usuarioValido || !contraseñaValida) {
                event.preventDefault();
            }
        });
    });
