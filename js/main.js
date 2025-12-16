
function iniciarAplicacion() {
    const landing = document.getElementById('landing-page');
    const app = document.getElementById('app-container');

    landing.style.transition = 'opacity 0.5s ease-in-out';
    landing.style.opacity = '0';

    setTimeout(() => {
        landing.classList.add('hidden');
        app.classList.remove('hidden');
        app.classList.add('flex'); 
    }, 500);
}

function regresarInicio() {
    const landing = document.getElementById('landing-page');
    const app = document.getElementById('app-container');

    app.style.opacity = '0';

    setTimeout(() => {
        landing.classList.remove('hidden'); 
        landing.style.opacity = '0'; 
        void landing.offsetWidth; 
        landing.style.opacity = '1';
    }, 500);
}

// ==========================================
// GESTIÓN DE PESTAÑAS (TABS)
// ==========================================

function cambiarPestana(idTab) {
    // 1. Ocultar todos los contenidos
    const contenidos = document.querySelectorAll('.tab-content');
    contenidos.forEach(div => {
        div.classList.add('hidden');
        div.classList.remove('block');
    });

    // 2. Desactivar todos los botones
    const botones = document.querySelectorAll('.tab-btn');
    botones.forEach(btn => {
        btn.classList.remove('active-tab', 'bg-indigo-50', 'text-indigo-700', 'border-r-4', 'border-indigo-600');
        btn.classList.add('text-slate-600');
    });

    // 3. Mostrar el contenido seleccionado
    const contenidoSeleccionado = document.getElementById(`content-${idTab}`);
    if (contenidoSeleccionado) {
        contenidoSeleccionado.classList.remove('hidden');
        contenidoSeleccionado.classList.add('block');
    }

    // 4. Activar el botón seleccionado
    const botonSeleccionado = document.getElementById(`tab-${idTab}`);
    if (botonSeleccionado) {
        botonSeleccionado.classList.add('active-tab');
        botonSeleccionado.classList.remove('text-slate-600');
    }
}

// ==========================================
// FUNCIONES DE EJECUCIÓN (HANDLERS)
// ==========================================

// --- CÉSAR ---
function ejecutarCesar(cifrar) {
    const mensaje = document.getElementById('cesar-input').value;
    const clave = parseInt(document.getElementById('cesar-clave').value);
    
    if (!mensaje) {
        alert("Por favor ingrese un mensaje.");
        return;
    }

    if (isNaN(clave)) {
        alert("La clave debe ser un número.");
        return;
    }

    const resultado = cifradoCesar(mensaje, clave, cifrar);
    document.getElementById('cesar-resultado').value = resultado;
}

// --- VIGENÈRE ---
function ejecutarVigenere(cifrar) {
    const mensaje = document.getElementById('vigenere-input').value;
    const clave = document.getElementById('vigenere-clave').value;

    if (!mensaje || !clave) {
        alert("Por favor ingrese mensaje y clave.");
        return;
    }

    const resultado = cifradoVigenere(mensaje, clave, cifrar);
    document.getElementById('vigenere-resultado').value = resultado;
}

// --- TRANSPOSICIÓN ---
function ejecutarTransposicion(cifrar) {
    const mensaje = document.getElementById('transposicion-input').value;
    const clave = document.getElementById('transposicion-clave').value;

    if (!mensaje || !clave) {
        alert("Por favor ingrese mensaje y clave.");
        return;
    }

    const resultado = transposicionColumnar(mensaje, clave, cifrar);
    document.getElementById('transposicion-resultado').value = resultado;
}

// --- ATBASH ---
function ejecutarAtbash() {
    const mensaje = document.getElementById('atbash-input').value;

    if (!mensaje) {
        alert("Por favor ingrese un mensaje.");
        return;
    }

    const resultado = cifradoAtbash(mensaje);
    document.getElementById('atbash-resultado').value = resultado;
}

// ==========================================
// UTILIDADES UI
// ==========================================

function limpiar(algoritmo) {
    document.getElementById(`${algoritmo}-input`).value = '';
    document.getElementById(`${algoritmo}-resultado`).value = '';
    
    // Limpiar clave si existe para ese algoritmo
    const inputClave = document.getElementById(`${algoritmo}-clave`);
    if (inputClave) {
        if (algoritmo === 'cesar') inputClave.value = '3'; // Valor por defecto
        else inputClave.value = '';
    }
}

function copiarAlPortapapeles(idElemento) {
    const texto = document.getElementById(idElemento);
    texto.select();
    texto.setSelectionRange(0, 99999); // Para móviles

    navigator.clipboard.writeText(texto.value).then(() => {
        // Feedback visual temporal
        const boton = texto.nextElementSibling; // El botón de copiar
        const iconoOriginal = boton.innerHTML;
        
        boton.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
        setTimeout(() => {
            boton.innerHTML = iconoOriginal;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}
