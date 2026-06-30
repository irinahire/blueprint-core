const MenuPartner = {
    init: async function() {
        const container = document.getElementById('menu-container');
        if (!container) return;

        // Solo consultamos ofertas, ya que el resto es implícito por los permisos del usuario
        const { data: ofertas, error } = await window.sbClient
            .from('ofertas')
            .select('id, titulo'); // Aquí Supabase aplica la RLS automáticamente

        if (error) {
            console.error("Error al cargar ofertas del menú:", error);
            return;
        }

        this.render(container, ofertas || []);
    },

    render: function(container, ofertas) {
        container.innerHTML = `
            <div class="menu-control">
                <input type="text" id="search-input" placeholder="Búsqueda semántica..." 
                       oninput="MenuPartner.handleSearch(this.value)">

                <select id="filtro-ofertas" multiple>
                    <option value="" disabled>Seleccionar ofertas...</option>
                    ${ofertas.map(o => `<option value="${o.id}">${o.titulo}</option>`).join('')}
                </select>

                <button class="btn-primary" onclick="MenuPartner.aplicarFiltros()">Filtrar</button>
            </div>
        `;
    },

    handleSearch: function(query) {
        // Lógica de búsqueda semántica (se conectará con Supabase Vector)
        console.log("Consultando base vectorial:", query);
    },

    aplicarFiltros: function() {
        const selected = Array.from(document.getElementById('filtro-ofertas').selectedOptions).map(o => o.value);
        console.log("Filtrando naipes por ofertas:", selected);
        // Aquí llamarías a una función en naipes.js para ocultar/mostrar elementos
    }
};

document.addEventListener('DOMContentLoaded', () => MenuPartner.init());
