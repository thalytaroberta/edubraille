/**
 * EduBraille Feed de Jogos — Módulo de Catálogo e Filtros de Nível/Tema
 * Botões de dificuldade com addEventListener conforme padrão solicitado.
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
  const cardSelectedLevels = {};

  // ------------------------------------------------------------------
  // Função de Definição de Dificuldade (padrão solicitado)
  // ------------------------------------------------------------------
  function setDifficulty(level) {
    activeFilterLevel = level;

    // Atualiza visual dos botões de dificuldade
    document.querySelectorAll('.difficulty-button').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(level === 'todos' ? 'all' : level);
    if (activeBtn) activeBtn.classList.add('active');

    // Re-renderiza o feed com o filtro aplicado
    renderFeed('game-feed-container');

    const levelLabel = {
      todos: 'Todos os Jogos',
      iniciante: 'Fácil (Iniciante)',
      intermediario: 'Médio (Intermediário)',
      avancado: 'Difícil (Avançado)'
    };
    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.speak(`Dificuldade definida como: ${levelLabel[level] || level}`);
      AudioEngine.playClick();
    }
    console.log(`Dificuldade definida como: ${level}`);
  }

  // ------------------------------------------------------------------
  // Inicializa os event listeners dos botões após renderização
  // ------------------------------------------------------------------
  function _bindDifficultyButtons() {
    document.querySelectorAll('.difficulty-button').forEach(button => {
      // Remove listener antigo para evitar duplicação
      const newBtn = button.cloneNode(true);
      button.parentNode.replaceChild(newBtn, button);
    });

    document.querySelectorAll('.difficulty-button').forEach(button => {
      button.addEventListener('click', function () {
        const difficulty = this.getAttribute('data-level');
        setDifficulty(difficulty);
      });
    });

    // Seletor de tema com addEventListener
    const themeSelect = document.getElementById('theme-category-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', function () {
        setCategoryTheme(this.value);
      });
    }

    // Dropdowns de nível por card
    document.querySelectorAll('.card-level-dropdown').forEach(select => {
      select.addEventListener('change', function () {
        const gameId = this.getAttribute('data-game-id');
        setCardLevel(gameId, this.value);
      });
    });

    // Botões Jogar por card
    document.querySelectorAll('.btn-play-card').forEach(btn => {
      btn.addEventListener('click', function () {
        const gameId = this.getAttribute('data-game-id');
        playGame(gameId);
      });
    });

    // Botões Ouvir por card
    document.querySelectorAll('.btn-audio-card').forEach(btn => {
      btn.addEventListener('click', function () {
        const text = this.getAttribute('data-text');
        if (typeof AudioEngine !== 'undefined') AudioEngine.speak(text);
      });
    });
  }

  // ------------------------------------------------------------------
  // Renderiza o Feed de Jogos
  // ------------------------------------------------------------------
  function renderFeed(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filteredGames = GAMES_LIST.filter(g =>
      activeFilterLevel === 'todos' || g.levels.includes(activeFilterLevel)
    );

    const activeAll = activeFilterLevel === 'todos';
    const activeInic = activeFilterLevel === 'iniciante';
    const activeMed = activeFilterLevel === 'intermediario';
    const activeAdv = activeFilterLevel === 'avancado';

    let html = `
      <!-- Barra de Filtros com botões de dificuldade e tema -->
      <div class="feed-filter-bar">
        <div class="filter-group">
          <span class="filter-label">🎯 Dificuldade:</span>
          <button id="all"           class="difficulty-button ${activeAll  ? 'active' : ''}" data-level="todos"         type="button">Todos os Jogos (${GAMES_LIST.length})</button>
          <button id="iniciante"     class="difficulty-button ${activeInic ? 'active' : ''}" data-level="iniciante"     type="button">🟢 Fácil</button>
          <button id="intermediario" class="difficulty-button ${activeMed  ? 'active' : ''}" data-level="intermediario" type="button">🟡 Médio</button>
          <button id="avancado"      class="difficulty-button ${activeAdv  ? 'active' : ''}" data-level="avancado"      type="button">🔴 Difícil</button>
        </div>

        <div class="filter-group theme-filter-group">
          <label for="theme-category-select" class="filter-label">🏷️ Tema:</label>
          <select id="theme-category-select" class="theme-select-dropdown" aria-label="Escolher tema de palavras">
            <option value="aleatorio"    ${activeCategoryTheme === 'aleatorio'  ? 'selected' : ''}>🎲 Aleatório (Misturar Todos)</option>
            <option value="games"        ${activeCategoryTheme === 'games'      ? 'selected' : ''}>🎮 Games & Videogames</option>
            <option value="internet"     ${activeCategoryTheme === 'internet'   ? 'selected' : ''}>🌐 Internet & Cultura Digital</option>
            <option value="musica"       ${activeCategoryTheme === 'musica'     ? 'selected' : ''}>🎵 Música & Instrumentos</option>
            <option value="filmes"       ${activeCategoryTheme === 'filmes'     ? 'selected' : ''}>🎬 Filmes & Animações</option>
            <option value="anime"        ${activeCategoryTheme === 'anime'      ? 'selected' : ''}>🍥 Anime & Otaku</option>
            <option value="fantasia"     ${activeCategoryTheme === 'fantasia'   ? 'selected' : ''}>🧙 Fantasia & Aventura</option>
            <option value="misterio"     ${activeCategoryTheme === 'misterio'   ? 'selected' : ''}>🕵️ Mistério & Enigmas</option>
            <option value="esportes"     ${activeCategoryTheme === 'esportes'   ? 'selected' : ''}>🏆 Esportes</option>
            <option value="animais"      ${activeCategoryTheme === 'animais'    ? 'selected' : ''}>🐶 Animais</option>
            <option value="ciencia"      ${activeCategoryTheme === 'ciencia'    ? 'selected' : ''}>🔬 Ciência</option>
            <option value="espaco"       ${activeCategoryTheme === 'espaco'     ? 'selected' : ''}>🚀 Espaço & Astros</option>
            <option value="tecnologia"   ${activeCategoryTheme === 'tecnologia' ? 'selected' : ''}>🤖 Tecnologia & Robótica</option>
            <option value="brasil"       ${activeCategoryTheme === 'brasil'     ? 'selected' : ''}>🇧🇷 Brasil & Cultura</option>
            <option value="mundo"        ${activeCategoryTheme === 'mundo'      ? 'selected' : ''}>🌎 Mundo & Países</option>
            <option value="historia"     ${activeCategoryTheme === 'historia'   ? 'selected' : ''}>🏛️ História</option>
            <option value="geografia"    ${activeCategoryTheme === 'geografia'  ? 'selected' : ''}>🗺️ Geografia</option>
            <option value="arte"         ${activeCategoryTheme === 'arte'       ? 'selected' : ''}>🎨 Arte & Criatividade</option>
            <option value="moda"         ${activeCategoryTheme === 'moda'       ? 'selected' : ''}>👟 Moda & Estilo</option>
            <option value="comida"       ${activeCategoryTheme === 'comida'     ? 'selected' : ''}>🍕 Comida & Gastronomia</option>
            <option value="natureza"     ${activeCategoryTheme === 'natureza'   ? 'selected' : ''}>🌱 Natureza</option>
            <option value="profissoes"   ${activeCategoryTheme === 'profissoes' ? 'selected' : ''}>👩‍🚀 Profissões</option>
            <option value="vidareal"     ${activeCategoryTheme === 'vidareal'   ? 'selected' : ''}>💡 Vida Real & Cidadania</option>
            <option value="curiosidades" ${activeCategoryTheme === 'curiosidades'? 'selected' : ''}>🤯 Curiosidades</option>
            <option value="desafios"    ${activeCategoryTheme === 'desafios'   ? 'selected' : ''}>🧠 Desafios Mentais</option>
            <option value="emojis"      ${activeCategoryTheme === 'emojis'     ? 'selected' : ''}>😎 Desafio Emoji</option>
            <option value="palavras"    ${activeCategoryTheme === 'palavras'   ? 'selected' : ''}>🔤 Palavra & Linguagem</option>
            <option value="libras"      ${activeCategoryTheme === 'libras'     ? 'selected' : ''}>🤟 Libras & Acessibilidade</option>
          </select>
        </div>
      </div>

      <!-- Grade de Cards (feed-container com flex-wrap) -->
      <div class="feed-container" role="region" aria-label="Catálogo de Jogos em Braille">
    `;

    filteredGames.forEach(game => {
      const cardTitle = game.name;
      const cardDesc = game.summary;
      const ttsText = `Jogo: ${cardTitle}. ${cardDesc}`;
      const chosenLevel = cardSelectedLevels[game.id] ||
        (game.levels.includes(activeFilterLevel) ? activeFilterLevel : game.levels[0]);

      html += `
        <article class="feed-item game-card" id="card-${game.id}" tabindex="0"
          aria-label="${cardTitle}. ${cardDesc}">

          <div class="card-header-area">
            <span class="symbol-badge" aria-hidden="true">${game.symbol}</span>
            <select class="card-level-dropdown ${chosenLevel}"
              data-game-id="${game.id}"
              aria-label="Nível de dificuldade para ${cardTitle}">
              ${game.levels.map(l => `
                <option value="${l}" ${chosenLevel === l ? 'selected' : ''}>
                  ${l === 'iniciante' ? '🟢 Fácil' : (l === 'intermediario' ? '🟡 Médio' : '🔴 Difícil')}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="card-body-area">
            <h3 class="game-card-title">${cardTitle}</h3>
            <p class="game-card-summary">${cardDesc}</p>
          </div>

          <div class="game-card-actions">
            <button type="button" class="btn btn-play btn-play-card"
              data-game-id="${game.id}"
              aria-label="Jogar ${cardTitle}">
              🎮 Jogar
            </button>
            <button type="button" class="btn btn-audio-card"
              data-text="${ttsText}"
              aria-label="Ouvir descrição do jogo ${cardTitle}">
              🔊 Ouvir
            </button>
          </div>
        </article>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Vincula todos os event listeners APÓS inserir o HTML no DOM
    _bindDifficultyButtons();
  }

  function setCategoryTheme(themeName) {
    activeCategoryTheme = themeName;
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    const labels = {
      aleatorio: 'Aleatório', musica: 'Música', geografia: 'Geografia',
      internet: 'Internet', animais: 'Animais', desenhos: 'Desenhos Animados'
    };
    if (typeof AudioEngine !== 'undefined')
      AudioEngine.speak(`Tema de palavras: ${labels[themeName] || themeName}`);
  }

  function setCardLevel(gameId, level) {
    cardSelectedLevels[gameId] = level;
    // Atualiza a cor do dropdown
    const sel = document.querySelector(`.card-level-dropdown[data-game-id="${gameId}"]`);
    if (sel) {
      sel.className = `card-level-dropdown ${level}`;
    }
    if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
  }

  function playGame(gameId) {
    const gameInfo = getGameById(gameId);
    if (!gameInfo) return;
    const level = cardSelectedLevels[gameId] ||
      (gameInfo.levels.includes(activeFilterLevel) ? activeFilterLevel : gameInfo.levels[0]);
    App.launchGame(gameId, level, activeCategoryTheme);
  }

  function getGameById(id) {
    return GAMES_LIST.find(g => g.id === id);
  }

  function getActiveCategoryTheme() {
    return activeCategoryTheme;
  }

  return {
    renderFeed,
    setDifficulty,
    setCategoryTheme,
    setCardLevel,
    playGame,
    getGameById,
    getActiveCategoryTheme,
    GAMES_LIST
  };
})();
