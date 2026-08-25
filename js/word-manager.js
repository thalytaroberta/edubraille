/**
 * EduBraille Word & Content Manager
 * Gerencia o sorteio aleatório de palavras e conteúdos, impedindo repetição
 * imediata e garantindo a rotação completa do banco antes de reiniciar.
 */

const WordManager = (() => {
  // Histórico temporário de palavras já utilizadas nesta sessão por categoria e nível
  let usedWordsMap = {};

  function init() {
    loadUsedWords();
  }

  function loadUsedWords() {
    try {
      const saved = sessionStorage.getItem('edubraille_used_words');
      if (saved) {
        usedWordsMap = JSON.parse(saved);
      }
    } catch (e) {
      usedWordsMap = {};
    }
  }

  function saveUsedWords() {
    try {
      sessionStorage.setItem('edubraille_used_words', JSON.stringify(usedWordsMap));
    } catch (e) {}
  }

  /**
   * Função Fisher-Yates para embaralhar arrays de forma estocástica e justa.
   */
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Obtém uma palavra/item aleatório sem repetição imediata para o tema e nível informados.
   * @param {string} theme - Tema selecionado (ex: 'animais', 'musica', 'aleatorio')
   * @param {string} level - Nível ('iniciante', 'intermediario', 'avancado', 'insano')
   * @returns {Object} Objeto contendo { word, hint, ... }
   */
  function getRandomWord(theme = 'aleatorio', level = 'iniciante') {
    // Normalização de nomes de níveis (Fácil -> iniciante, Médio -> intermediario, etc.)
    const normalizedLevel = normalizeLevel(level);

    // Obtém todas as palavras disponíveis no banco para a combinação solicitada
    let pool = [];
    if (typeof getWordsByThemeAndLevel === 'function') {
      pool = getWordsByThemeAndLevel(theme, normalizedLevel);
    } else if (window.THEMATIC_DATABASES) {
      pool = fetchPoolFromThematic(theme, normalizedLevel);
    }

    if (!pool || pool.length === 0) {
      return { word: 'BRAILLE', hint: 'Sistema de escrita tátil para pessoas cegas' };
    }

    // Inclui palavras customizadas cadastradas pelo professor de AEE se houver
    if (window.TeacherMode && typeof window.TeacherMode.getCustomWords === 'function') {
      const customWords = window.TeacherMode.getCustomWords();
      if (customWords && customWords.length > 0) {
        pool = pool.concat(customWords);
      }
    }

    const key = `${theme}_${normalizedLevel}`;
    if (!usedWordsMap[key]) {
      usedWordsMap[key] = [];
    }

    // Filtra palavras que ainda NÃO foram apresentadas
    const unusedPool = pool.filter(item => {
      const wordKey = item.word || item.problem || item.name;
      return !usedWordsMap[key].includes(wordKey);
    });

    let selectedItem = null;

    if (unusedPool.length > 0) {
      // Sorteia aleatoriamente entre as palavras não utilizadas
      const randomIndex = Math.floor(Math.random() * unusedPool.length);
      selectedItem = unusedPool[randomIndex];
    } else {
      // Se todo o banco foi utilizado, limpa o histórico da chave e reinicia com ordem embaralhada
      usedWordsMap[key] = [];
      const shuffled = shuffleArray(pool);
      selectedItem = shuffled[0];
    }

    // Registra a palavra sorteada no histórico temporário
    const chosenWordKey = selectedItem.word || selectedItem.problem || selectedItem.name;
    usedWordsMap[key].push(chosenWordKey);
    saveUsedWords();

    return selectedItem;
  }

  /**
   * Mapeia rótulos de nível (fácil/iniciante, médio/intermediario, difícil/avancado, insano)
   */
  function normalizeLevel(level) {
    if (!level) return 'iniciante';
    const l = level.toLowerCase().trim();
    if (l === 'fácil' || l === 'facil' || l === 'iniciante' || l === '1') return 'iniciante';
    if (l === 'médio' || l === 'medio' || l === 'intermediario' || l === '2') return 'intermediario';
    if (l === 'difícil' || l === 'dificil' || l === 'avancado' || l === '3') return 'avancado';
    if (l === 'insano' || l === '4') return 'insano';
    return 'iniciante';
  }

  function fetchPoolFromThematic(theme, level) {
    const tData = window.THEMATIC_DATABASES;
    if (!tData) return [];
    let keys = [theme];
    if (theme === 'aleatorio' || !tData[theme]) {
      keys = Object.keys(tData);
    }
    let list = [];
    keys.forEach(k => {
      if (tData[k] && tData[k][level]) {
        list = list.concat(tData[k][level]);
      }
    });
    return list;
  }

  function resetHistory() {
    usedWordsMap = {};
    saveUsedWords();
  }

  return {
    init,
    getRandomWord,
    normalizeLevel,
    resetHistory
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  WordManager.init();
});
