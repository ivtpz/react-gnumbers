import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import TransitionGroup from 'react-addons-css-transition-group';
import image0 from './imgs/0.png';
import image0g from './imgs/0g.png';
import image1 from './imgs/1.png';
import image1g from './imgs/1g.png';
import image2 from './imgs/2.png';
import image2g from './imgs/2g.png';
import image3 from './imgs/3.png';
import image3g from './imgs/3g.png';
import image4 from './imgs/4.png';
import image4g from './imgs/4g.png';
import image5 from './imgs/5.png';
import image5g from './imgs/5g.png';
import image6 from './imgs/6.png';
import image6g from './imgs/6g.png';
import image7 from './imgs/7.png';
import image7g from './imgs/7g.png';
import image8 from './imgs/8.png';
import image8g from './imgs/8g.png';
import image9 from './imgs/9.png';
import image9g from './imgs/9g.png';
import image1n from './imgs/n1.png';
import image1ng from './imgs/n1g.png';
import image2n from './imgs/n2.png';
import image2ng from './imgs/n2g.png';


var imageMap = {
  0: image0,
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
  6: image6,
  7: image7,
  8: image8,
  9: image9,
}

var imageMapG = {
  0: image0g,
  1: image1g,
  2: image2g,
  3: image3g,
  4: image4g,
  5: image5g,
  6: image6g,
  7: image7g,
  8: image8g,
  9: image9g
};

var imageMapN = {
  1: image1n,
  2: image2n
};

var imageMapNG = {
  1: image1ng,
  2: image2ng
}

class Cell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false
    }
  }

  mouseOver() {
    this.setState({
      hover: !this.state.hover
    });
  }


  render() {
    var style = {}
      if (this.props.cell.clicked) {
        style.backgroundColor = 'mediumturquoise'
      } else {
        style.backgroundColor = this.state.hover ? 'darkgray' : 'gray'
      }
    if (this.props.cell.value < 0) {
      var imageDisplay = this.props.success && this.props.cell.clicked ? imageMapNG[Math.abs(this.props.cell.value)] : imageMapN[Math.abs(this.props.cell.value)];
    } else {
      var imageDisplay = this.props.success && this.props.cell.clicked ? imageMapG[this.props.cell.value] : imageMap[this.props.cell.value];
    }

    return (
      <td style={style}
        onClick={() => this.props.cell.clickable ? this.props.setPath(this.props.cell) : null}
        onMouseOver={this.mouseOver.bind(this)}
        onMouseOut={this.mouseOver.bind(this)}>

            <img src={imageDisplay} />

      </td>
    )
  }
}


class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      board: props.board,
      success: props.board.success,
      score: 0
    }
  }

  setPath (cell) {
    this.setState({
      board: this.state.board.setClickOptions(cell.loc),
      success: this.state.board.success
    })
    if (this.state.board.success && this.state.board.checkOptions()) {
      this.state.board.updateScore();
      this.state.board.update();
      this.state.board.reset();
      this.setState({
        board: this.state.board,
        success: this.state.board.success,
        score: this.state.board.score
      })
    }
  }


  render() {
    return (
      <div className="row">
        <div className="col-xs-6">
          <table>
            <tbody>
                {this.state.board.cells.map(row =>
                <tr>
                {row.map(cell =>
                    <Cell cell={cell} board={this.state.board} setPath={this.setPath.bind(this)} success={this.state.success}/>
                )}
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="col-xs-4 score panel ">
          <Score score={this.state.score} />
        </div>
      </div>
    );
  }
}

var Score = (props) => (
  <span>Score: {props.score}</span>
)

export default App;
