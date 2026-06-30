const MenuPartner = {
    init: async function() {
        const container = document.getElementById('menu-container');
        if (!container || !window.sbClient) return;

        // Filtramos directamente en Supabase buscando los registros que son ofertas
        // Usamos el operador de contención en JSONB para metadata
        const { data, error } = await window.sbClient
            .from('habitat')
            .select('data')
            .contains('metadata', { '!tipo': '!oferta' });

        if (error) {
            console.error("Error al cargar ofertas reales:", error);
            return;
        }

        // Procesamos los datos reales del JSON 'data'
        const ofertas = data.map(row => {
            const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
            return {
                id: d.job_id,
                titulo: d.titulo
            };
        }).filter(o => o.id && o.titulo);

        this.render(container, ofertas);
    },

    render: function(container, ofertas) {
        container.innerHTML = `
            <div class="menu-control">
                <input type="text" id="search-input" placeholder="Búsqueda semántica..." 
                       oninput="MenuPartner.handleSearch(this.value)">

                <select id="filtro-ofertas" multiple>
                    ${ofertas.map(o => `<option value="${o.id}">${o.titulo}</option>`).join('')}
                </select>

                <button class="btn-primary" onclick="MenuPartner.aplicarFiltros()">Filtrar</button>
            </div>
        `;
    },

    handleSearch: function(query) {
        console.log("Búsqueda semántica sobre vector_embedding:", query);
    },

    aplicarFiltros: function() {
        const selected = Array.from(document.getElementById('filtro-ofertas').selectedOptions).map(o => o.value);
        console.log("Filtrando naipes. Se seleccionaron los IDs de oferta:", selected);
        // Aquí deberás llamar a tu función de filtrado en naipes.js
    }
};

document.addEventListener('DOMContentLoaded', () => MenuPartner.init());
