// Inicialización del cliente Supabase
const sb = supabase.createClient(
    'https://zuzvozgjsppkxvdlptmk.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enZvemdqc3Bwa3h2ZGxwdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTM2MTYsImV4cCI6MjA5NTQ2OTYxNn0.M-g00y8s9FYwzzVg2mqJoazwQkOsk35gukoOqDZ32r0'
);

async function cargarDatos() {
    const { data, error } = await sb.from('habitat').select('*');
    if (error) { console.error("Error al cargar datos:", error); return; }
    
    const grid = document.getElementById('dashboard');
    grid.innerHTML = ''; // Limpiamos el grid antes de cargar

    data.forEach((row, index) => {
        const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        const score = d?.["!irina"]?.evaluacion?.score_general || 0;
        
        // Selección de clase de color basada en el score
        const clase = score >= 98 ? 'bg-irina-animado' : 
                      (score >= 90 ? 'bg-emerald-metal' : 
                      (score >= 80 ? 'bg-verde' : 
                      (score >= 60 ? 'bg-amarillo' : 
                      (score >= 50 ? 'bg-rojo' : 'bg-marron'))));
        
        const card = document.createElement('div');
        card.className = "blic-card " + clase;
        card.onclick = () => abrirModal(d);
        
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
        
        // Renderizado del gráfico radar
        new Chart(document.getElementById("radar-" + index), { 
            type: 'radar', 
            data: { 
                labels: ['Téc', 'Exp', 'Ada', 'Lid', 'IA'], 
                datasets: [{ data: [4, 5, 3, 4, 5], backgroundColor: 'rgba(255,255,255,0.4)' }] 
            }, 
            options: { plugins: { legend: { display: false } } } 
        });
    });
}

function abrirModal(d) {
    const perf = d["!perfil"] || d;
    const base = perf["perfil-base"] || {};
    const cont = perf["perfil-contacto"] || {};
    
    // Asignación de datos al modal
    document.getElementById('m-nombre').innerText = base.nombre || d.nombre || "Sin nombre";
    document.getElementById('m-mail').innerText = cont.email || d.email || "Sin email";
    document.getElementById('m-telefono').innerText = cont.telefono || d.telefono || "Sin teléfono";
    document.getElementById('m-foto').style.backgroundImage = base.foto ? `url('${base.foto}')` : 'none';
    
    const trayectoriaRaw = d.experiencia || d["!trayectoria"]?.experiencia || perf.experiencia || [];
    const trayContainer = document.getElementById('m-trayectoria');
    trayContainer.innerHTML = '';
    
    if (Array.isArray(trayectoriaRaw)) {
        trayectoriaRaw.forEach(exp => {
            const p = document.createElement('p');
            p.innerText = exp.descripcion || exp || "Sin descripción";
            trayContainer.appendChild(p);
        });
    } else {
        trayContainer.innerText = "No disponible";
    }
    
    document.getElementById('m-estudios').innerText = perf.estudios || d.estudios || "No disponible";
    document.getElementById('m-blandas').innerText = perf.habilidades_blandas || d.habilidades_blandas || "No disponible";
    document.getElementById('m-duras').innerText = perf.habilidades_duras || d.habilidades_duras || "No disponible";
    document.getElementById('modal-perfil').style.display = 'flex';
}

// Ejecución inicial
cargarDatos();
