/**
 * perfil.js - Renderizado directo en contenedores existentes
 */

async function initPerfil() {
    console.log("1. Iniciando consulta de datos...");
    
    // ... (Tu lógica de Supabase se mantiene igual)
    const params = new URLSearchParams(window.location.search);
    const { data, error } = await window.sbClient
        .from('habitat')
        .select('data')
        .eq('owner_id', params.get('owner_id'))
        .eq('metadata->>!tipo', '!postulacion')
        .contains('metadata', { "!vinculos": { "oferta_id": [params.get('job_id')] } })
        .single();

    if (error || !data) {
        console.error("No se encontraron datos.");
        return;
    }

    const d = data.data; // Aquí está todo tu objeto JSON
    console.log("Desmenuzando objeto:", d);
    
    renderizarDatos(d);
}

function renderizarDatos(d) {
    // 1. Datos personales (llave !perfil)
    document.getElementById('m-nombre').innerText = d["!perfil"]["perfil-base"].nombre;
    document.getElementById('m-mail').innerText = "Email: " + d["!perfil"]["perfil-contacto"].email;
    document.getElementById('m-tel').innerText = "Tel: " + d["!perfil"]["perfil-contacto"].telefono;

    // 2. LinkedIn (Corrección de URL)
    const lnk = d["!perfil"]["perfil-contacto"].linkedin;
    const btnLnk = document.createElement('a');
    btnLnk.href = lnk.startsWith('http') ? lnk : 'https://www.linkedin.com/in/' + lnk;
    btnLnk.target = "_blank";
    btnLnk.innerText = "Ver LinkedIn";
    // Si tu botón de LinkedIn ya existe, solo le cambiamos el href
    const btnExistente = document.querySelector('a[href*="linkedin"]'); 
    if(btnExistente) btnExistente.href = btnLnk.href;

    // 3. Trayectoria (llave !trayectoria)
    const trayEl = document.getElementById('m-trayectoria');
    trayEl.innerHTML = `
        <h4>Educación</h4>
        ${d["!trayectoria"].educacion.map(e => `<p>${e.descripcion}</p>`).join('')}
        <h4>Experiencia</h4>
        ${d["!trayectoria"].experiencia.map(e => `<p>${e.descripcion}</p>`).join('')}
    `;

    // 4. Psicometría (llave !psicometrico) - ¡Aquí está todo lo que pediste!
    const psi = d["!psicometrico"];
    const card = document.querySelector('.card');
    const divPsi = document.createElement('div');
    divPsi.innerHTML = `
        <hr><h3>Análisis Psicométrico</h3>
        <p>${psi["!analisis_final"]}</p>
        <img src="${psi.url_big_five_radar}" style="width:100%">
        <p><strong>Lógica:</strong> ${psi.LOG_ABS.analisis}</p>
        <p><strong>Situacional:</strong> ${psi.SIT_EST.analisis}</p>
        <p><strong>Big Five:</strong> ${psi.BIG_FIVE.analisis}</p>
    `;
    card.appendChild(divPsi);

    // 5. Habilidades (llave !habilidades)
    const divHab = document.createElement('div');
    divHab.innerHTML = `
        <h3>Habilidades</h3>
        <p><strong>Blandas:</strong> ${d["!habilidades"].blandas.join(', ')}</p>
        <p><strong>Técnicas:</strong> ${d["!habilidades"].tecnicas.join(', ')}</p>
    `;
    card.appendChild(divHab);
}

document.addEventListener('DOMContentLoaded', initPerfil);
