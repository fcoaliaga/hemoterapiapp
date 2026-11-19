# HemoterapiApp

Aplicación de apoyo para enfermería y técnicos de laboratorio de banco de sangre: compatibilidad de componentes, algoritmos de pruebas pretransfusionales, estudio de anticuerpos irregulares, teoría básica e informe final con trazabilidad.

> **Aviso.** Es una herramienta de apoyo. No sustituye a los procedimientos normalizados de trabajo (PNT) del centro, al sistema informático del banco de sangre ni al criterio del hematólogo responsable. **El servicio debe validar su contenido antes de usarla en la asistencia.**

---

## Qué hace

| Pantalla | Contenido |
|---|---|
| **Compatibilidad** (en el móvil, «Grupos») | Con el grupo ABO/Rh del paciente y el componente (hematíes, plasma o plaquetas), indica qué grupos se pueden transfundir: 1.ª elección, compatible, condicional o incompatible. Opción para mujer en edad fértil o niña. |
| **Algoritmos** | Guías paso a paso: solicitud de concentrado de hematíes, paciente Rh negativo (Du → escrutinio en Coombs → ampliado con enzimas: papaína en Bio-Rad, ficina en Ortho) y estudio de anticuerpos irregulares. |
| **Anticuerpos** | Calculadora de unidades a fenotipar según los anticuerpos identificados. Tabla de significación clínica y efecto de la papaína. |
| **Técnica** | Selector de **reactivos** (Bio-Rad ID-System o Ortho BioVue) y **equipo** (manual, IH-500, IH-1000, ORTHO VISION, VISION Max u otro). Pasos de cada prueba manual adaptados al sistema elegido y lectura de reacciones. |
| **Urgencia** | Qué transfundir con grupo desconocido o escrutinio pendiente. |
| **Teoría** | 14 temas para personal sin experiencia (ABO, donantes y receptores universales, Rh, D débil, anticuerpos, Coombs, papaína, gel, administración segura, reacciones transfusionales…), glosario y ejercicio de autoevaluación. |
| **Informe** (botón de la cabecera) | Informe con datos del paciente, muestra, resultados y bolsas; comprueba la compatibilidad de cada unidad y avisa de errores. Historial con búsqueda por paciente o n.º de bolsa. |
| **Ayuda** (botón de la cabecera) | Guía de uso, criterios aplicados y bibliografía. |

---

## Archivos del proyecto

```
hemoterapiapp/
├── index.html     ← La app completa (fuente). Es lo único que se edita.
├── build-web.js   ← Genera la versión web instalable en la carpeta web/
├── web/           ← Versión para publicar en Netlify (generada; no editar a mano)
│   ├── index.html
│   ├── manifest.webmanifest   (datos para instalarla como app)
│   ├── sw.js                  (uso sin conexión)
│   ├── icon-192.png, icon-512.png, apple-touch-icon.png
│   └── _headers               (cabeceras de seguridad para Netlify)
├── .claude/       ← Configuración de pruebas local. No publicar.
└── README.md
```

La app es un único archivo HTML sin dependencias externas: no carga nada de internet ni se conecta a ningún servidor.

---

## Cómo abrirla

| Dónde | Cómo | Limitaciones |
|---|---|---|
| **Ordenador** | Doble clic en `index.html`. | Ninguna. |
| **Android, con el archivo** | Copiar `index.html` al móvil y abrirlo con Chrome o Firefox. | El historial puede no conservarse. Evitar los visores HTML del sistema. |
| **iPhone, con el archivo** | No funciona: la vista previa de Archivos no ejecuta la app. | Usar la versión web. |
| **Cualquier móvil, versión web** | Abrir la dirección de Netlify e instalarla con «Añadir a pantalla de inicio». | Hace falta internet la primera vez; después funciona sin conexión. |
| **Enlace privado de claude.ai** | Abrir el enlace con sesión de Claude iniciada. | No permite imprimir, guardar PDF ni exportar; necesita conexión. |

---

## Publicar o actualizar la versión web (Netlify)

