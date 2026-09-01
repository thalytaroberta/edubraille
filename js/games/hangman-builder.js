/**
 * Jogo 11 — Forca Braille Ponto a Ponto (Células em Branco com 6 Círculos)
 */
const HangmanBuilderGame = (() => {
  let secretWord = '';
  let wordHint = '';
  let currentBlankDots = []; // Pontos selecionados na célula em branco atual [1, 2]
  let guessedLetters = new Set();
  let errors = 0;
  const maxErrors = 6;
  let currentLevel = 'iniciante';

  function init(level = 'iniciante') {
    currentLevel = level;
    guessedLetters.clear();
    currentBlankDots = [];
    errors = 0;

    const theme = window.GameFeed ? window.GameFeed.getActiveCategoryTheme() : 'aleatorio';
    let item;
    if (window.WordManager) {
      item = Championship.isChampionshipModeActive()
        ? window.WordManager.getRandomWordForChampionship(theme)
        : window.WordManager.getRandomWord(theme, level);
    } else {
      const db = GAME_DATABASES.words[level] || GAME_DATABASES.words.iniciante;
      item = db[Math.floor(Math.random() * db.length)];
    }
    secretWord = item.word;
    wordHint = item.hint;

    render();
    AudioEngine.speak(`Forca Braille Ponto a Ponto iniciada. Dica: ${wordHint}. Clique nos 6 círculos vazios da célula em branco para montar a letra que deseja tentar.`);
  }


  function toggleDot(dotNum) {
    const idx = currentBlankDots.indexOf(dotNum);
    if (idx >= 0) {
      currentBlankDots.splice(idx, 1);
      AudioEngine.speak(`Ponto ${dotNum} desativado.`);
    } else {
      currentBlankDots.push(dotNum);
      AudioEngine.speak(`Ponto ${dotNum} elevado!`);
    }

    AudioEngine.playClick();
    const formedObj = dotsToChar(currentBlankDots);
    if (formedObj.char && formedObj.char !== '?') {
      AudioEngine.speak(`Letra ${formedObj.name} formada na célula em branco.`);
    }

    render();
  }

  function submitCurrentLetter() {
    const formedObj = dotsToChar(currentBlankDots);
    const letter = formedObj.char;

    if (!letter || letter === '?') {
      AudioEngine.playError();
      AudioEngine.speak('Nenhuma letra reconhecida formada na célula. Clique nos círculos para selecionar pontos válidos.');
      return;
    }

    if (guessedLetters.has(letter)) {
      AudioEngine.speak(`A letra ${letter} já foi tentada anteriormente.`);
      return;
    }

    guessedLetters.add(letter);

    if (secretWord.includes(letter)) {
      AudioEngine.playSuccess();
      AudioEngine.speak(`Parabéns! A letra ${letter} montada na célula em branco pertence à palavra!`);
    } else {
      errors++;
      AudioEngine.playError();
      AudioEngine.speak(`Que pena! A letra ${letter} não está na palavra secreta. Erros: ${errors} de ${maxErrors}.`);
    }

    currentBlankDots = [];
    render();

    if (checkWin()) {
      AudioEngine.playWin();
      TeacherMode.recordGameResult('Forca Ponto a Ponto', true, `Palavra: ${secretWord}`);
      if (window.Championship) {
        window.Championship.recordMatchResult('Forca Ponto a Ponto', true, secretWord.length, secretWord.length);
      }
      setTimeout(() => {
        AudioEngine.speak(`Vitória espetacular! Você montou e adivinhou a palavra ${secretWord} ponto a ponto!`);
      }, 500);
    } else if (errors >= maxErrors) {
      AudioEngine.playError();
      TeacherMode.recordGameResult('Forca Ponto a Ponto', false, `Palavra era: ${secretWord}`);
      if (window.Championship) {
        const correctCount = secretWord.split('').filter(c => guessedLetters.has(c)).length;
        window.Championship.recordMatchResult('Forca Ponto a Ponto', false, correctCount, secretWord.length);
      }
      setTimeout(() => {
        AudioEngine.speak(`Fim de jogo! A palavra secreta era ${secretWord}.`);
      }, 500);
    }
  }

  function clearBlankCell() {
    currentBlankDots = [];
    AudioEngine.playClick();
    AudioEngine.speak('Célula em branco limpa.');
    render();
  }

  function checkWin() {
    return secretWord.split('').every(ch => guessedLetters.has(ch));
  }

  function isGameOver() {
    return errors >= maxErrors || checkWin();
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    const currentFormed = dotsToChar(currentBlankDots);

    // Slots da Palavra (Células em Branco / Reveladas)
    let slotsHTML = '<div class="blank-hangman-slots" role="region" aria-label="Espaços da palavra secreta com células em branco">';
    secretWord.split('').forEach((ch, idx) => {
      const isRevealed = guessedLetters.has(ch) || isGameOver();
      if (isRevealed) {
        slotsHTML += renderDualCellHTML(ch, { size: 'medium' });
      } else {
        // Exibe Célula Braille em Branco (6 círculos vazios)
        slotsHTML += `
          <div class="blank-braille-slot medium" tabindex="0" aria-label="Espaço ${idx+1} em branco">
            <span class="slot-ink-placeholder">?</span>
            <div class="blank-circle-grid">
              <div class="circle-row"><span class="blank-circle"></span><span class="blank-circle"></span></div>
              <div class="circle-row"><span class="blank-circle"></span><span class="blank-circle"></span></div>
              <div class="circle-row"><span class="blank-circle"></span><span class="blank-circle"></span></div>
            </div>
            <span class="dots-text-label">Espaço ${idx+1}</span>
          </div>
        `;
      }
    });
    slotsHTML += '</div>';

    // Célula Interativa de Entrada (6 Círculos Clicáveis)
    const activeSet = new Set(currentBlankDots);
    let builderCellHTML = '<div class="blank-input-cell-box" role="region" aria-label="Célula em branco para montar a letra">';
    builderCellHTML += '<h3>⚪ Célula em Branco (Clique nos Círculos):</h3>';
    builderCellHTML += '<div class="blank-matrix-builder">';
    
    const matrix = [[1, 4], [2, 5], [3, 6]];
    matrix.forEach(row => {
      builderCellHTML += '<div class="matrix-row">';
      row.forEach(dotNum => {
        const isActive = activeSet.has(dotNum);
        builderCellHTML += `
          <button type="button" class="blank-dot-circle ${isActive ? 'active' : ''}" 
            onclick="HangmanBuilderGame.toggleDot(${dotNum})"
            aria-label="Ponto ${dotNum}: ${isActive ? 'Elevado' : 'Vazio em branco'}">
            <span class="circle-inner"></span>
            <span class="circle-num">${dotNum}</span>
          </button>
        `;
      });
      builderCellHTML += '</div>';
    });
    builderCellHTML += '</div>';

    builderCellHTML += `
      <div class="builder-status-panel">
        <span class="status-title">Letra Montada:</span>
        <span class="status-char">${currentFormed.char || '_'}</span>
        <span class="status-desc">${currentFormed.name}</span>
        
        <div class="builder-actions-btns">
          <button type="button" class="btn btn-primary" onclick="HangmanBuilderGame.submitCurrentLetter()" ${!currentFormed.char || isGameOver() ? 'disabled' : ''}>
            ✅ Tentar Letra "${currentFormed.char || '?'}"
          </button>
          <button type="button" class="btn btn-secondary" onclick="HangmanBuilderGame.clearBlankCell()">
            🧹 Limpar Célula
          </button>
        </div>
      </div>
    `;
    builderCellHTML += '</div>';

    // Letras Já Tentadas
    let guessedHTML = '<div class="guessed-letters-chips">';
    guessedLetters.forEach(letra => {
      const isCorrect = secretWord.includes(letra);
      guessedHTML += `<span class="chip ${isCorrect ? 'correct' : 'wrong'}">${letra} (${getCharInfo(letra).unicode})</span>`;
    });
    guessedHTML += '</div>';

    const teacherPanel = TeacherMode.buildTeacherPanel(secretWord, wordHint, guessedLetters, errors, maxErrors);

    container.innerHTML = `
      <div class="game-wrapper hangman-builder-wrapper">
        <div class="game-header-bar">
          <h2>Forca Braille Ponto a Ponto (Células em Branco)</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge errors-badge ${errors > 4 ? 'danger' : ''}">Erros: ${errors} / ${maxErrors}</span>
          </div>
        </div>

        <div class="${teacherPanel ? 'game-layout-grid' : ''}">
          <div class="game-main-col">
            <div class="hint-card-box">
              <span class="hint-icon">💡</span>
              <p class="hint-text"><strong>Dica:</strong> ${wordHint}</p>
              <button type="button" class="btn-sound-mini" onclick="AudioEngine.speak('Dica: ${wordHint}')">🔊 Ouvir Dica</button>
            </div>

            <div class="game-instructions-box">
              <p>Monte cada letra clicando nos <strong>círculos vazios da Célula em Branco</strong> (pontos 1 a 6). Depois clique em <strong>"Tentar Letra"</strong>.</p>
            </div>

            ${slotsHTML}
            ${builderCellHTML}

            <div class="used-letters-section">
              <h4>Letras Tentadas:</h4>
              ${guessedHTML || '<p class="text-muted">Nenhuma letra tentada ainda.</p>'}
            </div>

            <div class="game-actions-bar">
              <button type="button" class="btn btn-primary" onclick="HangmanBuilderGame.init('${currentLevel}')">🔄 Jogar Novamente</button>
            </div>
          </div>
          ${teacherPanel}
        </div>
      </div>
    `;
  }

  function handleKeyInput(e) {
    if (!e || !e.key) return;

    if (isGameOver()) {
      if (e.key === 'Enter' || e.key.toLowerCase() === 'r') {
        init(currentLevel);
      }
      return;
    }

    // Teclas 1 a 6 alternam os pontos na célula em branco
    if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      toggleDot(parseInt(e.key, 10));
      return;
    }

    // Enter envia a letra formada
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCurrentLetter();
      return;
    }

    // Backspace / Delete ou C limpa a célula
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key.toLowerCase() === 'c') {
      e.preventDefault();
      clearBlankCell();
      return;
    }

    // Digitação de letra direta (A-Z) no teclado físico
    const key = e.key.toUpperCase();
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      e.preventDefault();
      const info = getCharInfo(key);
      if (info && info.dots) {
        currentBlankDots = [...info.dots];
        render();
        submitCurrentLetter();
      }
    }
  }

  return { init, toggleDot, submitCurrentLetter, clearBlankCell, render, handleKeyInput };
})();

window.HangmanBuilderGame = HangmanBuilderGame;


