import React, { Component } from 'react';
import './App.css';
import Board from './Board'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board stopTimer={this.stopTimer}/>
      </div>
    );
  }

  stopTimer = () => {

  }

}

export default App;
