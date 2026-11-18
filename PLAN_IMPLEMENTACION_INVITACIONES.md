# Plan de implementación: invitaciones personalizadas

## 1. Propósito

Este documento define los pasos necesarios para implementar invitaciones personalizadas en la versión actual de la aplicación basada en TanStack Start.

Parte de la [propuesta funcional](/d:/rorProjects/invitaciones/clientes/quinces/basic/quince-basic-blanca-lourdes/PROPUESTA_INVITACIONES_PERSONALIZADAS.md) y la convierte en una secuencia de trabajo verificable.

El objetivo es permitir que cada invitado abra un enlace con `id`, vea su nombre y cantidad de pases, conserve el límite asignado de acompañantes y confirme su asistencia por WhatsApp.

No se implementará autenticación, un panel administrativo ni una base de datos pública. Los identificadores son claves privadas de búsqueda, no credenciales de usuario.

---

## 2. Resultado esperado

Al finalizar la implementación:

```text
https://dominio-del-evento/?id=AbCdEfGh12345678
```

deberá:

1. resolver el registro correspondiente;
2. mostrar el nombre o grupo familiar en el portal;
3. mostrar la cantidad asignada;
4. limitar los acompañantes según el pase;
5. preparar el mensaje de confirmación;
6. continuar mostrando la invitación genérica ante un `id` inválido o inexistente;
7. no exponer datos de otros invitados;
8. permitir desactivar invitaciones sin borrar su historial.

---

## 3. Alcance de la implementación

### Incluido

- validación de `id`;
- resolución de invitado en servidor;
- estructura normalizada de invitados;
- generación de identificadores únicos;
- limpieza de los archivos actuales;
- pases personales, familiares e ilimitados;
- invitación genérica;
- integración con `InvitationExperience`;
- integración con `EntryPortal`;
- integración con `BasicAttendance`;
- mensaje de confirmación por WhatsApp;
- pruebas unitarias y de integración;
- documentación operativa de generación de enlaces.

### No incluido

- inicio de sesión;
- autenticación por contraseña;
- registro permanente de confirmaciones;
- panel administrativo;
- análisis de asistencia;
- edición visual de enlaces;
- envío automático de WhatsApp;
- envío masivo de mensajes;
- acceso público al catálogo de invitados.

---

## 4. Inventario que se debe incorporar

### 4.1 Invitados personales

La fuente `invitados01.txt` contiene 93 registros personales.

La implementación final debe:

- crear 93 registros independientes;
- asignar cada uno a `tipo = personal`;
- convertir la cantidad visible a `personal`;
- fijar `limite_acompanantes = 0`;
- validar los nombres duplicados antes de decidir si corresponden a enlaces independientes o compartidos.

### 4.2 Invitaciones familiares

La fuente `invitados02.txt` contiene 54 filas familiares o grupales detectadas y aproximadamente 140 pases.

Antes de importar:

- corregir formatos como `2personas`;
- normalizar paréntesis incompletos;
- eliminar espacios invisibles;
- convertir todas las cantidades válidas a `N personas`;
- calcular acompañantes como `N - 1`;
- fijar en cero los grupos de una persona;
- marcar nombres incompletos para revisión manual;
- validar nombres duplicados o abreviados.

### 4.3 Totales de control

La revisión inicial indica:

| Tipo | Registros | Pases |
|---|---:|---:|
| Personales | 93 | 93 |
| Familiares | 54 | 140 |
| Total | 147 | 233 |

Estos totales son una referencia de control y deben verificarse después de la limpieza. No deben convertirse en un documento público.

---

## 5. Decisiones técnicas previas

### 5.1 Resolución de datos

La resolución del invitado se realizará en servidor.

El navegador únicamente recibirá el registro encontrado para el identificador solicitado:

```ts
interface PublicGuestInvitation {
  name: string
  quantity: string
  companionLimit: number | null
}
```

No debe existir ningún endpoint que entregue:

- la lista completa;
- otros nombres;
- otros identificadores;
- el contenido completo del archivo de invitados.

### 5.2 Identificador

