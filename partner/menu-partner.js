/**
 * Módulo: MenuPartner
 * Responsabilidad: Gestión, renderizado y filtrado de la interfaz de control de ofertas.
 * Este módulo interactúa directamente con la tabla 'habitat' de Supabase.
 */
const MenuPartner = {
    
    // Inicialización del módulo
    init: async function() {
        const container = document.getElementById('menu-container');
        if (!container) {
            console.error("Error: El contenedor del menú no existe en el DOM.");
            return;
        }

        // Consulta de datos reales en Supabase
        // Filtramos por registros que tienen metadata '!tipo' igual a '!oferta'
        const { data, error } = await window.sbClient
            .from('habitat')
            .select('data')
            .contains('metadata', { '!tipo': '!oferta' });

        if (error) {
            console.error("Error al recuperar las ofertas desde la tabla habitat:", error);
            return;
        }

        // Mapeo de datos: Extracción de job_id y titulo del objeto JSON 'data'
        const ofertas = data.map(row => {
            const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
            return { 
                id: d.job_id || null, 
                titulo: d.titulo || "Título no disponible" 
            };
        }).filter(o => o.id !== null);

        this.render(container, ofertas);
    },

    // Renderizado del HTML con la estructura solicitada
    render: function(container, ofertas) {
        container.innerHTML = `
            <div class="menu-control">
                <a href="https://www.bluelab.online/jobs" target="_blank" class="btn-primary" style="text-decoration: none; display: inline-flex; align-items: center;">
                    + Nueva Oferta Laboral
                </a>
                
                <button class="btn-filter" onclick="document.getElementById('modal-filtros').style.display='flex'">
                    Filtrar por ofertas
                </button>

                <select class="btn-filter" onchange="MenuPartner.ordenarNaipes(this.value)">
                    <option value="">Ordenar por...</option>
                    <option value="score-desc">Score (Mayor a menor)</option>
                    <option value="score-asc">Score (Menor a mayor)</option>
                </select>

                <input type="text" class="semantic-search" placeholder="Búsqueda semántica...">
            </div>

            <!-- Modal de selección de ofertas -->
            <div id="modal-filtros" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center;">
                <div class="modal-content" style="background:white; padding:20px; width:300px; position:relative; border: 2px solid #bc8abf;">
                    <!-- Botón X para cerrar -->
                    <span style="position:absolute; top:5px; right:10px; cursor:pointer; font-size:20px; color:#bc8abf;" 
                          onclick="document.getElementById('modal-filtros').style.display='none'">×</span>
                    
                    <h3 style="color:#bc8abf;">Seleccionar ofertas</h3>
                    
                    <select id="filtro-ofertas" multiple style="width:100%; height:150px; border:1px solid #bc8abf;">
                        ${ofertas.map(o => `<option value="${o.id}">${o.titulo}</option>`).join('')}
                    </select>
                    
                    <button style="width:100%; margin-top:15px; background:#bc8abf; color:white; border:none; padding:10px; cursor:pointer;" 
                            onclick="MenuPartner.aplicarFiltros(); document.getElementById('modal-filtros').style.display='none'">
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        `;
    },

    // Lógica para manejar la búsqueda semántica
    handleSearch: function(query) {
        // En este punto se realizará la llamada a la función RPC de Supabase
        // Ejemplo: window.sbClient.rpc('match_perfiles', { query: query })
        console.log("Ejecutando búsqueda semántica sobre base vectorial con el término:", query);
    },

    // Lógica para filtrar visualmente los naipes (blic-cards)
    aplicarFiltros: function() {
        const selectedOptions = document.getElementById('filtro-ofertas').selectedOptions;
        const selectedIds = Array.from(selectedOptions).map(opt => opt.value);
        
        console.log("Filtrando naipes. IDs de oferta seleccionados:", selectedIds);
        
        const cards = document.querySelectorAll('.blic-card');
        cards.forEach(card => {
            // Si no hay nada seleccionado, mostramos todos; si hay selección, filtramos por dataset
            const match = selectedIds.length === 0 || selectedIds.includes(card.dataset.oferta);
            card.style.display = match ? 'flex' : 'none';
        });
    },

    // Lógica para ordenar visualmente los naipes por Score
    ordenarNaipes: function(criterio) {
        const grid = document.getElementById('dashboard');
        const naipes = Array.from(grid.querySelectorAll('.blic-card'));

        naipes.sort((a, b) => {
            const scoreA = parseFloat(a.dataset.score) || 0;
            const scoreB = parseFloat(b.dataset.score) || 0;
            
            if (criterio === 'score-desc') return scoreB - scoreA;
            if (criterio === 'score-asc') return scoreA - scoreB;
            return 0;
        });

        // Re-renderizamos en el nuevo orden
        naipes.forEach(naipe => grid.appendChild(naipe));
    }
};

// Listener para inicializar el módulo al cargar el DOM
document.addEventListener('DOMContentLoaded', () => MenuPartner.init());
