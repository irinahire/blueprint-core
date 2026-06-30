// Usamos window.sbClient que es la instancia única creada en auth-module.js
async function cargarDatos() {
    // Verificamos que sbClient esté disponible
    if (!window.sbClient) {
        console.error("Supabase cliente no disponible.");
        return;
    }

    // Consulta de todos los registros en la tabla habitat
    const { data, error } = await window.sbClient.from('habitat').select('*');
    if (error) { console.error("Error al cargar datos:", error); return; }
    
    const grid = document.getElementById('dashboard');
    grid.innerHTML = ''; // Limpiamos el grid antes de cargar

    data.forEach((row, index) => {
        // Parseo de los datos reales
        const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        
        // Extraemos variables clave de tu estructura real
        const irinaData = d?.["!irina"] || {};
        const score = irinaData?.evaluacion?.score_general || 0;
        
        // Identificamos el job_id para que el filtro del menú funcione
        const job_id = d?.["!vinculo-oferta"]?.job_id || "sin-oferta";
        
        // Selección de clase de color basada en el score
        const clase = score >= 98 ? 'bg-irina-animado' : 
                      (score >= 90 ? 'bg-emerald-metal' : 
                      (score >= 80 ? 'bg-verde' : 
                      (score >= 60 ? 'bg-amarillo' : 
                      (score >= 50 ? 'bg-rojo' : 'bg-marron'))));
        
        const card = document.createElement('div');
        card.className = "blic-card " + clase;
        card.dataset.oferta = job_id; // Necesario para el filtro del menú
        card.onclick = () => abrirModal(row); // Pasamos toda la fila
        
        card.innerHTML = `
            <div style="font-weight:900;">SCORE: ${score}</div>
            <div class="radar-container"><canvas id="radar-${index}"></canvas></div>
            <div class="icons-grid">${['🚀', '🛡️', '🧠', '🔗'].map(i => `<div class="icon-box">${i}</div>`).join('')}</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:5px; margin-top:5px;">
                <button class="btn-card">CV</button>
                <button class="btn-card">AUDIO</button>
                <button class="btn-card">REPORT</button>
            </div>
        `;
        grid.appendChild(card);
        
        // Renderizado del gráfico radar con datos reales si existen
        const subscores = irinaData?.evaluacion?.metricas || { tecnica: 0, experiencia: 0 };
        new Chart(document.getElementById("radar-" + index), { 
            type: 'radar', 
            data: { 
                labels: ['Téc', 'Exp', 'Ada', 'Lid', 'IA'], 
                datasets: [{ 
                    data: [subscores.tecnica || 0, subscores.experiencia || 0, 0, 0, 0], 
                    backgroundColor: 'rgba(255,255,255,0.4)' 
                }] 
            }, 
            options: { plugins: { legend: { display: false } } } 
        });
    });
}

function abrirModal(row) {
    // Parseamos la fila para obtener el JSON completo
    const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    
    // Rutas extraídas de tu JSON de ejemplo
    const perfil = d["!perfil"] || {};
    const base = perfil["perfil-base"] || {};
    const contacto = perfil["perfil-contacto"] || {};
    const habilidades = d["!habilidades"] || {};
    const trayectoria = d["!trayectoria"] || {};
    const psico = d["!psicometrico"] || {};
    
    // Asignación de datos al modal
    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = contacto.email || "Sin email";
    document.getElementById('m-telefono').innerText = contacto.telefono || "Sin teléfono";
    document.getElementById('m-foto').style.backgroundImage = base.foto_url ? `url('${base.foto_url}')` : 'none';
    
    // Trayectoria
    const trayContainer = document.getElementById('m-trayectoria');
    trayContainer.innerHTML = '';
    if (Array.isArray(trayectoria.experiencia)) {
        trayectoria.experiencia.forEach(exp => {
            const p = document.createElement('p');
            p.innerText = exp.descripcion || "Sin descripción";
            trayContainer.appendChild(p);
        });
    } else {
        trayContainer.innerText = "No disponible";
    }
    
    // Análisis Psicológico (Nuevo en el modal)
    const psicoContainer = document.getElementById('m-psico');
    if (psicoContainer) {
        psicoContainer.innerHTML = `
            <p><strong>Lógica:</strong> ${psico.LOG_ABS?.analisis || "N/A"}</p>
            <p><strong>Situacional:</strong> ${psico.SIT_EST?.analisis || "N/A"}</p>
            <p><strong>Big Five:</strong> ${psico.BIG_FIVE?.analisis || "N/A"}</p>
        `;
    }
    
    // Estudios
    const educacion = trayectoria.educacion || [];
    document.getElementById('m-estudios').innerText = educacion.map(e => e.descripcion).join(', ') || "No disponible";
    
    // Habilidades
    document.getElementById('m-blandas').innerText = Array.isArray(habilidades.blandas) 
        ? habilidades.blandas.join(', ') : "No disponible";
    document.getElementById('m-duras').innerText = Array.isArray(habilidades.tecnicas) 
        ? habilidades.tecnicas.join(', ') : "No disponible";
        
    document.getElementById('modal-perfil').style.display = 'flex';
}

// Ejecución inicial: esperamos a que el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarDatos);
