/**
 * Jogo 8 — Bingo de Letras Braille
 */
const BingoGame = (() => {
  let cardLetters = [];
  let markedLetters = new Set();
  let drawnHistory = [];
  let currentDrawn = null;
  let isGameOver = false;

  function init() {
    cardLetters = [];
    markedLetters.clear();
    drawnHistory = [];
    currentDrawn = null;
    isGameOver = false;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    cardLetters = [...alphabet].sort(() => 0.5 - Math.random()).slice(0, 9);

    render();
    AudioEngine.speak('Bingo de Letras iniciado. Sua cartela tem 9 letras em Tinta e Braille. Clique em Sortear Letra para começar!');
  }

  function drawNextLetter() {
    if (isGameOver) return;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const available = alphabet.filter(ch => !drawnHistory.includes(ch));
    if (available.length === 0) {
      AudioEngine.speak('Todas as letras do alfabeto já foram sorteadas!');
      return;
    }

    currentDrawn = available[Math.floor(Math.random() * available.length)];
    drawnHistory.unshift(currentDrawn);
    AudioEngine.playClick();

    const info = getCharInfo(currentDrawn);
    AudioEngine.speak(`Letra sorteada: ${info.name}! Padrão Braille: ${info.desc}. Verifique se você tem esta letra na sua cartela.`);

    render();
  }

  function markCardLetter(char) {
    if (isGameOver || markedLetters.has(char)) return;

    if (drawnHistory.includes(char)) {
      markedLetters.add(char);
      AudioEngine.playSuccess();
      AudioEngine.speak(`Letra ${char} marcada na cartela!`);
      render();

      if (markedLetters.size === 9) {
        isGameOver = true;
        AudioEngine.playWin();
        TeacherMode.recordGameResult('Bingo de Letras', true, 'Cartela Cheia');
        setTimeout(() => {
          AudioEngine.speak('BINGO! BINGO! Parabéns! Você completou toda a cartela do Bingo de Letras!');
        }, 500);
      }
    } else {
      AudioEngine.playError();
      AudioEngine.speak(`A letra ${char} ainda não foi sorteada no Bingo! Aguarde o sorteio.`);
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    // Cartela 3x3
    let bingoCardHTML = '<div class="bingo-card-grid" role="grid" aria-label="Sua cartela de Bingo com 9 letras">';
    cardLetters.forEach(ch => {
      const isMarked = markedLetters.has(ch);
      bingoCardHTML += `
        <div class="bingo-cell-wrapper ${isMarked ? 'marked' : ''}" onclick="BingoGame.markCardLetter('${ch}')">
          ${renderDualCellHTML(ch, { size: 'medium', showAudioBtn: false })}
          ${isMarked ? '<div class="bingo-stamp">✓</div>' : ''}
        </div>
      `;
    });
    bingoCardHTML += '</div>';

    // Histórico de Sorteadas
    let historyHTML = '<div class="drawn-history-chips">';
    drawnHistory.forEach(ch => {
      historyHTML += `<span class="chip">${ch} (${getCharInfo(ch).unicode})</span>`;
    });
    historyHTML += '</div>';

    const drawnInfo = currentDrawn ? getCharInfo(currentDrawn) : null;

    container.innerHTML = `
      <div class="game-wrapper bingo-wrapper">
        <div class="game-header-bar">
          <h2>Bingo de Letras Braille</h2>
          <div class="game-meta">
            <span class="badge score-badge">Marcadas: ${markedLetters.size} / 9</span>
          </div>
        </div>

        <div class="bingo-layout">
          <div class="caller-box">
            <h3>Globo de Sorteio</h3>
            <div class="drawn-letter-display">
              ${currentDrawn ? renderDualCellHTML(currentDrawn, { size: 'large' }) : '<div class="empty-ball">🎯</div>'}
            </div>
            <button type="button" class="btn btn-primary btn-draw" onclick="BingoGame.drawNextLetter()" ${isGameOver ? 'disabled' : ''}>
              🎲 Sortear Próxima Letra
            </button>
            <h4>Letras Sorteadas (${drawnHistory.length}):</h4>
            ${historyHTML}
          </div>

          <div class="player-card-box">
            <h3>Sua Cartela de Bingo:</h3>
            ${bingoCardHTML}
          </div>
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-secondary" onclick="BingoGame.init()">🔄 Nova Cartela</button>
        </div>
      </div>
    `;
  }

  return { init, drawNextLetter, markCardLetter, render };
})();