Todo identificador deberá cumplir:

- longitud exacta de 16 caracteres;
- únicamente letras ASCII mayúsculas o minúsculas y dígitos;
- carácter exclusivo alfabético ASCII, sin acentos ni símbolos;
- unicidad exacta;
- comparación sensible a mayúsculas y minúsculas;
- registro activo;
- nombre y cantidad válidos.

Se utilizará una expresión similar a:

```text
^[A-Za-z0-9]{16}$
```

Los identificadores no podrán derivarse del nombre ni de secuencias previsibles.

### 5.3 Invitación genérica

Si no existe una coincidencia, se usará:

```ts
{
  name: 'Invitado',
  quantity: '1 persona',
  companionLimit: 0
}
```

El comportamiento debe ser idéntico para:

- ausencia de `id`;
- formato inválido;
- múltiples valores;
- identificador inexistente;
- registro inactivo;
- fila incompleta.

No se mostrarán diferencias visibles que permitan saber si el código existe.

### 5.4 Almacenamiento recomendado

La implementación final debe preferir Lovable Cloud o una base de datos conectada administrada por Lovable.

La tabla privada tendrá como mínimo:

| Columna | Tipo | Propósito |
|---|---|---|
| `id` | texto, único | clave pública del enlace |
| `name` | texto | nombre o grupo visible |
| `quantity` | texto | etiqueta visible |
| `type` | texto | personal, familia o ilimitado |
| `companion_limit` | entero nullable | límite calculado |
| `active` | booleano | habilitación del enlace |
| `source_file` | texto opcional | trazabilidad privada |
| `created_at` | timestamp | creación |
| `updated_at` | timestamp | actualización |

El esquema no se editará manualmente en el repositorio. Toda creación o modificación de tablas se realizará en Lovable.

Como alternativa de arranque, el proyecto puede usar un archivo privado procesado por servidor. Esta alternativa no debe colocarse en `public/`, no debe entrar en el bundle cliente y no debe usarse si se requiere un panel administrativo.

---

## 6. Modelo de datos interno

### 6.1 Registro normalizado

Crear un archivo privado o módulo del servidor con un tipo similar a:

```ts
interface GuestRecord {
  id: string
  name: string
  quantity: string
  companionLimit: number | null
  active: boolean
}
```

El nombre público de las columnas puede variar según Lovable, pero la aplicación debe usar una interfaz tipada única.

### 6.2 Estructura pública

`InvitationExperience` continuará recibiendo:

```ts
interface GuestInvitation {
  name: string
  quantity: string
  companionLimit: number | null
}
```

Esto permite reutilizar los componentes existentes sin modificar su contrato general.

### 6.3 Transformación de cantidad

Crear una función pura `resolveGuestQuantity`.

Debe producir:

| Valor normalizado | `quantity` visible | `companionLimit` |
|---|---|---:|
| `personal` | `personal` | `0` |
| `1 persona` | `1 persona` | `0` |
| `2 personas` | `2 personas` | `1` |
| `N personas` | `N personas` | `N - 1` |
| `ilimitado` | `ilimitado` | `null` |

La función deberá rechazar:

- cantidades negativas;
- cero;
- decimales;
- números seguidos de texto desconocido;
- signos o paréntesis residuales;
- texto vacío.

Los registros inválidos deberán marcarse para revisión, no convertirse automáticamente en otros tipos.

### 6.4 Duplicados

La búsqueda por `id` continuará usando la primera coincidencia solamente si existe una restricción única en la base de datos.

Antes de insertar datos:

- comprobar que cada `id` sea único;
- comprobar IDs duplicados en el archivo fuente;
- revisar nombres duplicados sin asumir que son la misma persona;
- asignar un enlace distinto a nombres iguales si representan invitaciones distintas.

---

## 7. Integración con TanStack Start

### 7.1 Ruta principal

Modificar `src/routes/index.tsx` para:

- leer el parámetro `id`;
- aceptar solamente su primer valor si aparece varias veces;
- invocar la resolución privada;
- pasar el resultado a `InvitationExperience`;
- conservar los metadatos existentes;
- mantener el contenido disponible durante SSR.

