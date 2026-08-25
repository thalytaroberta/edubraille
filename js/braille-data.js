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

  // Sinais de Pontuação e Teclas do Teclado Tradicional
  '(': { dots: [2, 3, 6], name: 'Abre Parêntese (', desc: 'pontos 2, 3 e 6' },
  ')': { dots: [3, 5, 6], name: 'Fecha Parêntese )', desc: 'pontos 3, 5 e 6' },
  '@': { dots: [4], name: 'Arroba @', desc: 'ponto 4' },
  'SHIFT': { dots: [6], name: 'Shift (Sinal de Maiúscula)', desc: 'ponto 6 isolado' },
  'CAPS LOCK': { dots: [6], name: 'Caps Lock (Caixa Alta Dupla)', desc: 'pontos 6 e 6 seguidos' },
  ',': { dots: [2], name: 'Vírgula ,', desc: 'ponto 2' },
  '.': { dots: [3], name: 'Ponto Final .', desc: 'ponto 3' },
  '?': { dots: [2, 6], name: 'Ponto de Interrogação ?', desc: 'pontos 2 e 6' },
  '!': { dots: [2, 3, 5], name: 'Ponto de Exclamação !', desc: 'pontos 2, 3 e 5' },
  '-': { dots: [3, 6], name: 'Hífen / Traço -', desc: 'pontos 3 e 6' },
  ':': { dots: [2, 5], name: 'Dois Pontos :', desc: 'pontos 2 e 5' },
  ';': { dots: [2, 3], name: 'Ponto e Vírgula ;', desc: 'pontos 2 e 3' },
  '"': { dots: [2, 3, 6], name: 'Aspas "', desc: 'pontos 2, 3 e 6' },
  '/': { dots: [3, 4], name: 'Barra /', desc: 'pontos 3 e 4' },

  // Indicador de Número
  '#': { dots: [3, 4, 5, 6], name: 'Sinal de Número', desc: 'pontos 3, 4, 5 e 6' },
  ' ': { dots: [], name: 'Espaço', desc: 'sem pontos elevados' }
};

function getBrailleUnicode(dots) {
  if (!dots || dots.length === 0) return '⠀';
  const bitWeights = { 1: 0x01, 2: 0x02, 3: 0x04, 4: 0x08, 5: 0x10, 6: 0x20 };
  let val = 0x2800;
  dots.forEach(d => {
    if (bitWeights[d]) val += bitWeights[d];
  });
  return String.fromCharCode(val);
}

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

