
"use strict";

/* =====================================================
   CONECTAVOLUNTARIADO CR
   MÓDULO: GESTIÓN DE INSCRIPCIONES
   Archivo: inscripcion.js
   ===================================================== */


/* =====================================================
   01. CONFIGURACIÓN DEL MÓDULO
   ===================================================== */

const RUTA_ACTIVIDADES = "data/actividades.json";

const LONGITUD_MINIMA_NOMBRE = 3;
const LONGITUD_MINIMA_MOTIVACION = 20;
const LONGITUD_TELEFONO = 8;


/* =====================================================
   02. REFERENCIAS A LOS ELEMENTOS HTML
   ===================================================== */

const formulario = document.getElementById("formInscripcion");

const campoNombre = document.getElementById("nombre");
const campoCorreo = document.getElementById("correo");
const campoTelefono = document.getElementById("telefono");
const campoActividad = document.getElementById("actividadSelect");
const campoMotivacion = document.getElementById("motivacion");
const campoConfirmacion = document.getElementById("confirmacion");

const botonEnviar = document.getElementById("btnEnviar");


/* =====================================================
   03. INICIALIZACIÓN
   ===================================================== */

document.addEventListener("DOMContentLoaded", iniciarInscripcion);

async function iniciarInscripcion() {

    if (!formulario) {
        console.error("No se encontró el formulario de inscripción.");
        return;
    }

    await cargarActividadesDisponibles();

    formulario.addEventListener("submit", gestionarInscripcion);

}


/* =====================================================
   04. OBTENER ACTIVIDADES DESDE JSON
   ===================================================== */

async function cargarActividadesDisponibles() {

    try {

        const respuesta = await fetch(RUTA_ACTIVIDADES);

        if (!respuesta.ok) {
            throw new Error("No fue posible cargar las actividades.");
        }

        const actividades = await respuesta.json();

        if (!Array.isArray(actividades)) {
            throw new Error("El archivo JSON no contiene una lista válida.");
        }

        const actividadesDisponibles = actividades.filter(
            actividad => Number(actividad.cuposDisponibles) > 0
        );

        mostrarActividadesEnSelect(actividadesDisponibles);

    } catch (error) {

        console.error("Error al obtener las actividades:", error);

        campoActividad.innerHTML = `
            <option value="">
                Error al cargar las actividades
            </option>
        `;

        mostrarAlerta(
            "Error de carga",
            "No fue posible obtener las actividades. Inténtalo nuevamente.",
            "error"
        );

    }

}


/* =====================================================
   05. MOSTRAR ACTIVIDADES EN EL SELECT
   ===================================================== */

function mostrarActividadesEnSelect(actividades) {

    campoActividad.innerHTML = `
        <option value="">Selecciona una actividad</option>
    `;

    if (actividades.length === 0) {

        campoActividad.innerHTML = `
            <option value="">No hay actividades disponibles</option>
        `;

        return;
    }

    actividades.forEach(actividad => {

        const opcion = document.createElement("option");

        // Se utiliza el título real del JSON.
        opcion.textContent =
            `${actividad.titulo} — ${actividad.cuposDisponibles} cupos`;

        // Se conserva el ID de la actividad.
        opcion.value = actividad.id;

        campoActividad.appendChild(opcion);

    });

}


/* =====================================================
   06. VALIDAR INFORMACIÓN DEL PARTICIPANTE
   ===================================================== */

