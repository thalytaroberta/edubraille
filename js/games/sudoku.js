/**
 * Jogo 6 — Sudoku Braille (4x4 ou 6x6)
 */
const SudokuGame = (() => {
  let size = 4;
  let grid = [];
  let initialGrid = [];
  let solution = [];
  let selectedCell = null;
  let currentLevel = 'iniciante';

  // Puzzles pré-gerados válidos 4x4
  const PUZZLES_4X4 = [
    {
      initial: [
        [1, 0, 0, 4],
        [0, 4, 1, 0],
        [0, 3, 2, 0],
        [2, 0, 0, 1]
      ],
      solution: [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [4, 3, 2, 1],
        [2, 1, 4, 3]
      ]
    },
    {
      initial: [
        [0, 2, 4, 0],
        [1, 0, 0, 3],
        [4, 0, 0, 2],
        [0, 1, 3, 0]
      ],
      solution: [
        [3, 2, 4, 1],
        [1, 4, 2, 3],
        [4, 3, 1, 2],
        [2, 1, 3, 4]
      ]
    }
  ];

  function init(level = 'iniciante') {
    currentLevel = level;
    selectedCell = null;
    size = 4; // 4x4 Sudoku pedagógico para alfabetização

    const puzzle = PUZZLES_4X4[Math.floor(Math.random() * PUZZLES_4X4.length)];
    initialGrid = puzzle.initial.map(row => [...row]);
    grid = puzzle.initial.map(row => [...row]);
    solution = puzzle.solution;

    render();
    AudioEngine.speak(`Sudoku Braille 4 por 4 iniciado. Escolha um quadrado vazio e selecione um número de 1 a 4.`);
  }

  function selectCell(r, c) {
    if (initialGrid[r][c] !== 0) {
      AudioEngine.speak(`Linha ${r+1}, Coluna ${c+1}: Número ${grid[r][c]} fixo do início.`);
      selectedCell = null;
    } else {
      selectedCell = { r, c };
      const currentVal = grid[r][c];
      AudioEngine.speak(`Linha ${r+1}, Coluna ${c+1} selecionada. ${currentVal ? 'Contém número ' + currentVal : 'Vazia'}. Escolha um número de 1 a 4.`);
    }
    render();
  }

  function setNumber(num) {
    if (!selectedCell) {
      AudioEngine.speak('Por favor, selecione primeiro uma casa vazia na grade do Sudoku.');
      return;
    }

    const { r, c } = selectedCell;
    
    // Verifica conflito de linha, coluna ou bloco 2x2
    if (hasConflict(r, c, num)) {
      AudioEngine.playError();
      AudioEngine.speak(`Atenção! O número ${num} se repete na mesma linha, coluna ou bloco. Tente outro número.`);
      return;
    }

    grid[r][c] = num;
    AudioEngine.playClick();
    AudioEngine.speakLetter(num.toString());
    render();

    checkWin();
  }

  function hasConflict(row, col, num) {
    for (let i = 0; i < size; i++) {
      if (i !== col && grid[row][i] === num) return true;
      if (i !== row && grid[i][col] === num) return true;
    }
    // Bloco 2x2
    const startRow = Math.floor(row / 2) * 2;
    const startCol = Math.floor(col / 2) * 2;
    for (let r = startRow; r < startRow + 2; r++) {
      for (let c = startCol; c < startCol + 2; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return true;
      }
    }
    return false;
  }

  function checkWin() {
    let complete = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0 || grid[r][c] !== solution[r][c]) {
          complete = false;
        }
      }
    }

    if (complete) {
      AudioEngine.playWin();
      TeacherMode.recordGameResult('Sudoku Braille', true, 'Grade 4x4');
      if (window.Championship) {
        window.Championship.recordMatchResult('Sudoku Braille', true, size * size, size * size);
      }
      setTimeout(() => {
        AudioEngine.speak('Parabéns extraordinário! Você completou toda a grade de Sudoku sem repetições!');
      }, 500);
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    let gridHTML = `<div class="sudoku-grid size-4" role="grid" aria-label="Grade de Sudoku 4 por 4">`;
    for (let r = 0; r < size; r++) {
      gridHTML += `<div class="sudoku-row" role="row">`;
      for (let c = 0; c < size; c++) {
        const val = grid[r][c];
        const isFixed = initialGrid[r][c] !== 0;
        const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
        const info = val ? getCharInfo(val.toString()) : null;

        gridHTML += `
          <button type="button" class="sudoku-cell ${isFixed ? 'fixed' : ''} ${isSelected ? 'selected' : ''}" 
            role="gridcell"
            onclick="SudokuGame.selectCell(${r}, ${c})"
            aria-label="Linha ${r+1}, Coluna ${c+1}: ${val ? 'Número ' + val : 'Vazio'}${isFixed ? ' fixo' : ''}">
            <span class="sudoku-ink">${val ? val : ''}</span>
            <span class="sudoku-braille">${val ? '⠼' + info.unicode : '⠀'}</span>
          </button>
        `;
      }
      gridHTML += `</div>`;
    }
    gridHTML += `</div>`;

    // Selector Numérico 1-4
    let numSelectorHTML = '<div class="sudoku-numpad" role="group" aria-label="Escolher número para preencher">';
    for (let n = 1; n <= 4; n++) {
      const info = getCharInfo(n.toString());
      numSelectorHTML += `
        <button type="button" class="sudoku-num-btn" 
          onclick="SudokuGame.setNumber(${n})"
          aria-label="Colocar número ${n}">
          <span class="ink">${n}</span>
          <span class="braille">⠼${info.unicode}</span>
        </button>
      `;
    }
    numSelectorHTML += '</div>';

    container.innerHTML = `
      <div class="game-wrapper sudoku-wrapper">
        <div class="game-header-bar">
          <h2>Sudoku Braille 4x4</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p>Preencha cada quadrado sem repetir números na mesma linha, coluna ou bloco de 4 casas.</p>
        </div>

        <div class="sudoku-board-area">
          ${gridHTML}
          <h3>Selecione o Número (1 a 4):</h3>
          ${numSelectorHTML}
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="SudokuGame.init('${currentLevel}')">🔄 Novo Jogo</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Grade 4 por 4. Selecione uma casa com o clique e escolha o número de 1 a 4.')">🔊 Ouvir Instruções</button>
        </div>
      </div>
    `;
  }

  return { init, selectCell, setNumber, render };
})();

window.SudokuGame = SudokuGame;

