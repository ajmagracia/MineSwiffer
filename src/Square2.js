import React, { Component } from 'react'
import './Square.css'

class Square2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clickStatus: 'unclicked',
      rightClicked: false,
      rightClickCounter: 0,
    }
    this.clickDiv = React.createRef()
  }

  componentDidUpdate(prevProps) {
    let {
      playing,
      bomb,
      lastContent
    } = this.props
    if (playing === false && prevProps.playing === true && lastContent === 'B'){
      if (bomb === 'B'){
        console.log('click')
        this.simulateBombClick()
      }
    } else if ( (typeof bomb === 'object' && bomb[1] === -1) || bomb === -1 ) {
      this.simulateBombClick()
    }
  }

  render(){
    let content = this.createSquareHTML()
    return(
      <div className="wrapper">
        { content }
      </div>
    )
  }

  // This creates the HTML inside the wrapper div of each square
  createSquareHTML = () => {
  let {
    clickStatus,
    rightClicked,
    rightClickCounter
  } = this.state
  let { bomb } = this.props
  let content
  let innerDiv

  // After a click
  if (clickStatus === 'clicked') {
    content = bomb
    if (bomb === 'B') {
      innerDiv = < div className = "burst-8" > < /div>
    } else if (typeof bomb === 'number') {
      innerDiv = < div className = "unselectable" > </div>
    } else {
      innerDiv = < div className = "unselectable" > {bomb[0]} </div>
    }
  }

  // After a right click
  if (rightClicked){
    if (rightClickCounter % 3 === 0) {
      innerDiv = < div className = "unselectable" > < /div>
      // Not sure how else to prevent errors when clicking directly on flag
    } else if (rightClickCounter % 3 === 1) {
      innerDiv = < div className = "unselectable flag" > < /div>
    } else {
      innerDiv = < div className = "unselectable" > ? < /div>
    }
  }

  // if (typeof bomb === 'object')
  //   bomb = bomb[0]

  let squareHTML =
    <
     div
     className = { `square ${clickStatus} ${content}` }
     onClick = { this.handleClick }
     ref = { this.clickDiv }
     onContextMenu = { this.handleRightClick }
    >
      { innerDiv === undefined ? bomb : innerDiv }
    </div>
  return squareHTML
}

  handleClick = (e) => {
    let {
      clickStatus
    } = this.state
    let {
      bomb,
      progressGame,
      playing,
      row,
      column,
      counter,
      start,
      stop
    } = this.props
    if (clickStatus === 'clicked' || (playing === false && bomb !== 'B') || counter === 1000000) return
    if (counter.length===0)
      start()
    if (bomb === 'B') {
      playing = false
      stop()
    }

    this.setState({
      clickStatus: 'clicked',
      rightClicked: false
    }, progressGame(row, column, bomb, playing))
  }

  handleRightClick = (e) => {
    e.preventDefault()
    let {
      clickStatus,
      rightClickCounter
    } = this.state
    let { playing } = this.props
    if (clickStatus === 'clicked' || playing === false) return
    this.setState({
      rightClicked: true,
      rightClickCounter: rightClickCounter+=1
    })
  }

  simulateBombClick = () => {
    // let { playing, bomb } = this.props
    // if (playing === false)
    // if(this.clickDiv)
    this.clickDiv.current.click()
  }
}

export default Square2
