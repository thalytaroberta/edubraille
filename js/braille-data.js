/**
 * EduBraille Data & Translation Engine
 * Mapeamento oficial de caracteres em Braille (Português)
 */

const BRAILLE_MAP = {
  // Letras Maiúsculas / Minúsculas Padrão
  'A': { dots: [1], name: 'A', desc: 'ponto 1' },
  'B': { dots: [1, 2], name: 'B', desc: 'pontos 1 e 2' },
  'C': { dots: [1, 4], name: 'C', desc: 'pontos 1 e 4' },
  'D': { dots: [1, 4, 5], name: 'D', desc: 'pontos 1, 4 e 5' },
  'E': { dots: [1, 5], name: 'E', desc: 'pontos 1 e 5' },
  'F': { dots: [1, 2, 4], name: 'F', desc: 'pontos 1, 2 e 4' },
  'G': { dots: [1, 2, 4, 5], name: 'G', desc: 'pontos 1, 2, 4 e 5' },
  'H': { dots: [1, 2, 5], name: 'H', desc: 'pontos 1, 2 e 5' },
  'I': { dots: [2, 4], name: 'I', desc: 'pontos 2 e 4' },
  'J': { dots: [2, 4, 5], name: 'J', desc: 'pontos 2, 4 e 5' },
  'K': { dots: [1, 3], name: 'K', desc: 'pontos 1 e 3' },
  'L': { dots: [1, 2, 3], name: 'L', desc: 'pontos 1, 2 e 3' },
  'M': { dots: [1, 3, 4], name: 'M', desc: 'pontos 1, 3 e 4' },
  'N': { dots: [1, 3, 4, 5], name: 'N', desc: 'pontos 1, 3, 4 e 5' },
  'O': { dots: [1, 3, 5], name: 'O', desc: 'pontos 1, 3 e 5' },
  'P': { dots: [1, 2, 3, 4], name: 'P', desc: 'pontos 1, 2, 3 e 4' },
  'Q': { dots: [1, 2, 3, 4, 5], name: 'Q', desc: 'pontos 1, 2, 3, 4 e 5' },
  'R': { dots: [1, 2, 3, 5], name: 'R', desc: 'pontos 1, 2, 3 e 5' },
  'S': { dots: [2, 3, 4], name: 'S', desc: 'pontos 2, 3 e 4' },
  'T': { dots: [2, 3, 4, 5], name: 'T', desc: 'pontos 2, 3, 4 e 5' },
  'U': { dots: [1, 3, 6], name: 'U', desc: 'pontos 1, 3 e 6' },
  'V': { dots: [1, 2, 3, 6], name: 'V', desc: 'pontos 1, 2, 3 e 6' },
  'W': { dots: [2, 4, 5, 6], name: 'W', desc: 'pontos 2, 4, 5 e 6' },
  'X': { dots: [1, 3, 4, 6], name: 'X', desc: 'pontos 1, 3, 4 e 6' },
  'Y': { dots: [1, 3, 4, 5, 6], name: 'Y', desc: 'pontos 1, 3, 4, 5 e 6' },
  'Z': { dots: [1, 3, 5, 6], name: 'Z', desc: 'pontos 1, 3, 5 e 6' },

  // Acentuados e Caracteres Especiais da Língua Portuguesa
  'Á': { dots: [1, 2, 3, 5, 6], name: 'Á com agudo', desc: 'pontos 1, 2, 3, 5 e 6' },
  'É': { dots: [1, 2, 3, 4, 6], name: 'É com agudo', desc: 'pontos 1, 2, 3, 4 e 6' },
  'Í': { dots: [3, 4], name: 'Í com agudo', desc: 'pontos 3 e 4' },
  'Ó': { dots: [3, 4, 6], name: 'Ó com agudo', desc: 'pontos 3, 4 e 6' },
  'Ú': { dots: [2, 3, 4, 5, 6], name: 'Ú com agudo', desc: 'pontos 2, 3, 4, 5 e 6' },
  'Â': { dots: [1, 6], name: 'Â circunflexo', desc: 'pontos 1 e 6' },
  'Ê': { dots: [1, 2, 6], name: 'Ê circunflexo', desc: 'pontos 1, 2 e 6' },
  'Ô': { dots: [1, 4, 5, 6], name: 'Ô circunflexo', desc: 'pontos 1, 4, 5 e 6' },
  'Ã': { dots: [3, 4, 5], name: 'Ã com til', desc: 'pontos 3, 4 e 5' },
  'Õ': { dots: [2, 4, 6], name: 'Õ com til', desc: 'pontos 2, 4 e 6' },
  'Ç': { dots: [1, 2, 3, 4, 6], name: 'Cê-cedilha', desc: 'pontos 1, 2, 3, 4 e 6' },

  // Números (Dígitos precedidos pelo sinal de número ⠼ [3,4,5,6])
  '1': { dots: [1], isNumber: true, name: 'Número 1', desc: 'Sinal de número mais ponto 1' },
  '2': { dots: [1, 2], isNumber: true, name: 'Número 2', desc: 'Sinal de número mais pontos 1 e 2' },
  '3': { dots: [1, 4], isNumber: true, name: 'Número 3', desc: 'Sinal de número mais pontos 1 e 4' },
  '4': { dots: [1, 4, 5], isNumber: true, name: 'Número 4', desc: 'Sinal de número mais pontos 1, 4 e 5' },
  '5': { dots: [1, 5], isNumber: true, name: 'Número 5', desc: 'Sinal de número mais pontos 1 e 5' },
  '6': { dots: [1, 2, 4], isNumber: true, name: 'Número 6', desc: 'Sinal de número mais pontos 1, 2 e 4' },
  '7': { dots: [1, 2, 4, 5], isNumber: true, name: 'Número 7', desc: 'Sinal de número mais pontos 1, 2, 4 e 5' },
  '8': { dots: [1, 2, 5], isNumber: true, name: 'Número 8', desc: 'Sinal de número mais pontos 1, 2 e 5' },
  '9': { dots: [2, 4], isNumber: true, name: 'Número 9', desc: 'Sinal de número mais pontos 2 e 4' },
  '0': { dots: [2, 4, 5], isNumber: true, name: 'Número 0', desc: 'Sinal de número mais pontos 2, 4 e 5' },

  // Indicador de Número
  '#': { dots: [3, 4, 5, 6], name: 'Sinal de Número', desc: 'pontos 3, 4, 5 e 6' },

  // Espaço em branco
  ' ': { dots: [], name: 'Espaço', desc: 'sem pontos elevados' }
};

