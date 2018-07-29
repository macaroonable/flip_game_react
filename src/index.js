import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//want to start with all false so we can AND everything to be true

function Square(props) {
  return (
    <button
      className={'square ' + (props.cell_value ? 'fill' : 'unfill')}
      onClick={props.clickHandler}
    />
  );
}

class Row extends React.Component {
  renderSquare(value, cell_id) {
    return (
      <Square
        cell_value={value}
        cell_id={cell_id}
        clickHandler={(row_id, col_id) =>
          this.props.clickHandler(cell_id[0], cell_id[1])
        }
      />
    );
  }
  render() {
    return (
      <div className="board-row" row_id={this.props.row_id}>
        {Array.apply(null, { length: this.props.dim })
          .map(Number.call, Number)
          .map(x =>
            this.renderSquare(this.props.row_values[x], [this.props.row_id, x])
          )}
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initState(6);
  }
  //this reducer can 'AND' a group of input

  initState = x => ({
    dim: x,
    squares: Array(x).fill(Array(x).fill(false)),
    isWinning: false,
    count: 0,
    step: 0
  });
  resetGame = new_dim => {
    this.setState(this.initState(new_dim));
  };
  checkWinning = () => {
    console.log(this.state.squares);
    return this.state.squares.map(x => x.every(x => x)).every(x => x);
  };

  handleClick = (row_id, col_id) => {
    const square_replacement = this.state.squares.slice();
    const row_replacement = this.state.squares[row_id].slice();
    row_replacement[col_id] = !row_replacement[col_id];
    if (col_id + 1 < this.state.dim) {
      row_replacement[col_id + 1] = !row_replacement[col_id + 1];
    }
    if (col_id - 1 >= 0) {
      row_replacement[col_id - 1] = !row_replacement[col_id - 1];
    }
    square_replacement[row_id] = row_replacement;

    //change the previous row
    if (row_id - 1 >= 0) {
      const pre_row_replacement = this.state.squares[row_id - 1].slice();
      pre_row_replacement[col_id] = !pre_row_replacement[col_id];
      square_replacement[row_id - 1] = pre_row_replacement;
    }

    //change the after row
    if (row_id + 1 < this.state.dim) {
      const post_row_replacement = this.state.squares[row_id + 1].slice();
      post_row_replacement[col_id] = !post_row_replacement[col_id];
      square_replacement[row_id + 1] = post_row_replacement;
    }
    this.setState({ step: this.state.step + 1 });
    //use callback after the setState to ensure the states are already set afterwards
    this.setState({ squares: square_replacement }, () => {
      //after set the state. Update the count and check the winning conditon
      this.setState({
        //count is the number of total grid flipped
        count: this.state.squares
          .map(x => x.filter(x => x).length)
          .reduce((sum, each) => sum + each, 0)
      });

      if (this.checkWinning()) {
        this.setState({ isWinning: true });
      } else {
        this.setState({ isWinning: false });
      }
    });
  };
  renderRow(row_id) {
    return (
      <Row
        row_values={this.state.squares[row_id]}
        row_id={row_id}
        dim={this.state.dim}
        clickHandler={this.handleClick}
      />
    );
  }

  render() {
    return (
      <div>
        <h1>FLIP GAME - try to flip all squares</h1>
        <div>
          you can change the game difficulty by adjusting the dimension of grids
        </div>
        <button onClick={() => this.resetGame(6)}>6</button>
        <button onClick={() => this.resetGame(7)}>7</button>
        <button onClick={() => this.resetGame(8)}>8</button>
        <button onClick={() => this.resetGame(9)}>9</button>
        <button onClick={() => this.resetGame(10)}>10</button>

        <div className="counter">
          Steps so far: {this.state.step};
          <br />
          {this.state.count}/{this.state.dim * this.state.dim} flipped
        </div>
        <div className="status">
          {this.state.isWinning
            ? 'You won. Can you tell me how you did it?'
            : "clearly you haven't flipped everything yet."}
        </div>
        <div className="board">
          {Array.apply(null, { length: this.state.dim })
            .map(Number.call, Number)
            .map(x => this.renderRow(x))}
        </div>
        <div>{'created by: Hugo, who cannot beat this game'}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info" />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
