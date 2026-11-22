# Guía de adaptación y reutilización de Exploradores de números (v1.2)

Este documento explica cómo adaptar el RED sin confundir actividades realizadas con dominio matemático.

## Uso técnico
- Recurso web estático en `index.html`, `styles.css` y `app.js`. Se publica en GitHub Pages y no requiere bibliotecas externas.
- Hacer una copia o rama antes de editar. Conservar la licencia MIT para el código y la CC BY-NC-SA 4.0 para contenido educativo; respetar la autoría.
- Verificar que los metadatos Schema.org, la información de licencia y las referencias a archivos se mantengan actualizados después de una adaptación.

## Adaptación del contenido
- `META` en `app.js`: títulos, tiempo orientativo y descripción de las cuatro misiones.
- `MISSION_STRUCTURE`: objetivos y mapa de apartados de cada misión.
- `REFLECTION_GUIDES`: dos orientaciones para las explicaciones escritas por misión.
- `DIAG`, `FORMATIVE`, `CASES` y `FINAL`: bancos de preguntas y soluciones. Si se modifican, verificar cada enunciado, alternativa correcta, explicación y criterio matemático antes de publicar.
- `renderM1` a `renderM4`: explicaciones, ejemplos y secuencia didáctica. Los nuevos desafíos opcionales deben estar visiblemente separados de la evaluación obligatoria.

## Precauciones
- No cambiar los nombres de las claves de `localStorage` o los campos del estado sin una migración: podría perderse el avance guardado.
- El indicador de misiones terminadas señala realización de actividades, **no dominio autónomo ni una nota**.
- La evaluación final registra respuestas al primer intento; las reflexiones se valoran por separado con una rúbrica docente.
- No publicar reportes individuales, nombres ni datos personales de menores en el repositorio.
- Hacer una revisión completa de matemáticas, accesibilidad, navegación, descargas y guardado si se adaptan preguntas o grupos.

## Lista de comprobación para cada copia
1. Ingresar con un código no identificable y un grupo autorizado.
2. Completar el diagnóstico y comprobar la retroalimentación formativa.
3. Comprobar desbloqueo secuencial, preguntas finales y reflexiones.
4. Exportar TXT y CSV; abrir los archivos y revisar contenidos.
5. Probar navegación, teclado, móvil y ampliación; validar HTML/CSS con W3C.
6. Confirmar las licencias y revisar que el reporte no revele datos personales.

**Alcance de la versión 1.2:** mejora de orientación, explicaciones y documentación. No modifica los bancos de evaluación ni afirma dominio de los estudiantes.
