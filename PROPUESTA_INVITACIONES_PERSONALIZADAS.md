# Propuesta de adaptación de invitaciones personalizadas

## 1. Objetivo

Adaptar el modelo descrito en `invitaciones-personalizadas.md` a la aplicación actual de Blanca Lourdes, sin exponer la información de invitados ni cambiar por sí misma la identidad visual de la invitación.

El resultado esperado es que cada invitado reciba un enlace único como:

```text
https://dominio-del-evento/?id=CODIGO-DE-16-CARACTERES
```

Al abrirlo, la aplicación:

1. Valida el identificador recibido.
2. Busca la invitación en una fuente privada de datos.
3. Muestra el nombre o grupo familiar correspondiente.
4. Indica la cantidad de pases asignados.
5. Limita los acompañantes que el invitado puede registrar.
6. Incluye la información de la invitación en el mensaje de confirmación de WhatsApp.
7. Conserva la invitación como genérica cuando el identificador sea inválido o inexistente.

El sistema no pretende autenticar al invitado. El código solamente selecciona el registro de datos asociado al enlace.

---

## 2. Estado de los archivos actuales

### 2.1 Archivo de invitaciones

`invitaciones-personalizadas.md` define correctamente la idea general, pero describe una arquitectura anterior basada en Next.js:

- `app/page.tsx`
- `data/invitados-unificados.csv`
- `searchParams`
- rutas compatibles con Next.js

La aplicación actual utiliza TanStack Start y no contiene actualmente los componentes ni archivos mencionados para resolver invitaciones.

### 2.2 Inventario de invitados

`invitados01.txt` contiene invitados personales. Tiene 93 entradas numeradas.

Características observadas:

- Todas están representadas como pases individuales.
- Algunos nombres aparecen repetidos; deben interpretarse como registros independientes hasta confirmar si representan a la misma persona.
- Aparecen espacios, caracteres invisibles y variantes de acentuación que conviene normalizar al generar el CSV.

El resultado del inventario inicial es:

| Tipo | Registros detectados | Pases asignados |
|---|---:|---:|
| Invitado personal | 93 | 93 |
| Familia o grupo | 54 | 140 |
| Total aproximado | 147 registros | 233 personas |

Las 54 filas familiares requieren corrección manual de algunos formatos antes de convertirse en datos finales. Los totales deben validarse contra el inventario original antes de compartir enlaces.

`invitados02.txt` contiene familias, grupos y profesionales. Las asignaciones incluyen pases individuales y grupos de hasta cinco personas. Se detectaron inconsistencias como:

- números sin espacio: `2personas`;
- paréntesis incompletos;
- palabras y abreviaciones diferentes;
- duplicación o ausencia de números de fila;
- mayúsculas y acentos inconsistentes;
- encabezados mezclados con registros;
- nombres incompletos o abreviados.

Estos casos no deben enviarse automáticamente a producción sin una revisión humana.

### 2.3 Datos sensibles

Los archivos etiquetados contienen nombres reales y deben considerarse privados.

Se proponen las siguientes reglas:

- No incluir nombres reales en documentación, capturas o ejemplos.
- No colocar el CSV en `public/`.
- No agregar un archivo de invitados al repositorio si el despliegue no puede mantenerlo privado.
- No registrar identificadores en analítica, logs o mensajes visibles.
- Tratar cada enlace como una credencial privada, aunque no sea un mecanismo de autenticación.

---

## 3. Estado técnico del proyecto actual

### 3.1 Stack relevante

El proyecto utiliza:

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS 4
- Framer Motion
- Vitest

### 3.2 Componentes ya disponibles

- `src/routes/index.tsx` actualmente representa siempre `InvitationExperience guest={null}`.
- `invitation-experience.tsx` recibe un objeto opcional de invitado.
- `entry-portal.tsx` ya muestra nombre, cantidad y tipo de pase.
- `basic-attendance.tsx` ya controla acompañantes limitados y cantidades ilimitadas.
- `src/lib/config.ts` contiene los datos generales del evento.

Esto permite reutilizar la mayor parte del diseño visual y agregar resolución de invitación sin reconstruir la interfaz.

