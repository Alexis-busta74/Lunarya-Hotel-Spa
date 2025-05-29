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
    }else if (!/^[a-zA-Z-áéíóúÁÉÍÓÚ\s]+$/.test(nombre)){
        error_texto.textContent = '❌ Solo se permiten letras y espacios.';
    }else if (nombre.length < 3 || nombre.length > 30){
        error_texto.textContent = '❌ Minimo 3 caracteres, maximo 30 caracteres.'
    }
    else{
        error_texto.textContent = '✅';  
    }
}

function validarapellido(){
    const apellido = document.getElementById('apellido').value.trim();
    const error_texto = document.getElementById('apellidoError');
    if (apellido === ''){
        error_texto.textContent = '❌ El campo no puede estar vacío. ';
    }else if (!/^[a-zA-Z-áéíóúÁÉÍÓÚ\s]+$/.test(apellido)){
        error_texto.textContent = '❌ Solo se permiten letras y espacios.';
    }else if (apellido.length < 2 || apellido.length > 30){
        error_texto.textContent = '❌ Minimo 2 caracteres, maximo 30 caracteres.'
    }
    else{
        error_texto.textContent = '✅';  
    }
}

function validarmail(){
    const mail = document.getElementById('email').value.trim();
    const error = document.getElementById('emailError');

    if (mail === ''){
        error.textContent = '❌ El campo no puede estar vacío';
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){
        error.textContent = '❌ Formato no válido. Ej: nombre@dominio.com';
    } else {
        error.textContent = '✅';
    }
}

function validatelefono() {
    const telefono = document.getElementById('telefono').value.trim();
    const error = document.getElementById('telefonoError');

    if (telefono === '') {
        error.textContent = '';
        return;
    }

    if(!/^[0-9]+$/.test(telefono)){
        error.textContent = '❌ Solo se permiten números.';
    } else if(telefono.length < 10 || telefono.length > 15 ) {
        error.textContent = '❌ Número inválido. Mínimo 10 dígitos, maximo 15.';
    } else {
        error.textContent = '✅';
    }
}

function validarFechaIngreso() {
  const fechaInput = document.getElementById('fechaIngreso');
  const error = document.getElementById('fechaError');

  const hoy = new Date();
  const hoyStr = hoy.toISOString().split('T')[0];
  const seleccionadaStr = fechaInput.value;
  
  if (seleccionadaStr < hoyStr) {
    error.textContent = '❌ La fecha no puede ser anterior a hoy.';
  } else {
    error.textContent = '✅ Fecha válida';
  }
}

function validarFechaEgreso() {
  const fechaInput = document.getElementById('fechaEgreso');
  const error = document.getElementById('fechaErroregreso');

  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const maxFecha = new Date(hoy);
  maxFecha.setDate(hoy.getDate() + 365);

  // Formateo a yyyy-mm-dd
  const formatFecha = (date) => date.toISOString().split('T')[0];
  const mananaStr = formatFecha(manana);
  const maxFechaStr = formatFecha(maxFecha);

  const valor = fechaInput.value;

  if (valor < mananaStr || valor > maxFechaStr) {
    error.textContent = '❌ La fecha debe estar entre mañana y 365 días desde hoy.';
  } else {
    error.textContent = '✅ Fecha válida';
  }
}
function validarHabitacion() {
  const habitacionSelect = document.getElementById('habitacion');
  const error = document.getElementById('habitacionError');

    if (habitacionSelect.value === "") {
      error.textContent = '❌ Debe seleccionar una opción.';
    } else {
      error.textContent = '✅ Opción válida';
    }
}

function validarhuesped() {
  const huespedSelect = document.getElementById('huesped');
  const error = document.getElementById('huespedError');
    if (huespedSelect.value === "") {
      error.textContent = '❌ Debe seleccionar una opción.';
    } else {
      error.textContent = '✅ Opción válida';
    }
}

function validamensajetexto(){
    const mensaje = document.getElementById('mensaje').value.trim();
    const error = document.getElementById('mensajeError');

    if(mensaje === ''){
        error.textContent = '';
        return;
    }
    
    if(mensaje.length < 20) {
        error.textContent = '❌ El mensaje debe tener al menos 20 caracteres.';
    } else if(mensaje.length > 300){
        error.textContent = '❌ Llego al maximo de caracteres.';
    }
    else {
        error.textContent = '✅';
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
    validarHabitacion();
    validarhuesped(); 
    validatelefono();
    validamensajetexto();
    validarFechaEgreso();
    validarFechaIngreso();

    // Verificar errores
    const errores = document.querySelectorAll('.error-text');
    let hayErrores = false;

    errores.forEach(error => {
      if (error.textContent.includes('❌') || error.textContent === '') {
        hayErrores = true;
      }
    });

    if (!hayErrores) {
     window.location.href = "gracias.html";
      form.reset();
    } else {
      alert("Hay errores en el formulario. Por favor, corregilos.");
    }
  });
});