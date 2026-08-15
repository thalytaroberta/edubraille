/**
 * EduBraille Feed de Jogos
 * Exibe a lista de cards dos 12 jogos pedagógicos com suporte a filtro por nível, tema e seleção direta.
 */

const GameFeed = (() => {
  const GAMES_LIST = [
    {
      id: 'hangman-builder',
      name: 'Forca Célula em Branco',
      symbol: '⚪',
      summary: 'Adivinhe a palavra preenchendo os 6 círculos vazios da célula em branco ponto a ponto.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: HangmanBuilderGame
    },
    {
      id: 'wordsearch-builder',
      name: 'Caça-Palavras Célula em Branco',
      symbol: '⚪',
      summary: 'Preencha os círculos das células em branco da grade para formar as palavras.',
      levels: ['iniciante', 'intermediario', 'avancado'],
      module: WordSearchBuilderGame
    },
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
      summary: 'Preencha o tabuleiro a partir de dicas sonoras e letras Braille ponto a ponto.',
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
      summary: 'Preencha a grade sem repetir números nas linhas ou blocos.',
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

  let activeFilterLevel = 'todos';
  let activeCategoryTheme = 'aleatorio';

  function renderFeed(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filteredGames = GAMES_LIST.filter(g => activeFilterLevel === 'todos' || g.levels.includes(activeFilterLevel));

    let html = `
      <div class="feed-filter-bar" role="toolbar" aria-label="Filtros de nível e tema de palavras">
        <div class="filter-group">
          <span class="filter-label">🎯 Nível:</span>
          <button type="button" class="btn-filter ${activeFilterLevel === 'todos' ? 'active' : ''}" onclick="GameFeed.setFilterLevel('todos')">Todos os Jogos</button>
          <button type="button" class="btn-filter ${activeFilterLevel === 'iniciante' ? 'active' : ''}" onclick="GameFeed.setFilterLevel('iniciante')">Iniciante</button>
          <button type="button" class="btn-filter ${activeFilterLevel === 'intermediario' ? 'active' : ''}" onclick="GameFeed.setFilterLevel('intermediario')">Intermediário</button>
          <button type="button" class="btn-filter ${activeFilterLevel === 'avancado' ? 'active' : ''}" onclick="GameFeed.setFilterLevel('avancado')">Avançado (Difícil)</button>
        </div>

        <div class="filter-group theme-filter-group">
          <label for="theme-category-select" class="filter-label">🏷️ Tema das Palavras:</label>
          <select id="theme-category-select" class="form-select theme-select-dropdown" onchange="GameFeed.setCategoryTheme(this.value)" aria-label="Escolher tema de palavras">
            <option value="aleatorio" ${activeCategoryTheme === 'aleatorio' ? 'selected' : ''}>🎲 Tema Aleatório (Todos)</option>
            <option value="musica" ${activeCategoryTheme === 'musica' ? 'selected' : ''}>🎵 Música</option>
            <option value="geografia" ${activeCategoryTheme === 'geografia' ? 'selected' : ''}>🌍 Geografia</option>
            <option value="internet" ${activeCategoryTheme === 'internet' ? 'selected' : ''}>🌐 Internet</option>
            <option value="animais" ${activeCategoryTheme === 'animais' ? 'selected' : ''}>🐾 Animais</option>
            <option value="desenhos" ${activeCategoryTheme === 'desenhos' ? 'selected' : ''}>🎬 Desenhos Animados</option>
          </select>
        </div>
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
            <span class="symbol-badge" title="Símbolo">${game.symbol}</span>
            <div class="levels-pills-interactive" role="group" aria-label="Selecionar nível de dificuldade para ${cardTitle}">
              ${game.levels.map(l => `
                <button type="button" class="level-pill-btn ${l} ${App.getCurrentLevel() === l ? 'selected' : ''}" 
                  onclick="event.stopPropagation(); App.launchGame('${game.id}', '${l}', '${activeCategoryTheme}')" 
                  aria-label="Jogar ${cardTitle} no nível ${l}">
                  ${l === 'avancado' ? 'AVANÇADO (DIFÍCIL)' : l.toUpperCase()}
                </button>
              `).join('')}
            </div>
          </div>
          <h3 class="game-card-title">${cardTitle}</h3>
          <p class="game-card-summary">${cardDesc}</p>
          <div class="game-card-actions">
            <button type="button" class="btn btn-play" onclick="App.launchGame('${game.id}', App.getCurrentLevel(), '${activeCategoryTheme}')" aria-label="Jogar ${cardTitle}">
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

  function setFilterLevel(filterName) {
    activeFilterLevel = filterName;
    renderFeed('game-feed-container');
    AudioEngine.playClick();
    AudioEngine.speak(`Filtro de nível alterado para: ${filterName === 'todos' ? 'Todos os jogos' : filterName}`);
  }

  function setCategoryTheme(themeName) {
    activeCategoryTheme = themeName;
    AudioEngine.playClick();
    const themeLabels = {
      aleatorio: 'Tema Aleatório',
      musica: 'Tema Música',
      geografia: 'Tema Geografia',
      internet: 'Tema Internet',
      animais: 'Tema Animais',
      desenhos: 'Tema Desenhos Animados'
    };
    AudioEngine.speak(`Tema selecionado: ${themeLabels[themeName] || themeName}`);
  }

  function getGameById(id) {
    return GAMES_LIST.find(g => g.id === id);
  }

  function getActiveCategoryTheme() {
    return activeCategoryTheme;
  }

  return { renderFeed, setFilterLevel, setCategoryTheme, getGameById, getActiveCategoryTheme, GAMES_LIST };
})();