### 3.3 Funcionalidad actualmente ausente

No existe todavía:

- lectura del parámetro `id`;
- archivo o tabla de invitados;
- validación de 16 caracteres;
- transformación de `cantidad`;
- resolución entre invitación personalizada y genérica;
- datos familiares asociados al invitado;
- número de WhatsApp de confirmación;
- prueba automatizada del flujo personalizado.

---

## 4. Modelos de datos propuestos

## 4.1 Modelo mínimo recomendado

Crear una fuente privada con una sola estructura:

| Campo | Tipo | Obligatorio | Ejemplo ficticio |
|---|---|---:|---|
| `id` | texto | sí | `AbCdEfGh12345678` |
| `name` | texto | sí | `Invitado de ejemplo` |
| `quantity` | texto | sí | `2 personas` |
| `companion_limit` | entero o nulo | derivado | `1` |
| `source` | texto | sí | `personal` o `family` |
| `active` | booleano | sí | `true` |

La propuesta conserva `quantity` como texto para mantener la etiqueta visible, pero usa `companion_limit` como el número real aplicado por el formulario.

Una representación normalizada sería:

```text
id,nombre,cantidad,tipo,limite_acompanantes,activo
AbCdEfGh12345678,Invitado de ejemplo,2 personas,familiar,1,true
BCdEfGh123456789,Invitado personal,personal,personal,0,true
```

Este documento usa datos ficticios. Los campos reales no deben añadirse a documentación compartida.

### 4.2 Reglas de normalización

Estas reglas deberían aplicarse después de una limpieza controlada:

| Entrada normalizada | Pases totales | Acompañantes permitidos |
|---|---:|---:|
| `personal` | 1 | 0 |
| `1 persona` | 1 | 0 |
| `2 personas` | 2 | 1 |
| `N personas` | N | N - 1 |
| `ilimitado` | sin límite definido | formulario pide total |

Los valores que no coincidan con un patrón reconocido deberán pasar a una tabla de revisión. No deben asumir silenciosamente que tienen un acompañante.

### 4.3 Conversión de los archivos existentes

El proceso recomendado es:

1. Mantener los archivos originales como fuentes privadas sin modificarlos.
2. Generar una copia intermedia de trabajo.
3. Eliminar números de fila, viñetas y caracteres Unicode invisibles.
4. Normalizar nombres y cantidades.
5. Separar invitados personales de familias o grupos.
6. Convertir `Personales` en `personal`.
7. Convertir las cantidades familiares válidas en `N personas`.
8. Crear un identificador único de 16 caracteres para cada invitación.
9. Marcar registros incompletos o ambiguos.
10. Revisar manualmente los casos dudosos.
11. Generar el archivo o tabla final.

Se recomienda tratar nombres duplicados como registros independientes solo mientras no se confirme si deben compartirse el mismo enlace. Los nombres no pueden usarse como identificador único.

---

## 5. Opciones de almacenamiento

### 5.1 Recomendación inicial: archivo privado procesado por servidor

Para el lanzamiento actual, una opción simple sería:

- mantener una copia privada de los datos fuera de `public/`;
- cargarla únicamente desde una función o loader de servidor;
- convertir las filas en objetos tipados;
- devolver al navegador solamente el nombre y los datos necesarios para esa invitación.

Ventajas:

- implementación rápida;
- reutiliza una estructura similar a la descrita en el documento original;
- no requiere una base de datos en una primera versión.

Limitaciones:

- actualizar invitados exige reconstruir o desplegar otra vez;
- el CSV puede quedar dentro del paquete si no se coloca fuera del código cliente;
- no ofrece auditoría ni actualización desde una interfaz administrativa;
- es más difícil confirmar respuestas sin un almacenamiento adicional.

### 5.2 Recomendación a mediano plazo: tabla gestionada por Lovable Cloud

La opción más adecuada para operar y mantener el proyecto sería una tabla privada administrada por Lovable Cloud o un proveedor conectado.

Campos adicionales recomendados:

| Campo | Uso |
|---|---|
| `id` | clave pública de acceso |
| `name` | nombre visible |
| `quantity` | texto visible |
| `companion_limit` | límite utilizado por el formulario |
| `source` | origen del archivo importado |
| `active` | habilita o deshabilita el enlace |
| `created_at` | auditoría de creación |
| `updated_at` | auditoría de cambios |

