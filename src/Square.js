import React, { Component } from 'react'
import './Square.css'

var bombStatus
class Square extends Component {
  constructor(props){
    super(props)
    this.state = {
      bomb: ""
    }
  }

  componentWillMount(){
    bombStatus=1
  }
  render(){
    return(
      <div className="square" onClick={this.handleClick}>{this.props.bomb}</div>
    )
  }

  handleClick = (e) => {
    let { bomb } = this.props.bomb
    e.target.classList.add('circle')
    if (bomb===0)
      bomb = ""
    this.setState({
      bomb
    })
  }
}

export default Square
