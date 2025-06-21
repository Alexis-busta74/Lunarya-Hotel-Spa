document.getElementById('nombre').addEventListener('input', () => limpiarerror ('nombreError'));
document.getElementById('nombre').addEventListener('blur',validarnombre);
document.getElementById('apellido').addEventListener('input', () => limpiarerror('apellidoError'));
document.getElementById('apellido').addEventListener('blur',validarapellido);
document.getElementById('email').addEventListener('input', () => limpiarerror ('emailError'));
document.getElementById('email').addEventListener('blur',validarmail);
document.getElementById('telefono').addEventListener('input', () => limpiarerror('telefonoError'));
document.getElementById('telefono').addEventListener('blur',validatelefono);
document.getElementById('mensaje').addEventListener('input', () => limpiarerror('mensajeError'));
document.getElementById('mensaje').addEventListener('blur',validamensajetexto);

//limpiar error//
function limpiarerror(iderror){
    const error = document.getElementById(iderror);
    if(error){
        error.textContent = '';
    }
}

function validarnombre(){
    const nombre = document.getElementById('nombre').value.trim();
    const error_texto = document.getElementById('nombreError');
    if (nombre === ''){
        error_texto.textContent = '❌ El campo no puede estar vacío. ';
        return false;
    } else if (!/^[a-zA-Z-áéíóúÁÉÍÓÚ\s]+$/.test(nombre)){
        error_texto.textContent = '❌ Solo se permiten letras y espacios.';
        return false;
    } else if (nombre.length < 3 || nombre.length > 30){
        error_texto.textContent = '❌ Minimo 3 caracteres, maximo 30 caracteres.';
        return false;
    } else {
        error_texto.textContent = '✅';  
        return true;
    }
}
function validarapellido() {
    const apellido = document.getElementById('apellido').value.trim();
    const error_texto = document.getElementById('apellidoError');

    if (apellido === '') {
        error_texto.textContent = '❌ El campo no puede estar vacío.';
        return false;
    } else if (!/^[a-zA-Z-áéíóúÁÉÍÓÚ\s]+$/.test(apellido)) {
        error_texto.textContent = '❌ Solo se permiten letras y espacios.';
        return false;
    } else if (apellido.length < 2 || apellido.length > 30) {
        error_texto.textContent = '❌ Mínimo 2 caracteres, máximo 30 caracteres.';
        return false;
    } else {
        error_texto.textContent = '✅';
        return true;
    }
}
function validarmail(){
    const mail = document.getElementById('email').value.trim();
    const error = document.getElementById('emailError');

    if (mail === ''){
        error.textContent = '❌ El campo no puede estar vacío';
         return false;
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){
        error.textContent = '❌ Formato no válido. Ej: nombre@dominio.com';
        return false;
    } else {
        error.textContent = '✅';
       return true;
    }
}

function validatelefono() {
    const telefono = document.getElementById('telefono').value.trim();
    const error = document.getElementById('telefonoError');

    if (telefono === '') {
        error.textContent = '❌ El campo no puede estar vacío.';
        return false;
    } else if (!/^[0-9]+$/.test(telefono)) {
        error.textContent = '❌ Solo se permiten números.';
        return false;
    } else if (telefono.length < 10 || telefono.length > 15) {
        error.textContent = '❌ Número inválido. Mínimo 10 dígitos, máximo 15.';
        return false;
    } else {
        error.textContent = '✅';
        return true;
    }
}

function validamensajetexto(){
    const mensaje = document.getElementById('mensaje').value.trim();
    const error = document.getElementById('mensajeError');

    if(mensaje.length < 20) {
        error.textContent = '❌ El mensaje debe tener al menos 20 caracteres.';
        return false;
    } else if(mensaje.length > 300){
        error.textContent = '❌ Llego al maximo de caracteres.';
        return false;
    }
    else {
        error.textContent = '✅';
        return true;
    }
}

document.addEventListener('DOMContentLoaded', function () {
  const boton = document.getElementById('boton');
  const form = document.getElementById('formulario_contacto');

  boton.addEventListener('click', function(e) {
    e.preventDefault();

    // Ejecutar funciones de validación
    validarnombre();
    validarapellido();
    validarmail();
    validatelefono();
    validamensajetexto();
  

    // Verificar errores
    const errores = document.querySelectorAll('div[id$="Error"]');
    let hayErrores = false;

    errores.forEach(error => {
      if (error.textContent.includes('❌') || error.textContent === '') {
        hayErrores = true;
      }
    });

   if (!hayErrores) {
  const datos = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    mensaje: document.getElementById('mensaje').value,
  };

  fetch('http://127.0.0.1:5000/api/contacto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(response => {
    if (response.ok) {
        form.reset();
      window.location.href = "/gracias";
    } else {
      alert("Hubo un error al enviar el formulario.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("No se pudo conectar con el servidor.");
  });

  
}
  });
});
