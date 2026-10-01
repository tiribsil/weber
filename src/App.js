import './App.css';
import { useState, useEffect, createContext, useContext } from 'react';

// Precisamos de um contexto para que os componentes possam compartilhar
// o estado (imagem atual do Weber) e a capacidade de mudá-lo
const SpecimenContext = createContext();

// Custom Hook: contém a lógica de botão com cooldown
function useCooldown(totalSeconds = 10) {
  // Criamos uma variável de estado para salvar o tempo para poder usar o botão novamente, inicialmente zerado
  // Além de uma função responsável por alterar esse tempo
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    // Acabou o cooldown
    if (secondsLeft <= 0) return;

    // Faz o estado mudar daqui a 1 segundo, mudando o texto do botão
    // Quando o estado mudar, o useEffect será chamado novamente, e assim por diante até zerar
    const interval = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    // Para o relógio assim que o estado mudar ou zerar
    return () => clearInterval(interval);
  }, [secondsLeft]); // Chamado sempre que o estado secondsLeft mudar

  // O que retornaremos será uma função que muda o estado para ativo
  return { secondsLeft, startCooldown: () => setSecondsLeft(totalSeconds) };
}

// Botão para fazer carinho no Weber
function PetButton() {
  const { currentImage, changeImageTemporarily } = useContext(SpecimenContext);
  const { secondsLeft, startCooldown } = useCooldown(5);

  const handleClick = () => {
    changeImageTemporarily('images/weber_pet.gif', 'images/weber_idle.gif');
    startCooldown();
  }

  return (
    <button className="cute-btn" onClick={handleClick} disabled={secondsLeft}>
      {secondsLeft ? `Aguarde ${secondsLeft}s para fazer mais carinho` : 'Fazer carinho'}
    </button>
  );
}

// Botão para alimentar o Weber
function FeedButton() {
  // Se não tivéssemos feito o Custom Hook, teriamos que escrever a mesma lógica de novo
  // Mas fica muito mais simples separar a lógica em um hook e usar ele várias vezes
  const { secondsLeft, startCooldown } = useCooldown(10);

  const { currentImage, changeImageTemporarily } = useContext(SpecimenContext);
  const handleClick = () => {
    changeImageTemporarily('images/weber_eat.gif', 'images/weber_idle.gif', 1500);
    startCooldown();
  }

  return (
    <button className="cute-btn" onClick={handleClick} disabled={secondsLeft}>
      {secondsLeft ? `Aguarde ${secondsLeft}s para dar mais comida` : 'Dar comida'}
    </button>
  );
}

function SpecimenImage() {
  const { currentImage } = useContext(SpecimenContext);

  return (
    <img
      src={currentImage}
      alt="weber"
      style={{ width: '200px', height: '200px', objectFit: 'contain', borderRadius: '15px' }}
    />
  );
}

export default function App() {
  const [currentImage, setCurrentImage] = useState('images/weber_idle.gif');
  // Como contexto, em vez de passar a função de mudar a imagem diretamente,
  // passamos uma função que muda a imagem temporariamente, e depois volta para a imagem anterior
  const changeImageTemporarily = (newImage, oldImage = currentImage, duration = 2000) => {
    setCurrentImage(newImage);
    setTimeout(() => {
      setCurrentImage(oldImage);
    }, duration);
  }

  return (
    <SpecimenContext.Provider value={{ currentImage, changeImageTemporarily }}>
      <div className="app-container">
        
        <header className="cute-header">
          <h1>Weber</h1>
        </header>

        <div className="pet-card">
          <SpecimenImage />
        </div>
        
        <div className="button-container">
          <PetButton />
          <FeedButton />
        </div>

      </div>
    </SpecimenContext.Provider>
  );
}