No debe pasar al navegador la función completa de resolución ni el catálogo de invitados.

### 7.2 Validación de búsqueda

Si se usa un esquema de búsqueda de ruta, se añadirá una representación segura del parámetro.

Ejemplo conceptual:

```ts
validateSearch: (search) => ({
  id: typeof search.id === 'string'
    ? search.id
    : undefined,
})
```

La resolución real seguirá siendo responsabilidad del servidor o de una función protegida.

### 7.3 Función privada

Crear preferentemente una función de servidor o loader que:

1. reciba el `id`;
2. valide su formato;
3. consulte solamente ese registro;
4. compruebe `active`;
5. aplique normalización;
6. devuelva un invitado público;
7. registre errores internos sin exponer el valor completo del enlace.

La consulta no podrá solicitar ni serializar la tabla completa.

### 7.4 Error handling

Ante fallas técnicas de almacenamiento:

- no se mostrará una invitación genérica que pueda parecer confirmación válida;
- se registrará el error en el mecanismo existente de logging;
- se mostrará el componente de error del proyecto;
- no se filtrará el nombre del registro ni el identificador.

Solo ante formato inexistente o inválido se usará la invitación genérica.

---

## 8. Integración con componentes existentes

### 8.1 `InvitationExperience`

No requiere que el componente conozca bases de datos o IDs.

Debe:

- aceptar el objeto recibido;
- pasar `companionLimit`;
- pasar `invitationLabel` cuando corresponda;
- seguir controlando música y entrada;
- conservar el comportamiento actual para invitados genéricos.

El contrato nuevo debe mantener compatibilidad con `guest = null`.

### 8.2 `EntryPortal`

Actualizar únicamente si se necesitan ajustes derivados de los datos normalizados.

Comportamiento esperado:

- `personal`: mostrar “Pase personal”;
- `1 persona`: mostrar “Pase para 1 persona”;
- `N personas`: mostrar “Pase para N personas”;
- `ilimitado`: mostrar “Cantidad de asistentes por confirmar”;
- genérico: mostrar “Nuestros queridos invitados”.

El nombre recibido deberá limpiarse antes de guardar o renderizar para evitar texto vacío.

### 8.3 `BasicAttendance`

Mantener la validación existente y añadir:

- tratamiento explícito de límite cero;
- tratamiento explícito de cantidad ilimitada;
- mensaje de error si el límite no coincide con la estructura;
- indicador que explique cuántos acompañantes están disponibles;
- inclusión del nombre asociado al enlace en el mensaje solo cuando esté configurado.

No será necesario registrar el `id` en el formulario si el nombre recibido ya identifica de manera visible la invitación familiar.

### 8.4 Mensaje de WhatsApp

Mantener el formato prellenado:

```text
Confirmación de asistencia - Blanca Lourdes
Invitación: Nombre asociado
Nombre: Nombre capturado
Asistencia: Sí, asistiré
Acompañantes: N
Mensaje: Texto opcional
```

Para ilimitado:

```text
Total de asistentes (incluida la persona que confirma): N
```

Antes de enviar:

- verificar el número internacional configurado;
- usar `encodeURIComponent`;
- conservar la apertura en nueva pestaña;
- evitar enviar si el número no está configurado;
- no marcar la respuesta como registrada al enviar el enlace.

---

## 9. Preparación de datos reales

### 9.1 Normalizar archivos fuente

Crear una copia privada de trabajo a partir de los dos archivos actuales.

No editar los archivos originales como datos de producción.

La preparación debe:

1. eliminar numeración y viñetas;
2. eliminar caracteres Unicode invisibles;
3. eliminar espacios iniciales y finales;
4. normalizar nombres;
5. separar nombre y cantidad;
6. corregir formatos de persona;
7. marcar valores desconocidos;
8. asignar identificadores nuevos;
9. generar una tabla de revisión.

### 9.2 Detección de casos dudosos

El generador deberá marcar como pendientes:

