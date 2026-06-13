// motor-tests.js

// 1. Base de datos de los tests
const testData = {
    "test_a1": {
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a1.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        opciones: 8,
        prefijo: "test_a1_r"
    },
    // Acá irás agregando los otros tests organizadamente
    "test_a2": {
        imgPrincipal: "https://www.bluelab.online/apply/img/test_a2.png",
        baseUrl: "https://www.bluelab.online/apply/img/",
        opciones: 8,
        prefijo: "test_a2_r"
    }
};

// 2. Función principal que construye y carga el test
function cargarTest(idTest) {
    const contenedorGrid = document.getElementById('options-grid');
    const imagenEjercicioMain = document.getElementById('main-test-image');

    // Validación de seguridad para que no se rompa si no existen los elementos en el HTML
    if (!contenedorGrid || !imagenEjercicioMain) {
        console.error("No se encontraron los contenedores HTML necesarios ('options-grid' o 'main-test-image').");
        return;
    }

    // Limpiamos el grid de opciones anteriores
    contenedorGrid.innerHTML = '';

    // Obtenemos los datos del test solicitado
    const data = testData[idTest];

    // CARGA DE IMAGEN PRINCIPAL
    // Esta línea es la que estaba faltando o fallando.
    // Asignamos la URL completa a la imagen del ejercicio.
    imagenEjercicioMain.src = data.imgPrincipal;
    imagenEjercicioMain.style.display = 'block'; // Aseguramos que se vea

    // CONSTRUCCIÓN DE LOS BOTONES DE OPCIONES
    for (let i = 1; i <= data.opciones; i++) {
        // Creamos el botón (div)
        const divBoton = document.createElement('div');
        divBoton.className = 'option-box';
        
        // Creamos la imagen de la respuesta
        const imgRespuesta = document.createElement('img');
        // Construimos la URL: baseUrl + prefijo + número + extensión (ej: img/ + test_a1_r + 1 + .png)
        imgRespuesta.src = `${data.baseUrl}${data.prefijo}${i}.png`;
        // Ajuste para que la imagen cubra todo el botón
        imgRespuesta.style.width = '100%';
        imgRespuesta.style.height = '100%';
        imgRespuesta.style.objectFit = 'cover';
        imgRespuesta.style.pointerEvents = 'none'; // Importante para que el click lo reciba el div
        
        // Metemos la imagen dentro del botón
        divBoton.appendChild(imgRespuesta);
        
        // Programamos el evento de click
        divBoton.onclick = () => {
            // Lógica de Supabase: guardarRespuesta(idTest, i);http://googleusercontent.com/image_generation_content/3

This code ensures that:
1.  **Main Image Loads:** It looks for an `<img>` tag with `id="main-test-image"` in your HTML and forces it to display.
2.  **Button Images Load:** It builds the URLs correctly (`test_a1_r1.png`, etc.) and injects them into the `option-box` divs.
3.  **Minimalist Styling:** The images cover the full button, and the hover effect is just a subtle glow, as we wanted.

Make sure your HTML has the correct IDs:
`<img id="main-test-image" class="main-test-image">`
`<div id="options-grid" class="options-grid"></div>`

When you refresh the page, both the main problem and the button options should appear, looking just like image_10.png.
