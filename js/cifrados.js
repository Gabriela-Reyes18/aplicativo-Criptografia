

/**
 * Normaliza un texto para criptografía clásica.
 * Elimina acentos y convierte a mayúsculas.
 * @param {string} texto - El texto original.
 * @returns {string} Texto limpio (A-Z) y espacios si se desea conservar.
 */
function limpiarTexto(texto) {
    return texto
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .toUpperCase(); // Convertir a mayúsculas
}

/**
 * Operación módulo que maneja números negativos correctamente (a diferencia de % en JS).
 * @param {number} n - El número.
 * @param {number} m - El módulo.
 * @returns {number} El resultado positivo de n mod m.
 */
function modulo(n, m) {
    return ((n % m) + m) % m;
}

// ==========================================
// 1. CIFRADO CÉSAR
// ==========================================

/**
 * @param {string} mensaje - El mensaje a procesar.
 * @param {number} desplazamiento - El número de posiciones a desplazar.
 * @param {boolean} cifrar - true para cifrar, false para descifrar.
 * @returns {string} El resultado procesado.
 */
function cifradoCesar(mensaje, desplazamiento, cifrar = true) {
    // Si vamos a descifrar, invertimos el desplazamiento
    if (!cifrar) {
        desplazamiento = -desplazamiento;
    }

    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let resultado = "";
    
    // Normalizamos el mensaje para evitar problemas con minúsculas
    const mensajeLimpio = limpiarTexto(mensaje);

    for (let i = 0; i < mensajeLimpio.length; i++) {
        const caracter = mensajeLimpio[i];
        const indiceActual = alfabeto.indexOf(caracter);

        // Si el caracter está en el alfabeto, lo tansformamos
        if (indiceActual !== -1) {
            // Aplicamos la fórmula: C = (P + K) mod 26
            const nuevoIndice = modulo(indiceActual + desplazamiento, 26);
            resultado += alfabeto[nuevoIndice];
        } else {
            // Si no es una letra (ej. espacio, número), lo dejamos igual
            resultado += caracter;
        }
    }

    return resultado;
}

// ==========================================
// 2. CIFRADO VIGENÈRE
// ==========================================

/**
 * @param {string} mensaje - El mensaje a procesar.
 * @param {string} clave - La palabra clave.
 * @param {boolean} cifrar - true para cifrar, false para descifrar.
 * @returns {string} El resultado procesado.
 */
function cifradoVigenere(mensaje, clave, cifrar = true) {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let resultado = "";
    
    const mensajeLimpio = limpiarTexto(mensaje);
    // Limpiamos la clave para que solo tenga letras A-Z
    const claveLimpia = limpiarTexto(clave).replace(/[^A-Z]/g, "");

    if (claveLimpia.length === 0) return "Error: La clave debe contener letras.";

    let indiceClave = 0;

    for (let i = 0; i < mensajeLimpio.length; i++) {
        const caracter = mensajeLimpio[i];
        const indiceMensaje = alfabeto.indexOf(caracter);

        if (indiceMensaje !== -1) {
            // Obtenemos el desplazamiento basado en la letra actual de la clave
            const caracterClave = claveLimpia[indiceClave % claveLimpia.length];
            //Obtenemos el índice de la letra de la clave
            let desplazamiento = alfabeto.indexOf(caracterClave);

            // Si desciframos, restamos el desplazamiento
            if (!cifrar) {
                desplazamiento = -desplazamiento;
            }

            const nuevoIndice = modulo(indiceMensaje + desplazamiento, 26);
            resultado += alfabeto[nuevoIndice];

            // Avanzamos al siguiente caracter de la clave
            indiceClave++;
        } else {
            resultado += caracter;
        }
    }

    return resultado;
}

// ==========================================
// 3. TRANSPOSICIÓN COLUMNAR
// ==========================================

/**
 * @param {string} mensaje - El mensaje.
 * @param {string} clave - La clave.
 * @returns {string} Mensaje cifrado.
 */
