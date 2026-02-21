# GestorAI - Módulo de Persistencia (Database)

Este módulo gestiona el almacenamiento centralizado de **GestorAI** mediante un contenedor de **PostgreSQL 15**. Está diseñado bajo el principio de "Data-First", asegurando que la estructura de datos soporte el flujo de los agentes de IA.

## Tecnologías
- **Motor:** PostgreSQL (Imagen oficial `alpine` para ligereza).
- **Despliegue:** Docker Container.
- **Persistencia:** Volúmenes locales mapeados para evitar pérdida de datos.

## Modelo de Datos (Esquema SQL)

La base de datos se inicializa automáticamente con el script situado en `./init/init.sql`.

### Tabla: `tickets`
Es la tabla principal donde el **Agente Escritor** guarda los resultados del procesamiento.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Identificador único autoincremental. |
| `comercio` | VARCHAR(255) | Nombre del establecimiento detectado. |
| `importe` | DECIMAL(10,2) | Total de la factura (precisión decimal para finanzas). |
| `fecha_ticket` | DATE | Fecha impresa en el documento. |
| `categoria` | VARCHAR(100) | Clasificación (Alimentación, Ocio, etc.). |
| `raw_text` | TEXT | **Buffer de Auditoría:** El texto bruto extraído por el OCR. |
| `url_foto` | VARCHAR(255) | Ruta al archivo físico guardado en el storage. |
| `fecha_creacion` | TIMESTAMP | Marca de tiempo de la inserción. |

## Operaciones Comunes

### Acceder a la consola de la BD (psql)
Si necesitas entrar manualmente al contenedor para hacer consultas:
```bash
docker exec -it gestor_ai_db psql -U user_gestor -d gestor_ai_db
```

Comandos útiles dentro de `psql`:
```sql
\dt                  -- Listar tablas
\d tickets           -- Ver estructura de la tabla tickets
SELECT * FROM tickets;
\q                   -- Salir
```

## Reiniciar la Base de Datos desde Cero

Si modificas el archivo `init.sql` y quieres que los cambios surtan efecto, debes resetear el volumen:

1. **Detener el servicio:**
   ```bash
   docker compose down
   ```
2. **Eliminar la carpeta de datos:**
   ```bash
   Remove-Item -Recurse -Force .\database\data\
   ```
3. **Levantar el servicio nuevamente:**
   ```bash
   docker compose up -d db
   ```

## Estructura del Directorio

```
database/
├── init/         ← Scripts SQL de inicialización automática
│   └── init.sql
├── data/         ← Datos persistentes generados por Docker (en .gitignore)
└── README.md     ← Documentación técnica de este módulo
```