/**
 * Calcula o caractere Unicode Braille a partir de uma lista de pontos (1 a 6).
 */
function getBrailleUnicode(dots) {
  if (!dots || dots.length === 0) return '⠀'; // U+2800 (Braille pattern blank)
  const bitWeights = { 1: 0x01, 2: 0x02, 3: 0x04, 4: 0x08, 5: 0x10, 6: 0x20 };
  let val = 0x2800;
  dots.forEach(d => {
    if (bitWeights[d]) val += bitWeights[d];
  });
  return String.fromCharCode(val);
}

/**
 * Traduz uma combinação de pontos (ex: [1, 2]) para o caractere em tinta correspondente.
 */
function dotsToChar(dots) {
  if (!dots || dots.length === 0) return { char: '', name: 'Célula Vazia', unicode: '⠀' };
  const sortedDotsStr = [...dots].sort((a, b) => a - b).join(',');
  for (const key in BRAILLE_MAP) {
    if (key === '#') continue;
    const item = BRAILLE_MAP[key];
    const itemDotsStr = [...item.dots].sort((a, b) => a - b).join(',');
    if (sortedDotsStr === itemDotsStr && !item.isNumber) {
      return { char: key, name: item.name || key, unicode: getBrailleUnicode(item.dots) };
    }
  }
  return { char: '?', name: 'Combinação Desconhecida', unicode: getBrailleUnicode(dots) };
}

/**
 * Retorna as informações completas de um caractere.
 */
function getCharInfo(char) {
  if (!char) return null;
  const upper = char.toUpperCase();
  const info = BRAILLE_MAP[upper] || { dots: [], name: upper, desc: 'desconhecido' };
  return {
    char: upper,
    name: info.name || upper,
    dots: info.dots || [],
    desc: info.desc || '',
    unicode: getBrailleUnicode(info.dots),
    isNumber: !!info.isNumber
  };
}

/**
 * Converte um texto simples para sequência de caracteres Braille com metadados.
 */
function textToBrailleSequence(text) {
  const result = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const info = getCharInfo(ch);
    if (info.isNumber) {
      result.push(getCharInfo('#'));
    }
    result.push(info);
  }
  return result;
}

/**
 * Renderiza o HTML de um componente dual: Tinta + Braille + Leitura sonora.
 */
