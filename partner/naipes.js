/**
 * partner/naipes.js
 * Lógica completa para el dashboard de Irina Hire Selection
 */

async function cargarDatos() {
    // 1. Verificación de entorno Supabase
    if (!window.sbClient) {
        console.error("Supabase cliente no disponible.");
        return;
    }

    // 2. Consulta de datos en la tabla 'habitat'
    const { data, error } = await window.sbClient.from('habitat').select('*');
    if (error) { 
        console.error("Error al cargar datos:", error); 
        return; 
    }
    
    const grid = document.getElementById('dashboard');
    grid.innerHTML = ''; // Limpieza del contenedor principal

    // 3. Procesamiento de tarjetas (Naipe)
    data.forEach((row, index) => {
        const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        const irinaData = d?.["!irina"] || {};
        const score = irinaData?.evaluacion?.score_general || 0;
        const job_id = d?.["!vinculo-oferta"]?.job_id || "sin-oferta";
        
        // Asignación de clases CSS según el score
        const clase = score >= 98 ? 'bg-irina-animado' : 
                      (score >= 90 ? 'bg-emerald-metal' : 
                      (score >= 80 ? 'bg-verde' : 
                      (score >= 60 ? 'bg-amarillo' : 
                      (score >= 50 ? 'bg-rojo' : 'bg-marron'))));
        
        const card = document.createElement('div');
        card.className = "blic-card " + clase;
        card.dataset.oferta = job_id;
        card.onclick = () => abrirModal(row);
        
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
        
        // 4. Renderizado del Gráfico de Radar con escala fija para evitar distorsiones
        const subscores = irinaData?.evaluacion?.metricas || { tecnica: 0, experiencia: 0 };
        new Chart(document.getElementById("radar-" + index), { 
            type: 'radar', 
            data: { 
                labels: ['Téc', 'Exp', 'Ada', 'Lid', 'IA'], 
                datasets: [{ 
                    data: [subscores.tecnica || 0, subscores.experiencia || 0, 0, 0, 0], 
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderColor: '#fff',
                    borderWidth: 1
                }] 
            }, 
            options: { 
                plugins: { legend: { display: false } },
                scales: { 
                    r: { 
                        min: 0, 
                        max: 100, 
                        ticks: { display: false }, 
                        grid: { color: 'rgba(255,255,255,0.2)' }, 
                        pointLabels: { color: '#fff', font: { size: 10 } } 
                    } 
                }
            } 
        });
    });
}

// 5. Lógica del Modal (Apertura y carga de datos)
function abrirModal(row) {
    const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    const perfil = d["!perfil"] || {};
    const base = perfil["perfil-base"] || {};
    const contacto = perfil["perfil-contacto"] || {};
    const habilidades = d["!habilidades"] || {};
    const trayectoria = d["!trayectoria"] || {};
    const psico = d["!psicometrico"] || {};
    
    // Inyección de texto
    document.getElementById('m-nombre').innerText = base.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = contacto.email || "Sin email";
    document.getElementById('m-telefono').innerText = contacto.telefono || "Sin teléfono";
    document.getElementById('m-foto').style.backgroundImage = base.foto_url ? `url('${base.foto_url}')` : 'none';
    
    // Carga de Trayectoria
    const trayContainer = document.getElementById('m-trayectoria');
    trayContainer.innerHTML = '';
    if (Array.isArray(trayectoria.experiencia)) {
        trayectoria.experiencia.forEach(exp => {
            const p = document.createElement('p');
            p.style.margin = "0 0 10px 0";
            p.innerText = exp.descripcion || "Sin descripción";
            trayContainer.appendChild(p);
        });
    } else {
        trayContainer.innerText = "No disponible";
    }
    
    // Análisis Psicológico
    const psicoContainer = document.getElementById('m-psico');
    if (psicoContainer) {
        psicoContainer.innerHTML = `
            <p><strong>Lógica:</strong> ${psico.LOG_ABS?.analisis || "N/A"}</p>
            <p><strong>Situacional:</strong> ${psico.SIT_EST?.analisis || "N/A"}</p>
            <p><strong>Big Five:</strong> ${psico.BIG_FIVE?.analisis || "N/A"}</p>
        `;
    }
    
    // Formación y Habilidades
    const educacion = trayectoria.educacion || [];
    document.getElementById('m-estudios').innerText = educacion.map(e => e.descripcion).join(', ') || "No disponible";
    
    document.getElementById('m-blandas').innerText = Array.isArray(habilidades.blandas) 
        ? habilidades.blandas.join(', ') : "No disponible";
    document.getElementById('m-duras').innerText = Array.isArray(habilidades.tecnicas) 
        ? habilidades.tecnicas.join(', ') : "No disponible";
        
    // Mostrar modal
    document.getElementById('modal-perfil').style.display = 'flex';
}

// 6. Inicialización al cargar DOM
document.addEventListener('DOMContentLoaded', cargarDatos);
