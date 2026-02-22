from sqlalchemy.orm import Session
from app.models import Ticket


def save_ticket(db: Session, parsed_data: dict, raw_text: str, url_foto: str) -> Ticket:
    """Guarda un ticket procesado en la base de datos."""
    ticket = Ticket(
        comercio=parsed_data.get("comercio"),
        importe=parsed_data.get("importe"),
        fecha_ticket=parsed_data.get("fecha_ticket"),
        categoria=parsed_data.get("categoria"),
        raw_text=raw_text,
        url_foto=url_foto,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def get_tickets(db: Session) -> list[Ticket]:
    """Devuelve todos los tickets."""
    return db.query(Ticket).order_by(Ticket.fecha_creacion.desc()).all()


def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket | None:
    """Devuelve un ticket por su ID."""
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()
