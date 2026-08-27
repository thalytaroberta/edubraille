useEffect(() => {
  const handleKeyPress = (event) => {
    const letra = event.key.toLowerCase();
    
    // Verifica se a tecla pressionada é uma letra de 'a' a 'z'
    if (letra.length === 1 && letra >= 'a' && letra <= 'z') {
      // Substitua 'processarJogada' pela função original do seu clique de botão
      processarJogada(letra); 
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);