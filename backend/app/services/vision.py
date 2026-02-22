import base64
import json
import io
from PIL import Image
from groq import Groq
from app.config import GROQ_API_KEY, GROQ_MODEL

client = Groq(api_key=GROQ_API_KEY)

PROMPT = """Analyze this receipt/ticket image and extract the following fields.
Return ONLY a valid JSON object with these exact keys:
- "comercio": store or business name (string or null)
- "importe": total amount as a number without currency symbol (float or null)
- "fecha_ticket": date in YYYY-MM-DD format (string or null)
- "categoria": spending category in Spanish, one of: Supermercado, Restaurante, Farmacia, Ropa, Transporte, Ocio, Otros (string or null)

Example:
{"comercio": "Mercadona", "importe": 23.50, "fecha_ticket": "2026-02-22", "categoria": "Supermercado"}

Return ONLY the JSON, no explanation."""


def image_to_base64(image_bytes: bytes) -> str:
    """Convierte la imagen a base64 JPEG."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def analyze_ticket(image_bytes: bytes) -> dict:
    """Envía la imagen a Groq Vision y devuelve los campos del ticket."""
    image_b64 = image_to_base64(image_bytes)

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_b64}"
                        },
                    },
                    {
                        "type": "text",
                        "text": PROMPT,
                    },
                ],
            }
        ],
        max_tokens=300,
    )

    raw = response.choices[0].message.content or ""

    try:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        return json.loads(raw[start:end])
    except (json.JSONDecodeError, ValueError):
        return {
            "comercio": None,
            "importe": None,
            "fecha_ticket": None,
            "categoria": None,
        }
