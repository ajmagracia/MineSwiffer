import React, { Component } from 'react'
import './Square.css'

class Square extends Component {
  constructor(props){
    super(props)
    this.state = {
      bomb: "",
      clicked: false,
      rightClicked: false,
      color: '#666',
      border: 'outset',
      borderColor: '#666'
    }
  }

  render(){
    let { color, border, borderColor } = this.state
    return(
      <div className="wrapper">
        <div className="square" style={{background:this.state.color, borderColor: this.state.borderColor, borderStyle:this.state.border}} onClick={this.handleClick} onContextMenu={this.handleRightClick}>
          {this.props.bomb}
        </div>
      </div>
    )
  }

  handleClick = ( e ) => {
    let { clicked, color, borderColor } = this.state
    if ( clicked ) return
    let { bomb } = this.props

    if ( bomb === 'B' ) {
      e.target.innerHTML = '<div class="burst-8"></div>'
      color = '#F00'
    } else {
      color = '#333'
    }
    borderColor = '#333'
    this.setState( {
      clicked: !clicked,
      border: 'groove',
      borderColor,
      color
    } )
  }

  handleRightClick = (e) => {
    e.preventDefault()
    let { rightClicked, clicked } = this.state
    if ( clicked ) return
    if ( !rightClicked ) {
      e.target.innerHTML = '<div class="unselectable"></div>'
      e.target.children[0].classList.add('flag')
      // Not sure how else to prevent errors when clicking directly on flag
    } else if (e.target.classList.contains('flag')) {
        e.target.classList.remove('flag')
    } else {
      e.target.children[0].classList.remove('flag')
    }
    this.setState( {
      rightClicked: !rightClicked
    })
  }
}

export default Square
