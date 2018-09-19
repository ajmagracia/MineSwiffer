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

  increaseBombCounter = ({horizontalDirection, verticalDirection}) => {
    // dd
  }

  createArray = (size, item) => {
    let array = []
    for (let i = 0; i<size; i++) {
      array.push(item)
    }
    return array
  }

  // create a board of dimensions rowLength x columnLength with bombs
  createBoard = ( {
    rowLength,
    columnLength
  } ) => {
    let board = []
    /*
    for loop to push a row of columns for rowLength amount of times
    cannot use a nested map because of react mapping rules
    */
    for ( let i = 0; i < rowLength; i++ ) {
      board.push( this.createArray( columnLength, 0 ) )
    }

    /*
    create an array of numbers from 1 to rowLength * columnLength
    each digit represents a square on the board
    */
    let squares = rowLength * columnLength
    let numbers = []
    // for loop to create an array with length = number of squares
    for ( let i = 0; i <= squares; i++ ) {
      numbers.push( i )
    }


    let bombNumbers = []
    let bombAmount = Math.floor( Math.sqrt( squares+1 ) )
    // For loop to put out 10 unique numbers (square identifiers)
    for ( let i = 1; i <= bombAmount; ++i ) {
      // pick a random integer between 1 and the number of squares
      let n = Math.floor( ( Math.random() * ( squares - i ) ) )
      // put the integer into the bombNumbers array
      bombNumbers.push( numbers[ n ] )
      // replace the number we pushed with the last number
      numbers[ n ] = numbers[ squares - i ]
      /*
      if the last number is the number we picked, nothing happens
      we do this because after every iteration,
      we decrease the upper limit of n by 1
      */
    }

    // turn the bomb numbers into coordinates on board
    let bombCoordinates = bombNumbers.map( number => {
      console.log(number)
      let row = Math.floor( number / rowLength )

      let column = number % columnLength
      return [ row, column ]
    } )

    // places a bomb in the appropriate squares
    bombCoordinates.forEach( coordinate => {
      console.log(coordinate)
      board[ coordinate[ 0 ] ][ coordinate[ 1 ] ] = "B"
    } )



    // place numbers denoting adjacent bombs in appropriate squares
    for (let i = 0; i < rowLength; i++) {
      let [up, down] = [i-1, i+1]
      for (let j = 0; j < columnLength; j++) {
        // first find a bomb
        if (board[i][j] !== "B") continue
        let [left, right] = [j-1, j+1]
        // for row above
        if (i!==0) {
          if (j!==0) {
            // if (!board[up][left]) {
              if (typeof board[i][left] !== 'string')
                board[up][left] += 1
            }

          if (typeof board[up][j] !== 'string') {
            board[up][j] += 1
          }
          if (j!==14 & typeof board[up][right] !== 'string') {
            board[up][right] += 1
          }
        }
        // for same row
        if (j!==0) {
          if (typeof board[i][left] !== 'string') {
            board[i][left] += 1
          }
        }
        if (j!==14){
          if (typeof board[i][right] !== 'string') {
            board[i][right] += 1
          }
        }
        // for row below
        if (i!==14) {
          if (j!==0) {
            if (!board[down][left]) {
              if (!board[down][left])
                board[down][left] += 1
            }
          }
          if (typeof board[down][j] !== 'string') {
            board[down][j] += 1
          }
          if (j!==14 & typeof board[down][right] !== 'string') {
            board[down][right] += 1
          }
        }



      }

    }

    this.setState( {
      board
    } )
  }


}

export default Board
