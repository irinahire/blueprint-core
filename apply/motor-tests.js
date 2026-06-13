// motor-tests.js
const testData = {
    "test_a1": {
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        opciones: 8,
        prefijo: "test_a1_r"
    }
};

function cargarTest(idTest) {
    const contenedor = document.getElementById('options-grid');
    const imagenMain = document.getElementById('main-test-image');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    const data = testData[idTest];
    imagenMain.src = data.imgPrincipal;

    for (let i = 1; i <= data.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        
        const img = document.createElement('img');
        img.src = `${data.baseUrl}${data.prefijo}${i}.png`;
        div.appendChild(img);
        
        div.onclick = () => {
            // Feedback visual
            document.querySelectorAll('.option-box').forEach(el => el.style.boxShadow = 'none');
            div.style.boxShadow = '0 0 0 3px #B588C0';
            console.log(`Respuesta ${i} seleccionada para ${idTest}`);
        };
        contenedor.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => cargarTest('test_a1'));
