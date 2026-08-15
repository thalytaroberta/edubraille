/**
 * EduBraille Feed de Jogos
 * Exibe a lista de cards dos 10 jogos pedagógicos com suporte a filtro por nível e TTS.
 */

const GameFeed = (() => {
  const GAMES_LIST = [
    {
      id: 'hangman',
      name: 'Jogo da Forca',
      symbol: '⠋',
      summary: 'Adivinhe a palavra secreta letra por letra em Tinta e Braille.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: HangmanGame
    },
    {
      id: 'wordsearch',
      name: 'Caça-Palavras',
      symbol: '⠉',
      summary: 'Encontre palavras escondidas na grade tátil de letras Braille.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: WordSearchGame
    },
    {
      id: 'crosswords',
      name: 'Cruzadas Diretas',
      symbol: '⠯',
      summary: 'Preencha o tabuleiro a partir de dicas sonoras e letras Braille.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: DirectCrosswordGame
    },
    {
      id: 'syllables',
      name: 'Cruzadas Silábicas',
      symbol: '⠎',
      summary: 'Monte palavras combinando blocos de sílabas em Tinta e Braille.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: SyllableCrosswordGame
    },
    {
      id: 'math',
      name: 'Cruzadas Numéricas',
      symbol: '⠼',
      summary: 'Resolva contas simples preenchendo números com sinal Braille ⠼.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: MathCrosswordGame
    },
    {
      id: 'sudoku',
      name: 'Sudoku Braille',
      symbol: '⠼⠁',
      summary: 'Preencha a grade 4x4 sem repetir números nas linhas ou blocos.',
      levels: ['iniciante', 'intermediario'],
      module: SudokuGame
    },
    {
      id: 'memory',
      name: 'Jogo da Memória',
      symbol: '⠍',
      summary: 'Vire as cartas e encontre o par entre a letra em Tinta e o Braille.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: MemoryGame
    },
    {
      id: 'bingo',
      name: 'Bingo de Letras',
      symbol: '⠃',
      summary: 'Marque na sua cartela as letras sorteadas em voz alta.',
      levels: ['iniciante'],
      module: BingoGame
    },
    {
      id: 'match',
      name: 'Ligue os Pontos',
      symbol: '⠇',
      summary: 'Conecte cada letra em Tinta ao seu padrão Braille correspondente.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: MatchDotsGame
    },
    {
      id: 'assemble',
      name: 'Monte a Sílaba',
      symbol: 'amt',
      summary: 'Ouça a palavra falada e ordene os cartões de sílabas Braille.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: AssembleSyllablesGame
    }
  ];

  let activeFilter = 'todos';

  function renderFeed(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filteredGames = GAMES_LIST.filter(g => activeFilter === 'todos' || g.levels.includes(activeFilter));

    let html = `
      <div class="feed-filter-bar" role="toolbar" aria-label="Filtros por nível de dificuldade">
        <span class="filter-label">Nível de Dificuldade:</span>
        <button type="button" class="btn-filter ${activeFilter === 'todos' ? 'active' : ''}" onclick="GameFeed.setFilter('todos')">Todos os Jogos</button>
        <button type="button" class="btn-filter ${activeFilter === 'iniciante' ? 'active' : ''}" onclick="GameFeed.setFilter('iniciante')">Iniciante</button>
        <button type="button" class="btn-filter ${activeFilter === 'intermediario' ? 'active' : ''}" onclick="GameFeed.setFilter('intermediario')">Intermediário</button>
        <button type="button" class="btn-filter ${activeFilter === 'avancado' ? 'active' : ''}" onclick="GameFeed.setFilter('avancado')">Avançado</button>
      </div>

      <div class="games-grid" role="region" aria-label="Catálogo de Jogos em Braille">
    `;

    filteredGames.forEach(game => {
      const cardTitle = game.name;
      const cardDesc = game.summary;
      const ttsCardText = `Jogo: ${cardTitle}. ${cardDesc}`;

      html += `
        <article class="game-card" id="card-${game.id}" tabindex="0" aria-label="${cardTitle}. ${cardDesc}">
          <div class="card-badge-row">
            <span class="symbol-badge" title="Símbolo Braille">${game.symbol}</span>
            <div class="levels-pills">
              ${game.levels.map(l => `<span class="level-pill ${l}">${l}</span>`).join('')}
            </div>
          </div>
          <h3 class="game-card-title">${cardTitle}</h3>
          <p class="game-card-summary">${cardDesc}</p>
          <div class="game-card-actions">
            <button type="button" class="btn btn-play" onclick="App.launchGame('${game.id}')" aria-label="Jogar ${cardTitle}">
              🎮 Jogar
            </button>
            <button type="button" class="btn btn-audio-card" onclick="AudioEngine.speak('${ttsCardText}')" aria-label="Ouvir descrição do jogo ${cardTitle}">
              🔊 Ouvir
            </button>
          </div>
        </article>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  function setFilter(filterName) {
    activeFilter = filterName;
    renderFeed('game-feed-container');
    AudioEngine.playClick();
    AudioEngine.speak(`Filtro alterado para: ${filterName === 'todos' ? 'Todos os jogos' : filterName}`);
  }

  function getGameById(id) {
    return GAMES_LIST.find(g => g.id === id);
  }

  return { renderFeed, setFilter, getGameById, GAMES_LIST };
})();
