/**
 * Jogo 4 — Cruzadas Silábicas Braille
 */
const SyllableCrosswordGame = (() => {
  let currentLevel = 'iniciante';
  let activeWordIndex = 0;
  let userSyllables = [];
  let currentItem = null;

  function init(level = 'iniciante') {
    currentLevel = level;
    userSyllables = [];

    const db = GAME_DATABASES.syllables[level] || GAME_DATABASES.syllables.iniciante;
    currentItem = db[Math.floor(Math.random() * db.length)];

    render();
    AudioEngine.speak(`Cruzada Silábica iniciada. Forme a palavra com dica: ${currentItem.hint}. Selecione as sílabas na ordem correta.`);
  }

  function selectSyllable(syl) {
    if (userSyllables.length >= currentItem.syllables.length) return;

    userSyllables.push(syl);
    
    // Pronuncia a sílaba e suas letras em Braille
    const charNames = syl.split('').map(c => getCharInfo(c).name).join(' e ');
    AudioEngine.speak(`Síla ba ${syl}. Composta pelas letras ${charNames}`);
    AudioEngine.playClick();

    render();
    checkWin();
  }

  function removeSyllable(index) {
    if (index >= 0 && index < userSyllables.length) {
      const removed = userSyllables.splice(index, 1)[0];
      AudioEngine.speak(`Síla ba ${removed} removida.`);
      AudioEngine.playClick();
      render();
    }
  }

  function checkWin() {
    if (userSyllables.length === currentItem.syllables.length) {
      const isCorrect = userSyllables.every((syl, i) => syl === currentItem.syllables[i]);
      if (isCorrect) {
        AudioEngine.playWin();
        TeacherMode.recordGameResult('Cruzadas Silábicas', true, `Palavra: ${currentItem.word}`);
        setTimeout(() => {
          AudioEngine.speak(`Excelente! Você montou a palavra ${currentItem.word} separando corretamente em ${currentItem.syllables.length} sílabas!`);
        }, 500);
      } else {
        AudioEngine.playError();
        AudioEngine.speak('A ordem das sílabas não está correta. Tente ajustar clicando na sílaba para remover.');
      }
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    // Gera banco de sílabas embaralhadas (incluindo distratores)
    const extraSyllables = ['MA', 'PA', 'TI', 'CO', 'LU', 'RA', 'TO', 'NE'];
    const pool = [...currentItem.syllables];
    while (pool.length < currentItem.syllables.length + 3) {
      const randSyl = extraSyllables[Math.floor(Math.random() * extraSyllables.length)];
      if (!pool.includes(randSyl)) pool.push(randSyl);
    }
    // Embaralha pool apenas se ainda não renderizado ou mantém fixo
    if (!currentItem.shuffledPool) {
      currentItem.shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    }

    // Slots da Palavra
    let slotsHTML = '<div class="syllable-slots-row" role="region" aria-label="Espaços para montar a palavra por sílabas">';
    for (let i = 0; i < currentItem.syllables.length; i++) {
      const sylVal = userSyllables[i];
      if (sylVal) {
        const brailleChars = textToBrailleSequence(sylVal).map(b => b.unicode).join('');
        slotsHTML += `
          <button type="button" class="syllable-card filled" onclick="SyllableCrosswordGame.removeSyllable(${i})" aria-label="Síla ba ${i+1}: ${sylVal}, braille ${brailleChars}. Clique para remover.">
            <span class="syllable-ink">${sylVal}</span>
            <span class="syllable-braille">${brailleChars}</span>
            <small class="syllable-subtext">Clique para remover</small>
          </button>
        `;
      } else {
        slotsHTML += `
          <div class="syllable-card empty" tabindex="0" aria-label="Espaço de sílaba ${i+1} vazio">
            <span class="syllable-ink">_ _</span>
            <span class="syllable-braille">⠀⠀</span>
          </div>
        `;
      }
    }
    slotsHTML += '</div>';

    // Banco de Opções
    let bankHTML = '<div class="syllable-bank" role="group" aria-label="Banco de sílabas disponíveis">';
    currentItem.shuffledPool.forEach(syl => {
      const brailleChars = textToBrailleSequence(syl).map(b => b.unicode).join('');
      bankHTML += `
        <button type="button" class="syllable-option-btn" 
          onclick="SyllableCrosswordGame.selectSyllable('${syl}')"
          onfocus="AudioEngine.speak('Síla ba ${syl}, braille ${brailleChars}')"
          aria-label="Escolher síla ba ${syl}, braille ${brailleChars}">
          <span class="syllable-ink">${syl}</span>
          <span class="syllable-braille">${brailleChars}</span>
        </button>
      `;
    });
    bankHTML += '</div>';

    container.innerHTML = `
      <div class="game-wrapper syllable-wrapper">
        <div class="game-header-bar">
          <h2>Cruzadas Silábicas Braille</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
          </div>
        </div>

        <div class="hint-card-box">
          <span class="hint-icon">🧩</span>
          <p class="hint-text"><strong>Dica:</strong> ${currentItem.hint} (${currentItem.syllables.length} sílabas)</p>
          <button type="button" class="btn-sound-mini" onclick="AudioEngine.speak('Dica: ${currentItem.hint}. Palavra dividida em ${currentItem.syllables.length} sílabas.')">🔊 Ouvir Dica</button>
        </div>

        <div class="syllable-game-board">
          <h3>Sua Palavra:</h3>
          ${slotsHTML}
          <h3>Escolha as Sílabas:</h3>
          ${bankHTML}
        </div>

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="SyllableCrosswordGame.init('${currentLevel}')">🔄 Próxima Palavra</button>
          <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Palavra correta tem ${currentItem.syllables.length} sílabas. Você já colocou: ${userSyllables.join(' e ') || 'nenhuma ainda'}.')">🔊 Ouvir Situação</button>
        </div>
      </div>
    `;
  }

  return { init, selectSyllable, removeSyllable, render };
})();
