import React, { Component } from 'react'
import './Square.css'

class Square2 extends Component {
  constructor(props){
    super(props)
    this.state = {
      clickStatus: 'unclicked',
      rightClicked: 0,
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

  createSquareHTML = () => {
    let { clickStatus,rightClicked } = this.state
    let content
    let innerDiv

    // After a click
    if (clickStatus === 'clicked') {
      content = this.props.bomb
      if (this.props.bomb === 'B')
      innerDiv = <div className="burst-8"></div>
    }

    // After a right click
    if ( rightClicked % 3 === 0 ) {
      innerDiv = <div className="unselectable"></div>
      // Not sure how else to prevent errors when clicking directly on flag
    } else if (rightClicked % 3 === 1) {
      innerDiv = <div className="unselectable flag"></div>
    } else {
      innerDiv = <div className="unselectable">?</div>
    }

    let squareHTML =
      <div
      className={`square ${clickStatus} ${content}`}
      onClick={this.handleClick}
      onContextMenu={this.handleRightClick}>
        {innerDiv === undefined? this.props.bomb : innerDiv}
      </div>
    return squareHTML
  }

  handleClick = ( e ) => {
    let { clickStatus } = this.state
    let { bomb, endGame, playing } = this.props
    if ( clickStatus==='clicked' ) return

    if ( bomb === 'B' ) {
      playing = !playing
    }

    this.setState( {
      clickStatus: 'clicked'
    }, endGame(playing) )
  }

  handleRightClick = (e) => {
    e.preventDefault()
    let { rightClicked, clickStatus } = this.state
    if ( clickStatus === 'clicked' ) return
    this.setState( {
      rightClicked: rightClicked++
    })
  }
}

export default Square2
