/**
 * EduBraille Main Application Controller
 * Controlador principal do aplicativo EduBraille: gerencia rotas, abas,
 * ativação de visões (Feed, Campeonato, Professor AEE, Referência Braille e Jogo),
 * e dispara a leitura espacial automática por voz a cada navegação.
 */

const App = (() => {
  let currentGameId = null;
  let currentLevel = 'iniciante';
  let currentThemeCategory = 'aleatorio';
  let currentThemeIndex = 0;
  let isChampionshipMode = false;

  const THEMES = ['theme-default', 'theme-dark', 'theme-high-contrast-yellow', 'theme-high-contrast-cyan'];
  const THEME_NAMES = ['Claro Padrão', 'Escuro', 'Alto Contraste Amarelo', 'Alto Contraste Ciano'];

  function init() {
    TeacherMode.init();
    Championship.init();
    if (window.BrailleAssistant && window.BrailleAssistant.init) {
      window.BrailleAssistant.init();
    }
    
    // Renderiza a página inicial (Feed + Banner do Campeonato + Caixa de Dúvidas)
    returnToFeed(false);
    TeacherMode.renderReferenceChart('braille-reference-container');

    setupKeyboardShortcuts();

    setTimeout(() => {
      AudioEngine.announceSection('feed');
    }, 500);
  }

  /**
   * Oculta todas as seções e remove classe active dos botões da nav
   */
  function hideAllSections() {
    ['feed-section', 'championship-section', 'teacher-aee-section', 'game-section', 'reference-section'].forEach(id => {
      const sec = document.getElementById(id);
      if (sec) sec.style.display = 'none';
    });

    document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
  }

  function returnToFeed(announce = true) {
    currentGameId = null;
    isChampionshipMode = false;
    hideAllSections();

    const feedSection = document.getElementById('feed-section');
    if (feedSection) feedSection.style.display = 'block';

    const feedBtn = document.getElementById('nav-btn-feed');
    if (feedBtn) feedBtn.classList.add('active');

    // 1. Renderiza a trajetória / banner do campeonato na home
    Championship.renderHomeRankingBanner('home-ranking-banner-container');

    // 2. Renderiza a Caixa "Tire sua dúvida sobre Braille"
    const qaContainer = document.getElementById('braille-qa-container');
    if (qaContainer && window.BrailleAssistant) {
      qaContainer.innerHTML = window.BrailleAssistant.renderQABoxHTML();
    }

    // 3. Renderiza o catálogo de jogos e categorias
    GameFeed.renderFeed('game-feed-container');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (announce) {
      AudioEngine.playClick();
      AudioEngine.announceSection('feed-section');
    }
  }

  function showChampionshipView(subView = 'trajectory') {
    currentGameId = null;
    isChampionshipMode = false;
    Championship.clearChampionshipModeFlag();

    if (subView && window.Championship && window.Championship.setSubViewDirectly) {
      window.Championship.setSubViewDirectly(subView);
    } else if (window.Championship && window.Championship.setSubViewDirectly) {
      window.Championship.setSubViewDirectly('trajectory');
    }

    hideAllSections();

    const champSection = document.getElementById('championship-section');
    if (champSection) champSection.style.display = 'block';

    const champBtn = document.getElementById('nav-btn-championship');
    if (champBtn) champBtn.classList.add('active');

    Championship.renderChampionshipHub();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    AudioEngine.playClick();
    AudioEngine.announceSection('championship-section');
  }

  function showAEETeacherDashboard() {
    currentGameId = null;
    isChampionshipMode = false;
    hideAllSections();

    const teacherSection = document.getElementById('teacher-aee-section');
    if (teacherSection) teacherSection.style.display = 'block';

    const teacherBtn = document.getElementById('nav-btn-teacher');
    if (teacherBtn) teacherBtn.classList.add('active');

    TeacherMode.renderAEETeacherHub('teacher-aee-container');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    AudioEngine.playClick();
    AudioEngine.announceSection('teacher-section');
  }

  function showReferenceChart() {
    currentGameId = null;
    isChampionshipMode = false;
    hideAllSections();

    const refSection = document.getElementById('reference-section');
    if (refSection) refSection.style.display = 'block';

    const refBtn = document.getElementById('nav-btn-reference');
    if (refBtn) refBtn.classList.add('active');

    TeacherMode.renderReferenceChart('braille-reference-container');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    AudioEngine.playClick();
    AudioEngine.announceSection('reference-section');
  }

  function launchGame(gameId, level, themeCategory, themeDbLevel) {
    const gameInfo = GameFeed.getGameById(gameId);
    if (!gameInfo) return;

    currentGameId = gameId;
    if (level) currentLevel = level;
    if (themeCategory) currentThemeCategory = themeCategory;

    // Detecta modo campeonato ANTES de ocultar seções
    // Usa a flag explícita do Championship (mais confiável que checar display)
    isChampionshipMode = Championship.isChampionshipModeActive();

    hideAllSections();

    const gameSection = document.getElementById('game-section');
    if (gameSection) gameSection.style.display = 'block';

    // Injeta a barra de navegação/status do jogo
    renderActiveGameHeader(gameInfo);

    gameSection.scrollIntoView({ behavior: 'smooth' });

    // Se houver themeDbLevel, configura o WordManager para usar o nível certo de tema
    if (themeDbLevel && window.WordManager && window.WordManager.setChampionshipThemeLevel) {
      window.WordManager.setChampionshipThemeLevel(themeDbLevel);
    }

    if (gameInfo.module && gameInfo.module.init) {
      gameInfo.module.init(currentLevel);
    }

    AudioEngine.playClick();
    AudioEngine.announceSection('game-section');
  }

  function renderActiveGameHeader(gameInfo) {
    const headerContainer = document.getElementById('game-section-header');
    if (!headerContainer) return;

    const student = Championship.getActiveStudent();

    if (student) {
      headerContainer.innerHTML = `
        <div class="active-game-banner championship-game-banner">
          <div class="agb-left">
            <button type="button" class="btn btn-secondary" onclick="Championship.openModalConfirmExitGame()" aria-label="Voltar para Minha Trajetória">
              ← VOLTAR PARA MINHA TRAJETÓRIA
            </button>
          </div>
          <div class="agb-center">
            <h3>🎮 ${gameInfo.name.toUpperCase()}</h3>
            <span class="agb-pill">Nível atual: <strong>${student.currentLevel.toUpperCase()}</strong></span>
            <span class="agb-pill">Tema: <strong>Surpresa! 🎁</strong></span>
          </div>
          <div class="agb-right">
            <span class="student-tag">👤 ${student.nickname}</span>
          </div>
        </div>
      `;
    } else {
      headerContainer.innerHTML = `
        <div class="active-game-banner standard-game-banner">
          <button type="button" class="btn btn-secondary" onclick="App.returnToFeed()" aria-label="Voltar para o Feed de Jogos">
            ⬅ Voltar ao Feed de Jogos (Alt + F)
          </button>
          <div class="agb-center">
            <h3>🎮 ${gameInfo.name}</h3>
          </div>
        </div>
      `;
    }
  }

  function getCurrentLevel() {
    return currentLevel;
  }

  function setGameLevel(level) {
    currentLevel = level;
    if (currentGameId) {
      launchGame(currentGameId, currentLevel, currentThemeCategory);
    }
    AudioEngine.speak(`Nível alterado para ${level}.`);
  }

  function cycleTheme() {
    document.body.classList.remove(...THEMES);
    currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    document.body.classList.add(THEMES[currentThemeIndex]);

    const themeName = THEME_NAMES[currentThemeIndex];
    AudioEngine.speak(`Tema visual alterado para: ${themeName}`);
    AudioEngine.playClick();
  }

  function toggleGlobalSpeech() {
    const isEnabled = AudioEngine.toggleTTS();
    const btn = document.getElementById('btn-tts-toggle');
    if (btn) {
      btn.innerText = isEnabled ? '🔊 Voz On' : '🔇 Voz Off';
    }
    AudioEngine.speak(isEnabled ? 'Voz ativada' : 'Voz desativada');
  }

  function refreshCurrentGame() {
    if (currentGameId) {
      const gameInfo = GameFeed.getGameById(currentGameId);
      if (gameInfo && gameInfo.module && gameInfo.module.render) {
        gameInfo.module.render();
      }
    }
  }

  function getCurrentGameId() {
    return currentGameId;
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // 1. Atalhos Globais com Alt
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            TeacherMode.toggleTeacherMode();
            return;
          case 't':
            e.preventDefault();
            cycleTheme();
            return;
          case 's':
            e.preventDefault();
            toggleGlobalSpeech();
            return;
          case 'f':
            e.preventDefault();
            returnToFeed();
            return;
          case 'h':
            e.preventDefault();
            openHelpModal();
            return;
        }
      }

      // 2. Tecla Escape para modais ou saída de jogo
      if (e.key === 'Escape') {
        const anyModal = document.querySelector('.modal.show, .championship-modal-overlay');
        if (anyModal) {
          closeAllModals();
          return;
        }
        if (currentGameId) {
          if (Championship.isLoggedIn()) {
            Championship.openModalConfirmExitGame();
          } else {
            returnToFeed();
          }
          return;
        }
      }

      // 3. Se estiver digitando em um input/textarea ou select de modal/formulário, não intercepta
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isTypingInInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';
      if (isTypingInInput && !document.activeElement.classList.contains('game-cell-input')) {
        return;
      }

      // 4. Se houver modal aberto na tela, não envia comandos para o jogo de fundo
      const activeModal = document.querySelector('.modal.show');
      if (activeModal) {
        return;
      }

      // 5. Se houver um jogo ativo na tela (Seção game-section visível)
      const gameSec = document.getElementById('game-section');
      if (currentGameId && gameSec && gameSec.style.display !== 'none') {
        const gameInfo = GameFeed.getGameById(currentGameId);
        if (gameInfo && gameInfo.module) {
          // Delega o evento para o manipulador unificado de teclado do jogo ativo
          if (typeof gameInfo.module.handleKeyInput === 'function') {
            gameInfo.module.handleKeyInput(e);
          }
        }
      }
    });
  }

  function openHelpModal() {
    const modal = document.getElementById('modal-help');
    if (modal) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      AudioEngine.speak('Janela de Ajuda de Acessibilidade e Atalhos aberta.');
    }
  }

  function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => {
      m.classList.remove('show');
      m.setAttribute('aria-hidden', 'true');
    });
  }

  return {
    init,
    launchGame,
    returnToFeed,
    showChampionshipView,
    showAEETeacherDashboard,
    showReferenceChart,
    getCurrentGameId,
    getCurrentLevel,
    setGameLevel,
    cycleTheme,
    toggleGlobalSpeech,
    refreshCurrentGame,
    openHelpModal,
    closeAllModals
  };
})();

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

