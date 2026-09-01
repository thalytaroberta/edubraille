/**
 * Jogo 2 — Caça-Palavras Braille (Com modo de seleção e inspeção Ponto a Ponto)
 */
const WordSearchGame = (() => {
  let gridSize = 6;
  let grid = [];
  let cellDotsMap = {}; // Mapeamento de pontos por célula "r-c": [1, 2]
  let targetWords = [];
  let foundWords = new Set();
  let selectedCells = [];
  let currentLevel = 'iniciante';
  let activeInspectorCell = null; // Célula sendo inspecionada/editada ponto a ponto { r, c }

  function init(level = 'iniciante') {
    currentLevel = level;
    foundWords.clear();
    selectedCells = [];
    activeInspectorCell = null;
    cellDotsMap = {};

    gridSize = level === 'iniciante' ? 6 : (level === 'intermediario' ? 8 : 10);
    const db = GAME_DATABASES.words[level] || GAME_DATABASES.words.iniciante;
    
    const shuffled = [...db].sort(() => 0.5 - Math.random());
    const numWords = level === 'iniciante' ? 3 : (level === 'intermediario' ? 4 : 5);
    targetWords = shuffled.slice(0, numWords).map(item => item.word);

    generateGrid();
    render();
    AudioEngine.speak(`Caça-Palavras iniciado com grade de ${gridSize} por ${gridSize} células Braille. Encontre as ${targetWords.length} palavras.`);
  }

  function generateGrid() {
    grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    targetWords.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        attempts++;
        const isHorizontal = Math.random() > 0.5;
        const row = isHorizontal ? Math.floor(Math.random() * gridSize) : Math.floor(Math.random() * (gridSize - word.length + 1));
        const col = isHorizontal ? Math.floor(Math.random() * (gridSize - word.length + 1)) : Math.floor(Math.random() * gridSize);

        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = isHorizontal ? row : row + i;
          const c = isHorizontal ? col + i : col;
          if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            grid[r][c] = word[i];
          }
          placed = true;
        }
      }
    });

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        // Inicializa mapa de pontos Braille da célula
        const info = getCharInfo(grid[r][c]);
        cellDotsMap[`${r}-${c}`] = [...info.dots];
      }
    }
  }

  function clickCell(r, c) {
    const char = grid[r][c];
    const key = `${r}-${c}`;
    activeInspectorCell = { r, c };

    AudioEngine.speakLetter(char);
    AudioEngine.playClick();

    const idx = selectedCells.findIndex(cell => cell.r === r && cell.c === c);
    if (idx >= 0) {
      selectedCells.splice(idx, 1);
    } else {
      selectedCells.push({ r, c, char });
    }

    checkSelectedWord();
    render();
  }

  function toggleInspectorDot(cellKey, dotNum) {
    if (!activeInspectorCell) return;
    const { r, c } = activeInspectorCell;
    const key = `${r}-${c}`;
    if (!cellDotsMap[key]) cellDotsMap[key] = [];

    const currentDots = cellDotsMap[key];
    const idx = currentDots.indexOf(dotNum);
    if (idx >= 0) {
      currentDots.splice(idx, 1);
      AudioEngine.speak(`Ponto ${dotNum} desativado.`);
    } else {
      currentDots.push(dotNum);
      AudioEngine.speak(`Ponto ${dotNum} elevado!`);
    }

    AudioEngine.playClick();
    const formedObj = dotsToChar(currentDots);
    if (formedObj.char && formedObj.char !== '?') {
      grid[r][c] = formedObj.char;
      AudioEngine.speak(`Letra ${formedObj.name} formada na célula!`);
    }

    render();
  }

  function checkSelectedWord() {
    if (selectedCells.length < 2) return;

    const wordFormed = selectedCells.map(c => c.char).join('');
    const wordReversed = wordFormed.split('').reverse().join('');

    targetWords.forEach(target => {
      if (!foundWords.has(target) && (wordFormed === target || wordReversed === target)) {
        foundWords.add(target);
        AudioEngine.playSuccess();
        AudioEngine.speak(`Sensacional! Você encontrou a palavra ${target}!`);
        selectedCells = [];
      }
    });

    if (foundWords.size === targetWords.length) {
      AudioEngine.playWin();
      TeacherMode.recordGameResult('Caça-Palavras Braille', true, `${foundWords.size} palavras encontradas`);
      if (window.Championship) {
        window.Championship.recordMatchResult('Caça-Palavras Braille', true, foundWords.size, targetWords.length);
      }
      setTimeout(() => {
        AudioEngine.speak('Parabéns! Você encontrou todas as palavras no Caça-Palavras Braille!');
      }, 500);
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    let gridHTML = `<div class="wordsearch-grid grid-size-${gridSize}" role="grid" aria-label="Grade do Caça-Palavras com células Braille">`;
    for (let r = 0; r < gridSize; r++) {
      gridHTML += `<div class="grid-row" role="row">`;
      for (let c = 0; c < gridSize; c++) {
        const key = `${r}-${c}`;
        const dots = cellDotsMap[key] || [];
        const formedObj = dotsToChar(dots);
        const char = formedObj.char || grid[r][c];
        const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
        const isInspected = activeInspectorCell && activeInspectorCell.r === r && activeInspectorCell.c === c;

        gridHTML += `
          <button type="button" class="grid-cell-btn ${isSelected ? 'selected' : ''} ${isInspected ? 'inspected' : ''}" 
            role="gridcell"
            onclick="WordSearchGame.clickCell(${r}, ${c})"
            onfocus="AudioEngine.speak('Linha ${r+1}, Coluna ${c+1}: Letra Braille ${formedObj.name}')"
            aria-label="Linha ${r+1}, Coluna ${c+1}: Letra ${formedObj.name}">
            <span class="cell-ink">${char}</span>
            <span class="cell-braille">${formedObj.unicode}</span>
          </button>
        `;
      }
      gridHTML += `</div>`;
    }
    gridHTML += `</div>`;

    // Inspetor / Construtor Ponto a Ponto da Célula
    let inspectorHTML = '';
    if (activeInspectorCell) {
      const { r, c } = activeInspectorCell;
      const key = `${r}-${c}`;
      const currentDots = cellDotsMap[key] || [];
      const formedObj = dotsToChar(currentDots);

      inspectorHTML = `
        <div class="point-builder-panel wordsearch-inspector" role="region" aria-label="Inspetor Ponto a Ponto">
          <h3>🔍 Inspetor & Construtor Ponto a Ponto (Linha ${r+1}, Coluna ${c+1})</h3>
          <p class="builder-hint">Altere os pontos 1 a 6 para formar ou verificar a letra Braille desta célula:</p>
          
          <div class="builder-interactive-wrapper">
            ${renderInteractiveEmptyCellHTML(`wordsearch-inspector-cell`, currentDots, 'WordSearchGame.toggleInspectorDot', { size: 'medium' })}
            <div class="builder-feedback-side">
              <div class="result-box">
                <span class="result-label">Letra Formada:</span>
                <span class="result-char">${formedObj.char || '?'}</span>
                <span class="result-desc">${formedObj.name}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Lista de palavras a encontrar
    let wordListHTML = '<div class="target-words-list" role="region" aria-label="Lista de palavras a encontrar">';
    targetWords.forEach(w => {
      const isFound = foundWords.has(w);
      const brailleStr = textToBrailleSequence(w).map(i => i.unicode).join('');
      wordListHTML += `
        <div class="target-word-item ${isFound ? 'found' : ''}" tabindex="0" aria-label="Palavra ${w}, braille ${brailleStr}">
          <span class="word-ink">${w}</span>
          <span class="word-braille">${brailleStr}</span>
          ${isFound ? ' <span class="check-mark">✓</span>' : ''}
        </div>
      `;
    });
    wordListHTML += '</div>';

    container.innerHTML = `
      <div class="game-wrapper wordsearch-wrapper">
        <div class="game-header-bar">
          <h2>Caça-Palavras Braille — Inspeção Ponto a Ponto</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge score-badge">Encontradas: ${foundWords.size} / ${targetWords.length}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p>Clique nas células para selecionar palavras. Ao clicar em qualquer célula, o <strong>Inspetor Ponto a Ponto (Pontos 1-6)</strong> abrirá abaixo para você examinar e alterar os pontos!</p>
        </div>

        <div class="wordsearch-layout">
          ${gridHTML}
          <div class="words-panel">
            <h3>Palavras a Encontrar:</h3>
            ${wordListHTML}
          </div>
        </div>

        ${inspectorHTML}

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="WordSearchGame.init('${currentLevel}')">🔄 Nova Grade</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Palavras que faltam encontrar: ' + targetWords.filter(w => !foundWords.has(w)).join(', '))">🔊 Ouvir Palavras Restantes</button>
        </div>
      </div>
    `;
  }

  let navR = 0;
  let navC = 0;

  function handleKeyInput(e) {
    if (!e || !e.key) return;

    if (e.key.toLowerCase() === 'r') {
      init(currentLevel);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navC = (navC + 1) % gridSize;
      clickCell(navR, navC);
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navC = (navC - 1 + gridSize) % gridSize;
      clickCell(navR, navC);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navR = (navR + 1) % gridSize;
      clickCell(navR, navC);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navR = (navR - 1 + gridSize) % gridSize;
      clickCell(navR, navC);
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      clickCell(navR, navC);
      return;
    }

    if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      toggleInspectorDot(null, parseInt(e.key, 10));
      return;
    }
  }

  return { init, clickCell, toggleInspectorDot, render, handleKeyInput };
})();

window.WordSearchGame = WordSearchGame;