function cifrarTransposicion(mensaje, clave) {
    const mensajeLimpio = limpiarTexto(mensaje).replace(/[^A-Z]/g, ""); // Quitamos espacios para simplificar
    const claveLimpia = limpiarTexto(clave).replace(/[^A-Z]/g, "");
    
    if (claveLimpia.length === 0) return "Error: Clave inválida.";

    const longitudClave = claveLimpia.length;
    const longitudMensaje = mensajeLimpio.length;
    
    // Calculamos número de filas necesarias
    const filas = Math.ceil(longitudMensaje / longitudClave);
    
    // Creamos la cuadrícula (matriz)
    let grid = new Array(filas).fill(null).map(() => new Array(longitudClave).fill(""));
    
    // Rellenamos la cuadrícula horizontalmente
    let k = 0;
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < longitudClave; j++) {
            if (k < longitudMensaje) {
                grid[i][j] = mensajeLimpio[k++];
            } else {
                // Rellenamos con 'X' si sobra espacio (padding opcional, aquí usaremos X)
                grid[i][j] = "X";
            }
        }
    }

    // Determinamos el orden de lectura basado en la clave alfabética
    // Creamos un array de objetos { letra, indiceOriginal } para ordenar
    let orden = [];
    for (let i = 0; i < longitudClave; i++) {
        orden.push({ 
            letra: claveLimpia[i], 
            indiceOriginal: i 
        });
    }
    
    // Ordenamos por letra (alfabéticamente). Si hay letras iguales, mantiene orden estable usualmente, 
    // pero para ser determinista en criptografía clásica simple, asumimos orden de aparición si letras iguales.
    orden.sort((a, b) => a.letra.localeCompare(b.letra));

    // Leemos por columnas según el orden determinado
    let resultado = "";
    for (let i = 0; i < longitudClave; i++) {
        const columnaIndex = orden[i].indiceOriginal;
        for (let fila = 0; fila < filas; fila++) {
            resultado += grid[fila][columnaIndex];
        }
    }

    return resultado;
}

/**
 * @param {string} mensaje - El mensaje cifrado.
 * @param {string} clave - La clave.
 * @returns {string} Mensaje descifrado.
 */
function descifrarTransposicion(mensaje, clave) {
    const mensajeLimpio = limpiarTexto(mensaje).replace(/[^A-Z]/g, "");
    const claveLimpia = limpiarTexto(clave).replace(/[^A-Z]/g, "");

    if (claveLimpia.length === 0) return "Error: Clave inválida.";

    const longitudClave = claveLimpia.length;
    const longitudMensaje = mensajeLimpio.length;
    const filas = Math.ceil(longitudMensaje / longitudClave);

    // Determinamos el orden de las columnas igual que al cifrar
    let orden = [];
    for (let i = 0; i < longitudClave; i++) {
        orden.push({ letra: claveLimpia[i], indiceOriginal: i });
    }
    orden.sort((a, b) => a.letra.localeCompare(b.letra));

    // Reconstruimos la cuadrícula vacía
    let grid = new Array(filas).fill(null).map(() => new Array(longitudClave).fill(""));

    // Llenamos la cuadrícula columna por columna siguiendo el orden de la clave
    let k = 0;
    for (let i = 0; i < longitudClave; i++) {
        const columnaIndex = orden[i].indiceOriginal; // Índice real de la columna en la grid
        for (let fila = 0; fila < filas; fila++) {
            if (k < longitudMensaje) {
                grid[fila][columnaIndex] = mensajeLimpio[k++];
            }
        }
    }

    // Leemos la cuadrícula fila por fila
    let resultado = "";
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < longitudClave; j++) {
            resultado += grid[i][j];
        }
    }

    return resultado;
}

/**
 * Función wrapper para transposición.
 */
function transposicionColumnar(mensaje, clave, cifrar = true) {
    if (cifrar) {
        return cifrarTransposicion(mensaje, clave);
    } else {
        return descifrarTransposicion(mensaje, clave);
    }
}


// ==========================================
// 4. CIFRADO ATBASH
// ==========================================

/**
 * Realiza el cifrado Atbash (es su propio inverso).
 * @param {string} mensaje - El mensaje.
 * @returns {string} Resultado.
 */
function cifradoAtbash(mensaje) {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const reverso  = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
    
    let resultado = "";
    const mensajeLimpio = limpiarTexto(mensaje);

    for (let i = 0; i < mensajeLimpio.length; i++) {
        const caracter = mensajeLimpio[i];
        const indice = alfabeto.indexOf(caracter);

        if (indice !== -1) {
            resultado += reverso[indice];
        } else {
            resultado += caracter;
        }
    }

    return resultado;
}
