/**
 * Jogo 3 — Cruzadas Diretas Braille (Com modo de preenchimento Ponto a Ponto em Células Vazias)
 */
const DirectCrosswordGame = (() => {
  let currentLevel = 'iniciante';
  let puzzleData = null;
  let userCellDots = {}; // Armazena os pontos elevados de cada célula { "r-c": [1, 2] }
  let selectedCell = null; // { r, c }
  let isPointByPointMode = true; // Padrão: Preenchimento Ponto a Ponto em células vazias

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
    userCellDots = {};
    selectedCell = null;
    puzzleData = PUZZLES[level] || PUZZLES.iniciante;

    render();
    AudioEngine.speak(`Cruzada Direta iniciada: ${puzzleData.title}. Clique em uma célula vazia para formar a letra ponto a ponto (pontos 1 a 6).`);
  }

  function selectCrosswordCell(r, c) {
    selectedCell = { r, c };
    const key = `${r}-${c}`;
    const dots = userCellDots[key] || [];
    const formedChar = dotsToChar(dots);

    AudioEngine.playClick();
    if (formedChar.char) {
      AudioEngine.speak(`Linha ${r+1}, Coluna ${c+1} selecionada. Contém letra ${formedChar.name}. Selecione os pontos de 1 a 6 para alterar.`);
    } else {
      AudioEngine.speak(`Linha ${r+1}, Coluna ${c+1} selecionada. Célula vazia. Selecione os pontos de 1 a 6 para formar a letra.`);
    }

    render();
  }

  function toggleCellDot(cellKey, dotNum) {
    let key = cellKey;
    if (typeof cellKey === 'object' && cellKey !== null) {
      key = `${cellKey.r}-${cellKey.c}`;
    }

    if (!userCellDots[key]) {
      userCellDots[key] = [];
    }

    const currentDots = userCellDots[key];
    const idx = currentDots.indexOf(dotNum);
    if (idx >= 0) {
      currentDots.splice(idx, 1);
      AudioEngine.speak(`Ponto ${dotNum} desativado.`);
    } else {
      currentDots.push(dotNum);
      AudioEngine.speak(`Ponto ${dotNum} elevado!`);
    }

    AudioEngine.playClick();

    const formed = dotsToChar(currentDots);
    if (formed.char && formed.char !== '?') {
      AudioEngine.speak(`Letra ${formed.name} formada com sucesso!`);
    }

    render();
    checkPuzzleCompletion();
  }

  function toggleInputMode() {
    isPointByPointMode = !isPointByPointMode;
    AudioEngine.playClick();
    AudioEngine.speak(isPointByPointMode 
      ? 'Modo Preenchimento Ponto a Ponto ativado! Construa as letras clicando nos pontos 1 a 6 de cada célula vazia.' 
      : 'Modo Teclado ativado. Digite as letras diretamente.');
    render();
  }

  function typeDirectLetter(r, c, char) {
    const letter = char.toUpperCase();
    if (!letter.match(/[A-Z]/)) return;

    const info = getCharInfo(letter);
    userCellDots[`${r}-${c}`] = [...info.dots];
    
    AudioEngine.speakLetter(letter);
    AudioEngine.playClick();
    render();

    checkPuzzleCompletion();
  }

  function clearCell(r, c) {
    const key = `${r}-${c}`;
    userCellDots[key] = [];
    AudioEngine.playClick();
    AudioEngine.speak('Célula limpa.');
    render();
  }

  function checkPuzzleCompletion() {
    let allCorrect = true;
    puzzleData.words.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'across' ? w.row : w.row + i;
        const c = w.direction === 'across' ? w.col + i : w.col;
        const expectedLetter = w.word[i];
        const dots = userCellDots[`${r}-${c}`] || [];
        const formedChar = dotsToChar(dots).char;
        if (formedChar !== expectedLetter) {
          allCorrect = false;
        }
      }
    });

    if (allCorrect) {
      AudioEngine.playWin();
      TeacherMode.recordGameResult('Cruzadas Diretas', true, `Tema: ${puzzleData.title} (Ponto a Ponto)`);
      if (window.Championship) {
        const totalCells = puzzleData.words.reduce((acc, w) => acc + w.word.length, 0);
        window.Championship.recordMatchResult('Cruzadas Diretas', true, totalCells, totalCells);
      }
      setTimeout(() => {
        AudioEngine.speak('Fantástico! Você completou toda a Cruzada Direta preenchendo as células ponto a ponto com perfeição!');
      }, 500);
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    const size = puzzleData.gridSize;

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

    let gridCellsHTML = `<div class="crossword-grid grid-size-${size}" style="grid-template-columns: repeat(${size}, 1fr);" role="grid" aria-label="Grade da Cruzada">`;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const key = `${r}-${c}`;
        const cellData = validCells[key];

        if (!cellData) {
          gridCellsHTML += `<div class="crossword-cell black-cell" aria-hidden="true"></div>`;
        } else {
          const dots = userCellDots[key] || [];
          const formedObj = dotsToChar(dots);
          const isFilled = dots.length > 0;
          const isCorrect = formedObj.char === cellData.expected;
          const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;

          gridCellsHTML += `
            <div class="crossword-cell active-cell ${isSelected ? 'selected' : ''} ${isFilled ? (isCorrect ? 'correct' : 'incorrect') : 'empty-cell-grid'}"
              onclick="DirectCrosswordGame.selectCrosswordCell(${r}, ${c})"
              tabindex="0"
              role="gridcell"
              aria-label="Linha ${r+1}, Coluna ${c+1}.${cellData.wordNumber ? ' Início da dica ' + cellData.wordNumber : ''}. ${isFilled ? 'Letra formada: ' + formedObj.name : 'Célula vazia sem preenchimento'}">
              
              ${cellData.wordNumber ? `<span class="cell-number">${cellData.wordNumber}</span>` : ''}

              <div class="cell-braille-mini-preview">
                <span class="cell-ink-big">${formedObj.char || '?'}</span>
                <span class="cell-unicode-symbol">${formedObj.unicode}</span>
              </div>
            </div>
          `;
        }
      }
    }
    gridCellsHTML += `</div>`;

    // Painel do Construtor Ponto a Ponto para a Célula Selecionada
    let builderPanelHTML = '';
    if (selectedCell) {
      const { r, c } = selectedCell;
      const key = `${r}-${c}`;
      const currentDots = userCellDots[key] || [];
      const cellData = validCells[key];
      const formedObj = dotsToChar(currentDots);

      builderPanelHTML = `
        <div class="point-builder-panel" role="region" aria-label="Painel Construtor Ponto a Ponto">
          <h3>✍️ Construtor Ponto a Ponto (Linha ${r+1}, Coluna ${c+1})</h3>
          <p class="builder-hint">Clique nos pontos 1 a 6 para elevar ou abaixar cada ponto e formar a letra:</p>
          
          <div class="builder-interactive-wrapper">
            ${renderInteractiveEmptyCellHTML(`builder-cell-${r}-${c}`, currentDots, 'DirectCrosswordGame.toggleCellDotFromBuilder', { size: 'large' })}
            
            <div class="builder-feedback-side">
              <div class="result-box">
                <span class="result-label">Letra Formada:</span>
                <span class="result-char">${formedObj.char || 'Nenhuma'}</span>
                <span class="result-desc">${formedObj.name}</span>
              </div>
              
              <button type="button" class="btn btn-secondary" onclick="DirectCrosswordGame.clearCell(${r}, ${c})">
                🗑️ Limpar Célula
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      builderPanelHTML = `
        <div class="point-builder-panel empty-state">
          <p class="text-muted">👉 Clique em qualquer quadrado vazio no tabuleiro da Cruzada para abrir o <strong>Construtor Ponto a Ponto (Pontos 1-6)</strong>.</p>
        </div>
      `;
    }

    // Dicas
    let cluesHTML = '<div class="crossword-clues-panel">';
    cluesHTML += '<h3>Dicas da Cruzada:</h3><ul class="clues-list">';
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
          <h2>Cruzadas Diretas Braille — Ponto a Ponto</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge theme-badge">${puzzleData.title}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p><strong>Novo Modo Ponto a Ponto:</strong> As células do tabuleiro iniciam em branco. Selecione uma célula e clique nos <strong>pontos 1 a 6</strong> para formar cada letra em Braille!</p>
        </div>

        <div class="crossword-mode-bar" style="margin-bottom: 1rem;">
          <button type="button" class="btn ${isPointByPointMode ? 'btn-primary' : 'btn-secondary'}" onclick="DirectCrosswordGame.toggleInputMode()">
            ${isPointByPointMode ? '🟡 Modo Atual: Construtor Ponto a Ponto (Pontos 1-6)' : '⌨️ Modo Atual: Teclado Direto'}
          </button>
        </div>

        <div class="crossword-layout">
          ${gridCellsHTML}
          ${cluesHTML}
        </div>

        ${builderPanelHTML}

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="DirectCrosswordGame.init('${currentLevel}')">🔄 Reiniciar Cruzada</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Dicas da cruzada: ' + puzzleData.words.map(w => 'Número ' + w.id + ': ' + w.clue).join('. '))">🔊 Ouvir Dicas</button>
        </div>
      </div>
    `;
  }

  function toggleCellDotFromBuilder(elementId, dotNum) {
    if (selectedCell) {
      toggleCellDot(selectedCell, dotNum);
    }
  }

  function handleKeyInput(e) {
    if (!e || !e.key) return;

    // Se nenhuma célula estiver selecionada, seleciona a primeira célula válida
    if (!selectedCell) {
      for (const w of puzzleData.words) {
        selectedCell = { r: w.row, c: w.col };
        render();
        break;
      }
    }

    const { r, c } = selectedCell;

    // Navegação com setas do teclado
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectCrosswordCell(r, Math.min(puzzleData.gridSize - 1, c + 1));
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectCrosswordCell(r, Math.max(0, c - 1));
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectCrosswordCell(Math.min(puzzleData.gridSize - 1, r + 1), c);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectCrosswordCell(Math.max(0, r - 1), c);
      return;
    }

    // Teclas 1 a 6 alternam os pontos na célula selecionada
    if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      toggleCellDot(selectedCell, parseInt(e.key, 10));
      return;
    }

    // Backspace / Delete apaga o conteúdo da célula selecionada
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      clearCell(r, c);
      return;
    }

    // Digitação direta de letras A-Z
    const key = e.key.toUpperCase();
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      e.preventDefault();
      typeDirectLetter(r, c, key);

      // Avança para a próxima célula da palavra
      const activeWord = puzzleData.words.find(w => {
        if (w.direction === 'across' && w.row === r && c >= w.col && c < w.col + w.word.length) return true;
        if (w.direction === 'down' && w.col === c && r >= w.row && r < w.row + w.word.length) return true;
        return false;
      });

      if (activeWord) {
        if (activeWord.direction === 'across' && c + 1 < activeWord.col + activeWord.word.length) {
          selectCrosswordCell(r, c + 1);
        } else if (activeWord.direction === 'down' && r + 1 < activeWord.row + activeWord.word.length) {
          selectCrosswordCell(r + 1, c);
        }
      }
    }
  }

  return { init, selectCrosswordCell, toggleCellDot, toggleCellDotFromBuilder, toggleInputMode, typeDirectLetter, clearCell, render, handleKeyInput };
})();

window.DirectCrosswordGame = DirectCrosswordGame;

