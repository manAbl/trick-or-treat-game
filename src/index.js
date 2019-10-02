import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';
import { Game } from './Game';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faArrowDown, faArrowLeft, faArrowUp, faArrowRight } from '@fortawesome/free-solid-svg-icons';

library.add(fas, faArrowDown, faArrowLeft, faArrowUp, faArrowRight)

const App = function() {
  const boardSizeX = 10;
  const boardSizeY = 10;

  return (
    <div className="App">
      <Game boardSizeX={boardSizeX} boardSizeY={boardSizeY} />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
