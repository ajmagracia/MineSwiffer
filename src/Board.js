import React, { Component } from 'react'
import Square from './Square2'
import './Board.css'

// This will create a board containing a grid of Squares
class Board extends Component {
  constructor(props){
    super(props)
    this.state = {
      playing: true,
      grid: [],
      lastContent: 0,
      counter: []
    }
    this.state.grid = this._createGrid( {
      rowLength: 15,
      columnLength: 15
    } )
  }

  componentDidUpdate() {
    if (this.state.counter.length === 210 && this.state.playing === true) {
      this.setState( {
        playing: false,
        counter: 1000000
      })
    } else if (this.props.counter === 1000000) {
      this.props.stopTimer()
    }
  }

  render() {
    let { grid, playing, lastContent, counter } = this.state
    let board = grid.map( ( row, rowIndex ) => {
      return row.map( ( column, columnIndex ) => {
        return <Square
        key={rowIndex + ', ' + columnIndex}
        row={rowIndex}
        column={columnIndex}
        counter={counter}
        lastContent={lastContent}
        bomb={grid[rowIndex][columnIndex]}
        playing={playing}
        progressGame={this.progressGame}
        />
      } )
    } )
    return (
      <div className="game-board">{board}</div>
    )
  }

  // create a grid of dimensions rowLength x columnLength with bombs
  _createGrid = ( { rowLength, columnLength } ) => {
    let { createArray } = this
    let squares = rowLength * columnLength
    let numbers = createArray(squares)
    let bombNumbers = this.createBombNumbers(squares,numbers)

    // turn the bomb numbers into coordinates on grid
    let bombCoordinates = bombNumbers.map( number => {
      let row = Math.floor( number / rowLength )
      let column = number % columnLength
      return [ row, column ]
    } )

    /*
    For loop to push a row of columns for rowLength amount of times.
    Cannot use a map because of react mapping rules...til I figure it out
    */
    // let grid = []
    // for ( let i = 0; i < rowLength; i++ ) {
    //   grid.push( this.createArray( columnLength, 0 ) )
    // }

    // Figured it out... Is mapping even better? The code is bulkier...
    let row = createArray( rowLength, 0)
    let columnSlots = createArray( columnLength, 0)
    // Spread operator to *duplicate* code
    let grid = columnSlots.map( slot => ( [ ...row ] ) )

    // places a bomb in the appropriate squares
    bombCoordinates.forEach( coordinate => {
      grid[ coordinate[ 0 ] ][ coordinate[ 1 ] ] = "B"
    } )

    // Loop to place numbers denoting adjacent bombs in appropriate squares
    // i is the index of the row, and there are columnLength amount of rows
    for ( let i = 0; i < columnLength; i++ ) {
      //j is the index of the column, and there are rowLength amount of columns
      for ( let j = 0; j < rowLength; j++ ) {
        // do not do anything unless we've found a bomb
        if ( grid[ i ][ j ] !== "B" ) continue
        /*
        start at the square 1 unit up and to the left and go top to bottom,
        left to right
        */
        for ( let v = -1; v <= 1; v++ ) {
          for ( let h = -1; h <= 1; h++ ) {
            let [ y, x ] = [ v + i, h + j ]
            if ( typeof grid[ y ] !== 'undefined' ) {
              if ( typeof grid[ y ][ x ] === 'number' ){
                if ( grid[ y ][ x ] === 0 ){
                  grid[ y ][ x ] = [1]
                }
              } else if ( typeof grid[ y ][ x ] === 'object'){
                grid[ y ][ x ][0] += 1
              }
            }
          }
        }
      }
    }
    console.log(grid)
    return grid
  }
  /*
  create an array of numbers from 1 to rowLength * columnLength
  each digit represents a square on the grid
  */
  // createNumberArray = (number) => {
  //   let numbers = []
  //   // for loop to create an array of sequential integers with length = number
  //   for ( let i = 0; i <= number; i++ ) {
  //     numbers.push( i )
  //   }
  //   return numbers
  // }

  // createArray = (size, item) => {
  //   let array = []
  //   for (let i = 0; i<size; i++) {
  //     let thing = item === undefined ? i : item
  //     array.push(thing)
  //   }
  //   return array
  // }

  createArray = (size, item) => {
    return Array.from ({length: size}, (x, i) => {return item === undefined ? i : item})
  }

  createBombNumbers = (maxNumber, numberList) => {
    let bombNumbers = []
    let bombAmount = Math.floor( Math.sqrt( maxNumber+1 ) )
    // For loop to put out 10 unique numbers (square identifiers)
    for ( let i = 1; i <= bombAmount; ++i ) {
      // pick a random integer between 1 and maxNumber
      let n = Math.floor( ( Math.random() * ( maxNumber - i ) ) )
      // put the integer into the bombNumbers array
      bombNumbers.push( numberList[ n ] )
      // replace the number we pushed with the last number
      numberList[ n ] = numberList[ maxNumber - i ]
      /*
      if the last number is the number we picked, nothing happens
      we do this because after every iteration,
      we decrease the upper limit of n by 1
      */
    }
    return bombNumbers
  }

  // progressGame = (row, column, bomb, playing) => {
  //   this.setState( {
  //     playing,
  //     lastRow: row,
  //     lastColumn: column,
  //     lastContent: bomb
  //  } )
  // }
  progressGame = (row, column, bomb, playing) => {
    let {grid, counter} = this.state
    if (bomb < 1) {
      if ( grid[ row ][ column ] < 1 ){
        if (row !== 0){
          if ( grid[ row - 1 ][ column ][0] ){
            grid[ row - 1 ][ column ].push(-1)
          } else {
            grid[ row - 1 ][ column ] = -1
          }
        }
        if (row !== 14){
          if ( grid[ row + 1 ][ column ][0] ){
            grid[ row + 1 ][ column ].push(-1)
          } else {
            grid[ row + 1 ][ column ] = -1
          }
        }
        if (column !== 0){
          if ( grid[ row ][ column - 1 ][0] ){
            grid[ row ][ column - 1 ].push(-1)
          } else {
            grid[ row ][ column - 1 ] = -1
          }
        }
        if (column !== 14){
          if ( grid[ row ][ column + 1 ][0] ){
            grid[ row ][ column + 1 ].push(-1)
          } else {
            grid[ row ][ column + 1 ] = -1
          }
        }
      }
    }
    counter.push("")
    this.setState( {
      playing,
      grid,
      counter,
      lastContent: bomb
   } )
  }

  reset = () => {

  }

}

export default Board
