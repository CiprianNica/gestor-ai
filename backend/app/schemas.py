from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class TicketResponse(BaseModel):
    id: int
    comercio: Optional[str]
    importe: Optional[float]
    fecha_ticket: Optional[date]
    categoria: Optional[str]
    raw_text: Optional[str]
    url_foto: Optional[str]
    fecha_creacion: Optional[datetime]

    class Config:
        from_attributes = True
