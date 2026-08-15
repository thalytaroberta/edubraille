/**
 * EduBraille Teacher Mode & Dashboard ("Modo Professor / AEE")
 * Gerencia o modo de instrução simultânea (tinta + braille), relatórios de progresso
 * e tabela de referência acessível.
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
    }
    
    if (badge) {
      badge.style.display = isTeacherMode ? 'inline-flex' : 'none';
    }

    const msg = isTeacherMode 
      ? 'Modo Professor ativado! As letras em tinta e braille agora são exibidas lado a lado com assistência didática.' 
      : 'Modo Professor desativado.';

    AudioEngine.speak(msg);
    AudioEngine.playClick();

    // Notifica os jogos ativos para renderizar assistências didáticas
    if (window.App && window.App.refreshCurrentGame) {
      window.App.refreshCurrentGame();
    }

    return isTeacherMode;
  }

  function isActive() {
    return isTeacherMode;
  }

  // Registra progresso do aluno
  function recordGameResult(gameName, won, details = '') {
    studentStats.gamesPlayed++;
    if (won) studentStats.wins++;
    studentStats.history.unshift({
      game: gameName,
      won: won,
      details: details,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    // Limita o histórico a 20 registros
    if (studentStats.history.length > 20) {
      studentStats.history.pop();
    }
    saveStats();
    renderStatsDashboard();
  }

  function saveStats() {
    try {
      localStorage.setItem('edubraille_stats', JSON.stringify(studentStats));
    } catch (e) {}
  }

  function loadStats() {
    try {
      const saved = localStorage.getItem('edubraille_stats');
      if (saved) {
        studentStats = JSON.parse(saved);
      }
    } catch (e) {}
  }

  function loadCustomWords() {
    try {
      const saved = localStorage.getItem('edubraille_custom_words');
      if (saved) {
        customWordBank = JSON.parse(saved);
      }
    } catch (e) {}
  }

  function addCustomWord(word, hint, level = 'iniciante') {
    const cleanWord = word.trim().toUpperCase();
    if (!cleanWord) return false;
    
    customWordBank.push({ word: cleanWord, hint: hint || 'Palavra personalizada do professor', level });
    try {
      localStorage.setItem('edubraille_custom_words', JSON.stringify(customWordBank));
    } catch (e) {}

    AudioEngine.speak(`Palavra ${cleanWord} adicionada ao banco do professor!`);
    return true;
  }

  function renderStatsDashboard() {
    const container = document.getElementById('teacher-stats-container');
    if (!container) return;

    const winRate = studentStats.gamesPlayed > 0 
      ? Math.round((studentStats.wins / studentStats.gamesPlayed) * 100) 
      : 0;

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

  // Renderiza a Tabela Completa de Referência Braille
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
      if (!q || char.includes(q)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  return {
    init,
    toggleTeacherMode,
    isActive,
    recordGameResult,
    addCustomWord,
    renderStatsDashboard,
    renderReferenceChart,
    filterReferenceChart
  };
})();
