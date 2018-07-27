import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//want to start with all false so we can AND everything to be true
var dim = 10;

function Square(props) {
  return (
    <button
      className={"square " + (props.cell_value ? "fill" : "unfill")}
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
        {Array.apply(null, { length: dim })
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
    this.state = {
      squares: Array(dim).fill(Array(dim).fill(false)),
      isWinning: false,
      count: 0
    };
  }
  //this reducer can 'AND' a group of input

  //input is array, output is the 'AND' of all values in that array

  checkWinning = () => {
    console.log(this.state.squares);
    return this.state.squares.map(x => x.every(x => x)).every(x => x);
  };

  handleClick = (row_id, col_id) => {
    const square_replacement = this.state.squares.slice();
    const row_replacement = this.state.squares[row_id].slice();
    row_replacement[col_id] = !row_replacement[col_id];
    if (col_id + 1 < dim) {
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
    if (row_id + 1 < dim) {
      const post_row_replacement = this.state.squares[row_id + 1].slice();
      post_row_replacement[col_id] = !post_row_replacement[col_id];
      square_replacement[row_id + 1] = post_row_replacement;
    }

    this.setState({ squares: square_replacement }, () => {
      //after set the state. Update the count and check the winning conditon
      this.setState({
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
        clickHandler={this.handleClick}
      />
    );
  }

  render() {
    return (
      <div>
        <h1>FLIP GAME - try to flip all circles</h1>
        <div className="counter">
          {this.state.count}/{dim * dim} flipped
        </div>
        <div className="status">
          {this.state.isWinning
            ? "You won. Can you tell me how you did it?"
            : "clearly you haven't flipped everything yet."}
        </div>
        <div className="board">
          {Array.apply(null, { length: dim })
            .map(Number.call, Number)
            .map(x => this.renderRow(x))}
        </div>
        <div>{"created by: Hugo, who cannot beat this game"}</div>
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
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