- cantidad sin número;
- cantidad con paréntesis;
- `2personas`;
- texto incompatible;
- nombre vacío;
- nombre con solo iniciales;
- nombre con abreviaturas ambiguas;
- filas donde el número no pueda confirmarse;
- posibles nombres duplicados.

No debe completar automáticamente estos casos.

### 9.3 Generar identificadores

La generación debe usar una fuente criptográficamente aleatoria disponible en el entorno.

Ejemplo conceptual:

```text
16 caracteres
[A-Z][a-z][0-9]
```

Cada ID generado debe comprobarse contra:

- registros existentes;
- registros nuevos;
- códigos previamente usados;
- longitud exacta;
- regex ASCII.

### 9.4 Tabla de revisión

Generar temporalmente columnas privadas:

| Campo | Uso |
|---|---|
| `source` | personal o familiar |
| `source_line` | línea original |
| `raw_name` | nombre antes de limpieza |
| `raw_quantity` | cantidad antes de limpieza |
| `normalized_name` | nombre final propuesto |
| `normalized_quantity` | cantidad final propuesta |
| `status` | pendiente, revisado o rechazado |
| `issue` | descripción del problema |

Esta tabla no debe exponerse ni desplegarse.

### 9.5 Importación

Solo se importarán registros con:

- ID único;
- nombre válido;
- cantidad reconocida;
- límite calculado;
- revisión humana completada.

Los registros personales se podrán importar después de revisar duplicados.

Los familiares se podrán importar después de revisar nombres y totales.

---

## 10. Limpieza y seguridad

### 10.1 Protección de archivos

En el repositorio no deben quedar:

- nombres reales;
- códigos reales;
- archivos CSV privados;
- enlaces individuales;
- exportaciones de revisión;
- capturas que contengan datos reales.

Los archivos fuente actuales pueden conservarse si el repositorio privado los protege, pero se recomienda no incluirlos en documentación ni subproductos públicos.

### 10.2 Protección del despliegue

No crear archivos bajo `public/`.

Si se usa una base de datos:

- habilitar acceso por políticas;
- impedir consultas públicas masivas;
- exponer únicamente el registro solicitado;
- usar funciones de servidor o middleware correspondiente;
- desactivar el acceso directo desde el navegador a tablas privadas.

### 10.3 Logging

No registrar:

- URL completa;
- lista de invitados;
- códigos completos;
- nombres asociados;
- respuestas de WhatsApp.

Si se registra un identificador inválido en logs internos, deberá estar truncado o anonimizado.

### 10.4 Control de enlaces

Antes de compartir:

- comprobar que el enlace abre el nombre correcto;
- comprobar que el enlace muestra el pase correcto;
- desactivar enlaces temporales;
- conservar una relación privada entre invitado y enlace;
- evitar reutilizar IDs.

---

## 11. Pruebas

### 11.1 Prueba de resolución

Agregar pruebas unitarias independientes para:

- ID válido;
- ID con 15 caracteres;
- ID con 17 caracteres;
- ID con guion;
- ID con espacio;
- ID con Unicode;
- ID inexistente;
- ID repetido;
- registro inactivo;
- registro sin nombre;
- registro sin cantidad.

Todas deben producir un resultado seguro y determinista.

### 11.2 Prueba de cantidades

Agregar una tabla de casos para:

- `personal`;
- `1 persona`;
- `2 personas`;
- `3 personas`;
- `5 personas`;
- `ilimitado`;
- mayúsculas y minúsculas;
- espacios externos;
- `2personas`;
- número negativo;
- número cero;
- decimal;
- texto desconocido;
- cadena vacía.

### 11.3 Prueba de ruta

Modificar `src/test/app-routing.test.tsx` para comprobar:

- `/` continúa resolviendo una ruta válida;
- `/` sin `id` usa invitado genérico;
- `/` con `id` válido pasa el invitado correcto;
- `/` con `id` inválido usa el invitado genérico;
- `/` con duplicación de `id` usa el primer valor.

Las pruebas no pueden contener nombres ni identificadores reales.

### 11.4 Prueba de portal

Verificar con componentes o snapshots controlados:

