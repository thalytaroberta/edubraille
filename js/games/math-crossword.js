/**
 * Jogo 5 — Cruzadas Numéricas Braille
 */
const MathCrosswordGame = (() => {
  let currentLevel = 'iniciante';
  let currentProblem = null;
  let userDigits = [];

  function init(level = 'iniciante') {
    currentLevel = level;
    userDigits = [];

    const db = GAME_DATABASES.math[level] || GAME_DATABASES.math.iniciante;
    currentProblem = db[Math.floor(Math.random() * db.length)];

    render();
    AudioEngine.speak(`Cruzada Numérica iniciada. Operação matemática: ${currentProblem.hint}. Digite o resultado numérico.`);
  }

  function typeDigit(digitStr) {
    const d = digitStr.trim();
    if (!d.match(/[0-9]/)) return;

    if (userDigits.length < currentProblem.answer.length) {
      userDigits.push(d);
      AudioEngine.speakLetter(d);
      AudioEngine.playClick();
      render();
      checkWin();
    }
  }

  function clearDigits() {
    userDigits = [];
    AudioEngine.playClick();
    AudioEngine.speak('Dígitos apagados.');
    render();
  }

  function checkWin() {
    const val = userDigits.join('');
    if (val.length === currentProblem.answer.length) {
      if (val === currentProblem.answer) {
        AudioEngine.playWin();
        TeacherMode.recordGameResult('Cruzadas Numéricas', true, `Operação: ${currentProblem.problem} = ${val}`);
        if (window.Championship) {
          window.Championship.recordMatchResult('Cruzadas Numéricas', true, 1, 1);
        }
        setTimeout(() => {
          AudioEngine.speak(`Excelente! ${currentProblem.problem} é igual a ${val}! Resposta numérica correta!`);
        }, 500);
      } else {
        AudioEngine.playError();
        AudioEngine.speak(`Resposta ${val} está incorreta para a operação ${currentProblem.problem}. Tente novamente.`);
      }
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    // Renderiza cada dígito em Tinta + Braille Numérico (precedido por ⠼)
    let digitsHTML = '<div class="math-digits-row" role="region" aria-label="Resultado numérico em Tinta e Braille">';
    for (let i = 0; i < currentProblem.answer.length; i++) {
      const dVal = userDigits[i];
      if (dVal) {
        digitsHTML += renderDualCellHTML(dVal, { size: 'medium' });
      } else {
        digitsHTML += `
          <div class="dual-cell-card medium placeholder-slot" tabindex="0" aria-label="Dígito ${i+1} pendente">
            <span class="ink-char-display">_</span>
            <span class="braille-unicode-display">⠼⠀</span>
            <div class="dual-cell-body"><span class="dots-text-label">?</span></div>
          </div>
        `;
      }
    }
    digitsHTML += '</div>';

    // Teclado Numérico 0-9
    let numpadHTML = '<div class="numpad-grid" role="group" aria-label="Teclado numérico de 0 a 9">';
    for (let d = 1; d <= 9; d++) {
      const info = getCharInfo(d.toString());
      numpadHTML += `
        <button type="button" class="numpad-btn" 
          onclick="MathCrosswordGame.typeDigit('${d}')"
          onfocus="AudioEngine.speak('Número ${d}, braille sinal de número mais ${info.desc}')"
          aria-label="Número ${d}">
          <span class="numpad-ink">${d}</span>
          <span class="numpad-braille">⠼${info.unicode}</span>
        </button>
      `;
    }
    const info0 = getCharInfo('0');
    numpadHTML += `
      <button type="button" class="numpad-btn" 
        onclick="MathCrosswordGame.typeDigit('0')"
        onfocus="AudioEngine.speak('Número 0, braille sinal de número mais ${info0.desc}')"
        aria-label="Número 0">
        <span class="numpad-ink">0</span>
        <span class="numpad-braille">⠼${info0.unicode}</span>
      </button>
    `;
    numpadHTML += `
      <button type="button" class="numpad-btn clear-btn" 
        onclick="MathCrosswordGame.clearDigits()"
        aria-label="Apagar dígitos digitados">
        ❌ Apagar
      </button>
    `;
    numpadHTML += '</div>';

    container.innerHTML = `
      <div class="game-wrapper math-wrapper">
        <div class="game-header-bar">
          <h2>Cruzadas Numéricas Braille</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
          </div>
        </div>

        <div class="math-problem-box">
          <span class="math-icon">🔢</span>
          <h3 class="problem-display">${currentProblem.problem} = ?</h3>
          <p class="problem-hint"><strong>Dica:</strong> ${currentProblem.hint}</p>
          <button type="button" class="btn-sound-mini" onclick="AudioEngine.speak('Calcule: ${currentProblem.hint}')">🔊 Ouvir Operação</button>
        </div>

        <div class="math-board-area">
          <h3>Seu Resultado (Tinta + Braille Numérico):</h3>
          ${digitsHTML}
          ${numpadHTML}
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="MathCrosswordGame.init('${currentLevel}')">🔄 Nova Operação</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Operação: ${currentProblem.problem}. Você já digitou: ${userDigits.join('') || 'nada ainda'}.')">🔊 Ouvir Situação</button>
        </div>
      </div>
    `;
  }

  return { init, typeDigit, clearDigits, render };
})();

window.MathCrosswordGame = MathCrosswordGame;

