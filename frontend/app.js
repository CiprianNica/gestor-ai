const fileInput = document.getElementById('ticket-upload');
const preview = document.getElementById('preview');
const processBtn = document.getElementById('process-btn');
const resultsArea = document.getElementById('results');
const loader = document.getElementById('loader');

// En producción apunta al backend de Render, en local a localhost
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://gestor-ai.onrender.com';

// Al seleccionar imagen
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            processBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

// Al pulsar el botón de procesar
processBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    loader.style.display = 'block';
    processBtn.disabled = true;
    resultsArea.innerHTML = '<p>Procesando ticket con OCR...</p>';

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/tickets/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const ticket = await response.json();

        resultsArea.innerHTML = `
            <div style="text-align: left; background: #f9fafb; padding: 10px; border-radius: 8px;">
                <p><strong>Comercio:</strong> ${ticket.comercio ?? '---'}</p>
                <p><strong>Total:</strong> ${ticket.importe != null ? ticket.importe + ' €' : '---'}</p>
                <p><strong>Fecha:</strong> ${ticket.fecha_ticket ?? '---'}</p>
                <p><strong>Categoría:</strong> ${ticket.categoria ?? '---'}</p>
            </div>
        `;

    } catch (error) {
        resultsArea.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        loader.style.display = 'none';
        processBtn.disabled = false;
    }
});
