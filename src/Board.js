// @flow
import React, { Component } from 'react';
import type { Bomb } from './Square2';
import Square from './Square2';
import './Board.css';

// Types
type ArrayCreator = (number, any) => any[];
type Converter = (number | number[], number, number) => number[] | number[][];
type GameGrid = (number | 'B' | number[])[][];
type GridCreator = (number, number) => GameGrid;
type GridMarker = (GameGrid) => GameGrid;
type NumberGenerator = (number, number[]) => number[];
type Props = { reset: Function, start: Function, stop: Function };
type Announcer = (''[], boolean) => string;

// Helpers
const createArray: ArrayCreator = (size, item) =>
  Array.from({ length: size }, (x, i) => (item === undefined ? i : item));

const generateUniqueNumbers: NumberGenerator = (maxNumber, numberList) => {
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

const convertToCoordinate: Converter = (number, rowLength, colLength) => [
  Math.floor(number / rowLength),
  number % colLength,
];

const convertToCoordinates: Converter = (numbers, rowLength, colLength) =>
  numbers.map((number) => convertToCoordinate(number, rowLength, colLength));

const createGrid: GridCreator = (rowLength, colLength) => {
  const row = createArray(rowLength, 0);
  const colSlots = createArray(colLength, 0);
  // Spread operator to *duplicate* code
  return colSlots.map(() => [...row]);
};

// Loop to place numbers denoting adjacent bombs in appropriate squares
const markAdjacentBombs: GridMarker = (unmarkedGrid) => {
  const grid = unmarkedGrid.map((row) => row.slice(0));
  // i is the index of the row, and there are colLength amount of rows
  for (let i = 0; i < grid.length; i++) {
    // j is the index of the col, and there are rowLength amount of cols
    for (let j = 0; j < grid[i].length; j++) {
      // Guard clause: do not do anything unless we've found a bomb
      // eslint-disable-next-line no-continue
      if (grid[i][j] !== 'B') continue;
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
  return grid;
};

// create a grid of dimensions rowLength x colLength with bombs
const createBombGrid: GridCreator = (rowLength, colLength) => {
  const grid = createGrid(rowLength, colLength);
  const squares = rowLength * colLength;
  const numbers = createArray(squares);
  const bombs = generateUniqueNumbers(squares, numbers);

  // turn the bomb numbers into coordinates on grid
  const bombCoordinates = convertToCoordinates(bombs, rowLength, colLength);

  // places a bomb in the appropriate squares
  bombCoordinates.forEach((coordinate) => {
    grid[coordinate[0]][coordinate[1]] = 'B';
  });

  return markAdjacentBombs(grid);
};

// This will create a board containing a grid of Squares
class Board extends Component {
  props: Props;

  state = {
    playing: true,
    grid: createBombGrid(15, 15),
    lastContent: 0,
    counter: [],
  };

  componentDidUpdate() {
    if (this.state.counter.length === 185 && this.state.playing === true)
      this.setGameWin();
  }

  setNegativeOne = (row: number, col: number) => {
    const { grid } = this.state;
    if (grid[row][col][0]) grid[row][col].push(-1);
    else grid[row][col] = -1;
  };

  setAdjacentNegativeOne = (row: number, col: number) => {
    if (row > 0) this.setNegativeOne(row - 1, col);
    if (row < 14) this.setNegativeOne(row + 1, col);
    if (col > 0) this.setNegativeOne(row, col - 1);
    if (col < 14) this.setNegativeOne(row, col + 1);
    if (row > 0 && col > 0) this.setNegativeOne(row - 1, col - 1);
    if (row > 0 && col < 14) this.setNegativeOne(row - 1, col + 1);
    if (row < 14 && col > 0) this.setNegativeOne(row + 1, col - 1);
    if (row < 14 && col < 14) this.setNegativeOne(row + 1, col + 1);
  };

  progressGame = (row: number, col: number, bomb: Bomb, playing: Boolean) => {
    const { grid, counter } = this.state;
    if (bomb < 1 && grid[row][col] < 1) this.setAdjacentNegativeOne(row, col);
    counter.push('');
    this.setState({ playing, grid, counter, lastContent: bomb });
  };

  reset = () => {
    this.setState({ grid: [] }, () => {
      this.setState(
        {
          grid: createBombGrid(15, 15),
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

  showStatus: Announcer = (counter, playing) => {
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

  squareGenerator = (state) => {
    const { grid, ...boardState } = state;
    const { start, stop } = this.props;
    return grid.map((row, rowIndex) =>
      row.map((col, colIndex) => (
        <Square
          board={this}
          bomb={grid[rowIndex][colIndex]}
          column={colIndex}
          // eslint-disable-next-line react/no-array-index-key
          key={`${rowIndex}, ${colIndex}`}
          progressGame={this.progressGame}
          row={rowIndex}
          {...{ start, stop }}
          {...boardState}
        />
      )),
    );
  };

  render() {
    const { playing, counter } = this.state;
    const board = this.squareGenerator(this.state);
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
