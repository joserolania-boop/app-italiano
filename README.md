# Maestro Italiano

App web local basada en el roadmap `Roadmap_Maestro_Italiano.md` para trabajar el recorrido A1-C2 con progreso guardado en navegador.

## Incluye

- Navegador por modulos y niveles.
- Sesion PAL fija por nivel.
- Prompt diario copiable.
- Evaluacion automatica de reglas de desbloqueo por modulo.
- Notas de sesion y progreso persistente con `localStorage`.
- Sugerencias de `Self-Refine` a partir del bloque de patches del roadmap.
- Entrenador interactivo completo para `M1-L1` a `M1-L10` con `TI`, `CH`, `CR`, `SH` y `MP` segun el nivel.
- Correccion basica dentro de la app para respuestas escritas, huecos, elecciones y shadowing marcado.

## Arranque rapido en Windows

```powershell
./start-local.ps1
```

Esto abre `http://localhost:8080` y sirve los archivos con Python.

## Uso sin servidor

Tambien puedes abrir `index.html` directamente y usar el boton `Cargar roadmap manualmente` para importar el archivo markdown.