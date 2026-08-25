/**
 * EduBraille Teacher Mode & Dashboard
 * Modo Professor: exibe a palavra-resposta, padrões Braille de cada letra,
 * progresso do aluno e dicas pedagógicas ao lado dos jogos.
 */

const TeacherMode = (() => {
  let isTeacherMode = false;
  let customWordBank = [];

  // Estatísticas salvas no localStorage
  let studentStats = {
    gamesPlayed: 0,
    wins: 0,
    wordsDiscovered: 0,
    history: []
  };

  function init() {
    loadStats();
    loadCustomWords();
  }

  function toggleTeacherMode(enable) {
    if (enable !== undefined) {
      isTeacherMode = enable;
    } else {
      isTeacherMode = !isTeacherMode;
    }

    document.body.classList.toggle('teacher-mode-active', isTeacherMode);

    const btn = document.getElementById('btn-toggle-teacher-mode');
    const badge = document.getElementById('teacher-mode-badge');

    if (btn) {
      btn.setAttribute('aria-pressed', isTeacherMode);
      btn.classList.toggle('active', isTeacherMode);
      btn.textContent = isTeacherMode ? '🎓 Modo Professor ON' : '🎓 Modo Professor';
    }

    if (badge) {
      badge.style.display = isTeacherMode ? 'inline-flex' : 'none';
    }

    const msg = isTeacherMode
      ? 'Modo Professor ativado! A resposta secreta e os padrões Braille de cada letra agora são exibidos ao lado do jogo.'
      : 'Modo Professor desativado.';

    AudioEngine.speak(msg);
    AudioEngine.playClick();

    // Atualiza o jogo ativo para mostrar/ocultar o painel professor
    if (window.App && window.App.refreshCurrentGame) {
      window.App.refreshCurrentGame();
    }

    return isTeacherMode;
  }

  function isActive() {
    return isTeacherMode;
  }

  // ---------------------------------------------------------------
  // PAINEL PROFESSOR LATERAL — gerado dentro dos jogos
  // ---------------------------------------------------------------
  /**
   * Gera o HTML do painel lateral do professor para um jogo de palavras.
   * @param {string} secretWord - Palavra secreta do jogo
   * @param {string} hint       - Dica da palavra
   * @param {Set}    guessed    - Letras já tentadas/reveladas
   * @param {number} errors     - Erros cometidos
   * @param {number} maxErrors  - Máximo de erros permitido
   */
  function buildTeacherPanel(secretWord, hint, guessed = new Set(), errors = 0, maxErrors = 6) {
    if (!isTeacherMode) return '';

    const progress = secretWord.split('').filter(ch => guessed.has(ch)).length;
    const total = secretWord.length;
    const pct = Math.round((progress / total) * 100);

    // Tabela letra por letra com o padrão Braille
    let letterTableHTML = '';
    secretWord.split('').forEach((ch, i) => {
      const info = getCharInfo(ch);
      const isFound = guessed.has(ch);
      letterTableHTML += `
        <div class="teacher-letter-row ${isFound ? 'found' : ''}">
          <span class="tl-pos">${i + 1}</span>
          <span class="tl-ink">${ch}</span>
          <span class="tl-braille" title="${info.desc}">${info.unicode}</span>
          <span class="tl-dots">${info.desc}</span>
          <span class="tl-status">${isFound ? '✅' : '⬜'}</span>
        </div>
      `;
    });

    return `
      <aside class="teacher-side-panel" role="complementary" aria-label="Painel do Professor">
        <div class="tsp-header">
          <span class="tsp-icon">🎓</span>
          <strong>Modo Professor</strong>
        </div>

        <!-- Resposta Secreta -->
        <div class="tsp-block tsp-secret">
          <span class="tsp-block-title">🔑 Palavra Secreta</span>
          <div class="tsp-secret-word">${secretWord}</div>
          <button type="button" class="tsp-speak-btn" onclick="AudioEngine.speak('A palavra secreta é: ${secretWord}')">🔊 Soletrar</button>
        </div>

        <!-- Dica -->
        <div class="tsp-block tsp-hint">
          <span class="tsp-block-title">💡 Dica do Jogo</span>
          <p class="tsp-hint-text">${hint}</p>
        </div>

        <!-- Progresso do Aluno -->
        <div class="tsp-block tsp-progress-block">
          <span class="tsp-block-title">📊 Progresso do Aluno</span>
          <div class="tsp-progress-bar-wrap">
            <div class="tsp-progress-bar" style="width: ${pct}%"></div>
          </div>
          <small>${progress} de ${total} letras descobertas (${pct}%)</small>
          ${errors > 0 ? `<div class="tsp-errors">❌ Erros: <strong>${errors}</strong> de ${maxErrors}</div>` : ''}
        </div>

        <!-- Tabela Braille -->
        <div class="tsp-block tsp-braille-table">
          <span class="tsp-block-title">📖 Padrão Braille de Cada Letra</span>
          <div class="tsp-letter-table">
            <div class="teacher-letter-row tl-head">
              <span class="tl-pos">#</span>
              <span class="tl-ink">Letra</span>
              <span class="tl-braille">⠿</span>
              <span class="tl-dots">Pontos</span>
              <span class="tl-status">OK</span>
            </div>
            ${letterTableHTML}
          </div>
        </div>

        <!-- Estatísticas da Sessão -->
        <div class="tsp-block tsp-session-stats">
          <span class="tsp-block-title">🏆 Sessão</span>
          <div class="tsp-stat-row"><span>Jogos</span><strong>${studentStats.gamesPlayed}</strong></div>
          <div class="tsp-stat-row"><span>Vitórias</span><strong>${studentStats.wins}</strong></div>
          <div class="tsp-stat-row"><span>Acerto</span><strong>${studentStats.gamesPlayed > 0 ? Math.round((studentStats.wins / studentStats.gamesPlayed) * 100) : 0}%</strong></div>
        </div>
      </aside>
    `;
  }

  // ---------------------------------------------------------------
  // Registra progresso do aluno
  // ---------------------------------------------------------------
  function recordGameResult(gameName, won, details = '') {
    studentStats.gamesPlayed++;
    if (won) studentStats.wins++;
    studentStats.history.unshift({
      game: gameName,
      won,
      details,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    if (studentStats.history.length > 20) studentStats.history.pop();
    saveStats();
    renderStatsDashboard();
  }

  function saveStats() {
    try { localStorage.setItem('edubraille_stats', JSON.stringify(studentStats)); } catch (e) {}
  }

  function loadStats() {
    try {
      const saved = localStorage.getItem('edubraille_stats');
      if (saved) studentStats = JSON.parse(saved);
    } catch (e) {}
  }

  function loadCustomWords() {
    try {
      const saved = localStorage.getItem('edubraille_custom_words');
      if (saved) customWordBank = JSON.parse(saved);
    } catch (e) {}
  }

  function addCustomWord(word, hint, level = 'iniciante') {
    const cleanWord = word.trim().toUpperCase();
    if (!cleanWord) return false;
    customWordBank.push({ word: cleanWord, hint: hint || 'Palavra personalizada do professor', level });
    try { localStorage.setItem('edubraille_custom_words', JSON.stringify(customWordBank)); } catch (e) {}
    AudioEngine.speak(`Palavra ${cleanWord} adicionada ao banco do professor!`);
    return true;
  }

  function renderStatsDashboard() {
    const container = document.getElementById('teacher-stats-container');
    if (!container) return;

    const winRate = studentStats.gamesPlayed > 0
      ? Math.round((studentStats.wins / studentStats.gamesPlayed) * 100) : 0;

    let historyHTML = '';
    if (studentStats.history.length === 0) {
      historyHTML = '<p class="text-muted">Nenhum jogo concluído nesta sessão ainda.</p>';
    } else {
      historyHTML = '<ul class="history-list">';
      studentStats.history.forEach(item => {
        const badgeClass = item.won ? 'badge-success' : 'badge-danger';
        const resultText = item.won ? 'Vitória' : 'Tentativa';
        historyHTML += `
          <li class="history-item">
            <span class="history-time">${item.timestamp}</span>
            <strong class="history-game">${item.game}</strong>
            <span class="badge ${badgeClass}">${resultText}</span>
            <small class="history-details">${item.details}</small>
          </li>
        `;
      });
      historyHTML += '</ul>';
    }

    container.innerHTML = `
      <div class="stats-cards-grid">
        <div class="stat-card">
          <span class="stat-number">${studentStats.gamesPlayed}</span>
          <span class="stat-label">Jogos Realizados</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${studentStats.wins}</span>
          <span class="stat-label">Vitórias</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${winRate}%</span>
          <span class="stat-label">Taxa de Acerto</span>
        </div>
      </div>
      <div class="history-section">
        <h3>Histórico de Atividades do Aluno</h3>
        ${historyHTML}
      </div>
    `;
  }

  function renderReferenceChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const keys = Object.keys(BRAILLE_MAP).filter(k => k !== '#');

    let html = `
      <div class="reference-chart-toolbar">
        <input type="text" id="ref-search-input" class="form-control" placeholder="Buscar letra ou número..." oninput="TeacherMode.filterReferenceChart(this.value)" aria-label="Buscar na tabela de referência Braille">
        <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Tabela de referência Braille contendo todas as 26 letras, caracteres acentuados e números de 0 a 9 com seus respectivos pontos 1 a 6.')">
          🔊 Ouvir Resumo da Tabela
        </button>
      </div>
      <div class="reference-grid" id="reference-grid-items">
    `;

    keys.forEach(k => {
      html += renderDualCellHTML(k, { size: 'small', showAudioBtn: true });
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  function filterReferenceChart(query) {
    const q = query.trim().toUpperCase();
    const items = document.querySelectorAll('#reference-grid-items .dual-cell-card');
    items.forEach(card => {
      const char = card.getAttribute('data-char');
      card.style.display = (!q || char.includes(q)) ? 'flex' : 'none';
    });
  }

  function getCustomWords() {
    return customWordBank;
  }

  function renderAEETeacherHub(containerId = 'teacher-aee-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const games = window.GameFeed ? window.GameFeed.GAMES_LIST : [];
    let gameOptionsHTML = games.map(g => `<option value="${g.id}">${g.symbol} ${g.name}</option>`).join('');

    let customWordsListHTML = '';
    if (customWordBank.length === 0) {
      customWordsListHTML = '<p class="text-muted">Nenhuma palavra personalizada cadastrada ainda.</p>';
    } else {
      customWordsListHTML = '<ul class="custom-words-list">';
      customWordBank.forEach((item, idx) => {
        customWordsListHTML += `
          <li class="custom-word-item">
            <strong>${item.word}</strong> — <small>Dica: ${item.hint}</small>
          </li>
        `;
      });
      customWordsListHTML += '</ul>';
    }

    container.innerHTML = `
      <div class="teacher-aee-wrapper">
        <div class="teacher-aee-header">
          <h2>🎓 Painel do Professor de AEE</h2>
          <p>Personalize jogos, conteúdos, níveis de dificuldade e vocabulário de acordo com os objetivos pedagógicos do seu aluno.</p>
        </div>

        <div class="aee-grid-layout">
          <!-- Coluna 1: Configuração e Seleção da Atividade -->
          <div class="aee-card-box">
            <h3>⚙️ Configuração de Atividade Pedagógica</h3>
            
            <form id="form-aee-launcher" onsubmit="event.preventDefault(); TeacherMode.launchCustomAEEGame();">
              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label for="aee-select-game"><strong>1. Selecionar o Jogo Pedagógico:</strong></label>
                <select id="aee-select-game" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid var(--border-color);" aria-label="Selecionar jogo pedagógico">
                  ${gameOptionsHTML}
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label for="aee-select-level"><strong>2. Selecionar o Nível de Dificuldade:</strong></label>
                <select id="aee-select-level" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid var(--border-color);" aria-label="Selecionar nível de dificuldade">
                  <option value="iniciante">🟢 Fácil (Iniciante)</option>
                  <option value="intermediario">🟡 Médio (Intermediário)</option>
                  <option value="avancado">🟠 Difícil (Avançado)</option>
                  <option value="insano">🔴 Insano (Desafio Máximo)</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label for="aee-select-theme"><strong>3. Selecionar o Tema / Conteúdo Curricular:</strong></label>
                <select id="aee-select-theme" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid var(--border-color);" aria-label="Selecionar tema de conteúdo">
                  <option value="aleatorio">🎲 Aleatório / Misturar Todos</option>
                  <option value="games">🎮 Games & Videogames</option>
                  <option value="internet">🌐 Internet & Cultura Digital</option>
                  <option value="musica">🎵 Música & Instrumentos</option>
                  <option value="filmes">🎬 Filmes, Séries & Animações</option>
                  <option value="anime">🍥 Anime, Mangá & Cultura Pop</option>
                  <option value="fantasia">🧙 Fantasia & Aventura</option>
                  <option value="misterio">🕵️ Mistério & Investigação</option>
                  <option value="esportes">🏆 Esportes & Atletismo</option>
                  <option value="animais">🐶 Animais & Natureza</option>
                  <option value="ciencia">🔬 Ciência & Experimentos</option>
                  <option value="espaco">🚀 Espaço & Sistema Solar</option>
                  <option value="tecnologia">🤖 Tecnologia & Robótica</option>
                  <option value="brasil">🇧🇷 Brasil, Biomas & Folclore</option>
                  <option value="mundo">🌎 Mundo, Países & Bandeiras</option>
                  <option value="historia">🏛️ História & Civilizações</option>
                  <option value="geografia">🗺️ Geografia & Mapas</option>
                  <option value="arte">🎨 Arte & Criatividade</option>
                  <option value="moda">👟 Moda & Estilo Urbano</option>
                  <option value="comida">🍕 Comida & Gastronomia</option>
                  <option value="natureza">🌱 Natureza & Meio Ambiente</option>
                  <option value="profissoes">👩‍🚀 Profissões & Futuro</option>
                  <option value="vidareal">💡 Vida Real & Cidadania</option>
                  <option value="curiosidades">🤯 Curiosidades Fatos Incríveis</option>
                  <option value="desafios">🧠 Desafios Mentais & Lógica</option>
                  <option value="emojis">😎 Emojis & Desafios Visuais</option>
                  <option value="palavras">🔤 Palavras & Linguagem</option>
                  <option value="libras">🤟 Libras, Braille & Acessibilidade</option>
                  <option value="desenhos">🎬 Desenhos Animados</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label><strong>4. Opções Pedagógicas de Acessibilidade:</strong></label>
                <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  <label><input type="checkbox" id="aee-toggle-teacher-side" checked> Ativar Painel Lateral com Padrão Braille (Modo Professor)</label>
                  <label><input type="checkbox" id="aee-toggle-voice" checked> Ativar Leitura por Voz dos Pontos e Dicas</label>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
                🎮 Lançar Atividade Personalizada para o Aluno
              </button>
            </form>
          </div>

          <!-- Coluna 2: Banco de Palavras Personalizadas -->
          <div class="aee-card-box">
            <h3>➕ Banco de Palavras Personalizadas</h3>
            <p class="text-muted">Cadastre palavras específicas do currículo do aluno (ex: família, nomes, objetos da sala de aula).</p>

            <form id="form-aee-custom-word" onsubmit="event.preventDefault(); TeacherMode.handleCustomWordSubmit();" style="margin-bottom: 1.5rem;">
              <div class="form-group" style="margin-bottom: 1rem;">
                <input type="text" id="aee-custom-word-input" class="form-control" placeholder="Palavra (ex: ESCOLA)" required style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid var(--border-color);" aria-label="Nova palavra personalizada">
              </div>
              <div class="form-group" style="margin-bottom: 1rem;">
                <input type="text" id="aee-custom-hint-input" class="form-control" placeholder="Dica acessível (ex: Lugar onde aprendemos)" required style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid var(--border-color);" aria-label="Dica para a palavra">
              </div>
              <button type="submit" class="btn btn-secondary" style="width: 100%;">
                ➕ Adicionar ao Banco do Aluno
              </button>
            </form>

            <h4>Palavras Personalizadas Cadastradas:</h4>
            ${customWordsListHTML}
          </div>
        </div>

        <!-- Relatório de Acompanhamento do Aluno -->
        <div class="aee-card-box" style="margin-top: 2rem;">
          <h3>📊 Relatório de Desempenho e Acompanhamento AEE</h3>
          <div id="teacher-stats-container"></div>
        </div>
      </div>
    `;

    renderStatsDashboard();
  }

  function launchCustomAEEGame() {
    const gameId = document.getElementById('aee-select-game').value;
    const level = document.getElementById('aee-select-level').value;
    const theme = document.getElementById('aee-select-theme').value;
    const teacherSide = document.getElementById('aee-toggle-teacher-side').checked;

    toggleTeacherMode(teacherSide);

    if (window.App && window.App.launchGame) {
      window.App.launchGame(gameId, level, theme);
    }
  }

  function handleCustomWordSubmit() {
    const wordInput = document.getElementById('aee-custom-word-input');
    const hintInput = document.getElementById('aee-custom-hint-input');
    if (wordInput && hintInput) {
      const ok = addCustomWord(wordInput.value, hintInput.value);
      if (ok) {
        wordInput.value = '';
        hintInput.value = '';
        renderAEETeacherHub('teacher-aee-container');
      }
    }
  }

  return {
    init,
    toggleTeacherMode,
    isActive,
    buildTeacherPanel,
    recordGameResult,
    addCustomWord,
    getCustomWords,
    renderStatsDashboard,
    renderReferenceChart,
    filterReferenceChart,
    renderAEETeacherHub,
    launchCustomAEEGame,
    handleCustomWordSubmit
  };
})();