- nombre personalizado;
- etiqueta personal;
- cantidad familiar;
- cantidad ilimitada;
- invitación genérica;
- apertura de música desde el gesto;
- conservación del estilo actual.

No será necesaria una prueba visual exhaustiva si se puede ejecutar una revisión manual.

### 11.5 Prueba del formulario RSVP

Verificar:

- nombre obligatorio;
- asistencia obligatoria;
- límite personal cero;
- límite familiar exacto;
- total ilimitado mínimo uno;
- total ilimitado entero;
- máximo familiar rechazada;
- mensaje prellenado;
- apertura de WhatsApp;
- número vacío deshabilitado;
- popup bloqueado informado al usuario.

### 11.6 Prueba de privacidad

Verificar:

- no existe respuesta que liste todos los invitados;
- no se incluye el CSV en el bundle;
- un identificador válido no puede solicitar otro invitado;
- no se filtran nombres en logs;
- la documentación no contiene datos reales;
- las URLs de prueba no aparecen en evidencia pública.

---

## 12. Secuencia de ejecución

### Fase 1: preparación

**Objetivo:** obtener datos normalizados sin integrar todavía lógica de invitación.

Tareas:

- revisar los archivos marcados;
- crear copia privada de trabajo;
- limpiar caracteres y formatos;
- crear tabla de casos dudosos;
- identificar nombres duplicados;
- generar borrador de identificadores;
- validar totales.

Criterio de salida:

- todos los registros tienen estado pendiente o revisado;
- no quedan cantidades desconocidas;
- los identificadores borrador son únicos.

### Fase 2: modelo privado

**Objetivo:** crear el almacenamiento y los tipos.

Tareas:

- solicitar a Lovable la creación del esquema;
- crear índices únicos;
- definir reglas de activación;
- crear tipos TypeScript;
- crear adaptador servidor;
- definir invitado genérico.

Criterio de salida:

- existe una única interfaz pública de invitado;
- la aplicación puede consultar un registro por ID;
- no existe acceso público masivo.

### Fase 3: resolución

**Objetivo:** conectar el ID con la experiencia.

Tareas:

- modificar `src/routes/index.tsx`;
- crear la función privada de resolución;
- validar formato;
- consultar el registro activo;
- transformar la cantidad;
- pasar `guest` a `InvitationExperience`.

Criterio de salida:

- cada enlace válido muestra su invitado;
- cada enlace inválido muestra el invitado genérico;
- el catálogo completo permanece privado.

### Fase 4: adaptación visual

**Objetivo:** adaptar etiquetas sin rediseñar.

Tareas:

- ajustar `EntryPortal`;
- ajustar pase personal;
- ajustar pases familiares;
- ajustar cantidad ilimitada;
- ajustar invitado genérico;
- revisar estados móviles.

Criterio de salida:

- la etiqueta coincide con `companionLimit`;
- no se permite acompañante en `personal`;
- la invitación genérica conserva el diseño actual.

### Fase 5: RSVP

**Objetivo:** completar el flujo de WhatsApp.

Tareas:

- configurar `confirmationWhatsappNumber`;
- revisar validaciones;
- confirmar el mensaje;
- mantener el aviso de envío manual;
- revisar bloqueo de ventanas emergentes;
- probar confeti únicamente para asistencia positiva.

Criterio de salida:

- el número está configurado;
- el mensaje contiene los datos correctos;
- el formulario rechaza cantidades superiores;
- el sitio no afirma haber enviado ni registrado la respuesta.

### Fase 6: importación

**Objetivo:** cargar los datos finales.

Tareas:

- importar registros personales;
- importar registros familiares;
- importar registros ilimitados si existen;
- activar solamente registros revisados;
- desactivar datos temporales;
- generar enlaces finales privados.

Criterio de salida:

- 93 registros personales están revisados;
- 54 grupos familiares están revisados;
- todos los pases totales coinciden;
- no existen IDs duplicados.

### Fase 7: validación

**Objetivo:** verificar todo el flujo.

Tareas:

