// @flow
import React, { Component } from 'react';
import Square from './Square2';
import './Board.css';

type Counter = ''[];
type GridArgs = { rowLength: number, columnLength: number };

// Helpers
const createArray = (size: number, item: mixed) =>
  Array.from({ length: size }, (x, i) => (item === undefined ? i : item));

const generateUniqueNumbers = (maxNumber: number, numberList: number[]) => {
  const newList = [...numberList];
  const uniqueNumbers = [];
  const numberAmount = Math.floor(Math.sqrt(maxNumber + 1)) + 25;
  // For loop to put out 10 unique numbers (square identifiers)
  for (let i = 1; i <= numberAmount; ++i) {
    // pick a random integer between 1 and maxNumber
    const n = Math.floor(Math.random() * (maxNumber - i));
    // put the integer into the uniqueNumbers array
    uniqueNumbers.push(newList[n]);
    // replace the number we pushed with the last number
    newList[n] = newList[maxNumber - i];
    /*
    if the last number is the number we picked, nothing happens
    we do this because after every iteration,
    we decrease the upper limit of n by 1
    */
  }
  return uniqueNumbers;
};

// create a grid of dimensions rowLength x columnLength with bombs
const createGrid = ({ rowLength, columnLength }: GridArgs) => {
  const squares = rowLength * columnLength;
  const numbers = createArray(squares);
  const bombNumbers = generateUniqueNumbers(squares, numbers);

  // turn the bomb numbers into coordinates on grid
  const bombCoordinates = bombNumbers.map((number) => {
    const row = Math.floor(number / rowLength);
    const column = number % columnLength;
    return [row, column];
  });

  const row = createArray(rowLength, 0);
  const columnSlots = createArray(columnLength, 0);
  // Spread operator to *duplicate* code
  const grid = columnSlots.map(() => [...row]);

  // places a bomb in the appropriate squares
  bombCoordinates.forEach((coordinate) => {
    grid[coordinate[0]][coordinate[1]] = 'B';
  });

  // Loop to place numbers denoting adjacent bombs in appropriate squares
  // i is the index of the row, and there are columnLength amount of rows
  for (let i = 0; i < columnLength; i++) {
    // j is the index of the column, and there are rowLength amount of columns
    for (let j = 0; j < rowLength; j++) {
      // do not do anything unless we've found a bomb
      if (grid[i][j] === 'B') {
        /*
        start at the square 1 unit up and to the left and go top to bottom,
        left to right
        */
        for (let v = -1; v <= 1; v++) {
          for (let h = -1; h <= 1; h++) {
            const [y, x] = [v + i, h + j];
            if (grid[y]) {
              if (grid[y][x] === 0) grid[y][x] = [1];
              else if (typeof grid[y][x] === 'object') grid[y][x][0] += 1;
            }
          }
        }
      }
    }
  }
  return grid;
};

type Props = { reset: Function, start: Function, stop: Function };

// This will create a board containing a grid of Squares
class Board extends Component {
  props: Props;

  state = {
    playing: true,
    grid: createGrid({ rowLength: 15, columnLength: 15 }),
    lastContent: 0,
    counter: [],
  };

  componentDidUpdate() {
    if (this.state.counter.length === 185 && this.state.playing === true)
      this.setGameWin();
  }

  setNegativeOne = (row: number, column: number) => {
    const { grid } = this.state;
    if (grid[row][column][0]) grid[row][column].push(-1);
    else grid[row][column] = -1;
  };

  setAdjacentNegativeOne = (row, column) => {
    if (row > 0) this.setNegativeOne(row - 1, column);
    if (row < 14) this.setNegativeOne(row + 1, column);
    if (column > 0) this.setNegativeOne(row, column - 1);
    if (column < 14) this.setNegativeOne(row, column + 1);
    if (row > 0 && column > 0) this.setNegativeOne(row - 1, column - 1);
    if (row > 0 && column < 14) this.setNegativeOne(row - 1, column + 1);
    if (row < 14 && column > 0) this.setNegativeOne(row + 1, column - 1);
    if (row < 14 && column < 14) this.setNegativeOne(row + 1, column + 1);
  };

  progressGame = (row, column, bomb, playing) => {
    const { grid, counter } = this.state;
    if (bomb < 1 && grid[row][column] < 1)
      this.setAdjacentNegativeOne(row, column);
    counter.push('');
    this.setState({
      playing,
      grid,
      counter,
      lastContent: bomb,
    });
  };

  reset = () => {
    this.setState({ grid: [] }, () => {
      this.setState(
        {
          grid: createGrid({ rowLength: 15, columnLength: 15 }),
          playing: true,
          counter: [],
          lastContent: 0,
        },
        () => this.props.reset(),
      );
    });
  };

  setGameWin = () => {
    this.props.stop();
    this.setState({ playing: false, lastContent: 'B' }, () =>
      this.setState({ counter: Array(1000000) }),
    );
  };

  showStatus = (counter: Counter, playing: boolean) => {
    const length = counter.length;
    if (length > 999999)
      return "Congratulations!!! You're the book, not the movie. Go get yourself a cookie.";
    if (length === 224 && playing === false)
      return 'HAHAHAHAHAHAHAHAHAHAHAHAHAHA';
    if (length > 200 && playing === false)
      return 'All that work for nothing...';
    if (length === 40 && playing === false)
      return "I'll, uh, pretend I didn't see that.";
    if (playing === false) return 'Darn.';
    if (length === 184) return 'Just... one... more...';
    if (length === 183) return "Praise Reese's you're gonna do it!!";
    if (length === 182) return 'omg omg omg omg omg omg!';
    if (length === 181) return 'Is this happening is this real life?';
    if (length > 170) return 'Almost there...';
    if (length > 125) return 'Doing better than I expected.';
    if (length > 75) return 'Good, good!';
    if (length > 45) return 'Keep it up.';
    if (length > 0) return 'Click, click, click...';
    return 'Click away!';
  };

  render() {
    const { grid, playing, lastContent, counter } = this.state;
    const { stop, start, reset } = this.props;
    const board = grid.map((row, rowIndex) =>
      row.map((column, columnIndex) => (
        <Square
          board={this}
          bomb={grid[rowIndex][columnIndex]}
          column={columnIndex}
          counter={counter}
          // eslint-disable-next-line react/no-array-index-key
          key={`${rowIndex}, ${columnIndex}`}
          lastContent={lastContent}
          playing={playing}
          progressGame={this.progressGame}
          reset={reset}
          row={rowIndex}
          start={start}
          stop={stop}
        />
      )),
    );
    return (
      <div>
        <div style={{ marginTop: '60px', marginBottom: '-40px' }}>
          {this.showStatus(counter, playing)}
          {playing === true &&
            ` ${40 -
              document.getElementsByClassName('flag').length} bombs remaining.`}
        </div>
        <div className="game-board">{board}</div>
        <div style={{ marginTop: '-40px' }}>
          <button onClick={() => this.reset()} type="button">
            Reset
          </button>
        </div>
      </div>
    );
  }
}

export default Board;
