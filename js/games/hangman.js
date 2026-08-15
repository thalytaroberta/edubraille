/**
 * Jogo 1 — Jogo da Forca Braille
 */
const HangmanGame = (() => {
  let secretWord = '';
  let wordHint = '';
  let guessedLetters = new Set();
  let errors = 0;
  const maxErrors = 6;
  let currentLevel = 'iniciante';

  function init(level = 'iniciante') {
    currentLevel = level;
    guessedLetters.clear();
    errors = 0;

    const db = GAME_DATABASES.words[level] || GAME_DATABASES.words.iniciante;
    const item = db[Math.floor(Math.random() * db.length)];
    secretWord = item.word;
    wordHint = item.hint;

    render();
    AudioEngine.speak(`Jogo da Forca iniciado. Dica da palavra: ${wordHint}. Ela tem ${secretWord.length} letras. Escolha uma letra no teclado.`);
  }

  function guessLetter(char) {
    const letter = char.toUpperCase();
    if (!letter || guessedLetters.has(letter) || isGameOver()) return;

    guessedLetters.add(letter);

    if (secretWord.includes(letter)) {
      AudioEngine.playSuccess();
      AudioEngine.speakLetter(letter);
      AudioEngine.speak(`Parabéns! A letra ${letter} está na palavra!`);
    } else {
      errors++;
      AudioEngine.playError();
      AudioEngine.speakLetter(letter);
      AudioEngine.speak(`Que pena! A letra ${letter} não está na palavra. Erros: ${errors} de ${maxErrors}.`);
    }

    render();

    if (checkWin()) {
      AudioEngine.playWin();
      TeacherMode.recordGameResult('Jogo da Forca', true, `Palavra: ${secretWord}`);
      setTimeout(() => {
        AudioEngine.speak(`Vitória espetacular! Você adivinhou a palavra ${secretWord}! Vou soletrar para você.`);
        spellWord(secretWord);
      }, 800);
    } else if (errors >= maxErrors) {
      AudioEngine.playError();
      TeacherMode.recordGameResult('Jogo da Forca', false, `Palavra era: ${secretWord}`);
      setTimeout(() => {
        AudioEngine.speak(`Fim de jogo! Você atingiu 6 erros. A palavra correta era ${secretWord}.`);
        spellWord(secretWord);
      }, 800);
    }
  }

  function checkWin() {
    return secretWord.split('').every(ch => guessedLetters.has(ch));
  }

  function isGameOver() {
    return errors >= maxErrors || checkWin();
  }

  function spellWord(word) {
    let delay = 0;
    word.split('').forEach((ch, idx) => {
      setTimeout(() => {
        AudioEngine.speakLetter(ch);
      }, delay);
      delay += 1200;
    });
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    let wordSlotsHTML = '<div class="hangman-word-slots" role="region" aria-label="Espaços da palavra secreta">';
    secretWord.split('').forEach(ch => {
      const isRevealed = guessedLetters.has(ch) || isGameOver();
      if (isRevealed) {
        wordSlotsHTML += renderDualCellHTML(ch, { size: 'medium' });
      } else {
        wordSlotsHTML += `
          <div class="dual-cell-card medium placeholder-slot" tabindex="0" aria-label="Espaço oculto">
            <span class="ink-char-display">_</span>
            <span class="braille-unicode-display">⠀</span>
            <div class="dual-cell-body"><span class="dots-text-label">?</span></div>
          </div>
        `;
      }
    });
    wordSlotsHTML += '</div>';

    // Teclado virtual acessível (A-Z)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let keyboardHTML = '<div class="virtual-keyboard" role="group" aria-label="Teclado de letras">';
    alphabet.forEach(ch => {
      const isUsed = guessedLetters.has(ch);
      const isCorrect = isUsed && secretWord.includes(ch);
      const isWrong = isUsed && !secretWord.includes(ch);
      const statusClass = isCorrect ? 'correct' : (isWrong ? 'wrong' : '');

      keyboardHTML += `
        <button type="button" class="key-btn ${statusClass}" 
          ${isUsed || isGameOver() ? 'disabled' : ''} 
          onclick="HangmanGame.guessLetter('${ch}')"
          aria-label="Letra ${ch}${isUsed ? (isCorrect ? ' já usada, correta' : ' já usada, incorreta') : ''}">
          <span class="key-ink">${ch}</span>
          <span class="key-braille">${getCharInfo(ch).unicode}</span>
        </button>
      `;
    });
    keyboardHTML += '</div>';

    const isTeacher = TeacherMode.isActive();

    container.innerHTML = `
      <div class="game-wrapper hangman-wrapper">
        <div class="game-header-bar">
          <h2>Jogo da Forca Braille</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge errors-badge ${errors > 4 ? 'danger' : ''}">Erros: ${errors} / ${maxErrors}</span>
          </div>
        </div>

        <div class="hint-card-box">
          <span class="hint-icon">💡</span>
          <p class="hint-text"><strong>Dica:</strong> ${wordHint}</p>
          <button type="button" class="btn-sound-mini" onclick="AudioEngine.speak('Dica da palavra: ${wordHint}')">🔊 Ouvir Dica</button>
        </div>

        ${isTeacher ? `
          <div class="teacher-solution-box">
            <span>🎓 <strong>Modo Professor:</strong> Palavra Secreta = <strong>${secretWord}</strong></span>
          </div>
        ` : ''}

        ${wordSlotsHTML}

        ${keyboardHTML}

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="HangmanGame.init('${currentLevel}')">🔄 Jogar Novamente</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Jogo da Forca. Palavra de ${secretWord.length} letras. Erros cometidos: ${errors} de ${maxErrors}. Dica: ${wordHint}')">🔊 Ouvir Situação</button>
        </div>
      </div>
    `;
  }

  return { init, guessLetter, render };
})();
