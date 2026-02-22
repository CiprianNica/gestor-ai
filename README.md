![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)

# GestorAI

Aplicación web para capturar tickets de compra con el móvil y extraer automáticamente los datos (comercio, importe, fecha y categoría) usando IA de visión.

## Arquitectura

```
frontend (Nginx)  →  backend (FastAPI)  →  Groq Vision AI
                          ↓
                    PostgreSQL
```

| Servicio | Tecnología | Puerto |
|---|---|---|
| Frontend | HTML + CSS + JS (Nginx) | 8080 |
| Backend | Python + FastAPI | 8000 |
| Base de datos | PostgreSQL 15 | 5432 |

## Inicio Rapido

### 1. Clonar el repositorio

```bash
git clone https://github.com/CiprianNica/gestor-ai.git
cd gestor-ai
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y rellena:
- `DB_PASSWORD` — contraseña de PostgreSQL
- `GROQ_API_KEY` — API key gratuita de [console.groq.com](https://console.groq.com)

### 3. Levantar el stack

```bash
docker compose up -d
```

| URL | Descripcion |
|---|---|
| http://localhost:8080 | Interfaz web |
| http://localhost:8000/docs | API Swagger UI |

## Estructura del Proyecto

```
gestor-ai/
├── backend/         ← FastAPI + Groq Vision
├── frontend/        ← Interfaz web estatica
├── database/        ← Schema SQL y configuracion
├── docker-compose.yml
├── .env.example
└── README.md
```

## Ramas de Desarrollo

```
main   ← versiones estables
 └── dev   ← integracion continua
      ├── feat/database
      ├── feat/frontend
      └── feat/backend
```
