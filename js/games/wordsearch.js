/**
 * Jogo 2 — Caça-Palavras Braille
 */
const WordSearchGame = (() => {
  let gridSize = 6;
  let grid = [];
  let targetWords = [];
  let foundWords = new Set();
  let selectedCells = [];
  let currentLevel = 'iniciante';

  function init(level = 'iniciante') {
    currentLevel = level;
    foundWords.clear();
    selectedCells = [];

    gridSize = level === 'iniciante' ? 6 : (level === 'intermediario' ? 8 : 10);
    const db = GAME_DATABASES.words[level] || GAME_DATABASES.words.iniciante;
    
    // Escolhe de 3 a 5 palavras do banco
    const shuffled = [...db].sort(() => 0.5 - Math.random());
    const numWords = level === 'iniciante' ? 3 : (level === 'intermediario' ? 4 : 5);
    targetWords = shuffled.slice(0, numWords).map(item => item.word);

    generateGrid();
    render();
    AudioEngine.speak(`Caça-Palavras iniciado com grade ${gridSize} por ${gridSize}. Encontre as ${targetWords.length} palavras na grade.`);
  }

  function generateGrid() {
    // Cria grade vazia
    grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Tenta posicionar cada palavra (horizontal ou vertical)
    targetWords.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        attempts++;
        const isHorizontal = Math.random() > 0.5;
        const row = isHorizontal ? Math.floor(Math.random() * gridSize) : Math.floor(Math.random() * (gridSize - word.length + 1));
        const col = isHorizontal ? Math.floor(Math.random() * (gridSize - word.length + 1)) : Math.floor(Math.random() * gridSize);

        // Verifica se cabe
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

    // Preenche espaços vazios com letras aleatórias
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
  }

  function clickCell(r, c) {
    const cellPos = `${r}-${c}`;
    const char = grid[r][c];

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
      TeacherMode.recordGameResult('Caça-Palavras', true, `${foundWords.size} palavras encontradas`);
      setTimeout(() => {
        AudioEngine.speak('Parabéns! Você encontrou todas as palavras do Caça-Palavras!');
      }, 500);
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    let gridHTML = `<div class="wordsearch-grid grid-size-${gridSize}" role="grid" aria-label="Grade de letras ${gridSize} por ${gridSize}">`;
    for (let r = 0; r < gridSize; r++) {
      gridHTML += `<div class="grid-row" role="row">`;
      for (let c = 0; c < gridSize; c++) {
        const char = grid[r][c];
        const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
        const info = getCharInfo(char);

        gridHTML += `
          <button type="button" class="grid-cell-btn ${isSelected ? 'selected' : ''}" 
            role="gridcell"
            onclick="WordSearchGame.clickCell(${r}, ${c})"
            onfocus="AudioEngine.speakLetter('${char}')"
            aria-label="Linha ${r+1}, Coluna ${c+1}: Letra ${info.name}, braille ${info.desc}">
            <span class="cell-ink">${char}</span>
            <span class="cell-braille">${info.unicode}</span>
          </button>
        `;
      }
      gridHTML += `</div>`;
    }
    gridHTML += `</div>`;

    // Lista de palavras a encontrar
    let wordListHTML = '<div class="target-words-list" role="region" aria-label="Lista de palavras a encontrar">';
    targetWords.forEach(w => {
      const isFound = foundWords.has(w);
      const brailleStr = textToBrailleSequence(w).map(i => i.unicode).join('');
      wordListHTML += `
        <div class="target-word-item ${isFound ? 'found' : ''}" tabindex="0" aria-label="Palavra ${w}, braille ${brailleStr}, ${isFound ? 'já encontrada' : 'pendente'}">
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
          <h2>Caça-Palavras Braille</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge score-badge">Encontradas: ${foundWords.size} / ${targetWords.length}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p>Clique ou navegue pelas letras com o teclado para selecionar as palavras encontradas.</p>
        </div>

        <div class="wordsearch-layout">
          ${gridHTML}
          <div class="words-panel">
            <h3>Palavras a Encontrar:</h3>
            ${wordListHTML}
          </div>
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="WordSearchGame.init('${currentLevel}')">🔄 Nova Grade</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Palavras que faltam encontrar: ' + targetWords.filter(w => !foundWords.has(w)).join(', '))">🔊 Ouvir Palavras Restantes</button>
        </div>
      </div>
    `;
  }

  return { init, clickCell, render };
})();
