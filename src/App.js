import React, { Component } from 'react';
import './App.css';
import Board from './Board'

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) +
    ':' +
  ('0' + sec % 60).slice(-2)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsElapsed: 0,
      lastClearedIncrementer: null
    };
    this.incrementer = null;
  }

  handleStartClick = () => {
    this.incrementer = setInterval( () =>
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1
      })
    , 1000);
  }

  handleStopClick = () => {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer
    });
  }

  handleResetClick = () => {
    clearInterval(this.incrementer);
    this.setState({
      secondsElapsed: 0
    });
  }

  render() {
    return (
      <div className="App">
        <div className="Timer">
          Elapsed time: {formattedSeconds(this.state.secondsElapsed)}
        </div>
        <Board start={this.handleStartClick} stop={this.handleStopClick} reset={this.handleResetClick}/>
      </div>
    );
  }
}

export default App;
