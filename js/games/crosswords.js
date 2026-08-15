/**
 * Jogo 3 — Cruzadas Diretas Braille
 */
const DirectCrosswordGame = (() => {
  let currentLevel = 'iniciante';
  let puzzleData = null;
  let userGrid = {};

  const PUZZLES = {
    iniciante: {
      title: 'Animais e Objetos',
      gridSize: 5,
      words: [
        { id: 1, direction: 'across', row: 1, col: 0, word: 'SOL', clue: 'Estrela brilhante do dia (3 letras)' },
        { id: 2, direction: 'down', row: 0, col: 1, word: 'CASA', clue: 'Lugar onde moramos (4 letras)' },
        { id: 3, direction: 'across', row: 3, col: 1, word: 'SAPO', clue: 'Anfíbio verde da lagoa (4 letras)' }
      ]
    },
    intermediario: {
      title: 'Escola e Aprendizado',
      gridSize: 6,
      words: [
        { id: 1, direction: 'across', row: 0, col: 0, word: 'LIVRO', clue: 'Contém histórias e conhecimentos (5 letras)' },
        { id: 2, direction: 'down', row: 0, col: 2, word: 'ESCOLA', clue: 'Lugar onde estudamos (6 letras)' },
        { id: 3, direction: 'across', row: 2, col: 1, word: 'CANETA', clue: 'Usada para escrever com tinta (6 letras)' }
      ]
    },
    avancado: {
      title: 'Inclusão e Sociedade',
      gridSize: 7,
      words: [
        { id: 1, direction: 'across', row: 1, col: 0, word: 'BRAILLE', clue: 'Sistema de escrita tátil para cegos (7 letras)' },
        { id: 2, direction: 'down', row: 0, col: 1, word: 'RESPEITO', clue: 'Consideração e carinho pelas pessoas (8 letras)' }
      ]
    }
  };

  function init(level = 'iniciante') {
    currentLevel = level;
    userGrid = {};
    puzzleData = PUZZLES[level] || PUZZLES.iniciante;

    render();
    AudioEngine.speak(`Cruzada Direta iniciada: ${puzzleData.title}. Escolha um espaço no tabuleiro para preencher.`);
  }

  function typeLetter(row, col, char) {
    const letter = char.toUpperCase();
    if (!letter.match(/[A-Z]/)) return;

    userGrid[`${row}-${col}`] = letter;
    AudioEngine.speakLetter(letter);
    AudioEngine.playClick();
    render();

    checkPuzzleCompletion();
  }

  function checkPuzzleCompletion() {
    let allCorrect = true;
    puzzleData.words.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'across' ? w.row : w.row + i;
        const c = w.direction === 'across' ? w.col + i : w.col;
        const expected = w.word[i];
        const val = userGrid[`${r}-${c}`];
        if (val !== expected) {
          allCorrect = false;
        }
      }
    });

    if (allCorrect) {
      AudioEngine.playWin();
      TeacherMode.recordGameResult('Cruzadas Diretas', true, `Tema: ${puzzleData.title}`);
      setTimeout(() => {
        AudioEngine.speak('Fantástico! Você completou toda a Cruzada Direta com perfeição!');
      }, 500);
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    const size = puzzleData.gridSize;
    let gridCellsHTML = `<div class="crossword-grid grid-size-${size}" style="grid-template-columns: repeat(${size}, 1fr);" role="grid">`;

    // Constrói mapa de células válidas da cruzada
    const validCells = {};
    puzzleData.words.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'across' ? w.row : w.row + i;
        const c = w.direction === 'across' ? w.col + i : w.col;
        if (!validCells[`${r}-${c}`]) {
          validCells[`${r}-${c}`] = { wordNumber: (i === 0 ? w.id : null), expected: w.word[i] };
        }
      }
    });

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const key = `${r}-${c}`;
        const cellData = validCells[key];

        if (!cellData) {
          gridCellsHTML += `<div class="crossword-cell black-cell" aria-hidden="true"></div>`;
        } else {
          const userVal = userGrid[key] || '';
          const isFilled = !!userVal;
          const isCorrect = userVal === cellData.expected;
          const info = userVal ? getCharInfo(userVal) : null;

          gridCellsHTML += `
            <div class="crossword-cell active-cell ${isFilled ? (isCorrect ? 'correct' : 'incorrect') : ''}">
              ${cellData.wordNumber ? `<span class="cell-number">${cellData.wordNumber}</span>` : ''}
              <input type="text" class="cell-input" maxlength="1" value="${userVal}"
                oninput="DirectCrosswordGame.typeLetter(${r}, ${c}, this.value)"
                onfocus="AudioEngine.speak('Espaço linha ${r+1}, coluna ${c+1}.${cellData.wordNumber ? ' Início da dica ' + cellData.wordNumber : ''}. ${userVal ? 'Contém letra ' + userVal : 'Vazio'}')"
                aria-label="Linha ${r+1}, Coluna ${c+1}. ${userVal ? 'Letra ' + userVal : 'Vazio'}" />
              ${userVal ? `
                <div class="cell-dual-overlay">
                  <span class="ink">${userVal}</span>
                  <span class="braille">${info ? info.unicode : ''}</span>
                </div>
              ` : ''}
            </div>
          `;
        }
      }
    }
    gridCellsHTML += `</div>`;

    // Dicas
    let cluesHTML = '<div class="crossword-clues-panel">';
    cluesHTML += '<h3>Dicas:</h3><ul class="clues-list">';
    puzzleData.words.forEach(w => {
      cluesHTML += `
        <li class="clue-item" tabindex="0" onclick="AudioEngine.speak('Dica ${w.id}: ${w.clue}')">
          <button type="button" class="btn-sound-mini" aria-label="Ouvir dica ${w.id}">🔊</button>
          <strong>${w.id}. (${w.direction === 'across' ? 'Horizontal' : 'Vertical'}):</strong> ${w.clue}
        </li>
      `;
    });
    cluesHTML += '</ul></div>';

    container.innerHTML = `
      <div class="game-wrapper crossword-wrapper">
        <div class="game-header-bar">
          <h2>Cruzadas Diretas Braille</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge theme-badge">${puzzleData.title}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p>Digite cada letra nos quadrados. Cada letra exibirá seu padrão em Tinta e Braille simultaneamente.</p>
        </div>

        <div class="crossword-layout">
          ${gridCellsHTML}
          ${cluesHTML}
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="DirectCrosswordGame.init('${currentLevel}')">🔄 Reiniciar Cruzada</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Dicas da cruzada: ' + puzzleData.words.map(w => 'Número ' + w.id + ': ' + w.clue).join('. '))">🔊 Ouvir Todas as Dicas</button>
        </div>
      </div>
    `;
  }

  return { init, typeLetter, render };
})();
