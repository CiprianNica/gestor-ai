# GestorAI - Frontend

Interfaz web estática para capturar y procesar tickets con agentes de IA.

## Tecnologías
- **HTML/CSS/JavaScript** puro (sin frameworks).
- **Nginx** (Alpine) como servidor dentro de Docker.

## Estructura

```
frontend/
├── index.html   ← Estructura de la página
├── style.css    ← Estilos y diseño
├── app.js       ← Lógica de captura e interacción con el backend
└── README.md
```

## Flujo de Usuario

1. El usuario abre la app en `http://localhost:8080`.
2. Pulsa **"Abrir Cámara / Galería"** para seleccionar una foto del ticket.
3. Se muestra una vista previa de la imagen.
4. Pulsa **"Analizar con Agentes IA"** para enviar la imagen al backend.
5. Se muestran los resultados extraídos (comercio, importe, categoría).

## Levantar el Frontend con Docker

```bash
docker compose up -d frontend
```

Accede en: [http://localhost:8080](http://localhost:8080)

## Notas de Desarrollo
- La llamada al backend en `app.js` está simulada con un `setTimeout`.
- Cuando el backend esté listo, reemplazar el `setTimeout` con un `fetch` al endpoint correspondiente.