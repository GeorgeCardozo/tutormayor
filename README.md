# TutorMayor

Reconstrucción visual de las cinco vistas principales de TutorMayor a partir del ZIP de Stitch entregado para este proyecto.

## Páginas

| Ruta | Referencia |
| --- | --- |
| `/` | `references/inicio.png` |
| `/como-funciona/` | `references/como-funciona.png` |
| `/explorar-tutores/` | `references/explorar-tutores.png` |
| `/materias/` | `references/materias.png` |
| `/ser-tutor/` | `references/ser-tutor.png` |
| `/iniciar-sesion/` | Vista complementaria incluida en el ZIP |

La landing, las páginas interiores, el logo, la mascota, las fotos y el contenido visible proceden de los exports de Stitch. El proyecto guarda los assets localmente en `public/assets`; la compilación no descarga nada.

## Ejecutar

```bash
npm install
npm run dev
```

`npm run dev` compila y sirve la versión de revisión. Después de editar, reinicia ese comando para ver los cambios. La compilación de entrega se verifica con:

```bash
npm run build
```

## Estructura

- `stitch/`: HTML exportado que se usa como fuente de secciones y tokens visuales.
- `scripts/generate.mjs`: extrae el contenido visual, sustituye assets remotos por archivos locales y genera rutas y paletas sin ejecutar los scripts de los exports.
- `src/main.jsx`: cabecera, navegación y pie reutilizables en React.
- `src/site-interactions.js`: búsqueda, filtros, selector de roles, preguntas frecuentes, calculadora y modales.
- `src/site.css`: ajustes responsive y de accesibilidad.
- `screenshots/`: capturas de la implementación usadas en la comparación visual.

Los formularios validan datos en la interfaz, pero no envían solicitudes ni autentican usuarios: el ZIP no contiene un backend. Los textos y cifras visibles se conservan de la maqueta; no son datos verificados del servicio.
