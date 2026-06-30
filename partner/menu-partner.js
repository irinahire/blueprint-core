const MenuPartner = {
    init: async function() {
        const container = document.getElementById('menu-container');
        if (!container) return;

        // Consultamos las ofertas reales desde la tabla 'habitat' donde metadata tenga !tipo: !oferta
        const { data, error } = await window.sbClient
            .from('habitat')
            .select('data')
            .contains('metadata', { '!tipo': '!oferta' });

        const ofertas = error ? [] : data.map(row => {
            const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
            return { id: d.job_id, titulo: d.titulo };
        }).filter(o => o.id && o.titulo);

        this.render(container, ofertas);
    },

    render: function(container, ofertas) {
        container.innerHTML = `
            <div class="menu-control">
                <button class="btn-primary" onclick="alert('Funcionalidad Crear Oferta')">+ Nueva Oferta</button>
                
                <button class="btn-filter" onclick="document.getElementById('modal-filtros').style.display='flex'">
                    Filtrar por Ofertas
                </button>

                <input type="text" class="semantic-search" placeholder="Búsqueda semántica (ej: experto en liderazgo...) 🔍" 
                       onkeypress="if(event.key==='Enter') MenuPartner.handleSearch(this.value)">
            </div>

            <div id="modal-filtros" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center;">
                <div class="modal-content" style="background:white; padding:30px; border-radius:30px; width:300px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <h3 style="margin-top:0; color:#bc8abf;">Seleccionar ofertas</h3>
                    <select id="filtro-ofertas" multiple style="width:100%; height:150px; border-radius:10px; padding:10px; border:1px solid #ccc;">
                        ${ofertas.map(o => `<option value="${o.id}">${o.titulo}</option>`).join('')}
                    </select>
                    <button class="btn-primary" style="width:100%; margin-top:20px; padding:12px; border-radius:20px; border:none; cursor:pointer;" 
                            onclick="MenuPartner.aplicarFiltros(); document.getElementById('modal-filtros').style.display='none'">
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        `;
    },

    handleSearch: function(query) {
        console.log("Iniciando búsqueda semántica en Supabase para:", query);
        // Aquí llamarás a la función RPC: window.sbClient.rpc('match_perfiles', { query_embedding: ... })
    },

    aplicarFiltros: function() {
        const selected = Array.from(document.getElementById('filtro-ofertas').selectedOptions).map(o => o.value);
        console.log("Filtrando tarjetas con IDs de oferta:", selected);
        
        // Lógica de ocultar/mostrar tarjetas en el DOM
        const cards = document.querySelectorAll('.blic-card');
        cards.forEach(card => {
            if (selected.length === 0 || selected.includes(card.dataset.oferta)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => MenuPartner.init());
