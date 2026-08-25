/**
 * EduBraille Audio & Speech Engine (TTS + Web Audio Synth + Haptics)
 */

const AudioEngine = (() => {
  let synth = window.speechSynthesis;
  let audioCtx = null;
  let ttsEnabled = true;
  let autoReadFocus = false;
  let currentRate = 1.0;
  let currentPitch = 1.0;
  let selectedVoice = null;

  // Inicializa o contexto de áudio do navegador na primeira interação do usuário
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Carrega vozes pt-BR disponíveis
  function loadVoices() {
    if (!synth) return;
    const voices = synth.getVoices();
    const ptVoices = voices.filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
    if (ptVoices.length > 0) {
      // Prioriza vozes do Google ou Microsoft pt-BR
      selectedVoice = ptVoices.find(v => v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Helena') || v.name.includes('Daniel')) || ptVoices[0];
    }
  }

  if (synth) {
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }

  // Síntese de Voz (TTS)
  function speak(text, interrupt = true) {
    if (!ttsEnabled || !synth || !text) return;

    if (interrupt) {
      synth.cancel();
    }

    // Limpa marcações extras para leitura mais natural
    const cleanText = text.replace(/[*_#]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = currentRate;
    utterance.pitch = currentPitch;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synth.speak(utterance);
  }

  // Fala o nome da letra e o padrão de pontos em Braille
  function speakLetter(char) {
    if (!char) return;
    const info = getCharInfo(char);
    if (!info) return;

    let textToSay = '';
    if (info.isNumber) {
      textToSay = `${info.name}. Sinal de número mais ${info.desc}.`;
    } else {
      textToSay = `Letra ${info.name}. Braille: ${info.desc}.`;
    }
    speak(textToSay);
  }

  function stopSpeech() {
    if (synth) {
      synth.cancel();
    }
  }

  // Efeitos Sonoros com Web Audio API
  function playClick() {
    initAudioContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  function playSuccess() {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Acorde Maior)
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      gain.gain.setValueAtTime(0.2, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.25);
    });
    vibrate([40, 30, 40]);
  }

  function playError() {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(120, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
    vibrate([100, 50, 100]);
  }

  function playFlip() {
    initAudioContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  function playWin() {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    // Fanfarra festiva de vitória: C5, E5, G5, C6
    const sequence = [
      { freq: 523.25, time: 0, duration: 0.15 },
      { freq: 659.25, time: 0.15, duration: 0.15 },
      { freq: 783.99, time: 0.30, duration: 0.15 },
      { freq: 1046.50, time: 0.45, duration: 0.50 }
    ];

    sequence.forEach(note => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      gain.gain.setValueAtTime(0.25, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + note.time);
      osc.stop(now + note.time + note.duration);
    });

    vibrate([80, 40, 80, 40, 150]);
  }

  // Vibração Tátil (Haptic feedback)
  function vibrate(pattern) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignora erro caso não suportado
      }
    }
  }

  // ---------------------------------------------------------------
  // Navegação guiada por voz com orientação espacial da interface
  // ---------------------------------------------------------------
  function announceSection(sectionId) {
    if (!ttsEnabled) return;

    let announcement = '';

    switch (sectionId) {
      case 'feed':
      case 'feed-section':
        announcement = 'Você está na página inicial do EduBraille Games. No topo da tela encontra-se o menu principal com opções para o Professor de AEE, Campeonato, Tabela Braille, Cores e Ajustes de Voz. No centro da tela está o catálogo de jogos acessíveis com filtros por dificuldade e tema de palavras. Na parte inferior encontra-se o rodapé pedagógico. Selecione um jogo para começar!';
        break;

      case 'teacher-aee':
      case 'teacher-section':
        announcement = 'Você está na área do Professor de AEE. No topo da tela estão os botões para retornar ao feed. No centro da tela encontra-se o painel de personalização dos jogos, seleção de dificuldade, escolha de temas pedagógicos e cadastro de palavras personalizadas. Abaixo está o relatório de progresso e estatísticas de atividades do aluno.';
        break;

      case 'championship':
      case 'championship-section':
        if (window.Championship && window.Championship.isLoggedIn()) {
          const st = window.Championship.getActiveStudent();
          announcement = `Olá, ${st ? st.nickname : ""}. Você está na sua trajetória no Campeonato EduBraille. Seu nível atual é ${st ? st.currentLevel : "Fácil"}. Sua pontuação é de ${st ? st.score : 0} pontos. No centro da tela está o botão Iniciar agora sua trajetória. Abaixo estão as opções de navegação. No canto superior direito está a opção para sair ou trocar de aluno.`;
        } else {
          announcement = 'Você está na página do Campeonato EduBraille. Selecione seu perfil cadastrado ou crie um novo cadastro para iniciar sua trajetória.';
        }
        break;

      case 'game-selection':
        announcement = 'Você está na página de escolha de jogos. A dificuldade não precisa ser escolhida. Ela é definida automaticamente pelo seu nível atual. Escolha um dos jogos disponíveis para começar.';
        break;

      case 'game-section':
      case 'game':
        announcement = 'Você está na tela de jogo ativo. No topo da tela encontra-se o botão para voltar para sua trajetória. No centro encontra-se a área principal do jogo, compatível com teclado convencional e teclado adaptado para Braille. No lado direito ou inferior encontra-se o painel do professor.';
        break;

      case 'reference-section':
      case 'reference':
        announcement = 'Você está na página de Tabela de Referência Braille. No topo da tela encontra-se o campo de busca de caracteres. No centro estão os cartões táteis apresentando todas as 26 letras do alfabeto, caracteres acentuados e números com seus respectivos pontos elevados de 1 a 6.';
        break;

      default:
        announcement = 'Navegação realizada com sucesso.';
    }

    speak(announcement, true);
  }

  function speakGameResult(result) {
    if (!ttsEnabled || !result) return;
    const { gameName, score, correctWords, totalWords, level, won } = result;
    let text = `Partida finalizada no jogo ${gameName || 'Braille'}. `;
    if (won !== undefined) {
      text += won ? 'Parabéns, você venceu! ' : 'Fim de jogo! ';
    }
    if (correctWords !== undefined && totalWords !== undefined) {
      text += `Você acertou ${correctWords} de ${totalWords} palavras. `;
    }
    if (score !== undefined) {
      text += `Sua pontuação nesta partida foi ${score} pontos. `;
    }
    if (level) {
      text += `Nível atual: ${level}.`;
    }
    speak(text, true);
  }

  // Getters & Setters de Configurações
  function toggleTTS(enabled) {
    ttsEnabled = enabled !== undefined ? enabled : !ttsEnabled;
    if (!ttsEnabled) stopSpeech();
    return ttsEnabled;
  }

  function setAutoReadFocus(enabled) {
    autoReadFocus = enabled;
  }

  function setRate(rate) {
    currentRate = parseFloat(rate) || 1.0;
  }

  function isTTSEnabled() {
    return ttsEnabled;
  }

  // Escutador global de foco para leitura por voz de elementos com aria-label / data-tts
  document.addEventListener('focusin', (e) => {
    if (!autoReadFocus || !ttsEnabled) return;
    const target = e.target;
    if (target && target.matches('button, a, input, [tabindex="0"], [role="button"]')) {
      const textToRead = target.getAttribute('aria-label') || target.getAttribute('title') || target.innerText;
      if (textToRead && textToRead.length < 150) {
        speak(textToRead, true);
      }
    }
  });

  // Registra interação do usuário para desbloquear AudioContext
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, initAudioContext, { once: true });
  });

  return {
    speak,
    speakLetter,
    stopSpeech,
    announceSection,
    speakGameResult,
    playClick,
    playSuccess,
    playError,
    playFlip,
    playWin,
    vibrate,
    toggleTTS,
    setAutoReadFocus,
    setRate,
    isTTSEnabled
  };
})();

window.AudioEngine = AudioEngine;


