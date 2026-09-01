/**
 * Jogo 9 — Ligue os Pontos (Letra em Tinta ↔ Padrão Braille)
 */
const MatchDotsGame = (() => {
  let leftItems = [];
  let rightItems = [];
  let selectedLeft = null;
  let matches = new Set();
  let currentLevel = 'iniciante';

  function init(level = 'iniciante') {
    currentLevel = level;
    selectedLeft = null;
    matches.clear();

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const count = level === 'iniciante' ? 4 : (level === 'intermediario' ? 5 : 6);
    const chosen = [...alphabet].sort(() => 0.5 - Math.random()).slice(0, count);

    leftItems = chosen.map(letter => ({ letter, id: `ink-${letter}` }));
    rightItems = [...chosen].sort(() => 0.5 - Math.random()).map(letter => ({ letter, id: `braille-${letter}` }));

    render();
    AudioEngine.speak(`Jogo Ligue os Pontos iniciado. Ligue cada letra da coluna da esquerda ao seu padrão Braille na coluna da direita.`);
  }

  function selectLeft(letter) {
    if (matches.has(letter)) return;

    selectedLeft = letter;
    const info = getCharInfo(letter);
    AudioEngine.playClick();
    AudioEngine.speak(`Letra em tinta ${info.name} selecionada. Agora escolha o padrão Braille correspondente na coluna da direita.`);
    render();
  }

  function selectRight(letter) {
    if (!selectedLeft) {
      AudioEngine.speak('Por favor, selecione primeiro uma letra em tinta na coluna da esquerda.');
      return;
    }

    const infoLeft = getCharInfo(selectedLeft);
    const infoRight = getCharInfo(letter);

    if (selectedLeft === letter) {
      // Correspondência correta!
      matches.add(letter);
      AudioEngine.playSuccess();
      AudioEngine.speak(`Excelente! Você ligou perfeitamente a letra ${infoLeft.name} ao seu padrão Braille!`);
      selectedLeft = null;
      render();

      if (matches.size === leftItems.length) {
        AudioEngine.playWin();
        TeacherMode.recordGameResult('Ligue os Pontos', true, `${matches.size} ligações corretas`);
        if (window.Championship) {
          window.Championship.recordMatchResult('Ligue os Pontos', true, matches.size, leftItems.length);
        }
        setTimeout(() => {
          AudioEngine.speak('Parabéns! Você ligou corretamente todas as letras aos seus padrões Braille!');
        }, 500);
      }
    } else {
      AudioEngine.playError();
      AudioEngine.speak(`Que pena! A letra ${infoLeft.name} não corresponde ao padrão Braille da letra ${infoRight.name}. Tente novamente.`);
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    // Coluna Esquerda (Tinta)
    let leftColHTML = '<div class="match-column left-column" role="group" aria-label="Coluna de letras em tinta">';
    leftColHTML += '<h3>Letras em Tinta:</h3>';
    leftItems.forEach(item => {
      const isMatched = matches.has(item.letter);
      const isSelected = selectedLeft === item.letter;
      const info = getCharInfo(item.letter);

      leftColHTML += `
        <button type="button" class="match-item-btn ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}" 
          onclick="MatchDotsGame.selectLeft('${item.letter}')"
          ${isMatched ? 'disabled' : ''}
          aria-label="Letra em tinta ${info.name}${isMatched ? ' já ligada' : ''}">
          <span class="match-ink-char">${item.letter}</span>
          ${isMatched ? '<span class="match-badge">✓</span>' : ''}
        </button>
      `;
    });
    leftColHTML += '</div>';

    // Coluna Direita (Braille)
    let rightColHTML = '<div class="match-column right-column" role="group" aria-label="Coluna de padrões Braille">';
    rightColHTML += '<h3>Padrões Braille:</h3>';
    rightItems.forEach(item => {
      const isMatched = matches.has(item.letter);
      const info = getCharInfo(item.letter);

      rightColHTML += `
        <button type="button" class="match-item-btn braille-item ${isMatched ? 'matched' : ''}" 
          onclick="MatchDotsGame.selectRight('${item.letter}')"
          ${isMatched ? 'disabled' : ''}
          onfocus="AudioEngine.speak('Padrão Braille: ${info.desc}')"
          aria-label="Padrão Braille ${info.desc}${isMatched ? ' já ligado' : ''}">
          <span class="match-braille-char">${info.unicode}</span>
          <span class="match-dots-desc">${info.desc}</span>
          ${isMatched ? '<span class="match-badge">✓</span>' : ''}
        </button>
      `;
    });
    rightColHTML += '</div>';

    container.innerHTML = `
      <div class="game-wrapper match-wrapper">
        <div class="game-header-bar">
          <h2>Ligue os Pontos (Tinta ↔ Braille)</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge score-badge">Ligações: ${matches.size} / ${leftItems.length}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p>Clique em uma letra na esquerda e em seguida no padrão Braille equivalente na direita.</p>
        </div>

        <div class="match-columns-container">
          ${leftColHTML}
          <div class="match-connector-divider">↔</div>
          ${rightColHTML}
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="MatchDotsGame.init('${currentLevel}')">🔄 Novo Desafio</button>
        </div>
      </div>
    `;
  }

  function handleKeyInput(e) {
    if (!e || !e.key) return;

    if (e.key.toLowerCase() === 'r') {
      init(currentLevel);
      return;
    }

    const key = e.key.toUpperCase();
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      e.preventDefault();
      if (!selectedLeft) {
        // Se a letra existe na coluna esquerda e ainda não foi ligada
        const item = leftItems.find(it => it.letter === key);
        if (item && !matches.has(key)) {
          selectLeft(key);
        }
      } else {
        selectRight(key);
      }
    }
  }

  return { init, selectLeft, selectRight, render, handleKeyInput };
})();

window.MatchDotsGame = MatchDotsGame;

