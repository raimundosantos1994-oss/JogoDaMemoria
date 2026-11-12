 /* =========================================================
     AS DUAS LISTAS DE CARTAS (16 itens cada)
     ---------------------------------------------------------
     Cada item representa uma carta e possui:
       - id:    identificador único da carta
       - emoji: símbolo exibido na frente da carta
     O par de uma carta em listaA é a carta de mesmo emoji
     em listaB. Assim, o tabuleiro é montado com 16 cartas de
     listaA + 16 cartas de listaB = 32 cartas.
     ========================================================= */
  const listaA = [
    { id: 1,  emoji: '🐶' },
    { id: 2,  emoji: '🐱' },
    { id: 3,  emoji: '🐭' },
    { id: 4,  emoji: '🐹' },
    { id: 5,  emoji: '🐰' },
    { id: 6,  emoji: '🦊' },
    { id: 7,  emoji: '🐻' },
    { id: 8,  emoji: '🐼' },
    { id: 9,  emoji: '🐨' },
    { id: 10, emoji: '🐯' },
    { id: 11, emoji: '🦁' },
    { id: 12, emoji: '🐮' },
    { id: 13, emoji: '🐷' },
    { id: 14, emoji: '🐸' },
    { id: 15, emoji: '🐵' },
    { id: 16, emoji: '🐔' }
  ];

  const listaB = [
    { id: 17, emoji: '🐶' },
    { id: 18, emoji: '🐱' },
    { id: 19, emoji: '🐭' },
    { id: 20, emoji: '🐹' },
    { id: 21, emoji: '🐰' },
    { id: 22, emoji: '🦊' },
    { id: 23, emoji: '🐻' },
    { id: 24, emoji: '🐼' },
    { id: 25, emoji: '🐨' },
    { id: 26, emoji: '🐯' },
    { id: 27, emoji: '🦁' },
    { id: 28, emoji: '🐮' },
    { id: 29, emoji: '🐷' },
    { id: 30, emoji: '🐸' },
    { id: 31, emoji: '🐵' },
    { id: 32, emoji: '🐔' }
  ];

  const TOTAL_PARES = 16;
  const tabuleiro   = document.getElementById('tabuleiro');
  const elJogadas   = document.getElementById('jogadas');
  const elPares     = document.getElementById('pares');
  const telaInicial = document.getElementById('telaInicial');
  const jogoEl      = document.getElementById('jogo');
  const vitoriaEl   = document.getElementById('vitoria');
  const elJogadasF  = document.getElementById('jogadasFinais');

  let primeiraCarta = null;
  let segundaCarta  = null;
  let travar        = false;
  let jogadas       = 0;
  let paresEncontrados = 0;
  let timeouts      = [];

  function embaralhar(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function limparTimeouts() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
  }

  function iniciarJogo() {
    telaInicial.style.display = 'none';
    vitoriaEl.classList.remove('ativo');
    jogoEl.classList.add('ativo');
    criarTabuleiro();
  }

  function criarTabuleiro() {
    limparTimeouts();
    tabuleiro.innerHTML = '';
    primeiraCarta = segundaCarta = null;
    travar = false;
    jogadas = 0;
    paresEncontrados = 0;
    elJogadas.textContent = 0;
    elPares.textContent = 0;

    // Junta as duas listas (32 cartas) e embaralha
    const cartas = embaralhar([...listaA, ...listaB]);

    cartas.forEach(cartaDados => {
      const carta = document.createElement('div');
      carta.className = 'carta';
      // usamos o emoji como chave do par; o id é a identidade única da carta
      carta.dataset.emoji = cartaDados.emoji;
      carta.dataset.id    = cartaDados.id;

      carta.innerHTML = `
        <div class="face verso">?</div>
        <div class="face frente">${cartaDados.emoji}</div>
      `;

      carta.addEventListener('click', () => virarCarta(carta));
      tabuleiro.appendChild(carta);
    });
  }

  function virarCarta(carta) {
    if (travar) return;
    if (carta.classList.contains('virada')) return;
    if (carta.classList.contains('encontrada')) return;

    carta.classList.add('virada');

    if (!primeiraCarta) {
      primeiraCarta = carta;
      return;
    }

    segundaCarta = carta;
    jogadas++;
    elJogadas.textContent = jogadas;
    travar = true;

    verificarPar();
  }

  function verificarPar() {
    // O par é identificado pelo mesmo emoji (um vem da listaA, outro da listaB)
    const iguais = primeiraCarta.dataset.emoji === segundaCarta.dataset.emoji;

    if (iguais) {
      primeiraCarta.classList.add('encontrada');
      segundaCarta.classList.add('encontrada');
      paresEncontrados++;
      elPares.textContent = paresEncontrados;

      resetarTurno();

      if (paresEncontrados === TOTAL_PARES) {
        timeouts.push(setTimeout(mostrarVitoria, 600));
      }
    } else {
      timeouts.push(setTimeout(() => {
        primeiraCarta.classList.remove('virada');
        segundaCarta.classList.remove('virada');
        resetarTurno();
      }, 900));
    }
  }

  function resetarTurno() {
    primeiraCarta = null;
    segundaCarta = null;
    travar = false;
  }

  function mostrarVitoria() {
    elJogadasF.textContent = jogadas;
    vitoriaEl.classList.add('ativo');
  }

  function reiniciar() {
    vitoriaEl.classList.remove('ativo');
    criarTabuleiro();
  }

  function sairDoJogo() {
    limparTimeouts();
    vitoriaEl.classList.remove('ativo');
    jogoEl.classList.remove('ativo');
    tabuleiro.innerHTML = '';
    telaInicial.style.display = 'block';
  }