1. Edita `index.html` (o pide los cambios).
2. Regenera la carpeta `web/`:

   ```bash
   node build-web.js
   ```

   Requiere Node.js. No necesita instalar paquetes.
3. En Netlify, con la sesión iniciada:
   - **Primera vez:** arrastra la carpeta `web` a [app.netlify.com/drop](https://app.netlify.com/drop) y cambia el nombre del sitio en *Site configuration → Change site name*.
   - **Actualizaciones:** entra en el sitio → pestaña **Deploys** → arrastra de nuevo la carpeta `web`.

Los móviles reciben la versión nueva la siguiente vez que abren la app con conexión.

> Sube **solo la carpeta `web`**, nunca la carpeta del proyecto completa: `.claude/` contiene rutas de tu ordenador.

---

## Adaptar el contenido al protocolo del centro

El contenido clínico está en constantes dentro del `<script>` de `index.html`. Casi todas están en el bloque marcado `DATOS`, al inicio del script; `THEORY` está más abajo, en el bloque `TEORÍA BÁSICA`.

| Constante | Qué contiene |
|---|---|
| `ABO`, `AG` | Grupos y antígenos (base de toda la compatibilidad). |
| `ABS` | Anticuerpos: sistema, frecuencia antigénica, significación clínica y efecto de las enzimas. |
| `SYSTEMS` | Reactivos, cassettes/tarjetas, volúmenes, tiempos y analizadores de cada fabricante (Bio-Rad, Ortho). Para añadir otro fabricante, se copia un bloque y se cambian los textos. |
| `NODES`, `FLOWS` | Pasos y conclusiones de los algoritmos. Las marcas `{{clave}}` se rellenan con el sistema de reactivos elegido. |
| `TECH` | Técnicas en tarjeta de gel. |
| `THEORY` | Temas de la pestaña Teoría. |

Las reglas de compatibilidad están en la función `evalCell`.

---

## Pendiente de validar por el servicio

- Interpretación del protocolo de Rh negativo: Du + escrutinio en Coombs + ampliado en papaína si es negativo. Confirmada por el autor; falta contrastarla con el PNT.
- Manejo del **D débil como receptor**: ahora se trata como Rh negativo.
- **Volúmenes, tiempos y nombres de reactivos** de Bio-Rad y de Ortho: orientativos, a cotejar con los insertos del lote en uso. En Ortho, en particular: volúmenes del Du, programa de centrifugación y producto usado para el escrutinio con ficina (no hay un juego de escrutinio tratado con ficina confirmado en catálogo).
- **Frecuencias** de grupos y antígenos, y **tiempos de conservación**: aproximados.
- Apartado de **administración segura**: debe coincidir con el protocolo de enfermería.
- La bibliografía (pestaña Ayuda) recoge las fuentes de referencia, pero el contenido **no se ha cotejado dato a dato** con ellas. Algunas ediciones citadas pueden no ser las vigentes.

No cubre neonatos (< 4 meses), trasplante de progenitores con cambio de grupo ni requerimientos especiales (irradiado, lavado, fenotipo ampliado).

---

## Privacidad y seguridad

- La app **no envía datos a ningún servidor**. Los informes se guardan solo en el navegador del dispositivo donde se generan, **sin cifrar**.
- Quien tenga acceso al dispositivo desbloqueado puede ver el historial. Recomendaciones:
  - Usar bloqueo de pantalla.
  - Identificar al paciente por n.º de historia en lugar del nombre cuando sea posible.
  - Borrar los informes que ya no se necesiten.
- El historial se pierde si se borran los datos del navegador. Desde el ordenador o la versión web se puede guardar una copia con **Exportar copia**.
- El registro oficial de la transfusión es el del sistema del banco de sangre; el informe de la app no lo sustituye.
- El uso con datos reales de pacientes debe contar con la aprobación del responsable de protección de datos del centro.
- La versión web incluye cabeceras de seguridad (`web/_headers`) que impiden conectar con otras webs, incrustar la app en otra página y acceder a cámara, micrófono o ubicación.
- La dirección web es pública: cualquiera que la tenga puede usar la app, pero no verá datos de nadie.