La tabla debe estar protegida por políticas de acceso o una función de servidor. La página puede consultar solamente un invitado por identificador y no recibir el listado completo.

Lovable administra la base de datos y las migraciones. Cualquier cambio de esquema deberá solicitarse desde Lovable y no editarse manualmente en migraciones locales.

### 5.3 Decisión recomendada

Usar en fase 1 un CSV privado servido desde el servidor. Después del evento o si se necesita administración frecuente, migrar la misma estructura a Lovable Cloud.

Esta decisión permite comenzar sin comprar o configurar infraestructura adicional y mantiene aislada la lógica visual del almacenamiento.

---

## 6. Flujo técnico dentro de TanStack Start

### 6.1 Lectura del enlace

En `src/routes/index.tsx` se debe declarar y validar el parámetro de búsqueda `id`.

La configuración debe aceptar como máximo una sola aparición del parámetro. Si aparece más de una vez, se utiliza el primer valor.

La función de resolución debe:

- convertir el valor recibido en una cadena;
- rechazar valores con longitud distinta de 16;
- aceptar únicamente caracteres ASCII alfanuméricos;
- distinguir mayúsculas de minúsculas;
- buscar una coincidencia exacta;
- rechazar registros inactivos;
- rechazar registros sin nombre o cantidad válida.

El identificador no puede incluir espacios, guiones bajos, símbolos o caracteres Unicode.

### 6.2 Datos entregados al componente

El objeto mínimo que `InvitationExperience` debe recibir puede ser:

```ts
{
  name: string
  quantity: string
  companionLimit: number | null
}
```

Este modelo ya coincide conceptualmente con `GuestInvitation` e evita modificar componentes adicionales.

### 6.3 Invitación genérica

Cuando no haya coincidencia válida, se debe generar una invitación genérica segura:

- nombre visible: `Invitado`;
- cantidad: `1 persona`;
- acompañantes permitidos: `0`;

La página no debe mostrar mensajes que indiquen si un identificador existe, si fue desactivado o si contiene errores.

Esto conserva el comportamiento descrito en el documento original y evita enumerar invitados.

### 6.4 Portal de entrada

`entry-portal.tsx` ya puede mostrar:

- nombre;
- cantidad;
- pase personal;
- cantidad ilimitada;
- nombres genéricos.

Se ajustará solamente si `personal` pasa a tener límite cero, y si se requiere presentar etiquetas distintas para familiares.

### 6.5 Formulario RSVP

`basic-attendance.tsx` continuará validando:

- nombre obligatorio;
- asistencia sí o no;
- total entero en invitaciones ilimitadas;
- acompañantes dentro del límite;
- cantidad mínima de uno para el total.

Para la confirmación se recomienda ampliar el mensaje de WhatsApp sin incluir datos innecesarios:

- invitación a confirmar;
- nombre escrito;
- asistencia;
- acompañantes o total;
- mensaje opcional.

También conviene agregar una línea que indique el nombre asociado al enlace para invitaciones familiares ilimitadas.

### 6.6 WhatsApp

Debe agregarse el número real a `confirmationWhatsappNumber` de `src/lib/config.ts`.

Antes del lanzamiento se debe verificar que:

- el número tenga formato internacional;
- no contenga signos, guiones ni espacios;
- la confirmación abra WhatsApp;
- el mensaje esté correctamente codificado;
- el mensaje confirme el nombre y número de pases asignados.

El sitio no almacenará ni enviará automáticamente la confirmación.

---

## 7. Consideraciones de privacidad y seguridad

### 7.1 El identificador no autentica

Un enlace válido permite:

- ver el nombre asociado;
- conocer la cantidad de pases;
- enviar una confirmación con el límite mostrado.

Cualquier persona que copie el enlace podrá acceder a esos datos. Por ello, los enlaces deben tratarse como información privada.

No se recomienda usar nombres, teléfonos o secuencias predecibles como identificadores.

### 7.2 Prevención de enumeración

