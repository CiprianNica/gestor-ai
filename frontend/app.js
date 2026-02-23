// En producción apunta al backend de Render, en local a localhost
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://gestor-ai.onrender.com';

// =====================
// NAVEGACIÓN
// =====================
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(`page-${id}`).classList.add("active");
}

document.getElementById("btn-camera").addEventListener("click", () => showPage("camera"));
document.getElementById("btn-files").addEventListener("click", () => showPage("files"));
document.getElementById("btn-whatsapp").addEventListener("click", () => showPage("whatsapp"));

document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.back));
});

// =====================
// CÁMARA
// =====================
const inputCamera = document.getElementById("input-camera");
inputCamera.addEventListener("change", () => {
    if (inputCamera.files[0]) handleFile(inputCamera.files[0], "camera");
});

// =====================
// ARCHIVOS
// =====================
const inputFiles = document.getElementById("input-files");
inputFiles.addEventListener("change", () => {
    if (inputFiles.files[0]) handleFile(inputFiles.files[0], "files");
});

// =====================
// LÓGICA COMÚN
// =====================
function handleFile(file, source) {
    const previewSection = document.getElementById(`preview-${source}`);
    const uploadZone = document.querySelector(`#page-${source} .upload-zone`);
    const imgUrl = URL.createObjectURL(file);

    // Ocultar el botón de selección cuando hay foto
    if (uploadZone) uploadZone.style.display = "none";

    previewSection.style.display = "flex";
    previewSection.innerHTML = `
        <img src="${imgUrl}" alt="Vista previa">
        <button class="btn-process" id="process-${source}">✨ Analizar con IA</button>
        <button class="btn-change" id="change-${source}">↩ Cambiar imagen</button>
        <div class="loader-dots" id="loader-${source}" style="display:none;"><span></span><span></span><span></span></div>
        <div class="results-area" id="results-${source}"></div>
    `;

    document.getElementById(`process-${source}`).addEventListener("click", () => analyze(file, source));
    document.getElementById(`change-${source}`).addEventListener("click", () => {
        previewSection.style.display = "none";
        previewSection.innerHTML = "";
        document.getElementById(`input-${source}`).value = "";
        // Volver a mostrar el botón de selección
        if (uploadZone) uploadZone.style.display = "";
    });
}

async function analyze(file, source) {
    const processBtn = document.getElementById(`process-${source}`);
    const loader = document.getElementById(`loader-${source}`);
    const results = document.getElementById(`results-${source}`);

    processBtn.disabled = true;
    loader.style.display = "flex";
    results.innerHTML = "";

    try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch(`${API_URL}/tickets/upload`, { method: "POST", body: form });
        if (!res.ok) throw new Error(`Error del servidor (${res.status})`);
        const data = await res.json();

        results.innerHTML = `
            <div class="result-row">
                <span class="result-label">Comercio</span>
                <span class="result-value">${data.comercio ?? "—"}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Total</span>
                <span class="result-value highlight">${data.importe != null ? data.importe + " €" : "—"}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Fecha</span>
                <span class="result-value">${data.fecha_ticket ?? "—"}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Categoría</span>
                <span class="result-value">${data.categoria ?? "—"}</span>
            </div>
        `;
    } catch (err) {
        results.innerHTML = `<div class="error-msg">⚠️ ${err.message}</div>`;
    } finally {
        loader.style.display = "none";
        processBtn.disabled = false;
    }
}