function renderDualCellHTML(char, options = {}) {
  const info = getCharInfo(char);
  const sizeClass = options.size || 'medium'; // small, medium, large, giant
  const showAudioBtn = options.showAudioBtn !== false;
  const showDotNumbers = options.showDotNumbers !== false;
  const customId = options.id || `dual-cell-${Math.random().toString(36).substring(2, 9)}`;

  const activeDots = new Set(info.dots);
  const gridMatrix = [
    [1, 4],
    [2, 5],
    [3, 6]
  ];

  let dotsHTML = '<div class="braille-dots-grid" role="img" aria-label="Padrão Braille: ' + info.desc + '">';
  gridMatrix.forEach(row => {
    dotsHTML += '<div class="dots-row">';
    row.forEach(dotNum => {
      const isActive = activeDots.has(dotNum);
      const activeClass = isActive ? 'active' : 'inactive';
      dotsHTML += `
        <button type="button" class="braille-dot ${activeClass}" 
          data-dot-number="${dotNum}" 
          aria-label="Ponto ${dotNum}: ${isActive ? 'Elevado' : 'Vazio'}"
          title="Ponto ${dotNum} (${isActive ? 'Ativo' : 'Inativo'})"
          onclick="event.stopPropagation(); AudioEngine.speak('Ponto ${dotNum} ${isActive ? 'elevado' : 'vazio'} da letra ${info.name}')">
          <span class="dot-inner"></span>
          ${showDotNumbers ? `<span class="dot-number">${dotNum}</span>` : ''}
        </button>
      `;
    });
    dotsHTML += '</div>';
  });
  dotsHTML += '</div>';

  return `
    <div class="dual-cell-card ${sizeClass}" id="${customId}" data-char="${info.char}" tabindex="0" role="region" aria-label="${info.name}, padrão braille ${info.desc}">
      <div class="dual-cell-header">
        <span class="ink-char-display">${info.char}</span>
        <span class="braille-unicode-display" title="Unicode Braille">${info.unicode}</span>
      </div>
      <div class="dual-cell-body">
        ${info.isNumber ? `<div class="number-prefix-badge" title="Sinal de número ⠼">⠼ <span class="sr-only">Sinal de número</span></div>` : ''}
        ${dotsHTML}
      </div>
      <div class="dual-cell-footer">
        <span class="dots-text-label">${info.desc}</span>
        ${showAudioBtn ? `
          <button type="button" class="btn-sound-mini" onclick="event.stopPropagation(); AudioEngine.speakLetter('${info.char}')" aria-label="Ouvir som e pontos da letra ${info.name}">
            🔊 Ouvir
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Renderiza uma Célula Braille Interativa Vazia (Preenchimento Ponto a Ponto)
 * Permite ao jogador clicar nos pontos 1 a 6 para formar a letra desejada!
 */
function renderInteractiveEmptyCellHTML(cellId, currentDots = [], onToggleFunctionName = 'toggleCellDot', options = {}) {
  const activeDotsSet = new Set(currentDots);
  const resultChar = dotsToChar(currentDots);
  const sizeClass = options.size || 'medium';
  const gridMatrix = [
    [1, 4],
    [2, 5],
    [3, 6]
  ];

  let dotsHTML = '<div class="braille-dots-grid interactive-builder">';
  gridMatrix.forEach(row => {
    dotsHTML += '<div class="dots-row">';
    row.forEach(dotNum => {
      const isActive = activeDotsSet.has(dotNum);
      const activeClass = isActive ? 'active' : 'inactive';
      dotsHTML += `
        <button type="button" class="braille-dot interactive ${activeClass}" 
          data-dot="${dotNum}"
          onclick="event.stopPropagation(); ${onToggleFunctionName}('${cellId}', ${dotNum})"
          aria-label="Ponto ${dotNum}: ${isActive ? 'Elevado. Clique para desativar' : 'Vazio. Clique para elevar'}">
          <span class="dot-inner"></span>
          <span class="dot-number">${dotNum}</span>
        </button>
      `;
    });
    dotsHTML += '</div>';
  });
  dotsHTML += '</div>';

  return `
    <div class="dual-cell-card interactive-builder-card ${sizeClass} ${resultChar.char ? 'has-letter' : 'empty-cell'}" id="${cellId}" tabindex="0" role="region" aria-label="Célula ponto a ponto. Letra formada: ${resultChar.name}">
      <div class="dual-cell-header">
        <span class="ink-char-display">${resultChar.char || '?'}</span>
        <span class="braille-unicode-display">${resultChar.unicode}</span>
      </div>
      <div class="dual-cell-body">
        ${dotsHTML}
      </div>
      <div class="dual-cell-footer">
        <span class="dots-text-label">${resultChar.name}</span>
        <span class="builder-instruction-tag">Clique nos pontos 1-6</span>
      </div>
    </div>
  `;
}

// Bancos de Dados por Nível de Dificuldade
const GAME_DATABASES = {
  words: {
    iniciante: [
      { word: 'BOLA', hint: 'Brinquedo redondo usado em jogos de futebol' },
      { word: 'CASA', hint: 'Lugar onde moramos com nossa família' },
      { word: 'GATO', hint: 'Animal de estimação que faz miau' },
      { word: 'PATO', hint: 'Ave aquática que faz quá-quá' },
      { word: 'SOL', hint: 'Estrela brilhante que ilumina o dia' },
      { word: 'LUA', hint: 'Aparece no céu à noite' },
      { word: 'DADO', hint: 'Cubo numerado usado em jogos de mesa' },
      { word: 'SAPO', hint: 'Anfíbio verde que pula na lagoa' },
      { word: 'BOCA', hint: 'Parte do corpo usada para falar e comer' },
      { word: 'FLOR', hint: 'Planta colorida e perfumada do jardim' }
    ],
    intermediario: [
      { word: 'ESCOLA', hint: 'Local onde vamos para aprender e estudar' },
      { word: 'AMIGO', hint: 'Pessoa companheira que gostamos muito' },
      { word: 'JARDIM', hint: 'Lugar com flores e plantas ao ar livre' },
      { word: 'ARVORE', hint: 'Planta grande com tronco e folhas verdes' },
      { word: 'MUSICA', hint: 'Som melodioso que gostamos de ouvir' },
      { word: 'BRASIL', hint: 'Nosso país' },
      { word: 'JANELA', hint: 'Abertura na parede para entrar luz e ar' },
      { word: 'LIVRO', hint: 'Objeto com páginas cheias de histórias' },
      { word: 'CANETA', hint: 'Objeto usado para escrever com tinta' },
      { word: 'BONECA', hint: 'Brinquedo em forma de pessoa' }
    ],
    avancado: [
      { word: 'ALFABETO', hint: 'Conjunto de todas as letras da nossa língua' },
      { word: 'PROFESSOR', hint: 'Profissional que nos ensina na escola' },
      { word: 'ESTUDANTE', hint: 'Pessoa que se dedica a aprender novos conhecimentos' },
      { word: 'EDUCAÇÃO', hint: 'Processo de ensino e aprendizado' },
      { word: 'BRAILLE', hint: 'Sistema de leitura e escrita tátil em alto-relevo' },
      { word: 'COMPUTADOR', hint: 'Máquina eletrônica usada para estudar e jogar' },
      { word: 'RESPEITO', hint: 'Tratar todas as pessoas com consideração e carinho' },
      { word: 'ALEGRIA', hint: 'Sentimento de felicidade e bem-estar' }
    ]
  },
  syllables: {
    iniciante: [
      { word: 'BOLA', syllables: ['BO', 'LA'], hint: 'Usada no futebol' },
      { word: 'CASA', syllables: ['CA', 'SA'], hint: 'Nosso lar' },
      { word: 'GATO', syllables: ['GA', 'TO'], hint: 'Miau!' },
      { word: 'DADO', syllables: ['DA', 'DO'], hint: 'Usado em jogos' },
      { word: 'SAPO', syllables: ['SA', 'PO'], hint: 'Vive na lagoa' }
    ],
    intermediario: [
      { word: 'ESCOLA', syllables: ['ES', 'CO', 'LA'], hint: 'Local de estudos' },
      { word: 'AMIGO', syllables: ['A', 'MI', 'GO'], hint: 'Companheiro querido' },
      { word: 'JANELA', syllables: ['JA', 'NE', 'LA'], hint: 'Para olhar para fora' },
      { word: 'BONECA', syllables: ['BO', 'NE', 'CA'], hint: 'Brinquedo infantil' }
    ],
    avancado: [
      { word: 'ALFABETO', syllables: ['AL', 'FA', 'BE', 'TO'], hint: 'Conjunto de letras' },
      { word: 'PROFESSOR', syllables: ['PRO', 'FES', 'SOR'], hint: 'Quem ensina' },
      { word: 'ESTUDANTE', syllables: ['ES', 'TU', 'DAN', 'TE'], hint: 'Quem estuda' }
    ]
  },
  math: {
    iniciante: [
      { problem: '2 + 3', answer: '5', hint: 'Somar dois com três' },
      { problem: '4 + 1', answer: '5', hint: 'Quatro mais um' },
      { problem: '7 - 2', answer: '5', hint: 'Sete tirar dois' },
      { problem: '3 + 3', answer: '6', hint: 'Três mais três' },
      { problem: '9 - 1', answer: '8', hint: 'Nove tirar um' }
    ],
    intermediario: [
      { problem: '5 + 7', answer: '12', hint: 'Cinco mais sete' },
      { problem: '15 - 5', answer: '10', hint: 'Quinze tirar cinco' },
      { problem: '8 + 8', answer: '16', hint: 'Oito mais oito' },
      { problem: '20 - 6', answer: '14', hint: 'Vinte tirar seis' }
    ],
    avancado: [
      { problem: '25 + 25', answer: '50', hint: 'Vinte e cinco mais vinte e cinco' },
      { problem: '100 - 30', answer: '70', hint: 'Cem tirar trinta' },
      { problem: '12 + 18', answer: '30', hint: 'Doze mais dezoito' }
    ]
  }
};
