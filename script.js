let jugadores = [];
let jugadorActual = 0;
let juegoTerminado = false;

function iniciarJuego() {
    // Obtener nombres de jugadores
    const nombres = [
        document.getElementById('player1').value.trim(),
        document.getElementById('player2').value.trim(),
        document.getElementById('player3').value.trim(),
        document.getElementById('player4').value.trim()
    ];
    
    // Validar que todos los nombres estén completos
    if (nombres.some(nombre => nombre === '')) {
        alert('Por favor, completa los nombres de todos los jugadores');
        return;
    }
    
    // Inicializar jugadores - cada uno con su propio número secreto
    jugadores = nombres.map(nombre => ({
        nombre: nombre,
        intentos: 0,
        completado: false,
        numeroSecreto: Math.floor(Math.random() * 100) + 1
    }));
    
    // Cambiar a pantalla de juego
    document.querySelector('.setup-screen').classList.remove('active');
    document.querySelector('.game-screen').classList.add('active');
    
    // Actualizar UI
    actualizarTurno();
    actualizarScoreboard();
    
    // Dar foco al input
    document.getElementById('numeroEntrada').focus();
}

function actualizarTurno() {
    const turno = document.getElementById('turnoActual');
    const intentos = document.getElementById('intentosActuales');
    
    turno.textContent = `Turno de: ${jugadores[jugadorActual].nombre}`;
    intentos.textContent = `Intentos: ${jugadores[jugadorActual].intentos}`;
}

function actualizarScoreboard() {
    const scoreboard = document.getElementById('scoreboardContent');
    scoreboard.innerHTML = '';
    
    jugadores.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = 'score-item' + (jugador.completado ? ' completed' : '');
        item.innerHTML = `
            <span>${jugador.nombre}${index === jugadorActual ? ' 👈' : ''}</span>
            <span>${jugador.completado ? '✅ ' + jugador.intentos + ' intentos' : '⏳ En espera'}</span>
        `;
        scoreboard.appendChild(item);
    });
}

function verificarResultado() {
    if (juegoTerminado) return;
    
    const numeroEntrada = document.getElementById('numeroEntrada');
    const mensaje = document.getElementById('mensaje');
    const intento = document.getElementById('intento');
    
    let numeroIngresado = parseInt(numeroEntrada.value);
    
    // Validar entrada
    if (isNaN(numeroIngresado) || numeroIngresado < 1 || numeroIngresado > 100) {
        mensaje.textContent = "Por favor, ingresa un número válido entre 1 y 100.";
        mensaje.style.color = "black";
        mensaje.style.background = "#ffe6e6";
        return;
    }
    
    // Incrementar intentos
    jugadores[jugadorActual].intentos++;
    
    // Obtener el número secreto del jugador actual
    const numeroSecreto = jugadores[jugadorActual].numeroSecreto;
    
    if (numeroIngresado === numeroSecreto) {
        mensaje.textContent = `¡Correcto! ${jugadores[jugadorActual].nombre} adivinó el número ${numeroSecreto}!`;
        mensaje.style.color = "green";
        mensaje.style.background = "#d4edda";
        
        jugadores[jugadorActual].completado = true;
        
        // Verificar si todos terminaron
        if (jugadores.every(j => j.completado)) {
            setTimeout(() => mostrarResultados(), 2000);
        } else {
            setTimeout(() => {
                siguienteJugador();
            }, 2000);
        }
    } else if (numeroIngresado < numeroSecreto) {
        mensaje.textContent = "El número secreto es MAYOR. Intenta de nuevo.";
        mensaje.style.color = "#856404";
        mensaje.style.background = "#fff3cd";
    } else {
        mensaje.textContent = "El número secreto es MENOR. Intenta de nuevo.";
        mensaje.style.color = "#721c24";
        mensaje.style.background = "#f8d7da";
    }
    
    actualizarTurno();
    actualizarScoreboard();
    numeroEntrada.value = '';
    numeroEntrada.focus();
}

function siguienteJugador() {
    // Buscar siguiente jugador que no haya completado
    let intentos = 0;
    do {
        jugadorActual = (jugadorActual + 1) % jugadores.length;
        intentos++;
    } while (jugadores[jugadorActual].completado && intentos < jugadores.length);
    
    // Resetear mensaje
    document.getElementById('mensaje').textContent = '¡A jugar!';
    document.getElementById('mensaje').style.background = '#f0f0f0';
    document.getElementById('numeroEntrada').value = '';
    
    actualizarTurno();
    actualizarScoreboard();
    document.getElementById('numeroEntrada').focus();
}

function mostrarResultados() {
    juegoTerminado = true;
    
    // Ordenar jugadores por intentos (menor a mayor)
    const ranking = [...jugadores].sort((a, b) => a.intentos - b.intentos);
    
    const ganador = ranking[0];
    
    // Mostrar pantalla de resultados
    document.querySelector('.game-screen').classList.remove('active');
    document.querySelector('.results-screen').classList.add('active');
    
    document.getElementById('winnerName').textContent = `¡${ganador.nombre} es el ganador!`;
    document.getElementById('winnerStats').textContent = `Adivinó su número en solo ${ganador.intentos} intentos`;
    
    // Mostrar clasificación final
    const finalScores = document.getElementById('finalScoresContent');
    finalScores.innerHTML = '';
    
    ranking.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = 'final-score-item' + (index === 0 ? ' winner' : '');
        const medals = ['🥇', '🥈', '🥉', '🏅'];
        item.innerHTML = `
            <span><span class="medal">${medals[index]}</span> ${jugador.nombre}</span>
            <span>${jugador.intentos} intentos</span>
        `;
        finalScores.appendChild(item);
    });
}

function reiniciarJuego() {
    // Resetear todo
    jugadores = [];
    jugadorActual = 0;
    juegoTerminado = false;
    
    // Limpiar inputs
    document.getElementById('player1').value = '';
    document.getElementById('player2').value = '';
    document.getElementById('player3').value = '';
    document.getElementById('player4').value = '';
    document.getElementById('numeroEntrada').value = '';
    
    // Volver a pantalla de configuración
    document.querySelector('.results-screen').classList.remove('active');
    document.querySelector('.setup-screen').classList.add('active');
    
    document.getElementById('player1').focus();
}

// Permitir Enter para avanzar
document.getElementById('numeroEntrada').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verificarResultado();
    }
});

// Enter en inputs de jugadores
['player1', 'player2', 'player3', 'player4'].forEach((id, index) => {
    document.getElementById(id).addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (index < 3) {
                document.getElementById(['player1', 'player2', 'player3', 'player4'][index + 1]).focus();
            } else {
                iniciarJuego();
            }
        }
    });
});