function renderDualCellHTML(char, options = {}) {
  const info = getCharInfo(char);
  const sizeClass = options.size || 'medium';
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
          aria-label="Ponto ${dotNum}: ${isActive ? 'Elevado' : 'Vazio'}">
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

// BANCO DE DADOS ORGANIZADO POR TEMAS E NÍVEIS (INICIANTE, INTERMEDIÁRIO, AVANÇADO, INSANO)
const THEMATIC_DATABASES = {
  games: {
    iniciante: [
      { word: 'GAME', hint: 'Termo em inglês para jogo digital' },
      { word: 'FASE', hint: 'Etapa que o jogador precisa concluir' },
      { word: 'VIDA', hint: 'Tentativa extra do personagem no jogo' },
      { word: 'ITEM', hint: 'Objeto coletado durante a partida' }
    ],
    intermediario: [
      { word: 'CONSOLE', hint: 'Aparelho de videogame conectado à TV' },
      { word: 'AVATAR', hint: 'Personagem que representa o jogador' },
      { word: 'PILOTO', hint: 'Jogador em games de corrida' },
      { word: 'ESCUDO', hint: 'Item de proteção contra ataques' }
    ],
    avancado: [
      { word: 'PLATAFORMA', hint: 'Estilo de jogo com saltos e obstáculos' },
      { word: 'ESTRATEGIA', hint: 'Planejamento tático para vencer a partida' },
      { word: 'PERSONAGEM', hint: 'Herói ou figura jogável no game' },
      { word: 'CAMPEONATO', hint: 'Competição com ranking e prêmios' }
    ],
    insano: [
      { word: 'MULTIJOGADOR', hint: 'Modo de jogo com vários participantes online' },
      { word: 'SOBREVIVENCIAL', hint: 'Desafio extremo de resistência no jogo' },
      { word: 'DESENVOLVEDOR', hint: 'Criador que programa e projeta jogos' },
      { word: 'CULTURAGAMER', hint: 'Comunidade apaixonada por videogames' }
    ]
  },
  internet: {
    iniciante: [
      { word: 'SITE', hint: 'Página da web que navegamos' },
      { word: 'REDE', hint: 'Conexão entre vários computadores' },
      { word: 'LINK', hint: 'Atalho para abrir uma página na internet' },
      { word: 'CHAT', hint: 'Conversa por mensagem em tempo real' }
    ],
    intermediario: [
      { word: 'EMOJI', hint: 'Ícone expressivo usado em mensagens' },
      { word: 'POSTAR', hint: 'Publicar conteúdo nas redes digitais' },
      { word: 'STREAM', hint: 'Transmissão ao vivo de vídeo ou áudio' },
      { word: 'PERFIL', hint: 'Página pessoal do usuário na rede' }
    ],
    avancado: [
      { word: 'ALGORITMO', hint: 'Regras lógicas que selecionam conteúdos digitais' },
      { word: 'PRIVACIDADE', hint: 'Proteção dos dados pessoais do usuário' },
      { word: 'CIDADANIA', hint: 'Uso ético e responsável da internet' },
      { word: 'CONEXAO', hint: 'Ligação veloz com a rede mundial' }
    ],
    insano: [
      { word: 'SEGURANCADIGITAL', hint: 'Práticas de defesa contra invasões digitais' },
      { word: 'INTELIGENCIA', hint: 'Tecnologia que simula aprendizado humano' },
      { word: 'CULTURADIGITAL', hint: 'Transformações da sociedade pela tecnologia' },
      { word: 'CRIPTOGRAFIA', hint: 'Codificação secreta de mensagens e dados' }
    ]
  },
  musica: {
    iniciante: [
      { word: 'SOM', hint: 'Vibração sonora que ouvimos' },
      { word: 'TOM', hint: 'Altura da nota musical' },
      { word: 'BANDA', hint: 'Grupo de músicos que tocam juntos' },
      { word: 'RITMO', hint: 'Batida e tempo da música' }
    ],
    intermediario: [
      { word: 'PIANO', hint: 'Instrumento musical com teclas brancas e pretas' },
      { word: 'FLAUTA', hint: 'Instrumento de sopro melodioso' },
      { word: 'VIOLAO', hint: 'Instrumento de cordas muito popular' },
      { word: 'CANCAO', hint: 'Música cantada com letra' }
    ],
    avancado: [
      { word: 'MELODIA', hint: 'Sequência harmoniosa de notas musicais' },
      { word: 'TECLADO', hint: 'Instrumento eletrônico musical' },
      { word: 'VIOLINO', hint: 'Instrumento de cordas tocado com arco' },
      { word: 'BATERIA', hint: 'Conjunto de percussão com pratos e tambores' },
      { word: 'ORQUESTRA', hint: 'Grande conjunto de músicos e instrumentos' }
    ],
    insano: [
      { word: 'MAESTRO', hint: 'Regente da orquestra e dos arranjos musicais' },
      { word: 'SINFONIA', hint: 'Composição musical complexa executada por orquestra' },
      { word: 'PARTITURA', hint: 'Registro gráfico das notas e pauta musical' },
      { word: 'CLARINETE', hint: 'Instrumento de sopro com palheta simples' }
    ]
  },
  filmes: {
    iniciante: [
      { word: 'CENA', hint: 'Trecho gravado do filme' },
      { word: 'ATOR', hint: 'Artista que interpreta o personagem' },
      { word: 'TELA', hint: 'Superfície onde o filme é projetado' },
      { word: 'FILME', hint: 'Obra cinematográfica de ficção ou arte' }
    ],
    intermediario: [
      { word: 'CINEMA', hint: 'Espaço com projeção audiovisual' },
      { word: 'ROTEIRO', hint: 'Texto com a história e falas do filme' },
      { word: 'HEROI', hint: 'Protagonista corajoso da história' },
      { word: 'CAMERA', hint: 'Equipamento que grava a cena' }
    ],
    avancado: [
      { word: 'ANIMACAO', hint: 'Filme feito com ilustrações ou modelos 3D' },
      { word: 'MISTERIO', hint: 'Gênero cinematográfico com enigmas' },
      { word: 'AVENTURA', hint: 'História com perigos e conquistas' },
      { word: 'PRODUCAO', hint: 'Organização de bastidores do cinema' }
    ],
    insano: [
      { word: 'CINEMATOGRAFIA', hint: 'Arte de gravar e compor imagens para filmes' },
      { word: 'DOCUMENTARIO', hint: 'Filme baseado em fatos reais da vida' },
      { word: 'FICCIONISMO', hint: 'Criação de mundos imaginosos e futuristas' },
      { word: 'TRILHASONA', hint: 'Música criada para emocionar no filme' }
    ]
  },
  anime: {
    iniciante: [
      { word: 'MANGA', hint: 'Quadrinho japonês lido da direita para esquerda' },
      { word: 'ANIME', hint: 'Desenho animado produzido no Japão' },
      { word: 'HEROI', hint: 'Protagonista com espírito guerreiro' },
      { word: 'NINJA', hint: 'Guerreiro ágil e misterioso' }
    ],
    intermediario: [
      { word: 'COSPLAY', hint: 'Fantasia inspirada em personagens fictícios' },
      { word: 'SAMURAI', hint: 'Guerreiro japonês com espada katana' },
      { word: 'PODER', hint: 'Habilidade especial do lutador' },
      { word: 'DRAGAO', hint: 'Criatura mítica respeitada no Oriente' }
    ],
    avancado: [
      { word: 'MITOLOGIA', hint: 'Conjunto de lendas e tradições culturais' },
      { word: 'FANTASIA', hint: 'Mundo repleto de magia e monstros' },
      { word: 'DISCIPLINAS', hint: 'Treinamento de artes marciais orientais' },
      { word: 'TOKYO', hint: 'Capital do Japão berço da cultura pop' }
    ],
    insano: [
      { word: 'TRANSFORMACAO', hint: 'Evolução épica de poderes do guerreiro' },
      { word: 'ORIGINALIDADE', hint: 'Elemento único de criação artística' },
      { word: 'CULTURAPOP', hint: 'Manifestações artísticas jovens globais' },
      { word: 'ARTESMARCIAIS', hint: 'Técnicas milenares de combate e respeito' }
    ]
  },
  fantasia: {
    iniciante: [
      { word: 'MAGO', hint: 'Lançador de feitiços e encantamentos' },
      { word: 'REI', hint: 'Governante do reino fantástico' },
      { word: 'FADA', hint: 'Ser mágico de asas luminosas' },
      { word: 'ELFO', hint: 'Ser místico das florestas sagradas' }
    ],
    intermediario: [
      { word: 'DRAGAO', hint: 'Cuspidor de fogo guardião do tesouro' },
      { word: 'CASTELO', hint: 'Fortaleza medieval dos reis' },
      { word: 'POCAO', hint: 'Bebida mágica com poderes especiais' },
      { word: 'ESPADAS', hint: 'Armas nobres dos cavaleiros' }
    ],
    avancado: [
      { word: 'ARTEFATO', hint: 'Objeto antigo carregado de magia' },
      { word: 'CAVALEIRO', hint: 'Defensor de armadura do reino' },
      { word: 'CRIATURA', hint: 'Ser fantástico de terras distantes' },
      { word: 'MITOLOGIA', hint: 'Histórias sagradas de deuses e heróis' }
    ],
    insano: [
      { word: 'MUNDOMAGICO', hint: 'Dimensão paralela cheia de encantamentos' },
      { word: 'EXTRAORDINARIO', hint: 'Acontecimento surpreendente e místico' },
      { word: 'JORNADAEICA', hint: 'Missão perigosa em busca da vitória' },
      { word: 'ENCANTAMENTO', hint: 'Feitiço poderoso que transforma o mundo' }
    ]
  },
  misterio: {
    iniciante: [
      { word: 'PISTA', hint: 'Sinal que ajuda a resolver a charada' },
      { word: 'CASO', hint: 'Enigma a ser investigado' },
      { word: 'CHAVE', hint: 'Objeto que abre o mistério' },
      { word: 'FATO', hint: 'Informação verdadeira comprovada' }
    ],
    intermediario: [
      { word: 'DETETIVE', hint: 'Investigador especialista em pistas' },
      { word: 'CODIGO', hint: 'Sequência secreta cifrada' },
      { word: 'ENIGMA', hint: 'Pergunta desafiadora de raciocínio' },
      { word: 'PADRAO', hint: 'Sequência lógica repetida' }
    ],
    avancado: [
      { word: 'DESCOBERTA', hint: 'Revelação da solução do mistério' },
      { word: 'SECRETO', hint: 'Oculto que poucos conhecem' },
      { word: 'DEDUCAO', hint: 'Raciocínio lógico baseado em fatos' },
      { word: 'CHARADAS', hint: 'Pegadinha inteligente de reflexão' }
    ],
    insano: [
      { word: 'INVESTIGACAO', hint: 'Busca minuciosa pela verdade oculta' },
      { word: 'CRIPTOGRAFIA', hint: 'Técnica de esconder dados com chaves' },
      { word: 'OBSERVACAO', hint: 'Capacidade de notar os menores detalhes' },
      { word: 'DESCRIPTOGRAFAR', hint: 'Revelar a mensagem secreta oculta' }
    ]
  },
  esportes: {
    iniciante: [
      { word: 'GOL', hint: 'Ponto principal no futebol' },
      { word: 'BOLA', hint: 'Esfera usada em vários jogos esportivos' },
      { word: 'TIME', hint: 'Equipe de atletas jogando juntos' },
      { word: 'REDE', hint: 'Estrutura na quadra de vôlei ou tênis' }
    ],
    intermediario: [
      { word: 'FUTEBOL', hint: 'Esporte mais popular do Brasil' },
      { word: 'BASQUETE', hint: 'Jogo onde a bola é arremessada na cesta' },
      { word: 'NATACAO', hint: 'Esporte praticado dentro da piscina' },
      { word: 'SKATE', hint: 'Prancha com rodas para manobras radicais' }
    ],
    avancado: [
      { word: 'ATLETISMO', hint: 'Modalidades de corrida, salto e arremesso' },
      { word: 'CORRIDA', hint: 'Desafio de velocidade até a linha de chegada' },
      { word: 'MEDALHA', hint: 'Prêmio concedido ao pódio vitorioso' },
      { word: 'PARALIMPICO', hint: 'Jogos mundiais de atletas com deficiência' }
    ],
    insano: [
      { word: 'CAMPEONATOGERAL', hint: 'Torneio global que define os melhores' },
      { word: 'ESPORTESOLIMPICOS', hint: 'Competições milenares entre seleções' },
      { word: 'CONDICIONAMENTO', hint: 'Preparo físico de alto rendimento' },
      { word: 'SUPERACAO', hint: 'Ultrapassar os próprios limites na quadra' }
    ]
  },
  animais: {
    iniciante: [
      { word: 'GATO', hint: 'Animal que faz miau' },
      { word: 'PATO', hint: 'Ave que faz quá-quá' },
      { word: 'SAPO', hint: 'Anfíbio que pula na lagoa' },
      { word: 'LEAO', hint: 'Rei da selva' }
    ],
    intermediario: [
      { word: 'CACHORRO', hint: 'Melhor amigo do homem que faz au-au' },
      { word: 'PASSARO', hint: 'Animal com asas que voa no céu' },
      { word: 'CAVALO', hint: 'Grande animal que relincha' },
      { word: 'COELHO', hint: 'Animal de orelhas compridas que pula' }
    ],
    avancado: [
      { word: 'ELEFANTE', hint: 'Grande mamífero com tromba comprida' },
      { word: 'TARTARUGA', hint: 'Répil com casco que anda devagar' },
      { word: 'TUBARAO', hint: 'Grande predador do oceano' },
      { word: 'GOLFINHO', hint: 'Mamífero marinho inteligente e amigável' }
    ],
    insano: [
      { word: 'RINOCERONTE', hint: 'Grande mamífero terrestre com chifre no focinho' },
      { word: 'HIPOPOTAMO', hint: 'Animal semiquático grande que vive na África' },
      { word: 'ORNITORRINCO', hint: 'Exótico mamífero aquático que bota ovos' },
      { word: 'CAMALEAO', hint: 'Répteis que mudam de cor para se camuflar' }
    ]
  },
  ciencia: {
    iniciante: [
      { word: 'LUZ', hint: 'Energia que nos permite enxergar' },
      { word: 'AR', hint: 'Mistura de gases que respiramos' },
      { word: 'AGUA', hint: 'Líquido essencial para toda a vida' },
      { word: 'VIDA', hint: 'Propriedade dos seres biológicos' }
    ],
    intermediario: [
      { word: 'FISICA', hint: 'Ciência dos movimentos e da matéria' },
      { word: 'QUIMICA', hint: 'Estudo das substâncias e reações' },
      { word: 'BIOLOGIA', hint: 'Estudo dos seres vivos e ecossistemas' },
      { word: 'CELULA', hint: 'Unidade fundamental de todos os seres' }
    ],
    avancado: [
      { word: 'ASTRONOMIA', hint: 'Estudo das estrelas e do cosmos' },
      { word: 'GENETICA', hint: 'Estudo do DNA e da hereditariedade' },
      { word: 'INVENCAO', hint: 'Criação inédita que melhora o mundo' },
      { word: 'CIENTISTA', hint: 'Profissional dedicado ao método científico' }
    ],
    insano: [
      { word: 'NEUROCIENCIA', hint: 'Estudo científico do cérebro e sistema nervoso' },
      { word: 'MICROORGANISMO', hint: 'Ser vivo invisível a olho nu' },
      { word: 'EXPERIMENTO', hint: 'Teste prático para comprovar teorias' },
      { word: 'BIODIVERSIDADE', hint: 'Riqueza e variedade de espécies na Terra' }
    ]
  },
  espaco: {
    iniciante: [
      { word: 'SOL', hint: 'Nossa estrela central' },
      { word: 'LUA', hint: 'Satélite natural da Terra' },
      { word: 'CEU', hint: 'Firmamento visto do planeta' },
      { word: 'NAVE', hint: 'Veículo de transporte espacial' }
    ],
    intermediario: [
      { word: 'PLANETA', hint: 'Corpo celeste que orbita uma estrela' },
      { word: 'ESTRELA', hint: 'Corpo iluminado de gás em fusão' },
      { word: 'FOGUETE', hint: 'Veículo que decola para o espaço' },
      { word: 'ORBITA', hint: 'Trajetória curva de um planeta no espaço' }
    ],
    avancado: [
      { word: 'GALAXIA', hint: 'Conjunto gigante de bilhões de estrelas' },
      { word: 'ASTRONAUTA', hint: 'Pessoa treinada para viagens espaciais' },
      { word: 'SISTEMASOLAR', hint: 'O Sol com seus 8 planetas e luas' },
      { word: 'SATELITE', hint: 'Equipamento em órbita do planeta' }
    ],
    insano: [
      { word: 'BURACONECRO', hint: 'Região do espaço com gravidade extrema' },
      { word: 'EXPLORACAO', hint: 'Missão de descobrir novos mundos' },
      { word: 'CONSTELACAO', hint: 'Agrupamento aparente de estrelas no céu' },
      { word: 'TELESCOPIO', hint: 'Instrumento ótico para observar astros' }
    ]
  },
  tecnologia: {
    iniciante: [
      { word: 'CHIP', hint: 'Pequeno circuito de computador' },
      { word: 'TELA', hint: 'Superfície de exibição visual' },
      { word: 'FONE', hint: 'Aparelho para ouvir áudio individual' },
      { word: 'ROBO', hint: 'Máquina automatizada programável' }
    ],
    intermediario: [
      { word: 'CELULAR', hint: 'Telefone portátil inteligente' },
      { word: 'APLICATIVO', hint: 'Programa instalado no dispositivo' },
      { word: 'DRONE', hint: 'Aeronave não pilotada por pessoa a bordo' },
      { word: 'SISTEMA', hint: 'Conjunto de programas em funcionamento' }
    ],
    avancado: [
      { word: 'ROBOTICA', hint: 'Ramo que estuda a construção de robôs' },
      { word: 'PROGRAMACAO', hint: 'Escrita de código para software' },
      { word: 'ACESSIBILIDADE', hint: 'Tecnologia assistiva para inclusão' },
      { word: 'REALIDADEVIRTUAL', hint: 'Simulação 3D imersiva por óculos' }
    ],
    insano: [
      { word: 'TECNOLOGIAS', hint: 'Inovações digitais que transformam a sociedade' },
      { word: 'INTELIGENCIA', hint: 'Sistemas que aprendem autonomamente' },
      { word: 'AUTOMACAO', hint: 'Controle de processos sem intervenção manual' },
      { word: 'DESENVOLVIMENTO', hint: 'Criação de soluções tecnológicas avançadas' }
    ]
  },
  brasil: {
    iniciante: [
      { word: 'RIO', hint: 'Curso de água natural que corre' },
      { word: 'MATA', hint: 'Vegetação nativa da floresta' },
      { word: 'PAIS', hint: 'Pátria onde nascemos' },
      { word: 'FESTA', hint: 'Celebração popular da cultura' }
    ],
    intermediario: [
      { word: 'BRASIL', hint: 'Nosso país tropical e diverso' },
      { word: 'ESTADO', hint: 'Divisão territorial como Pernambuco' },
      { word: 'CAPITAL', hint: 'Sede administrativa do estado' },
      { word: 'FOLCLORE', hint: 'Conjunto de lendas e mitos do povo' }
    ],
    avancado: [
      { word: 'AMAZONIA', hint: 'Maior floresta tropical do mundo' },
      { word: 'NORDESTE', hint: 'Região rica em praias e cultura' },
      { word: 'PERNAMBUCO', hint: 'Estado berço do frevo e maracatu' },
      { word: 'BIODIVERSIDADE', hint: 'Fauna e flora variadas do Brasil' }
    ],
    insano: [
      { word: 'MATAATLANTICA', hint: 'Bioma brasileiro rico ao longo do litoral' },
      { word: 'PERSONALIDADE', hint: 'Figuras históricas marcantes do país' },
      { word: 'PATRIMONIO', hint: 'Riqueza cultural e histórica preservada' },
      { word: 'DIVERSIDADE', hint: 'Multiplicidade de povos e tradições' }
    ]
  },
  mundo: {
    iniciante: [
      { word: 'PAIS', hint: 'Nação com governo e fronteiras' },
      { word: 'MAPA', hint: 'Desenho da superfície da Terra' },
      { word: 'POVO', hint: 'Conjunto de habitantes de uma terra' },
      { word: 'MAR', hint: 'Extensão de água salgada' }
    ],
    intermediario: [
      { word: 'PAISES', hint: 'Nações distribuídas pelo mundo' },
      { word: 'CAPITAIS', hint: 'Cidades principais dos países' },
      { word: 'BANDEIRA', hint: 'Símbolo oficial de cada nação' },
      { word: 'IDIOMA', hint: 'Língua falada por uma sociedade' }
    ],
    avancado: [
      { word: 'CONTINENTE', hint: 'Grandes massas continentais terrestres' },
      { word: 'MONUMENTO', hint: 'Construção histórica famosa globalmente' },
      { word: 'CULTURAS', hint: 'Diferentes tradições dos povos do mundo' },
      { word: 'GEOGRAFIA', hint: 'Ciência que estuda o espaço terrestre' }
    ],
    insano: [
      { word: 'INTERNACIONAL', hint: 'Relações que envolvem múltiplos países' },
      { word: 'MULTICULTURAL', hint: 'Convivência de diversas culturas humanas' },
      { word: 'GLOBALIZACAO', hint: 'Integração mundial de conhecimentos e ideias' },
      { word: 'PATRIMONIOS', hint: 'Lugares sagrados protegidos pela humanidade' }
    ]
  },
  historia: {
    iniciante: [
      { word: 'REI', hint: 'Monarca de tempos antigos' },
      { word: 'POVO', hint: 'Sociedade que construiu a história' },
      { word: 'MITO', hint: 'Narrativa antiga explicativa' },
      { word: 'CARTA', hint: 'Documento histórico escrito' }
    ],
    intermediario: [
      { word: 'EGITO', hint: 'Civilização famosa pelas pirâmides' },
      { word: 'ROMA', hint: 'Império antigo e berço do direito' },
      { word: 'GRECIA', hint: 'Berço da democracia e filosofia' },
      { word: 'VIKINGS', hint: 'Navegadores e guerreiros do norte' }
    ],
    avancado: [
      { word: 'PIRAMIDE', hint: 'Construção colossal do Egito Antigo' },
      { word: 'REVOLUCAO', hint: 'Mudança radical na história humana' },
      { word: 'DESCOBERTA', hint: 'Achega importante de novos conhecimentos' },
      { word: 'INDIGENAS', hint: 'Primeiros habitantes originários' }
    ],
    insano: [
      { word: 'CIVILIZACOES', hint: 'Sociedades complexas da antiguidade' },
      { word: 'HISTORIOGRAFIA', hint: 'Estudo do registro dos fatos históricos' },
      { word: 'TRANSFORMACAO', hint: 'Mudanças estruturais ao longo das eras' },
      { word: 'PATRIMONIOHISTORICO', hint: 'Memória preservada de gerações passadas' }
    ]
  },
  geografia: {
    iniciante: [
      { word: 'VALE', hint: 'Terreno baixo entre montanhas' },
      { word: 'LAGO', hint: 'Acúmulo de água cercado por terra' },
      { word: 'CLIMA', hint: 'Condições do tempo em uma região' },
      { word: 'DUNA', hint: 'Monte de areia formado pelo vento' }
    ],
    intermediario: [
      { word: 'VULCAO', hint: 'Montanha que expelia lava ardente' },
      { word: 'OCEANO', hint: 'Vasta extensão de água salgada' },
      { word: 'RELEVO', hint: 'Formas da superfície do planeta' },
      { word: 'ILHAS', hint: 'Porções de terra cercadas por água' }
    ],
    avancado: [
      { word: 'CARTOGRAFIA', hint: 'Arte de elaborar mapas e cartas' },
      { word: 'METROPOLE', hint: 'Grande cidade polo regional' },
      { word: 'ECOSSISTEMAS', hint: 'Conexão entre vida e clima no local' },
      { word: 'BIOMAS', hint: 'Grandes conjuntos de vegetação e fauna' }
    ],
    insano: [
      { word: 'GEOPOLITICA', hint: 'Estudo das relações de poder no território' },
      { word: 'SUSTENTABILIDADE', hint: 'Uso consciente dos recursos da Terra' },
      { word: 'PRESERVACAO', hint: 'Proteção ambiental das bacias e florestas' },
      { word: 'DESENVOLVIMENTO', hint: 'Crescimento planejado do espaço urbano' }
    ]
  },
  arte: {
    iniciante: [
      { word: 'COR', hint: 'Elemento visual da pintura' },
      { word: 'TINTA', hint: 'Material colorido para pintar' },
      { word: 'OBRA', hint: 'Criação artística do autor' },
      { word: 'TELA', hint: 'Superfície onde se pinta' }
    ],
    intermediario: [
      { word: 'DESENHO', hint: 'Traço artístico no papel' },
      { word: 'PINTURA', hint: 'Arte visual de aplicar tintas' },
      { word: 'GRAFITE', hint: 'Arte urbana nas paredes das cidades' },
      { word: 'ARTISTA', hint: 'Pessoa que cria obras de arte' }
    ],
    avancado: [
      { word: 'ESCULTURA', hint: 'Arte de moldar formas em 3D' },
      { word: 'FOTOGRAFIA', hint: 'Arte de registrar luzes e momentos' },
      { word: 'EXPOSICAO', hint: 'Mostra de arte no museu ou galeria' },
      { word: 'CRIATIVIDADE', hint: 'Capacidade de inventar o novo' }
    ],
    insano: [
      { word: 'EXPRESSIONISMO', hint: 'Movimento artístico que retrata emoções' },
      { word: 'ARTESTUDIO', hint: 'Espaço de produção do artista plástico' },
      { word: 'MOVIMENTOSARTISTICOS', hint: 'Escolas que revolucionaram a arte' },
      { word: 'CONTEMPORANEO', hint: 'Arte criada no tempo presente' }
    ]
  },
  moda: {
    iniciante: [
      { word: 'LOOK', hint: 'Visual ou combinação de roupas' },
      { word: 'TENIS', hint: 'Calçado confortável para o dia a dia' },
      { word: 'COR', hint: 'Tom escolhido para a peça' },
      { word: 'BONE', hint: 'Acessório usado na cabeça' }
    ],
    intermediario: [
      { word: 'ESTILO', hint: 'Forma pessoal de se vestir' },
      { word: 'DESIGN', hint: 'Criação estética de produtos e roupas' },
      { word: 'TEXTURA', hint: 'Sensação tátil do tecido' },
      { word: 'STREETWEAR', hint: 'Moda urbana e jovem das ruas' }
    ],
    avancado: [
      { word: 'CUSTOMIZACAO', hint: 'Personalização exclusiva da roupa' },
      { word: 'ACESSORIOS', hint: 'Itens que complementam o estilo' },
      { word: 'CULTURA', hint: 'Expressão de grupos através da roupa' },
      { word: 'SUSTENTAVEL', hint: 'Moda ecologicamente consciente' }
    ],
    insano: [
      { word: 'IDENTIDADEVISUAL', hint: 'Marca registrada do estilo pessoal' },
      { word: 'TENDENCIAS', hint: 'Movimentos estéticos que ganham o público' },
      { word: 'ORIGINALIDADE', hint: 'Criação autêntica sem cópias' },
      { word: 'EXPRESSAOCULTURAL', hint: 'Moda usada como forma de arte e voz' }
    ]
  },
  comida: {
    iniciante: [
      { word: 'PAO', hint: 'Alimento básico feito de farinha' },
      { word: 'DOCE', hint: 'Sobremesa saborosa e açucarada' },
      { word: 'BOLO', hint: 'Massa assada recheada ou simples' },
      { word: 'SUCO', hint: 'Bebida natural de frutas' }
    ],
    intermediario: [
      { word: 'PIZZA', hint: 'Massa assada redonda com queijo' },
      { word: 'FRUTAS', hint: 'Alimentos naturais ricos em vitaminas' },
      { word: 'SABORES', hint: 'Sensações percebidas no paladar' },
      { word: 'RECEITA', hint: 'Instruções de preparo de um prato' }
    ],
    avancado: [
      { word: 'GASTRONOMIA', hint: 'Arte da culinária e dos sabores' },
      { word: 'INGREDIENTES', hint: 'Itens usados no preparo do prato' },
      { word: 'REGIONAL', hint: 'Comida típica de uma determinada região' },
      { word: 'NUTRIENTES', hint: 'Elementos essenciais para a saúde' }
    ],
    insano: [
      { word: 'CULINARIABRASILEIRA', hint: 'Riquíssima variedade gastronômica do país' },
      { word: 'ALIMENTACAO', hint: 'Hábitos saudáveis de consumo alimentar' },
      { word: 'TRADICOES', hint: 'Receitas passadas de geração em geração' },
      { word: 'GASTRONOMICO', hint: 'Conhecimento refinado dos sabores do mundo' }
    ]
  },
  natureza: {
    iniciante: [
      { word: 'FLOR', hint: 'Parte colorida e perfumada da planta' },
      { word: 'MAR', hint: 'Grande extensão de água salgada' },
      { word: 'RIO', hint: 'Curso de água doce natural' },
      { word: 'ARVORE', hint: 'Planta de grande porte com tronco' }
    ],
    intermediario: [
      { word: 'FLORESTA', hint: 'Conjunto denso de árvores e animais' },
      { word: 'RECICLAGEM', hint: 'Reaproveitamento de materiais usados' },
      { word: 'ENERGIA', hint: 'Força renovável como a solar ou eólica' },
      { word: 'PROTECAO', hint: 'Cuidado e defesa dos animais e vegetação' }
    ],
    avancado: [
      { word: 'SUSTENTABILIDADE', hint: 'Equilíbrio entre consumo e natureza' },
      { word: 'PRESERVACAO', hint: 'Manutenção intocada dos ecossistemas' },
      { word: 'BIODIVERSIDADE', hint: 'Variedade de vidas no ecossistema' },
      { word: 'RECURSOS', hint: 'Bens naturais necessários para a vida' }
    ],
    insano: [
      { word: 'MEIOAMBIENTE', hint: 'Conjunto de condições que abrigam a vida' },
      { word: 'CONSCIENTIZACAO', hint: 'Entendimento da importância de preservar' },
      { word: 'DESENVOLVIMENTO', hint: 'Progresso sustentável e ecológico' },
      { word: 'REFLORESTAMENTO', hint: 'Plantio de novas árvores em áreas desmatadas' }
    ]
  },
  profissoes: {
    iniciante: [
      { word: 'GUIA', hint: 'Pessoa que orienta caminhos e passeios' },
      { word: 'JUIZ', hint: 'Profissional que aplica a justiça' },
      { word: 'ATOR', hint: 'Artista que atua em peças e filmes' },
      { word: 'POETA', hint: 'Escritor de versos e poesias' }
    ],
    intermediario: [
      { word: 'MEDICO', hint: 'Profissional que cuida da saúde' },
      { word: 'DESIGNER', hint: 'Criador de projetos visuais e digitais' },
      { word: 'CIENTISTA', hint: 'Pessoa dedicada à pesquisa científica' },
      { word: 'PROFESSOR', hint: 'Educador que ensina com dedicação' }
    ],
    avancado: [
      { word: 'ENGENHEIRO', hint: 'Projetista de edifícios e tecnologia' },
      { word: 'PROGRAMADOR', hint: 'Criador de códigos e sistemas de software' },
      { word: 'ASTRONOMO', hint: 'Estudioso das estrelas e do universo' },
      { word: 'PSICOLOGO', hint: 'Profissional da saúde mental e emoções' }
    ],
    insano: [
      { word: 'EMPREENDEDORISMO', hint: 'Capacidade de criar novos projetos e empresas' },
      { word: 'TECNOLOGIAASSISTIVA', hint: 'Desenvolvimento de soluções para inclusão' },
      { word: 'PROFISSOESDOFUTURO', hint: 'Novas carreiras emergentes na era digital' },
      { word: 'PESQUISADOR', hint: 'Especialista que descobre novas soluções' }
    ]
  },
  vidareal: {
    iniciante: [
      { word: 'FATO', hint: 'Informação confirmada da realidade' },
      { word: 'FOCO', hint: 'Atenção concentrada na tarefa' },
      { word: 'META', hint: 'Objetivo que se deseja alcançar' },
      { word: 'ACAO', hint: 'Atitude prática tomada pelo indivíduo' }
    ],
    intermediario: [
      { word: 'DINHEIRO', hint: 'Recurso usado nas trocas comerciais' },
      { word: 'TRABALHO', hint: 'Atividade produtiva do cidadão' },
      { word: 'RESPEITO', hint: 'Consideração e valorização dos outros' },
      { word: 'DECISAO', hint: 'Escolha consciente tomada diante de opções' }
    ],
    avancado: [
      { word: 'PLANEJAMENTO', hint: 'Organização prévia das ações futuras' },
      { word: 'FINANCEIRA', hint: 'Educação para gerir recursos com sabedoria' },
      { word: 'COMUNICACAO', hint: 'Capacidade de expressar ideias com clareza' },
      { word: 'ORGANIZACAO', hint: 'Estruturação eficiente da rotina' }
    ],
    insano: [
      { word: 'RESPONSABILIDADE', hint: 'Compromisso com os deveres e escolhas' },
      { word: 'RESOLUCAODEPROBLEMAS', hint: 'Habilidade de encontrar saídas inteligentes' },
      { word: 'CONSUMOCONSCIENTE', hint: 'Uso sustentável e medido de recursos' },
      { word: 'CIDADANIAATIVA', hint: 'Participação transformadora na comunidade' }
    ]
  },
  curiosidades: {
    iniciante: [
      { word: 'FATO', hint: 'Informação surpreendente e real' },
      { word: 'DICA', hint: 'Orientação valiosa que facilita algo' },
      { word: 'IDEIA', hint: 'Pensamento novo e criativo' },
      { word: 'SEGREDO', hint: 'Informação curiosa pouco divulgada' }
    ],
    intermediario: [
      { word: 'INCRIVEL', hint: 'Algo que causa grande admiração' },
      { word: 'RECORDES', hint: 'Maiores marcas alcançadas no mundo' },
      { word: 'DESCOBERTA', hint: 'Fato novo que surpreende todos' },
      { word: 'MISTERIOS', hint: 'Fatos da natureza ainda em estudo' }
    ],
    avancado: [
      { word: 'SURPREENDENTE', hint: 'Fato que nos faz pensar: Eu não sabia disso!' },
      { word: 'INVENTORES', hint: 'Pessoas brilhantes que mudaram a história' },
      { word: 'CURIOSIDADES', hint: 'Perguntas e fatos fascinantes do mundo' },
      { word: 'CONHECIMENTO', hint: 'Conjunto de saberes adquiridos' }
    ],
    insano: [
      { word: 'INFORMACAOFASCINANTE', hint: 'Dado extraordinário que amplia a visão' },
      { word: 'FENOMENOSNATURAIS', hint: 'Acontecimentos impressionantes do planeta' },
      { word: 'DESCOBERTASCIENTIFICAS', hint: 'Avanços que revolucionam a humanidade' },
      { word: 'CONHECIMENTOGERAL', hint: 'Sabedoria sobre múltiplos temas do mundo' }
    ]
  },
  desafios: {
    iniciante: [
      { word: 'JOGO', hint: 'Atividade lúdica de raciocínio' },
      { word: 'PAR', hint: 'Combinação de dois elementos iguais' },
      { word: 'SOMA', hint: 'Operação matemática de juntar quantidades' },
      { word: 'TELA', hint: 'Local de exibição do desafio' }
    ],
    intermediario: [
      { word: 'LOGICA', hint: 'Raciocínio coerente e estruturado' },
      { word: 'MEMORIA', hint: 'Capacidade mental de lembrar informações' },
      { word: 'PADROES', hint: 'Sequências ordenadas que se repetem' },
      { word: 'DESAFIO', hint: 'Tarefa instigante que exige esforço' }
    ],
    avancado: [
      { word: 'RACIOCINIO', hint: 'Processo mental de solução de problemas' },
      { word: 'VELOCIDADE', hint: 'Rapidez na tomada de decisão correta' },
      { word: 'ASSOCIACAO', hint: 'Combinação lógica entre dois conceitos' },
      { word: 'CONCENTRACAO', hint: 'Foco total para não cometer erros' }
    ],
    insano: [
      { word: 'MENTEBRILHANTE', hint: 'Capacidade elevada de resolução lógica' },
      { word: 'DESAFIOMENTAL', hint: 'Exercício intenso para o cérebro' },
      { word: 'QUEBRACABECA', hint: 'Problema complexo com peças encaixáveis' },
      { word: 'PRECISAOTOTAL', hint: 'Execução sem falhas do desafio' }
    ]
  },
  emojis: {
    iniciante: [
      { word: 'MELANCIA', hint: 'Adivinhe a fruta: 🍉' },
      { word: 'ABELHA', hint: 'Adivinhe o animal: 🐝 + 🍯' },
      { word: 'FUTEBOL', hint: 'Adivinhe o esporte: ⚽' },
      { word: 'FOGO', hint: 'Adivinhe o elemento: 🔥' }
    ],
    intermediario: [
      { word: 'MEDICO', hint: 'Adivinhe a profissão: 👨‍⚕️ + 🏥' },
      { word: 'FROZEN', hint: 'Adivinhe o filme: ❄️ + 👸 + ⛄' },
      { word: 'ASTRONAUTA', hint: 'Adivinhe a profissão: 👩‍🚀 + 🚀' },
      { word: 'PALHAÇO', hint: 'Adivinhe o personagem: 🤡 + 🎪' }
    ],
    avancado: [
      { word: 'TITANIC', hint: 'Adivinhe o filme: 🎬 + 🧊 + 🚢' },
      { word: 'REILEAO', hint: 'Adivinhe o filme: 👑 + 🦁' },
      { word: 'HARRYPOTTER', hint: 'Adivinhe o filme: 🧙‍♂️ + ⚡ + 🦉' },
      { word: 'PIZZA', hint: 'Adivinhe a comida: 🍕 + 🇮🇹' }
    ],
    insano: [
      { word: 'DESAFIOEMOJI', hint: 'Interpretação de símbolos visuais divertidos' },
      { word: 'ASSOCIACAODEEMOJIS', hint: 'Combinação de ícones para decifrar enigmas' },
      { word: 'CULTURADOPROMPT', hint: 'Comunicação moderna por ícones expressivos' },
      { word: 'DECODIFICADOR', hint: 'Tradução rápida de enigmas visuais' }
    ]
  },
  palavras: {
    iniciante: [
      { word: 'AMOR', hint: 'Sentimento nobre de carinho' },
      { word: 'PAZ', hint: 'Harmonia e ausência de conflitos' },
      { word: 'SOL', hint: 'Estrela iluminada do dia' },
      { word: 'LIVRO', hint: 'Obra impressa com páginas e histórias' }
    ],
    intermediario: [
      { word: 'SINONIMO', hint: 'Palavra com significado semelhante' },
      { word: 'ANTONIMO', hint: 'Palavra com sentido oposto' },
      { word: 'ANAGRAMA', hint: 'Reorganização das letras de uma palavra' },
      { word: 'VOCABULARIO', hint: 'Conjunto de palavras de uma língua' }
    ],
    avancado: [
      { word: 'PORTUGUES', hint: 'Nossa língua pátria rica e bela' },
      { word: 'INGLES', hint: 'Língua internacional amplamente falada' },
      { word: 'ESPANHOL', hint: 'Língua irmã muito falada nas Américas' },
      { word: 'LINGUAGEM', hint: 'Sistema de comunicação humana' }
    ],
    insano: [
      { word: 'ALFABETIZACAO', hint: 'Processo de aprendizado da leitura e escrita' },
      { word: 'ESCRITABRAILLE', hint: 'Sistema de pontos elevados para leitura tátil' },
      { word: 'COMUNICACAO', hint: 'Troca de mensagens e ideias entre seres' },
      { word: 'CONHECIMENTOLINGUISTICO', hint: 'Domínio das estruturas da linguagem' }
    ]
  },
  libras: {
    iniciante: [
      { word: 'SINAL', hint: 'Gesto com significado em Libras' },
      { word: 'MAO', hint: 'Instrumento de expressão na Língua de Sinais' },
      { word: 'VER', hint: 'Perceber com a visão' },
      { word: 'LER', hint: 'Decifrar símbolos em tinta ou Braille' }
    ],
    intermediario: [
      { word: 'LIBRAS', hint: 'Língua Brasileira de Sinais' },
      { word: 'BRAILLE', hint: 'Sistema tátil para pessoas cegas' },
      { word: 'SIMBOLOS', hint: 'Representações visuais ou tátil-visuais' },
      { word: 'INCLUSAO', hint: 'Garantia de acesso e direitos a todos' }
    ],
    avancado: [
      { word: 'ACESSIBILIDADE', hint: 'Eliminação de barreiras para a autonomia' },
      { word: 'DESENHOUNIVERSAL', hint: 'Design pensado para ser usado por qualquer pessoa' },
      { word: 'COMUNICACAO', hint: 'Interação acessível em múltiplos formatos' },
      { word: 'TECNOLOGIAASSISTIVA', hint: 'Recursos que promovem a autonomia' }
    ],
    insano: [
      { word: 'ATENDIMENTOESPECIALIZADO', hint: 'Suporte pedagógico adaptado (AEE)' },
      { word: 'CIDADANIAINCLUSIVA', hint: 'Sociedade justa com igualdade de oportunidades' },
      { word: 'AUTONOMIAPESSOAL', hint: 'Capacidade de navegar e aprender sozinho' },
      { word: 'INCLUSAOSOCIAL', hint: 'Integração plena de todos os estudantes' }
    ]
  },
  desenhos: {
    iniciante: [
      { word: 'HEROI', hint: 'Personagem corajoso dos desenhos' },
      { word: 'REI', hint: 'Governante do castelo nas histórias' },
      { word: 'MAGIA', hint: 'Poder misterioso dos magos' },
      { word: 'FADA', hint: 'Ser mágico com asas pequeninas' }
    ],
    intermediario: [
      { word: 'DRAGAO', hint: 'Criatura lendária que cospe fogo' },
      { word: 'CASTELO', hint: 'Morada dos reis e princesas' },
      { word: 'PRINCESA', hint: 'Personagem nobre dos contos de fadas' },
      { word: 'DESENHO', hint: 'Animação divertida na televisão' }
    ],
    avancado: [
      { word: 'PERSONAGEM', hint: 'Figura criada para uma história ou desenho' },
      { word: 'AVENTURA', hint: 'Jornada cheia de emoção e desafios' },
      { word: 'FANTASIA', hint: 'Mundo imaginário cheio de magia' },
      { word: 'CINEMA', hint: 'Lugar onde assistimos grandes filmes' }
    ],
    insano: [
      { word: 'SUPERHEROI', hint: 'Defensor da justiça com superpoderes incríveis' },
      { word: 'EXTRAORDINARIO', hint: 'Algo incrível e fora do comum' },
      { word: 'TRANSFORMACAO', hint: 'Mudança mágica de forma do personagem' },
      { word: 'ANIMACAO', hint: 'Técnica de dar vida e movimento a ilustrações' }
    ]
  }
};

/**
 * Retorna banco de palavras filtrado por Tema e Nível de Dificuldade
 */
function getWordsByThemeAndLevel(theme = 'aleatorio', level = 'iniciante') {
  let themeKeys = [theme];
  if (theme === 'aleatorio' || !THEMATIC_DATABASES[theme]) {
    themeKeys = Object.keys(THEMATIC_DATABASES);
  }

  let combined = [];
  themeKeys.forEach(tKey => {
    const tData = THEMATIC_DATABASES[tKey];
    if (tData && tData[level]) {
      combined = combined.concat(tData[level]);
    }
  });

  if (combined.length === 0) {
    // Fallback genérico se nível não bater exatamente
    combined = THEMATIC_DATABASES.animais[level] || THEMATIC_DATABASES.animais.iniciante;
  }
  return combined;
}


// Manter compatibilidade com GAME_DATABASES antigo
const GAME_DATABASES = {
  words: {
    iniciante: getWordsByThemeAndLevel('aleatorio', 'iniciante'),
    intermediario: getWordsByThemeAndLevel('aleatorio', 'intermediario'),
    avancado: getWordsByThemeAndLevel('aleatorio', 'avancado')
  },
  syllables: {
    iniciante: [
      { word: 'BOLA', syllables: ['BO', 'LA'], hint: 'Usada no futebol' },
      { word: 'CASA', syllables: ['CA', 'SA'], hint: 'Nosso lar' },
      { word: 'GATO', syllables: ['GA', 'TO'], hint: 'Miau!' },
      { word: 'DADO', syllables: ['DA', 'DO'], hint: 'Usado em jogos' }
    ],
    intermediario: [
      { word: 'ESCOLA', syllables: ['ES', 'CO', 'LA'], hint: 'Local de estudos' },
      { word: 'AMIGO', syllables: ['A', 'MI', 'GO'], hint: 'Companheiro querido' },
      { word: 'JANELA', syllables: ['JA', 'NE', 'LA'], hint: 'Para olhar para fora' }
    ],
    avancado: [
      { word: 'ALFABETO', syllables: ['AL', 'FA', 'BE', 'TO'], hint: 'Conjunto de letras' },
      { word: 'PROFESSOR', syllables: ['PRO', 'FES', 'SOR'], hint: 'Quem ensina' },
      { word: 'COMPUTADOR', syllables: ['COM', 'PU', 'TA', 'DOR'], hint: 'Máquina digital' }
    ]
  },
  math: {
    iniciante: [
      { problem: '2 + 3', answer: '5', hint: 'Somar dois com três' },
      { problem: '4 + 1', answer: '5', hint: 'Quatro mais um' },
      { problem: '3 + 3', answer: '6', hint: 'Três mais três' }
    ],
    intermediario: [
      { problem: '5 + 7', answer: '12', hint: 'Cinco mais sete' },
      { problem: '15 - 5', answer: '10', hint: 'Quinze tirar cinco' },
      { problem: '8 + 8', answer: '16', hint: 'Oito mais oito' }
    ],
    avancado: [
      { problem: '25 + 25', answer: '50', hint: 'Vinte e cinco mais vinte e cinco' },
      { problem: '100 - 30', answer: '70', hint: 'Cem tirar trinta' },
      { problem: '45 + 55', answer: '100', hint: 'Quarenta e cinco mais cinquenta e cinco' }
    ]
  }
};

window.BRAILLE_MAP = BRAILLE_MAP;
window.getCharInfo = getCharInfo;
window.renderDualCellHTML = renderDualCellHTML;
window.dotsToChar = dotsToChar;
window.textToBrailleSequence = textToBrailleSequence;

