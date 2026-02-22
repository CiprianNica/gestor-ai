const fileInput = document.getElementById('ticket-upload');
const preview = document.getElementById('preview');
const processBtn = document.getElementById('process-btn');
const resultsArea = document.getElementById('results');
const loader = document.getElementById('loader');

// Al seleccionar imagen
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            processBtn.disabled = false; // Activamos el botón de procesar
        };
        reader.readAsDataURL(file);
    }
});

// Al pulsar el botón de procesar
processBtn.addEventListener('click', async () => {
    loader.style.display = 'block';
    processBtn.disabled = true;
    resultsArea.innerHTML = '<p>Los agentes de IA están analizando tu ticket...</p>';

    // Aquí haremos el FETCH al backend más adelante
    // setTimeout simulando espera del servidor
    setTimeout(() => {
        loader.style.display = 'none';
        resultsArea.innerHTML = `
            <div style="text-align: left; background: #f9fafb; padding: 10px; border-radius: 8px;">
                <p><strong>Comercio:</strong> ---</p>
                <p><strong>Total:</strong> ---</p>
                <p><strong>Categoría:</strong> ---</p>
            </div>
        `;
    }, 2000);
});