function validarInscripcion() {

    const nombre = campoNombre.value.trim();
    const correo = campoCorreo.value.trim();
    const telefono = campoTelefono.value.trim();
    const motivacion = campoMotivacion.value.trim();


    // Validación del nombre.
    if (nombre.length < LONGITUD_MINIMA_NOMBRE) {

        return {
            valido: false,
            mensaje: "Ingresa tu nombre completo.",
            campo: campoNombre
        };

    }


    // Validación del correo.
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!formatoCorreo.test(correo)) {

        return {
            valido: false,
            mensaje: "Ingresa un correo electrónico válido.",
            campo: campoCorreo
        };

    }


    // Validación del teléfono.
    const formatoTelefono = /^\d{8}$/;

    if (!formatoTelefono.test(telefono)) {

        return {
            valido: false,
            mensaje: "El teléfono debe contener exactamente 8 dígitos.",
            campo: campoTelefono
        };

    }


    // Validación de actividad.
    if (!campoActividad.value) {

        return {
            valido: false,
            mensaje: "Selecciona una actividad de voluntariado.",
            campo: campoActividad
        };

    }


    // Validación de motivación.
    if (motivacion.length < LONGITUD_MINIMA_MOTIVACION) {

        return {
            valido: false,
            mensaje: "La motivación debe contener al menos 20 caracteres.",
            campo: campoMotivacion
        };

    }


    // Validación de confirmación.
    if (!campoConfirmacion.checked) {

        return {
            valido: false,
            mensaje: "Debes confirmar que tus datos son correctos.",
            campo: campoConfirmacion
        };

    }


    return {
        valido: true,
        mensaje: "Información validada correctamente.",
        campo: null
    };

}


/* =====================================================
   07. CONSTRUIR OBJETO DE INSCRIPCIÓN
   ===================================================== */

function construirDatosInscripcion() {

    return {

        nombre: campoNombre.value.trim(),

        correo: campoCorreo.value.trim(),

        telefono: campoTelefono.value.trim(),

        actividadId: Number(campoActividad.value),

        motivacion: campoMotivacion.value.trim(),

        fechaSolicitud: new Date().toISOString()

    };

}


/* =====================================================
   08. PROCESAR ENVÍO DEL FORMULARIO
   ===================================================== */

async function gestionarInscripcion(evento) {

    evento.preventDefault();

    const resultadoValidacion = validarInscripcion();

    if (!resultadoValidacion.valido) {

        await mostrarAlerta(
            "Revisa tu información",
            resultadoValidacion.mensaje,
            "warning"
        );

        resultadoValidacion.campo.focus();

        return;
    }


    const datosInscripcion = construirDatosInscripcion();

    cambiarEstadoBoton(true);

    try {

        // Demostración del procesamiento en frontend.
        console.log("Datos de inscripción:", datosInscripcion);

        console.log(
            "JSON de inscripción:",
            JSON.stringify(datosInscripcion, null, 2)
        );

        await mostrarConfirmacion();

        formulario.reset();

    } catch (error) {

        console.error("Error al procesar la inscripción:", error);

        await mostrarAlerta(
            "Error inesperado",
            "No fue posible procesar la solicitud.",
            "error"
        );

    } finally {

        cambiarEstadoBoton(false);

    }

}


/* =====================================================
   09. CONTROL DEL BOTÓN DE ENVÍO
   ===================================================== */

function cambiarEstadoBoton(procesando) {

    botonEnviar.disabled = procesando;

    const textoBoton = botonEnviar.querySelector("span");

    if (textoBoton) {

        textoBoton.textContent = procesando
            ? "Procesando..."
            : "Enviar solicitud";

    }

}


/* =====================================================
   10. ALERTAS Y CONFIRMACIÓN
   ===================================================== */

function mostrarAlerta(titulo, mensaje, icono) {

    return Swal.fire({

        title: titulo,
        text: mensaje,
        icon: icono,

        confirmButtonText: "Entendido",
        confirmButtonColor: "#142B32"

    });

}


function mostrarConfirmacion() {

    return Swal.fire({

        title: "¡Solicitud preparada!",

        text: "La información fue validada correctamente. Recuerda que esta versión todavía no guarda los datos en una base de datos.",

        icon: "success",

        confirmButtonText: "Entendido",
        confirmButtonColor: "#142B32"

    });

}


/* =====================================================
   FIN DEL MÓDULO
   CONECTAVOLUNTARIADO CR
   ===================================================== */
