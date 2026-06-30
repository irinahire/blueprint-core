const MenuPartner = {
    init: async function() {
        const container = document.getElementById('menu-container');
        if (!container) return;

        const { data, error } = await window.sbClient.from('habitat').select('data').contains('metadata', { '!tipo': '!oferta' });
        const ofertas = error ? [] : data.map(row => {
            const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
            return { id: d.job_id, titulo: d.titulo };
        });

        container.innerHTML = `
            <div class="menu-control">
                <button class="btn-primary" onclick="alert('Modal Crear Oferta')">+ Nueva Oferta</button>
                
                <button class="btn-filter" onclick="document.getElementById('modal-filtros').style.display='flex'">
                    Filtrar por ofertas
                </button>

                <input type="text" class="semantic-search" placeholder="🔍 Búsqueda semántica (ej: experto en liderazgo...)" 
                       onkeypress="if(event.key==='Enter') MenuPartner.handleSearch(this.value)">
            </div>

            <div id="modal-filtros" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
                <div class="modal-content" style="background:white; padding:20px; border-radius:10px;">
                    <h3>Seleccionar ofertas</h3>
                    <select id="filtro-ofertas" multiple style="width:100%; height:150px;">
                        ${ofertas.map(o => `<option value="${o.id}">${o.titulo}</option>`).join('')}
                    </select>
                    <button onclick="MenuPartner.aplicarFiltros(); document.getElementById('modal-filtros').style.display='none'">Aplicar</button>
                </div>
            </div>
        `;
    },

    handleSearch: function(query) {
        console.log("Consultando base vectorial para:", query);
        // Aquí llamarás a la función RPC de Supabase: await sbClient.rpc('match_perfiles', { query_embedding: ... })
    },

    aplicarFiltros: function() {
        const selected = Array.from(document.getElementById('filtro-ofertas').selectedOptions).map(o => o.value);
        console.log("Filtrando tarjetas con IDs:", selected);
    }
};

document.addEventListener('DOMContentLoaded', () => MenuPartner.init());
