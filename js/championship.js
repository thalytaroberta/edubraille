/**
 * EduBraille Championship Engine
 * Gerencia a Categoria Campeonato: Cadastro do aluno (Nome, Apelido, Escola),
 * nivelamento automático progressivo (Fácil -> Médio -> Difícil -> Insano),
 * cálculo de pontuação com combos/streaks, e o Ranking Geral com Pódio visual.
 */

const Championship = (() => {
  const LEVELS = ['fácil', 'médio', 'difícil', 'insano'];
  const LEVEL_NAMES = {
    'fácil': '🟢 Fácil',
    'médio': '🟡 Médio',
    'difícil': '🔴 Difícil',
    'insano': '🔥 Insano'
  };

  const LEVEL_MULTIPLIERS = {
    'fácil': 1.0,
    'médio': 1.5,
    'difícil': 2.0,
    'insano': 3.0
  };

  // Perfil do aluno logado
  let student = {
    name: '',
    nickname: '',
    school: '',
    score: 0,
    currentLevel: 'fácil',
    unlockedLevels: ['fácil'],
    gamesPlayed: 0,
    victories: 0,
    currentStreak: 0,
    highestStreak: 0,
    history: []
  };

  // Ranking com participantes padrão + aluno local
  let leaderboardData = [
    { rank: 1, nickname: 'EstrelaBraille', school: 'Escola Municipal Paulo Freire', level: 'insano', score: 9850 },
    { rank: 2, nickname: 'SuperLuz', school: 'Instituto de Educação Especial', level: 'difícil', score: 8420 },
    { rank: 3, nickname: 'LedorMestre', school: 'Escola Estadual Monteiro Lobato', level: 'difícil', score: 7900 },
    { rank: 4, nickname: 'MestreDosPontos', school: 'Centro de AEE Girassol', level: 'médio', score: 5600 },
    { rank: 5, nickname: 'BraillistaPro', school: 'Colégio Dom Pedro II', level: 'médio', score: 4250 }
  ];

  function init() {
    loadStudent();
    loadLeaderboard();
  }

  function loadStudent() {
    try {
      const saved = localStorage.getItem('edubraille_championship_student');
      if (saved) {
        student = { ...student, ...JSON.parse(saved) };
      }
    } catch (e) {}
  }

  function saveStudent() {
    try {
      localStorage.setItem('edubraille_championship_student', JSON.stringify(student));
      updateLeaderboardWithStudent();
    } catch (e) {}
  }

  function loadLeaderboard() {
    try {
      const saved = localStorage.getItem('edubraille_championship_ranking');
      if (saved) {
        const custom = JSON.parse(saved);
        if (Array.isArray(custom) && custom.length > 0) {
          leaderboardData = custom;
        }
      }
    } catch (e) {}
    updateLeaderboardWithStudent();
  }

  function saveLeaderboard() {
    try {
      localStorage.setItem('edubraille_championship_ranking', JSON.stringify(leaderboardData));
    } catch (e) {}
  }

  function isRegistered() {
    return !!(student.nickname && student.name);
  }

  function registerStudent(name, nickname, school) {
    student.name = name.trim();
    student.nickname = nickname.trim();
    student.school = school.trim() || 'Escola não informada';
    student.score = student.score || 0;
    student.currentLevel = student.currentLevel || 'fácil';
    if (!student.unlockedLevels || student.unlockedLevels.length === 0) {
      student.unlockedLevels = ['fácil'];
    }

    saveStudent();
    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.speak(`Cadastro realizado com sucesso! Bem-vindo ao Campeonato, ${student.nickname}. Você iniciou no nível Fácil.`);
      AudioEngine.playWin();
    }
    renderChampionshipHub();
    return true;
  }

  /**
   * Registra o resultado de uma partida jogada no Campeonato
   */
  function recordMatchResult(gameName, won, correctItems = 1, totalItems = 1, responseTimeSec = 20) {
    if (!isRegistered()) return 0;

    student.gamesPlayed++;
    const mult = LEVEL_MULTIPLIERS[student.currentLevel] || 1.0;
    let matchScore = 0;

    if (won) {
      student.victories++;
      student.currentStreak++;
      if (student.currentStreak > student.highestStreak) {
        student.highestStreak = student.currentStreak;
      }

      // Cálculo de pontos: base + bônus de acertos + combo de vitória + multiplicador de nível
      const basePoints = 200;
      const accuracyBonus = Math.round((correctItems / totalItems) * 100);
      const streakBonus = Math.min(student.currentStreak * 25, 200);
      const speedBonus = Math.max(0, Math.round((60 - responseTimeSec) * 2));

      matchScore = Math.round((basePoints + accuracyBonus + streakBonus + speedBonus) * mult);
      student.score += matchScore;
    } else {
      student.currentStreak = 0;
      matchScore = Math.round(50 * mult);
      student.score += matchScore;
    }

    // Histórico de partida
    student.history.unshift({
      game: gameName,
      won,
      score: matchScore,
      level: student.currentLevel,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    if (student.history.length > 15) student.history.pop();

    // Checa evolução automática de nível
    checkLevelProgression();
    saveStudent();

    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.speakGameResult({
        gameName,
        score: matchScore,
        correctWords: correctItems,
        totalWords: totalItems,
        level: LEVEL_NAMES[student.currentLevel],
        won
      });
    }

    return matchScore;
  }

  /**
   * Critérios claros para evolução automática de nível:
   * Fácil -> Médio: 3 vitórias ou 400 pontos
   * Médio -> Difícil: 7 vitórias ou 1200 pontos
   * Difícil -> Insano: 15 vitórias ou 2500 pontos
   */
  function checkLevelProgression() {
    let unlockedNew = false;
    let oldLevel = student.currentLevel;

    if (!student.unlockedLevels.includes('médio') && (student.victories >= 3 || student.score >= 400)) {
      student.unlockedLevels.push('médio');
      student.currentLevel = 'médio';
      unlockedNew = 'médio';
    } else if (student.unlockedLevels.includes('médio') && !student.unlockedLevels.includes('difícil') && (student.victories >= 7 || student.score >= 1200)) {
      student.unlockedLevels.push('difícil');
      student.currentLevel = 'difícil';
      unlockedNew = 'difícil';
    } else if (student.unlockedLevels.includes('difícil') && !student.unlockedLevels.includes('insano') && (student.victories >= 15 || student.score >= 2500)) {
      student.unlockedLevels.push('insano');
      student.currentLevel = 'insano';
      unlockedNew = 'insano';
    }

    if (unlockedNew && typeof AudioEngine !== 'undefined') {
      setTimeout(() => {
        AudioEngine.playWin();
        AudioEngine.speak(`Sensacional! Você evoluiu no Campeonato e desbloqueou o nível ${LEVEL_NAMES[unlockedNew]}! Continue jogando para alcançar o topo do ranking!`);
      }, 1000);
    }
  }

  function updateLeaderboardWithStudent() {
    if (!student.nickname) return;

    // Remove registro antigo do aluno se já existia
    leaderboardData = leaderboardData.filter(item => item.nickname.toLowerCase() !== student.nickname.toLowerCase());

    // Insere perfil do aluno
    leaderboardData.push({
      nickname: student.nickname,
      school: student.school,
      level: student.currentLevel,
      score: student.score,
      isUser: true
    });

    // Ordena por pontuação decrescente
    leaderboardData.sort((a, b) => b.score - a.score);

    // Recalcula posições/ranks
    leaderboardData.forEach((item, index) => {
      item.rank = index + 1;
    });

    saveLeaderboard();
  }

  // ---------------------------------------------------------------
  // RENDERIZAÇÃO DA INTERFACE DO CAMPEONATO
  // ---------------------------------------------------------------
  function renderChampionshipHub() {
    const container = document.getElementById('championship-container');
    if (!container) return;

    if (!isRegistered()) {
      container.innerHTML = renderRegistrationFormHTML();
      return;
    }

    let levelBadgesHTML = renderLevelProgressionStatusHTML();
    let podiumHTML = renderPodiumHTML();
    let rankingTableHTML = renderLeaderboardTableHTML();

    container.innerHTML = `
      <div class="championship-wrapper">
        <!-- Banner Superior do Aluno Logado -->
        <div class="championship-header-card">
          <div class="student-profile-badge">
            <div class="avatar-circle">🏆</div>
            <div class="student-info">
              <h3>${student.nickname} <small>(${student.name})</small></h3>
              <p class="school-tag">🏫 ${student.school}</p>
            </div>
          </div>

          <div class="championship-stats-pills">
            <div class="pill-stat">
              <span class="lbl">Pontuação Total</span>
              <span class="val score-val">⭐ ${student.score.toLocaleString('pt-BR')} pts</span>
            </div>
            <div class="pill-stat">
              <span class="lbl">Nível Atual</span>
              <span class="val level-val">${LEVEL_NAMES[student.currentLevel]}</span>
            </div>
            <div class="pill-stat">
              <span class="lbl">Sequência (Combo)</span>
              <span class="val streak-val">🔥 ${student.currentStreak}x</span>
            </div>
          </div>
        </div>

        <!-- Indicador de Progressão Visual dos Níveis -->
        <div class="level-progression-box" role="region" aria-label="Progresso de Níveis do Campeonato">
          <h4>🚀 Seu Progresso no Campeonato</h4>
          <p class="text-muted">Todos os alunos iniciam no nível Fácil. Alcance vitórias e pontuação para desbloquear os próximos níveis!</p>
          ${levelBadgesHTML}
        </div>

        <!-- Pódio dos Líderes -->
        <div class="podium-section" role="region" aria-label="Pódio dos Líderes">
          <h4>🏆 Pódio do Campeonato</h4>
          ${podiumHTML}
        </div>

        <!-- Tabela Completa do Ranking -->
        <div class="ranking-section" role="region" aria-label="Tabela de Classificação do Ranking Geral">
          <div class="ranking-header-bar">
            <h4>📊 Ranking Geral dos Alunos</h4>
            <button type="button" class="btn btn-secondary" onclick="AudioEngine.speak('Ranking geral do Campeonato EduBraille. O líder atual é ${leaderboardData[0] ? leaderboardData[0].nickname : "ninguém"} com ${leaderboardData[0] ? leaderboardData[0].score : 0} pontos.')">
              🔊 Ouvir Líderes
            </button>
          </div>
          ${rankingTableHTML}
        </div>

        <!-- Jogos do Campeonato -->
        <div class="championship-games-section" style="margin-top: 2rem;">
          <h4>🎮 Entrar nos Jogos do Campeonato (Nível: ${LEVEL_NAMES[student.currentLevel]})</h4>
          <p class="text-muted">O nível de dificuldade do jogo será automaticamente ajustado para o seu nível atual (${student.currentLevel.toUpperCase()}).</p>
          
          <div class="championship-games-grid">
            ${renderChampionshipGamesGridHTML()}
          </div>
        </div>
      </div>
    `;
  }

  function renderRegistrationFormHTML() {
    return `
      <div class="registration-card-wrapper" role="region" aria-label="Cadastro do Aluno para o Campeonato">
        <div class="registration-card">
          <div class="reg-header">
            <span class="reg-icon">🏆</span>
            <h2>Bem-vindo ao Campeonato EduBraille!</h2>
            <p>Faça seu cadastro simples para participar, somar pontos, avançar de nível e competir no ranking da sua escola!</p>
          </div>

          <form id="form-student-registration" onsubmit="event.preventDefault(); Championship.handleRegistrationSubmit();">
            <div class="form-group">
              <label for="reg-name"><strong>Seu Nome Completo:</strong></label>
              <input type="text" id="reg-name" class="form-control" placeholder="Ex: Gabriel Souza" required aria-required="true">
              <small class="text-muted">Seu nome não será exibido publicamente no ranking.</small>
            </div>

            <div class="form-group">
              <label for="reg-nickname"><strong>Apelido / Nickname (usado no Ranking):</strong></label>
              <input type="text" id="reg-nickname" class="form-control" placeholder="Ex: GabrielPro01" required aria-required="true">
              <small class="text-muted">Este apelido aparecerá na tabela de líderes.</small>
            </div>

            <div class="form-group">
              <label for="reg-school"><strong>Nome da Sua Escola:</strong></label>
              <input type="text" id="reg-school" class="form-control" placeholder="Ex: Escola Municipal Paulo Freire" required aria-required="true">
            </div>

            <div class="reg-action-bar">
              <button type="submit" class="btn btn-primary btn-lg">🚀 Confirmar Cadastro e Entrar no Campeonato</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function handleRegistrationSubmit() {
    const nameEl = document.getElementById('reg-name');
    const nickEl = document.getElementById('reg-nickname');
    const schoolEl = document.getElementById('reg-school');

    if (nameEl && nickEl && schoolEl) {
      registerStudent(nameEl.value, nickEl.value, schoolEl.value);
    }
  }

  function renderLevelProgressionStatusHTML() {
    const all = ['fácil', 'médio', 'difícil', 'insano'];
    let html = '<div class="level-progress-steps">';

    all.forEach(lvl => {
      const isCurrent = student.currentLevel === lvl;
      const isUnlocked = student.unlockedLevels.includes(lvl);
      let statusIcon = '🔒';
      let statusClass = 'locked';

      if (isUnlocked) {
        statusIcon = '✅';
        statusClass = 'unlocked';
      }
      if (isCurrent) {
        statusIcon = '🟢';
        statusClass = 'current';
      }

      html += `
        <div class="level-step-card ${statusClass}">
          <span class="step-icon">${statusIcon}</span>
          <span class="step-name">${lvl.toUpperCase()}</span>
          <span class="step-desc">${isCurrent ? 'Nível Ativo' : (isUnlocked ? 'Desbloqueado' : 'Bloqueado')}</span>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  function renderPodiumHTML() {
    const top3 = leaderboardData.slice(0, 3);
    if (top3.length === 0) return '';

    const gold = top3[0] || { nickname: '-', score: 0, school: '-' };
    const silver = top3[1] || { nickname: '-', score: 0, school: '-' };
    const bronze = top3[2] || { nickname: '-', score: 0, school: '-' };

    return `
      <div class="podium-container">
        <!-- 2º Lugar (Prata) -->
        <div class="podium-step step-silver ${silver.isUser ? 'user-highlight' : ''}">
          <div class="podium-medal">🥈 2º</div>
          <div class="podium-nick">${silver.nickname}</div>
          <div class="podium-score">${silver.score.toLocaleString('pt-BR')} pts</div>
          <div class="podium-school">${silver.school}</div>
        </div>

        <!-- 1º Lugar (Ouro) -->
        <div class="podium-step step-gold ${gold.isUser ? 'user-highlight' : ''}">
          <div class="podium-crown">👑</div>
          <div class="podium-medal">🥇 1º Lugar</div>
          <div class="podium-nick">${gold.nickname}</div>
          <div class="podium-score">${gold.score.toLocaleString('pt-BR')} pts</div>
          <div class="podium-school">${gold.school}</div>
        </div>

        <!-- 3º Lugar (Bronze) -->
        <div class="podium-step step-bronze ${bronze.isUser ? 'user-highlight' : ''}">
          <div class="podium-medal">🥉 3º</div>
          <div class="podium-nick">${bronze.nickname}</div>
          <div class="podium-score">${bronze.score.toLocaleString('pt-BR')} pts</div>
          <div class="podium-school">${bronze.school}</div>
        </div>
      </div>
    `;
  }

  function renderLeaderboardTableHTML() {
    let rowsHTML = '';
    leaderboardData.forEach(item => {
      let medal = `#${item.rank}`;
      if (item.rank === 1) medal = '🥇 1º';
      if (item.rank === 2) medal = '🥈 2º';
      if (item.rank === 3) medal = '🥉 3º';

      rowsHTML += `
        <tr class="${item.isUser ? 'user-row-highlight' : ''}" tabindex="0" aria-label="Posição ${item.rank}, Jogador ${item.nickname}, Escola ${item.school}, Nível ${item.level}, Pontuação ${item.score}">
          <td class="col-rank"><strong>${medal}</strong></td>
          <td class="col-nick"><strong>${item.nickname}</strong> ${item.isUser ? '<span class="you-badge">(Você)</span>' : ''}</td>
          <td class="col-school">${item.school}</td>
          <td class="col-level"><span class="badge level-pill">${LEVEL_NAMES[item.level] || item.level}</span></td>
          <td class="col-score"><strong>${item.score.toLocaleString('pt-BR')} pts</strong></td>
        </tr>
      `;
    });

    return `
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
            ${rowsHTML}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderChampionshipGamesGridHTML() {
    if (!window.GameFeed || !window.GameFeed.GAMES_LIST) return '';

    let html = '';
    window.GameFeed.GAMES_LIST.forEach(game => {
      html += `
        <div class="championship-game-card">
          <span class="game-sym">${game.symbol}</span>
          <div class="game-info-col">
            <h5>${game.name}</h5>
            <p>${game.summary}</p>
          </div>
          <button type="button" class="btn btn-primary" onclick="Championship.launchChampionshipGame('${game.id}')">
            ⚡ Jogar no Nível ${student.currentLevel.toUpperCase()}
          </button>
        </div>
      `;
    });
    return html;
  }

  function launchChampionshipGame(gameId) {
    if (window.App && window.App.launchGame) {
      window.App.launchGame(gameId, student.currentLevel, 'aleatorio');
    }
  }

  /**
   * Renderiza a miniatura do Ranking para destaque na Página Inicial
   */
  function renderHomeRankingBanner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const top3 = leaderboardData.slice(0, 3);
    let topListHTML = '';
    top3.forEach(item => {
      let icon = item.rank === 1 ? '🥇' : (item.rank === 2 ? '🥈' : '🥉');
      topListHTML += `
        <div class="home-rank-item">
          <span class="rank-medal">${icon} ${item.rank}º</span>
          <span class="rank-nick"><strong>${item.nickname}</strong></span>
          <span class="rank-school">${item.school}</span>
          <span class="rank-pts">${item.score.toLocaleString('pt-BR')} pts</span>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="home-championship-banner">
        <div class="hcb-content">
          <div class="hcb-text">
            <span class="hcb-badge">🏆 CAMPEONATO EDUBRAILLE</span>
            <h2>Veja quem está liderando!</h2>
            <p><strong>Você consegue chegar ao 1º lugar?</strong> Entre no Campeonato, avance do nível Fácil ao Insano e conquiste posições no ranking!</p>
            
            <button type="button" class="btn btn-primary btn-lg" onclick="App.showChampionshipView()" aria-label="Participar do Campeonato EduBraille">
              🏆 ${isRegistered() ? 'Entrar no Campeonato' : 'Cadastrar e Jogar no Campeonato'}
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

  function getStudent() {
    return student;
  }

  function getCurrentLevel() {
    return student.currentLevel;
  }

  return {
    init,
    isRegistered,
    registerStudent,
    handleRegistrationSubmit,
    recordMatchResult,
    renderChampionshipHub,
    renderHomeRankingBanner,
    launchChampionshipGame,
    getStudent,
    getCurrentLevel
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  Championship.init();
});
