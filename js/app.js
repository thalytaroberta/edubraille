/**
 * EduBraille Main Application Controller
 */

const App = (() => {
  let currentGameId = null;
  let currentLevel = 'iniciante';
  let currentThemeCategory = 'aleatorio';
  let currentThemeIndex = 0;

  const THEMES = ['theme-default', 'theme-dark', 'theme-high-contrast-yellow', 'theme-high-contrast-cyan'];
  const THEME_NAMES = ['Claro Padrão', 'Escuro', 'Alto Contraste Amarelo', 'Alto Contraste Ciano'];

  function init() {
    TeacherMode.init();
    GameFeed.renderFeed('game-feed-container');
    TeacherMode.renderReferenceChart('braille-reference-container');
    TeacherMode.renderStatsDashboard();

    setupKeyboardShortcuts();
    setupEventListeners();

    AudioEngine.speak('Bem-vindo ao EduBraille Games! Plataforma de jogos acessíveis em Tinta e Braille. Escolha um tema de palavras ou selecione um nível para começar.');
  }

  function launchGame(gameId, level, themeCategory) {
    const gameInfo = GameFeed.getGameById(gameId);
    if (!gameInfo) return;

    currentGameId = gameId;
    if (level) currentLevel = level;
    if (themeCategory) currentThemeCategory = themeCategory;

    // Atualiza palavras do banco com base no tema e nível selecionados
    if (window.GAME_DATABASES && window.getWordsByThemeAndLevel) {
      window.GAME_DATABASES.words = {
        iniciante: getWordsByThemeAndLevel(currentThemeCategory, 'iniciante'),
        intermediario: getWordsByThemeAndLevel(currentThemeCategory, 'intermediario'),
        avancado: getWordsByThemeAndLevel(currentThemeCategory, 'avancado')
      };
    }

    document.getElementById('feed-section').style.display = 'none';
    document.getElementById('teacher-section').style.display = 'none';
    document.getElementById('reference-section').style.display = 'none';
    
    const gameSection = document.getElementById('game-section');
    gameSection.style.display = 'block';
    gameSection.scrollIntoView({ behavior: 'smooth' });

    if (gameInfo.module && gameInfo.module.init) {
      gameInfo.module.init(currentLevel);
    }

    AudioEngine.playClick();
  }

  function returnToFeed() {
    currentGameId = null;
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('teacher-section').style.display = 'none';
    document.getElementById('reference-section').style.display = 'none';
    
    const feedSection = document.getElementById('feed-section');
    feedSection.style.display = 'block';
    GameFeed.renderFeed('game-feed-container');
    feedSection.scrollIntoView({ behavior: 'smooth' });

    AudioEngine.playClick();
    AudioEngine.speak('Retornado ao Feed de Jogos.');
  }

  function showTeacherDashboard() {
    document.getElementById('feed-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('reference-section').style.display = 'none';
    
    const section = document.getElementById('teacher-section');
    section.style.display = 'block';
    TeacherMode.renderStatsDashboard();
    section.scrollIntoView({ behavior: 'smooth' });

    AudioEngine.speak('Painel do Professor aberto.');
  }

  function showReferenceChart() {
    document.getElementById('feed-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('teacher-section').style.display = 'none';

    const section = document.getElementById('reference-section');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });

    AudioEngine.speak('Tabela de Referência Braille aberta.');
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

  function refreshCurrentGame() {
    if (currentGameId) {
      const gameInfo = GameFeed.getGameById(currentGameId);
      if (gameInfo && gameInfo.module && gameInfo.module.render) {
        gameInfo.module.render();
      }
    }
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            TeacherMode.toggleTeacherMode();
            break;
          case 't':
            e.preventDefault();
            cycleTheme();
            break;
          case 's':
            e.preventDefault();
            const state = AudioEngine.toggleTTS();
            AudioEngine.speak(state ? 'Voz ativada' : 'Voz desativada');
            break;
          case 'f':
            e.preventDefault();
            returnToFeed();
            break;
          case 'h':
            e.preventDefault();
            openHelpModal();
            break;
        }
      }

      if (e.key === 'Escape') {
        closeAllModals();
        if (currentGameId) returnToFeed();
      }
    });
  }

  function setupEventListeners() {
    const customWordForm = document.getElementById('form-custom-word');
    if (customWordForm) {
      customWordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wordInput = document.getElementById('input-custom-word');
        const hintInput = document.getElementById('input-custom-hint');
        if (wordInput && hintInput) {
          const success = TeacherMode.addCustomWord(wordInput.value, hintInput.value);
          if (success) {
            wordInput.value = '';
            hintInput.value = '';
          }
        }
      });
    }
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
    showTeacherDashboard,
    showReferenceChart,
    getCurrentLevel,
    setGameLevel,
    cycleTheme,
    refreshCurrentGame,
    openHelpModal,
    closeAllModals
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
