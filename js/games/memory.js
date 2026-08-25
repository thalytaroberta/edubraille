/**
 * Jogo 7 — Jogo da Memória (Pares Tinta + Braille)
 */
const MemoryGame = (() => {
  let cards = [];
  let flippedCards = [];
  let matchedPairs = new Set();
  let moves = 0;
  let currentLevel = 'iniciante';

  function init(level = 'iniciante') {
    currentLevel = level;
    cards = [];
    flippedCards = [];
    matchedPairs.clear();
    moves = 0;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numPairs = level === 'iniciante' ? 4 : (level === 'intermediario' ? 6 : 8);
    const chosenLetters = [...alphabet].sort(() => 0.5 - Math.random()).slice(0, numPairs);

    // Cria cartas (uma em Tinta e uma em Braille para cada letra)
    const deck = [];
    chosenLetters.forEach((letter, id) => {
      deck.push({ id: `ink-${id}`, letter, type: 'ink', isFlipped: false, isMatched: false });
      deck.push({ id: `braille-${id}`, letter, type: 'braille', isFlipped: false, isMatched: false });
    });

    // Embaralha baralho
    cards = deck.sort(() => 0.5 - Math.random());

    render();
    AudioEngine.speak(`Jogo da Memória iniciado com ${numPairs} pares. Encontre a correspondência entre a letra em Tinta e o padrão Braille.`);
  }

  function flipCard(index) {
    const card = cards[index];
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    card.isFlipped = true;
    flippedCards.push({ index, card });
    AudioEngine.playFlip();

    const info = getCharInfo(card.letter);
    if (card.type === 'ink') {
      AudioEngine.speak(`Carta ${index+1}: Letra em tinta ${info.name}`);
    } else {
      AudioEngine.speak(`Carta ${index+1}: Padrão Braille da letra ${info.name}, ${info.desc}`);
    }

    render();

    if (flippedCards.length === 2) {
      moves++;
      const [c1, c2] = flippedCards;
      if (c1.card.letter === c2.card.letter && c1.card.type !== c2.card.type) {
        // Par Correto!
        c1.card.isMatched = true;
        c2.card.isMatched = true;
        matchedPairs.add(c1.card.letter);
        AudioEngine.playSuccess();
        AudioEngine.speak(`Excelente! Par correto encontrado para a letra ${info.name}!`);
        flippedCards = [];
        render();

        if (matchedPairs.size === cards.length / 2) {
          AudioEngine.playWin();
          TeacherMode.recordGameResult('Jogo da Memória', true, `${moves} jogadas`);
          if (window.Championship) {
            window.Championship.recordMatchResult('Jogo da Memória', true, matchedPairs.size, cards.length / 2);
          }
          setTimeout(() => {
            AudioEngine.speak(`Parabéns! Você encontrou todos os ${matchedPairs.size} pares em apenas ${moves} jogadas!`);
          }, 600);
        }
      } else {
        // Par Incorreto!
        AudioEngine.playError();
        setTimeout(() => {
          c1.card.isFlipped = false;
          c2.card.isFlipped = false;
          flippedCards = [];
          render();
        }, 1200);
      }
    }
  }

  function render() {
    const container = document.getElementById('game-container');
    if (!container) return;

    let gridHTML = `<div class="memory-cards-grid grid-count-${cards.length}" role="grid" aria-label="Grade de cartas do Jogo da Memória">`;
    cards.forEach((card, idx) => {
      const info = getCharInfo(card.letter);
      const isVisible = card.isFlipped || card.isMatched;

      gridHTML += `
        <button type="button" class="memory-card-btn ${isVisible ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}" 
          onclick="MemoryGame.flipCard(${idx})"
          aria-label="Carta ${idx+1}: ${isVisible ? (card.type === 'ink' ? 'Letra em tinta ' + info.name : 'Braille ' + info.name) : 'Virada para baixo'}">
          <div class="card-inner">
            <div class="card-front">
              <span class="card-back-icon">❓</span>
              <span class="card-number-badge">#${idx+1}</span>
            </div>
            <div class="card-back">
              ${card.type === 'ink' ? `
                <div class="ink-card-content">
                  <span class="ink-char">${card.letter}</span>
                  <small class="type-label">Tinta</small>
                </div>
              ` : `
                <div class="braille-card-content">
                  <span class="braille-unicode">${info.unicode}</span>
                  <small class="dots-desc">${info.desc}</small>
                  <small class="type-label">Braille</small>
                </div>
              `}
            </div>
          </div>
        </button>
      `;
    });
    gridHTML += `</div>`;

    container.innerHTML = `
      <div class="game-wrapper memory-wrapper">
        <div class="game-header-bar">
          <h2>Jogo da Memória (Tinta + Braille)</h2>
          <div class="game-meta">
            <span class="badge level-badge">${currentLevel.toUpperCase()}</span>
            <span class="badge score-badge">Pares: ${matchedPairs.size} / ${cards.length / 2}</span>
            <span class="badge moves-badge">Jogadas: ${moves}</span>
          </div>
        </div>

        <div class="instructions-banner">
          <p>Vire duas cartas por vez para encontrar os pares de Letra em Tinta correspondentes ao Padrão Braille.</p>
        </div>

        ${gridHTML}

        <div class="game-actions-bar">
          <button type="button" class="btn btn-primary" onclick="MemoryGame.init('${currentLevel}')">🔄 Embaralhar Novamente</button>
        </div>
      </div>
    `;
  }

  return { init, flipCard, render };
})();
