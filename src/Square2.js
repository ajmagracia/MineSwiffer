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
  let content
  let innerDiv

  // After a click
  if (clickStatus === 'clicked') {
    content = this.props.bomb
    if (this.props.bomb === 'B') {
      innerDiv = < div className = "burst-8" > < /div>
    } else if (this.props.bomb == 0) {
      innerDiv = < div className = "unselectable" > </div>
    } else {
      innerDiv = < div className = "unselectable" > {this.props.bomb} </div>
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

  let squareHTML =
    <
     div
     className = { `square ${clickStatus} ${content}` }
     onClick = { this.handleClick }
     ref = { this.clickDiv }
     onContextMenu = { this.handleRightClick }
    >
      { innerDiv === undefined ? this.props.bomb : innerDiv }
    </div>
  return squareHTML
}

  handleClick = (e) => {
    let {
      clickStatus,
      rightClicked
    } = this.state
    let {
      bomb,
      endGame,
      playing
    } = this.props
    if (clickStatus === 'clicked' || playing === false) return

    if (bomb === 'B') {
      playing = !playing
    }

    this.setState({
      clickStatus: 'clicked',
      rightClicked: false
    }, endGame(playing))
  }

  handleRightClick = (e) => {
    e.preventDefault()
    let {
      rightClicked,
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

  // simulateClick = ()

}

export default Square2
