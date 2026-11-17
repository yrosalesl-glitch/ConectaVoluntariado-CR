# Matriz de trazabilidad (ERS vs. Frontend)

**Proyecto:** ConectaVoluntariado CR  
**Curso:** Proyecto Integrador 1  
**Equipo:** 5  
**Avance:** 2 — Implementación del frontend

## Propósito

Relacionar los requisitos funcionales y no funcionales definidos en la Especificación de Requisitos de Software (ERS — Avance 1) con las funcionalidades implementadas en el frontend durante el Avance 2.

## Matriz de trazabilidad

| ID Requisito | Nombre del requisito (ERS) | Pantalla / funcionalidad implementada |
|---|---|---|
| RF-001 | Registro de usuarios voluntarios | Formulario de captura de datos personales (nombre, correo y teléfono) en `inscripcion.html`. |
| RF-007 | Búsqueda y filtrado de oportunidades | Renderizado dinámico de tarjetas desde `actividades.json` y filtro por categoría en `actividades.html`. |
| RF-008 | Postulación a turnos | Formulario de solicitud en `inscripcion.html`, con validación de campos y confirmación mediante SweetAlert2. |
| RF-009 | Control de cupos sobrecargados | Deshabilitación visual de actividades con `cuposDisponibles: 0` y exclusión de estas en el selector dinámico. |
| RNF-003 | Responsividad | Diseño adaptable mediante CSS Grid y Flexbox para dispositivos móviles, tabletas y computadoras. |
| RNF-004 | Usabilidad y navegación | Navegación consistente entre las tres páginas principales mediante encabezados y enlaces. |

## Observaciones

La implementación corresponde a la representación de estos requisitos en el frontend. Las funcionalidades de registro y postulación permiten validar y preparar la información, pero todavía no realizan almacenamiento en una base de datos.