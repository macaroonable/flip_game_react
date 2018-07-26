import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

var start_with_true = true;
var dim = 9;

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
      squares: Array(dim).fill(Array(dim).fill(start_with_true ? true : false))
    };
  }

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

    this.setState({ squares: square_replacement });

    /*
    row_replacement[col_id] = "x" ? "o" : "x";
    if (col_id + 1 < dim) {
      row_replacement[col_id + 1] = "x" ? "o" : "x";
    }
    if (col_id - 1 >= 0) {
      row_replacement[col_id - 1] = "x" ? "o" : "x";
    }
    square_replacement[row_id] = row_replacement;
    console.log(square_replacement);

    if (row_id + 1 < dim) {
      const row_replacement = this.state.squares[row_id + 1].slice();
      row_replacement[col_id] = "x" ? "o" : "x";
      square_replacement[row_id + 1] = row_replacement;
    }

    if (row_id - 1 >= 0) {
      const row_replacement = this.state.squares[row_id - 1].slice();
      row_replacement[col_id] = "x" ? "o" : "x";
      square_replacement[row_id - 1] = row_replacement;
    }*/

    //const squares = this.state.squares.slice();

    //squares[row_id][col_id] = (squares[row_id][col_id] = "x") ? "o" : "x";
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
        {Array.apply(null, { length: dim })
          .map(Number.call, Number)
          .map(x => this.renderRow(x))}
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
