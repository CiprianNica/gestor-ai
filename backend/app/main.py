from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from pathlib import Path
import uuid

from app.database import get_db
from app.schemas import TicketResponse
from app.services import vision, tickets
from app.config import UPLOADS_DIR

app = FastAPI(title="GestorAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carpeta donde se guardan las fotos (configurada en .env → UPLOADS_DIR)
UPLOADS_PATH = Path(UPLOADS_DIR)
UPLOADS_PATH.mkdir(parents=True, exist_ok=True)


@app.get("/")
def root():
    return {"status": "GestorAI backend en marcha", "engine": "Groq Vision"}


@app.post("/tickets/upload", response_model=TicketResponse)
async def upload_ticket(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Recibe una imagen de ticket, la analiza con Groq Vision y guarda en BD."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")

    image_bytes = await file.read()

    # Guardar la imagen en disco con nombre único para evitar colisiones
    extension = Path(file.filename).suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOADS_PATH / filename
    file_path.write_bytes(image_bytes)

    # Analizar imagen con modelo de visión
    parsed_data = vision.analyze_ticket(image_bytes)

    # Convertir fecha si viene como string
    fecha = parsed_data.get("fecha_ticket")
    if isinstance(fecha, str):
        try:
            parsed_data["fecha_ticket"] = date.fromisoformat(fecha)
        except ValueError:
            parsed_data["fecha_ticket"] = None

    ticket = tickets.save_ticket(
        db=db,
        parsed_data=parsed_data,
        raw_text=str(parsed_data),
        url_foto=filename,
    )

    return ticket


@app.get("/tickets/", response_model=list[TicketResponse])
def list_tickets(db: Session = Depends(get_db)):
    return tickets.get_tickets(db)


@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = tickets.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado.")
    return ticket
