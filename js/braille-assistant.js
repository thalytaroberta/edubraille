/**
 * EduBraille Assistant — "Tire sua dúvida sobre Braille"
 * Assistente pedagógico e acessível para tirar dúvidas sobre o Sistema Braille
 * com entrada por texto/voz e respostas fundamentadas nas normas oficiais do MEC / IBC.
 */

const BrailleAssistant = (() => {
  let recognition = null;
  let isListening = false;
  let currentUtterance = null;
  let lastAnswerText = '';

  // Base de Conhecimento Oficial MEC / IBC / CBB
  const OFFICIAL_KNOWLEDGE_BASE = [
    {
      keywords: ['o que e', 'conceito', 'definicao', 'sistema braille', 'para que serve', 'como funciona'],
      question: 'O que é o Sistema Braille?',
      answer: 'O Sistema Braille é um código universal de leitura e escrita tátil utilizado por pessoas cegas ou com baixa visão. Ele é baseado em uma cela de 6 pontos em relevo, dispostos em duas colunas verticais de três pontos, permitindo 64 combinações diferentes que representam letras, números, sinais de pontuação, símbolos matemáticos, químicos e notação musical.',
      source: 'MEC / IBC — Grafia Braille para a Língua Portuguesa (Portaria Ministerial nº 2.678/2002)'
    },
    {
      keywords: ['quem criou', 'quem inventou', 'criador', 'louis braille', 'luis braille', 'historia', 'ano', 'origem'],
      question: 'Quem inventou o Sistema Braille e quando?',
      answer: 'O sistema foi inventado na França pelo jovem Louis Braille (1809–1852). Louis perdeu a visão na infância e, aos 15 anos, em 1824, aperfeiçoou um sistema de código militar tátil criado por Charles Barbier. No Brasil, o Braille foi introduzido em 1854 por José Álvares de Azevedo, com a fundação do Imperial Instituto dos Meninos Cegos (atual Instituto Benjamin Constant - IBC), no Rio de Janeiro.',
      source: 'MEC / Instituto Benjamin Constant (IBC) — Memória Histórica da Educação de Cegos no Brasil'
    },
    {
      keywords: ['cela', 'celula', 'quantos pontos', 'pontos', 'estrutura', 'matriz'],
      question: 'Como é formada a cela Braille e como são numerados os pontos?',
      answer: 'A cela Braille possui 6 pontos distribuídos em duas colunas paralelas: a coluna da esquerda contém os pontos 1 (superior), 2 (médio) e 3 (inferior); a coluna da direita contém os pontos 4 (superior), 5 (médio) e 6 (inferior). As combinações desses 6 pontos formam todos os caracteres da escrita.',
      source: 'Comissão Brasileira do Braille (CBB) / MEC — Normas Técnicas para a Produção de Textos em Braille'
    },
    {
      keywords: ['maiuscula', 'letra maiuscula', 'sinal de maiuscula', 'caixa alta', 'ponto 6'],
      question: 'Como indicar letras maiúsculas em Braille?',
      answer: 'Na Língua Portuguesa, a letra maiúscula é indicada pelo sinal formado pelo ponto 6 isolado imediatamente antes da letra. Para escrever uma palavra inteira em caixa alta (todas maiúsculas), utiliza-se o sinal de maiúscula duplo (ponto 6 seguido de outro ponto 6) antes da palavra.',
      source: 'MEC / IBC — Grafia Braille para a Língua Portuguesa, Seção de Sinais Especiais'
    },
    {
      keywords: ['numero', 'numeros', 'algarismo', 'sinal de numero', 'matematica'],
      question: 'Como são representados os números no Sistema Braille?',
      answer: 'Os números em Braille utilizam as mesmas configurações das 10 primeiras letras do alfabeto (de A até J), antecedidas pelo "sinal de número" (formado pelos pontos 3, 4, 5 e 6). Por exemplo: o número 1 é o sinal de número seguido da letra A (ponto 1); o número 2 é o sinal de número mais a letra B (pontos 1 e 2); o número 0 é o sinal de número mais a letra J (pontos 2, 4 e 5).',
      source: 'MEC / CBB — Código Matemático Unificado para a Língua Portuguesa (CMU)'
    },
    {
      keywords: ['acento', 'acentuacao', 'vogal acentuada', 'agudo', 'circunflexo', 'til', 'cedilha'],
      question: 'Como funcionam os acentos e a cedilha em Braille?',
      answer: 'No Braille em Língua Portuguesa, as letras acentuadas possuem celas próprias e exclusivas, sem necessidade de um símbolo de acento separado. Exemplos oficiais: Á (pontos 1, 2, 3, 5, 6), É (pontos 1, 2, 3, 4, 6), Í (pontos 3, 4), Ó (pontos 3, 4, 6), Ú (pontos 2, 3, 4, 5, 6), Â (pontos 1, 6), Ê (pontos 1, 2, 6), Ô (pontos 1, 4, 5, 6), Ã (pontos 3, 4, 5), Õ (pontos 2, 4, 6) e Ç (pontos 1, 2, 3, 4, 6).',
      source: 'MEC / IBC — Grafia Braille para a Língua Portuguesa'
    },
    {
      keywords: ['reglete', 'puncao', 'puncionar', 'escrever a mao', 'equipamento'],
      question: 'O que é a reglete e o punção?',
      answer: 'A reglete e o punção são os instrumentos manuais tradicionais para a escrita em Braille. A reglete é uma placa com celas vazadas onde se prende o papel de alta gramatura (geralmente 120g a 180g), e o punção é o estilete com ponta de metal anatômica usado para pressionar o papel e formar os pontos em relevo. Na reglete, a escrita é feita da direita para a esquerda, para que a leitura seja feita da esquerda para a direita ao virar a folha.',
      source: 'Instituto Benjamin Constant (IBC) — Recursos Didáticos e Tecnologias para a Educação Especial'
    },
    {
      keywords: ['linha braille', 'display braille', 'tecnologia', 'leitor de tela', 'computador', 'acessibilidade digital'],
      question: 'O que é uma linha Braille e como funciona no computador?',
      answer: 'A Linha Braille (ou Display Braille) é um dispositivo eletrônico de tecnologia assistiva conectado ao computador, tablet ou celular via USB ou Bluetooth. Ela possui pequenas células táteis eletromecânicas que sobem e descem pinos em tempo real, traduzindo o texto exibido na tela ou lido por softwares leitores de tela (como NVDA, JAWS e VoiceOver) diretamente para o relevo tátil sob os dedos do usuário.',
      source: 'MEC / Secretaria de Educação Continuada, Alfabetização, Diversidade e Inclusão (SECADI)'
    },
    {
      keywords: ['aee', 'atendimento educacional especializado', 'sala de recursos', 'escola', 'inclusao'],
      question: 'Qual o papel do AEE (Atendimento Educacional Especializado) no ensino do Braille?',
      answer: 'O AEE (Atendimento Educacional Especializado) apoia a aprendizagem do aluno com deficiência visual no contraturno escolar, ofertando o ensino do Sistema Braille, orientação e mobilidade, uso do soroban (ábaco para cálculo), tecnologias assistivas e adaptação de materiais pedagógicos em relevo e tinta, garantindo a plena inclusão escolar conforme a Política Nacional de Educação Especial.',
      source: 'MEC / Secretaria de Educação Especial — Diretrizes Operacionais da Educação Especial para o AEE'
    },
    {
      keywords: ['dia do braille', 'dia nacional', 'dia mundial', 'comemoracao', 'data'],
      question: 'Quando é comemorado o Dia do Braille?',
      answer: 'O Dia Mundial do Braille é celebrado em 4 de janeiro, data de nascimento de Louis Braille. No Brasil, também se comemora o Dia Nacional do Sistema Braille em 8 de abril, em homenagem ao nascimento de José Álvares de Azevedo, o patrono da educação de cegos no Brasil.',
      source: 'Lei Federal nº 12.266/2010 e Organização das Nações Unidas (ONU)'
    },
    {
      keywords: ['perkins', 'maquina de escrever braille', 'maquina braille'],
      question: 'O que é a máquina de escrever Braille Perkins?',
      answer: 'A máquina Perkins é o equipamento mecânico clássico mais utilizado no mundo para digitação em Braille. Ela possui apenas 6 teclas principais (correspondentes aos 6 pontos da cela Braille), uma barra de espaço central, tecla de retrocesso e avanço de linha, permitindo digitar uma cela inteira de uma só vez pressionando as teclas simultaneamente.',
      source: 'Instituto Benjamin Constant (IBC) — Tecnologia Assistiva e Produção Braille'
    },
    {
      keywords: ['soroban', 'calculo', 'matematica cego', 'abaco'],
      question: 'O que é o Soroban e como ele auxilia alunos cegos?',
      answer: 'O Soroban é um ábaco adaptado com feltro ou borracha na base das contas para evitar que elas se movam com o toque das mãos. Ele permite a estudantes cegos realizar cálculos matemáticos com rapidez (adição, subtração, multiplicação, divisão, frações, raízes e potências) de maneira precisa e tátil.',
      source: 'MEC / IBC — Cadernos Pedagógicos do Soroban'
    }
  ];

  function init() {
    setupSpeechRecognition();
  }

  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isListening = true;
        updateUIState('listening');
        if (typeof AudioEngine !== 'undefined') {
          AudioEngine.speak('Microfone ativado. Pode falar sua dúvida sobre Braille.');
        }
      };

      recognition.onresult = (event) => {
        isListening = false;
        const transcript = event.results[0][0].transcript;
        const inputField = document.getElementById('braille-question-input');
        if (inputField) {
          inputField.value = transcript;
        }
        updateUIState('processing');
        processQuestion(transcript);
      };

      recognition.onerror = (event) => {
        isListening = false;
        updateUIState('idle');
        const msg = event.error === 'not-allowed'
          ? 'Permissão de microfone negada. Permita o microfone no navegador ou digite sua dúvida.'
          : 'Não foi possível ouvir a fala com clareza. Tente falar mais próximo ao microfone ou digite sua pergunta.';
        showErrorInBox(msg);
        if (typeof AudioEngine !== 'undefined') AudioEngine.speak(msg);
      };

      recognition.onend = () => {
        isListening = false;
        const stateEl = document.getElementById('qa-status-pill');
        if (stateEl && stateEl.getAttribute('data-state') === 'listening') {
          updateUIState('idle');
        }
      };
    }
  }

  function toggleVoiceInput() {
    if (!recognition) {
      const msg = 'O reconhecimento de voz não é suportado pelo seu navegador atual. Por favor, digite sua pergunta no campo de texto.';
      showErrorInBox(msg);
      if (typeof AudioEngine !== 'undefined') AudioEngine.speak(msg);
      return;
    }

    if (isListening) {
      recognition.stop();
      isListening = false;
      updateUIState('idle');
    } else {
      try {
        stopAudio();
        recognition.start();
      } catch (e) {
        recognition.stop();
        setTimeout(() => {
          try { recognition.start(); } catch (err) {}
        }, 200);
      }
    }
  }

  function submitTypedQuestion() {
    const inputField = document.getElementById('braille-question-input');
    if (!inputField) return;
    const query = inputField.value.trim();
    if (!query) {
      inputField.focus();
      if (typeof AudioEngine !== 'undefined') {
        AudioEngine.speak('Por favor, digite ou fale uma dúvida sobre Braille.');
      }
      return;
    }
    stopAudio();
    updateUIState('processing');
    processQuestion(query);
  }

  function processQuestion(rawQuery) {
    updateUIState('searching');

    setTimeout(() => {
      const responseObj = findBestAnswer(rawQuery);
      displayAnswer(responseObj);
      updateUIState('speaking');
      speakAnswer(responseObj.answer, responseObj.source);
    }, 600);
  }

  function findBestAnswer(query) {
    const normalized = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ');

    const words = normalized.split(/\s+/).filter(w => w.length > 1);

    let bestMatch = null;
    let highestScore = 0;

    OFFICIAL_KNOWLEDGE_BASE.forEach(item => {
      let score = 0;
      item.keywords.forEach(kw => {
        const normKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (normalized.includes(normKw)) {
          score += 5;
        }
        const kwWords = normKw.split(/\s+/);
        kwWords.forEach(kww => {
          if (words.includes(kww)) score += 2;
        });
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && highestScore >= 4) {
      return {
        matched: true,
        question: bestMatch.question,
        answer: bestMatch.answer,
        source: bestMatch.source
      };
    }

    // Resposta padrão caso não haja correspondência exata suficiente
    return {
      matched: false,
      question: query,
      answer: `Não encontramos uma resposta exata nos manuais oficiais para a sua consulta ("${query}"). Você pode perguntar sobre: como funciona a cela Braille, quem foi Louis Braille, como fazer números, letras maiúsculas, vogais acentuadas, o que é reglete, punção ou linha Braille.`,
      source: 'MEC / IBC — Consulta ao Repositório de Normas do Sistema Braille'
    };
  }

  function displayAnswer(result) {
    const answerContainer = document.getElementById('braille-qa-answer-box');
    if (!answerContainer) return;

    lastAnswerText = result.answer;

    answerContainer.style.display = 'block';
    answerContainer.innerHTML = `
      <div class="qa-answer-card" role="region" aria-label="Resposta sobre Braille">
        <div class="qa-answer-header">
          <span class="qa-topic-title">📖 Resposta Oficial:</span>
          <span class="qa-source-badge">🏛️ ${result.source}</span>
        </div>
        <p class="qa-answer-text">${result.answer}</p>
        <div class="qa-answer-actions">
          <button type="button" class="btn btn-primary btn-sm" onclick="BrailleAssistant.replayAudio()" aria-label="Ouvir resposta em voz alta novamente">
            🔊 Ouvir Novamente
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="BrailleAssistant.stopAudio()" aria-label="Parar leitura em áudio">
            ⏹️ Parar Áudio
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="BrailleAssistant.clearQuestion()" aria-label="Fazer uma nova pergunta sobre Braille">
            🧹 Nova Pergunta
          </button>
        </div>
      </div>
    `;

    answerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function speakAnswer(text, source) {
    if (typeof AudioEngine !== 'undefined') {
      const speechText = `${text}. Fonte consultada: ${source}.`;
      AudioEngine.speak(speechText);
    }
  }

  function replayAudio() {
    if (lastAnswerText && typeof AudioEngine !== 'undefined') {
      AudioEngine.speak(lastAnswerText);
      updateUIState('speaking');
    }
  }

  function stopAudio() {
    if (typeof AudioEngine !== 'undefined') {
      AudioEngine.stopSpeech();
    }
    if (isListening && recognition) {
      recognition.stop();
      isListening = false;
    }
    updateUIState('idle');
  }

  function clearQuestion() {
    stopAudio();
    const inputField = document.getElementById('braille-question-input');
    if (inputField) {
      inputField.value = '';
      inputField.focus();
    }
    const answerContainer = document.getElementById('braille-qa-answer-box');
    if (answerContainer) {
      answerContainer.style.display = 'none';
      answerContainer.innerHTML = '';
    }
    updateUIState('idle');
  }

  function updateUIState(state) {
    const micBtn = document.getElementById('btn-qa-mic');
    const statusPill = document.getElementById('qa-status-pill');
    if (!statusPill) return;

    statusPill.setAttribute('data-state', state);

    if (state === 'listening') {
      if (micBtn) micBtn.classList.add('recording');
      statusPill.innerHTML = '<span class="status-dot pulsing red"></span> 🎙️ <strong>Ouvindo sua dúvida...</strong> Fale agora!';
      statusPill.style.display = 'inline-flex';
    } else if (state === 'processing') {
      if (micBtn) micBtn.classList.remove('recording');
      statusPill.innerHTML = '<span class="status-dot pulsing yellow"></span> ⚙️ <strong>Processando áudio...</strong>';
      statusPill.style.display = 'inline-flex';
    } else if (state === 'searching') {
      if (micBtn) micBtn.classList.remove('recording');
      statusPill.innerHTML = '<span class="status-dot pulsing blue"></span> 🔍 <strong>Consultando fontes oficiais do MEC/IBC...</strong>';
      statusPill.style.display = 'inline-flex';
    } else if (state === 'speaking') {
      if (micBtn) micBtn.classList.remove('recording');
      statusPill.innerHTML = '<span class="status-dot pulsing green"></span> 🔊 <strong>Lendo a resposta...</strong>';
      statusPill.style.display = 'inline-flex';
    } else {
      if (micBtn) micBtn.classList.remove('recording');
      statusPill.style.display = 'none';
      statusPill.innerHTML = '';
    }
  }

  function showErrorInBox(msg) {
    const answerContainer = document.getElementById('braille-qa-answer-box');
    if (!answerContainer) return;
    answerContainer.style.display = 'block';
    answerContainer.innerHTML = `
      <div class="qa-error-card" role="alert">
        <p>⚠️ ${msg}</p>
      </div>
    `;
  }

  /**
   * Renderiza a caixa de dúvidas completa na página inicial
   */
  function renderQABoxHTML() {
    return `
      <div class="braille-qa-section-card" role="region" aria-labelledby="braille-qa-main-title">
        <div class="qa-header-row">
          <div class="qa-title-wrap">
            <span class="qa-icon-bubble" aria-hidden="true">💡</span>
            <div>
              <h2 id="braille-qa-main-title">Tire sua dúvida sobre Braille</h2>
              <p class="qa-subtitle">Pergunte por texto ou clique no microfone para falar. Respostas com fontes oficiais do MEC e IBC.</p>
            </div>
          </div>
          <div id="qa-status-pill" class="qa-status-pill" style="display: none;" role="status" aria-live="polite"></div>
        </div>

        <form class="qa-input-form" onsubmit="BrailleAssistant.submitTypedQuestion(); return false;">
          <div class="qa-search-bar-wrap">
            <label for="braille-question-input" class="sr-only">Digite ou fale sua dúvida sobre Braille</label>
            <input 
              type="text" 
              id="braille-question-input" 
              class="qa-search-input" 
              placeholder="Digite sua dúvida sobre Braille..." 
              autocomplete="off"
              aria-label="Digite sua dúvida sobre o Sistema Braille">
            
            <button 
              type="button" 
              id="btn-qa-mic" 
              class="btn btn-qa-mic" 
              onclick="BrailleAssistant.toggleVoiceInput()" 
              title="Falar dúvida com o microfone"
              aria-label="Gravar pergunta por voz no microfone">
              <span class="mic-icon" aria-hidden="true">🎙️</span>
              <span class="mic-text">Falar</span>
            </button>

            <button 
              type="submit" 
              class="btn btn-primary btn-qa-submit" 
              aria-label="Enviar pergunta sobre Braille">
              🔍 Perguntar
            </button>
          </div>
        </form>

        <!-- Sugestões de Dúvidas Frequentes Rápidas -->
        <div class="qa-quick-suggestions" role="group" aria-label="Perguntas rápidas sugeridas">
          <span class="quick-lbl">Exemplos rápidos:</span>
          <button type="button" class="btn-quick-tag" onclick="BrailleAssistant.askQuick('Quem inventou o Braille?')">Quem criou o Braille?</button>
          <button type="button" class="btn-quick-tag" onclick="BrailleAssistant.askQuick('Como são feitos os números em Braille?')">Números em Braille</button>
          <button type="button" class="btn-quick-tag" onclick="BrailleAssistant.askQuick('Como fazer letras maiúsculas em Braille?')">Letras Maiúsculas</button>
          <button type="button" class="btn-quick-tag" onclick="BrailleAssistant.askQuick('O que é a reglete e o punção?')">Reglete e Punção</button>
          <button type="button" class="btn-quick-tag" onclick="BrailleAssistant.askQuick('O que é uma Linha Braille?')">Linha Braille</button>
        </div>

        <!-- Container da Resposta -->
        <div id="braille-qa-answer-box" class="braille-qa-answer-box" style="display: none;"></div>
      </div>
    `;
  }

  function askQuick(questionText) {
    const inputField = document.getElementById('braille-question-input');
    if (inputField) {
      inputField.value = questionText;
    }
    stopAudio();
    updateUIState('processing');
    processQuestion(questionText);
  }

  return {
    init,
    toggleVoiceInput,
    submitTypedQuestion,
    askQuick,
    replayAudio,
    stopAudio,
    clearQuestion,
    renderQABoxHTML
  };
})();

window.BrailleAssistant = BrailleAssistant;
