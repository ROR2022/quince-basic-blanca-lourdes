# Invitaciones personalizadas

Este documento describe cómo funciona actualmente la personalización de las invitaciones, desde el enlace que recibe cada invitado hasta la confirmación de asistencia. No incluye identificadores, enlaces ni datos de personas reales.

## Idea general

Cada invitación se identifica mediante un código incluido en el parámetro `id` de la URL:

```text
https://ejemplo.com/?id=AbCdEfGh12345678
```

El código se busca en un archivo CSV del proyecto. Si hay una coincidencia, la página usa el nombre y la cantidad de pases de esa fila para personalizar el portal de entrada y limitar las opciones del formulario de asistencia.

El código es una clave de búsqueda, no una cuenta ni un mecanismo de autenticación. No hay inicio de sesión para el invitado y el sitio no comprueba su identidad.

## Dónde están los datos y la lógica

- [`data/invitados-unificados.csv`](./data/invitados-unificados.csv) contiene los datos que permiten resolver cada invitación.
- [`app/page.tsx`](./app/page.tsx) lee el parámetro de la URL, valida el formato del código, consulta el CSV y prepara los datos del invitado.
- [`components/invitation/invitation-experience.tsx`](./components/invitation/invitation-experience.tsx) conecta esos datos con las secciones de la invitación.
- [`components/invitation/entry-portal.tsx`](./components/invitation/entry-portal.tsx) muestra la tarjeta personalizada antes de entrar.
- [`components/invitation/basic-attendance.tsx`](./components/invitation/basic-attendance.tsx) valida la cantidad de acompañantes y prepara el mensaje de confirmación para WhatsApp.
- [`lib/config.ts`](./lib/config.ts) contiene los datos generales del evento y el número de WhatsApp al que se dirige la confirmación.

## Datos de cada fila

El CSV tiene estas columnas:

| Columna | Propósito |
| --- | --- |
| `id` | Código que debe coincidir con el parámetro `id` del enlace. |
| `nombre` | Nombre que se muestra como destinatario de la invitación. |
| `cantidad` | Texto que indica los pases asignados; también se usa para decidir el límite de acompañantes. |

Ejemplo ficticio:

```csv
id,nombre,cantidad
AbCdEfGh12345678,Invitado de ejemplo,2 personas
```

Los valores con comas o comillas deben seguir el formato CSV y estar entre comillas cuando corresponda. El lector maneja comillas dobles escapadas dentro de un campo, pero espera que cada registro completo esté en una sola línea; no admite campos citados que ocupen varias líneas.

## Recorrido de una invitación

1. Next.js recibe una solicitud para la página y lee `searchParams`.
2. Si el parámetro `id` aparece varias veces, se toma el primer valor.
3. El servidor acepta únicamente códigos de exactamente 16 caracteres alfanuméricos ASCII (`A-Z`, `a-z`, `0-9`).
4. Se lee `data/invitados-unificados.csv`, se omite la primera línea (encabezado) y se recorren los registros.
5. Se compara el código de la URL con la columna `id`. La comparación es exacta y distingue entre mayúsculas y minúsculas.
6. Si encuentra una fila utilizable, convierte `cantidad` en un límite de acompañantes y entrega los datos a la experiencia de invitación.
7. El portal muestra el nombre y el tipo de pase. El formulario utiliza el límite calculado al validar la asistencia.

Si hay códigos duplicados, se usa la primera fila coincidente. El código no comprueba que los encabezados del CSV sean correctos y espera que las columnas estén en el orden `id,nombre,cantidad`.

## Cómo se interpreta `cantidad`

La lógica actual distingue estos casos:

| Valor en `cantidad` | Resultado |
| --- | --- |
| `ilimitado` (sin importar mayúsculas/minúsculas y permitiendo espacios alrededor) | No se fija un límite de acompañantes. El formulario pide el total de asistentes, contando a quien confirma. |
| Un número seguido de `persona` o `personas` —por ejemplo, `2 personas`— | Se interpreta como el total de pases asignados. Los acompañantes permitidos son ese total menos uno, con un mínimo de cero. |
| Cualquier otro texto | Se conserva para mostrarlo, pero el límite de acompañantes queda en `1`. |

