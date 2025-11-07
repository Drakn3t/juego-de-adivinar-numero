let numeroSecreto = Math.floor(Math.random() * 100) + 1; 
let numeroDeEntrada = document.getElementById("numeroEntrada"); 
let mensaje = document.getElementById("mensaje");
let intento = document.getElementById("intento"); 
let contadorIntentos = 0;

function verificarResultado() {
    contadorIntentos++;
    intento.textContent = `Intento número: ${contadorIntentos}`;
    let numeroIngresado = parseInt(numeroDeEntrada.value);
    
    if (isNaN(numeroIngresado) || numeroIngresado < 1 || numeroIngresado > 100) {
        mensaje.textContent = "Por favor, ingresa un número válido entre 1 y 100.";
        mensaje.style.color = "black";
        contadorIntentos--; 
        return;
    }
    
    if (numeroIngresado === numeroSecreto) {
        mensaje.textContent = "¡Felicidades! Has adivinado el número secreto.";
        mensaje.style.color = "green";
        numeroDeEntrada.disabled = true;
    } else if (numeroIngresado < numeroSecreto) {
        mensaje.textContent = "El número secreto es mayor. Intenta de nuevo.";
        mensaje.style.color = "yellow";
    } else {
        mensaje.textContent = "El número secreto es menor. Intenta de nuevo.";
        mensaje.style.color = "red";
    }
}

function reiniciarResultado() {
    
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    
    // Reiniciar contador
    contadorIntentos = 0;
    
    // Limpiar mensajes
    mensaje.textContent = "A jugar!";
    mensaje.style.color = "";
    intento.textContent = "";
    
    // Limpiar y habilitar input
    numeroDeEntrada.value = "";
    numeroDeEntrada.disabled = false;
    
    // Dar foco al input
    numeroDeEntrada.focus();
}

// Permitir verificar con la tecla Enter
numeroDeEntrada.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        verificarResultado();
    }
});