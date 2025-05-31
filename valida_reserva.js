document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form_datos_reserva');
  const boton = document.getElementById('boton_reserva');

  // Eventos para campo Nombre
    document.getElementById('reserva_nombre').addEventListener('input', () => limpiarerror ('nombreError'));
    document.getElementById('reserva_nombre').addEventListener('blur', validarnombre);
    document.getElementById('reserva_apellido').addEventListener('input', () => limpiarerror('apellidoError'));
    document.getElementById('reserva_apellido').addEventListener('blur',validarapellido);
    document.getElementById('reserva_correo').addEventListener('input', () => limpiarerror ('emailError'));
    document.getElementById('reserva_correo').addEventListener('blur',validarmail);
    document.getElementById('reserva_telefono').addEventListener('input', () => limpiarerror('telefonoError'));
    document.getElementById('reserva_telefono').addEventListener('blur',validatelefono);

  // Evento click en botón Reservar
  boton.addEventListener('click', function (e) {
    e.preventDefault();

    const esNombreValido = validarnombre();
    const esApellidoValido = validarapellido();
    const esMailValido = validarmail();
    const esTelefonoValido = validatelefono();
    const esFechaIngresoValida = validarFechaIngreso();
    const esFechaEgresoValida = validarFechaEgreso();
    const esSeleccionHabitacionesValida = validarHabitaciones();

    if (esNombreValido && esApellidoValido && esMailValido && esTelefonoValido && esFechaIngresoValida && esFechaEgresoValida && esSeleccionHabitacionesValida) {
        form.reset();
      window.location.href ="mensaje_reserva.html";
    } else {
      alert("Hay errores en el formulario. Por favor, corríjalos.");
    }
  });
});

function limpiarerror(iderror) {
  const error = document.getElementById(iderror);
  if (error) {
    error.textContent = '';
  }
}

function mostrarError(idError, mensaje) {
  const error = document.getElementById(idError);
  if (error) error.textContent = mensaje;
}

function validarnombre() {
  const nombre = document.getElementById('reserva_nombre').value.trim();
  const error_texto = document.getElementById('nombreError');

  if (nombre === '') {
    error_texto.textContent = '❌ El campo no puede estar vacío.';
    return false;
  } else if (!/^[a-zA-Z-áéíóúÁÉÍÓÚ\s]+$/.test(nombre)) {
    error_texto.textContent = '❌ Solo se permiten letras y espacios.';
    return false;
  } else if (nombre.length < 3 || nombre.length > 30) {
    error_texto.textContent = '❌ Mínimo 3 caracteres, máximo 30 caracteres.';
    return false;
  } else {
    error_texto.textContent = '✅';
    return true;
  }
}
function validarapellido(){
    const apellido = document.getElementById('reserva_apellido').value.trim();
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
    const mail = document.getElementById('reserva_correo').value.trim();
    const error = document.getElementById('emailError');

    if (mail === '') {
        error.textContent = '❌ El campo no puede estar vacío';
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        error.textContent = '❌ Formato no válido. Ej: nombre@dominio.com';
        return false;
    } else {
        error.textContent = '✅';
        return true;
    }
}
function validatelefono() {
    const telefono = document.getElementById('reserva_telefono').value.trim();
    const error = document.getElementById('telefonoError');

    if (!/^[0-9]+$/.test(telefono)) {
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
function validarFechaIngreso() {
  const fechaInput = document.getElementById('fechaIngreso');
  const errorId = 'fechaError';
  const hoyStr = new Date().toISOString().split('T')[0];

  if (fechaInput.value < hoyStr) {
    mostrarError(errorId, '❌ La fecha no puede ser anterior a hoy.');
    return false;
  } else {
    mostrarError(errorId, '✅ Fecha válida');
    return true;
  }
}

function validarFechaEgreso() {
  const fechaInput = document.getElementById('fechaEgreso');
  const errorId = 'fechaErrorEgreso';

  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  const maxFecha = new Date(hoy);
  maxFecha.setDate(hoy.getDate() + 365);

  const valor = fechaInput.value;
  const mananaStr = manana.toISOString().split('T')[0];
  const maxFechaStr = maxFecha.toISOString().split('T')[0];

  if (valor < mananaStr || valor > maxFechaStr) {
    mostrarError(errorId, '❌ La fecha debe estar entre mañana y 365 días desde hoy.');
    return false;
  } else {
    mostrarError(errorId, '✅ Fecha válida');
    return true;
  }
}

function validarHabitaciones() {
  const tipos = ['deluxe', 'junior', 'executive'];
  let alMenosUnaCompleta = false;

  tipos.forEach(tipo => {
    const personas = document.getElementById(`personas_${tipo}`);
    const habitaciones = document.getElementById(`habitaciones_${tipo}`);
    const errorPersonas = document.getElementById(`personaError_${tipo}`);
    const errorHabitaciones = document.getElementById(`habitacionError_${tipo}`);

    // Limpiar errores previos
    errorPersonas.textContent = '';
    errorHabitaciones.textContent = '';

    const valorPersonas = personas.value;
    const valorHabitaciones = habitaciones.value;

    if (valorPersonas && valorHabitaciones) {
      alMenosUnaCompleta = true;
    } else if (valorPersonas || valorHabitaciones) {
      if (!valorPersonas) errorPersonas.textContent = '❌ Debe seleccionar una opción.';
      if (!valorHabitaciones) errorHabitaciones.textContent = '❌ Debe seleccionar una opción.';
    }
  });

  if (!alMenosUnaCompleta) {
    alert("Debe seleccionar personas y habitaciones en al menos una de las opciones disponibles.");
    return false;
  }

  return true;
}
