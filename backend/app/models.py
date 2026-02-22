from sqlalchemy import Column, Integer, String, Numeric, Date, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base


class Ticket(Base):
    """
    Database model for tickets.
    """
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    comercio = Column(String(255))
    importe = Column(Numeric(10, 2))
    fecha_ticket = Column(Date)
    categoria = Column(String(100))
    raw_text = Column(Text)
    url_foto = Column(String(255))
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
