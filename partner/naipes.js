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
    // Filtramos solo por tipo para asegurar calidad, sin limitar a un único ID
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('*')
        .eq('metadata->>!tipo', '!postulacion');

    if (error) { 
        console.error("Error al cargar datos:", error); 
        return; 
    }
    
    const grid = document.getElementById('dashboard');
    grid.innerHTML = ''; // Limpieza del contenedor principal

    // 3. Procesamiento de tarjetas (Naipe)
    data.forEach((row, index) => {
        const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
        
        const irinaData = d?.["!irina"] || {};
        const score = irinaData?.evaluacion?.score_general || 0;
        
        // Extracción exacta de IDs
        const ownerId = row.owner_id; // Columna directa raíz
        const jobId = metadata?.["!vinculos"]?.oferta_id?.[0] || "sin-oferta";
        const fechaCreacion = row.created_at || '1970-01-01'; // Fecha para ordenamiento
        
        // Obtención de la URL del radar
        const radarUrl = d?.["!psicometrico"]?.url_big_five_radar || "";
        
        // Lógica de colores semáforo para el ADN (6 pilares)
        const idoneidad = irinaData?.idoneidad || { tec: 0, exp: 0, for: 0, ada: 0, res: 0, cul: 0 };
        const getColor = (val) => val >= 75 ? '#28a745' : (val >= 50 ? '#ffc107' : '#dc3545');

        // Asignación de clases CSS
        const clase = score >= 98 ? 'bg-irina-animado' : 
                      (score >= 90 ? 'bg-emerald-metal' : 
                      (score >= 80 ? 'bg-verde' : 
                      (score >= 60 ? 'bg-amarillo' : 
                      (score >= 50 ? 'bg-rojo' : 'bg-marron'))));
        
        const card = document.createElement('div');
        card.className = "blic-card " + clase;
        card.dataset.oferta = jobId;
        card.dataset.score = score; // Guardamos para ordenar
        card.dataset.fecha = fechaCreacion; // Guardamos para ordenar
        
        // Navegación a perfil.html
        card.onclick = () => {
            window.open(`partner/perfil.html?owner_id=${ownerId}&job_id=${jobId}`, '_blank');
        };
        
        // Renderizado visual con la nueva estructura
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:900; margin-bottom:5px;">
                <span>ID: ${ownerId.substring(0,6)}</span>
                <span>SCORE: ${score}</span>
            </div>
            <div class="radar-container" style="height:150px;">
                ${radarUrl ? `<img src="${radarUrl}" style="width:100%; height:100%;" alt="Radar">` : `<canvas id="radar-${index}"></canvas>`}
            </div>
            
            <!-- ADN DE 6 PILARES -->
            <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:2px; margin:10px 0;">
                ${Object.entries(idoneidad).map(([key, val]) => `
                    <div style="text-align:center;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="${getColor(val)}"><circle cx="12" cy="12" r="10"/></svg>
                        <div style="font-size:8px;">${key.toUpperCase()}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align:center; font-size:11px; font-weight:bold; margin-top:5px;">
                ${d?.titulo_puesto || "POSTULACIÓN"}
            </div>
        `;
        grid.appendChild(card);
        
        // 4. Renderizado del Gráfico de Radar (si no hay imagen)
        if (!radarUrl) {
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
                            min: 0, max: 100, ticks: { display: false }, 
                            grid: { color: 'rgba(255,255,255,0.2)' }, 
                            pointLabels: { color: '#fff', font: { size: 12, weight: 'bold' } } 
                        } 
                    }
                } 
            });
        }
    });
}

// 5. Inicialización al cargar DOM
document.addEventListener('DOMContentLoaded', cargarDatos);
