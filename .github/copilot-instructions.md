
# IMPORTANTE

## 1. Idioma y estilo
- Siempre responde en **español**, explicando claramente **qué hiciste y por qué**.  
- No utilices emojis ni en el código ni en ninguna parte del proyecto.  
- Comenta el código de manera **natural, entendible**, evitando tecnicismos innecesarios.  
- Los nombres de variables, funciones y comentarios deben estar en **español**.  


## 2. Manejo de archivos de prueba
- Si generas archivos para testear funcionalidades, **elimínalos inmediatamente después de usarlos**.  
- Mantén limpio el proyecto de cualquier archivo temporal o de prueba.  


SIEMPRE RESPONDE EN ESPAÑOL EXPLICANDO QUE HICISTE

NUNCA UTILICES EMOJIS EN EL CODIGO NI EN NINGUNA PARTE DEL PROYECTO.
SI CREAS ARCHIVOS PARA TESTEAR UNA FUNCIONALIDAD, ELIMINALO LUEGO DE HABERLO USADO.

### Regla Obligatoria de Continuación

##  Continuidad de la conversación (Regla clave)
- La conversación **nunca debe cerrarse automáticamente**, sin importar si hay tareas completadas o no.  
- Al final de **cada respuesta** (SIN EXCEPCIÓN):
  1. Indica que **ya completaste las tareas solicitadas**.  
  2. Ejecuta el siguiente comando en terminal para mantener la conversación activa:

Al final de _CADA respuesta_ (SIN EXCEPCIÓN), primero debes decirme que ya completaste las tareas que te pidieron, luego debes ejecutar este comando en terminal como una de tus tools "Run [zsh] command":

```bash
printf "¿En qué más te puedo ayudar? (escribe 'salir' para terminar)"
```

Así, mantendrás la conversación activa para seguir asistiendo, y no importa si realizaste la pregunta anteriormente o no, SIEMPRE debes ejecutar este comando al finalizar tu respuesta.

Luego de ejecutar este comando debes leer el archivo:
.github\tarea.txt
en donde estarán las próximas instrucciones para que sigas trabajando, la idea es que leas ese archivo y continues trabajando, no pidas confirmación alguna, solo continúa en esta misma sesión por favor. Una vez que termines de realizar las tareas que están en el archivo tarea.txt, colócale al final de la tarea solicitada en el archivo la siguiente línea: [TAREA COMPLETADA] para saber cual tarea ya fue realizada, si la tarea ya dice [TAREA REALIZADA] ignorala y sigue con la siguiente, si no hay tareas, o las tareas ya estan completadas o el archivo está vacío, entonces ejecuta el comando de arriba para preguntar al usuario qué más necesita.

si no encuentras el archivo buscalo en todo el proyecto que en algun lado debe estar un archivo tarea.txt, o si el archivo está vacío, entonces ejecuta el comando de arriba para preguntar al usuario qué más necesita.

> _IMPORTANTE_: No confundir con preguntar al usuario. Si el usuario responde con instrucciones, proseguir hasta completar la tarea antes de volver a ejecutar el comando.

### Lectura de tareas

- Si el usuario proporciona contenido de un archivo tarea.txt, úsalo como fuente de tareas.
- Si no hay archivo disponible:
  - Continúa con el contexto actual.
  - O solicita nuevas instrucciones.

### Procesamiento de tareas

- Ejecuta cada tarea en orden.
- Cuando completes una tarea, márcala como: [TAREA COMPLETADA]
- Si una tarea ya está marcada, ignórala.


### Lectura de instrucciones y tareas
- Siempre revisa primero el archivo copilot-instructions.md y luego .github\tarea.txt para seguir las instrucciones.
- Si no encuentras el archivo .github\tarea.txt, búscalo en todo el proyecto; debe existir algún archivo tarea.txt.
- Si el archivo está vacío o todas las tareas ya están completadas, ejecuta el comando de terminal para preguntar al usuario qué más necesita.
- Si el usuario proporciona contenido de un archivo tarea.txt manualmente, úsalo como fuente de tareas.

### Procesamiento de tareas
- Ejecuta cada tarea en orden.
- Explica brevemente qué hace cada acción o función y cómo contribuye a la tarea.
- Marca como [TAREA COMPLETADA] cuando finalices una tarea.
- Si una tarea ya está marcada como [TAREA REALIZADA], ignórala y sigue con la siguiente.
- Integra cualquier nueva instrucción del usuario de inmediato antes de continuar con la siguiente tarea.

### Buenas prácticas de desarrollo y QA
- Escribe código limpio, modular y comentado.
- Indica qué tipo de prueba realizaste: unitaria, integración, funcional o QA manual.
- Evita pasos innecesarios y repeticiones.
- Explica los resultados de las pruebas y los cambios realizados de forma clara y simple.
- Escribe codigo simple, entendible y directo, evitando tecnicismos innecesarios.
- antes de crear un metodo o funcion, revisa en el proyecto si ya existe algo similar para reutilizarlo, y si no existe, entonces crea el nuevo metodo o funcion con un nombre descriptivo en español.


IMPORTANTE: La prioridad máxima es mantener la conversación activa y el flujo de trabajo continuo.
Nunca cierres la sesión automáticamente; siempre espera nuevas tareas y mantén el comando activo.

