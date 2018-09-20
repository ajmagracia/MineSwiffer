import React, { Component } from 'react'
import Square from './Square'
import './Board.css'

class Board extends Component {
  constructor(props){
    super(props)
    this.state = {
      board: []
    }
  }

  componentDidMount() {
    if (this.state.board.length >= 1) return false
    this.createBoard( {
      rowLength: 15,
      columnLength: 15
    } )
  }

  render() {
    let { board } = this.state
    let gameBoard = board.map( ( row, rowIndex ) => {
      return row.map( ( column, columnIndex ) => {
        return <Square
        key={rowIndex + ', ' + columnIndex}
        row={rowIndex}
        column={columnIndex}
        bomb={board[rowIndex][columnIndex]}/>
      } )
    } )
    return (
      <div className="game-board">{gameBoard}</div>
    )
  }



  // create a board of dimensions rowLength x columnLength with bombs
  createBoard = ( { rowLength, columnLength } ) => {
    let squares = rowLength * columnLength
    let numbers = this.createNumberArray(squares)
    let bombNumbers = this.createBombNumbers(squares,numbers)

    // turn the bomb numbers into coordinates on board
    let bombCoordinates = bombNumbers.map( number => {
      console.log(number)
      let row = Math.floor( number / rowLength )

      let column = number % columnLength
      return [ row, column ]
    } )

    let board = []
    /*
    For loop to push a row of columns for rowLength amount of times.
    Cannot use a nested map because of react mapping rules...til I figure it out
    */
    for ( let i = 0; i < rowLength; i++ ) {
      board.push( this.createArray( columnLength, 0 ) )
    }

    // places a bomb in the appropriate squares
    bombCoordinates.forEach( coordinate => {
      console.log(coordinate)
      board[ coordinate[ 0 ] ][ coordinate[ 1 ] ] = "B"
    } )


    // place numbers denoting adjacent bombs in appropriate squares
    // i is the index of the row, and there are columnLength amount of rows
    for ( let i = 0; i < columnLength; i++ ) {
      //j is the index of the column, and there are rowLength amount of columns
      for ( let j = 0; j < rowLength; j++ ) {
        // do not do anything unless we've found a bomb
        if ( board[ i ][ j ] !== "B" ) continue
        //
        for ( let v = -1; v <= 1; v++ ) {
          for ( let h = -1; h <= 1; h++ ) {
            let [ y, x ] = [ v + i, h + j ]
            if ( typeof board[ y ] !== 'undefined' ) {
              if ( typeof board[ y ][ x ] === 'number' )
                board[ y ][ x ] += 1
            }
          }
        }
      }
    }

    this.setState( {
      board
    } )
  }
  /*
  create an array of numbers from 1 to rowLength * columnLength
  each digit represents a square on the board
  */
  createNumberArray = (number) => {
    let numbers = []
    // for loop to create an array of sequential integers with length = number
    for ( let i = 0; i <= number; i++ ) {
      numbers.push( i )
    }
    return numbers
  }

  createArray = (size, item) => {
    let array = []
    for (let i = 0; i<size; i++) {
      array.push(item)
    }
    return array
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

  setBombs = () => {

  }

}

export default Board
