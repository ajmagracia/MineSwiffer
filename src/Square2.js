// @flow
import React, { Component } from 'react';
import './Square.css';

type BombNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | -1;
export type Bomb = 0 | -1 | 'B' | BombNumber[];

type Props = {
  board: Component,
  bomb: Bomb,
  column: number,
  counter: ''[],
  lastContent: Bomb,
  playing: boolean,
  progressGame: Function,
  row: number,
  start: Function,
  stop: Function,
};

class Square2 extends Component {
  props: Props;

  state = {
    clickStatus: 'unclicked',
    rightClicked: false,
    rightClickCounter: 0,
  };

  componentDidUpdate() {
    const { bomb, lastContent } = this.props;
    if (bomb > -1) return;
    if (bomb === 'B' && lastContent !== 'B') return;
    if (typeof bomb === 'object' && !bomb[1]) return;
    this.clickDiv.current.click();
  }

  clickDiv = React.createRef();

  // This creates the HTML inside the wrapper div of each square
  createSquareHTML = () => {
    const { clickStatus, rightClicked, rightClickCounter } = this.state;
    const { bomb } = this.props;
    let content;
    let innerDiv;

    // After a click
    if (clickStatus === 'clicked') {
      content = bomb;
      if (bomb === 'B') innerDiv = <div className="burst-8" />;
      else if (typeof bomb === 'number')
        innerDiv = <div className="unselectable" />;
      else innerDiv = <div className="unselectable"> {bomb[0]} </div>;
    }

    // After a right click
    if (rightClicked) {
      if (rightClickCounter % 3 === 0) {
        innerDiv = <div className="unselectable" />;
        // Not sure how else to prevent errors when clicking directly on flag
      } else if (rightClickCounter % 3 === 1) {
        innerDiv = <div className="unselectable flag" />;
      } else {
        innerDiv = <div className="unselectable"> ? </div>;
      }
    }

    // if (typeof bomb === 'object')
    // bomb = bomb[0]
    // TODO: set undefined case to "" for production
    return (
      <div
        className={`square ${clickStatus} ${content}`}
        onClick={this.handleClick}
        onContextMenu={this.handleRightClick}
        ref={this.clickDiv}
        role="presentation"
      >
        {innerDiv === undefined ? '' : innerDiv}
      </div>
    );
  };

  handleClick = () => {
    const { clickStatus } = this.state;
    const {
      bomb,
      column,
      counter,
      playing,
      progressGame,
      row,
      start,
      stop,
    } = this.props;
    let isPlaying = playing;
    if (
      clickStatus === 'clicked' ||
      (playing === false && bomb !== 'B') ||
      counter.length === 1000000
    )
      return;
    if (counter.length === 0) start();
    if (bomb === 'B') {
      isPlaying = false;
      stop();
    }

    this.setState({ clickStatus: 'clicked', rightClicked: false }, () =>
      progressGame(row, column, bomb, isPlaying),
    );
  };

  handleRightClick = (e) => {
    e.preventDefault();
    const { clickStatus, rightClickCounter } = this.state;
    const { playing, board } = this.props;
    if (clickStatus === 'clicked' || playing === false) return;
    this.setState(
      {
        rightClicked: true,
        rightClickCounter: rightClickCounter + 1,
      },
      () => board.forceUpdate(),
    );
  };

  render() {
    return this.createSquareHTML();
  }
}

export default Square2;
