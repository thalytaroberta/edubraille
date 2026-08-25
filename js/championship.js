/**
 * EduBraille Championship Engine v2.0
 * Gerencia a Categoria Campeonato:
 * 1. Suporte a múltiplos perfis de alunos no mesmo computador (Escola)
 * 2. Fluxo "Minha Trajetória" como página inicial após login
 * 3. Escolha de jogos sem seleção manual de dificuldade (Controle automático)
 * 4. Sorteio automático de temas com aleatoriedade sem repetição imediata
 * 5. Sistema gamificado de Conquistas, Medalhas e Pódio
 * 6. Modal de Confirmação de Saída e Resultado da Partida
 */

const Championship = (() => {
  const LEVELS = ['fácil', 'médio', 'difícil', 'insano'];

  const LEVEL_NAMES = {
    'fácil': '🟢 Fácil',
    'médio': '🔵 Médio',
    'difícil': '🟠 Difícil',
    'insano': '🔴 Insano'
  };

  const LEVEL_NEXT = {
    'fácil': '🔵 Médio',
    'médio': '🟠 Difícil',
    'difícil': '🔴 Insano',
    'insano': '🏆 Nível Máximo'
  };

  const LEVEL_MULTIPLIERS = {
    'fácil': 1.0,
    'médio': 1.5,
    'difícil': 2.0,
    'insano': 3.0
  };

  // Mapeamento de nível do campeonato para o nível interno dos jogos
  const CHAMP_TO_GAME_LEVEL = {
    'fácil': 'iniciante',
    'médio': 'intermediario',
    'difícil': 'avancado',
    'insano': 'avancado' // avancado é o teto dos jogos; conteúdo mais difícil vem do tema insano
  };

  // Mapeamento de nível de jogo para chave do THEMATIC_DATABASES
  const CHAMP_TO_DB_LEVEL = {
    'fácil': 'iniciante',
    'médio': 'intermediario',
    'difícil': 'avancado',
    'insano': 'insano'
  };

  // Requisitos de pontuação ou vitórias para subir de nível
  const LEVEL_REQUIREMENTS = {
    'fácil': { next: 'médio', minScore: 400, minWins: 3 },
    'médio': { next: 'difícil', minScore: 1200, minWins: 7 },
    'difícil': { next: 'insano', minScore: 2500, minWins: 15 },
    'insano': { next: null, minScore: 99999, minWins: 999 }
  };

  // Definição das Conquistas Gamificadas
  const ACHIEVEMENTS_LIST = [
    { id: 'first_win', name: '🏅 Primeira Vitória', desc: 'Conclua sua primeira partida com sucesso!' },
    { id: 'fire_streak', name: '🔥 Sequência de Fogo', desc: 'Alcance 3 vitórias seguidas sem errar!' },
    { id: 'mind_master', name: '🧠 Mente Brilhante', desc: 'Vença um desafio no nível Difícil ou Insano!' },
    { id: 'level_up', name: '🚀 Subindo de Nível', desc: 'Desbloqueie um novo nível no Campeonato!' },
    { id: 'top_10', name: '🏆 No Top 10', desc: 'Entre nas 10 primeiras posições do ranking!' },
    { id: 'champion', name: '👑 Campeão', desc: 'Conquiste o 1º lugar do ranking geral!' },
    { id: 'precision', name: '🎯 Precisão Total', desc: 'Obtenha 100% de acertos em uma partida!' }
  ];

  // Banco de perfis locais salvos no computador (multiusuário na escola)
  let profiles = {};
  let activeStudentId = null;
  let activeSubView = 'trajectory'; // 'trajectory' | 'games' | 'ranking' | 'achievements' | 'who_is_playing'
  let currentActiveGameId = null;
  let _championshipModeActive = false; // flag pública lida pelo App.launchGame

  // Participantes padrão do Ranking Geral
  let leaderboardData = [
    { rank: 1, nickname: 'EstrelaBraille', school: 'Escola Municipal Paulo Freire', level: 'insano', score: 9850 },
    { rank: 2, nickname: 'SuperLuz', school: 'Instituto de Educação Especial', level: 'difícil', score: 8420 },
    { rank: 3, nickname: 'LedorMestre', school: 'Escola Estadual Monteiro Lobato', level: 'difícil', score: 7900 },
    { rank: 4, nickname: 'MestreDosPontos', school: 'Centro de AEE Girassol', level: 'médio', score: 5600 },
    { rank: 5, nickname: 'BraillistaPro', school: 'Colégio Dom Pedro II', level: 'médio', score: 4250 }
  ];

  function init() {
    loadAllProfiles();
    loadLeaderboard();
  }

  // ---------------------------------------------------------------
  // PERSISTÊNCIA E PERFIS MULTIUSUÁRIO
  // ---------------------------------------------------------------
  function loadAllProfiles() {
    try {
      const savedProfiles = localStorage.getItem('edubraille_championship_profiles_v2');
      if (savedProfiles) {
        profiles = JSON.parse(savedProfiles);
      }
      const savedActive = localStorage.getItem('edubraille_active_profile_id_v2');
      if (savedActive && profiles[savedActive]) {
        activeStudentId = savedActive;
      }
    } catch (e) {
      profiles = {};
      activeStudentId = null;
    }
  }

  function saveAllProfiles() {
    try {
      localStorage.setItem('edubraille_championship_profiles_v2', JSON.stringify(profiles));
      if (activeStudentId) {
        localStorage.setItem('edubraille_active_profile_id_v2', activeStudentId);
      } else {
        localStorage.removeItem('edubraille_active_profile_id_v2');
      }
      updateLeaderboardWithActiveStudent();
    } catch (e) {}
  }

  function loadLeaderboard() {
    try {
      const saved = localStorage.getItem('edubraille_championship_ranking_v2');
      if (saved) {
        const custom = JSON.parse(saved);
        if (Array.isArray(custom) && custom.length > 0) {
          leaderboardData = custom;
        }
      }
    } catch (e) {}
    updateLeaderboardWithActiveStudent();
  }

  function saveLeaderboard() {
    try {
      localStorage.setItem('edubraille_championship_ranking_v2', JSON.stringify(leaderboardData));
    } catch (e) {}
  }

  function getActiveStudent() {
    if (activeStudentId && profiles[activeStudentId]) {
      return profiles[activeStudentId];
    }
    return null;
  }

  function isLoggedIn() {
    return !!getActiveStudent();
  }

  // ---------------------------------------------------------------
  // GESTÃO DE CADASTRO / LOGIN / TROCA DE ALUNO
  // ---------------------------------------------------------------
  function registerStudent(name, nickname, school) {
    const cleanNick = nickname.trim();
    const cleanName = name.trim();
    const cleanSchool = school.trim() || 'Escola não informada';

    if (!cleanNick || !cleanName) return false;

    // Cria perfil do novo aluno
    const newStudent = {
      id: cleanNick.toLowerCase(),
      name: cleanName,
      nickname: cleanNick,
      school: cleanSchool,
      score: 0,
      currentLevel: 'fácil',
      unlockedLevels: ['fácil'],
      gamesPlayed: 0,
      victories: 0,
      currentStreak: 0,
      highestStreak: 0,
      achievements: [],
      history: []
    };

    profiles[newStudent.id] = newStudent;
    activeStudentId = newStudent.id;
    activeSubView = 'trajectory';
    saveAllProfiles();

    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.speak(`Cadastro realizado com sucesso! Bem-vindo ao Campeonato, ${cleanNick}. Sua trajetória começa no nível Fácil.`);
      AudioEngine.playWin();
    }

    renderChampionshipHub();
    return true;
  }

  function loginStudentByNickname(nickname) {
    const key = nickname.trim().toLowerCase();
    if (profiles[key]) {
      activeStudentId = key;
      activeSubView = 'trajectory';
      saveAllProfiles();
      if (typeof AudioEngine !== 'undefined') {
        AudioEngine.speak(`Bem-vindo de volta, ${profiles[key].nickname}! Carregando sua trajetória.`);
        AudioEngine.playClick();
      }
      renderChampionshipHub();
      return true;
    }
    return false;
  }

  function switchProfilePrompt() {
    openModalConfirmLogout();
  }

  function logoutActiveStudent() {
    activeStudentId = null;
    activeSubView = 'who_is_playing';
    try {
      localStorage.removeItem('edubraille_active_profile_id_v2');
    } catch (e) {}
    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.speak('Sessão encerrada com sucesso. Selecione ou crie um perfil para jogar.');
      AudioEngine.playClick();
    }
    renderChampionshipHub();
  }

  // ---------------------------------------------------------------
  // REGISTRO DE RESULTADOS & EVOLUÇÃO
  // ---------------------------------------------------------------
  function recordMatchResult(gameName, won, correctItems = 1, totalItems = 1, responseTimeSec = 20) {
    const student = getActiveStudent();
    if (!student) return 0;

    student.gamesPlayed++;
    const mult = LEVEL_MULTIPLIERS[student.currentLevel] || 1.0;
    let matchScore = 0;

    if (won) {
      student.victories++;
      student.currentStreak++;
      if (student.currentStreak > student.highestStreak) {
        student.highestStreak = student.currentStreak;
      }

      const basePoints = 200;
      const accuracyBonus = Math.round((correctItems / Math.max(totalItems, 1)) * 100);
      const streakBonus = Math.min(student.currentStreak * 25, 200);
      const speedBonus = Math.max(0, Math.round((60 - responseTimeSec) * 2));

      matchScore = Math.round((basePoints + accuracyBonus + streakBonus + speedBonus) * mult);
      student.score += matchScore;

      // Conquista: Primeira Vitória
      checkAndGrantAchievement(student, 'first_win');
      // Conquista: Sequência de Fogo
      if (student.currentStreak >= 3) {
        checkAndGrantAchievement(student, 'fire_streak');
      }
      // Conquista: Mente Brilhante
      if (student.currentLevel === 'difícil' || student.currentLevel === 'insano') {
        checkAndGrantAchievement(student, 'mind_master');
      }
      // Conquista: Precisão Total
      if (correctItems === totalItems && totalItems > 0) {
        checkAndGrantAchievement(student, 'precision');
      }
    } else {
      student.currentStreak = 0;
      matchScore = Math.round(40 * mult);
      student.score += matchScore;
    }

    // Registra no histórico
    student.history.unshift({
      game: gameName,
      won,
      score: matchScore,
      level: student.currentLevel,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    if (student.history.length > 15) student.history.pop();

    // Checa evolução de nível
    const levelUnlockedName = checkLevelProgression(student);

    saveAllProfiles();

    // Exibe o Modal de Resultado Celebrativo
    showMatchResultModal({
      gameName,
      won,
      matchScore,
      totalScore: student.score,
      correctItems,
      totalItems,
      levelUnlockedName
    });

    return matchScore;
  }

  function checkLevelProgression(student) {
    const req = LEVEL_REQUIREMENTS[student.currentLevel];
    if (!req || !req.next) return null;

    if (student.score >= req.minScore || student.victories >= req.minWins) {
      const newLevel = req.next;
      if (!student.unlockedLevels.includes(newLevel)) {
        student.unlockedLevels.push(newLevel);
      }
      student.currentLevel = newLevel;
      checkAndGrantAchievement(student, 'level_up');
      return newLevel;
    }
    return null;
  }

  function checkAndGrantAchievement(student, achId) {
    if (!student.achievements.includes(achId)) {
      student.achievements.push(achId);
      const achInfo = ACHIEVEMENTS_LIST.find(a => a.id === achId);
      if (achInfo && typeof AudioEngine !== 'undefined') {
        setTimeout(() => {
          AudioEngine.playWin();
          AudioEngine.speak(`Conquista desbloqueada! ${achInfo.name}. ${achInfo.desc}`);
        }, 1200);
      }
    }
  }

  function updateLeaderboardWithActiveStudent() {
    const student = getActiveStudent();
    if (!student) return;

    // Filtra duplicatas
    leaderboardData = leaderboardData.filter(item => item.nickname.toLowerCase() !== student.nickname.toLowerCase());

    leaderboardData.push({
      nickname: student.nickname,
      school: student.school,
      level: student.currentLevel,
      score: student.score,
      isUser: true
    });

    leaderboardData.sort((a, b) => b.score - a.score);

    leaderboardData.forEach((item, idx) => {
      item.rank = idx + 1;
      if (item.isUser) {
        if (item.rank <= 10) checkAndGrantAchievement(student, 'top_10');
        if (item.rank === 1) checkAndGrantAchievement(student, 'champion');
      }
    });

    saveLeaderboard();
  }

  // Cálculos de porcentagem para o próximo nível
  function getLevelProgressPct(student) {
    if (!student) return 0;
    const req = LEVEL_REQUIREMENTS[student.currentLevel];
    if (!req || !req.next) return 100; // Já no nível máximo

    let prevScoreTarget = 0;
    if (student.currentLevel === 'médio') prevScoreTarget = 400;
    if (student.currentLevel === 'difícil') prevScoreTarget = 1200;

    const currentDiff = Math.max(0, student.score - prevScoreTarget);
    const targetDiff = Math.max(1, req.minScore - prevScoreTarget);

    const pct = Math.min(100, Math.round((currentDiff / targetDiff) * 100));
    return pct;
  }

  // ---------------------------------------------------------------
  // RENDERIZAÇÃO CENTRAL DO HUB DO CAMPEONATO
  // ---------------------------------------------------------------
  function renderChampionshipHub() {
    const container = document.getElementById('championship-container');
    if (!container) return;

    if (!isLoggedIn()) {
      container.innerHTML = renderWhoIsPlayingHTML();
      return;
    }

    const student = getActiveStudent();

    // Roteamento interno de visões do Campeonato
    let subViewContentHTML = '';
    if (activeSubView === 'trajectory') {
      subViewContentHTML = renderMyTrajectoryHTML(student);
    } else if (activeSubView === 'games') {
      subViewContentHTML = renderGameSelectionHTML(student);
    } else if (activeSubView === 'ranking') {
      subViewContentHTML = renderLeaderboardSubViewHTML(student);
    } else if (activeSubView === 'achievements') {
      subViewContentHTML = renderAchievementsSubViewHTML(student);
    } else {
      subViewContentHTML = renderMyTrajectoryHTML(student);
    }

    container.innerHTML = `
      <div class="championship-wrapper">
        <!-- Barra de Topo do Aluno com Perfil e Botão Sair -->
        <header class="championship-top-bar" role="region" aria-label="Perfil do Aluno Ativo">
          <div class="user-profile-menu-wrap">
            <button type="button" class="btn btn-user-profile" onclick="Championship.toggleUserDropdownModal()" aria-label="Perfil de ${student.nickname}. Clique para ver opções do perfil ou trocar de aluno.">
              <span class="user-avatar-icon">👤</span>
              <span class="user-nick-text">${student.nickname}</span>
              <span class="dropdown-arrow">▼</span>
            </button>

            <!-- Dropdown do Perfil -->
            <div id="user-profile-dropdown" class="user-dropdown-menu" style="display: none;" role="menu">
              <button type="button" class="dropdown-item" onclick="Championship.setSubView('trajectory')" role="menuitem">
                🎮 Minha Trajetória
              </button>
              <button type="button" class="dropdown-item" onclick="Championship.setSubView('achievements')" role="menuitem">
                🏅 Minhas Conquistas (${student.achievements.length})
              </button>
              <button type="button" class="dropdown-item" onclick="Championship.setSubView('ranking')" role="menuitem">
                🏆 Ranking Geral
              </button>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item btn-logout-item" onclick="Championship.switchProfilePrompt()" role="menuitem">
                🚪 Sair / Trocar de Aluno
              </button>
            </div>
          </div>

          <div class="quick-action-header-btns">
            <button type="button" class="btn btn-secondary btn-sm" onclick="Championship.switchProfilePrompt()">
              🚪 Sair / Trocar Aluno
            </button>
          </div>
        </header>

        <!-- Conteúdo da Sub-visão Ativa -->
        <main class="championship-subview-content">
          ${subViewContentHTML}
        </main>
      </div>

      <!-- Modais Auxiliares -->
      <div id="modal-confirm-logout-container"></div>
      <div id="modal-match-result-container"></div>
      <div id="modal-confirm-exit-game-container"></div>
    `;
  }

  function setSubViewDirectly(viewName) {
    activeSubView = viewName;
  }

  function setSubView(viewName) {
    activeSubView = viewName;
    const dropdown = document.getElementById('user-profile-dropdown');
    if (dropdown) dropdown.style.display = 'none';

    // Se estivermos dentro da tela de jogo ativo (#game-section), chama App.showChampionshipView para alternar as seções no DOM
    const gameSec = document.getElementById('game-section');
    if (gameSec && gameSec.style.display !== 'none') {
      if (window.App && window.App.showChampionshipView) {
        window.App.showChampionshipView(viewName);
        return;
      }
    }

    renderChampionshipHub();

    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.playClick();
      if (viewName === 'trajectory') AudioEngine.speak('Você está na sua página Minha Trajetória.');
      if (viewName === 'games') AudioEngine.speak('Página Escolha Seu Jogo. A dificuldade é definida automaticamente.');
      if (viewName === 'ranking') AudioEngine.speak('Página de Ranking Geral dos Alunos.');
      if (viewName === 'achievements') AudioEngine.speak('Página de Minhas Conquistas e Medalhas.');
    }
  }

  function returnToTrajectory() {
    setSubView('trajectory');
  }

  function toggleUserDropdownModal() {
    const dropdown = document.getElementById('user-profile-dropdown');
    if (dropdown) {
      const isShown = dropdown.style.display === 'block';
      dropdown.style.display = isShown ? 'none' : 'block';
    }
  }

  // ---------------------------------------------------------------
  // VISÃO 1: TELA "QUEM VAI JOGAR?" (Login / Troca / Novo Cadastro)
  // ---------------------------------------------------------------
  function renderWhoIsPlayingHTML() {
    const profileKeys = Object.keys(profiles);
    let savedProfilesHTML = '';

    if (profileKeys.length > 0) {
      savedProfilesHTML = '<div class="saved-profiles-grid">';
      profileKeys.forEach(key => {
        const p = profiles[key];
        savedProfilesHTML += `
          <button type="button" class="profile-card-btn" onclick="Championship.loginStudentByNickname('${p.nickname}')" aria-label="Entrar como ${p.nickname}, Nível ${p.currentLevel}, Pontuação ${p.score} pontos">
            <span class="p-avatar">🎮</span>
            <span class="p-nick">${p.nickname}</span>
            <span class="p-school">🏫 ${p.school}</span>
            <span class="p-badge">${LEVEL_NAMES[p.currentLevel] || p.currentLevel}</span>
            <span class="p-score">⭐ ${p.score.toLocaleString('pt-BR')} pts</span>
          </button>
        `;
      });
      savedProfilesHTML += '</div>';
    }

    return `
      <div class="who-is-playing-container" role="region" aria-label="Quem vai jogar no Campeonato?">
        <div class="wip-card">
          <div class="wip-header">
            <span class="wip-icon">🎮</span>
            <h2>QUEM VAI JOGAR?</h2>
            <p>Selecione seu perfil já cadastrado ou crie um novo cadastro para iniciar sua trajetória no Campeonato!</p>
          </div>

          ${profileKeys.length > 0 ? `
            <div class="existing-students-section">
              <h3>👤 JÁ TENHO CADASTRO (Clique no seu perfil para entrar):</h3>
              ${savedProfilesHTML}
            </div>
            <div class="wip-divider"><span>OU</span></div>
          ` : ''}

          <div class="new-student-section">
            <h3>🆕 SOU NOVO AQUI:</h3>
            <p>Crie seu cadastro rápido (Nome, Apelido e Escola) para começar sua jornada:</p>
            
            <form id="form-new-student-reg" onsubmit="event.preventDefault(); Championship.handleNewRegSubmit();">
              <div class="form-group">
                <label for="wip-reg-name"><strong>Seu Nome Completo:</strong></label>
                <input type="text" id="wip-reg-name" class="form-control" placeholder="Ex: João Silva" required aria-required="true">
                <small class="text-muted">Seu nome completo não será exibido publicamente.</small>
              </div>

              <div class="form-group">
                <label for="wip-reg-nick"><strong>Seu Apelido / Nickname (usado no Ranking):</strong></label>
                <input type="text" id="wip-reg-nick" class="form-control" placeholder="Ex: JoaoBraille01" required aria-required="true">
              </div>

              <div class="form-group">
                <label for="wip-reg-school"><strong>Nome da Sua Escola:</strong></label>
                <input type="text" id="wip-reg-school" class="form-control" placeholder="Ex: Escola Municipal Paulo Freire" required aria-required="true">
              </div>

              <div class="wip-action-bar">
                <button type="submit" class="btn btn-primary btn-lg btn-block">🚀 CRIAR MEU CADASTRO E JOGAR</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function handleNewRegSubmit() {
    const nameEl = document.getElementById('wip-reg-name');
    const nickEl = document.getElementById('wip-reg-nick');
    const schoolEl = document.getElementById('wip-reg-school');

    if (nameEl && nickEl && schoolEl) {
      registerStudent(nameEl.value, nickEl.value, schoolEl.value);
    }
  }

  // ---------------------------------------------------------------
  // VISÃO 2: TELA "MINHA TRAJETÓRIA" (Página principal após Login)
  // ---------------------------------------------------------------
  function renderMyTrajectoryHTML(student) {
    const pct = getLevelProgressPct(student);
    const nextLevelName = LEVEL_NEXT[student.currentLevel] || '🏆 Nível Máximo';

    return `
      <div class="my-trajectory-container" role="region" aria-label="Minha Trajetória no Campeonato">
        <!-- Banner Principial de Boas-Vindas -->
        <div class="trajectory-hero-card">
          <div class="hero-header-text">
            <h2>Olá, ${student.nickname}! 👋</h2>
            <p>Pronto para continuar sua trajetória no Campeonato EduBraille?</p>
          </div>

          <div class="student-stats-overview-grid">
            <div class="stat-box">
              <span class="stat-lbl">🏆 Seu nível atual</span>
              <span class="stat-val level-highlight">${LEVEL_NAMES[student.currentLevel]}</span>
            </div>
            <div class="stat-box">
              <span class="stat-lbl">⭐ Pontuação Total</span>
              <span class="stat-val score-highlight">${student.score.toLocaleString('pt-BR')} pts</span>
            </div>
            <div class="stat-box">
              <span class="stat-lbl">🎯 Próximo nível</span>
              <span class="stat-val next-highlight">${nextLevelName}</span>
            </div>
          </div>

          <!-- BOTÃO PRINCIPAL EVIDENTE -->
          <div class="primary-launch-action">
            <button type="button" class="btn btn-primary btn-giant-launch" onclick="Championship.setSubView('games')" aria-label="Iniciar Agora Sua Trajetória no Campeonato">
              🚀 INICIAR AGORA SUA TRAJETÓRIA
            </button>
          </div>
        </div>

        <!-- Indicador de Progressão Visual dos Níveis -->
        <div class="trajectory-progress-card">
          <h3>📊 SUA TRAJETÓRIA NO CAMPEONATO</h3>
          <p class="text-muted">Avance de nível jogando qualquer um dos jogos do campeonato. A dificuldade ajusta-se automaticamente!</p>

          <div class="level-timeline-flex">
            ${renderTimelineStepsHTML(student)}
          </div>

          <!-- Barra de Progresso % para o próximo nível -->
          <div class="level-progress-bar-wrap" style="margin-top: 1.5rem;">
            <div class="level-progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <p class="pct-target-label"><strong>${pct}%</strong> para desbloquear o próximo nível (${nextLevelName})</p>
        </div>

        <!-- Opções Secundárias de Navegação -->
        <div class="trajectory-navigation-options">
          <button type="button" class="btn btn-secondary btn-nav-opt" onclick="Championship.setSubView('games')">
            🚀 CONTINUAR JOGANDO
          </button>
          <button type="button" class="btn btn-secondary btn-nav-opt" onclick="Championship.setSubView('ranking')">
            🏆 VER RANKING GERAL
          </button>
          <button type="button" class="btn btn-secondary btn-nav-opt" onclick="Championship.setSubView('achievements')">
            🏅 MINHAS CONQUISTAS (${student.achievements.length})
          </button>
        </div>
      </div>
    `;
  }

  function renderTimelineStepsHTML(student) {
    const allLevels = ['fácil', 'médio', 'difícil', 'insano'];
    let html = '';

    allLevels.forEach((lvl, idx) => {
      const isCurrent = student.currentLevel === lvl;
      const isUnlocked = student.unlockedLevels.includes(lvl);

      let statusBadge = '🔒 Bloqueado';
      let icon = '🔒';
      let cardClass = 'step-locked';

      if (isUnlocked) {
        statusBadge = '✅ Concluído';
        icon = '✅';
        cardClass = 'step-unlocked';
      }
      if (isCurrent) {
        statusBadge = '🟢 Nível Ativo';
        icon = '🎯';
        cardClass = 'step-current';
      }

      html += `
        <div class="timeline-step-item ${cardClass}">
          <div class="step-icon-circle">${icon}</div>
          <div class="step-title">${lvl.toUpperCase()}</div>
          <div class="step-status">${statusBadge}</div>
        </div>
      `;

      if (idx < allLevels.length - 1) {
        html += `<div class="timeline-arrow">↓</div>`;
      }
    });

    return html;
  }

  // ---------------------------------------------------------------
  // VISÃO 3: TELA "ESCOLHA SEU JOGO" (Sem Seleção de Dificuldade)
  // ---------------------------------------------------------------
  function renderGameSelectionHTML(student) {
    const feed = window.GameFeed || (typeof GameFeed !== 'undefined' ? GameFeed : null);
    const gamesList = (feed && feed.GAMES_LIST) ? feed.GAMES_LIST : [];

    if (!gamesList || gamesList.length === 0) {
      return `
        <div class="game-selection-container" role="region" aria-label="Escolha Seu Jogo do Campeonato">
          <div class="gs-header-banner">
            <h2>🎮 ESCOLHA SEU JOGO DO CAMPEONATO</h2>
            <p>Carregando catálogo de jogos da trajetória...</p>
          </div>
        </div>
      `;
    }

    let gamesGridHTML = '';
    gamesList.forEach(game => {
      gamesGridHTML += `
        <div class="championship-game-select-card">
          <div class="cg-icon">${game.symbol}</div>
          <div class="cg-info">
            <h4>${game.name}</h4>
            <p>${game.summary}</p>
            <div class="cg-level-pill" style="margin-top: 0.6rem; font-size: 0.9rem;">
              <span class="badge" style="background: var(--primary-light); color: var(--primary); font-weight: 800; padding: 0.3rem 0.6rem; border-radius: 8px;">
                🎯 Nível Gradual: ${LEVEL_NAMES[student.currentLevel] || student.currentLevel}
              </span>
            </div>
          </div>
          <div class="cg-action">
            <button type="button" class="btn btn-primary btn-play-champ" onclick="Championship.launchGameFromTrajectory('${game.id}')" aria-label="Jogar ${game.name} no nível gradual ${student.currentLevel}">
              🎮 JOGAR AGORA
            </button>
          </div>
        </div>
      `;
    });

    return `
      <div class="game-selection-container" role="region" aria-label="Escolha Seu Jogo do Campeonato">
        <div class="gs-header-banner">
          <h2>🎮 JOGOS DA SUA TRAJETÓRIA</h2>
          <p>Seu nível atual no Campeonato é <strong>${LEVEL_NAMES[student.currentLevel]}</strong>. O nível de dificuldade e o tema das palavras são definidos automaticamente pelo sistema de progressão gradual (sem seleção manual de nível ou assunto). Divirta-se e acumule pontos para o Ranking!</p>
          <div style="margin-top: 0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="Championship.setSubView('trajectory')">
              ← VOLTAR PARA MINHA TRAJETÓRIA
            </button>
          </div>
        </div>

        <div class="champ-games-list-grid">
          ${gamesGridHTML}
        </div>
      </div>
    `;
  }

  function launchGameFromTrajectory(gameId) {
    const student = getActiveStudent();
    if (!student) return;

    currentActiveGameId = gameId;

    // Converte nível do campeonato para nível interno dos jogos
    const gameLevel = CHAMP_TO_GAME_LEVEL[student.currentLevel] || 'iniciante';
    // Nível para busca no banco de temas (pode ser 'insano')
    const themeDbLevel = CHAMP_TO_DB_LEVEL[student.currentLevel] || 'iniciante';

    // Seta flag ANTES de chamar launchGame (o App checa isso para definir isChampionshipMode)
    _championshipModeActive = true;

    if (window.App && window.App.launchGame) {
      // Passa o gameLevel para o init do jogo e 'aleatorio' para sorteio de tema
      window.App.launchGame(gameId, gameLevel, 'aleatorio', themeDbLevel);
    }
  }

  function isChampionshipModeActive() {
    return _championshipModeActive;
  }

  function clearChampionshipModeFlag() {
    _championshipModeActive = false;
  }

  // Retorna o nível de jogo (iniciante/intermediario/avancado) com base no nível do campeonato do aluno ativo
  function getGameLevel() {
    const student = getActiveStudent();
    if (!student) return 'iniciante';
    return CHAMP_TO_GAME_LEVEL[student.currentLevel] || 'iniciante';
  }

  // ---------------------------------------------------------------
  // VISÃO 4: RANKING GERAL (Sub-visão secundária)
  // ---------------------------------------------------------------
  function renderLeaderboardSubViewHTML(student) {
    const top3 = leaderboardData.slice(0, 3);
    const gold = top3[0] || { nickname: '-', score: 0, school: '-' };
    const silver = top3[1] || { nickname: '-', score: 0, school: '-' };
    const bronze = top3[2] || { nickname: '-', score: 0, school: '-' };

    let tableRowsHTML = '';
    leaderboardData.forEach(item => {
      let medal = `#${item.rank}`;
      if (item.rank === 1) medal = '🥇 1º';
      if (item.rank === 2) medal = '🥈 2º';
      if (item.rank === 3) medal = '🥉 3º';

      tableRowsHTML += `
        <tr class="${item.isUser ? 'user-row-highlight' : ''}">
          <td><strong>${medal}</strong></td>
          <td><strong>${item.nickname}</strong> ${item.isUser ? '<span class="you-tag">(Você)</span>' : ''}</td>
          <td>${item.school}</td>
          <td><span class="badge">${LEVEL_NAMES[item.level] || item.level}</span></td>
          <td><strong>${item.score.toLocaleString('pt-BR')} pts</strong></td>
        </tr>
      `;
    });

    return `
      <div class="leaderboard-subview-container" role="region" aria-label="Ranking Geral do Campeonato">
        <div class="lb-header">
          <h2>🏆 RANKING GERAL DOS ALUNOS</h2>
          <button type="button" class="btn btn-secondary" onclick="Championship.setSubView('trajectory')">
            ← VOLTAR PARA MINHA TRAJETÓRIA
          </button>
        </div>

        <!-- Pódio -->
        <div class="podium-flex-wrap">
          <div class="podium-card silver">
            <div class="p-medal">🥈 2º Lugar</div>
            <div class="p-nick">${silver.nickname}</div>
            <div class="p-pts">${silver.score.toLocaleString('pt-BR')} pts</div>
          </div>
          <div class="podium-card gold">
            <div class="p-crown">👑</div>
            <div class="p-medal">🥇 1º Lugar</div>
            <div class="p-nick">${gold.nickname}</div>
            <div class="p-pts">${gold.score.toLocaleString('pt-BR')} pts</div>
          </div>
          <div class="podium-card bronze">
            <div class="p-medal">🥉 3º Lugar</div>
            <div class="p-nick">${bronze.nickname}</div>
            <div class="p-pts">${bronze.score.toLocaleString('pt-BR')} pts</div>
          </div>
        </div>

        <!-- Tabela -->
        <div class="table-responsive">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Escola</th>
                <th>Nível</th>
                <th>Pontuação</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHTML}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------
  // VISÃO 5: MINHAS CONQUISTAS E MEDALHAS
  // ---------------------------------------------------------------
  function renderAchievementsSubViewHTML(student) {
    let gridHTML = '';
    ACHIEVEMENTS_LIST.forEach(ach => {
      const isUnlocked = student.achievements.includes(ach.id);
      gridHTML += `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <span class="ach-status-icon">${isUnlocked ? '✅' : '🔒'}</span>
          <h4 class="ach-name">${ach.name}</h4>
          <p class="ach-desc">${ach.desc}</p>
          <span class="ach-badge-tag">${isUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO'}</span>
        </div>
      `;
    });

    return `
      <div class="achievements-subview-container" role="region" aria-label="Minhas Conquistas">
        <div class="ach-header">
          <h2>🏅 MINHAS CONQUISTAS E MEDALHAS</h2>
          <p>Você desbloqueou <strong>${student.achievements.length} de ${ACHIEVEMENTS_LIST.length}</strong> conquistas no Campeonato!</p>
          <button type="button" class="btn btn-secondary" onclick="Championship.setSubView('trajectory')">
            ← VOLTAR PARA MINHA TRAJETÓRIA
          </button>
        </div>

        <div class="achievements-grid">
          ${gridHTML}
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------
  // MODAIS: RESULTADO DA PARTIDA & CONFIRMAÇÃO DE SAÍDA
  // ---------------------------------------------------------------
  function showMatchResultModal(result) {
    const student = getActiveStudent();
    if (!student) return;

    const pct = getLevelProgressPct(student);

    const modalContainer = document.getElementById('modal-match-result-container');
    if (!modalContainer) return;

    let unlockHTML = '';
    if (result.levelUnlockedName) {
      unlockHTML = `
        <div class="level-up-celebration-box">
          <h3>🚀 NOVO NÍVEL DESBLOQUEADO!</h3>
          <p>Parabéns! Você avançou e chegou ao nível <strong>${LEVEL_NAMES[result.levelUnlockedName]}</strong>!</p>
        </div>
      `;
    }

    modalContainer.innerHTML = `
      <div class="modal show" role="dialog" aria-modal="true" aria-labelledby="match-result-title">
        <div class="modal-content match-result-modal-content">
          <h2 id="match-result-title">🎉 PARTIDA CONCLUÍDA!</h2>
          <p class="game-played-name">Jogo: <strong>${result.gameName}</strong></p>

          <div class="match-metrics-card">
            <p>Você acertou <strong>${result.correctItems} de ${result.totalItems}</strong>!</p>
            <div class="metric-row"><span>⭐ Pontuação conquistada:</span><strong>+${result.matchScore} pts</strong></div>
            <div class="metric-row"><span>🏆 Pontuação total:</span><strong>${result.totalScore.toLocaleString('pt-BR')} pts</strong></div>
            <div class="metric-row"><span>📈 Progresso para o próximo nível:</span><strong>${pct}%</strong></div>
          </div>

          ${unlockHTML}

          <div class="match-result-actions">
            <button type="button" class="btn btn-primary" onclick="Championship.closeMatchResultModal(); Championship.launchGameFromTrajectory('${currentActiveGameId || "hangman"}')">
              🎮 JOGAR NOVAMENTE
            </button>
            <button type="button" class="btn btn-secondary" onclick="Championship.closeMatchResultModal(); Championship.setSubView('trajectory')">
              🏠 MINHA TRAJETÓRIA
            </button>
            <button type="button" class="btn btn-secondary" onclick="Championship.closeMatchResultModal(); Championship.setSubView('ranking')">
              🏆 VER RANKING
            </button>
          </div>
        </div>
      </div>
    `;

    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.playWin();
    }
  }

  function closeMatchResultModal() {
    const modalContainer = document.getElementById('modal-match-result-container');
    if (modalContainer) modalContainer.innerHTML = '';
  }

  function openModalConfirmLogout() {
    const modalContainer = document.getElementById('modal-confirm-logout-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal show" role="dialog" aria-modal="true" aria-labelledby="confirm-logout-title">
        <div class="modal-content">
          <h2 id="confirm-logout-title">🚪 Deseja sair deste perfil?</h2>
          <p style="margin-top: 0.75rem;">Seu progresso salvo continuará disponível quando você entrar novamente neste computador.</p>

          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
            <button type="button" class="btn btn-secondary" onclick="Championship.closeConfirmLogoutModal()">CANCELAR</button>
            <button type="button" class="btn btn-danger" onclick="Championship.closeConfirmLogoutModal(); Championship.logoutActiveStudent();">SAIR E TROCAR DE ALUNO</button>
          </div>
        </div>
      </div>
    `;
  }

  function closeConfirmLogoutModal() {
    const modalContainer = document.getElementById('modal-confirm-logout-container');
    if (modalContainer) modalContainer.innerHTML = '';
  }

  function openModalConfirmExitGame() {
    const modalContainer = document.getElementById('modal-confirm-exit-game-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal show" role="dialog" aria-modal="true" aria-labelledby="confirm-exit-title">
        <div class="modal-content">
          <h2 id="confirm-exit-title">⚠️ Tem certeza que deseja sair desta partida?</h2>
          <p style="margin-top: 0.75rem;">Seu progresso desta partida poderá ser perdido.</p>

          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
            <button type="button" class="btn btn-primary" onclick="Championship.closeConfirmExitGameModal()">CONTINUAR JOGANDO</button>
            <button type="button" class="btn btn-danger" onclick="Championship.closeConfirmExitGameModal(); Championship.returnToTrajectory();">SAIR E VOLTAR À TRAJETÓRIA</button>
          </div>
        </div>
      </div>
    `;
  }

  function closeConfirmExitGameModal() {
    const modalContainer = document.getElementById('modal-confirm-exit-game-container');
    if (modalContainer) modalContainer.innerHTML = '';
  }

  // Miniatura do Banner do Campeonato para a Página Inicial
  function renderHomeRankingBanner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const student = getActiveStudent();
    const top3 = leaderboardData.slice(0, 3);
    let topListHTML = '';
    top3.forEach(item => {
      let icon = item.rank === 1 ? '🥇' : (item.rank === 2 ? '🥈' : '🥉');
      topListHTML += `
        <div class="home-rank-item">
          <span class="rank-medal">${icon} ${item.rank}º</span>
          <span class="rank-nick"><strong>${item.nickname}</strong></span>
          <span class="rank-pts">${item.score.toLocaleString('pt-BR')} pts</span>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="home-championship-banner">
        <div class="hcb-content">
          <div class="hcb-text">
            <span class="hcb-badge">🏆 CAMPEONATO EDUBRAILLE</span>
            <h2>Sua Trajetória Gamificada no Campeonato!</h2>
            <p>Alunos aprendem e progridem automaticamente do nível <strong>Fácil ao Insano</strong> sem complicação!</p>
            
            <button type="button" class="btn btn-primary btn-lg" onclick="App.showChampionshipView()" aria-label="Entrar na Categoria Campeonato">
              🚀 ${student ? 'CONTINUAR MINHA TRAJETÓRIA' : 'ENTRAR / CADASTRAR NO CAMPEONATO'}
            </button>
          </div>

          <div class="hcb-leaderboard-preview">
            <h3>Líderes Atuais</h3>
            ${topListHTML}
          </div>
        </div>
      </div>
    `;
  }

  return {
    init,
    isLoggedIn,
    getActiveStudent,
    registerStudent,
    loginStudentByNickname,
    logoutActiveStudent,
    switchProfilePrompt,
    recordMatchResult,
    renderChampionshipHub,
    renderHomeRankingBanner,
    setSubView,
    setSubViewDirectly,
    returnToTrajectory,
    toggleUserDropdownModal,
    handleNewRegSubmit,
    launchGameFromTrajectory,
    isChampionshipModeActive,
    clearChampionshipModeFlag,
    getGameLevel,
    openModalConfirmLogout,
    closeConfirmLogoutModal,
    openModalConfirmExitGame,
    closeConfirmExitGameModal,
    closeMatchResultModal
  };
})();

window.Championship = Championship;

document.addEventListener('DOMContentLoaded', () => {
  Championship.init();
});

