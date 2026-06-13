// motor-tests.js

// CONFIGURACIÓN CENTRALIZADA
const testData = {
    "test_a1": {
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        prefijo: "test_a1_r",
        opciones: 8
    }
    // Aquí podrás agregar "big_five": { ... }, "situacional": { ... } en el futuro.
};

// MOTOR DE CARGA
document.addEventListener('DOMContentLoaded', () => {
    const mainImg = document.getElementById('main-test-image');
    const grid = document.getElementById('options-grid');
    
    // Validar existencia de elementos
    if (!mainImg || !grid) {
        console.error("Error: Elementos del DOM no encontrados");
        return;
    }

    // Inicializar test_a1 por defecto
    const currentTest = testData["test_a1"];
    
    // Cargar imagen principal
    mainImg.src = currentTest.imgPrincipal;
    
    // Cargar las 8 opciones
    grid.innerHTML = ''; // Limpiar previo
    for (let i = 1; i <= currentTest.opciones; i++) {
        const div = document.createElement('div');
        div.className = 'option-box';
        
        const img = document.createElement('img');
        img.src = `${currentTest.baseUrl}${currentTest.prefijo}${i}.png`;
        
        div.appendChild(img);
        
        div.onclick = () => {
            // Estilo de selección
            document.querySelectorAll('.option-box').forEach(el => el.style.boxShadow = 'none');
            div.style.boxShadow = '0 0 0 3px #B588C0';
            
            // Aquí llamarías a tu función de guardado a Supabase:
            // guardarRespuesta('test_a1', i);
            console.log("Seleccionada opción: " + i);
        };
        
        grid.appendChild(div);
    }
});
