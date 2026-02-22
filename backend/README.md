# GestorAI - Backend

API REST construida con FastAPI que recibe imágenes de tickets, las analiza con IA de visión (Groq) y guarda los datos en PostgreSQL.

## Tecnologías

- **FastAPI** + **Uvicorn** — servidor REST con hot-reload.
- **Groq Vision** (`llama-4-scout`) — extracción de datos del ticket.
- **SQLAlchemy** + **PostgreSQL** — persistencia de datos.
- **Docker** — todo el entorno corre en contenedor, sin instalar nada localmente.

## Estructura

```
backend/
├── app/
│   ├── main.py          ← Endpoints FastAPI
│   ├── config.py        ← Variables de entorno
│   ├── database.py      ← Conexión SQLAlchemy
│   ├── models.py        ← ORM tabla tickets
│   ├── schemas.py       ← Schemas Pydantic
│   └── services/
│       ├── vision.py    ← Llamada a Groq Vision API
│       └── tickets.py   ← CRUD base de datos
├── Dockerfile
└── requirements.txt
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Estado del servicio |
| `POST` | `/tickets/upload` | Sube imagen → analiza con IA → guarda en BD |
| `GET` | `/tickets/` | Lista todos los tickets |
| `GET` | `/tickets/{id}` | Obtiene un ticket por ID |

Documentación interactiva disponible en `http://localhost:8000/docs`.

## Variables de Entorno

```env
DB_URL=postgresql://user:password@db:5432/gestor_ai_db
GROQ_API_KEY=tu_api_key_de_groq
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```

Obtén tu API key gratuita en [console.groq.com](https://console.groq.com).

## Levantar con Docker

```bash
docker compose up -d --build backend
```