import React, { Component, Fragment, createRef } from 'react';

import { ScoreBoard } from './ScoreBoard';
import Instructions from './Instructions';

class Game extends Component {
  constructor(props) {
    super(props);
    const { boardSizeX, boardSizeY } = props;
    this.spritesPos = this.generateSpritesPos(boardSizeX, boardSizeY);
    this.moves = 0; // please check readme
    this.remainingSprites = boardSizeY;
    this.boardRef = createRef();
    // initially user is placed in center
    this.state = {
      userPos: {
        x: Math.floor(boardSizeX / 2),
        y: Math.floor(boardSizeY / 2),
      },
      hasFinished: false,
      username: null,
      isMovesSaved: false,
    };
  }

  componentDidMount() {
    this.focusBoard();
  }

  focusBoard() {
    const boardRef = this.boardRef.current;
    if (boardRef) {
      boardRef.focus();
    }
  }

  generateSpritesPos(boardSizeX, boardSizeY) {
    const spritesPos = [];
    for (let i = 0; i < boardSizeY; i += 1) {
      const spritePos = Math.floor(Math.random() * boardSizeX);
      spritesPos.push(spritePos);
    }

    // index is the row number and spritesPos[key] is the column number
    return spritesPos;
  }

  saveMoves() {
    const user = {
      name: this.state.username,
      moves: this.moves,
    };

    const jsonSavedUserMoves = window.localStorage.getItem('userMoves');

    const savedUserMoves = jsonSavedUserMoves ? JSON.parse(jsonSavedUserMoves) : [];

    const listUsers = [...savedUserMoves, user];
    localStorage.setItem('userMoves', JSON.stringify(listUsers));

      this.setState({ isMovesSaved: true });
    }

  updateMove({ x, y }) {
    if (this.spritesPos[y] === x) {
      this.spritesPos[y] = -1;
      this.remainingSprites -= 1;
    }

    const hasFinished = this.remainingSprites === 0;

    if (!this.state.hasFinished && hasFinished) {
      this.setState({
        hasFinished: true,
      });
    }
  }

  moveUp = ({ userPos }) => {
    const userPosY = userPos.y;
    let newY;

    if (userPosY > 0) {
      newY = userPosY - 1;
      this.moves += 1;
    } else {
      newY = userPosY;
    }

    const newUserPos = {
      x: userPos.x,
      y: newY,
    };

    return {
      userPos: newUserPos,
    };
  };

  moveDown = ({ userPos }) => {
    const userPosY = userPos.y;
    let newY;
    const { boardSizeY } = this.props;

    if (userPosY < boardSizeY - 1) {
      newY = userPosY + 1;
      this.moves += 1;
    } else {
      newY = userPosY;
    }

    const newUserPos = {
      x: userPos.x,
      y: newY,
    };

    return {
      userPos: newUserPos,
    };
  };

  moveLeft = ({ userPos }) => {
    const userPosX = userPos.x;
    let newX;

    if (userPosX > 0) {
      newX = userPosX - 1;
      this.moves += 1;
    } else {
      newX = userPosX;
    }

    const newUserPos = {
      x: newX,
      y: userPos.y,
    };

    return {
      userPos: newUserPos,
    };
  };

  moveRight = ({ userPos }) => {
    const userPosX = userPos.x;
    let newX;
    const { boardSizeX } = this.props;

    if (userPosX < boardSizeX - 1) {
      newX = userPosX + 1;
      this.moves += 1;
    } else {
      newX = userPosX;
    }

    const newUserPos = {
      x: newX,
      y: userPos.y,
    };

    return {
      userPos: newUserPos,
    };
  };

  handleGameClick = () => {
    this.focusBoard();
  };

