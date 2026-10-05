// *** Este código foi gerado por IA apenas para fins de comparação *** //
// *** Ele implementa a mesma aplicação que App.js sem utilizar os react hooks ***//

import './App.css';
import { Component, createContext } from 'react';

// Função auxiliar para resolver o caminho da imagem
const getPath = (caminhoDaImagem) => {
  return `${process.env.PUBLIC_URL}/${caminhoDaImagem}`;
};

// Contexto do React (versão para classes)
const SpecimenContext = createContext();

// Botão para fazer carinho no Weber (Classe)
class PetButton extends Component {
  // Consumindo o contexto sem useContext
  static contextType = SpecimenContext;

  state = {
    secondsLeft: 0
  };

  intervalId = null;

  // Limpeza de timer para evitar vazamento de memória se o componente sumir da tela
  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startCooldown = (totalSeconds) => {
    this.setState({ secondsLeft: totalSeconds });

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.secondsLeft <= 1) {
          clearInterval(this.intervalId);
          return { secondsLeft: 0 };
        }
        return { secondsLeft: prevState.secondsLeft - 1 };
      });
    }, 1000);
  };

  handleClick = () => {
    const { changeImageTemporarily } = this.context;

    changeImageTemporarily(
      getPath('images/weber_pet.gif'),
      getPath('images/weber_idle.gif')
    );
    this.startCooldown(5);
  };

  render() {
    const { secondsLeft } = this.state;

    return (
      <button 
        className="cute-btn" 
        onClick={this.handleClick} 
        disabled={secondsLeft > 0}
      >
        {secondsLeft ? `Aguarde ${secondsLeft}s para fazer mais carinho` : 'Fazer carinho'}
      </button>
    );
  }
}

// Botão para alimentar o Weber (Classe)
class FeedButton extends Component {
  static contextType = SpecimenContext;

  state = {
    secondsLeft: 0
  };

  intervalId = null;

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startCooldown = (totalSeconds) => {
    this.setState({ secondsLeft: totalSeconds });

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.secondsLeft <= 1) {
          clearInterval(this.intervalId);
          return { secondsLeft: 0 };
        }
        return { secondsLeft: prevState.secondsLeft - 1 };
      });
    }, 1000);
  };

  handleClick = () => {
    const { changeImageTemporarily } = this.context;

    changeImageTemporarily(
      getPath('images/weber_eat.gif'),
      getPath('images/weber_idle.gif'),
      1500
    );
    this.startCooldown(10);
  };

  render() {
    const { secondsLeft } = this.state;

    return (
      <button 
        className="cute-btn" 
        onClick={this.handleClick} 
        disabled={secondsLeft > 0}
      >
        {secondsLeft ? `Aguarde ${secondsLeft}s para dar mais comida` : 'Dar comida'}
      </button>
    );
  }
}

// Imagem do Weber (Classe)
class SpecimenImage extends Component {
  static contextType = SpecimenContext;

  render() {
    const { currentImage } = this.context;

    return (
      <img
        src={currentImage}
        alt="weber"
        style={{ width: '200px', height: '200px', objectFit: 'contain', borderRadius: '15px' }}
      />
    );
  }
}

// Componente Raiz (Classe)
export default class App extends Component {
  state = {
    currentImage: getPath('images/weber_idle.gif')
  };

  timeoutId = null;

  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  changeImageTemporarily = (newImage, oldImage = this.state.currentImage, duration = 2000) => {
    this.setState({ currentImage: newImage });

    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.setState({ currentImage: oldImage });
    }, duration);
  };

  render() {
    const contextValue = {
      currentImage: this.state.currentImage,
      changeImageTemporarily: this.changeImageTemporarily
    };

    return (
      <SpecimenContext.Provider value={contextValue}>
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
}
