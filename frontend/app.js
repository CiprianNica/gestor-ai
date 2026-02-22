const BACKEND = "http://localhost:8000";

// --- Elementos ---
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
const preview = document.getElementById("preview");
const processBtn = document.getElementById("process-btn");
const loader = document.getElementById("loader");
const results = document.getElementById("results");

// Cámara
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startCamBtn = document.getElementById("start-camera-btn");
const captureBtn = document.getElementById("capture-btn");
const retakeBtn = document.getElementById("retake-btn");

// Archivos
const fileInput = document.getElementById("ticket-upload");

// Otros
const pasteArea = document.getElementById("paste-area");

let currentFile = null;
let cameraStream = null;

// ============================================================
// TABS
// ============================================================
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");

        // Parar cámara si salimos de ese tab
        if (tab.dataset.tab !== "camera") stopCamera();
    });
});

// ============================================================
// TAB CÁMARA
// ============================================================
startCamBtn.addEventListener("click", async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = cameraStream;
        video.style.display = "block";
        startCamBtn.style.display = "none";
        captureBtn.style.display = "inline-block";
    } catch (err) {
        alert("No se pudo acceder a la cámara: " + err.message);
    }
});

captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
        setFile(blob, "captura.jpg");
    }, "image/jpeg", 0.9);
    video.style.display = "none";
    captureBtn.style.display = "none";
    retakeBtn.style.display = "inline-block";
    stopCamera();
});

retakeBtn.addEventListener("click", async () => {
    clearFile();
    retakeBtn.style.display = "none";
    video.style.display = "block";
    captureBtn.style.display = "none";
    startCamBtn.click();
});

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        cameraStream = null;
    }
}

// ============================================================
// TAB ARCHIVOS
// ============================================================
fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) setFile(fileInput.files[0]);
});

// ============================================================
// TAB OTROS (pegar imagen con Ctrl+V o drag & drop)
// ============================================================
document.addEventListener("paste", e => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
        if (item.type.startsWith("image/")) {
            setFile(item.getAsFile(), "pegado.jpg");
            break;
        }
    }
});

pasteArea.addEventListener("dragover", e => {
    e.preventDefault();
    pasteArea.classList.add("drag-over");
});
pasteArea.addEventListener("dragleave", () => pasteArea.classList.remove("drag-over"));
pasteArea.addEventListener("drop", e => {
    e.preventDefault();
    pasteArea.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setFile(file);
});

// ============================================================
// HELPERS
// ============================================================
function setFile(blob, name) {
    currentFile = blob instanceof File ? blob : new File([blob], name || "foto.jpg", { type: "image/jpeg" });
    const url = URL.createObjectURL(currentFile);
    preview.src = url;
    preview.style.display = "block";
    processBtn.disabled = false;
    results.innerHTML = "";
}

function clearFile() {
    currentFile = null;
    preview.src = "";
    preview.style.display = "none";
    processBtn.disabled = true;
    results.innerHTML = "";
}

// ============================================================
// ANALIZAR
// ============================================================
processBtn.addEventListener("click", async () => {
    if (!currentFile) return;

    processBtn.disabled = true;
    loader.style.display = "block";
    results.innerHTML = "";

    try {
        const form = new FormData();
        form.append("file", currentFile);

        const res = await fetch(`${BACKEND}/tickets/upload`, { method: "POST", body: form });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        results.innerHTML = `
            <div class="result-row"><span class="result-label">Comercio</span><span class="result-value">${data.comercio ?? "---"}</span></div>
            <div class="result-row"><span class="result-label">Total</span><span class="result-value">${data.importe != null ? data.importe + " €" : "---"}</span></div>
            <div class="result-row"><span class="result-label">Fecha</span><span class="result-value">${data.fecha_ticket ?? "---"}</span></div>
            <div class="result-row"><span class="result-label">Categoría</span><span class="result-value">${data.categoria ?? "---"}</span></div>
        `;
    } catch (err) {
        results.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    } finally {
        loader.style.display = "none";
        processBtn.disabled = false;
    }
});