Por ejemplo, `2 personas` permite que quien confirma agregue hasta un acompañante. `1 persona` no permite acompañantes.

### Caso especial: `personal`

El portal tiene una etiqueta visual especial para el valor exacto `personal` y muestra “Pase personal”. Sin embargo, actualmente `personal` no coincide con los formatos numéricos ni con `ilimitado`; por ello, el cálculo de límite cae en la regla de “cualquier otro texto” y permite un acompañante. **La etiqueta “Pase personal” no garantiza por sí sola un pase sin acompañantes.**

Para imponer un pase individual sin cambiar el código, conviene usar `1 persona`. Si se quiere conservar `personal` como valor, hay que ajustar la conversión para que también produzca un límite de cero.

## Qué ve y puede hacer el invitado

Cuando se resuelve una fila, el portal muestra el nombre y una etiqueta de pases:

- Para `ilimitado`, indica que la cantidad de asistentes está por confirmar.
- Para `personal`, muestra “Pase personal”.
- Para los demás valores, muestra “Pase para” seguido del texto de `cantidad`.

En el formulario, el número de acompañantes no puede superar el límite calculado para una invitación numérica. Para invitaciones `ilimitado`, se solicita un total entero de asistentes de al menos uno. La confirmación incluye si la persona asistirá, el nombre que escribió en el formulario y, cuando corresponda, la cantidad de asistentes, teléfono, restricciones alimenticias y mensaje.

La confirmación se prepara como un enlace de WhatsApp con el texto prellenado. El sitio no registra ni envía el mensaje por sí mismo: el invitado debe completar el envío en WhatsApp. En el caso ilimitado también se añade al mensaje la etiqueta de invitación con el nombre asociado al enlace.

## Qué ocurre si falta el código o no se encuentra

La página usa una invitación genérica en estos casos:

- no hay parámetro `id`;
- el código no tiene el formato esperado;
- el código no aparece en el CSV;
- la fila encontrada no tiene nombre o cantidad.

La invitación genérica se presenta como “Invitado”, con `1 persona` y cero acompañantes. Por tanto, un enlace mal escrito no muestra un error: abre esa invitación genérica.

## Procedimiento para agregar o modificar una invitación

1. Añadir o editar una fila en [`data/invitados-unificados.csv`](./data/invitados-unificados.csv), sin cambiar el encabezado ni el orden de columnas.
2. Asignar un código único de 16 caracteres alfanuméricos. Respetar exactamente las mayúsculas y minúsculas al generar el enlace.
3. Usar un formato de cantidad que la lógica reconozca: `N persona(s)` para un número fijo de pases o `ilimitado` para pedir el total al confirmar.
4. Construir el enlace agregando `?id=` y el código al dominio de la invitación. Si la URL ya tiene otros parámetros, agregar el identificador con `&id=`.
5. Probar el enlace y comprobar el nombre, la etiqueta del pase y el límite del formulario. Para una invitación numérica, probar también que el formulario rechace un número mayor al permitido.
6. Compartir cada enlace de forma individual con su destinatario.

Los archivos que contienen listas de invitados o enlaces son material privado. No se deben incluir códigos reales en documentación pública, capturas compartidas ni ejemplos de código.

## Límites y consideraciones de privacidad

- El código sirve para localizar una invitación, pero no prueba quién abrió el enlace. Cualquier persona que lo reciba o tenga acceso a él puede abrirlo.
- El nombre asociado se muestra en la página y, por tanto, se envía al navegador que abre el enlace.
- Los parámetros de URL pueden quedar en el historial del navegador y en registros de infraestructura. Conviene tratar los enlaces como información privada.
- La confirmación no se almacena en una base de datos del sitio. El flujo depende de que el invitado envíe el mensaje de WhatsApp.
- Los identificadores deben ser únicos; si se repiten, prevalece la primera coincidencia del CSV.
- La cantidad se muestra como texto, pero su límite se calcula solo con los formatos reconocidos. Un valor distinto podría mostrar una cantidad y permitir otra; revisar ambos resultados al editar el CSV.
- El archivo CSV debe estar disponible en `data/invitados-unificados.csv` en el entorno donde se ejecute la página.