  keyAndClickHandler = event => {
    const { key } = event;
    const arrowMapping = {
      ArrowLeft: this.moveLeft,
      ArrowRight: this.moveRight,
      ArrowUp: this.moveUp,
      ArrowDown: this.moveDown,
    };
    const stateUpdater = arrowMapping[key];
    this.setState(stateUpdater, () => this.updateMove(this.state.userPos));
  };

  renderUsernameForm() {
    return (
      <form className="username-form">
        <input
          type="text"
          className="username-input"
          placeholder="Your name..."
          autoFocus
          onChange={e => this.setState({ username: e.target.value })}
        />
        <button
          type="submit"
          className="username-submit"
          onClick={() => this.saveMoves()}
        >
          Save
        </button>
      </form>
    );
  }

  renderBoard(boardSizeX, boardSizeY) {
    const {
      userPos: { x: userPosX, y: userPosY },
    } = this.state;
    const markup = [];
    for (let i = 0; i < boardSizeY; i++) {
      const rowInnerMarkup = [];
      for (let j = 0; j < boardSizeX; j++) {
        const classList = ['board-cell'];
        if (userPosY === i && userPosX === j) {
          classList.push('has-user');
        } else if (this.spritesPos[i] === j) {
          classList.push('has-sprite');
          const spriteType = (j % 3) + 1;
          classList.push(`sprite-${spriteType}`);
        }

        const className = classList.join(' ');
        rowInnerMarkup.push(<td key={`${i}-${j}`} className={className} />);
      }
      const rowMarkup = <tr key={i}>{rowInnerMarkup}</tr>;
      markup.push(rowMarkup);
    }
    return markup;
  }

  render() {
    const { boardSizeX, boardSizeY } = this.props;
    return (
      <main className="game" onClick={this.handleGameClick}>
        {this.state.hasFinished ? (
          <section className="gameover">
            <p className="moves">
              You took&nbsp;
              <strong data-testid="moveCounter">{this.moves}</strong>
              &nbsp;moves
            </p>
            {this.state.isMovesSaved ? (
              <span className="username-saved">
                Thanks for playing {this.state.username}! Your moves have been saved.
              </span>
            ) : (
              this.renderUsernameForm()
            )}
            <p className="instructions-final">Refresh the page to Play Again.</p>
          </section>
        ) : (
          <Fragment>
            <div className="board-container">
              <table
                className="board"
                tabIndex="0"
                ref={this.boardRef}
                onKeyDown={this.keyAndClickHandler}
                data-testid="game-table"
              >
                <tbody>{this.renderBoard(boardSizeX, boardSizeY)}</tbody>
              </table>
              <p className="moves-current">
                Moves so far &nbsp;
                <strong data-testid="moveCounter">{this.moves}</strong>
              </p>
              <div className="gamepad">
                <button
                  className="gamepad__control gamepad__control--up"
                  onClick={() => {
                    const event = { key: 'ArrowUp' };
                    this.keyAndClickHandler(event);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 8l6 6H6z" fill="rgba(255,255,255,1)" />
                  </svg>
                </button>
                <button
                className="gamepad__control gamepad__control--right"
                  onClick={() => {
                    const event = { key: 'ArrowRight' };
                    this.keyAndClickHandler(event);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M16 12l-6 6V6z" fill="rgba(255,255,255,1)" />
                  </svg>
                </button>
                <button
                  className="gamepad__control gamepad__control--left"
                  onClick={() => {
                    const event = { key: 'ArrowLeft' };
                    this.keyAndClickHandler(event);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M8 12l6-6v12z" fill="rgba(255,255,255,1)" />
                  </svg>
                </button>
                <button
                  className="gamepad__control gamepad__control--down"
                  onClick={() => {
                    const event = { key: 'ArrowDown' };
                    this.keyAndClickHandler(event);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 16l-6-6h12z" fill="rgba(255,255,255,1)" />
                  </svg>
                </button>
              </div>
            </div>
            <ScoreBoard />
            <Instructions />
          </Fragment>
        )}
      </main>
    );
  }
}

export { Game };