La resolución debe evitar que la interfaz revele si un identificador es válido.

Las respuestas internas pueden registrar fallas técnicas, pero no deben exponer:

- cantidad total de registros;
- nombres encontrados;
- coincidencias parciales;
- razones detalladas de rechazo;
- existencia de identificadores desactivados.

### 7.3 Prohibición de listado público

El navegador no debe recibir:

- el CSV completo;
- nombres de invitados no relacionados;
- códigos de otras invitaciones;
- totales de la lista general;
- información usada en administración.

La resolución puede hacerse en el servidor y enviar únicamente el objeto del invitado consultado.

### 7.4 Control de enlaces

Antes de compartir:

- cada enlace debe tener un identificador único;
- los registros duplicados deben revisarse;
- cada invitación debe tener estado activo;
- los enlaces obsoletos deben desactivarse;
- no debe existir el mismo código en dos filas.

### 7.5 Historial y registradores

Se debe evitar registrar URLs completas en analítica, logs o herramientas de reporte. Si se requiere analítica, registrar eventos sin el parámetro `id`.

---

## 8. Plan de migración y limpieza

### Fase 1: extracción

- Exportar una copia limpia de `invitados01.txt`.
- Exportar una copia limpia de `invitados02.txt`.
- Identificar 93 registros personales.
- Identificar 54 grupos familiares detectados.
- Revisar los nombres incompletos o abreviados.

### Fase 2: normalización

- Establecer el formato oficial `N personas`.
- Cambiar los registros personales a `personal`.
- Corregir espacios, paréntesis y acentos.
- Resolver nombres duplicados.
- Crear una columna final con 16 caracteres únicos.

### Fase 3: revisión humana

Verificar especialmente:

- registros marcados como `personal`;
- cantidades conocidas;
- nombres abreviados;
- filas sin número claro;
- registros familiares con un pase;
- posibles nombres duplicados;
- errores ortográficos.

No se recomienda convertir `personal` directamente en `ilimitado` ni permitir acompañantes sin confirmación explícita.

### Fase 4: implementación técnica

- agregar el parser y validador;
- integrar la búsqueda en la ruta principal;
- reutilizar el modelo `GuestInvitation`;
- ajustar personal, familiar e ilimitado;
- agregar pruebas unitarias;
- agregar pruebas de routing;
- configurar el número de confirmación.

### Fase 5: pruebas privadas

- probar enlaces ficticios;
- verificar mayúsculas y minúsculas;
- probar identificadores inválidos;
- probar identificadores inexistentes;
- probar pases personales;
- probar grupos de dos, tres y cinco personas;
- probar cantidades ilimitadas;
- verificar que WhatsApp reciba el texto esperado;
- confirmar que no se entrega el listado completo.

### Fase 6: activación

- importar los datos definitivos;
- desactivar registros temporales;
- generar enlaces privados;
- realizar una prueba con un pequeño grupo;
- corregir discrepancias;
- compartir los enlaces finales de forma individual.

---

## 9. Casos especiales detectados

### 9.1 Invitación personal

Los registros de `invitados01.txt` deben convertirse a una sola forma normalizada.

Aunque el documento original define que `personal` muestra una etiqueta especial, el proyecto actual no debe permitir acompañantes por ese simple texto. La recomendación es convertirlo explícitamente a `companionLimit: 0`.

### 9.2 Invitaciones familiares

Los registros familiares requieren calcular el número de acompañantes restando uno al total:

- `2 personas` permite 1 acompañante;
- `3 personas` permite 2 acompañantes;
- `5 personas` permite 4 acompañantes.

La pregunta al invitado debe indicar cuántos acompañantes puede registrar, no exponer el concepto interno de límite si no es necesario.

### 9.3 Grupos sin número claro

Una fila que no tenga un número válido no debe generar automáticamente una cantidad ilimitada. Debe quedar como pendiente de revisión.

Esto evita errores como permitir acompañantes no asignados por un simple formato mal escrito.

### 9.4 Cantidades ilimitadas

Este tipo de invitación debe pedir el número total de asistentes.

El mensaje de WhatsApp deberá usar:

```text
Total de asistentes (incluida la persona que confirma): N
```

