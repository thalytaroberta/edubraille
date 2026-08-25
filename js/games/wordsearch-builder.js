/**
 * Jogo 12 — Caça-Palavras Braille Ponto a Ponto (Células em Branco)
 */
const WordSearchBuilderGame = (() => {
  let gridSize = 5;
  let gridLetters = [];
  let gridDotsMap = {}; // "r-c": [1, 2]
  let targetWords = [];
  let foundWords = new Set();
  let selectedCells = [];
  let activeCell = null; // { r, c }
  let currentLevel = 'iniciante';

  function init(level = 'iniciante') {
    currentLevel = level;
    foundWords.clear();
    selectedCells = [];
    activeCell = null;
    gridDotsMap = {};

    gridSize = level === 'iniciante' ? 4 : (level === 'intermediario' ? 5 : 6);
    const db = GAME_DATABASES.words[level] || GAME_DATABASES.words.iniciante;
    
    const shuffled = [...db].sort(() => 0.5 - Math.random());
    const numWords = level === 'iniciante' ? 2 : 3;
    targetWords = shuffled.slice(0, numWords).map(item => item.word);

    generateGrid();
    render();
    AudioEngine.speak(`Caça-Palavras com Células em Branco iniciado. Preencha os círculos das células para formar as ${targetWords.length} palavras.`);
  }

  function generateGrid() {
    gridLetters = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

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
          if (gridLetters[r][c] !== '' && gridLetters[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            gridLetters[r][c] = word[i];
          }
          placed = true;
        }
      }
    });

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (gridLetters[r][c] === '') {
          gridLetters[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        // Inicia célula em branco (sem pontos elevados)
        gridDotsMap[`${r}-${c}`] = [];
      }
    }
  }

  function selectGridCell(r, c) {
    activeCell = { r, c };
    const key = `${r}-${c}`;
    const dots = gridDotsMap[key] || [];
    const formedObj = dotsToChar(dots);

    AudioEngine.playClick();
    if (formedObj.char) {
      AudioEngine.speak(`Linha ${r+1}, Coluna ${c+1}. Letra ${formedObj.name}.`);
    } else {
      AudioEngine.speak(`Linha ${r+1}, Coluna ${c+1}. Célula em branco.`);
    }

    const idx = selectedCells.findIndex(cell => cell.r === r && cell.c === c);
    if (idx >= 0) {
      selectedCells.splice(idx, 1);
    } else {
      selectedCells.push({ r, c });
    }

    checkSelectedSequence();
    render();
  }

  function toggleActiveDot(dotNum) {
    if (!activeCell) return;
    const { r, c } = activeCell;
    const key = `${r}-${c}`;

    if (!gridDotsMap[key]) gridDotsMap[key] = [];
    const dots = gridDotsMap[key];

    const idx = dots.indexOf(dotNum);
    if (idx >= 0) {
      dots.splice(idx, 1);
      AudioEngine.speak(`Ponto ${dotNum} desativado.`);
    } else {
      dots.push(dotNum);
      AudioEngine.speak(`Ponto ${dotNum} elevado!`);
    }

    AudioEngine.playClick();
    const formedObj = dotsToChar(dots);
    if (formedObj.char && formedObj.char !== '?') {
      AudioEngine.speak(`Letra ${formedObj.name} formada na célula!`);
    }

    checkSelectedSequence();
    render();
  }

  function checkSelectedSequence() {
    if (selectedCells.length < 2) return;

    const wordFormed = selectedCells.map(c => {
      const dots = gridDotsMap[`${c.r}-${c.c}`] || [];
      return dotsToChar(dots).char;
    }).join('');

    const wordReversed = wordFormed.split('').reverse().join('');

    targetWords.forEach(target => {
      if (!foundWords.has(target) && (wordFormed === target || wordReversed === target)) {
        foundWords.add(target);
        AudioEngine.playSuccess();
        AudioEngine.speak(`Excelente! Você formou e encontrou a palavra ${target}!`);
        selectedCells = [];
      }
    });

    if (foundWords.size === targetWords.length) {
      AudioEngine.playWin();
      TeacherMode.recordGameResult('Caça-Palavras Ponto a Ponto', true, `${foundWords.size} palavras formadas`);
      if (window.Championship) {
        window.Championship.recordMatchResult('Caça-Palavras Ponto a Ponto', true, foundWords.size, targetWords.length);
      }
      setTimeout(() => {
        AudioEngine.speak('Parabéns! Você construiu e encontrou todas as palavras!');
      }, 500);
    }
  }

  function revealCellHint(r, c) {
    const key = `${r}-${c}`;
    const targetLetter = gridLetters[r][c];
    const info = getCharInfo(targetLetter);
    gridDotsMap[key] = [...info.dots];
    AudioEngine.playClick();
    AudioEngine.speak(`Pontos da letra ${targetLetter} preenchidos como dica!`);
    render();
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    let gridHTML = `<div class="blank-wordsearch-grid grid-size-${gridSize}" role="grid" aria-label="Grade de Células Braille em Branco">`;
    for (let r = 0; r < gridSize; r++) {
      gridHTML += `<div class="grid-row" role="row">`;
      for (let c = 0; c < gridSize; c++) {
        const key = `${r}-${c}`;
        const dots = gridDotsMap[key] || [];
        const activeSet = new Set(dots);
        const formedObj = dotsToChar(dots);
        const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
        const isActive = activeCell && activeCell.r === r && activeCell.c === c;

        gridHTML += `
          <button type="button" class="blank-grid-cell ${isSelected ? 'selected' : ''} ${isActive ? 'active-cell' : ''}"
            onclick="WordSearchBuilderGame.selectGridCell(${r}, ${c})"
            aria-label="Linha ${r+1}, Coluna ${c+1}: ${formedObj.char ? 'Letra ' + formedObj.name : 'Célula em branco'}">
            
            <div class="cell-blank-circles">
              <div class="circle-row">
                <span class="mini-circle ${activeSet.has(1) ? 'filled' : ''}"></span>
                <span class="mini-circle ${activeSet.has(4) ? 'filled' : ''}"></span>
              </div>
              <div class="circle-row">
                <span class="mini-circle ${activeSet.has(2) ? 'filled' : ''}"></span>
                <span class="mini-circle ${activeSet.has(5) ? 'filled' : ''}"></span>
              </div>
              <div class="circle-row">
                <span class="mini-circle ${activeSet.has(3) ? 'filled' : ''}"></span>
                <span class="mini-circle ${activeSet.has(6) ? 'filled' : ''}"></span>
              </div>
            </div>

            <div class="cell-formed-overlay">
              <span class="ink-char">${formedObj.char || '?'}</span>
            </div>
          </button>
        `;
      }
      gridHTML += `</div>`;
    }
    gridHTML += `</div>`;

    // Painel de Edição dos Círculos da Célula Selecionada
    let editorHTML = '';
    if (activeCell) {
      const { r, c } = activeCell;
      const key = `${r}-${c}`;
      const dots = gridDotsMap[key] || [];
      const activeSet = new Set(dots);
      const formedObj = dotsToChar(dots);

      editorHTML = `
        <div class="point-builder-panel" role="region" aria-label="Editor de Célula em Branco">
          <h3>⚪ Editor da Célula (Linha ${r+1}, Coluna ${c+1})</h3>
          <p class="builder-hint">Clique nos 6 círculos abaixo para preencher os pontos desta célula:</p>

          <div class="builder-interactive-wrapper">
            <div class="blank-matrix-builder">
              ${[[1,4],[2,5],[3,6]].map(row => `
                <div class="matrix-row">
                  ${row.map(dotNum => `
                    <button type="button" class="blank-dot-circle ${activeSet.has(dotNum) ? 'active' : ''}"
                      onclick="WordSearchBuilderGame.toggleActiveDot(${dotNum})"
                      aria-label="Ponto ${dotNum}">
                      <span class="circle-inner"></span>
                      <span class="circle-num">${dotNum}</span>
                    </button>
                  `).join('')}
                </div>
              `).join('')}
            </div>

            <div class="builder-feedback-side">
              <div class="result-box">
                <span class="result-label">Letra Formada:</span>
                <span class="result-char">${formedObj.char || '?'}</span>
                <span class="result-desc">${formedObj.name}</span>
              </div>
              <button type="button" class="btn btn-secondary" onclick="WordSearchBuilderGame.revealCellHint(${r}, ${c})">
                💡 Dica de Letra
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Lista de palavras a encontrar
    let wordListHTML = '<div class="target-words-list">';
    targetWords.forEach(w => {
      const isFound = foundWords.has(w);
      const brailleStr = textToBrailleSequence(w).map(i => i.unicode).join('');
      wordListHTML += `
        <div class="target-word-item ${isFound ? 'found' : ''}">
          <span class="word-ink">${w}</span>
          <span class="word-braille">${brailleStr}</span>
          ${isFound ? ' <span class="check-mark">✓</span>' : ''}
        </div>
      `;
    });
    wordListHTML += '</div>';

    container.innerHTML = `
      <div class="game-wrapper wordsearch-builder-wrapper">
        <div class="game-header-bar">
          <h2>Caça-Palavras Ponto a Ponto (Células em Branco)</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge score-badge">Formadas: ${foundWords.size} / ${targetWords.length}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p>Todas as células iniciam com <strong>6 círculos em branco</strong>. Clique em uma célula para abrir o editor e preencher os círculos formando as letras das palavras da lista!</p>
        </div>

        <div class="wordsearch-layout">
          ${gridHTML}
          <div class="words-panel">
            <h3>Palavras a Formar:</h3>
            ${wordListHTML}
          </div>
        </div>

        ${editorHTML}

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="WordSearchBuilderGame.init('${currentLevel}')">🔄 Nova Grade</button>
        </div>
      </div>
    `;
  }

  return { init, selectGridCell, toggleActiveDot, revealCellHint, render };
})();

window.WordSearchBuilderGame = WordSearchBuilderGame;

