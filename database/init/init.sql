CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    comercio VARCHAR(255),
    importe DECIMAL(10, 2),
    fecha_ticket DATE,
    categoria VARCHAR(100),
    raw_text TEXT,
    url_foto VARCHAR(255), -- <--- AQUÍ: La ruta a la imagen
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);