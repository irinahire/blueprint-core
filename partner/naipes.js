/**
 * partner/naipes.js
 * Lógica completa, profesional y sin recortes.
 */

async function cargarDatos() {
    // 1. Verificación de entorno Supabase
    if (!window.sbClient) {
        console.error("Supabase cliente no disponible.");
        return;
    }

    // 2. Consulta de toda la tabla 'habitat' para cruzar información
    const { data, error } = await window.sbClient.from('habitat').select('*');

    if (error) { 
        console.error("Error al cargar datos:", error); 
        return; 
    }
    
    // 3. Crear Diccionario de Ofertas (Crucial para no perder información)
    const ofertasMap = {};
    data.forEach(row => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
        const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        if (metadata?.["!tipo"] === "!oferta") {
            ofertasMap[row.id] = d?.titulo || "Oferta sin título";
        }
    });

    const grid = document.getElementById('dashboard');
    grid.innerHTML = ''; 

    // 4. Procesamiento de tarjetas (Naipe)
    data.forEach((row, index) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
        
        // Solo procesar postulaciones
        if (metadata?.["!tipo"] !== "!postulacion") return;

        const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        const irinaData = d?.["!irina"] || {};
        const score = irinaData?.evaluacion?.score_general || 0;
        
        // Extracción de datos originales
        const ownerId = row.owner_id;
        const blicId = d?.["!perfil"]?.blic_id || ownerId.substring(0, 6);
        const jobId = metadata?.["!vinculos"]?.oferta_id?.[0] || "sin-oferta";
        const fechaCreacion = row.created_at || '1970-01-01';
        const radarUrl = d?.["!psicometrico"]?.url_big_five_radar || "";
        const idoneidad = irinaData?.idoneidad || { TEC: 0, EXP: 0, FOR: 0, ADA: 0, RES: 0, CUL: 0 };
        
        const getColor = (val) => val >= 75 ? '#28a745' : (val >= 50 ? '#ffc107' : '#dc3545');

        // Clases CSS originales
        const clase = score >= 98 ? 'bg-irina-animado' : 
                      (score >= 90 ? 'bg-emerald-metal' : 
                      (score >= 80 ? 'bg-verde' : 
                      (score >= 60 ? 'bg-amarillo' : 
                      (score >= 50 ? 'bg-rojo' : 'bg-marron'))));
        
        const card = document.createElement('div');
        card.className = "blic-card " + clase;
        card.dataset.oferta = jobId;
        card.dataset.score = score;
        card.dataset.fecha = fechaCreacion;
        
        card.onclick = () => {
            window.open(`partner/perfil.html?owner_id=${ownerId}&job_id=${jobId}`, '_blank');
        };
        
        // Renderizado visual con la nueva estructura
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:900; margin-bottom:5px;">
                <span>BLIC#${blicId.toUpperCase()}</span>
                <span>SCORE: ${score}</span>
            </div>
            <div class="radar-container" style="height:150px;">
                ${radarUrl ? `<img src="${radarUrl}" style="width:100%; height:100%;" alt="Radar">` : `<canvas id="radar-${index}"></canvas>`}
            </div>
            
            <!-- ADN DE 6 PILARES: 2 FILAS DE 3 -->
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin:10px 0;">
                ${Object.entries(idoneidad).map(([key, val]) => `
                    <div style="text-align:center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="${getColor(val)}">${getIcon(key)}</svg>
                        <div style="font-size:8px; font-weight:bold;">${key.toUpperCase()}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align:center; font-size:11px; font-weight:bold; margin-top:5px; border-top:1px solid #ccc; padding-top:5px;">
                ${ofertasMap[jobId] || "POSTULACIÓN"}
            </div>
        `;
        grid.appendChild(card);
        
        // 5. Renderizado del Gráfico de Radar (si no hay imagen)
        if (!radarUrl) {
            const subscores = irinaData?.evaluacion?.metricas || { tecnica: 0, experiencia: 0 };
            new Chart(document.getElementById("radar-" + index), { 
                type: 'radar', 
                data: { 
                    labels: ['Téc', 'Exp', 'Ada', 'Lid', 'IA'], 
                    datasets: [{ 
                        data: [subscores.tecnica || 0, subscores.experiencia || 0, 0, 0, 0], 
                        backgroundColor: 'rgba(255,255,255,0.4)', borderColor: '#fff', borderWidth: 1 
                    }] 
                }, 
                options: { plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.2)' } } } }
            });
        }
    });
}

// Función de iconos completa
function getIcon(key) {
    const icons = {
        'TEC': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>',
        'EXP': '<path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/>',
        'FOR': '<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm0 2.5l6 3.27-6 3.27-6-3.27L12 5.5zm0 13l-5-2.73v-4.55l5 2.73 5-2.73v4.55L12 18.5z"/>',
        'ADA': '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 14.81 20 13.46 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 9.19 4 10.54 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>',
        'RES': '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
        'CUL': '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>'
    };
    return icons[key.toUpperCase()] || '';
}

document.addEventListener('DOMContentLoaded', cargarDatos);