### 9.5 Nombres repetidos

Los nombres repetidos en el archivo personal pueden corresponder a personas distintas. No deben fusionarse automáticamente.

El CSV final puede conservar dos registros separados con nombres iguales y códigos diferentes, después de confirmar que la familia o organización desea entregar dos enlaces.

---

## 10. Pruebas propuestas

### 10.1 Pruebas del validador

Crear casos para:

- código válido de 16 caracteres;
- código con 15 caracteres;
- código con 17 caracteres;
- código con guion o espacio;
- código con minúscula o mayúscula;
- carácter Unicode;
- código inexistente;
- código duplicado;
- registro inactivo.

### 10.2 Pruebas de cantidades

Crear casos para:

- `personal`;
- `1 persona`;
- `2 personas`;
- `3 personas`;
- `ilimitado`;
- texto desconocido;
- número cero;
- número decimal;
- números negativos;
- espacios alrededor del texto;
- mayúsculas o minúsculas.

### 10.3 Pruebas de RSVP

Verificar que:

- el nombre sea obligatorio;
- sea obligatorio indicar asistencia;
- no se pueda superar el límite;
- no se acepten cantidades decimales;
- el total ilimitado sea mayor o igual a uno;
- el mensaje de WhatsApp contenga el dato correcto;
- el formulario no avance si falta el número de confirmación.

### 10.4 Pruebas de privacidad

Verificar que:

- no se incluya el archivo completo en JavaScript público;
- no existan endpoints que devuelvan todos los invitados;
- el registro genérico no revele el estado del código;
- los logs no contengan enlaces completos;
- los ejemplos no tengan datos reales.

---

## 11. Criterios de aceptación

La adaptación puede considerarse terminada cuando:

1. Cada registro real tiene un único identificador válido.
2. El sistema muestra el nombre correcto para el enlace.
3. La cantidad visible coincide con los pases asignados.
4. El límite de acompañantes coincide con el tipo de invitación.
5. `personal` permite cero acompañantes.
6. Las cantidades `N personas` permiten `N - 1` acompañantes.
7. `ilimitado` solicita un total válido.
8. Un código ausente, inválido o inexistente abre la invitación genérica.
9. No se muestran datos de otros invitados.
10. La confirmación abre WhatsApp con el mensaje correcto.
11. El número real de WhatsApp está configurado.
12. Los enlaces se pueden desactivar sin eliminar datos.
13. Las pruebas de routing y cantidades pasan.
14. Los datos privados no se encuentran en `public/` ni en documentación compartida.
15. Los nombres y enlaces reales se han probado sin incluirlos en evidencia pública.

---

## 12. Cambios directos necesarios en el proyecto

Cuando se apruebe la implementación, los cambios principales serían:

1. `src/routes/index.tsx`
   - leer `id`;
   - resolver el invitado;
   - pasar el objeto a `InvitationExperience`.

2. `src/lib/config.ts`
   - mantener los datos generales;
   - configurar `confirmationWhatsappNumber`.

3. Nuevo módulo privado de invitados
   - validar identificadores;
   - cargar o consultar registros;
   - normalizar cantidades;
   - generar el objeto `GuestInvitation`.

4. `src/components/invitation/basic-attendance.tsx`
   - confirmar el límite calculado;
   - revisar el texto enviado;
   - agregar el identificador visible solo si es necesario para la operación familiar.

5. Pruebas
   - ampliación de `src/test/app-routing.test.tsx`;
   - nuevas pruebas unitarias para cantidades e identificadores;
   - pruebas de formulario si el entorno permite ventanas simuladas.

---

## 13. Alcance recomendado

La propuesta busca implementar una primera versión mantenible:

- invitaciones individuales;
- invitaciones familiares;
- invitación genérica;
- límite de acompañantes;
- confirmación por WhatsApp;
- privacidad básica;
- pruebas automáticas.

Quedan fuera de esta fase inicial:

- autenticación de invitados;
- inicio de sesión;
- registro permanente de confirmaciones;
- panel administrativo;
- edición visual de enlaces;
- estadísticas de asistencia;
- enlaces públicos con datos expuestos;
- envío automático de WhatsApp.
