/**
 * Jogo 10 — Monte a Sílaba Braille
 */
const AssembleSyllablesGame = (() => {
  let currentLevel = 'iniciante';
  let currentItem = null;
  let selectedSyllables = [];
  let availableSyllables = [];

  function init(level = 'iniciante') {
    currentLevel = level;
    selectedSyllables = [];

    const db = GAME_DATABASES.syllables[level] || GAME_DATABASES.syllables.iniciante;
    currentItem = db[Math.floor(Math.random() * db.length)];

    // Embaralha as sílabas da palavra
    availableSyllables = [...currentItem.syllables].sort(() => 0.5 - Math.random());

    render();
    AudioEngine.speak(`Jogo Monte a Sílaba. Ouça a palavra e organize as sílabas em Braille na ordem certa. Palavra: ${currentItem.word}`);
  }

  function pickSyllable(syl, index) {
    selectedSyllables.push(syl);
    availableSyllables.splice(index, 1);

    const brailleStr = textToBrailleSequence(syl).map(b => b.unicode).join('');
    AudioEngine.speak(`Síla ba ${syl}, braille ${brailleStr} colocada.`);
    AudioEngine.playClick();

    render();
    checkWin();
  }

  function unpickSyllable(syl, index) {
    availableSyllables.push(syl);
    selectedSyllables.splice(index, 1);

    AudioEngine.speak(`Síla ba ${syl} removida.`);
    AudioEngine.playClick();

    render();
  }

  function checkWin() {
    if (availableSyllables.length === 0) {
      const isCorrect = selectedSyllables.join('') === currentItem.word;
      if (isCorrect) {
        AudioEngine.playWin();
        TeacherMode.recordGameResult('Monte a Sílaba', true, `Palavra: ${currentItem.word}`);
        setTimeout(() => {
          AudioEngine.speak(`Parabéns espetacular! Você organizou as sílabas e montou com sucesso a palavra ${currentItem.word}!`);
        }, 500);
      } else {
        AudioEngine.playError();
        AudioEngine.speak(`A ordem montada (${selectedSyllables.join('-')}) não forma a palavra ${currentItem.word}. Clique nas sílabas para tentar de novo.`);
      }
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    // Área da Palavra Montada
    let targetAreaHTML = '<div class="assembled-slots-row" role="region" aria-label="Sílabas selecionadas para montar a palavra">';
    if (selectedSyllables.length === 0) {
      targetAreaHTML += '<p class="placeholder-text">Clique nas sílabas abaixo para montar a palavra aqui...</p>';
    } else {
      selectedSyllables.forEach((syl, idx) => {
        const brailleChars = textToBrailleSequence(syl).map(b => b.unicode).join('');
        targetAreaHTML += `
          <button type="button" class="assembled-syl-btn" onclick="AssembleSyllablesGame.unpickSyllable('${syl}', ${idx})" aria-label="Síla ba ${syl}, braille ${brailleChars}. Clique para remover.">
            <span class="ink">${syl}</span>
            <span class="braille">${brailleChars}</span>
          </button>
        `;
      });
    }
    targetAreaHTML += '</div>';

    // Banco de Sílabas Disponíveis
    let poolHTML = '<div class="syllable-pool-row" role="group" aria-label="Sílabas disponíveis em Braille">';
    availableSyllables.forEach((syl, idx) => {
      const brailleChars = textToBrailleSequence(syl).map(b => b.unicode).join('');
      poolHTML += `
        <button type="button" class="pool-syl-btn" 
          onclick="AssembleSyllablesGame.pickSyllable('${syl}', ${idx})"
          onfocus="AudioEngine.speak('Síla ba ${syl}, braille ${brailleChars}')"
          aria-label="Escolher síla ba ${syl}, braille ${brailleChars}">
          <span class="ink">${syl}</span>
          <span class="braille">${brailleChars}</span>
        </button>
      `;
    });
    poolHTML += '</div>';

    container.innerHTML = `
      <div class="game-wrapper assemble-wrapper">
        <div class="game-header-bar">
          <h2>Monte a Sílaba Braille</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
          </div>
        </div>

        <div class="audio-prompt-box">
          <button type="button" class="btn btn-audio-large" onclick="AudioEngine.speak('Palavra a montar: ${currentItem.word}. Dica: ${currentItem.hint}')">
            🔊 Ouvir Palavra: <strong>"${currentItem.word}"</strong>
          </button>
          <p class="hint-text"><strong>Dica:</strong> ${currentItem.hint}</p>
        </div>

        <div class="assemble-board">
          <h3>Sua Montagem:</h3>
          ${targetAreaHTML}

          <h3>Sílabas Disponíveis:</h3>
          ${poolHTML}
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="AssembleSyllablesGame.init('${currentLevel}')">🔄 Próxima Palavra</button>
        </div>
      </div>
    `;
  }

  return { init, pickSyllable, unpickSyllable, render };
})();