- ejecutar pruebas;
- ejecutar build;
- ejecutar lint;
- probar en móvil;
- probar enlaces ficticios;
- probar WhatsApp;
- revisar privacidad;
- revisar metadatos y SEO.

Criterio de salida:

- build y pruebas correctos;
- casos críticos validados;
- no existen datos reales en resultados públicos.

### Fase 8: activación

**Objetivo:** publicar y compartir de manera controlada.

Tareas:

- desplegar;
- probar una invitación real;
- confirmar el enlace en WhatsApp;
- probar tres tipos de pases;
- compartir un número reducido de enlaces;
- mantener una lista privada de distribución;
- desactivar pruebas temporales.

Criterio de salida:

- el flujo está operativo;
- los enlaces privados funcionan;
- no quedan registros temporales activos.

---

## 13. Archivos que se modificarán

| Archivo | Cambio esperado |
|---|---|
| `src/routes/index.tsx` | leer y resolver el parámetro `id` |
| `src/lib/config.ts` | agregar el número real de WhatsApp |
| `src/components/invitation/invitation-experience.tsx` | conservar el contrato del invitado |
| `src/components/invitation/entry-portal.tsx` | ajustar etiquetas derivadas del límite |
| `src/components/invitation/basic-attendance.tsx` | reforzar validaciones y mensaje |
| `src/test/app-routing.test.tsx` | añadir pruebas de rutas personalizadas |
| nuevo módulo privado | validación, resolución y normalización |
| nuevos tests privados | cantidades, IDs y privacidad |

No se espera modificar los componentes decorativos ni la paleta salvo que se identifique un problema visual específico.

---

## 14. Comandos de validación

Ejecutar desde la raíz del proyecto:

```sh
npm test
npm run lint
npm run build
npm run dev
```

Si el entorno usa pnpm o Bun, utilizar el gestor ya bloqueado por el proyecto.

Antes de la entrega final, ejecutar al menos:

- todas las pruebas unitarias;
- la prueba de routing;
- la revisión de build;
- una prueba manual en móvil;
- una prueba manual en WhatsApp;
- una revisión de privacidad.

---

## 15. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| CSV expuesto al navegador | resolver en servidor y mantener fuera de `public/` |
| IDs secuenciales o predecibles | generar IDs aleatorios de 16 caracteres |
| Duplicados | usar restricción única y validar antes de importar |
| Cantidad mal interpretada | usar normalizador cerrado y revisión humana |
| `personal` permite acompañantes | convertir explícitamente a límite cero |
| Nombre o cantidad incompleta | marcar como pendiente y no importar |
| WhatsApp bloqueado | informar al usuario y habilitar intentos manuales |
| Logs con enlaces reales | registrar eventos sin el parámetro `id` |
| Datos reales en el repositorio | usar fuentes privadas y revisión antes de cada commit |
| Cambio de base de datos | mantener una interfaz única para el adaptador |

---

## 16. Criterios de finalización

El plan estará terminado cuando:

1. `id` válido devuelve un invitado personalizado.
2. `id` inválido devuelve invitación genérica.
3. el catálogo completo no es accesible desde el cliente.
4. cada registro tiene identificador único.
5. `personal` tiene cero acompañantes.
6. los familiares reciben `N - 1` acompañantes.
7. ilimitado pide el total real.
8. WhatsApp abre con el mensaje esperado.
9. no se almacenan confirmaciones sin indicarlo.
10. los nombres reales no aparecen en pruebas ni documentación pública.
11. las fuentes privadas no están en `public/`.
12. las pruebas pasan.
13. el build pasa.
14. el flujo fue probado en móvil.
15. los enlaces temporales fueron desactivados.

---

## 17. Orden recomendado de inicio

La primera unidad de trabajo debe ser:

1. crear el modelo normalizado;
2. crear funciones puras de validación;
3. crear pruebas con datos ficticios;
4. implementar la resolución privada;
5. integrar `guest` en la ruta;
6. configurar WhatsApp;
7. limpiar e importar datos reales;
8. validar enlaces y compartir.

Este orden permite verificar la lógica antes de incorporar nombres reales o generar enlaces de distribución.
