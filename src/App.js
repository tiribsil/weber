import { useState, useEffect, createContext, useContext } from 'react';

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

// Botão para reenviar SMS
function PetButton() {
  const { currentImage, changeImageTemporarily } = useContext(SpecimenContext);
  const { secondsLeft, startCooldown } = useCooldown(5);

  const handleClick = () => {
    changeImageTemporarily('images/weber_pet.gif', 'images/weber_idle.gif');
    startCooldown();
  }

  return (
    <button onClick={handleClick} disabled={secondsLeft}>
      {secondsLeft ? `Aguarde ${secondsLeft}s para fazer mais carinho` : 'Fazer carinho'}
    </button>
  );
}

// Botão para reenviar E-mail
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
    <button onClick={handleClick} disabled={secondsLeft}>
      {secondsLeft ? `Aguarde ${secondsLeft}s para dar mais comida` : 'Dar comida'}
    </button>
  );
}

function SpecimenImage() {
  const { currentImage } = useContext(SpecimenContext);

  return (
    <img
      src={currentImage}
      alt=""
      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
    />
  );
}

export default function App() {
  const [currentImage, setCurrentImage] = useState('images/weber_idle.gif');
  const changeImageTemporarily = (newImage, oldImage = currentImage, duration = 2000) => {
    setCurrentImage(newImage);
    setTimeout(() => {
      setCurrentImage(oldImage);
    }, duration);
  }

  return (
    <SpecimenContext.Provider value={{ currentImage, changeImageTemporarily }}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        <SpecimenImage />
      </div>
      <div style={{ display: 'flex', gap: '10px', padding: '20px' }}>
        <PetButton />
        <FeedButton />
      </div>
    </SpecimenContext.Provider>
  );
}